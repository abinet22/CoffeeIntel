export type ExchangeId =
  | 'ICE_ARABICA'
  | 'ICE_ROBUSTA'
  | 'ECX_ETHIOPIA'
  | 'CHINA_YUNNAN'
  | 'JAPAN_TOKYO'
  | 'DUBAI_DMCC';

export type GlobalExchangeId =
  | 'ICE_NY_ARABICA'
  | 'ICE_LON_ROBUSTA'
  | 'CHINA_YUNNAN'
  | 'JAPAN_TOKYO'
  | 'DUBAI_DMCC'
  | 'ECX_ETHIOPIA';

export type PriceUnit = 'cents_lb' | 'usd_kg' | 'etb_kg';

export type Language = 'en' | 'am';

export interface GlobalCMarket {
  id: GlobalExchangeId;
  name: string;
  shortName: string;
  symbol: string;
  region: 'New York' | 'London' | 'China' | 'Japan' | 'Middle East' | 'Addis Ababa';
  regionAm: string;
  city: string;
  country: string;
  flag: string;
  exchangeOperator: string;
  contractStandard: string;
  benchmarkType: string;
  priceCentsLb: number;
  changeCentsLb: number;
  changePercent: number;
  highCentsLb: number;
  lowCentsLb: number;
  openCentsLb: number;
  volume24h: string;
  openInterest: string;
  localCurrency: string;
  localCurrencySymbol: string;
  localPricePerKg: number;
  localPriceUnit: string;
  status: 'OPEN' | 'PRE_MARKET' | 'CLOSED';
  tradingHours: string;
  timezone: string;
  timeDiffEAT: string;
  keyBuyers: string[];
  ethiopianTradeFlow: {
    topDemandGrades: string[];
    topDemandGradesAm: string[];
    transitDaysFromDjibouti: number;
    freightSurchargeUSD: string;
    targetBuyersRoasters: string;
    annualExportSharePct: number;
    exporterAdvice: string;
    exporterAdviceAm: string;
  };
}

