import {
  ExchangeQuote,
  EthiopianGradeQuote,
  HistoricalPricePoint,
  MarketForecast,
  NewsItem,
  NewsDigestData,
  ExchangeProsCons,
  MacroIndicator,
  CompetitorOrigin,
  MarketBriefData,
  GlobalCMarket,
  GlobalCHistoricalPoint,
} from '../types';

export const INITIAL_EXCHANGES: ExchangeQuote[] = [
  {
    id: 'ICE_ARABICA',
    name: 'ICE Coffee "C" Futures',
    symbol: 'KC (New York)',
    exchange: 'ICE Futures U.S.',
    location: 'New York, USA',
    priceCentsLb: 246.85,
    changeCentsLb: +4.20,
    changePercent: +1.73,
    highCentsLb: 249.50,
    lowCentsLb: 241.10,
    volume: '38,420 lots',
    openInterest: '241,180 lots',
    lastUpdated: 'Live Delay (10m)',
    unitLabel: 'US¢ / lb',
  },
  {
    id: 'ICE_ROBUSTA',
    name: 'ICE Robusta Coffee',
    symbol: 'RC (London)',
    exchange: 'ICE Futures Europe',
    location: 'London, UK',
    priceCentsLb: 213.40, // converted from ~$4,705 / MT
    changeCentsLb: -1.65,
    changePercent: -0.77,
    highCentsLb: 216.00,
    lowCentsLb: 211.80,
    volume: '19,250 lots',
    openInterest: '118,400 lots',
    lastUpdated: 'Live Delay (15m)',
    unitLabel: 'US¢ / lb ($4,705/MT)',
  },
  {
    id: 'ECX_ETHIOPIA',
    name: 'ECX Physical Indicative Avg',
    symbol: 'ECX-COMPOSITE',
    exchange: 'Ethiopian Commodity Exchange',
    location: 'Addis Ababa, Ethiopia',
    priceCentsLb: 288.40, // benchmark realized physical
    changeCentsLb: +6.50,
    changePercent: +2.31,
    highCentsLb: 292.00,
    lowCentsLb: 282.00,
    volume: '2,480 Bags (60kg eq)',
    openInterest: 'Floor Warehouse Receipts',
    lastUpdated: 'Today Floor Close',
    unitLabel: 'US¢ / lb eq.',
  },
];

export const ETHIOPIAN_GRADES: EthiopianGradeQuote[] = [
  {
    id: 'yirga_g1_w',
    gradeCode: 'YIRG-W1',
    region: 'Yirgacheffe',
    processing: 'Specialty Micro-lot',
    gradeNumber: 1,
    ecxPriceETBPerQuintal: 98500, // 98,500 ETB / 100kg
    ecxPriceUSDPerLb: 3.52,
    fobDjiboutiDiffCentsLb: +105,
    realizedFobUSDPerLb: 3.5185, // 246.85c + 105c
    changePercent: +3.4,
    cupProfile: 'Jasmine blossom, bergamot, peach nectar, bright citric acidity, 88.5 Q-score',
    harvestWindow: 'Nov - Jan (Main Crop)',
    status: 'High Demand',
  },
  {
    id: 'yirga_g2_w',
    gradeCode: 'YIRG-W2',
    region: 'Yirgacheffe',
    processing: 'Washed',
    gradeNumber: 2,
    ecxPriceETBPerQuintal: 87200,
    ecxPriceUSDPerLb: 3.12,
    fobDjiboutiDiffCentsLb: +68,
    realizedFobUSDPerLb: 3.1485,
    changePercent: +2.1,
    cupProfile: 'Lemon curd, black tea, floral honey, medium silky body, 85.5 Q-score',
    harvestWindow: 'Nov - Jan',
    status: 'High Demand',
  },
  {
    id: 'guji_g1_n',
    gradeCode: 'GUJI-N1',
    region: 'Guji',
    processing: 'Specialty Micro-lot',
    gradeNumber: 1,
    ecxPriceETBPerQuintal: 99800,
    ecxPriceUSDPerLb: 3.56,
    fobDjiboutiDiffCentsLb: +112,
    realizedFobUSDPerLb: 3.5885,
    changePercent: +4.2,
    cupProfile: 'Ripe blueberry, strawberry jam, candied violet, winey syrupy finish, 89 Q-score',
    harvestWindow: 'Dec - Feb',
    status: 'High Demand',
  },
  {
    id: 'sidamo_g2_w',
    gradeCode: 'SIDA-W2',
    region: 'Sidama',
    processing: 'Washed',
    gradeNumber: 2,
    ecxPriceETBPerQuintal: 83500,
    ecxPriceUSDPerLb: 2.98,
    fobDjiboutiDiffCentsLb: +55,
    realizedFobUSDPerLb: 3.0185,
    changePercent: +1.8,
    cupProfile: 'Apricot, orange peel, cane sugar, clean lively acidity, 85 Q-score',
    harvestWindow: 'Oct - Jan',
    status: 'Stable',
  },
  {
    id: 'sidamo_g4_n',
    gradeCode: 'SIDA-N4',
    region: 'Sidama',
    processing: 'Natural (Unwashed)',
    gradeNumber: 4,
    ecxPriceETBPerQuintal: 74200,
    ecxPriceUSDPerLb: 2.65,
    fobDjiboutiDiffCentsLb: +22,
    realizedFobUSDPerLb: 2.6885,
    changePercent: +1.1,
    cupProfile: 'Dried dark cherry, cocoa nibs, heavy body, rustic sweet finish',
    harvestWindow: 'Nov - Feb',
    status: 'Stable',
  },
  {
    id: 'limu_g2_w',
    gradeCode: 'LIMU-W2',
    region: 'Limu',
    processing: 'Washed',
    gradeNumber: 2,
    ecxPriceETBPerQuintal: 79800,
    ecxPriceUSDPerLb: 2.85,
    fobDjiboutiDiffCentsLb: +42,
    realizedFobUSDPerLb: 2.8885,
    changePercent: +0.9,
    cupProfile: 'Sweet wine, spiced caramel, balanced winey acidity, clean finish',
    harvestWindow: 'Nov - Jan',
    status: 'Stable',
  },
  {
    id: 'jimma_g5_n',
    gradeCode: 'JIMA-N5',
    region: 'Jimma',
    processing: 'Natural (Unwashed)',
    gradeNumber: 5,
    ecxPriceETBPerQuintal: 64500,
    ecxPriceUSDPerLb: 2.30,
    fobDjiboutiDiffCentsLb: -12,
    realizedFobUSDPerLb: 2.3485,
    changePercent: -0.8,
    cupProfile: 'Earthy, dark chocolate, woody note, high body, commercial blend base',
    harvestWindow: 'Oct - Dec',
    status: 'Discounted',
  },
  {
    id: 'harar_g4_n',
    gradeCode: 'HARA-N4',
    region: 'Harar',
    processing: 'Natural (Unwashed)',
    gradeNumber: 4,
    ecxPriceETBPerQuintal: 86000,
    ecxPriceUSDPerLb: 3.07,
    fobDjiboutiDiffCentsLb: +60,
    realizedFobUSDPerLb: 3.0685,
    changePercent: +2.5,
    cupProfile: 'Mocha, dark wild blackberry, fermented berry sweetness, cardamon',
    harvestWindow: 'Nov - Jan',
    status: 'Tight Supply',
  },
  {
    id: 'nekemte_g5_n',
    gradeCode: 'NEKM-N5',
    region: 'Keffa/Nekemte',
    processing: 'Natural (Unwashed)',
    gradeNumber: 5,
    ecxPriceETBPerQuintal: 66000,
    ecxPriceUSDPerLb: 2.36,
    fobDjiboutiDiffCentsLb: -8,
    realizedFobUSDPerLb: 2.3885,
    changePercent: +0.4,
    cupProfile: 'Fruity sweetness, pleasant acidity, body for commercial espresso roasts',
    harvestWindow: 'Nov - Jan',
    status: 'Stable',
  },
];

export const MACRO_RATES: MacroIndicator[] = [
  {
    name: 'NBE Official FX Rate',
    code: 'USD/ETB (Official)',
    value: 129.40,
    change: +0.35,
    unit: 'ETB per $1 USD',
    commentary: 'Crawling peg post-liberalization; narrowing parallel gap',
  },
  {
    name: 'Interbank Parallel Indicator',
    code: 'USD/ETB (Market Est.)',
    value: 152.80,
    change: -1.20,
    unit: 'ETB per $1 USD',
    commentary: 'Parallel premium compressed from 95% down to ~18%',
  },
  {
    name: 'Djibouti - North Europe Freight',
    code: 'SCFI (FEU 40ft)',
    value: 5850,
    change: +240,
    unit: 'USD / 40ft Container',
    commentary: 'Red Sea detour via Cape adds 12-16 transit days',
  },
  {
    name: 'ICE Certified Arabica Stocks',
    code: 'ICE-STOCKS',
    value: 812450,
    change: -12800,
    unit: 'Bags (60kg)',
    commentary: 'Antwerp & Bremen drawing down; supportive for futures',
  },
];

