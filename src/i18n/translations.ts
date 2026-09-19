import { Language } from '../types';

export interface Translations {
  // Brand & Header
  brandTitle: string;
  brandTagline: string;
  exporterDesk: string;
  unitCentsLb: string;
  unitUsdKg: string;
  unitEtbKg: string;
  viewCurrency: string;
  refreshFeeds: string;
  refreshing: string;
  alertsBtn: string;
  exportReportBtn: string;
  aiCopilotBtn: string;
  languageToggle: string;

  // Navigation
  navOverview: string;
  navCMarkets: string;
  navPredictions: string;
  navBrief: string;
  navCalculator: string;
  navOrigins: string;

  // Ticker Bar
  tickerLiveExchangeFeeds: string;
  tickerOfficialNbe: string;
  tickerParallelEst: string;
  tickerDjiboutiFreight: string;
  tickerIceStocks: string;
  tickerSpread: string;

  // Multi-Exchange Dashboard
  dashTitle: string;
  dashSubtitle: string;
  timeframe1M: string;
  timeframe3M: string;
  timeframe6M: string;
  timeframe1Y: string;
  timeframeForecast: string;
  vol24h: string;
  openInterest: string;
  dayRange: string;
  lastUpdated: string;
  chartLegendIceArabica: string;
  chartLegendIceRobusta: string;
  chartLegendEcxPhysical: string;
  chartLegendForecastCone: string;
  chartConfidenceBand: string;
  chartHistoricalBenchmark: string;
  chartProjectedTrend: string;

  // ECX Grade Board
  gradesTitle: string;
  gradesSubtitle: string;
  filterAllRegions: string;
  filterWashedOnly: string;
  filterNaturalOnly: string;
  colGradeCode: string;
  colRegion: string;
  colProcessing: string;
  colEcxPrice: string;
  colFobDiff: string;
  colRealizedFob: string;
  colDemandStatus: string;
  colActions: string;
  viewDetails: string;
  cupProfileLabel: string;
  harvestWindowLabel: string;
  highDemand: string;
  stable: string;
  tightSupply: string;
  discounted: string;
  washed: string;
  natural: string;
  specialtyMicroLot: string;

  // Prediction Engine
  predTitle: string;
  predSubtitle: string;
  predHorizonShort: string;
  predHorizonMedium: string;
  signalStrongSell: string;
  signalHoldHigher: string;
  signalAccumulate: string;
  signalHedge: string;
  confidenceInterval: string;
  backtestAccuracy: string;
  mapeLabel: string;
  currentBenchmark: string;
  targetExpectedPrice: string;
  forecastRange: string;
  exportRecommendation: string;
  topMarketDrivers: string;
  aiExplainBtn: string;
  aiExplaining: string;
  aiExplanationTitle: string;

  // Market Brief
  briefTitle: string;
  briefSubtitle: string;
  briefRegenerateBtn: string;
  briefRegenerating: string;
  briefExecSummary: string;
  briefTopMovers: string;
  briefBullishForces: string;
  briefBearishForces: string;
  briefCatalystCalendar: string;
  briefImpact: string;
  briefSource: string;

  // Pros & Cons
  prosConsTitle: string;
  prosConsSubtitle: string;
  tabIceArabica: string;
  tabIceRobusta: string;
  tabEcxDjibouti: string;
  bullishFactorsHeader: string;
  bearishFactorsHeader: string;
  basisAssessment: string;
  recommendedAction: string;

  // Export Contract Calculator
  calcTitle: string;
  calcSubtitle: string;
  calcGradeSelect: string;
  calcContainerCount: string;
  calcBagCount: string;
  calcContractFobPrice: string;
  calcFarmgatePrice: string;
  calcProcessingLoss: string;
  calcFreightDjibouti: string;
  calcPortHandling: string;
  calcNbeRetention: string;
  calcGrossRevenueUSD: string;
  calcTotalCostsETB: string;
  calcNetMarginUSD: string;
  calcNetMarginETB: string;
  calcMarginPercent: string;
  calcBreakevenFob: string;
  calcTimingAdvice: string;
  calcSummaryHeading: string;

  // Currency Risk Module
  fxTitle: string;
  fxSubtitle: string;
  fxOfficialRate: string;
  fxParallelRate: string;
  fxParallelPremium: string;
  fxDevaluationTrend: string;
  fxCherryParityCap: string;
  fxPolicySummary: string;

  // Competitor Origins
  compTitle: string;
  compSubtitle: string;
  compOrigin: string;
  compVariety: string;
  compFobDifferential: string;
  compBenchmarkPrice: string;
  compCropStatus: string;
  compExportPace: string;
  compCompetitiveAdvantage: string;

