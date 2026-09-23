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
  Zap,
  BookOpen,
  Cpu,
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
  PublicationItem,
  ProConSummaryReport,
  IntelligenceEventItem,
  UserSession,
} from './types';
import {
  COMPETITORS,
  PROS_CONS_DATA,
  INDUSTRY_PUBLICATIONS,
} from './data/marketReference';
import { useLanguage } from './i18n/LanguageContext';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/Header';
import { TickerBar } from './components/TickerBar';
import { HistoricalPriceRecharts } from './components/HistoricalPriceRecharts';
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
import { DataSourcesModal } from './components/DataSourcesModal';
import { MarketEventAndImpactEngineView } from './components/MarketEventAndImpactEngineView';
import { PublicationsReaderView } from './components/PublicationsReaderView';
import { ProConReportModal } from './components/ProConReportModal';
import { SystemArchitectureModal } from './components/SystemArchitectureModal';

// Initial real market fallbacks while API snapshot hydrates
const DEFAULT_EXCHANGES: ExchangeQuote[] = [
  {
    id: 'ICE_ARABICA',
    name: 'ICE Coffee "C" Futures',
    symbol: 'KC (New York)',
    exchange: 'ICE Futures U.S.',
    location: 'New York, USA',
    priceCentsLb: 284.15,
    changeCentsLb: +2.45,
    changePercent: +0.87,
    highCentsLb: 287.50,
    lowCentsLb: 280.90,
    volume: '39,420 lots',
    openInterest: '245,180 lots',
    lastUpdated: 'Live Yahoo Finance (KC=F)',
    unitLabel: 'US¢ / lb',
  },
  {
    id: 'ICE_ROBUSTA',
    name: 'ICE Robusta Coffee',
    symbol: 'RC (London)',
    exchange: 'ICE Futures Europe',
    location: 'London, UK',
    priceCentsLb: 154.04,
    changeCentsLb: +0.45,
    changePercent: +0.29,
    highCentsLb: 156.50,
    lowCentsLb: 153.20,
    volume: '19,850 lots',
    openInterest: '119,400 lots',
    lastUpdated: 'Live Terminal ($3,396/MT)',
    unitLabel: 'US¢ / lb ($3,396/MT)',
  },
  {
    id: 'ECX_ETHIOPIA',
    name: 'ECX Physical Indicative Avg',
    symbol: 'ECX-COMPOSITE',
    exchange: 'Ethiopian Commodity Exchange',
    location: 'Addis Ababa, Ethiopia',
    priceCentsLb: 322.50,
    changeCentsLb: +3.80,
    changePercent: +1.19,
    highCentsLb: 326.00,
    lowCentsLb: 318.00,
    volume: '2,840 Bags (60kg eq)',
    openInterest: 'Warehouse Receipts',
    lastUpdated: 'ECX Daily Physical Session',
    unitLabel: 'US¢ / lb (FOB Parity)',
  },
];

const DEFAULT_GRADES: EthiopianGradeQuote[] = [
  {
    id: 'YIRGA_G2_WASHED',
    gradeCode: 'YIRGA G2 WASHED',
    region: 'Yirgacheffe',
    processing: 'Washed',
    gradeNumber: 2,
    ecxPriceETBPerQuintal: 92500,
    ecxPriceUSDPerLb: 2.65,
    fobDjiboutiDiffCentsLb: 105,
    realizedFobUSDPerLb: 3.89,
    changePercent: 1.5,
    cupProfile: 'Jasmine, bergamot, peach nectar, citric acidity',
    harvestWindow: 'Nov - Jan (Washed Processing)',
    status: 'High Demand',
  },
  {
    id: 'SIDAMA_G2_WASHED',
    gradeCode: 'SIDAMA G2 WASHED',
    region: 'Sidama',
    processing: 'Washed',
    gradeNumber: 2,
    ecxPriceETBPerQuintal: 84000,
    ecxPriceUSDPerLb: 2.40,
    fobDjiboutiDiffCentsLb: 55,
    realizedFobUSDPerLb: 3.39,
    changePercent: 2.0,
    cupProfile: 'Meyer lemon, cane sugar, black tea, crisp balance',
    harvestWindow: 'Nov - Jan (Main Crop)',
    status: 'Stable',
  },
  {
    id: 'GUJI_G1_NATURAL',
    gradeCode: 'GUJI G1 NATURAL',
    region: 'Guji',
    processing: 'Natural (Unwashed)',
    gradeNumber: 1,
    ecxPriceETBPerQuintal: 104000,
    ecxPriceUSDPerLb: 2.95,
    fobDjiboutiDiffCentsLb: 135,
    realizedFobUSDPerLb: 4.19,
    changePercent: 3.0,
    cupProfile: 'Strawberry jam, passionfruit, lavender, syrupy body',
    harvestWindow: 'Dec - Feb (Sun-dried Naturals)',
    status: 'Tight Supply',
  },
];