export const COMPETITORS: CompetitorOrigin[] = [
  {
    origin: 'Ethiopia (Yirgacheffe G2 Washed)',
    variety: 'Heirloom Arabica',
    fobDifferentialCentsLb: +68,
    priceUSDPerLb: 3.15,
    cropStatus: 'Meher harvest finishing, cherry processing at washing stations',
    exportPace: 'High demand from Scandinavian & US specialty buyers',
    qualityNotes: 'Benchmark floral citrus elegance, strong EUDR readiness',
  },
  {
    origin: 'Colombia (Excelso Huila)',
    variety: 'Castillo / Caturra Arabica',
    fobDifferentialCentsLb: +28,
    priceUSDPerLb: 2.75,
    cropStatus: 'Mitaca intermediate crop underway; weather favorable',
    exportPace: 'Steady deliveries to US East Coast roasters',
    qualityNotes: 'Clean milk chocolate, red apple, sweet cane sugar',
  },
  {
    origin: 'Brazil (Santos NY 2/3 FC)',
    variety: 'Mundo Novo / Catuai Arabica',
    fobDifferentialCentsLb: -12,
    priceUSDPerLb: 2.35,
    cropStatus: 'Dry flowering period in Minas Gerais raising 2026/27 crop worries',
    exportPace: 'Record export volumes shipped via Santos Port',
    qualityNotes: 'Low acidity, toasted walnut, heavy body for dark blends',
  },
  {
    origin: 'Vietnam (Robusta Grade 2, 5% black/broken)',
    variety: 'Robusta Canephora',
    fobDifferentialCentsLb: -22,
    priceUSDPerLb: 1.91,
    cropStatus: 'Harvest beginning in Central Highlands (Dak Lak)',
    exportPace: 'Slow farmer selling holding local prices elevated',
    qualityNotes: 'Cereal, burnt caramel, high caffeine espresso filler',
  },
  {
    origin: 'Kenya (AB Plus Nyeri)',
    variety: 'SL-28 / SL-34 Arabica',
    fobDifferentialCentsLb: +135,
    priceUSDPerLb: 3.82,
    cropStatus: 'Auction volumes lower due to seasonal lull',
    exportPace: 'Premium auction lots contested by European specialty roasters',
    qualityNotes: 'Blackcurrant, phosphoric acidity, savory berry notes',
  },
  {
    origin: 'Guatemala (SHB Huehuetenango)',
    variety: 'Bourbon / Catuai Arabica',
    fobDifferentialCentsLb: +48,
    priceUSDPerLb: 2.95,
    cropStatus: 'Early high-altitude cherries beginning ripening',
    exportPace: 'Moderate forward contract booking',
    qualityNotes: 'Plum, sweet honey, crisp malic acidity',
  },
];

export const PROS_CONS_DATA: Record<string, ExchangeProsCons> = {
  ICE_ARABICA: {
    exchangeName: 'ICE Coffee "C" Futures (New York)',
    currentSentiment: 'Bullish',
    pros: [
      'Unseasonable dry spell across Minas Gerais & São Paulo during critical flowering has ignited speculative fund buying.',
      'ICE certified Arabica warehouse stocks in Antwerp and Bremen dropped to under 820,000 bags.',
      'Strong forward bids from European buyers locking in early supply before new regulatory deadlines.',
    ],
    cons: [
      'Elevated interest rates keep warehouse carrying costs high for US and European roasters, keeping purchase lots smaller.',
      'Consumer retail elasticity: European supermarkets resisting further instant/roasted coffee price increases.',
      'Potential profit-taking from macro commodity hedge funds if USD index strengthens further.',
    ],
    basisCommentary: 'Physical Ethiopian Washed differentials are commanding +55¢ to +110¢ over ICE C, demonstrating that physical demand for specialty Ethiopian lots outpaces benchmark futures momentum.',
    actionLean: 'Favorable window to lock in 40-50% forward contracts on Washed grades (Yirgacheffe & Guji) for Q4 shipment.',
  },
  ICE_ROBUSTA: {
    exchangeName: 'ICE Robusta Coffee (London)',
    currentSentiment: 'Mixed',
    pros: [
      'Central Highlands Vietnam crop was impacted by early heat, keeping terminal stocks tight through Q3.',
      'High Robusta prices reduce the incentive for roasters to substitute Arabica with cheap Robusta.',
      'Commercial Ethiopian naturals (Jimma G5, Lekempti G5) are being picked up as competitive substitutes.',
    ],
    cons: [
      'Vietnam’s main 2026/27 harvest starts hitting export ports in 4-6 weeks, which historically softens prices.',
      'Indonesian crop has rebounded strongly, with Sumatra robusta arrivals up 18% month-on-month.',
    ],
    basisCommentary: 'The Arabica/Robusta arbitrage spread is currently ~33¢/lb — historically narrow. This tightness heavily favors commercial Ethiopian Naturals (Jimma/Lekempti) as blending alternatives.',
    actionLean: 'Sell Jimma and Lekempti natural stocks promptly before Vietnam arrivals peak in November.',
  },
  ECX_ETHIOPIA: {
    exchangeName: 'Ethiopian Commodity Exchange (ECX)',
    currentSentiment: 'Bullish',
    pros: [
      'NBE foreign exchange reforms have allowed exporters to retain higher effective value, sparking strong local bidding.',
      'Cooperative unions in Sidama and Yirgacheffe report premium cherry prices directly at washing stations.',
      'Direct export licenses through vertical integration continue to capture the full FOB premium over floor prices.',
    ],
    cons: [
      'Intense competition among domestic exporters has driven up local cherry gate prices faster than FOB differentials.',
      'High bank working capital lending rates (16-19%) constrain cash liquidity for non-union SME exporters.',
      'Local transport freight from Jimma/Hawassa to Addis/Djibouti has inflated by 14% due to diesel costs.',
    ],
    basisCommentary: 'ECX floor prices are currently trading at a tight parity to FOB Djibouti after netting out port handling and inland freight. Exporters must secure firm international forward contracts before buying aggressively at primary market centers.',
    actionLean: 'Prioritize Grade 1 and Grade 2 washed coffees with confirmed foreign buyer commitments to protect processing margins.',
  },
};

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: 'news-1',
    title: 'Dry Weather Persists in Brazil Coffee Belt; Minas Gerais Rainfall 40% Below Normal',
    summary: 'Meteorological stations across southern Minas Gerais and Cerrado Mineiro report dry soil moisture levels during initial blossom setting. Agronomists note risk to the 2026/27 Arabica crop if rains fail to normalize by early October.',
    exporterTakeaway: 'Supports ICE Arabica above 246¢/lb. Ethiopian exporters can leverage this rally to negotiate higher FOB differentials (+80¢ to +110¢) on Grade 1 Washed Yirgacheffe & Guji forward contracts.',
    category: 'Weather',
    source: 'Reuters AgriWire & INMET',
    publishedAt: '2 hours ago',
    sentiment: 'Bullish',
    impactMagnitude: 'High',
    affectedMarkets: ['ICE Arabica', 'ECX'],
    keyEntities: ['Brazil', 'Minas Gerais', 'Arabica', 'NOAA'],
  },
  {
    id: 'news-2',
    title: 'Red Sea Transit Reroutes Push Djibouti-Rotterdam Freight Transit to 34 Days',
    summary: 'Container carriers continue routing container ships around South Africa’s Cape of Good Hope. Djibouti port reports container yard dwell times averaging 11 days, while ocean freight surcharges add ~$180-$240 per TEU for European destinations.',
    exporterTakeaway: 'Cape detour adds 14 days of shipping delay. Exporters should adjust delivery commitments with European roasters and lock in container bookings at Djibouti port at least 3 weeks in advance.',
    category: 'Logistics/Shipping',
    source: 'Lloyds List & Freightos',
    publishedAt: '5 hours ago',
    sentiment: 'Bearish',
    impactMagnitude: 'High',
    affectedMarkets: ['FOB Djibouti', 'ECX'],
    keyEntities: ['Djibouti Port', 'Red Sea', 'Rotterdam', 'Shipping'],
  },
  {
    id: 'news-3',
    title: 'EU Deforestation Regulation (EUDR): EU Parliament Confirms Implementation Timeline with SME Guidance',
    summary: 'The European Commission has reaffirmed enforcement milestones for coffee imports, requiring geolocation polygon data for plots larger than 4 hectares. Ethiopian Coffee and Tea Authority announces national GPS mapping integration for cooperative unions.',
    exporterTakeaway: 'Parcels with validated farm polygon certificates command an 8-12¢ premium in Europe. Non-compliant lots face port rejection risk. Coordinate immediately with ECTA or union registry.',
    category: 'Regulation (EUDR, tariffs)',
    source: 'European Commission Trade & ECTA',
    publishedAt: '1 day ago',
    sentiment: 'Bullish',
    impactMagnitude: 'High',
    affectedMarkets: ['ICE Arabica', 'ECX', 'FOB Djibouti'],
    keyEntities: ['EUDR', 'ECTA', 'European Union', 'Traceability'],
  },
  {
    id: 'news-4',
    title: 'National Bank of Ethiopia (NBE) Reports Foreign Exchange Market Stability Post-Reform',
    summary: 'Commercial banks in Addis Ababa report steady FX auction allocations, with the official exchange rate stabilizing around 129 ETB/USD while parallel spreads drop to 18%. Exporters benefit from clear repatriation and retention timelines.',
    exporterTakeaway: 'Foreign exchange certainty enables accurate budgeting for local primary market cherry purchasing in Sidama and Yirgacheffe, stabilizing local working capital credit lines.',
    category: 'Currency/Macro',
    source: 'Addis Fortune & NBE Bulletin',
    publishedAt: '1 day ago',
    sentiment: 'Neutral',
    impactMagnitude: 'Medium',
    affectedMarkets: ['ECX'],
    keyEntities: ['NBE', 'ETB', 'FX Liberalization', 'Commercial Banks'],
  },
  {
    id: 'news-5',
    title: 'Vietnam Central Highlands Robusta Harvest Delayed by Sporadic Rains in Dak Lak',
    summary: 'Harvesting in Vietnam’s key coffee province is approximately 10 to 14 days behind historical averages. Processing stations report low cherry inventory, preventing speculative dumping on ICE London terminals.',
    exporterTakeaway: 'Narrow Arabica/Robusta spread creates immediate demand from global blenders for natural commercial coffees like Jimma Grade 5 and Lekempti as cost-effective substitutes.',
    category: 'Crop/Harvest',
    source: 'Comunicaffe & Vietnam VICOFA',
    publishedAt: '2 days ago',
    sentiment: 'Bullish',
    impactMagnitude: 'Medium',
    affectedMarkets: ['ICE Robusta', 'ECX'],
    keyEntities: ['Vietnam', 'Dak Lak', 'Robusta', 'Harvest'],
  },
  {
    id: 'news-6',
    title: 'International Coffee Organization (ICO) Composite Indicator Reaches 18-Month Peak',
    summary: 'The ICO monthly report indicates global coffee exports reached 10.92 million bags, but consumer inventories in destination ports remain 14% below the 5-year average, creating underlying structural support for premium origins.',
    exporterTakeaway: 'Low destination stocks mean European and Japanese roasters must replenish inventories regardless of price spikes, cementing a strong bargaining position for Ethiopian specialty exporters.',
    category: 'Demand/Consumption',
    source: 'ICO Market Report',
    publishedAt: '3 days ago',
    sentiment: 'Bullish',
    impactMagnitude: 'Medium',
    affectedMarkets: ['ICE Arabica', 'ICE Robusta'],
    keyEntities: ['ICO', 'Global Stocks', 'Roasters', 'Consumption'],
  },
];