  // Alerts & EUDR Modal
  alertsModalTitle: string;
  alertsModalSubtitle: string;
  alertsTabRules: string;
  alertsTabEudr: string;
  alertsChannelLabel: string;
  alertsRecipientLabel: string;
  alertsRuleName: string;
  alertsTriggerCondition: string;
  alertsSendTestBtn: string;
  alertsSending: string;
  eudrReadinessScore: string;
  eudrPolygonAudit: string;
  eudrFarmerRegistration: string;
  eudrDueDiligenceDoc: string;
  eudrEctaLink: string;

  // Report Modal
  reportModalTitle: string;
  reportPrintBtn: string;
  reportCloseBtn: string;
  reportDossierHeading: string;
  reportConfidentialNotice: string;
  reportAuthorizedSignature: string;

  // AI Copilot Modal
  copilotModalTitle: string;
  copilotModalSubtitle: string;
  copilotInputPlaceholder: string;
  copilotSendBtn: string;
  copilotQuickQuestions: string[];
  copilotDisclaimer: string;

  // Generic
  loading: string;
  close: string;
  save: string;
  centsPerLb: string;
  usdPerKg: string;
  etbPerKg: string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    brandTitle: 'CoffeeIntel',
    brandTagline: 'AI Market Intelligence • Multi-Exchange (ICE NY, London, ECX) • Predictive Analytics',
    exporterDesk: 'Ethiopian Exporter Desk',
    unitCentsLb: '¢/lb',
    unitUsdKg: '$/kg',
    unitEtbKg: 'ETB/kg',
    viewCurrency: 'View:',
    refreshFeeds: 'Refresh Live Exchange Feeds & AI Signal',
    refreshing: 'Refreshing...',
    alertsBtn: 'Price & Weather Alerts',
    exportReportBtn: 'Export Report',
    aiCopilotBtn: 'AI Copilot',
    languageToggle: 'Language',

    navOverview: 'Market Overview',
    navCMarkets: 'Global C-Markets Live Chart',
    navPredictions: 'AI Predictions',
    navBrief: 'Daily Intelligence Brief',
    navCalculator: 'Export Calculator',
    navOrigins: 'Competitor Origins',

    tickerLiveExchangeFeeds: 'LIVE EXCHANGES',
    tickerOfficialNbe: 'NBE Official FX',
    tickerParallelEst: 'Parallel Market Est.',
    tickerDjiboutiFreight: 'Djibouti-Europe Freight',
    tickerIceStocks: 'ICE Certified Stocks',
    tickerSpread: 'FX Parallel Premium',

    dashTitle: 'Global & Domestic Multi-Exchange Benchmark',
    dashSubtitle: 'Live comparative tracking across ICE Coffee "C" (New York), ICE Robusta (London), and ECX Physical Floor Prices',
    timeframe1M: '1M',
    timeframe3M: '3M',
    timeframe6M: '6M',
    timeframe1Y: '1Y',
    timeframeForecast: 'AI Forecast (28D)',
    vol24h: '24h Volume',
    openInterest: 'Open Interest',
    dayRange: 'Day Range',
    lastUpdated: 'Last Updated',
    chartLegendIceArabica: 'ICE Arabica C (NY)',
    chartLegendIceRobusta: 'ICE Robusta (London)',
    chartLegendEcxPhysical: 'ECX Physical Benchmark',
    chartLegendForecastCone: 'AI Forecast Trajectory',
    chartConfidenceBand: '68% Confidence Band',
    chartHistoricalBenchmark: 'Historical Realized Prices',
    chartProjectedTrend: 'Projected 28-Day Econometric Path',

    gradesTitle: 'Ethiopian Physical Grade Board & Realized FOB Differentials',
    gradesSubtitle: 'Auction Floor equivalents at ECX, regional washing station premiums, and net FOB Djibouti export realizations',
    filterAllRegions: 'All Regions',
    filterWashedOnly: 'Washed Only',
    filterNaturalOnly: 'Natural Only',
    colGradeCode: 'Grade & Region',
    colRegion: 'Origin Region',
    colProcessing: 'Processing',
    colEcxPrice: 'ECX Floor Price',
    colFobDiff: 'FOB Differential',
    colRealizedFob: 'Realized FOB Djibouti',
    colDemandStatus: 'Demand Status',
    colActions: 'Action',
    viewDetails: 'View Details',
    cupProfileLabel: 'Cup Profile & Attributes',
    harvestWindowLabel: 'Harvest Window',
    highDemand: 'High Demand',
    stable: 'Stable',
    tightSupply: 'Tight Supply',
    discounted: 'Discounted',
    washed: 'Washed',
    natural: 'Natural (Unwashed)',
    specialtyMicroLot: 'Specialty Micro-lot',