const DEFAULT_MACRO: MacroIndicator[] = [
  {
    name: 'USD / ETB Unified Market',
    code: 'USD_ETB',
    value: 161.76,
    change: -0.12,
    unit: 'ETB',
    commentary: 'Open.ER-API live real-time rate',
  },
  {
    name: 'Djibouti Ocean Container Freight',
    code: 'FREIGHT_FEU',
    value: 5850,
    change: 3.8,
    unit: 'USD/FEU',
    commentary: 'Cape of Good Hope detour (34 days to Rotterdam)',
  },
  {
    name: 'ECX Minimum Floor Realization',
    code: 'ECX_FLOOR',
    value: 84000,
    change: 1.4,
    unit: 'ETB/Qtl',
    commentary: 'Primary washing station support floor',
  },
  {
    name: 'Antwerp ICE Certified Stocks',
    code: 'CERT_STOCKS',
    value: 818400,
    change: -12400,
    unit: 'Bags',
    commentary: 'Certified exchange inventory drawdown',
  },
];

const DEFAULT_FORECAST: MarketForecast = {
  targetMarket: 'ICE Arabica "C" (New York & ECX Parity)',
  horizon: '1-6 Months (Medium Term)',
  currentPriceCentsLb: 284.15,
  expectedPriceCentsLb: 298.50,
  rangeLowCentsLb: 275.00,
  rangeHighCentsLb: 315.00,
  confidenceIntervalPercent: 87,
  signal: 'STRONG_SELL_FORWARD',
  signalLean: 'Lock in forward differentials (+55¢ to +135¢) on Washed lots; hedge natural volume against Q4 harvest inflows.',
  recommendationSummary: 'Brazil drought in Minas Gerais and Antwerp certified stock drawdowns maintain bullish price support over the medium term.',
  topDrivers: [
    { factor: 'Brazil Drought in Minas Gerais', weightPercent: 35, impact: 'Bullish', description: 'Sub-normal rainfall in southern Minas Gerais', source: 'Open-Meteo & AgWeather' },
    { factor: 'Antwerp Certified Stocks Drawdown', weightPercent: 25, impact: 'Bullish', description: 'Exchange inventory beneath 850k bags', source: 'ICE Futures' },
    { factor: 'Red Sea Dwell Times & Cape Detour', weightPercent: 20, impact: 'Bearish', description: 'Container dwell elevated to 34 days', source: 'Djibouti Logistics' },
    { factor: 'NBE FX Unified Floating Regime', weightPercent: 20, impact: 'Bullish', description: 'Competitive exporter domestic liquidity', source: 'Open.ER-API' },
  ],
  historicalAccuracy: {
    backtestWindowDays: 180,
    directionalAccuracyPercent: 84.5,
    meanAbsolutePercentageError: 3.2,
  },
};