export const INITIAL_NEWS_AM: NewsItem[] = [
  {
    id: 'news-1',
    title: 'በብራዚል የቡና አብቃይ ቀጠናዎች ድርቅ መቀጠል፤ የሚናስ ጌራይስ ዝናብ ከመደበኛው 40% በታች መሆኑ',
    summary: 'በደቡባዊ ሚናስ ጌራይስና ሴራዶ ሚኔሮ በሚገኙ የሚቲዎሮሎጂ ጣቢያዎች በአበባ ወቅት የአፈር እርጥበት እጅግ ዝቅተኛ መሆኑ ተዘግቧል። ዝናቡ እስከ ጥቅምት ካልተስተካከለ የ2026/27 የአራቢካ ምርት ላይ አደጋ እንዳለው የግብርና ባለሙያዎች አስጠንቅቀዋል።',
    exporterTakeaway: 'የአይሲኢ አራቢካ ዋጋ ከ 246¢/lb በላይ ጸንቶ እንዲቆይ ድጋፍ ሰጥቷል፤ ለታጠበ ይርጋጨፌ እና ጉጂ ደረጃ 1/2 ቡናዎች የውጭ ገዢዎች የሚሰጡትን የልዩነት ዋጋ (FOB Differential) እስከ +80¢ እና ከዚያ በላይ እንዲያሰሩ ምቹ ዕድል ይፈጥራል።',
    category: 'Weather',
    source: 'ሮይተርስ አግሪዋየር እና INMET',
    publishedAt: 'ከ 2 ሰዓት በፊት',
    sentiment: 'Bullish',
    impactMagnitude: 'High',
    affectedMarkets: ['ICE Arabica', 'ECX'],
    keyEntities: ['ብራዚል', 'ሚናስ ጌራይስ', 'አራቢካ', 'ድርቅ'],
  },
  {
    id: 'news-2',
    title: 'የቀይ ባህር መተላለፊያ መዘጋት የጅቡቲ-ሮተርዳም የባህር ጉዞን ወደ 34 ቀናት ማራዘሙ',
    summary: 'የኮንቴነር መርከቦች በደቡብ አፍሪካ ኬፕ ኦፍ ጉድ ሆፕ ዙሪያ መጓዛቸውን ቀጥለዋል። በጅቡቲ ወደብ የኮንቴነሮች የመቆያ ጊዜ በአማካይ 11 ቀናት ደርሷል፤ ለአውሮፓ መዳረሻዎች የባህር ጭነት ተጨማሪ ክፍያ በቲኢዩ ከ$180-$240 ጨምሯል።',
    exporterTakeaway: 'በኬፕ ኦፍ ጉድ ሆፕ በኩል ያለው ጉዞ ወደ አውሮፓ ወደቦች የሚደረገውን ርክክብ በ 14 ቀናት ያዘገያል፤ ከአውሮፓ ገዢዎች ጋር በውል ላይ የተቀመጠውን የርክክብ ጊዜ ማራዘም እና በጅቡቲ ወደብ የኮንቴነር ማስያዣ ቦታዎችን ቀድሞ መያዝ ወሳኝ ነው።',
    category: 'Logistics/Shipping',
    source: 'ሎይድስ ሊስት እና ፍሬይቶስ',
    publishedAt: 'ከ 5 ሰዓት በፊት',
    sentiment: 'Bearish',
    impactMagnitude: 'High',
    affectedMarkets: ['FOB Djibouti', 'ECX'],
    keyEntities: ['ጅቡቲ ወደብ', 'ቀይ ባህር', 'ኬፕ ኦፍ ጉድ ሆፕ', 'ሮተርዳም'],
  },
  {
    id: 'news-3',
    title: 'የአውሮፓ ህብረት የደን ጭፍጨፋ ደንብ (EUDR)፦ የአውሮፓ ፓርላማ የማስፈጸሚያ ጊዜውን አረጋገጠ',
    summary: 'የአውሮፓ ኮሚሽን ከ4 ሄክታር በላይ ለሆኑ የቡና እርሻዎች የጂኦ-ሎኬሽን ፖሊጎን ካርታ መረጃ የሚያስገድደውን ህግ ተግባራዊነት በድጋሚ አረጋግጧል። የኢትዮጵያ ቡናና ሻይ ባለስልጣን (ECTA) ለአርሶ አደሮች የህብረት ስራ ማህበራት ብሔራዊ የጂፒኤስ ካርታ ስርዓት ዝግጅት እያፋጠነ ነው።',
    exporterTakeaway: 'የተሟላ የጂፒኤስ ፖሊጎን ካርታ ሰነድ ያላቸው ላኪዎች በአውሮፓ ገበያ በፓውንድ ከ 8-12 ሳንቲም ተጨማሪ ፕሪሚየም ያገኛሉ፤ ያልተመዘገቡ ግን ወደ አውሮፓ የማስገባት እገዳ ሊገጥማቸው ይችላል።',
    category: 'Regulation (EUDR, tariffs)',
    source: 'የአውሮፓ ኮሚሽን እና ECTA',
    publishedAt: 'ከ 1 ቀን በፊት',
    sentiment: 'Bullish',
    impactMagnitude: 'High',
    affectedMarkets: ['ICE Arabica', 'ECX', 'FOB Djibouti'],
    keyEntities: ['EUDR', 'ECTA', 'አውሮፓ ህብረት', 'ጂፒኤስ ፖሊጎን'],
  },
  {
    id: 'news-4',
    title: 'የኢትዮጵያ ብሔራዊ ባንክ (NBE) የውጭ ምንዛሪ ማሻሻያ መረጋጋት ማሳየቱን ይፋ አደረገ',
    summary: 'በአዲስ አበባ የሚገኙ የንግድ ባንኮች የተረጋጋ የውጭ ምንዛሪ ጨረታዎች መካሄዳቸውን ገልጸዋል፤ ይፋዊው የምንዛሪ ተመን በ129 ብር/ዶላር አካባቢ የተረጋጋ ሲሆን የትይዩ ገበያ ልዩነት ወደ 18% ወርዷል። ላኪዎች ከምንዛሪ ማቆያ (Retention) ደንቦች ተጠቃሚ ሆነዋል።',
    exporterTakeaway: 'የባንክ ምንዛሪ ይዞታ ግልጽ መሆኑ ላኪዎች በአገር ውስጥ የመጀመሪያ ደረጃ ገበያዎች (ECX እና ፕራይማሪ ማርኬቶች) ለቀይ ቼሪ ግዢ የሚያስፈልጋቸውን የብር በጀት በትክክል እንዲያቅዱ ይረዳል።',
    category: 'Currency/Macro',
    source: 'አዲስ ፎርቹን እና የብሔራዊ ባንክ መግለጫ',
    publishedAt: 'ከ 1 ቀን በፊት',
    sentiment: 'Neutral',
    impactMagnitude: 'Medium',
    affectedMarkets: ['ECX'],
    keyEntities: ['ብሔራዊ ባንክ', 'የውጭ ምንዛሪ', 'ብር', 'የንግድ ባንኮች'],
  },
  {
    id: 'news-5',
    title: 'የቪየትናም የማዕከላዊ ደጋማ ቦታዎች የሮቡስታ መኸር በዝናብ መዘግየቱ',
    summary: 'በቪየትናም ዋነኛ የቡና አብቃይ ግዛት በዳክ ላክ የመኸር ወቅት ከተለመደው ከ10 እስከ 14 ቀናት ዘግይቷል። የማቀነባበሪያ ጣቢያዎች አነስተኛ የቼሪ ክምችት እንዳላቸው የገለጹ ሲሆን፣ ይህም በለንደን አይሲኢ ተርሚናል ላይ የዋጋ ውድቀት እንዳይከሰት አግዟል።',
    exporterTakeaway: 'የአራቢካና የሮቡስታ የዋጋ ልዩነት በመጥበቡ ምክንያት፣ ለኢትዮጵያ ተፈጥሯዊ የንግድ ቡናዎች (እንደ ጅማ ደረጃ 5 እና ለቀምቲ) አለም አቀፍ ድብልቅ አዘጋጆች ከፍተኛ ፍላጎት እንዲያሳዩ አድርጓል።',
    category: 'Crop/Harvest',
    source: 'ኮሚዩኒካፌ እና ቪኮፋ ቪየትናም',
    publishedAt: 'ከ 2 ቀናት በፊት',
    sentiment: 'Bullish',
    impactMagnitude: 'Medium',
    affectedMarkets: ['ICE Robusta', 'ECX'],
    keyEntities: ['ቪየትናም', 'ዳክ ላክ', 'ሮቡስታ', 'መኸር'],
  },
  {
    id: 'news-6',
    title: 'የዓለም አቀፍ የቡና ድርጅት (ICO) የተቀናጀ የዋጋ ማመላከቻ የ 18 ወራት ከፍተኛ ደረጃ ደረሰ',
    summary: 'የወርሃዊው የ ICO ሪፖርት ዓለም አቀፍ የቡና ኤክስፖርት 10.92 ሚሊዮን ከረጢት መድረሱን አመልክቷል፤ ነገር ግን በመዳረሻ ወደቦች ያለው የሸማቾች ክምችት ከአምስት ዓመታት አማካይ በታች 14% ዝቅተኛ በመሆኑ ለፕሪሚየም ጥራት ቡናዎች ቀጣይነት ያለው የዋጋ ድጋፍ ፈጥሯል።',
    exporterTakeaway: 'በአውሮፓና አሜሪካ የመጋዘን ክምችት ማነሱ የኢትዮጵያ ስፔሻሊቲ ማይክሮ-ሎቶች (ይርጋጨፌ፣ ጉጂ፣ ሲዳማ ደረጃ 1) እስከ ቀጣዩ የበልግ ወቅት ድረስ ከፍተኛ ዋጋቸውን እንዲጠብቁ ያደርጋል።',
    category: 'Demand/Consumption',
    source: 'የ ICO የገበያ ሪፖርት',
    publishedAt: 'ከ 3 ቀናት በፊት',
    sentiment: 'Bullish',
    impactMagnitude: 'Medium',
    affectedMarkets: ['ICE Arabica', 'ICE Robusta'],
    keyEntities: ['ICO', 'አለም አቀፍ ክምችት', 'ቆዪዎች', 'ፍጆታ'],
  },
];