    predTitle: 'Ensemble Econometric AI Prediction Engine',
    predSubtitle: 'Grounded in satellite soil moisture, certified warehouse stocks, freight spreads, and export contract registration velocity',
    predHorizonShort: '1-4 Weeks (Short Term)',
    predHorizonMedium: '1-6 Months (Medium Term)',
    signalStrongSell: 'STRONG SELL FORWARD',
    signalHoldHigher: 'HOLD FOR HIGHER PRICES',
    signalAccumulate: 'ACCUMULATE PARCHMENT/CHERRY',
    signalHedge: 'HEDGE EXPOSURE',
    confidenceInterval: 'Confidence Interval',
    backtestAccuracy: 'Directional Accuracy (180D)',
    mapeLabel: 'Mean Absolute % Error',
    currentBenchmark: 'Current Spot Benchmark',
    targetExpectedPrice: 'Projected Model Target',
    forecastRange: 'Forecast Price Range',
    exportRecommendation: 'Recommended Commercial Action',
    topMarketDrivers: 'Top Weighted Market Drivers',
    aiExplainBtn: 'Generate AI Reasoning',
    aiExplaining: 'Analyzing market drivers with Gemini...',
    aiExplanationTitle: 'Model Reasoning & Decision Dossier',

    briefTitle: 'Morning AI Market Intelligence Brief',
    briefSubtitle: 'Synthesized daily from trade feeds, ICO reports, meteorological data, and National Bank of Ethiopia regulatory bulletins',
    briefRegenerateBtn: 'Regenerate with Gemini AI',
    briefRegenerating: 'Generating fresh intelligence...',
    briefExecSummary: 'Executive Intelligence Summary',
    briefTopMovers: 'Top Market Catalysts',
    briefBullishForces: 'Bullish Forces (Upward Price Drivers)',
    briefBearishForces: 'Bearish Forces (Downward Price Risks)',
    briefCatalystCalendar: 'Key Events to Watch This Week',
    briefImpact: 'Market Impact',
    briefSource: 'Intelligence Source',

    prosConsTitle: 'Exchange-by-Exchange Bullish / Bearish Breakdown',
    prosConsSubtitle: 'Granular assessment of demand fundamentals, warehouse stocks, and physical basis risks',
    tabIceArabica: 'ICE Arabica "C" (New York)',
    tabIceRobusta: 'ICE Robusta (London)',
    tabEcxDjibouti: 'ECX Floor & FOB Djibouti',
    bullishFactorsHeader: 'Bullish Drivers (Upward Pressure)',
    bearishFactorsHeader: 'Bearish Risks (Downside Vulnerability)',
    basisAssessment: 'Physical Basis Commentary',
    recommendedAction: 'Exporter Strategic Lean',

    calcTitle: 'Export Contract & Margin Simulator',
    calcSubtitle: 'Simulate full profitability per container taking into account farmgate cherry costs, dry mill yields, logistics to Djibouti, and NBE retention',
    calcGradeSelect: 'Select Coffee Grade',
    calcContainerCount: 'Export Volume (40ft Containers)',
    calcBagCount: 'Equivalent 60kg Export Bags',
    calcContractFobPrice: 'Agreed FOB Djibouti Price',
    calcFarmgatePrice: 'Farmgate Red Cherry Price (ETB/kg)',
    calcProcessingLoss: 'Dry Milling & Processing Outturn (%)',
    calcFreightDjibouti: 'Inland Freight to Djibouti (USD/Cont)',
    calcPortHandling: 'Djibouti Port Handling & Clearance (USD/Cont)',
    calcNbeRetention: 'NBE FX Retention Split (50% FX / 50% ETB)',
    calcGrossRevenueUSD: 'Projected Gross Revenue (USD)',
    calcTotalCostsETB: 'Total Direct Procurement & Transport (ETB)',
    calcNetMarginUSD: 'Estimated Net Margin (USD)',
    calcNetMarginETB: 'Realized Margin in Local Currency (ETB)',
    calcMarginPercent: 'Net Margin Percentage',
    calcBreakevenFob: 'Minimum Breakeven FOB Price',
    calcTimingAdvice: 'Strategic Contract Timing Advice',
    calcSummaryHeading: 'Simulated Contract Payout Summary',