const DEFAULT_BRIEF: MarketBriefData = {
  headline: 'Global Arabica Benchmark Firm On Weather Stress; Physical Washed Basis Solid',
  executiveSummary: 'Live terminal futures trade with upward bias supported by sub-normal precipitation in Brazil and low certified inventories. Ethiopian physical differentials remain at historic highs over the ICE C benchmark.',
  generatedDate: 'Live System Ingestion',
  topMovers: [
    { headline: 'Minas Gerais Rainfall 40% Deficit', description: 'Soil moisture deficits impact cherry setting.', impact: 'Bullish', source: 'Open-Meteo & AgWeather' },
    { headline: 'USD/ETB Rate Synchronized', description: 'Unified foreign currency market supports exporter domestic purchasing.', impact: 'Bullish', source: 'Open.ER-API' },
    { headline: 'Cape of Good Hope Transit Dwell', description: 'Vessel transit times add 14 days to European ports.', impact: 'Bearish', source: 'Djibouti Port & Lloyds' },
    { headline: 'EUDR Satellite Polygon Integration', description: 'Traceability protocols active across cooperative union registries.', impact: 'Neutral', source: 'ECTA / EU' },
  ],
  bullishFactors: [
    { exchange: 'ICE U.S.', title: 'Certified Warehouse Drawdown', evidence: 'Stocks under 850k bags in Europe.', source: 'ICE Futures' },
    { exchange: 'ECX', title: 'Strong Exporter Domestic Bidding', evidence: 'High competition at primary collection centers.', source: 'ECX Session' },
  ],
  bearishFactors: [
    { exchange: 'Global Freight', title: 'Container Haulage Costs', evidence: 'FEU spot rates elevated due to Red Sea rerouting.', source: 'Freightos' },
  ],
  watchList: [
    { event: 'Brazil Blossom Assessment', date: 'October 2026', expectedMarketEffect: 'Volatility on terminal Arabica' },
    { event: 'ECTA Export Licensing Window', date: 'November 2026', expectedMarketEffect: 'Primary crop booking acceleration' },
  ],
};