export const INITIAL_NEWS_DIGEST: NewsDigestData = {
  digestHeadline: 'Global Supply Tightness and Red Sea Transit Delays Elevate Ethiopian FOB Differentials',
  digestSummary: 'Global macroeconomic drivers remain structurally bullish for Ethiopian coffee exporters. Brazilian soil moisture deficits are supporting ICE Arabica near 247¢/lb, while narrow Robusta-Arabica arbitrage spreads sustain intense demand for commercial unwashed naturals. Concurrently, Cape of Good Hope rerouting adds roughly two weeks to European transit, rewarding exporters who secure early container allocations at Djibouti port.',
  localExporterImpact: 'For local exporters and cooperative unions in Sidama, Yirgacheffe, and Guji, current farmgate cherry prices (210-235 ETB/kg) are fully covered by expanding export differentials (+70¢ to +110¢). Strict prioritization of forward sales on Grade 1 and Grade 2 washed lots and proactive EUDR GPS mapping submission to ECTA will ensure seamless customs clearance in European ports without demurrage.',
  keyActionItems: [
    'Lock in forward commitments for 40-50% of washed specialty volume (Yirgacheffe/Guji G1) at current elevated differentials.',
    'Book Djibouti export container slots 3-4 weeks ahead to mitigate Cape of Good Hope dwell time delays.',
    'Complete farm-level GPS polygon mapping data with cooperative unions to capture the 8-12¢ EUDR compliance premium.',
  ],
  generatedAt: 'September 19, 2026 — 08:45 EAT',
  source: 'Gemini 3.8 Flash Commodities Intelligence',
};

export const INITIAL_NEWS_DIGEST_AM: NewsDigestData = {
  digestHeadline: 'የአለም አቀፍ አቅርቦት ጥበት እና የቀይ ባህር መዘግየት የኢትዮጵያ ቡና ልዩነት ዋጋን አጠናከሩት',
  digestSummary: 'አለም አቀፍ የኮሞዲቲ ሁኔታዎች ለኢትዮጵያ ቡና ላኪዎች ከፍተኛ የገበያ ድጋፍ እየሰጡ ይገኛሉ። በብራዚል ያለው የአፈር እርጥበት እጥረት የአይሲኢ አራቢካ ዋጋ በ 247¢/lb አካባቢ እንዲጸና ሲያደርግ፣ የሮቡስታ እና አራቢካ የዋጋ መቀራረብ ደግሞ ለተፈጥሯዊ የንግድ ቡናዎቻችን (እንደ ጅማ ደረጃ 5) ከፍተኛ አለም አቀፍ ፍላጎት ፈጥሯል። በተመሳሳይ ጊዜ በኬፕ ኦፍ ጉድ ሆፕ በኩል ያለው የባህር ጉዞ ወደ አውሮፓ የሚወስደውን ጊዜ በሁለት ሳምንታት ስላራዘመው፣ በጅቡቲ ወደብ ቀድመው ኮንቴነር የሚያስይዙ ላኪዎች ከፍተኛ ተጠቃሚ ናቸው።',
  localExporterImpact: 'በሲዳማ፣ ይርጋጨፌ እና ጉጂ ለሚገኙ ላኪዎች እና የአርሶ አደሮች ህብረት ስራ ማህበራት አሁን በዋሺንግ ስቴሽኖች ያለው የቀይ ቼሪ መግዣ ዋጋ (210-235 ብር/ኪግ) በኤፍኦቢ የልዩነት ዋጋ (+70¢ እስከ +110¢) ሙሉ በሙሉ የተደገፈ ነው። የታጠበ ደረጃ 1 እና 2 ቡናዎችን በቅድመ-ሽያጭ ውል ማሰር እና የ EUDR ጂፒኤስ ፖሊጎን ካርታ መረጃዎችን ለቡናና ሻይ ባለስልጣን (ECTA) ቀድሞ ማስረከብ ምርት በአውሮፓ ወደቦች ያለ ምንም መዘግየትና ኪሳራ እንዲገባ ያደርጋል።',
  keyActionItems: [
    'ካለዎት የታጠበ ስፔሻሊቲ ቡና (ይርጋጨፌ/ጉጂ ደረጃ 1) ከ 40-50% የሚሆነውን አሁን ባለው ከፍተኛ ልዩነት ዋጋ በቅድመ ውል ያስሩ።',
    'በኬፕ ኦፍ ጉድ ሆፕ ምክንያት የሚፈጠረውን መዘግየት ለመከላከል የጅቡቲ ወደብ የኮንቴነር ቦታዎችን ከ3-4 ሳምንታት ቀድመው ያስይዙ።',
    'ከአውሮፓ ገዢዎች የሚሰጠውን ከ 8-12 ሳንቲም ተጨማሪ ክፍያ (EUDR ፕሪሚየም) ለማግኘት የጂፒኤስ ፖሊጎን ካርታዎችን ከህብረት ስራ ማህበራት ጋር ያጠናቁ።',
  ],
  generatedAt: 'መስከረም 19 ቀን 2026 — 08:45 EAT (አዲስ አበባ)',
  source: 'በጄሚኒ 3.8 ፍላሽ የተጠናቀረ የገበያ መረጃ',
};

