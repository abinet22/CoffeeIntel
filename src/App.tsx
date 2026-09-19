import React, { useState, useEffect } from 'react';
import {
  TrendingUp,
  BrainCircuit,
  Newspaper,
  Calculator,
  Globe2,
  Scale,
  Sparkles,
  RefreshCw,
  Layers,
  ArrowRight,
} from 'lucide-react';
import {
  ExchangeQuote,
  EthiopianGradeQuote,
  MarketForecast,
  MarketBriefData,
  HistoricalPricePoint,
  MacroIndicator,
  CompetitorOrigin,
  ExchangeProsCons,
  NewsItem,
  NewsDigestData,
  PriceUnit,
  GlobalCMarket,
} from './types';
import {
  INITIAL_EXCHANGES,
  ETHIOPIAN_GRADES,
  INITIAL_FORECAST,
  INITIAL_BRIEF,
  INITIAL_BRIEF_AM,
  generateHistoricalPricePoints,
  MACRO_RATES,
  COMPETITORS,
  PROS_CONS_DATA,
  INITIAL_NEWS,
  INITIAL_NEWS_AM,
  INITIAL_NEWS_DIGEST,
  INITIAL_NEWS_DIGEST_AM,
  GLOBAL_C_MARKETS,
} from './data/mockMarketData';
import { useLanguage } from './i18n/LanguageContext';
import { Header } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { MultiExchangeDashboard } from './components/MultiExchangeDashboard';
import { LiveCMarketsView } from './components/LiveCMarketsView';
import { ECXGradeBoard } from './components/ECXGradeBoard';
import { PredictionEngine } from './components/PredictionEngine';
import { MarketBriefView } from './components/MarketBriefView';
import { ProsConsCards } from './components/ProsConsCards';
import { ContractCalculator } from './components/ContractCalculator';
import { CurrencyRiskModule } from './components/CurrencyRiskModule';
import { CompetitorOriginView } from './components/CompetitorOriginView';
import { AlertsAndComplianceModal } from './components/AlertsAndComplianceModal';
import { AICopilotModal } from './components/AICopilotModal';
import { PrintableReportModal } from './components/PrintableReportModal';

type NavTab =
  | 'OVERVIEW'
  | 'C_MARKETS'
  | 'PREDICTIONS'
  | 'BRIEF'
  | 'CALCULATOR'
  | 'ORIGINS';

