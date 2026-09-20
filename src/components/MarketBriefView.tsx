import React, { useState, useEffect } from 'react';
import {
  Newspaper,
  Sparkles,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Clock,
  ExternalLink,
  Filter,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Eye,
  Compass,
  ArrowRight,
  ShieldCheck,
  Truck,
  Landmark,
  Scale,
} from 'lucide-react';
import { MarketBriefData, NewsItem, NewsCategory, NewsDigestData } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

const DEFAULT_DIGEST_EN: NewsDigestData = {
  digestHeadline: 'Real-Time Global Coffee Intelligence & Export Digest',
  digestSummary: 'Synthesis of live terminal futures (ICE NY Arabica & London Robusta), real origin weather anomalies in Brazil and Ethiopia, and active ocean shipping schedules.',
  localExporterImpact: 'Physical differentials for Ethiopian washed coffees remain well supported. Exporters are advised to manage container dwell times at Djibouti port and monitor currency unification movements.',
  keyActionItems: [
    'Lock in forward differentials on high-grade washed lots (Yirgacheffe & Guji).',
    'Review Djibouti ocean container vessel bookings 3 weeks in advance.',
    'Align EUDR GPS polygon validation for EU-bound shipments.',
  ],
  generatedAt: 'Live Intel Stream',
};

const DEFAULT_DIGEST_AM: NewsDigestData = {
  digestHeadline: 'የቀጥታ ዓለም አቀፍ የቡና ገበያ መረጃ እና የላኪዎች ትንተና',
  digestSummary: 'የኒው ዮርክ እና የለንደን ቦርሳዎች የቀጥታ የዋጋ እንቅስቃሴ፣ የሚናስ ጌራይስ የአየር ሁኔታ እና የቀይ ባህር የባህር ጭነት ሁኔታ ውህደት።',
  localExporterImpact: 'የኢትዮጵያ የታጠበ ቡና የኤፍኦቢ ልዩነት ዋጋ በጥሩ ደረጃ ላይ ይገኛል። ላኪዎች በጅቡቲ ወደብ የኮንቴነር መዘግየትን እና የብር ምንዛሪ ለውጥን ግምት ውስጥ ማስገባት አለባቸው።',
  keyActionItems: [
    'ለከፍተኛ ጥራት የታጠበ ቡና (ይርጋጨፌ እና ጉጂ) የቅድሚያ ውሎችን ያስሩ።',
    'የጅቡቲ ወደብ የኮንቴነር ቦታ ማስያዣዎችን 3 ሳምንት አስቀድመው ያረጋግጡ።',
    'የአውሮፓ ህብረት EUDR የጂኦ-ፖሊጎን ምዝገባ ሰነዶችን ያጠናቁ።',
  ],
  generatedAt: 'የቀጥታ መረጃ',
};

interface MarketBriefViewProps {
  brief: MarketBriefData;
  news: NewsItem[];
  newsDigest?: NewsDigestData;
  onRegenerateBrief: () => void;
  isRegenerating: boolean;
}