export interface GlobalCHistoricalPoint {
  date: string;
  timestamp: number;
  newYorkArabica: number;
  londonRobusta: number;
  chinaYunnan: number;
  japanTokyo: number;
  dubaiDmcc: number;
  ethiopiaEcx: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface ExchangeQuote {
  id: ExchangeId;
  name: string;
  symbol: string;
  exchange: string;
  location: string;
  priceCentsLb: number;
  changeCentsLb: number;
  changePercent: number;
  highCentsLb: number;
  lowCentsLb: number;
  volume: string;
  openInterest: string;
  lastUpdated: string;
  unitLabel: string;
}

export interface EthiopianGradeQuote {
  id: string;
  gradeCode: string;
  region: 'Sidama' | 'Yirgacheffe' | 'Guji' | 'Limu' | 'Jimma' | 'Harar' | 'Keffa/Nekemte';
  processing: 'Washed' | 'Natural (Unwashed)' | 'Specialty Micro-lot';
  gradeNumber: number;
  ecxPriceETBPerQuintal: number; // 1 quintal = 100kg
  ecxPriceUSDPerLb: number;
  fobDjiboutiDiffCentsLb: number; // differential over ICE Arabica C (e.g. +65c/lb)
  realizedFobUSDPerLb: number;
  changePercent: number;
  cupProfile: string;
  harvestWindow: string;
  status: 'High Demand' | 'Stable' | 'Tight Supply' | 'Discounted';
}

export interface HistoricalPricePoint {
  date: string;
  iceArabicaCents: number;
  iceRobustaCents: number;
  ecxYirgacheffeCents: number;
  ecxSidamoCents: number;
  ecxGujiCents?: number;
  ecxLimuCents?: number;
  ecxHararCents?: number;
  fobDifferentialCents: number;
  volume: number;
  predictedPrice?: number;
  confidenceUpper?: number;
  confidenceLower?: number;
}

export interface ForecastDriver {
  factor: string;
  impact: 'Bullish' | 'Bearish' | 'Neutral';
  weightPercent: number;
  description: string;
  source: string;
}

export interface MarketForecast {
  targetMarket: string;
  horizon: '1-4 Weeks (Short Term)' | '1-6 Months (Medium Term)';
  currentPriceCentsLb: number;
  expectedPriceCentsLb: number;
  rangeLowCentsLb: number;
  rangeHighCentsLb: number;
  confidenceIntervalPercent: number; // e.g. 68% or 95%
  signal: 'STRONG_SELL_FORWARD' | 'ACCUMULATE_CHERRY' | 'HOLD_FOR_HIGHER' | 'HEDGE_EXPOSURE';
  signalLean: string;
  recommendationSummary: string;
  topDrivers: ForecastDriver[];
  historicalAccuracy: {
    backtestWindowDays: number;
    directionalAccuracyPercent: number;
    meanAbsolutePercentageError: number;
  };
}

export type NewsCategory = 
  | 'Weather' 
  | 'Geopolitics/Trade Policy' 
  | 'Currency/Macro' 
  | 'Logistics/Shipping' 
  | 'Crop/Harvest' 
  | 'Demand/Consumption' 
  | 'Regulation (EUDR, tariffs)';

export interface NewsItem {
  id: string;
  title: string;
  summary: string;
  exporterTakeaway?: string;
  category: NewsCategory;
  source: string;
  publishedAt: string;
  url?: string;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  impactMagnitude: 'High' | 'Medium' | 'Low';
  affectedMarkets: ('ICE Arabica' | 'ICE Robusta' | 'ECX' | 'FOB Djibouti')[];
  keyEntities: string[];
}

export interface NewsDigestData {
  digestHeadline: string;
  digestSummary: string;
  localExporterImpact: string;
  keyActionItems: string[];
  generatedAt?: string;
  source?: string;
}

export interface ExchangeProsCons {
  exchangeName: string;
  currentSentiment: 'Bullish' | 'Bearish' | 'Mixed';
  pros: string[];
  cons: string[];
  basisCommentary: string;
  actionLean: string;
}

export interface MacroIndicator {
  name: string;
  code: string;
  value: number;
  change: number;
  unit: string;
  commentary: string;
}

export interface CompetitorOrigin {
  origin: string;
  variety: string;
  fobDifferentialCentsLb: number; // +/- over ICE Arabica C or Robusta
  priceUSDPerLb: number;
  cropStatus: string;
  exportPace: string;
  qualityNotes: string;
}

export interface MarketBriefData {
  generatedDate: string;
  headline: string;
  executiveSummary: string;
  topMovers: {
    headline: string;
    description: string;
    impact: string;
    source: string;
  }[];
  bullishFactors: {
    exchange: string;
    title: string;
    evidence: string;
    source: string;
  }[];
  bearishFactors: {
    exchange: string;
    title: string;
    evidence: string;
    source: string;
  }[];
  watchList: {
    event: string;
    date: string;
    expectedMarketEffect: string;
  }[];
}

export interface ExporterContractScenario {
  volumeBags: number; // 60kg bags
  gradeId: string;
  targetBuyerCountry: string;
  offeredPriceCentsLb: number;
  currentIceCentsLb: number;
  differentialCentsLb: number;
  usdEtbRate: number;
  freightCostPerContainerUSD: number; // 1 container = ~320 bags of 60kg (approx 19.2 MT)
  weeksToWait: number;
}

export type SourcePriority = 'P1' | 'P2' | 'P3';
export type SourceType = 'API' | 'RSS' | 'WEB' | 'REPORT' | 'DATA';

export interface SourceRegistryItem {
  id: string;
  name: string;
  country: string;
  region: string;
  category: string;
  priority: SourcePriority;
  sourceType: SourceType;
  url: string;
  status: 'LIVE' | 'CONNECTED' | 'SYNCED' | 'STANDBY';
  lastSync: string;
  itemCount: number;
  notes: string;
  notesAm?: string;
}

export interface OriginWeatherSummary {
  id: string;
  region: string;
  country: string;
  flag: string;
  lat: number;
  lon: number;
  currentTempC: number;
  currentPrecipitationMm: number;
  humidityPercent: number;
  dailyPrecipForecastMm: number[];
  anomalyStatus: 'Normal' | 'Rainfall Deficit' | 'Excess Rain' | 'Flowering Stress';
  anomalyStatusAm: string;
  cropRiskAssessment: string;
  cropRiskAssessmentAm: string;
  lastUpdated: string;
}

export interface IntelligenceEventItem {
  id: string;
  title: string;
  event: string;
  country: string;
  region: string;
  commodity: 'Arabica' | 'Robusta' | 'Macro' | 'Logistics';
  category: 'PRICE' | 'WEATHER' | 'CROP' | 'PRODUCTION' | 'EXPORT' | 'IMPORT' | 'SHIPPING' | 'REGULATION' | 'EUDR' | 'MACRO';
  impact: string;
  severity: 1 | 2 | 3 | 4 | 5;
  sentiment: 'Bullish' | 'Bearish' | 'Neutral';
  source: string;
  url: string;
  publishedAt: string;
  exporterImpact: string;
  exporterImpactAm: string;
  proConType?: 'PRO' | 'CON' | 'NEUTRAL';
  proConLabel?: string;
  pillar?: 'Market' | 'Trade' | 'Weather' | 'Commodity' | 'Geopolitics' | 'Logistics' | 'News' | 'Origin';
}

export type PublicationType = 'MAGAZINE' | 'REPORT' | 'NEWS_DISPATCH';

export interface PublicationItem {
  id: string;
  title: string;
  publication: string;
  type: PublicationType;
  publishedDate: string;
  authorOrOrg: string;
  readTime: string;
  summary: string;
  fullExcerpt: string;
  keyTakeaways: string[];
  url: string;
  proConTag: 'PRO' | 'CON' | 'NEUTRAL';
  proConLabel: string;
  pillars: ('Market' | 'Trade' | 'Weather' | 'Commodity' | 'Geopolitics' | 'Logistics' | 'News' | 'Origin')[];
  impactMagnitude: 'High' | 'Medium' | 'Low';
  relevantCommodities: string[];
}

export interface ProConSummaryReport {
  headline: string;
  marketPosture: string;
  bullishScore: number; // e.g. 72%
  bearishScore: number; // e.g. 28%
  executiveSummary: string;
  pros: {
    title: string;
    category: string;
    impactMetric: string;
    detail: string;
    source: string;
  }[];
  cons: {
    title: string;
    category: string;
    impactMetric: string;
    mitigation: string;
    source: string;
  }[];
  tacticalRoadmap: {
    timeframe: string;
    action: string;
    impact: string;
  }[];
  generatedAt: string;
}

export type UserRole =
  | 'Senior Exporter'
  | 'Coffee Union Manager'
  | 'Market Analyst'
  | 'Guest Trader';

export interface UserSession {
  username: string;
  fullName: string;
  role: UserRole;
  roleAm?: string;
  organization: string;
  token?: string;
  loginTime: string;
  isDemo?: boolean;
}

export interface DemoUserAccount {
  username: string;
  password: string;
  fullName: string;
  role: UserRole;
  roleAm: string;
  organization: string;
  organizationAm: string;
  badgeColor: string;
  description: string;
  descriptionAm: string;
}

