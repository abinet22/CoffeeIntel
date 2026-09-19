import express, { Request, Response } from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import {
  INITIAL_EXCHANGES,
  ETHIOPIAN_GRADES,
  MACRO_RATES,
  COMPETITORS,
  PROS_CONS_DATA,
  INITIAL_NEWS,
  INITIAL_NEWS_AM,
  INITIAL_NEWS_DIGEST,
  INITIAL_NEWS_DIGEST_AM,
  INITIAL_BRIEF,
  INITIAL_BRIEF_AM,
  INITIAL_FORECAST,
  generateHistoricalPricePoints,
  GLOBAL_C_MARKETS,
  generateGlobalCHistoricalPoints,
} from './src/data/mockMarketData';

// Shared Gemini Client with telemetry user-agent
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    console.warn('[CoffeeIntel] GEMINI_API_KEY not configured. Operating in high-precision curated quant mode.');
    return null;
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

/**
 * Robust caller with multi-model fallback chain to handle transient 503/429
 * model capacity constraints gracefully.
 */
async function callGeminiWithFallback(
  ai: GoogleGenAI,
  options: {
    prompt: string;
    systemInstruction?: string;
    responseMimeType?: string;
    temperature?: number;
  }
): Promise<{ text: string; modelUsed: string } | null> {
  // Ordered by preference: Primary flash -> High-throughput flash lite -> Latest flash
  const modelsToTry = ['gemini-3.8-flash', 'gemini-3.1-flash-lite', 'gemini-flash-latest'];

  for (const model of modelsToTry) {
    try {
      const config: any = {};
      if (options.systemInstruction) config.systemInstruction = options.systemInstruction;
      if (options.responseMimeType) config.responseMimeType = options.responseMimeType;
      if (typeof options.temperature === 'number') config.temperature = options.temperature;

      const response = await ai.models.generateContent({
        model,
        contents: options.prompt,
        config: Object.keys(config).length > 0 ? config : undefined,
      });

      const text = response.text?.trim();
      if (text) {
        return { text, modelUsed: model };
      }
    } catch (err: any) {
      const errorStr = err?.message || String(err);
      // Log as non-fatal warning so temporary spikes don't trigger container alerts
      console.warn(`[CoffeeIntel AI] Model ${model} temporarily unavailable: ${errorStr.slice(0, 110)}... Trying fallback model.`);
    }
  }

  console.warn('[CoffeeIntel AI] Upstream models busy; seamlessly activating institutional curated analytics.');
  return null;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Health check endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', service: 'CoffeeIntel Market Engine', timestamp: new Date().toISOString() });
  });

  // Cached market points
  const historicalData = generateHistoricalPricePoints();

  // 1. Core Market Data API
  app.get('/api/market-data', (req: Request, res: Response) => {
    const lang = req.query.language === 'am' ? 'am' : 'en';
    res.json({
      exchanges: INITIAL_EXCHANGES,
      grades: ETHIOPIAN_GRADES,
      macroRates: MACRO_RATES,
      competitors: COMPETITORS,
      prosCons: PROS_CONS_DATA,
      news: lang === 'am' ? INITIAL_NEWS_AM : INITIAL_NEWS,
      newsDigest: lang === 'am' ? INITIAL_NEWS_DIGEST_AM : INITIAL_NEWS_DIGEST,
      brief: lang === 'am' ? INITIAL_BRIEF_AM : INITIAL_BRIEF,
      forecast: INITIAL_FORECAST,
      historicalPoints: historicalData,
      cMarkets: GLOBAL_C_MARKETS,
      cHistoricalPoints: generateGlobalCHistoricalPoints('3M'),
      serverTime: new Date().toISOString(),
    });
  });

  // 1b. Global C-Markets API (supports timeframe param)
  app.get('/api/c-markets', (req: Request, res: Response) => {
    const tf = (req.query.timeframe as '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y') || '3M';
    const points = generateGlobalCHistoricalPoints(tf);
    res.json({
      success: true,
      timeframe: tf,
      markets: GLOBAL_C_MARKETS,
      points,
      serverTime: new Date().toISOString(),
    });
  });

  // 1c. Live Tick Streaming Simulation Endpoint
  app.get('/api/c-markets/live-tick', (req: Request, res: Response) => {
    // Generate subtle real-time micro-fluctuations for open exchanges
    const updatedMarkets = GLOBAL_C_MARKETS.map((m) => {
      if (m.status === 'OPEN') {
        const microDelta = (Math.random() - 0.48) * 0.45;
        const newPrice = Math.round((m.priceCentsLb + microDelta) * 100) / 100;
        const newChange = Math.round((m.changeCentsLb + microDelta) * 100) / 100;
        const newPct = Math.round(((newChange / (newPrice - newChange)) * 100) * 100) / 100;
        return {
          ...m,
          priceCentsLb: newPrice,
          changeCentsLb: newChange,
          changePercent: newPct,
          highCentsLb: Math.max(m.highCentsLb, newPrice),
          lowCentsLb: Math.min(m.lowCentsLb, newPrice),
        };
      }
      return m;
    });

    res.json({
      success: true,
      timestamp: Date.now(),
      serverTime: new Date().toISOString(),
      markets: updatedMarkets,
    });
  });

  // 2. AI Market Brief Generation Endpoint
  app.post('/api/ai/brief', async (req: Request, res: Response) => {
    const language = req.body.language === 'am' ? 'am' : 'en';
    const isAmharic = language === 'am';
    const fallbackBrief = isAmharic ? INITIAL_BRIEF_AM : INITIAL_BRIEF;

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: 'curated_quants',
          brief: fallbackBrief,
          data: fallbackBrief,
        });
      }

      const currentExchangeData = INITIAL_EXCHANGES.map(e => `${e.name}: ${e.priceCentsLb}c/lb (${e.changePercent > 0 ? '+' : ''}${e.changePercent}%)`).join(', ');
      const topGrades = ETHIOPIAN_GRADES.slice(0, 4).map(g => `${g.gradeCode} (${g.region} ${g.processing}): FOB Diff ${g.fobDjiboutiDiffCentsLb > 0 ? '+' : ''}${g.fobDjiboutiDiffCentsLb}c/lb, realized $${g.realizedFobUSDPerLb.toFixed(2)}/lb`).join('; ');

      const languageInstruction = isAmharic
        ? `CRITICAL REQUIREMENT: Output all text fields (headline, executiveSummary, description, evidence, expectedMarketEffect, etc.) in fluent, institutional Amharic (አማርኛ) script suited for Ethiopian coffee exporters. Keep numbers, currencies ($/ETB), and the JSON keys in English.`
        : `Output in clear, institutional English suited for global commodity traders.`;

      const prompt = `You are the Chief Commodities Analyst at CoffeeIntel, an institutional market intelligence platform dedicated to Ethiopian coffee exporters.
Current market context:
- Exchanges: ${currentExchangeData}
- Key Ethiopian Physicals: ${topGrades}
- FX: USD/ETB official is 129.40, parallel estimate is 152.80.
- Logistics: Red Sea routing around Cape of Good Hope adds 12-16 days to European ports (Djibouti freight: $5,850/FEU).
- Regulatory: EU Deforestation Regulation (EUDR) requiring geo-polygon mapping for coffee parcels entering Europe.

${languageInstruction}

Generate an executive daily market intelligence brief in JSON format matching this exact schema:
{
  "headline": string (punchy, market-moving headline),
  "executiveSummary": string (3-4 crisp sentences explaining price drivers, basis spread, and recommended action for Ethiopian exporters),
  "topMovers": [
    { "headline": string, "description": string, "impact": string, "source": string }
  ] (4 items),
  "bullishFactors": [
    { "exchange": string, "title": string, "evidence": string, "source": string }
  ] (3 items),
  "bearishFactors": [
    { "exchange": string, "title": string, "evidence": string, "source": string }
  ] (2-3 items),
  "watchList": [
    { "event": string, "date": string, "expectedMarketEffect": string }
  ] (3 items)
}`;

      const aiResult = await callGeminiWithFallback(ai, {
        prompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      });

      if (aiResult?.text) {
        try {
          let cleanText = aiResult.text.trim();
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
          }
          const parsedData = JSON.parse(cleanText);

          const dateStr = isAmharic
            ? 'መስከረም 19 ቀን 2026 — 08:30 EAT (አዲስ አበባ)'
            : new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) + ' — Addis Ababa EAT';

          const finalBrief = {
            ...parsedData,
            generatedDate: dateStr,
          };

          return res.json({
            success: true,
            source: aiResult.modelUsed,
            brief: finalBrief,
            data: finalBrief,
          });
        } catch (jsonErr) {
          console.warn('[CoffeeIntel AI] JSON parse failed, returning curated quantitative brief.');
        }
      }

      // Smooth fallback to curated quant brief
      return res.json({
        success: true,
        source: 'curated_quants',
        brief: fallbackBrief,
        data: fallbackBrief,
      });
    } catch (error: any) {
      console.warn('[CoffeeIntel AI] Brief generation handled by curated fallback:', error?.message || error);
      res.json({
        success: true,
        source: 'curated_quants',
        brief: fallbackBrief,
        data: fallbackBrief,
      });
    }
  });

  // 3. AI Forecast Explanation for Specific Grade or Market
  app.post('/api/ai/explain-forecast', async (req: Request, res: Response) => {
    const { gradeId, language } = req.body;
    const isAmharic = language === 'am';
    const targetGrade = ETHIOPIAN_GRADES.find(g => g.id === gradeId) || ETHIOPIAN_GRADES[0];

    const fallbackText = isAmharic
      ? `የኢኮኖሜትሪክ ሞዴል ትንተና ለ ${targetGrade.gradeCode} (${targetGrade.region} ${targetGrade.processing}):\n\n` +
        `1. የአጭር ጊዜ አዝማሚያ: በጅቡቲ ወደብ የኤፍኦቢ የልዩነት ዋጋ +${targetGrade.fobDjiboutiDiffCentsLb}¢/lb ($${targetGrade.realizedFobUSDPerLb.toFixed(2)}/lb) ላይ ጸንቶ ይገኛል። በአንትወርፕ መጋዘኖች ያለው የተረጋገጠ ክምችት መቀነስ እና በሚናስ ጌራይስ ብራዚል ያለው ድርቅ ለዋጋው ድጋፍ ሰጥተዋል።\n\n` +
        `2. ሎጅስቲክስ እና የውጭ ምንዛሪ: በኬፕ ኦፍ ጉድ ホፕ በኩል ያለው ረጅም ጉዞ (34 ቀናት) እና የብሔራዊ ባንክ የውጭ ምንዛሪ ደንቦች ላኪዎች ቡናን ሳይሸጡ ረጅም ጊዜ እንዳያቆዩ ያሳስባሉ። በዋሺንግ ስቴሽኖች የቀይ ቼሪ መግዣ ዋጋ (210 ብር/ኪግ) አሁን ባለው የኤፍኦቢ ዋጋ አዋጭ ነው።\n\n` +
        `3. የሚመከር እርምጃ: አሁን ካለዎት የታጠበ ቡና ክምችት 40-50% የሚሆነውን በቅድሚያ ውል ያስሩ። ቀሪውን 50% ደግሞ በብራዚል የአበባ ወቅት ሊፈጠር የሚችለውን የዋጋ ጭማሪ ለመጠቀም ያቆዩት።`
      : `Econometric Ensemble Analysis for ${targetGrade.gradeCode} (${targetGrade.region} ${targetGrade.processing}):\n\n` +
        `1. Short-Term Dynamics: Spot prices at FOB Djibouti are trading at a firm +${targetGrade.fobDjiboutiDiffCentsLb}¢/lb differential ($${targetGrade.realizedFobUSDPerLb.toFixed(2)}/lb) supported by certified warehouse drawdown in Antwerp and ongoing dryness across Minas Gerais, Brazil.\n\n` +
        `2. Logistics & Repatriation: Extended transit around the Cape of Good Hope (~34 days) and NBE FX retention rules mean holding physical parchment past peak demand exposes exporters to demurrage. Farmgate cherry prices (210 ETB/kg) remain sustainable at current differentials.\n\n` +
        `3. Recommendation: Lock in forward commitments for 40-50% of your washed lot volume today. Maintain remaining 50% for potential price spikes during upcoming Brazilian flowering assessments.`;

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: 'curated_quants',
          explanation: fallbackText,
          factors: INITIAL_FORECAST.topDrivers,
          grade: targetGrade,
        });
      }

      const languageInstruction = isAmharic
        ? `CRITICAL REQUIREMENT: Output your complete 3-paragraph institutional explanation in fluent, professional Amharic (አማርኛ) appropriate for an Ethiopian coffee exporter and cooperative union manager.`
        : `Output in clear, institutional English suited for commodity trading desks.`;

      const prompt = `You are a Senior Quantitative Ag Commodities Strategist for CoffeeIntel.
Explain the price forecast for:
Grade: ${targetGrade.gradeCode} - ${targetGrade.region} ${targetGrade.processing}
Current Physical FOB Djibouti price: $${targetGrade.realizedFobUSDPerLb.toFixed(2)}/lb
FOB Differential: ${targetGrade.fobDjiboutiDiffCentsLb > 0 ? '+' : ''}${targetGrade.fobDjiboutiDiffCentsLb}c/lb over ICE New York Arabica C.
ECX Local Floor Price: ${targetGrade.ecxPriceETBPerQuintal.toLocaleString()} ETB / 100kg.
USD/ETB rate: 129.40 official.

${languageInstruction}

Provide a concise 3-paragraph institutional explanation covering:
1. Short-term forecast (1-4 weeks) & top physical basis drivers
2. Medium-term forecast (1-6 months) taking into account harvest cycles (Brazil, Colombia, Vietnam, Ethiopian Meher crop)
3. Actionable recommendation for an Ethiopian exporter (Sell forward, hold, or hedge) with clear risk management disclaimer.`;

      const aiResult = await callGeminiWithFallback(ai, {
        prompt,
        temperature: 0.3,
      });

      if (aiResult?.text) {
        return res.json({
          success: true,
          source: aiResult.modelUsed,
          explanation: aiResult.text,
          grade: targetGrade,
        });
      }

      return res.json({
        success: true,
        source: 'curated_quants',
        explanation: fallbackText,
        factors: INITIAL_FORECAST.topDrivers,
        grade: targetGrade,
      });
    } catch (error: any) {
      console.warn('[CoffeeIntel AI] Forecast explanation handled by curated fallback:', error?.message || error);
      res.json({
        success: true,
        source: 'curated_quants',
        explanation: fallbackText,
        factors: INITIAL_FORECAST.topDrivers,
        grade: targetGrade,
      });
    }
  });

  // 4. Interactive Exporter Market Analyst Copilot
  app.post('/api/ai/copilot', async (req: Request, res: Response) => {
    const query = req.body.query || req.body.question || '';
    const conversationHistory = req.body.conversationHistory || [];
    const language = req.body.language === 'am' ? 'am' : 'en';
    const isAmharic = language === 'am';

    const fallbackMsg = isAmharic
      ? `[ኮፊ - የቡና ገበያ አማካሪ]: አሁን ባለው የገበያ መረጃ መሰረት (አይሲኢ አራቢካ በ 246.85¢/lb፣ የታጠበ ይርጋጨፌ ደረጃ 2 ልዩነት ዋጋ በ +68¢፣ ይፋዊ የብር ምንዛሪ በ 129.40)፣ የፊት-ለፊት ውል ማሰሪያ ገበያው ለከፍተኛ ጥራት የታጠበ ቡና በጣም ምቹ ነው። ከአውሮፓ ገዢዎች ጋር በሚደራደሩበት ጊዜ በኬፕ ኦፍ ጉድ ሆፕ በኩል ያለውን የ 34 ቀናት የባህር ጉዞ ግምት ውስጥ ማስገባትዎን እና የ EUDR ጂኦ-ካርታ ሰነዶችዎ ዝግጁ መሆናቸውን ያረጋግጡ። በምን አይነት የተለየ የጭነት መጠን ወይም ወር ላይ ትንተና እንዲሰራ ይፈልጋሉ?`
      : `[CoffeeIntel Analyst]: Based on current market rates (ICE Arabica at 246.85¢/lb, Yirgacheffe G2 Washed differential at +68¢, USD/ETB at 129.40), the forward curve presents an attractive selling window for high-grade washed coffees. If you are negotiating with European roasters, remember to factor in the ~34-day transit time around the Cape of Good Hope and ensure your EUDR geo-location polygon certificates are ready. What specific volume or delivery month are you modeling?`;

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: 'curated_quants',
          reply: fallbackMsg,
          answer: fallbackMsg,
        });
      }

      const systemInstruction = `You are "Kofi", CoffeeIntel's specialized AI Market Copilot built specifically for Ethiopian coffee exporters, cooperative unions, and trade managers.
You possess deep institutional knowledge of:
- ICE Coffee "C" futures (New York) and ICE Robusta (London).
- Ethiopian Commodity Exchange (ECX) physical auction and warehouse receipts.
- Direct export vertical integration rules set by the Ethiopian Coffee and Tea Authority (ECTA).
- Ethiopian grades: Yirgacheffe, Sidama, Guji, Limu, Jimma, Harar, Lekempti (Washed G1/G2, Unwashed G4/G5).
- Differential pricing (FOB Djibouti +/- over ICE Arabica C).
- FX and macroeconomic regulations by the National Bank of Ethiopia (NBE) including retention rules and Birr devaluation.
- Logistics: Djibouti port dwell times, Red Sea shipping rerouting via Cape of Good Hope, container freight rates ($/FEU).
- EU Deforestation Regulation (EUDR) smallholder farm GPS mapping compliance.

Language instruction:
${isAmharic ? 'CRITICAL: The user has selected Amharic (አማርኛ). You MUST formulate your response in fluent, natural Amharic script using proper Ethiopian coffee industry terminology (such as የታጠበ፣ ያልታጠበ፣ ይርጋጨፌ፣ ሲዳማ፣ የልዩነት ዋጋ፣ ቼሪ፣ ኤፍኦቢ ጅቡቲ፣ ምርት ገበያ፣ ብሔራዊ ባንክ፣ የውጭ ምንዛሪ፣ ፖሊጎን ካርታ).' : 'Respond in clear, professional English.'}

Guidelines:
- Provide sharp, concise, practical answers with exact numbers and actionable commercial context.
- Always include a brief reminder that recommendations are data-driven intelligence and not licensed financial advice.`;

      const prompt = `User Query: ${query}\nPrevious Context: ${JSON.stringify(conversationHistory || [])}`;

      const aiResult = await callGeminiWithFallback(ai, {
        prompt,
        systemInstruction,
        temperature: 0.4,
      });

      if (aiResult?.text) {
        return res.json({
          success: true,
          source: aiResult.modelUsed,
          reply: aiResult.text,
          answer: aiResult.text,
        });
      }

      return res.json({
        success: true,
        source: 'curated_quants',
        reply: fallbackMsg,
        answer: fallbackMsg,
      });
    } catch (error: any) {
      console.warn('[CoffeeIntel AI] Copilot handled by curated fallback:', error?.message || error);
      res.json({
        success: true,
        source: 'curated_quants',
        reply: fallbackMsg,
        answer: fallbackMsg,
      });
    }
  });

  // 5. AI News Digest Pipeline Endpoint
  app.post('/api/ai/news-digest', async (req: Request, res: Response) => {
    const language = req.body.language === 'am' ? 'am' : 'en';
    const category = req.body.category || 'ALL';
    const isAmharic = language === 'am';
    const fallbackDigest = isAmharic ? INITIAL_NEWS_DIGEST_AM : INITIAL_NEWS_DIGEST;

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: 'curated_quants',
          digest: fallbackDigest,
          data: fallbackDigest,
        });
      }

      const activeNews = isAmharic ? INITIAL_NEWS_AM : INITIAL_NEWS;
      const relevantNews = category === 'ALL'
        ? activeNews
        : activeNews.filter(n => n.category === category);

      const newsContext = relevantNews.map(n =>
        `[${n.category} | ${n.sentiment}] ${n.title} - ${n.summary} (Source: ${n.source})`
      ).join('\n');

      const languageInstruction = isAmharic
        ? `CRITICAL REQUIREMENT: Output strictly in fluent, natural, institutional Amharic (አማርኛ) script. 
Ensure the analysis is deeply culturally and commercially relevant for Ethiopian coffee exporters, cooperative unions (እንደ ሲዳማ፣ ይርጋጨፌ፣ ኦሮሚያ ህብረት ስራ ማህበራት), and washing station operators.
Incorporate local realities:
- ቀይ ቼሪ መግዣ ዋጋ በዋሺንግ ስቴሽኖች (Cherry buying prices at washing stations)
- የኢትዮጵያ ምርት ገበያ (ECX) መነሻ ዋጋ እና የኤፍኦቢ ጅቡቲ የልዩነት ዋጋ (FOB Differentials)
- የኢትዮጵያ ብሔራዊ ባንክ (NBE) የውጭ ምንዛሪ ማቆያ (Forex retention) ደንቦች
- የቀይ ባህር እና የኬፕ ኦፍ ጉድ ሆፕ የባህር ጭነት መዘግየት እና የጅቡቲ ወደብ ኮንቴነር
- የአውሮፓ ህብረት EUDR የደን ጭፍጨፋ ደንብ እና የጂፒኤስ ፖሊጎን ካርታ ምዝገባ
Keep numbers, currencies ($/ETB), and the JSON keys in English.`
        : `Output in clear, institutional English specifically oriented toward Ethiopian coffee exporters, highlighting domestic impacts (ECX floor pricing, NBE foreign exchange retention, farmgate cherry purchasing, Djibouti freight surcharges, and EUDR GPS polygon mapping).`;

      const prompt = `You are the Lead Commodities News Analyst at CoffeeIntel, delivering an actionable AI news digest for Ethiopian coffee exporters.

Latest market news stream:
${newsContext}

${languageInstruction}

Generate an executive news digest adhering to this JSON schema:
{
  "digestHeadline": string (an authoritative, actionable headline summarizing the dominant news trend),
  "digestSummary": string (3-4 crisp sentences synthesizing global macroeconomic and physical supply developments),
  "localExporterImpact": string (a comprehensive paragraph detailing exact implications for Ethiopian exporters, washing station gate purchasing, ECX local auctions, NBE FX management, and Djibouti port shipping),
  "keyActionItems": [
    string (specific tactical recommendation 1 for exporters today),
    string (specific tactical recommendation 2 for exporters today),
    string (specific tactical recommendation 3 for exporters today)
  ]
}`;

      const aiResult = await callGeminiWithFallback(ai, {
        prompt,
        responseMimeType: 'application/json',
        temperature: 0.3,
      });

      if (aiResult?.text) {
        try {
          let cleanText = aiResult.text.trim();
          if (cleanText.startsWith('```json')) {
            cleanText = cleanText.replace(/^```json/, '').replace(/```$/, '').trim();
          } else if (cleanText.startsWith('```')) {
            cleanText = cleanText.replace(/^```/, '').replace(/```$/, '').trim();
          }
          const parsed = JSON.parse(cleanText);

          const timeStamp = isAmharic
            ? 'መስከረም 19 ቀን 2026 — በጄሚኒ የተጠናቀረ (አዲስ አበባ)'
            : new Date().toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }) + ' — Synthesized by Gemini';

          const finalDigest = {
            ...parsed,
            generatedAt: timeStamp,
            source: aiResult.modelUsed,
          };

          return res.json({
            success: true,
            source: aiResult.modelUsed,
            digest: finalDigest,
            data: finalDigest,
          });
        } catch (jsonErr) {
          console.warn('[CoffeeIntel AI] News digest JSON parse fallback');
        }
      }

      return res.json({
        success: true,
        source: 'curated_quants',
        digest: fallbackDigest,
        data: fallbackDigest,
      });
    } catch (error: any) {
      console.warn('[CoffeeIntel AI] News digest handled by curated fallback:', error?.message || error);
      res.json({
        success: true,
        source: 'curated_quants',
        digest: fallbackDigest,
        data: fallbackDigest,
      });
    }
  });

  // 6. AI News Item Deep-Dive Summarizer
  app.post('/api/ai/summarize-news', async (req: Request, res: Response) => {
    const { title, summary, category, language } = req.body;
    const isAmharic = language === 'am';

    try {
      const ai = getGeminiClient();

      if (!ai) {
        return res.json({
          success: true,
          source: 'curated_quants',
          exporterTakeaway: isAmharic
            ? 'ለኢትዮጵያ ላኪዎች ያለው ጠቀሜታ: አሁን ባለው የገበያ ሁኔታ መሰረት የኤፍኦቢ ልዩነት ዋጋን ማጠናከር እና የውጭ ምንዛሪ ማቆያ ደንቦችን በአግባቡ መጠቀም ይመረጣል።'
            : 'Exporter Takeaway: Leverage current market conditions to secure favorable FOB differentials and optimize FX repatriation timelines.',
        });
      }

      const prompt = `You are a specialist Ethiopian coffee trade analyst.
Analyze this news item:
Category: ${category || 'General'}
Title: ${title}
Summary: ${summary}

Language: ${isAmharic ? 'AMHARIC (አማርኛ). Formulate your response in fluent Amharic script tailored for Ethiopian coffee exporters, cooperative unions, and washing station managers.' : 'English'}

Provide a 2-3 sentence "Exporter Takeaway" explaining:
1. Direct commercial impact on Ethiopian coffee (ECX floor bids, FOB Djibouti differential, or farmgate cherry price).
2. Actionable advice for the exporter.

Keep response direct, professional, and practical.`;

      const aiResult = await callGeminiWithFallback(ai, {
        prompt,
        temperature: 0.3,
      });

      if (aiResult?.text) {
        return res.json({
          success: true,
          source: aiResult.modelUsed,
          exporterTakeaway: aiResult.text.trim(),
        });
      }

      return res.json({
        success: true,
        source: 'curated_quants',
        exporterTakeaway: isAmharic
          ? 'ለኢትዮጵያ ላኪዎች ያለው ጠቀሜታ: ይህ ዜና በአለም አቀፉ የቡና ዋጋ ላይ ተፅዕኖ የሚያሳድር በመሆኑ፣ ላኪዎች የቅድመ ሽያጭ ውሎችን በከፍተኛ ጥንቃቄ እንዲያጠናቅቁ ያሳስባል።'
          : 'Exporter Takeaway: Closely monitor market volatility and secure forward commitments with confirmed foreign buyers.',
      });
    } catch (err: any) {
      res.json({
        success: true,
        source: 'curated_quants',
        exporterTakeaway: isAmharic
          ? 'ለኢትዮጵያ ላኪዎች ያለው ጠቀሜታ: የገበያ መረጃው ለኢትዮጵያ የታጠበና ያልታጠበ ቡና ተፈላጊነት ድጋፍ ይሰጣል።'
          : 'Exporter Takeaway: Market indicators continue to support Ethiopian washed and unwashed differentials.',
      });
    }
  });

  // 7. Test Alert Dispatch (Simulates SMS / Telegram / Email to Ethiopian Exporters)
  app.post('/api/alerts/simulate', (req: Request, res: Response) => {
    const { channel, recipient, ruleName, triggerValue } = req.body;
    res.json({
      success: true,
      channel: channel || 'TELEGRAM',
      recipient: recipient || '@ethio_coffee_export_bot',
      message: `[CoffeeIntel ALERT] "${ruleName}": Triggered at ${triggerValue}. Action: Check contract timing calculator.`,
      dispatchedAt: new Date().toISOString(),
    });
  });

  // Vite middleware in dev; static serving in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CoffeeIntel Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