export const MarketBriefView: React.FC<MarketBriefViewProps> = ({
  brief,
  news,
  newsDigest: propNewsDigest,
  onRegenerateBrief,
  isRegenerating,
}) => {
  const { language, t } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('ALL');

  // AI News Digest state
  const defaultDigest = language === 'am' ? DEFAULT_DIGEST_AM : DEFAULT_DIGEST_EN;
  const [activeDigest, setActiveDigest] = useState<NewsDigestData>(propNewsDigest || defaultDigest);
  const [isGeneratingDigest, setIsGeneratingDigest] = useState<boolean>(false);

  // Per-news item AI deep dive state
  const [summarizingNewsId, setSummarizingNewsId] = useState<string | null>(null);
  const [customTakeaways, setCustomTakeaways] = useState<Record<string, string>>({});

  // Sync digest when language or prop changes
  useEffect(() => {
    if (propNewsDigest) {
      setActiveDigest(propNewsDigest);
    } else {
      setActiveDigest(language === 'am' ? DEFAULT_DIGEST_AM : DEFAULT_DIGEST_EN);
    }
  }, [language, propNewsDigest]);

  // Handler to generate fresh AI News Digest via Gemini API
  const handleGenerateNewsDigest = async () => {
    setIsGeneratingDigest(true);
    try {
      const res = await fetch('/api/ai/news-digest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          language,
          category: selectedCategory,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.digest) {
          setActiveDigest(data.digest);
        }
      }
    } catch (e) {
      console.warn('News digest fallback:', e);
    } finally {
      setIsGeneratingDigest(false);
    }
  };

  // Handler to summarize a single news story with Gemini
  const handleSummarizeStory = async (item: NewsItem) => {
    setSummarizingNewsId(item.id);
    try {
      const res = await fetch('/api/ai/summarize-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: item.title,
          summary: item.summary,
          category: item.category,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.exporterTakeaway) {
          setCustomTakeaways((prev) => ({
            ...prev,
            [item.id]: data.exporterTakeaway,
          }));
        }
      }
    } catch (e) {
      console.warn('Single story summarizer error', e);
    } finally {
      setSummarizingNewsId(null);
    }
  };

  const categories: NewsCategory[] = [
    'Weather',
    'Geopolitics/Trade Policy',
    'Currency/Macro',
    'Logistics/Shipping',
    'Crop/Harvest',
    'Demand/Consumption',
    'Regulation (EUDR, tariffs)',
  ];

  const translateCategory = (cat: string) => {
    if (language === 'en') return cat;
    switch (cat) {
      case 'Weather': return 'የአየር ሁኔታ (Weather)';
      case 'Geopolitics/Trade Policy': return 'ጂኦፖለቲካ እና ንግድ ፖሊሲ';
      case 'Currency/Macro': return 'የውጭ ምንዛሪ እና ማክሮ ኢኮኖሚ';
      case 'Logistics/Shipping': return 'ሎጂስቲክስ እና የባህር ጭነት';
      case 'Crop/Harvest': return 'የቡና ምርት እና መኸር';
      case 'Demand/Consumption': return 'የገበያ ፍላጎት እና ፍጆታ';
      case 'Regulation (EUDR, tariffs)': return 'ደንብ እና ታሪፍ (EUDR)';
      default: return cat;
    }
  };

  const filteredNews = news.filter((item) => {
    const matchCat = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchSent = selectedSentiment === 'ALL' || item.sentiment === selectedSentiment;
    return matchCat && matchSent;
  });

  return (
    <div className="space-y-6">
      {/* "The Brief" Executive AI Summary Card */}
      <div className="rounded-xl border border-amber-800/40 bg-gradient-to-br from-stone-900 via-stone-900/90 to-amber-950/20 p-5 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-stone-100">
                  {language === 'am' ? 'ዕለታዊ የ AI የቡና ገበያ ማጠቃለያ (The Brief)' : 'The Brief — Coffee Market Intelligence Digest'}
                </h3>
                <span className="rounded bg-amber-950 px-2 py-0.5 text-xs font-semibold text-amber-300 border border-amber-800">
                  {language === 'am' ? 'የ 5-ደቂቃ ንባብ' : '5-Min Read'}
                </span>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <Clock className="h-3.5 w-3.5" />
                <span>{brief.generatedDate}</span>
                <span>•</span>
                <span className="text-amber-400">
                  {language === 'am' ? 'በጄሚኒ 3.8 ፍላሽ AI የተጠናቀረ' : 'Synthesized by Gemini 3.8 Flash'}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onRegenerateBrief}
            disabled={isRegenerating}
            className="flex items-center gap-1.5 rounded-lg border border-amber-600/50 bg-amber-950/50 px-3 py-1.5 text-xs font-bold text-amber-300 hover:bg-amber-600 hover:text-stone-950 transition-all disabled:opacity-50 cursor-pointer"
            title="Scan latest commodities feeds, weather radars & regulatory gazettes"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
            <span>{isRegenerating ? t.briefRegenerating : t.briefRegenerateBtn}</span>
          </button>
        </div>

        {/* Lead Headline & Executive Summary */}
        <div className="mt-4">
          <h4 className="text-base font-bold text-amber-200 sm:text-lg">
            "{brief.headline}"
          </h4>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {brief.executiveSummary}
          </p>
        </div>

        {/* Top Movers This Week (4 Headline Stories) */}
        <div className="mt-5">
          <h5 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3 flex items-center gap-1.5">
            <Compass className="h-3.5 w-3.5 text-amber-400" />
            <span>{t.briefTopMovers}</span>
          </h5>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {brief.topMovers.map((mover, i) => (
              <div
                key={i}
                className="rounded-lg border border-stone-800 bg-stone-950/70 p-3 text-xs flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-bold text-stone-100">{mover.headline}</span>
                    <span className="rounded bg-amber-950/80 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-amber-300 border border-amber-800/60 shrink-0">
                      {mover.impact}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-400 leading-snug">
                    {mover.description}
                  </p>
                </div>
                <div className="mt-2 text-[10px] text-stone-400 font-mono border-t border-stone-800/60 pt-1.5">
                  {t.briefSource}: {mover.source}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bullish vs Bearish Structured Breakdown (Pros/Cons by Exchange) */}
        <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Bullish Drivers */}
          <div className="rounded-xl border border-emerald-900/40 bg-emerald-950/10 p-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-2.5">
              <TrendingUp className="h-4 w-4" />
              <span>{t.briefBullishForces}</span>
            </div>
            <div className="space-y-2.5">
              {brief.bullishFactors.map((item, idx) => (
                <div key={idx} className="rounded-lg bg-stone-950/60 p-2.5 border border-emerald-900/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-100">{item.title}</span>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded">
                      {item.exchange}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-stone-300 leading-snug">
                    {item.evidence}
                  </p>
                  <div className="mt-1 text-[10px] text-stone-400 font-mono">
                    {t.briefSource}: {item.source}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bearish Drivers */}
          <div className="rounded-xl border border-rose-900/40 bg-rose-950/10 p-4">
            <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider mb-2.5">
              <TrendingDown className="h-4 w-4" />
              <span>{t.briefBearishForces}</span>
            </div>
            <div className="space-y-2.5">
              {brief.bearishFactors.map((item, idx) => (
                <div key={idx} className="rounded-lg bg-stone-950/60 p-2.5 border border-rose-900/30 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-stone-100">{item.title}</span>
                    <span className="text-[10px] font-mono text-rose-400 bg-rose-950/80 px-1.5 py-0.5 rounded">
                      {item.exchange}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-stone-300 leading-snug">
                    {item.evidence}
                  </p>
                  <div className="mt-1 text-[10px] text-stone-400 font-mono">
                    {t.briefSource}: {item.source}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Watch List (Upcoming Market Triggers) */}
        <div className="mt-5 rounded-lg border border-stone-800 bg-stone-950/90 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">
            <Calendar className="h-3.5 w-3.5" />
            <span>{t.briefCatalystCalendar}</span>
          </div>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3 text-xs">
            {brief.watchList.map((watch, idx) => (
              <div key={idx} className="rounded border border-stone-800/80 bg-stone-900/60 p-2.5">
                <div className="flex items-center justify-between text-stone-300 font-medium">
                  <span>{watch.event}</span>
                  <span className="font-mono text-[10px] text-amber-400 font-bold">
                    {watch.date}
                  </span>
                </div>
                <p className="mt-1 text-[11px] text-stone-400 leading-snug">
                  {watch.expectedMarketEffect}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* AI News Digest Pipeline (Tailored & Culturally Grounded for Local Exporters) */}
      <div className="rounded-xl border border-amber-600/30 bg-gradient-to-br from-stone-900 via-stone-900/95 to-amber-950/30 p-5 shadow-xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800/90 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shadow-inner">
              <Newspaper className="h-5 w-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-lg font-bold text-stone-100">
                  {language === 'am'
                    ? 'የ AI ዜና ማጠቃለያ እና የላኪዎች ትንተና'
                    : 'AI News Digest & Exporter Intelligence Pipeline'}
                </h3>
                <span className="rounded-full bg-amber-500/20 px-2.5 py-0.5 text-xs font-bold text-amber-300 border border-amber-500/30">
                  {language === 'am' ? 'ለአገር ውስጥ ላኪዎች የተተነተነ (Amharic Digest)' : 'Institutional Exporter Focus'}
                </span>
              </div>
              <p className="text-xs text-stone-400 mt-0.5">
                {activeDigest.generatedAt} • {activeDigest.source}
              </p>
            </div>
          </div>

          <button
            onClick={handleGenerateNewsDigest}
            disabled={isGeneratingDigest}
            className="flex items-center gap-2 rounded-lg border border-amber-500/60 bg-amber-500/10 px-3.5 py-2 text-xs font-bold text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition-all disabled:opacity-50 cursor-pointer shadow-sm"
          >
            <Sparkles className={`h-4 w-4 ${isGeneratingDigest ? 'animate-spin text-amber-200' : 'text-amber-400'}`} />
            <span>
              {isGeneratingDigest
                ? (language === 'am' ? 'በጄሚኒ በመተንተን ላይ...' : 'Synthesizing with Gemini...')
                : (language === 'am' ? 'በ AI አዲስ ማጠቃለያ አዘጋጅ' : 'Regenerate AI News Digest')}
            </span>
          </button>
        </div>

        {/* Digest Headline & Summary */}
        <div className="mt-4 rounded-lg bg-stone-950/70 p-4 border border-stone-800">
          <h4 className="text-base font-bold text-amber-300 leading-snug">
            "{activeDigest.digestHeadline}"
          </h4>
          <p className="mt-2 text-xs sm:text-sm text-stone-300 leading-relaxed">
            {activeDigest.digestSummary}
          </p>
        </div>

        {/* Culturally Grounded Local Exporter Impact Block */}
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-gradient-to-r from-amber-950/30 via-stone-950 to-stone-900 p-4.5 shadow-md">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-800/40 pb-2.5">
            <div className="flex items-center gap-2">
              <Landmark className="h-4 w-4 text-amber-400" />
              <h5 className="text-xs uppercase tracking-wider font-bold text-amber-300">
                {language === 'am'
                  ? 'ለአገር ውስጥ ላኪዎች እና ለህብረት ስራ ማህበራት ቀጥተኛ ተፅዕኖ'
                  : 'Direct Strategic Impact on Ethiopian Exporters & Washing Stations'}
              </h5>
            </div>
            <div className="flex items-center gap-1 text-[10px] text-amber-400/90 font-mono">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
              <span>{language === 'am' ? 'ECX • NBE • ECTA • ጅቡቲ' : 'ECX • NBE Forex • ECTA • Djibouti'}</span>
            </div>
          </div>

          <p className="mt-3 text-xs sm:text-sm text-stone-200 leading-relaxed font-normal">
            {activeDigest.localExporterImpact}
          </p>

          {/* Quick Cultural Pillar Badges */}
          <div className="mt-3.5 grid grid-cols-2 gap-2 sm:grid-cols-4 text-[11px]">
            <div className="rounded border border-stone-800 bg-stone-950/80 px-2.5 py-1.5 text-stone-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
              <span className="font-semibold">{language === 'am' ? 'ዋሺንግ ስቴሽኖች' : 'Washing Stations'}</span>
            </div>
            <div className="rounded border border-stone-800 bg-stone-950/80 px-2.5 py-1.5 text-stone-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-400"></span>
              <span className="font-semibold">{language === 'am' ? 'የኢትዮጵያ ምርት ገበያ (ECX)' : 'ECX Auction Parity'}</span>
            </div>
            <div className="rounded border border-stone-800 bg-stone-950/80 px-2.5 py-1.5 text-stone-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-cyan-400"></span>
              <span className="font-semibold">{language === 'am' ? 'የውጭ ምንዛሪ ማቆያ (NBE)' : 'NBE FX Retention'}</span>
            </div>
            <div className="rounded border border-stone-800 bg-stone-950/80 px-2.5 py-1.5 text-stone-300 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
              <span className="font-semibold">{language === 'am' ? 'የጅቡቲ ወደብ እና ኬፕ' : 'Djibouti & Cape Freight'}</span>
            </div>
          </div>
        </div>

        {/* Actionable Recommendations Checklist */}
        <div className="mt-4 rounded-lg bg-stone-950/80 border border-stone-800/80 p-3.5">
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider mb-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-400" />
            <span>{language === 'am' ? 'የላኪዎች ቅድሚያ የሚሰጣቸው ተግባራዊ እርምጃዎች' : 'Priority Exporter Tactical Action Items'}</span>
          </div>
          <div className="space-y-2">
            {activeDigest.keyActionItems.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2.5 text-xs text-stone-300">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-[10px] font-bold text-amber-300 border border-amber-500/30">
                  {idx + 1}
                </span>
                <span className="leading-snug">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Categorized Feed Pipeline (Trade Wires, Weather, Logistics) */}
      <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-stone-800 pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Newspaper className="h-5 w-5 text-amber-500" />
              <h3 className="text-base font-bold text-stone-100 sm:text-lg">
                {language === 'am' ? 'የቀጥታ የዜና፣ የአየር ሁኔታ እና የቁጥጥር መረጃዎች' : 'Automated News, Weather & Regulatory Feed'}
              </h3>
            </div>
            <p className="text-xs text-stone-400 mt-0.5">
              {language === 'am'
                ? 'ከበርካታ ምንጮች የተሰበሰቡና በተፅዕኖ ደረጃ የተመደቡ የቡና ዜናዎች'
                : 'Multi-source ingestion classified by impact magnitude and exchange relevance'}
            </p>
          </div>

          {/* Category & Sentiment Filter Bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-stone-300 focus:border-amber-500 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">
                {language === 'am' ? `ሁሉም ዘርፎች (${news.length})` : `All Categories (${news.length})`}
              </option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {translateCategory(c)}
                </option>
              ))}
            </select>

            <select
              value={selectedSentiment}
              onChange={(e) => setSelectedSentiment(e.target.value)}
              className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-stone-300 focus:border-amber-500 focus:outline-hidden cursor-pointer"
            >
              <option value="ALL">{language === 'am' ? 'ሁሉም ስሜቶች' : 'All Sentiments'}</option>
              <option value="Bullish">{language === 'am' ? 'አዎንታዊ (Bullish)' : 'Bullish'}</option>
              <option value="Bearish">{language === 'am' ? 'አሉታዊ (Bearish)' : 'Bearish'}</option>
              <option value="Neutral">{language === 'am' ? 'ገለልተኛ (Neutral)' : 'Neutral'}</option>
            </select>
          </div>
        </div>

        {/* News Items Grid */}
        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
          {filteredNews.map((item) => {
            const currentTakeaway = customTakeaways[item.id] || item.exporterTakeaway;
            const isSummarizingThis = summarizingNewsId === item.id;

            return (
              <div
                key={item.id}
                className="rounded-lg border border-stone-800 bg-stone-950/70 p-3.5 transition-all hover:border-stone-700 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="rounded bg-stone-800 px-2 py-0.5 text-[10px] font-medium text-stone-300">
                      {translateCategory(item.category)}
                    </span>
                    <span
                      className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                        item.sentiment === 'Bullish'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : item.sentiment === 'Bearish'
                          ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                          : 'bg-stone-800 text-stone-400'
                      }`}
                    >
                      {item.sentiment === 'Bullish' && language === 'am' ? 'አዎንታዊ' :
                       item.sentiment === 'Bearish' && language === 'am' ? 'አሉታዊ' :
                       item.sentiment === 'Neutral' && language === 'am' ? 'ገለልተኛ' : item.sentiment}
                    </span>
                  </div>

                  <h4 className="mt-2 text-sm font-bold text-stone-100 leading-snug">
                    {item.title}
                  </h4>
                  <p className="mt-1.5 text-xs text-stone-300 leading-relaxed">
                    {item.summary}
                  </p>

                  {/* Exporter Commercial Takeaway Callout */}
                  {currentTakeaway && (
                    <div className="mt-3 rounded-lg border border-amber-800/40 bg-amber-950/20 p-2.5 text-xs">
                      <div className="flex items-center gap-1.5 font-bold text-amber-300 text-[11px] mb-1">
                        <Sparkles className="h-3 w-3 text-amber-400" />
                        <span>{language === 'am' ? 'ለኢትዮጵያ ላኪዎች ያለው ፋይዳ' : 'Exporter Commercial Takeaway'}</span>
                      </div>
                      <p className="text-[11px] text-stone-200 leading-relaxed">
                        {currentTakeaway}
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-3.5 border-t border-stone-800/80 pt-2 flex flex-col gap-2">
                  <div className="flex items-center justify-between text-[11px] text-stone-400 font-mono">
                    <span>{item.source} • {item.publishedAt}</span>
                    <span className="text-amber-400">
                      {language === 'am' ? 'ተፅዕኖ:' : 'Impact:'} {item.impactMagnitude}
                    </span>
                  </div>

                  {/* Gemini Single Story Summarize Action */}
                  <div className="flex justify-end pt-1">
                    <button
                      onClick={() => handleSummarizeStory(item)}
                      disabled={isSummarizingThis}
                      className="flex items-center gap-1 text-[11px] font-semibold text-amber-400 hover:text-amber-300 transition-colors disabled:opacity-50 cursor-pointer"
                    >
                      <Sparkles className={`h-3 w-3 ${isSummarizingThis ? 'animate-spin' : ''}`} />
                      <span>
                        {isSummarizingThis
                          ? (language === 'am' ? 'በመተንተን ላይ...' : 'Analyzing with Gemini...')
                          : (language === 'am' ? 'በ AI አጠቃልል (Amharic Summary)' : 'Deep-Dive with Gemini')}
                      </span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