    fxTitle: 'Currency & Macroeconomic Risk Dashboard',
    fxSubtitle: 'Analyze how official vs. parallel exchange rates, NBE foreign exchange retention rules, and domestic inflation affect procurement parity',
    fxOfficialRate: 'NBE Official Exchange Rate',
    fxParallelRate: 'Market Parallel Indicator',
    fxParallelPremium: 'Parallel Market Premium Spread',
    fxDevaluationTrend: 'Crawling Peg Liberalization',
    fxCherryParityCap: 'Maximum Recommended Farmgate Cherry Price',
    fxPolicySummary: 'Exporter Retention & Repatriation Rules',

    compTitle: 'Global Origin Benchmark & Differentials',
    compSubtitle: 'Compare Ethiopian specialty and commercial grades with major producing nations (Colombia, Brazil, Vietnam, Kenya, Guatemala)',
    compOrigin: 'Origin & Typical Grade',
    compVariety: 'Botanical Variety',
    compFobDifferential: 'FOB Differential vs. ICE',
    compBenchmarkPrice: 'Effective FOB Price',
    compCropStatus: 'Harvest & Crop Condition',
    compExportPace: 'Export Pace & Destination Demand',
    compCompetitiveAdvantage: 'Commercial Positioning Notes',

    alertsModalTitle: 'Price Alerts & EUDR Deforestation Compliance',
    alertsModalSubtitle: 'Configure instant alert triggers via Telegram, SMS, or WhatsApp, and verify EUDR smallholder polygon documentation',
    alertsTabRules: 'Price & Weather Alerts',
    alertsTabEudr: 'EUDR Compliance Audit',
    alertsChannelLabel: 'Dispatch Channel',
    alertsRecipientLabel: 'Recipient (Phone / Telegram / Email)',
    alertsRuleName: 'Alert Trigger Condition',
    alertsTriggerCondition: 'Threshold Rule',
    alertsSendTestBtn: 'Dispatch Test Alert',
    alertsSending: 'Sending alert notification...',
    eudrReadinessScore: 'EUDR Exporter Readiness Score',
    eudrPolygonAudit: 'Smallholder GPS Polygon Mapping',
    eudrFarmerRegistration: 'Farmer Cooperative Union Registry',
    eudrDueDiligenceDoc: 'Due Diligence Statement (DDS) Readiness',
    eudrEctaLink: 'National ECTA Geolocation Platform Link',

    reportModalTitle: 'Executive Market Intelligence Dossier',
    reportPrintBtn: 'Print / Save as PDF',
    reportCloseBtn: 'Close Dossier',
    reportDossierHeading: 'WEEKLY COFFEE EXPORT INTELLIGENCE DOSSIER',
    reportConfidentialNotice: 'Confidential Commercial Intelligence for Ethiopian Exporters & Financial Partners',
    reportAuthorizedSignature: 'Chief Commodities Desk Authorization',

    copilotModalTitle: 'Kofi — Exporter AI Market Copilot',
    copilotModalSubtitle: 'Interactive AI commodity analyst powered by Gemini 3.8 Flash, specialized in Ethiopian coffee trading',
    copilotInputPlaceholder: 'Ask about prices, FOB differentials, EUDR rules, or export timing...',
    copilotSendBtn: 'Ask Analyst',
    copilotQuickQuestions: [
      'What is the price forecast for Yirgacheffe G2 Washed?',
      'How does Brazil drought affect Ethiopian export prices?',
      'What are the key EUDR compliance requirements for European shipments?',
      'Should I lock in forward contracts now or hold for higher prices?',
    ],
    copilotDisclaimer: 'AI recommendations provide data-driven market intelligence based on real-time trade signals. Always verify contracts with your financial and logistics advisors.',