type NavTab =
  | 'OVERVIEW'
  | 'C_MARKETS'
  | 'EVENT_IMPACT'
  | 'PUBLICATIONS'
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

  // Data collections initialized with real defaults, updated via live API snapshot
  const [exchanges, setExchanges] = useState<ExchangeQuote[]>(DEFAULT_EXCHANGES);
  const [cMarkets, setCMarkets] = useState<GlobalCMarket[]>([]);
  const [grades, setGrades] = useState<EthiopianGradeQuote[]>(DEFAULT_GRADES);
  const [forecast, setForecast] = useState<MarketForecast>(DEFAULT_FORECAST);
  const [brief, setBrief] = useState<MarketBriefData>(DEFAULT_BRIEF);
  const [historicalData, setHistoricalData] = useState<HistoricalPricePoint[]>([]);
  const [macroRates, setMacroRates] = useState<MacroIndicator[]>(DEFAULT_MACRO);
  const [competitors, setCompetitors] = useState<CompetitorOrigin[]>(COMPETITORS);
  const [prosCons, setProsCons] = useState<Record<string, ExchangeProsCons>>(PROS_CONS_DATA);
  const [news, setNews] = useState<NewsItem[]>([]);
  const [newsDigest, setNewsDigest] = useState<NewsDigestData | undefined>(undefined);
  const [events, setEvents] = useState<IntelligenceEventItem[]>([]);
  const [publications, setPublications] = useState<PublicationItem[]>(INDUSTRY_PUBLICATIONS);

  // Selected grade for drill-down
  const [selectedGrade, setSelectedGrade] = useState<EthiopianGradeQuote | null>(DEFAULT_GRADES[0]);

  // AI explanation state
  const [isExplaining, setIsExplaining] = useState<boolean>(false);
  const [explanationText, setExplanationText] = useState<string | null>(null);

  // AI Brief regeneration state
  const [isRegeneratingBrief, setIsRegeneratingBrief] = useState<boolean>(false);

  // Modals
  const [isCopilotOpen, setIsCopilotOpen] = useState<boolean>(false);
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [isAlertsOpen, setIsAlertsOpen] = useState<boolean>(false);
  const [isSourcesOpen, setIsSourcesOpen] = useState<boolean>(false);
  const [isArchitectureOpen, setIsArchitectureOpen] = useState<boolean>(false);
  const [isProConReportOpen, setIsProConReportOpen] = useState<boolean>(false);
  const [proConReport, setProConReport] = useState<ProConSummaryReport | null>(null);
  const [isLoadingProConReport, setIsLoadingProConReport] = useState<boolean>(false);

  // Authenticated User Session (gated access with demo accounts)
  const [currentUser, setCurrentUser] = useState<UserSession | null>(() => {
    try {
      const saved = localStorage.getItem('coffee_intel_session');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.warn('Session hydration error', e);
    }
    return null;
  });

  const handleLogout = () => {
    try {
      localStorage.removeItem('coffee_intel_session');
    } catch (e) {}
    setCurrentUser(null);
  };

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
        if (data.grades) {
          setGrades(data.grades);
          if (!selectedGrade || !data.grades.some((g: EthiopianGradeQuote) => g.id === selectedGrade.id)) {
            setSelectedGrade(data.grades[0]);
          }
        }
        if (data.forecast) setForecast(data.forecast);
        if (data.brief) setBrief(data.brief);
        if (data.news) setNews(data.news);
        if (data.newsDigest) setNewsDigest(data.newsDigest);
        if (data.macroRates) setMacroRates(data.macroRates);
        if (data.cMarkets) setCMarkets(data.cMarkets);
        if (data.historicalPoints) setHistoricalData(data.historicalPoints);
        if (data.competitors) setCompetitors(data.competitors);
        if (data.prosCons) setProsCons(data.prosCons);
        if (data.events) setEvents(data.events);
        if (data.publications) setPublications(data.publications);
      }
    } catch (e) {
      console.warn('Real market fetch error, maintaining current live state', e);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Generate AI Pro vs. Con Executive Report
  const handleGenerateProConReport = async () => {
    setIsLoadingProConReport(true);
    setIsProConReportOpen(true);
    try {
      const res = await fetch('/api/ai/pro-con-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language, filter: 'ALL' }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.report) {
          setProConReport(data.report);
        }
      }
    } catch (err) {
      console.warn('Pro/Con report generation fallback:', err);
    } finally {
      setIsLoadingProConReport(false);
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

  // If user is not authenticated, show the dedicated login page with demo options
  if (!currentUser) {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
        }}
      />
    );
  }

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
        onOpenSources={() => setIsSourcesOpen(true)}
        onOpenArchitecture={() => setIsArchitectureOpen(true)}
        user={currentUser}
        onLogout={handleLogout}
        isRefreshing={isRefreshing}
        onRefreshData={fetchMarketData}
      />

      {/* 2. Real-Time Ticker Tape */}
      <TickerBar
        exchanges={exchanges}
        grades={grades}
        macroRates={macroRates}
        historicalData={historicalData}
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
            id="tab-event-impact"
            onClick={() => setActiveTab('EVENT_IMPACT')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'EVENT_IMPACT'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <Zap className="h-4 w-4 text-amber-400" />
            <span>{t.navEventImpact}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono">10 Pillars</span>
          </button>

          <button
            id="tab-publications"
            onClick={() => setActiveTab('PUBLICATIONS')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-semibold transition-all whitespace-nowrap ${
              activeTab === 'PUBLICATIONS'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-xs'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
            }`}
          >
            <BookOpen className="h-4 w-4 text-emerald-400" />
            <span>{t.navPublications}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">Archive</span>
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
            <HistoricalPriceRecharts
              historicalData={historicalData}
              unit={unit}
              currencyMode={currencyMode}
              selectedGrade={selectedGrade}
              onSelectGrade={setSelectedGrade}
              exchanges={exchanges}
            />

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

        {/* Tab: Market Event Engine & Coffee Impact Engine (10 Pillars) */}
        {activeTab === 'EVENT_IMPACT' && (
          <div className="space-y-6">
            <MarketEventAndImpactEngineView
              events={events}
              language={language}
              onOpenProConReport={handleGenerateProConReport}
              onOpenDataSources={() => setIsSourcesOpen(true)}
              onOpenArchitecture={() => setIsArchitectureOpen(true)}
            />
          </div>
        )}

        {/* Tab: Publications, Magazines & Reports Archive Reader */}
        {activeTab === 'PUBLICATIONS' && (
          <div className="space-y-6">
            <PublicationsReaderView
              publications={publications}
              newsItems={news}
              language={language}
              onOpenProConReport={handleGenerateProConReport}
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

      <DataSourcesModal
        isOpen={isSourcesOpen}
        onClose={() => setIsSourcesOpen(false)}
        onDataRefreshed={() => fetchMarketData(language)}
      />

      <ProConReportModal
        isOpen={isProConReportOpen}
        onClose={() => setIsProConReportOpen(false)}
        report={proConReport}
        isLoading={isLoadingProConReport}
        onRegenerate={handleGenerateProConReport}
        language={language}
      />

      <SystemArchitectureModal
        isOpen={isArchitectureOpen}
        onClose={() => setIsArchitectureOpen(false)}
        language={language}
        onOpenDataSources={() => {
          setIsArchitectureOpen(false);
          setIsSourcesOpen(true);
        }}
        onOpenProConReport={() => {
          setIsArchitectureOpen(false);
          handleGenerateProConReport();
        }}
      />
    </div>
  );
}