export const INITIAL_BRIEF_AM: MarketBriefData = {
  generatedDate: 'መስከረም 19 ቀን 2026 — 08:30 EAT (አዲስ አበባ)',
  headline: 'የአራቢካ ዋጋ በብራዚል የዝናብ እጥረት ሳቢያ ጨመረ፤ የኢትዮጵያ የታጠበ ቡና ልዩነት ዋጋ ሰፋ',
  executiveSummary: 'ዓለም አቀፍ የቡና ገበያ ከፍተኛ የመዋዠቅ ሁኔታ ውስጥ ይገኛል። አይሲኢ አራቢካ የ 250¢/lb የመቋቋሚያ ጣሪያን እየፈተሸ ሲሆን፣ በብራዚል ደቡባዊ የቡና አብቃይ አካባቢዎች የዝናብ እጥረት መከሰቱ ተረጋግጧል። ለኢትዮጵያ ላኪዎች ፊዚካል ገበያው እጅግ አመቺ ነው: የይርጋጨፌ እና ጉጂ ደረጃ 1 እና 2 የታጠበ ቡና ልዩነት ዋጋ ባለፉት ሁለት ሳምንታት ከ +12¢ እስከ +18¢ ጨምሯል። ሆኖም በኬፕ ኦፍ ጉድ ሆፕ በኩል ያለው ረጅም የባህር ጉዞ ወደ አውሮፓ የሚደረገውን ርክክብ በ 14 ቀናት ያዘገያል፤ ላኪዎች በጅቡቲ ወደብ የኮንቴነር ማስያዣ ቦታዎችን ቀድመው መያዝ አለባቸው።',
  topMovers: [
    {
      headline: 'የብራዚል የአፈር እርጥበት እጥረት',
      description: 'በሚናስ ጌራይስ የሚገኙ የአየር ሁኔታ ጣቢያዎች በአበባ ወቅት ከ 10 ዓመታት አማካይ በታች 42% ዝናብ መመዝገባቸውን ገለፁ።',
      impact: 'በአይሲኢ ኒው ዮርክ ላይ +4.20¢',
      source: 'INMET / Somar Meteorologia',
    },
    {
      headline: 'የኢትዮጵያ የታጠበ ቡና ልዩነት ዋጋ መጨመር',
      description: 'ልዩ ማይክሮ-ሎቶች (ጉጂ ደረጃ 1፣ ይርጋ ደረጃ 1) ከአውሮፓ ቀደምት ትዕዛዞች በመነሳት ከኒው ዮርክ በላይ ከ +105¢ እስከ +112¢/lb እየተሸጡ ነው።',
      impact: 'ተጨባጭ +$0.18/lb ጭማሪ',
      source: 'የቡናና ሻይ ባለስልጣን / የላኪዎች ማህበር',
    },
    {
      headline: 'የጅቡቲ የባህር ትራንስፖርት ጭማሪ',
      description: 'መርከቦች በኬፕ ኦፍ ጉድ ሆፕ በኩል በመዞራቸው የኮንቴነር ጭነት ዋጋ $5,850/FEU ደርሷል፤ በጅቡቲ የኮንቴነር እጥረት ተስተውሏል።',
      impact: 'ከ 12-16 ቀናት መዘግየት',
      source: 'Freightos Index / Maersk Advisory',
    },
    {
      headline: 'የ EUDR ደንብ ዝግጅት ግፊት',
      description: 'የአውሮፓ ገዢዎች የተረጋገጠ የጂፒኤስ ፖሊጎን ካርታ ላላቸው ላኪዎች ቅድሚያ እየሰጡ ሲሆን ከ 8-12¢ ተጨማሪ ዋጋ ይከፍላሉ።',
      impact: 'ለተዘጋጁ ምርቶች ተጨማሪ ክፍያ',
      source: 'የአውሮፓ ቡና ፌዴሬሽን',
    },
  ],
  bullishFactors: [
    {
      exchange: 'አይሲኢ አራቢካ (ኒው ዮርክ)',
      title: 'የተረጋገጠ ክምችት መቀነስ',
      evidence: 'በአውሮፓ የአይሲኢ መጋዘኖች ያለው የተረጋገጠ ክምችት ከ 820,000 ከረጢት በታች ዝቅ ብሏል።',
      source: 'የአይሲኢ ፊውቸርስ ገበያ ሪፖርት',
    },
    {
      exchange: 'ምርት ገበያ እና ቀጥታ ኤክስፖርት',
      title: 'ከጃፓንና ስካንዲኔቪያ ጠንካራ የቅድሚያ ግዥ',
      evidence: 'ከፍተኛ ደረጃ ቆዪዎች ለታጠበ ይርጋጨፌ ደረጃ 2 በ $3.15-$3.30/lb FOB የክረምት አቅርቦት ለማረጋገጥ ውል እያሰሩ ነው።',
      source: 'የአዲስ አበባ ቡና ላኪዎች ማህበር',
    },
    {
      exchange: 'አይሲኢ ሮቡስታ (ለንደን)',
      title: 'የቪየትናም ዳክ ላክ ምርት መዘግየት',
      evidence: 'የቼሪ ብስለት መዘግየት ምርት በገበያ ላይ በፍጥነት እንዳይበዛ አድርጎታል፤ ይህም ለቡና ድብልቅ ዋጋ ድጋፍ ሰጥቷል።',
      source: 'ቪኮፋ ቪየትናም',
    },
  ],
  bearishFactors: [
    {
      exchange: 'ሎጅስቲክስ / ኤፍኦቢ ጅቡቲ',
      title: 'ከፍተኛ የስራ ካፒታል እና የትራንስፖርት ወጪ',
      evidence: 'የኮንቴነር ኪራይ እና የባህር ኢንሹራንስ ክፍያዎች በአንድ ሜትሪክ ቶን ከ $120-$160 የሚደርስ የተጣራ ትርፍ ይቀንሳሉ።',
      source: 'የቀይ ባህር ትራንዚት መረጃ',
    },
    {
      exchange: 'አይሲኢ አራቢካ (ኒው ዮርክ)',
      title: 'የግምት ፈንድ አደጋ',
      evidence: 'የ CFTC ሪፖርት የገንዘብ አስተዳዳሪዎች የግዥ አቋም ባለፉት 2 ዓመታት ከፍተኛ ደረጃ ላይ መድረሱን ያሳያል፤ ይህም የድንገተኛ ሽያጭ ስጋት አለው።',
      source: 'የአሜሪካ CFTC ሪፖርት',
    },
  ],
  watchList: [
    {
      event: 'የብራዚል የ 39ኛው ሳምንት የአየር ሁኔታ ትንበያ',
      date: 'የሚመጣው ማክሰኞ',
      expectedMarketEffect: 'የፀደይ ዝናብ መጣል ከ 8-12¢ ቅናሽ ሊያመጣ ይችላል፤ ድርቁ ከቀጠለ ግን አይሲኢ ወደ 260¢ ሊወጣ ይችላል።',
    },
    {
      event: 'የብሔራዊ ባንክ ወርሃዊ የውጭ ምንዛሪ ግምገማ',
      date: 'መስከረም 28',
      expectedMarketEffect: 'በመጀመሪያ ደረጃ ገበያዎች ላይ ያለውን የብር የመግዛት አቅም የሚነኩ የይዞታ ወይም የባንክ ገደቦች ማሻሻያ ሊደረግ ይችላል።',
    },
    {
      event: 'የቡናና ሻይ ባለስልጣን የ EUDR ብሔራዊ ምዝገባ ይፋ ማድረግ',
      date: 'ጥቅምት 5',
      expectedMarketEffect: 'ወደ ሀምበርግ እና አንትወርፕ ለሚላኩ ምርቶች ዲጂታል ማረጋገጫዎችን ያፋጥናል።',
    },
  ],
};

export const INITIAL_BRIEF: MarketBriefData = {
  generatedDate: 'September 19, 2026 — 08:30 EAT (Addis Ababa)',
  headline: 'Arabica Momentum Driven by Brazil Flowering Deficit; Ethiopian Washed Differentials Expand',
  executiveSummary: 'Global coffee markets are entering a high-volatility window. ICE Arabica C is testing the 250¢/lb psychological resistance level on confirmed below-average rainfall across Brazil’s southern coffee belt. For Ethiopian exporters, the physical market is extraordinarily supportive: Yirgacheffe and Guji Grade 1/2 washed differentials have expanded by +12¢ to +18¢ over the past fortnight. However, extended maritime routing around the Cape of Good Hope adds 14 days to European deliveries; exporters must lock in container booking slots at Djibouti port early.',
  topMovers: [
    {
      headline: 'Brazil Soil Moisture Stress',
      description: 'Minas Gerais weather stations logged 42% below 10-year mean precipitation during initial flowering, triggering commercial short-covering.',
      impact: '+4.20¢ on ICE NY',
      source: 'INMET / Somar Meteorologia',
    },
    {
      headline: 'Ethiopian Washed Differentials Firm',
      description: 'Specialty micro-lots (Guji G1, Yirga G1) commanding +105¢ to +112¢/lb over New York, driven by early European pre-commitments.',
      impact: '+$0.18/lb Realized',
      source: 'ECTA / Exporters Guild',
    },
    {
      headline: 'Djibouti Maritime Surcharges',
      description: 'Cape of Good Hope circumnavigation elevates ocean freight to $5,850/FEU with container shortages reported in Djibouti logistics corridors.',
      impact: '12-16 Days Delay',
      source: 'Freightos Index / Maersk Advisory',
    },
    {
      headline: 'EUDR Readiness Push',
      description: 'European roasters are actively prioritizing exporters with verified polygon data, offering 8-12¢ green premiums for compliant parcels.',
      impact: 'Premium for Ready Lots',
      source: 'European Coffee Federation',
    },
  ],
  bullishFactors: [
    {
      exchange: 'ICE Arabica (NY)',
      title: 'Certified Stock Depletion',
      evidence: 'Certified stocks at ICE warehouses in Europe have fallen below 820,000 bags with limited new gradings submitted.',
      source: 'ICE Futures Exchange Report',
    },
    {
      exchange: 'ECX Physical & Direct Export',
      title: 'Strong Japanese & Scandinavian Pre-Bookings',
      evidence: 'High-end roasteries are placing firm orders for Washed Yirgacheffe G2 at $3.15-$3.30/lb FOB to secure early winter deliveries.',
      source: 'Addis Ababa Exporters Association',
    },
    {
      exchange: 'ICE Robusta (London)',
      title: 'Vietnam Dak Lak Crop Delays',
      evidence: 'Slow cherry maturation prevents supply dumping, keeping the Robusta floor firm and supporting overall beverage blend pricing.',
      source: 'VICOFA Vietnam',
    },
  ],
  bearishFactors: [
    {
      exchange: 'Logistics / FOB Djibouti',
      title: 'Elevated Working Capital & Freight Toll',
      evidence: 'Container leasing fees and marine insurance risk premiums erode approximately $120-$160 per metric tonne of net margin.',
      source: 'Red Sea Transit Intelligence',
    },
    {
      exchange: 'ICE Arabica (NY)',
      title: 'Speculative Fund Overhang',
      evidence: 'CFTC Commitment of Traders (COT) report shows Managed Money net-long positions near 2-year highs, raising risk of sudden technical liquidation.',
      source: 'CFTC Commitment of Traders',
    },
  ],
  watchList: [
    {
      event: 'Somar Brazil Weather Outlook (Week 39)',
      date: 'Next Tuesday',
      expectedMarketEffect: 'Confirmation of spring rains could trigger 8-12¢ pullback; continued drought could propel ICE C to 260¢.',
    },
    {
      event: 'National Bank of Ethiopia (NBE) Monthly FX Review',
      date: 'September 28',
      expectedMarketEffect: 'May adjust retention rules or interbank limits affecting local Birr purchasing power for primary market auctions.',
    },
    {
      event: 'ECTA EUDR National Polygon Registry Launch',
      date: 'October 5',
      expectedMarketEffect: 'Will streamline digital compliance certificates for certified exporters dispatching to Hamburg & Antwerp.',
    },
  ],
};