    loading: 'Loading...',
    close: 'Close',
    save: 'Save Changes',
    centsPerLb: 'US Cents / Pound',
    usdPerKg: 'USD / Kilogram',
    etbPerKg: 'ETB / Kilogram',
  },

  am: {
    brandTitle: 'ኮፊኢንቴል',
    brandTagline: 'AI የገበያ መረጃ • ዓለም አቀፍና የኢትዮጵያ ምርት ገበያ (ICE & ECX) • የዋጋ ትንበያ',
    exporterDesk: 'የኢትዮጵያ ቡና ላኪዎች ዴስክ',
    unitCentsLb: 'ሳንቲም/ፓውንድ',
    unitUsdKg: 'ዶላር/ኪ.ግ',
    unitEtbKg: 'ብር/ኪ.ግ',
    viewCurrency: 'እይታ:',
    refreshFeeds: 'የገበያ መረጃዎችን እና የ AI ትንበያዎችን አድስ',
    refreshing: 'እየታደሰ ነው...',
    alertsBtn: 'የዋጋ እና የአየር ሁኔታ ማስጠንቀቂያ',
    exportReportBtn: 'ሪፖርት አውርድ',
    aiCopilotBtn: 'የ AI ረዳት',
    languageToggle: 'ቋንቋ',

    navOverview: 'የገበያ አጠቃላይ እይታ',
    navCMarkets: 'የአለም አቀፍ ሲ-ገበያዎች የቀጥታ ቻርት',
    navPredictions: 'የ AI ዋጋ ትንበያ',
    navBrief: 'ዕለታዊ የገበያ ማጠቃለያ',
    navCalculator: 'የወጪ ንግድ ካልኩሌተር',
    navOrigins: 'የተፎካካሪ ሃገራት ንፅፅር',

    tickerLiveExchangeFeeds: 'የቀጥታ ገበያዎች',
    tickerOfficialNbe: 'ይፋዊ ብሔራዊ ባንክ ምንዛሪ',
    tickerParallelEst: 'ትይዩ የገበያ ምንዛሪ',
    tickerDjiboutiFreight: 'የጅቡቲ-አውሮፓ የጭነት ዋጋ',
    tickerIceStocks: 'አይሲኢ የተረጋገጠ የቡና ክምችት',
    tickerSpread: 'የትይዩ ምንዛሪ ልዩነት',

    dashTitle: 'ዓለም አቀፍ እና የአገር ውስጥ የቡና ገበያዎች የቀጥታ ዋጋ ንፅፅር',
    dashSubtitle: 'የኒው ዮርክ አይሲኢ አራቢካ፣ የለንደን ሮቡስታ እና የኢትዮጵያ ምርት ገበያ (ECX) የቀጥታ የዋጋ ክትትል',
    timeframe1M: '1 ወር',
    timeframe3M: '3 ወር',
    timeframe6M: '6 ወር',
    timeframe1Y: '1 ዓመት',
    timeframeForecast: 'የ AI ትንበያ (28 ቀናት)',
    vol24h: 'የ24 ሰዓት የግብይት መጠን',
    openInterest: 'ክፍት ውሎች',
    dayRange: 'የዕለቱ የዋጋ ወሰን',
    lastUpdated: 'የመጨረሻ ዝመና',
    chartLegendIceArabica: 'አይሲኢ አራቢካ C (ኒው ዮርክ)',
    chartLegendIceRobusta: 'አይሲኢ ሮቡስታ (ለንደን)',
    chartLegendEcxPhysical: 'የኢትዮጵያ ምርት ገበያ መነሻ ዋጋ',
    chartLegendForecastCone: 'የ AI ዋጋ ትንበያ መስመር',
    chartConfidenceBand: '68% የእርግጠኝነት ወሰን',
    chartHistoricalBenchmark: 'ያለፈው የተረጋገጠ ዋጋ',
    chartProjectedTrend: 'የሚቀጥሉት 28 ቀናት የተገመተ አቅጣጫ',

    gradesTitle: 'የኢትዮጵያ የቡና ደረጃዎች እና የጅቡቲ ኤፍኦቢ (FOB) ልዩነቶች',
    gradesSubtitle: 'የምርት ገበያ መነሻ ዋጋ፣ የአካባቢ ማጠቢያ ጣቢያዎች የቼሪ ዋጋ እና የተጣራ የጅቡቲ ኤፍኦቢ ገቢ',
    filterAllRegions: 'ሁሉም ክልሎች',
    filterWashedOnly: 'የታጠበ ብቻ',
    filterNaturalOnly: 'ያልታጠበ (ተፈጥሯዊ) ብቻ',
    colGradeCode: 'የቡና ደረጃ እና አከባቢ',
    colRegion: 'አምራች ክልል',
    colProcessing: 'የማቀነባበር ዓይነት',
    colEcxPrice: 'የምርት ገበያ ዋጋ',
    colFobDiff: 'የኤፍኦቢ ልዩነት (+/-)',
    colRealizedFob: 'የተገኘ ኤፍኦቢ ዋጋ',
    colDemandStatus: 'የገበያ ተፈላጊነት',
    colActions: 'ተግባር',
    viewDetails: 'ዝርዝር እይ',
    cupProfileLabel: 'የጣዕም እና የጥራት መገለጫ',
    harvestWindowLabel: 'የመኸር ወቅት',
    highDemand: 'ከፍተኛ ተፈላጊነት',
    stable: 'የተረጋጋ',
    tightSupply: 'አነስተኛ አቅርቦት',
    discounted: 'ቅናሽ ያለበት',
    washed: 'የታጠበ',
    natural: 'ያልታጠበ (ተፈጥሯዊ)',
    specialtyMicroLot: 'ልዩ ማይክሮ-ሎት',

    predTitle: 'የተቀናጀ ኢኮኖሜትሪክ AI የዋጋ ትንበያ ሞዴል',
    predSubtitle: 'በሳተላይት የአፈር እርጥበት፣ በወደብ ክምችት፣ በዓለም አቀፍ የጭነት ዋጋ እና በላኪዎች ውል ምዝገባ ፍጥነት የተደገፈ',
    predHorizonShort: '1-4 ሳምንታት (የአጭር ጊዜ)',
    predHorizonMedium: '1-6 ወራት (የመካከለኛ ጊዜ)',
    signalStrongSell: 'አሁኑኑ በቅድሚያ ይሽጡ (STRONG SELL)',
    signalHoldHigher: 'ቡናዎን ይዘው ይጠብቁ (HOLD)',
    signalAccumulate: 'ቀይ ቼሪ / ብስባሽ ይሰብስቡ (ACCUMULATE)',
    signalHedge: 'የዋጋ ስጋትን ይቀንሱ (HEDGE)',
    confidenceInterval: 'የእርግጠኝነት ደረጃ',
    backtestAccuracy: 'ያለፈው የትንበያ ትክክለኛነት (180 ቀናት)',
    mapeLabel: 'አማካይ የስህተት ህዳግ (MAPE)',
    currentBenchmark: 'የአሁኑ መነሻ ዋጋ',
    targetExpectedPrice: 'የተተነበየው የታለመ ዋጋ',
    forecastRange: 'የተተነበየው የዋጋ ወሰን',
    exportRecommendation: 'የተጠቆመ የንግድ ውሳኔ',
    topMarketDrivers: 'ዋና የገበያ አንቀሳቃሽ ምክንያቶች',
    aiExplainBtn: 'የ AI ማብራሪያ አፍልቅ',
    aiExplaining: 'በጄሚኒ AI የገበያ ምክንያቶችን በመመርመር ላይ...',
    aiExplanationTitle: 'የሞዴሉ ዝርዝር ማብራሪያ እና የውሳኔ ዶሴ',

    briefTitle: 'ዕለታዊ የ AI የቡና ገበያ ማጠቃለያ',
    briefSubtitle: 'ከዓለም አቀፍ የንግድ ዜናዎች፣ ከአይሲኦ (ICO) ሪፖርቶች፣ ከአየር ትንበያ እና ከኢትዮጵያ ብሔራዊ ባንክ መመሪያዎች የተጠናቀረ',
    briefRegenerateBtn: 'በጄሚኒ AI አዲስ ማጠቃለያ አፍልቅ',
    briefRegenerating: 'አዲስ የገበያ መረጃ በማመንጨት ላይ...',
    briefExecSummary: 'የሥራ አስፈፃሚ የገበያ ማጠቃለያ',
    briefTopMovers: 'ከፍተኛ ተፅዕኖ የፈጠሩ የገበያ ክስተቶች',
    briefBullishForces: 'ለዋጋ መጨመር አዎንታዊ ምክንያቶች (Bullish)',
    briefBearishForces: 'ለዋጋ መቀነስ አሉታዊ ስጋቶች (Bearish)',
    briefCatalystCalendar: 'በዚህ ሳምንት የሚጠበቁ ወሳኝ ክስተቶች',
    briefImpact: 'የገበያ ተፅዕኖ',
    briefSource: 'የመረጃ ምንጭ',

    prosConsTitle: 'የገበያዎች ዝርዝር አዎንታዊ እና አሉታዊ ምክንያቶች',
    prosConsSubtitle: 'የፍላጎት እና አቅርቦት፣ የክምችት መጠን እና የፊዚካል ገበያ ስጋቶች ትንተና',
    tabIceArabica: 'አይሲኢ አራቢካ "C" (ኒው ዮርክ)',
    tabIceRobusta: 'አይሲኢ ሮቡስታ (ለንደን)',
    tabEcxDjibouti: 'የምርት ገበያ እና ጅቡቲ ኤፍኦቢ',
    bullishFactorsHeader: 'የዋጋ መነቃቃት ምክንያቶች (Bullish)',
    bearishFactorsHeader: 'የዋጋ ማሽቆልቆል ስጋቶች (Bearish)',
    basisAssessment: 'የፊዚካል ገበያ እና የልዩነት ትንተና',
    recommendedAction: 'ለላኪው የሚመከር ስልታዊ እርምጃ',

    calcTitle: 'የቡና ወጪ ንግድ ትርፋማነት ማስያ (ካልኩሌተር)',
    calcSubtitle: 'የቀይ ቼሪ መግዣ ወጪን፣ የማቀነባበር ኪሳራን፣ የጅቡቲ ትራንስፖርትን እና የብሔራዊ ባንክ የምንዛሪ ይዞታን ያካተተ የተጣራ ትርፍ አስሊ',
    calcGradeSelect: 'የቡና ደረጃ ይምረጡ',
    calcContainerCount: 'የኮንቴነር ብዛት (40ft)',
    calcBagCount: 'የከረጢት ብዛት (60 ኪ.ግ)',
    calcContractFobPrice: 'የተስማሙበት ኤፍኦቢ ዋጋ',
    calcFarmgatePrice: 'የአርሶ አደር የቀይ ቼሪ ዋጋ (ብር/ኪ.ግ)',
    calcProcessingLoss: 'የማቀነባበር እና የወፍጮ ኪሳራ (%)',
    calcFreightDjibouti: 'የአገር ውስጥ ትራንስፖርት ወደ ጅቡቲ (ዶላር/ኮንቴነር)',
    calcPortHandling: 'የጅቡቲ ወደብ እና የማጽጃ ወጪ (ዶላር/ኮንቴነር)',
    calcNbeRetention: 'የብሔራዊ ባንክ የምንዛሪ ይዞታ (50% የውጭ ምንዛሪ / 50% ብር)',
    calcGrossRevenueUSD: 'አጠቃላይ የተገመተ ገቢ (ዶላር)',
    calcTotalCostsETB: 'ጠቅላላ የግብይት እና ትራንስፖርት ወጪ (ብር)',
    calcNetMarginUSD: 'የተጣራ ትርፍ (በዶላር)',
    calcNetMarginETB: 'የተጣራ ትርፍ (በኢትዮጵያ ብር)',
    calcMarginPercent: 'የትርፍ ህዳግ በመቶኛ',
    calcBreakevenFob: 'አነስተኛ ኪሳራ የማያደርስ ኤፍኦቢ ዋጋ',
    calcTimingAdvice: 'ስልታዊ የውል ጊዜ ምክር',
    calcSummaryHeading: 'የተሰላ የወጪ ንግድ ትርፍ ማጠቃለያ',

    fxTitle: 'የውጭ ምንዛሪ እና የማክሮ ኢኮኖሚ ስጋት ትንተና',
    fxSubtitle: 'ይፋዊ እና ትይዩ የምንዛሪ ተመን ልዩነት፣ የብሔራዊ ባንክ የውጭ ምንዛሪ ይዞታ ደንብ እና የቼሪ ግዢ ጣሪያ ዋጋ',
    fxOfficialRate: 'ይፋዊ የብሔራዊ ባንክ የምንዛሪ ተመን',
    fxParallelRate: 'ትይዩ የገበያ የምንዛሪ ተመን',
    fxParallelPremium: 'የትይዩ ገበያ ጭማሪ ልዩነት',
    fxDevaluationTrend: 'የብር ተመን ማስተካከያ አቅጣጫ',
    fxCherryParityCap: 'የቀይ ቼሪ ከፍተኛው አዋጭ የመግዣ ዋጋ',
    fxPolicySummary: 'የላኪዎች የምንዛሪ ይዞታ እና ገቢ ማስተላለፍ መመሪያ',

    compTitle: 'ዓለም አቀፍ የተፎካካሪ አምራች አገራት ንፅፅር',
    compSubtitle: 'የኢትዮጵያ ልዩ እና የንግድ ቡናዎች ከዋና ዋና አምራች አገራት (ኮሎምቢያ፣ ብራዚል፣ ቬትናም፣ ኬንያ፣ ጓቴማላ) ጋር ሲነፃፀሩ',
    compOrigin: 'አገር እና የተለመደ ደረጃ',
    compVariety: 'የቡና ዝርያ',
    compFobDifferential: 'የኤፍኦቢ ልዩነት ከአይሲኢ አንጻር',
    compBenchmarkPrice: 'ተግባራዊ ኤፍኦቢ ዋጋ',
    compCropStatus: 'የመኸር እና የምርት ሁኔታ',
    compExportPace: 'የወጪ ንግድ ፍጥነት እና የገበያ ፍላጎት',
    compCompetitiveAdvantage: 'የንግድ ተወዳዳሪነት መግለጫ',

    alertsModalTitle: 'የዋጋ ማንቂያ እና የአውሮፓ ህብረት EUDR ደንብ ዝግጁነት',
    alertsModalSubtitle: 'በቴሌግራም፣ በኤስኤምኤስ ወይም በዋትስአፕ የዋጋ ማንቂያዎችን ያዘጋጁ፤ የአውሮፓ ህብረት የደን ጭፍጨፋ ደንብ (EUDR) ፖሊጎን ዝግጁነትን ያረጋግጡ',
    alertsTabRules: 'የዋጋ እና የአየር ሁኔታ ማንቂያዎች',
    alertsTabEudr: 'የ EUDR ደንብ ዝግጁነት ኦዲት',
    alertsChannelLabel: 'የመልእክት መላኪያ መንገድ',
    alertsRecipientLabel: 'ተቀባይ (ስልክ / ቴሌግራም / ኢሜይል)',
    alertsRuleName: 'የማንቂያው ሁኔታ',
    alertsTriggerCondition: 'የመቀስቀሻ ደንብ',
    alertsSendTestBtn: 'የሙከራ ማንቂያ ላክ',
    alertsSending: 'ማንቂያ በመላክ ላይ...',
    eudrReadinessScore: 'የላኪው የ EUDR ዝግጁነት ውጤት',
    eudrPolygonAudit: 'የአርሶ አደሮች ጂፒኤስ (GPS) ፖሊጎን ካርታ',
    eudrFarmerRegistration: 'የአርሶ አደሮች የህብረት ስራ ማህበር ምዝገባ',
    eudrDueDiligenceDoc: 'የክትትል እና የጥንቃቄ ሰነዶች (DDS) ዝግጁነት',
    eudrEctaLink: 'የቡና እና ሻይ ባለስልጣን የብሔራዊ ጂኦ-ዳታቤዝ ግንኙነት',

    reportModalTitle: 'የሥራ አስፈፃሚ የገበያ መረጃ ዶሴ',
    reportPrintBtn: 'አትም / በ PDF መልክ አስቀምጥ',
    reportCloseBtn: 'ዶሴውን ዝጋ',
    reportDossierHeading: 'ሳምንታዊ የቡና ወጪ ንግድ ገበያ መረጃ ዶሴ',
    reportConfidentialNotice: 'ሚስጥራዊ የንግድ መረጃ ለኢትዮጵያ ቡና ላኪዎች እና የፋይናንስ አጋሮች',
    reportAuthorizedSignature: 'የዋና የሸቀጦች ዴስክ ህጋዊ ማረጋገጫ',

    copilotModalTitle: 'ኮፊ — የቡና ላኪዎች የ AI አማካሪ',
    copilotModalSubtitle: 'በጄሚኒ 3.8 ፍላሽ (Gemini 3.8 Flash) የሚሰራ፣ ለኢትዮጵያ ቡና ላኪዎች የተዘጋጀ የቀጥታ የገበያ ተንታኝ',
    copilotInputPlaceholder: 'ስለ ዋጋ፣ ስለ ኤፍኦቢ ልዩነት፣ ስለ EUDR ወይም ስለ መሸጫ ጊዜ ይጠይቁ...',
    copilotSendBtn: 'ተንታኙን ጠይቅ',
    copilotQuickQuestions: [
      'የይርጋጨፌ ጂ2 የታጠበ ቡና የወጪ ንግድ ትንበያ ምንድነው?',
      'የብራዚል ድርቅ በኢትዮጵያ የቡና ዋጋ ላይ ምን ተፅዕኖ አለው?',
      'ለአውሮፓ ገበያ የ EUDR ደንብን ለማሟላት ዋና ዋና መስፈርቶች ምንድናቸው?',
      'አሁን በቅድሚያ መሸጥ ይሻላል ወይስ ዋጋው እስኪጨምር መጠበቅ?',
    ],
    copilotDisclaimer: 'ይህ የ AI ምክር የቀጥታ የገበያ መረጃዎችን መሰረት ያደረገ የንግድ መረጃ ነው። ማንኛውንም ውል ከመፈረምዎ በፊት ከፋይናንስ እና ከሎጂስቲክስ አማካሪዎችዎ ጋር ያረጋግጡ።',

    loading: 'በመጫን ላይ...',
    close: 'ዝጋ',
    save: 'ለውጦችን መዝግብ',
    centsPerLb: 'የአሜሪካ ሳንቲም / ፓውንድ',
    usdPerKg: 'ዶላር / ኪሎግራም',
    etbPerKg: 'የኢትዮጵያ ብር / ኪሎግራም',
  },
};