export default function App() {
  const { language, t } = useLanguage();

  // State
  const [activeTab, setActiveTab] = useState<NavTab>('OVERVIEW');
  const [unit, setUnit] = useState<PriceUnit>('cents_lb');
  const [currencyMode, setCurrencyMode] = useState<'USD' | 'ETB'>('USD');
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Data collections
  const [exchanges, setExchanges] = useState<ExchangeQuote[]>(INITIAL_EXCHANGES);
  const [cMarkets, setCMarkets] = useState<GlobalCMarket[]>(GLOBAL_C_MARKETS);
  const [grades, setGrades] = useState<EthiopianGradeQuote[]>(ETHIOPIAN_GRADES);
  const [forecast, setForecast] = useState<MarketForecast>(INITIAL_FORECAST);
  const [brief, setBrief] = useState<MarketBriefData>(INITIAL_BRIEF);
  const [historicalData, setHistoricalData] = useState<HistoricalPricePoint[]>(generateHistoricalPricePoints);
  const [macroRates, setMacroRates] = useState<MacroIndicator[]>(MACRO_RATES);
  const [competitors, setCompetitors] = useState<CompetitorOrigin[]>(COMPETITORS);
  const [prosCons, setProsCons] = useState<Record<string, ExchangeProsCons>>(PROS_CONS_DATA);
  const [news, setNews] = useState<NewsItem[]>(language === 'am' ? INITIAL_NEWS_AM : INITIAL_NEWS);
  const [newsDigest, setNewsDigest] = useState<NewsDigestData>(language === 'am' ? INITIAL_NEWS_DIGEST_AM : INITIAL_NEWS_DIGEST);

  // Selected grade for drill-down
  const [selectedGrade, setSelectedGrade] = useState<EthiopianGradeQuote | null>(ETHIOPIAN_GRADES[1]);

  // AI explanation state
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanationText, setExplanationText] = useState<string | null>(null);

  // AI Brief regeneration state
  const [isRegeneratingBrief, setIsRegeneratingBrief] = useState<boolean>(false);

  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);

  // Fetch live market data on mount or when language changes
  useEffect(() => {
    fetchMarketData(language);
  }, [language]);

  const fetchMarketData = async (currentLang = language) => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`/api/market-data?language=${currentLang}`);
      if (res.ok) {
        const data = await res.json();
        if (data.exchanges) setExchanges(data.exchanges);
        if (data.grades) setGrades(data.grades);
        if (data.forecast) setForecast(data.forecast);
        if (data.brief) setBrief(data.brief);
        if (data.news) setNews(data.news);
        if (data.newsDigest) setNewsDigest(data.newsDigest);
        if (data.macroRates) setMacroRates(data.macroRates);
        if (data.cMarkets) setCMarkets(data.cMarkets);
      }
    } catch (e) {
      console.warn('Using local market state', e);
      if (currentLang === 'am') {
        setNews(INITIAL_NEWS_AM);
        setNewsDigest(INITIAL_NEWS_DIGEST_AM);
        setBrief(INITIAL_BRIEF_AM);
      } else {
        setNews(INITIAL_NEWS);
        setNewsDigest(INITIAL_NEWS_DIGEST);
        setBrief(INITIAL_BRIEF);
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  // Generate AI Explanation for a grade or market forecast
  const handleExplainWithGemini = async (gradeId?: string) => {
    setIsExplaining(true);
    try {
      const res = await fetch('/api/ai/explain-forecast', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gradeId: gradeId || selectedGrade?.id,
          language,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setExplanationText(data.explanation);
      }
    } catch (e) {
      setExplanationText(
        language === 'am'
          ? 'የጄሚኒ ትንተና: ሞዴሉ ለኢትዮጵያ የታጠበ አራቢካ ከፍተኛ የፊዚካል ልዩነት ዋጋዎች እንደሚቀጥሉ ያረጋግጣል። በአውሮፓ መጋዘኖች ያለው የተረጋገጠ ክምችት ከ 850 ሺህ ከረጢት በታች ሲሆን፣ የብራዚል ድርቅ በአራቢካ አበቦች ላይ ጫና ፈጥሯል። የሚመከር እርምጃ: አሁን ባለው የ +68¢ ልዩነት ዋጋ እስከ 40% የቅድሚያ ውል መፈረም፣ ቀሪውን ለወቅቱ ከፍተኛ ዋጋ ማቆየት።'
          : 'Gemini Quantitative Analysis: Model confirms elevated forward physical premiums for Ethiopian Washed Arabica. Certified exchange inventories in Antwerp and Hamburg remain below 850k bags, while Brazil dry weather continues to stress Arabica flowering. Recommended action: Sell forward up to 40% of contracted volume now at +68¢ differential, holding balance for peak seasonal squeeze.'
      );
    } finally {
      setIsExplaining(false);
    }
  };

  // Regenerate Daily Brief with Gemini
  const handleRegenerateBrief = async () => {
    setIsRegeneratingBrief(true);
    try {
      const res = await fetch('/api/ai/brief', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.brief) {
          setBrief(data.brief);
        }
      }
    } catch (e) {
      console.warn('Brief regenerated locally');
    } finally {
      setIsRegeneratingBrief(false);
    }
  };

  const handleSelectGradeFromTable = (grade: EthiopianGradeQuote) => {
    setSelectedGrade(grade);
    handleExplainWithGemini(grade.id);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950 font-sans">
      {/* 1. Global Navigation Header */}
      <Header
        unit={unit}
        onUnitChange={setUnit}
        currencyMode={currencyMode}
        onCurrencyModeChange={setCurrencyMode}
        onOpenCopilot={() => setIsCopilotOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onOpenAlerts={() => setIsAlertsOpen(true)}
        isRefreshing={isRefreshing}
        onRefreshData={fetchMarketData}
      />

      {/* 2. Real-Time Ticker Tape */}
      <TickerBar
        exchanges={exchanges}
        grades={grades}
        macroRates={macroRates}
        onSelectGrade={(g) => {
          setSelectedGrade(g);
          setActiveTab('OVERVIEW');
        }}
      />

      {/* 3. Section Navigation Tabs */}
      <div className="border-b border-stone-800 bg-stone-900/60 px-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center gap-1 overflow-x-auto no-scrollbar py-2 text-xs">
          <button
            id="tab-overview"
            onClick={() => setActiveTab('OVERVIEW')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'OVERVIEW'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <TrendingUp className="h-4 w-4" />
            <span>{t.navOverview}</span>
          </button>

          <button
            id="tab-c-markets"
            onClick={() => setActiveTab('C_MARKETS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'C_MARKETS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Globe2 className="h-4 w-4" />
            <span>{t.navCMarkets}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
          </button>

          <button
            id="tab-predictions"
            onClick={() => setActiveTab('PREDICTIONS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'PREDICTIONS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <BrainCircuit className="h-4 w-4" />
            <span>{t.navPredictions}</span>
          </button>

          <button
            id="tab-brief"
            onClick={() => setActiveTab('BRIEF')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'BRIEF'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Newspaper className="h-4 w-4" />
            <span>{t.navBrief}</span>
          </button>

          <button
            id="tab-calculator"
            onClick={() => setActiveTab('CALCULATOR')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'CALCULATOR'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Calculator className="h-4 w-4" />
            <span>{t.navCalculator}</span>
          </button>

          <button
            id="tab-origins"
            onClick={() => setActiveTab('ORIGINS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'ORIGINS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Globe2 className="h-4 w-4" />
            <span>{t.navOrigins}</span>
          </button>
        </div>
      </div>

      {/* 4. Main Body Content */}
      <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 space-y-6">
        {/* Tab 1: Overview & Price Feeds */}
        {activeTab === 'OVERVIEW' && (
          <div className="space-y-6">
            <MultiExchangeDashboard
              exchanges={exchanges}
              historicalPoints={historicalData}
              unit={unit}
              currencyMode={currencyMode}
              selectedGrade={selectedGrade}
              onSelectGrade={setSelectedGrade}
            />

            <ECXGradeBoard
              grades={grades}
              unit={unit}
              currencyMode={currencyMode}
              onAnalyzeGrade={handleSelectGradeFromTable}
              selectedGradeId={selectedGrade?.id}
            />

            <ProsConsCards prosCons={prosCons} />
          </div>
        )}

        {/* Tab 1b: Global C-Markets Live Chart & Terminal */}
        {activeTab === 'C_MARKETS' && (
          <div className="space-y-6">
            <LiveCMarketsView
              markets={cMarkets}
              unit={unit}
              currencyMode={currencyMode}
              onRefresh={() => fetchMarketData(language)}
            />
          </div>
        )}

        {/* Tab 2: AI Price Prediction Engine & Explainability */}
        {activeTab === 'PREDICTIONS' && (
          <div className="space-y-6">
            <PredictionEngine
              forecast={forecast}
              selectedGrade={selectedGrade}
              onExplainWithGemini={handleExplainWithGemini}
              isExplaining={isExplaining}
              explanationText={explanationText}
            />

            <ProsConsCards prosCons={prosCons} />
          </div>
        )}

        {/* Tab 3: AI Daily Digest & Feed Pipeline */}
        {activeTab === 'BRIEF' && (
          <div className="space-y-6">
            <MarketBriefView
              brief={brief}
              news={news}
              newsDigest={newsDigest}
              onRegenerateBrief={handleRegenerateBrief}
              isRegenerating={isRegeneratingBrief}
            />
          </div>
        )}

        {/* Tab 4: Exporter Decision Tools (Contract Calculator & Currency Risk) */}
        {activeTab === 'CALCULATOR' && (
          <div className="space-y-6">
            <ContractCalculator grades={grades} />
            <CurrencyRiskModule macroRates={macroRates} />
          </div>
        )}

        {/* Tab 5: Competitor Origin Benchmarks */}
        {activeTab === 'ORIGINS' && (
          <div className="space-y-6">
            <CompetitorOriginView competitors={competitors} />
          </div>
        )}
      </main>

      {/* 5. Footer */}
      <footer className="mt-12 border-t border-stone-800 bg-stone-950 py-6 px-4 text-xs text-stone-400">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-stone-300">CoffeeIntel</span>
            <span>•</span>
            <span>
              {language === 'am'
                ? 'ለኢትዮጵያ የቡና ላኪዎች የተዘጋጀ የገበያ መረጃ እና የትንበያ ስርዓት'
                : 'Market Intelligence System for Ethiopian Exporters'}
            </span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>ICE Futures (NY/LDN)</span>
            <span>ECX Addis Floor</span>
            <span>Gemini 3.8 Flash Engine</span>
          </div>
        </div>
      </footer>

      {/* 6. Modals */}
      <AICopilotModal
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
      />

      <PrintableReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        exchanges={exchanges}
        grades={grades}
        forecast={forecast}
        brief={brief}
      />

      <AlertsAndComplianceModal
        isOpen={isAlertsOpen}
        onClose={() => setIsAlertsOpen(false)}
      />
    </div>
  );
}