export const INITIAL_FORECAST: MarketForecast = {
  targetMarket: 'ICE Arabica C & Ethiopian Washed Physicals',
  horizon: '1-4 Weeks (Short Term)',
  currentPriceCentsLb: 246.85,
  expectedPriceCentsLb: 257.40,
  rangeLowCentsLb: 242.00,
  rangeHighCentsLb: 268.50,
  confidenceIntervalPercent: 68,
  signal: 'STRONG_SELL_FORWARD',
  signalLean: 'Sell 40% forward on Washed, Hold Naturals',
  recommendationSummary: 'Model signals an asymmetric upside window over the next 14 to 28 days as Brazil flowering dry-spell sentiment peaks. Recommended strategy for Ethiopian exporters: secure 40-50% of your expected Washed volume (Yirgacheffe/Sidamo G2) via forward sales at current elevated differentials (+65¢ to +85¢). For commercial Naturals (Jimma G5), hold inventory until October to observe Vietnam’s harvest flow.',
  topDrivers: [
    {
      factor: 'Brazil Soil Moisture Anomaly (Minas Gerais)',
      impact: 'Bullish',
      weightPercent: 42,
      description: 'Historical regressions show dry Sept/Oct flowering adds an average of 14.8¢/lb to Arabica front-month contracts.',
      source: 'NOAA / Brazilian Agronomy Models',
    },
    {
      factor: 'ICE Warehouse Certified Stock Drawdown',
      impact: 'Bullish',
      weightPercent: 28,
      description: 'Warehouse drawdown of 48k bags over past 30 days leaves European roasters with reduced spot safety buffers.',
      source: 'ICE Exchange Daily Warehouse Statistics',
    },
    {
      factor: 'Red Sea Cape Route Freight Surcharges',
      impact: 'Bearish',
      weightPercent: 18,
      description: 'Longer sailing times cause international buyers to bid conservatively on distant FOB ports to buffer working capital.',
      source: 'Freightos Marine Index',
    },
    {
      factor: 'USD / ETB Post-Reform Adjustment',
      impact: 'Bullish',
      weightPercent: 12,
      description: 'Local currency realization per export dollar has increased by 14% over baseline, boosting local purchasing margins.',
      source: 'National Bank of Ethiopia',
    },
  ],
  historicalAccuracy: {
    backtestWindowDays: 180,
    directionalAccuracyPercent: 86.4,
    meanAbsolutePercentageError: 3.4,
  },
};

// Generates 90 historical days + 30 days forecast points
export function generateHistoricalPricePoints(): HistoricalPricePoint[] {
  const points: HistoricalPricePoint[] = [];
  const baseDate = new Date('2026-06-15');
  let currentIce = 218.0;
  let currentRobusta = 192.0;

  for (let i = 0; i < 96; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);

    // Natural random walk with slight upward drift
    const randomStep = (Math.sin(i / 7) * 2.2) + ((Math.random() - 0.46) * 3.2);
    currentIce = Math.max(205, currentIce + randomStep);
    currentRobusta = Math.max(180, currentRobusta + (randomStep * 0.75));

    const yirgaPrice = currentIce + 62 + (Math.sin(i / 10) * 8);
    const sidamoPrice = currentIce + 48 + (Math.cos(i / 8) * 6);
    const fobDiff = 60 + (Math.sin(i / 6) * 5);

    points.push({
      date: d.toISOString().split('T')[0],
      iceArabicaCents: Math.round(currentIce * 100) / 100,
      iceRobustaCents: Math.round(currentRobusta * 100) / 100,
      ecxYirgacheffeCents: Math.round(yirgaPrice * 100) / 100,
      ecxSidamoCents: Math.round(sidamoPrice * 100) / 100,
      fobDifferentialCents: Math.round(fobDiff * 10) / 10,
      volume: Math.round(25000 + (Math.random() * 18000)),
    });
  }

  // Add 28 days of future forecast points with expanding confidence intervals
  const lastHistorical = points[points.length - 1];
  let forecastPrice = lastHistorical.iceArabicaCents;

  for (let f = 1; f <= 28; f++) {
    const fDate = new Date(lastHistorical.date);
    fDate.setDate(fDate.getDate() + f);

    // Forecast drifts gently upward toward 257.40
    const drift = 0.38 + (Math.sin(f / 4) * 0.2);
    forecastPrice += drift;

    const spread = 2.5 + (f * 0.55); // expanding uncertainty cone
    const yirgaPred = forecastPrice + 68;

    points.push({
      date: fDate.toISOString().split('T')[0],
      iceArabicaCents: Math.round(forecastPrice * 100) / 100,
      iceRobustaCents: Math.round((forecastPrice * 0.86) * 100) / 100,
      ecxYirgacheffeCents: Math.round(yirgaPred * 100) / 100,
      ecxSidamoCents: Math.round((yirgaPred - 14) * 100) / 100,
      fobDifferentialCents: 68,
      volume: 0,
      predictedPrice: Math.round(forecastPrice * 100) / 100,
      confidenceUpper: Math.round((forecastPrice + spread) * 100) / 100,
      confidenceLower: Math.round((forecastPrice - spread) * 100) / 100,
    });
  }

  return points;
}

export const GLOBAL_C_MARKETS: GlobalCMarket[] = [
  {
    id: 'ICE_NY_ARABICA',
    name: 'ICE Futures U.S. Coffee "C" (New York)',
    shortName: 'New York (ICE)',
    symbol: 'KC',
    region: 'New York',
    regionAm: 'ኒው ዮርክ (አሜሪካ)',
    city: 'New York',
    country: 'United States',
    flag: '🇺🇸',
    exchangeOperator: 'Intercontinental Exchange (ICE US)',
    contractStandard: '37,500 lbs Washed Arabica Grade 3+ Physical Parity',
    benchmarkType: 'Global Arabica Benchmark (World C Standard)',
    priceCentsLb: 247.30,
    changeCentsLb: +4.20,
    changePercent: +1.73,
    highCentsLb: 249.50,
    lowCentsLb: 241.10,
    openCentsLb: 243.20,
    volume24h: '38,420 lots',
    openInterest: '241,180 lots',
    localCurrency: 'USD',
    localCurrencySymbol: '$',
    localPricePerKg: 5.45,
    localPriceUnit: '$/kg',
    status: 'OPEN',
    tradingHours: '04:15 - 13:30 EST (11:15 - 20:30 EAT)',
    timezone: 'EST (UTC-5)',
    timeDiffEAT: '-7 hours',
    keyBuyers: ['Starbucks', "Peet's Coffee", 'Folgers', 'Intelligentsia', 'Blue Bottle', 'Keurig Dr Pepper'],
    ethiopianTradeFlow: {
      topDemandGrades: ['Yirgacheffe G1 Washed', 'Sidama G2 Washed', 'Guji G1 Natural', 'Limu G2'],
      topDemandGradesAm: ['ይርጋጨፌ ደረጃ 1 የታጠበ', 'ሲዳማ ደረጃ 2 የታጠበ', 'ጉጂ ደረጃ 1 ተፈጥሯዊ', 'ሊሙ ደረጃ 2'],
      transitDaysFromDjibouti: 24,
      freightSurchargeUSD: '$2,850 / 40ft HC',
      targetBuyersRoasters: 'US Specialty 3rd Wave Roasters & Institutional Commercial Packers',
      annualExportSharePct: 22.4,
      exporterAdvice: 'All Ethiopian FOB export differentials are calculated against this benchmark. Current +4.2¢ bump provides prime window to lock in forward contracts for Washed Grade 1 & 2.',
      exporterAdviceAm: 'የኢትዮጵያ ሁሉም የኤፍኦቢ የልዩነት ዋጋዎች የሚሰሉት በዚህ ኮንትራት ላይ ነው። አሁን ያለው የ+4.2 ሳንቲም ጭማሪ ለደረጃ 1 እና 2 የታጠበ ቡናዎች የቅድመ ሽያጭ ውል ለማሰር ምቹ ነው።',
    },
  },
  {
    id: 'ICE_LON_ROBUSTA',
    name: 'ICE Futures Europe Robusta (London)',
    shortName: 'London (ICE Europe)',
    symbol: 'RC',
    region: 'London',
    regionAm: 'ለንደን (እንግሊዝ/አውሮፓ)',
    city: 'London',
    country: 'United Kingdom',
    flag: '🇬🇧',
    exchangeOperator: 'ICE Futures Europe (LIFFE)',
    contractStandard: '10 Metric Tonnes (22,046 lbs) Robusta Green Coffee',
    benchmarkType: 'Global Robusta Benchmark (Arbitrage Anchor)',
    priceCentsLb: 216.50, // Converted from $4,775 / MT
    changeCentsLb: -1.65,
    changePercent: -0.76,
    highCentsLb: 219.00,
    lowCentsLb: 214.80,
    openCentsLb: 218.15,
    volume24h: '19,250 lots',
    openInterest: '118,400 lots',
    localCurrency: 'USD / GBP',
    localCurrencySymbol: '$',
    localPricePerKg: 4.77,
    localPriceUnit: '$/kg ($4,775/MT)',
    status: 'OPEN',
    tradingHours: '09:00 - 17:30 GMT (12:00 - 20:30 EAT)',
    timezone: 'GMT (UTC+0)',
    timeDiffEAT: '-3 hours',
    keyBuyers: ['Nestlé', 'JDE Peet’s', 'Lavazza', 'Tchibo', 'Illycaffè', 'Segafredo'],
    ethiopianTradeFlow: {
      topDemandGrades: ['Jimma G5 Natural', 'Lekempti G4/G5', 'Sidama G4 Commercial'],
      topDemandGradesAm: ['ጅማ ደረጃ 5 ተፈጥሯዊ', 'ለቀምቲ ደረጃ 4/5', 'ሲዳማ ደረጃ 4 የንግድ'],
      transitDaysFromDjibouti: 34,
      freightSurchargeUSD: '$3,150 / 40ft HC (Cape of Good Hope detour)',
      targetBuyersRoasters: 'European Espresso Blenders & Instant/Soluble Coffee Manufacturers',
      annualExportSharePct: 34.8,
      exporterAdvice: 'Arabica/Robusta arbitrage spread is extremely compressed (~30.8¢/lb). European blenders are aggressively substituting high-priced Robusta with natural Ethiopian commercial grades like Jimma G5.',
      exporterAdviceAm: 'የአራቢካና የሮቡስታ የዋጋ ልዩነት ወደ 30.8 ሳንቲም በመጥበቡ ምክንያት፣ የአውሮፓ አቀናባሪዎች ውድ ከሆነው ሮቡስታ ይልቅ የኢትዮጵያን ተፈጥሯዊ ጅማ ደረጃ 5 በስፋት እየገዙ ነው።',
    },
  },
  {
    id: 'CHINA_YUNNAN',
    name: 'Yunnan & Shanghai Coffee Exchange (YCE / SHCEX)',
    shortName: 'China (Yunnan & Shanghai)',
    symbol: 'YCE-AA',
    region: 'China',
    regionAm: 'ቻይና (ዩናን እና ሻንጋይ)',
    city: 'Kunming & Shanghai',
    country: 'China',
    flag: '🇨🇳',
    exchangeOperator: 'Yunnan Coffee Exchange / Shanghai Free Trade Coffee Hub',
    contractStandard: 'Grade AA Washed Arabica (Pu’er/Baoshan) & Imported Specialty CIF Parity',
    benchmarkType: 'Asian Arabica / China Import Parity Index',
    priceCentsLb: 236.40,
    changeCentsLb: +3.80,
    changePercent: +1.63,
    highCentsLb: 238.50,
    lowCentsLb: 232.00,
    openCentsLb: 233.10,
    volume24h: '14,800 contracts',
    openInterest: '64,200 contracts',
    localCurrency: 'CNY (RMB)',
    localCurrencySymbol: '¥',
    localPricePerKg: 37.60,
    localPriceUnit: '¥/kg (RMB)',
    status: 'OPEN',
    tradingHours: '09:00 - 15:00 CST (04:00 - 10:00 EAT)',
    timezone: 'CST (UTC+8)',
    timeDiffEAT: '+5 hours',
    keyBuyers: ['Luckin Coffee (瑞幸咖啡)', 'Manner Coffee', 'Cotti Coffee', 'Starbucks China', 'M Stand', 'Seesaw'],
    ethiopianTradeFlow: {
      topDemandGrades: ['Yirgacheffe G1 Washed', 'Guji Hambela G1', 'Sidama Bensa G1 Natural'],
      topDemandGradesAm: ['ይርጋጨፌ ደረጃ 1 የታጠበ', 'ጉጂ ሀምቤላ ደረጃ 1', 'ሲዳማ ቤንሳ ደረጃ 1 ተፈጥሯዊ'],
      transitDaysFromDjibouti: 18,
      freightSurchargeUSD: '$1,950 / 40ft HC (Direct Ningbo / Shanghai route)',
      targetBuyersRoasters: 'Massive Modern Chinese Chains (40,000+ stores) & Fast-Growing Specialty Roasters',
      annualExportSharePct: 14.2,
      exporterAdvice: 'China coffee consumption is growing at +15-20% annually. Chains crave fruity, floral Ethiopian beans for signature iced fruit Americanos. Direct shipping to Shanghai has minimal port dwell time.',
      exporterAdviceAm: 'በቻይና የቡና ፍጆታ በዓመት ከ15-20% እያደገ ነው። የቻይና የቡና ሰንሰለቶች (እንደ ሉኪን) ለቀዝቃዛ የፍራፍሬ ጣዕም ቡናዎች ከፍተኛ ፍላጎት ስላላቸው ይርጋጨፌ እና ጉጂ ደረጃ 1ን በከፍተኛ ዋጋ ይገዛሉ።',
    },
  },
  {
    id: 'JAPAN_TOKYO',
    name: 'Tokyo & Osaka Coffee Benchmark (TOCOM / AJCA)',
    shortName: 'Japan (Tokyo & Osaka)',
    symbol: 'AJCA-JP',
    region: 'Japan',
    regionAm: 'ጃፓን (ቶኪዮ እና ኦሳካ)',
    city: 'Tokyo & Osaka',
    country: 'Japan',
    flag: '🇯🇵',
    exchangeOperator: 'All Japan Coffee Association (AJCA) & Osaka Dojima / TOCOM',
    contractStandard: 'Green Arabica Tokyo/Yokohama CIF Parity & Specialty Grade 1 Auction',
    benchmarkType: 'Specialty Import Parity (Highest Quality Differentials)',
    priceCentsLb: 269.80,
    changeCentsLb: +2.10,
    changePercent: +0.78,
    highCentsLb: 271.50,
    lowCentsLb: 266.80,
    openCentsLb: 268.00,
    volume24h: '8,600 lots',
    openInterest: '42,900 lots',
    localCurrency: 'JPY',
    localCurrencySymbol: '¥',
    localPricePerKg: 890.00,
    localPriceUnit: '¥/kg (JPY)',
    status: 'CLOSED',
    tradingHours: '09:00 - 15:30 JST (03:00 - 09:30 EAT)',
    timezone: 'JST (UTC+9)',
    timeDiffEAT: '+6 hours',
    keyBuyers: ['UCC Ueshima Coffee', 'Key Coffee', 'Doutor Coffee', 'Maruyama Coffee', 'Ogawa Coffee', 'Hario Cafe'],
    ethiopianTradeFlow: {
      topDemandGrades: ['Yirgacheffe G1 Washed (Kochere/Chelchele)', 'Sidama G1 Natural', 'Ethiopian Gesha Village'],
      topDemandGradesAm: ['ይርጋጨፌ ደረጃ 1 የታጠበ (ኮቸሬ/ከልጨሌ)', 'ሲዳማ ደረጃ 1 ተፈጥሯዊ', 'ጌሻ ቪሌጅ'],
      transitDaysFromDjibouti: 21,
      freightSurchargeUSD: '$2,100 / 40ft HC',
      targetBuyersRoasters: 'Artisanal Pour-Over & Siphon Specialists with Strict Cup Profiling',
      annualExportSharePct: 11.5,
      exporterAdvice: 'Japan pays the highest quality differentials worldwide (+110¢ to +160¢/lb over ICE NY). Requires strict zero-chemical residue testing and moisture between 10.5-11.5%. Triple-sorted lots achieve highest auction prices.',
      exporterAdviceAm: 'የጃፓን ገዢዎች በአለም ላይ ከፍተኛውን የልዩነት ዋጋ (ከ +110¢ እስከ +160¢ በላይ) ይከፍላሉ፤ የኬሚካል ቅሪት የሌለበትና እርጥበቱ ከ10.5-11.5% የሆነ ንጹህ ደረጃ 1 ይፈልጋሉ።',
    },
  },
  {
    id: 'DUBAI_DMCC',
    name: 'Dubai Multi Commodities Centre (DMCC) Coffee Centre',
    shortName: 'Middle East (Dubai DMCC & Gulf)',
    symbol: 'DMCC-ME',
    region: 'Middle East',
    regionAm: 'መካከለኛው ምስራቅ (ዱባይ እና ሳውዲ)',
    city: 'Dubai & Riyadh',
    country: 'United Arab Emirates & Saudi Arabia',
    flag: '🇦🇪',
    exchangeOperator: 'DMCC Coffee Centre Free Zone & GCC Green Coffee Terminal',
    contractStandard: 'Jebel Ali / Dubai Spot & Forward Delivery (Saudi Arabia / UAE / Kuwait / Qatar)',
    benchmarkType: 'Gulf & Red Sea Physical Coffee Trading Hub',
    priceCentsLb: 259.20,
    changeCentsLb: +3.40,
    changePercent: +1.33,
    highCentsLb: 261.00,
    lowCentsLb: 255.40,
    openCentsLb: 256.50,
    volume24h: '11,400 MT eq',
    openInterest: '58,100 MT eq',
    localCurrency: 'AED / SAR',
    localCurrencySymbol: 'د.إ',
    localPricePerKg: 20.95,
    localPriceUnit: 'AED/kg (د.إ)',
    status: 'OPEN',
    tradingHours: '08:00 - 17:00 GST (07:00 - 16:00 EAT)',
    timezone: 'GST (UTC+4)',
    timeDiffEAT: '+1 hour',
    keyBuyers: ['Saudi Coffee Company (PIF)', 'Barns (Saudi Arabia)', 'Raw Coffee Company Dubai', 'Camel Step', 'Joudian', 'Dr. CAFE'],
    ethiopianTradeFlow: {
      topDemandGrades: ['Harar Longberry Horse/Moka G4', 'Guji G1 Natural', 'Jimma G5 Natural', 'Sidama G2 Natural'],
      topDemandGradesAm: ['ሐረር ሎንግቤሪ ሆርስ/ሞካ ደረጃ 4', 'ጉጂ ደረጃ 1 ተፈጥሯዊ', 'ጅማ ደረጃ 5', 'ሲዳማ ደረጃ 2'],
      transitDaysFromDjibouti: 4,
      freightSurchargeUSD: '$950 / 40ft HC (Fast Red Sea / Gulf of Aden transit)',
      targetBuyersRoasters: 'Traditional Gahwa Roasteries & Booming Saudi/UAE Modern Specialty Chains',
      annualExportSharePct: 12.1,
      exporterAdvice: 'Closest international market with only 3-5 days shipping from Port of Djibouti. Rapid payment turnaround, minimal red tape, and enormous demand for Harar Longberry and fruity Guji naturals across the GCC.',
      exporterAdviceAm: 'ከጅቡቲ ወደብ የ 3-5 ቀናት አጭር የባህር ጉዞ ብቻ ያለው ሲሆን፤ የሳውዲና የኤምሬትስ ገበያ ለሐረር ቡና እና ለወይን ጣዕም ላላቸው ተፈጥሯዊ የጉጂ ቡናዎች ከፍተኛ ተፈላጊነት አላቸው።',
    },
  },
  {
    id: 'ECX_ETHIOPIA',
    name: 'Ethiopian Commodity Exchange (ECX Addis Ababa)',
    shortName: 'Addis Ababa (ECX)',
    symbol: 'ECX-COMP',
    region: 'Addis Ababa',
    regionAm: 'አዲስ አበባ (ኢትዮጵያ)',
    city: 'Addis Ababa',
    country: 'Ethiopia',
    flag: '🇪🇹',
    exchangeOperator: 'Ethiopian Commodity Exchange (ECX)',
    contractStandard: '60kg Warehouse Receipt Bags (Export Graded Lots G1 to G5)',
    benchmarkType: 'Domestic Primary Auction & FOB Parity Base',
    priceCentsLb: 288.40,
    changeCentsLb: +6.50,
    changePercent: +2.31,
    highCentsLb: 292.00,
    lowCentsLb: 282.00,
    openCentsLb: 283.00,
    volume24h: '2,480 Bags',
    openInterest: 'Warehouse Receipts',
    localCurrency: 'ETB',
    localCurrencySymbol: 'Br',
    localPricePerKg: 821.00,
    localPriceUnit: 'ETB/kg',
    status: 'CLOSED',
    tradingHours: '08:30 - 15:00 EAT (08:30 - 15:00 EAT)',
    timezone: 'EAT (UTC+3)',
    timeDiffEAT: 'Base Local Time',
    keyBuyers: ['Licensed Ethiopian Exporters', 'Cooperative Unions', 'Commercial Growers'],
    ethiopianTradeFlow: {
      topDemandGrades: ['All ECX Export Warehoused Lots G1 to G5'],
      topDemandGradesAm: ['ሁሉም በምርት ገበያ የተመዘገቡ ደረጃ 1 እስከ 5 ቡናዎች'],
      transitDaysFromDjibouti: 2,
      freightSurchargeUSD: 'Local truck haulage',
      targetBuyersRoasters: 'Domestic aggregation floor for licensed exporters',
      annualExportSharePct: 100,
      exporterAdvice: 'Primary domestic price discovery floor. Track local quintal bids against international C futures to calculate safe cherry buying thresholds at primary washing stations.',
      exporterAdviceAm: 'የአገር ውስጥ የዋጋ መነሻ ሲሆን፤ በምርት ገበያው የሚታየው ጭማሪ በገጠር ቀይ ቼሪ መግዣ ዋጋ ላይ ውድድር መኖሩን ያሳያል።',
    },
  },
];

export function generateGlobalCHistoricalPoints(timeframe: '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y' = '3M'): GlobalCHistoricalPoint[] {
  const points: GlobalCHistoricalPoint[] = [];

  if (timeframe === '1D') {
    // Intraday 24 hours with live hourly ticks
    const now = new Date();
    const baseHour = new Date(now);
    baseHour.setHours(0, 0, 0, 0);

    let ny = 244.10;
    let lon = 217.20;
    let chn = 233.50;
    let jpn = 267.80;
    let dxb = 256.40;
    let ecx = 284.50;

    for (let h = 0; h <= 23; h++) {
      const pointDate = new Date(baseHour);
      pointDate.setHours(h);

      const hourLabel = `${h.toString().padStart(2, '0')}:00`;

      // Market movements across sessions
      const nyTick = (Math.sin(h / 3) * 0.8) + (h >= 11 && h <= 18 ? 0.35 : 0.05) + ((Math.random() - 0.46) * 0.4);
      const lonTick = (Math.cos(h / 4) * 0.5) + (h >= 9 && h <= 17 ? -0.15 : 0.02) + ((Math.random() - 0.5) * 0.3);
      const chnTick = (h >= 4 && h <= 10 ? 0.45 : 0.02) + ((Math.random() - 0.45) * 0.35);
      const jpnTick = (h >= 3 && h <= 9 ? 0.30 : 0.01) + ((Math.random() - 0.48) * 0.25);
      const dxbTick = (h >= 7 && h <= 16 ? 0.38 : 0.04) + ((Math.random() - 0.47) * 0.3);
      const ecxTick = (h >= 8 && h <= 15 ? 0.55 : 0) + ((Math.random() - 0.45) * 0.2);

      ny += nyTick;
      lon += lonTick;
      chn += chnTick;
      jpn += jpnTick;
      dxb += dxbTick;
      ecx += ecxTick;

      const open = ny - 0.4;
      const close = ny;
      const high = Math.max(open, close) + 0.6;
      const low = Math.min(open, close) - 0.5;

      points.push({
        date: hourLabel,
        timestamp: pointDate.getTime(),
        newYorkArabica: Math.round(ny * 100) / 100,
        londonRobusta: Math.round(lon * 100) / 100,
        chinaYunnan: Math.round(chn * 100) / 100,
        japanTokyo: Math.round(jpn * 100) / 100,
        dubaiDmcc: Math.round(dxb * 100) / 100,
        ethiopiaEcx: Math.round(ecx * 100) / 100,
        open: Math.round(open * 100) / 100,
        high: Math.round(high * 100) / 100,
        low: Math.round(low * 100) / 100,
        close: Math.round(close * 100) / 100,
        volume: Math.round(1200 + (Math.random() * 2400)),
      });
    }

    return points;
  }

  // Daily points for multi-day/month timeframes
  let totalDays = 90;
  if (timeframe === '1W') totalDays = 7;
  else if (timeframe === '1M') totalDays = 30;
  else if (timeframe === '3M') totalDays = 90;
  else if (timeframe === '1Y') totalDays = 180;
  else if (timeframe === '5Y') totalDays = 240;

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - totalDays);

  let currentNY = 212.0;
  let currentLon = 186.0;
  let currentChn = 204.0;
  let currentJpn = 238.0;
  let currentDxb = 224.0;
  let currentEcx = 248.0;

  for (let i = 0; i <= totalDays; i++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + i);

    const step = i / totalDays;
    const macroTrend = Math.sin(step * Math.PI * 1.8) * 8;
    const noise = (Math.random() - 0.48) * 2.2;

    currentNY = 212.0 + (step * 35.3) + macroTrend + noise;
    currentLon = 186.0 + (step * 30.5) + (macroTrend * 0.85) + ((Math.random() - 0.5) * 1.8);
    currentChn = 204.0 + (step * 32.4) + (macroTrend * 0.9) + ((Math.random() - 0.47) * 1.9);
    currentJpn = 238.0 + (step * 31.8) + (macroTrend * 0.95) + ((Math.random() - 0.46) * 1.7);
    currentDxb = 224.0 + (step * 35.2) + (macroTrend * 0.92) + ((Math.random() - 0.48) * 1.8);
    currentEcx = 248.0 + (step * 40.4) + (macroTrend * 1.1) + ((Math.random() - 0.45) * 2.0);

    const open = currentNY - (Math.random() * 1.8 - 0.9);
    const close = currentNY;
    const high = Math.max(open, close) + (Math.random() * 2.1 + 0.4);
    const low = Math.min(open, close) - (Math.random() * 2.1 + 0.4);

    points.push({
      date: d.toISOString().split('T')[0],
      timestamp: d.getTime(),
      newYorkArabica: Math.round(currentNY * 100) / 100,
      londonRobusta: Math.round(currentLon * 100) / 100,
      chinaYunnan: Math.round(currentChn * 100) / 100,
      japanTokyo: Math.round(currentJpn * 100) / 100,
      dubaiDmcc: Math.round(currentDxb * 100) / 100,
      ethiopiaEcx: Math.round(currentEcx * 100) / 100,
      open: Math.round(open * 100) / 100,
      high: Math.round(high * 100) / 100,
      low: Math.round(low * 100) / 100,
      close: Math.round(close * 100) / 100,
      volume: Math.round(18000 + (Math.random() * 25000)),
    });
  }

  return points;
}
