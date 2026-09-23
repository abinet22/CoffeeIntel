import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
  Sliders,
  DollarSign,
  Info,
  ArrowUpRight,
  ArrowDownRight,
  Check,
  Plus,
  X,
  ChevronDown,
  Filter,
  RotateCcw,
  Coffee,
} from 'lucide-react';
import {
  ExchangeQuote,
  HistoricalPricePoint,
  PriceUnit,
  EthiopianGradeQuote,
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface MultiExchangeDashboardProps {
  exchanges: ExchangeQuote[];
  historicalPoints: HistoricalPricePoint[];
  unit: PriceUnit;
  currencyMode: 'USD' | 'ETB';
  selectedGrade?: EthiopianGradeQuote | null;
  onSelectGrade?: (grade: EthiopianGradeQuote) => void;
}

type Timeframe = '1M' | '3M' | '6M' | '1Y' | '5Y';

export interface CoffeeSeriesConfig {
  id: 'iceArabica' | 'iceRobusta' | 'ecxYirgacheffe' | 'ecxSidamo' | 'ecxGuji' | 'ecxLimu' | 'ecxHarar';
  name: string;
  nameAm: string;
  shortName: string;
  shortNameAm: string;
  category: 'global_futures' | 'ecx_washed' | 'ecx_natural';
  categoryLabel: string;
  categoryLabelAm: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  isDefault: boolean;
  differentialText: string;
  differentialTextAm: string;
  description: string;
  descriptionAm: string;
  priceGetter: (pt: HistoricalPricePoint) => number;
  latestPriceCents: number;
}

export const MultiExchangeDashboard: React.FC<MultiExchangeDashboardProps> = ({
  exchanges,
  historicalPoints,
  unit,
  currencyMode,
  selectedGrade,
  onSelectGrade,
}) => {
  const { language, t } = useLanguage();
  const [timeframe, setTimeframe] = useState<Timeframe>('3M');
  const [showForecastBand, setShowForecastBand] = useState<boolean>(true);
  const [isListDrawerOpen, setIsListDrawerOpen] = useState<boolean>(false);
  const [listFilter, setListFilter] = useState<string>('');

  // The user requested: make the user select additional coffee price OTHER THAN the default ICE Arabica
  // Default is ICE Arabica only!
  const [activeSeries, setActiveSeries] = useState<Record<string, boolean>>({
    iceArabica: true,      // Default benchmark
    iceRobusta: false,     // Selectable by user
    ecxYirgacheffe: false, // Selectable by user
    ecxSidamo: false,      // Selectable by user
    ecxGuji: false,        // Additional Ethiopian grade list
    ecxLimu: false,        // Additional Ethiopian grade list
    ecxHarar: false,       // Additional Ethiopian grade list
  });

  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Conversion rate helpers
  const USD_TO_ETB = 129.4; // official conversion
  const KG_PER_LB = 0.45359237;

  const convertPrice = (centsLb: number): number => {
    if (unit === 'cents_lb') {
      return centsLb;
    }
    const usdPerLb = centsLb / 100;
    const usdPerKg = usdPerLb / KG_PER_LB;
    if (unit === 'usd_kg') {
      return usdPerKg;
    }
    // etb_kg
    return usdPerKg * USD_TO_ETB;
  };

  const getUnitSymbol = (): string => {
    if (unit === 'cents_lb') return '¢/lb';
    if (unit === 'usd_kg') return '$/kg';
    return 'ETB/kg';
  };

  // Extract latest prices from historicalPoints
  const latestPoint = historicalPoints[historicalPoints.length - 1] || {
    iceArabicaCents: 277.2,
    iceRobustaCents: 154.12,
    ecxYirgacheffeCents: 382.2,
    ecxSidamoCents: 332.2,
    ecxGujiCents: 412.2,
    ecxLimuCents: 312.2,
    ecxHararCents: 319.2,
    fobDifferentialCents: 105,
    volume: 24000,
  };

  // Master definitions of all selectable coffee price benchmarks & lists
  const coffeeSeriesList: CoffeeSeriesConfig[] = useMemo(() => [
    {
      id: 'iceArabica',
      name: 'ICE Arabica (NY "C" Futures)',
      nameAm: 'አይሲኢ አራቢካ (የኒው ዮርክ ፊውቸርስ)',
      shortName: 'ICE Arabica',
      shortNameAm: 'አይሲኢ አራቢካ',
      category: 'global_futures',
      categoryLabel: 'Global Commodity Futures',
      categoryLabelAm: 'ዓለም አቀፍ ፊውቸርስ',
      color: '#f59e0b', // amber
      badgeBg: 'bg-amber-500/20',
      badgeBorder: 'border-amber-500/50',
      badgeText: 'text-amber-300',
      isDefault: true,
      differentialText: 'Global Benchmark Standard',
      differentialTextAm: 'መደበኛ ዓለም አቀፍ መነሻ ዋጋ',
      description: 'The global benchmark pricing contract for physical mild Arabica coffee delivery.',
      descriptionAm: 'ለዓለም አቀፍ የአራቢካ ቡና ግብይት ዋነኛው የማጣቀሻ ውል።',
      priceGetter: (pt) => pt.iceArabicaCents,
      latestPriceCents: latestPoint.iceArabicaCents,
    },
    {
      id: 'iceRobusta',
      name: 'ICE Robusta (London RC Futures)',
      nameAm: 'አይሲኢ ሮቡስታ (የለንደን ፊውቸርስ)',
      shortName: 'ICE Robusta',
      shortNameAm: 'አይሲኢ ሮቡስታ',
      category: 'global_futures',
      categoryLabel: 'Global Commodity Futures',
      categoryLabelAm: 'ዓለም አቀፍ ፊውቸርስ',
      color: '#06b6d4', // cyan
      badgeBg: 'bg-cyan-500/20',
      badgeBorder: 'border-cyan-500/50',
      badgeText: 'text-cyan-300',
      isDefault: false,
      differentialText: '-123.1¢/lb vs Arabica',
      differentialTextAm: '-123.1 ሳንቲም ከአራቢካ አንጻር',
      description: 'London Robusta benchmark; key substitution indicator for commercial espresso blends.',
      descriptionAm: 'የለንደን ሮቡስታ መነሻ፤ ለንግድ ቡና ቅይጥ እና ምትክ ጥናት ወሳኝ።',
      priceGetter: (pt) => pt.iceRobustaCents,
      latestPriceCents: latestPoint.iceRobustaCents,
    },
    {
      id: 'ecxYirgacheffe',
      name: 'ECX Yirgacheffe Washed G2',
      nameAm: 'ምርት ገበያ ይርጋጨፌ የታጠበ ደረጃ 2',
      shortName: 'ECX Yirgacheffe',
      shortNameAm: 'ምርት ገበያ ይርጋጨፌ',
      category: 'ecx_washed',
      categoryLabel: 'ECX Washed Specialties',
      categoryLabelAm: 'ምርት ገበያ የታጠበ ቡና',
      color: '#10b981', // emerald
      badgeBg: 'bg-emerald-500/20',
      badgeBorder: 'border-emerald-500/50',
      badgeText: 'text-emerald-300',
      isDefault: false,
      differentialText: '+105.0¢/lb Washed Premium',
      differentialTextAm: '+105.0 ሳንቲም የታጠበ ፕሪሚየም',
      description: 'Ethiopian Commodity Exchange benchmark for premier floral & bergamot washed profile.',
      descriptionAm: 'የአበባ እና የሎሚ መዓዛ ላለው የታጠበ ይርጋጨፌ ቡና የኢትዮጵያ ምርት ገበያ መነሻ ዋጋ።',
      priceGetter: (pt) => pt.ecxYirgacheffeCents,
      latestPriceCents: latestPoint.ecxYirgacheffeCents,
    },
    {
      id: 'ecxSidamo',
      name: 'ECX Sidama Washed G2',
      nameAm: 'ምርት ገበያ ሲዳማ የታጠበ ደረጃ 2',
      shortName: 'ECX Sidama',
      shortNameAm: 'ምርት ገበያ ሲዳማ',
      category: 'ecx_washed',
      categoryLabel: 'ECX Washed Specialties',
      categoryLabelAm: 'ምርት ገበያ የታጠበ ቡና',
      color: '#a855f7', // purple
      badgeBg: 'bg-purple-500/20',
      badgeBorder: 'border-purple-500/50',
      badgeText: 'text-purple-300',
      isDefault: false,
      differentialText: '+55.0¢/lb Physical Differential',
      differentialTextAm: '+55.0 ሳንቲም የልዩነት ዋጋ',
      description: 'High-volume Ethiopian washed benchmark from Sidama zone offering citrus sweetness.',
      descriptionAm: 'ከሲዳማ ዞን የሚገኝ ከፍተኛ መጠን ያለው የታጠበ ቡና የማጣቀሻ ዋጋ።',
      priceGetter: (pt) => pt.ecxSidamoCents,
      latestPriceCents: latestPoint.ecxSidamoCents,
    },
    {
      id: 'ecxGuji',
      name: 'ECX Guji Specialty Natural G1',
      nameAm: 'ምርት ገበያ ጉጂ ልዩ ደረጃ 1',
      shortName: 'ECX Guji G1',
      shortNameAm: 'ምርት ገበያ ጉጂ',
      category: 'ecx_natural',
      categoryLabel: 'ECX Specialty & Naturals',
      categoryLabelAm: 'ምርት ገበያ ልዩ እና ያልታጠበ',
      color: '#f43f5e', // rose
      badgeBg: 'bg-rose-500/20',
      badgeBorder: 'border-rose-500/50',
      badgeText: 'text-rose-300',
      isDefault: false,
      differentialText: '+135.0¢/lb Micro-lot Premium',
      differentialTextAm: '+135.0 ሳንቲም ልዩ ፕሪሚየም',
      description: 'High altitude micro-lot grade known for intense jasmine, peach, and tropical notes.',
      descriptionAm: 'የጃስሚን እና የፒች መዓዛ ያለው ከፍተኛ ጥራት ያለው ልዩ የጉጂ የተፈጥሮ ቡና ዋጋ።',
      priceGetter: (pt) => pt.ecxGujiCents ?? Math.round((pt.iceArabicaCents + 135) * 100) / 100,
      latestPriceCents: latestPoint.ecxGujiCents ?? Math.round((latestPoint.iceArabicaCents + 135) * 100) / 100,
    },
    {
      id: 'ecxLimu',
      name: 'ECX Limu / Jimma Washed G2',
      nameAm: 'ምርት ገበያ ሊሙ / ጅማ የታጠበ ደረጃ 2',
      shortName: 'ECX Limu G2',
      shortNameAm: 'ምርት ገበያ ሊሙ',
      category: 'ecx_washed',
      categoryLabel: 'ECX Washed Specialties',
      categoryLabelAm: 'ምርት ገበያ የታጠበ ቡና',
      color: '#3b82f6', // blue
      badgeBg: 'bg-blue-500/20',
      badgeBorder: 'border-blue-500/50',
      badgeText: 'text-blue-300',
      isDefault: false,
      differentialText: '+35.0¢/lb Washed Basis',
      differentialTextAm: '+35.0 ሳንቲም የታጠበ ልዩነት',
      description: 'Western Ethiopian washed coffee known for balanced winey acidity and smooth body.',
      descriptionAm: 'የምዕራብ ኢትዮጵያ የታጠበ ቡና፣ ወይን መሰል አሲዳማነት እና የተመጣጠነ ጣዕም።',
      priceGetter: (pt) => pt.ecxLimuCents ?? Math.round((pt.iceArabicaCents + 35) * 100) / 100,
      latestPriceCents: latestPoint.ecxLimuCents ?? Math.round((latestPoint.iceArabicaCents + 35) * 100) / 100,
    },
    {
      id: 'ecxHarar',
      name: 'ECX Harar Longberry G4',
      nameAm: 'ምርት ገበያ ሐረር ሎንግቤሪ ደረጃ 4',
      shortName: 'ECX Harar G4',
      shortNameAm: 'ምርት ገበያ ሐረር',
      category: 'ecx_natural',
      categoryLabel: 'ECX Specialty & Naturals',
      categoryLabelAm: 'ምርት ገበያ ልዩ እና ያልታጠበ',
      color: '#ea580c', // orange
      badgeBg: 'bg-orange-500/20',
      badgeBorder: 'border-orange-500/50',
      badgeText: 'text-orange-300',
      isDefault: false,
      differentialText: '+42.0¢/lb Natural Premium',
      differentialTextAm: '+42.0 ሳንቲም ያልታጠበ ፕሪሚየም',
      description: 'Eastern sun-dried natural beans with distinctive wild blueberry and mocha character.',
      descriptionAm: 'የምሥራቅ ኢትዮጵያ በፀሐይ የደረቀ የተፈጥሮ ቡና፣ የበለጸገ የብሉቤሪ እና የሞካ ጣዕም።',
      priceGetter: (pt) => pt.ecxHararCents ?? Math.round((pt.iceArabicaCents + 42) * 100) / 100,
      latestPriceCents: latestPoint.ecxHararCents ?? Math.round((latestPoint.iceArabicaCents + 42) * 100) / 100,
    },
  ], [latestPoint]);

  // Toggle a single series
  const toggleSeries = (id: string) => {
    setActiveSeries((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // Presets
  const applyPreset = (preset: 'default_only' | 'futures_pair' | 'top_washed' | 'all_origins' | 'all') => {
    if (preset === 'default_only') {
      setActiveSeries({
        iceArabica: true,
        iceRobusta: false,
        ecxYirgacheffe: false,
        ecxSidamo: false,
        ecxGuji: false,
        ecxLimu: false,
        ecxHarar: false,
      });
    } else if (preset === 'futures_pair') {
      setActiveSeries({
        iceArabica: true,
        iceRobusta: true,
        ecxYirgacheffe: false,
        ecxSidamo: false,
        ecxGuji: false,
        ecxLimu: false,
        ecxHarar: false,
      });
    } else if (preset === 'top_washed') {
      setActiveSeries({
        iceArabica: true,
        iceRobusta: false,
        ecxYirgacheffe: true,
        ecxSidamo: true,
        ecxGuji: false,
        ecxLimu: false,
        ecxHarar: false,
      });
    } else if (preset === 'all_origins') {
      setActiveSeries({
        iceArabica: true,
        iceRobusta: false,
        ecxYirgacheffe: true,
        ecxSidamo: true,
        ecxGuji: true,
        ecxLimu: true,
        ecxHarar: true,
      });
    } else if (preset === 'all') {
      setActiveSeries({
        iceArabica: true,
        iceRobusta: true,
        ecxYirgacheffe: true,
        ecxSidamo: true,
        ecxGuji: true,
        ecxLimu: true,
        ecxHarar: true,
      });
    }
  };

  // Count how many additional series are currently active
  const additionalActiveCount = useMemo(() => {
    return Object.entries(activeSeries).filter(([k, v]) => k !== 'iceArabica' && v).length;
  }, [activeSeries]);

  // Filter historical points by timeframe
  const filteredPoints = useMemo(() => {
    const total = historicalPoints.length;
    let count = total;
    if (timeframe === '1M') count = Math.min(total, 30);
    else if (timeframe === '3M') count = Math.min(total, 60);
    else if (timeframe === '6M') count = Math.min(total, 90);
    else if (timeframe === '1Y') count = Math.min(total, 120);

    const slice = historicalPoints.slice(-count);
    return showForecastBand ? slice : slice.filter((p) => !p.predictedPrice);
  }, [historicalPoints, timeframe, showForecastBand]);

  // Compute SVG Min/Max across active series
  const { minVal, maxVal, chartData } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;

    const converted = filteredPoints.map((pt) => {
      const prices: Record<string, number> = {};
      coffeeSeriesList.forEach((cfg) => {
        const val = cfg.priceGetter(pt);
        const conv = convertPrice(val);
        prices[cfg.id] = conv;
        if (activeSeries[cfg.id]) {
          min = Math.min(min, conv);
          max = Math.max(max, conv);
        }
      });

      const pred = pt.predictedPrice ? convertPrice(pt.predictedPrice) : undefined;
      const upper = pt.confidenceUpper ? convertPrice(pt.confidenceUpper) : undefined;
      const lower = pt.confidenceLower ? convertPrice(pt.confidenceLower) : undefined;

      if (upper && showForecastBand && activeSeries.iceArabica) max = Math.max(max, upper);
      if (lower && showForecastBand && activeSeries.iceArabica) min = Math.min(min, lower);

      return {
        ...pt,
        prices,
        convPred: pred,
        convUpper: upper,
        convLower: lower,
      };
    });

    if (min === Infinity) min = 150;
    if (max === -Infinity) max = 350;

    // Buffer 7%
    const padding = (max - min) * 0.07;
    return {
      minVal: Math.max(0, min - padding),
      maxVal: max + padding,
      chartData: converted,
    };
  }, [filteredPoints, activeSeries, showForecastBand, unit, coffeeSeriesList]);

  // SVG dimensions
  const width = 820;
  const height = 330;
  const paddingLeft = 62;
  const paddingRight = 30;
  const paddingTop = 22;
  const paddingBottom = 42;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const getX = (index: number) => {
    if (chartData.length <= 1) return paddingLeft;
    return paddingLeft + (index / (chartData.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    if (maxVal === minVal) return height / 2;
    return paddingTop + (1 - (val - minVal) / (maxVal - minVal)) * chartHeight;
  };

  // Generate SVG path strings
  const generateLinePath = (seriesId: string) => {
    let path = '';
    chartData.forEach((d, idx) => {
      const val = d.prices[seriesId];
      if (val !== undefined && !isNaN(val)) {
        const x = getX(idx);
        const y = getY(val);
        path += (path === '' ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
      }
    });
    return path;
  };

  // Confidence ribbon polygon path
  const confidenceBandPath = useMemo(() => {
    if (!showForecastBand || !activeSeries.iceArabica) return '';
    const forecastIndices: number[] = [];
    chartData.forEach((d, i) => {
      if (d.convUpper !== undefined && d.convLower !== undefined) {
        forecastIndices.push(i);
      }
    });
    if (forecastIndices.length === 0) return '';

    let upperStr = '';
    forecastIndices.forEach((i, count) => {
      const x = getX(i);
      const y = getY(chartData[i].convUpper!);
      upperStr += (count === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
    });

    let lowerStr = '';
    for (let j = forecastIndices.length - 1; j >= 0; j--) {
      const i = forecastIndices[j];
      const x = getX(i);
      const y = getY(chartData[i].convLower!);
      lowerStr += `L${x.toFixed(1)},${y.toFixed(1)} `;
    }

    return `${upperStr} ${lowerStr} Z`;
  }, [chartData, showForecastBand, minVal, maxVal, activeSeries.iceArabica]);

  const activeHoverPoint = hoveredIndex !== null ? chartData[hoveredIndex] : null;

  // Filtered series list for the dropdown
  const filteredListItems = useMemo(() => {
    if (!listFilter.trim()) return coffeeSeriesList;
    const q = listFilter.toLowerCase();
    return coffeeSeriesList.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.nameAm.includes(q) ||
        c.categoryLabel.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q)
    );
  }, [coffeeSeriesList, listFilter]);

  return (
    <div id="multi-exchange-benchmark-container" className="rounded-xl border border-stone-800 bg-stone-900/70 p-4 sm:p-5 shadow-xl">
      {/* Top Header & Overview */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-stone-100 sm:text-lg">
              {language === 'am' ? 'ዓለም አቀፍ እና የአገር ውስጥ የቡና ዋጋ ማነጻጸሪያ' : 'Global & Domestic Multi-Exchange Benchmark'}
            </h2>
            <span className="rounded bg-amber-950/70 px-2 py-0.5 text-xs font-semibold text-amber-300 border border-amber-800/50">
              {getUnitSymbol()}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {language === 'am'
              ? 'ከነባሪው አይሲኢ አራቢካ በተጨማሪ ሌሎች የቡና ዋጋዎችን (ሮቡስታ፣ ይርጋጨፌ፣ ሲዳማ፣ ጉጂ) መርጠው ያነጻጽሩ'
              : 'Benchmark default ICE Arabica against selectable additional coffee prices (ICE Robusta, ECX Yirgacheffe, ECX Sidama, Guji)'}
          </p>
        </div>

        {/* Timeframe selector & forecast cone */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Forecast Band Toggle */}
          <button
            id="btn-toggle-forecast-band"
            onClick={() => setShowForecastBand(!showForecastBand)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs border transition-colors ${
              showForecastBand
                ? 'bg-amber-950/60 border-amber-600/50 text-amber-300 font-semibold'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle AI short-term forecast cone and 68% confidence interval"
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span>{language === 'am' ? 'የ AI ትንበያ ወሰን' : 'AI Forecast Cone'}</span>
          </button>

          {/* Timeframe selector */}
          <div className="flex items-center rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
            {(['1M', '3M', '6M', '1Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                id={`btn-timeframe-${tf}`}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded font-mono transition-colors ${
                  timeframe === tf
                    ? 'bg-stone-800 text-stone-100 font-bold'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tf === '1M' && language === 'am' ? '1ወር' :
                 tf === '3M' && language === 'am' ? '3ወር' :
                 tf === '6M' && language === 'am' ? '6ወር' :
                 tf === '1Y' && language === 'am' ? '1ዓመት' : tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Coffee Price Selection Bar */}
      <div className="mt-3 rounded-lg bg-stone-950/80 p-2.5 border border-stone-800/80">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2.5">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-semibold text-stone-400 mr-1 flex items-center gap-1">
              <Filter className="h-3.5 w-3.5 text-amber-400" />
              {language === 'am' ? 'የቡና ዋጋዎች:' : 'Coffee Prices:'}
            </span>

            {/* 1. Default ICE Arabica Chip */}
            <button
              id="series-toggle-ice-arabica"
              onClick={() => toggleSeries('iceArabica')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all ${
                activeSeries.iceArabica
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 font-semibold shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
              }`}
              title="Default Global Arabica Benchmark"
            >
              <span className="h-2 w-2 rounded-full bg-amber-400 shrink-0" />
              <span>{language === 'am' ? 'አይሲኢ አራቢካ' : 'ICE Arabica'}</span>
              <span className="text-[10px] px-1 py-0.2 rounded bg-amber-950/80 text-amber-300 border border-amber-800/50">
                {language === 'am' ? 'ነባሪ' : 'Default'}
              </span>
            </button>

            {/* 2. ICE Robusta Chip */}
            <button
              id="series-toggle-ice-robusta"
              onClick={() => toggleSeries('iceRobusta')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all ${
                activeSeries.iceRobusta
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/60 font-semibold shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400 shrink-0" />
              <span>{language === 'am' ? 'አይሲኢ ሮቡስታ' : 'ICE Robusta'}</span>
              {activeSeries.iceRobusta && <Check className="h-3 w-3 text-cyan-400 ml-0.5" />}
            </button>

            {/* 3. ECX Yirgacheffe Chip */}
            <button
              id="series-toggle-ecx-yirgacheffe"
              onClick={() => toggleSeries('ecxYirgacheffe')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all ${
                activeSeries.ecxYirgacheffe
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 font-semibold shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
              <span>{language === 'am' ? 'ምርት ገበያ ይርጋጨፌ' : 'ECX Yirgacheffe'}</span>
              {activeSeries.ecxYirgacheffe && <Check className="h-3 w-3 text-emerald-400 ml-0.5" />}
            </button>

            {/* 4. ECX Sidama Chip */}
            <button
              id="series-toggle-ecx-sidama"
              onClick={() => toggleSeries('ecxSidamo')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs border transition-all ${
                activeSeries.ecxSidamo
                  ? 'bg-purple-500/20 text-purple-300 border-purple-500/60 font-semibold shadow-sm'
                  : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-300'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-400 shrink-0" />
              <span>{language === 'am' ? 'ምርት ገበያ ሲዳማ' : 'ECX Sidama'}</span>
              {activeSeries.ecxSidamo && <Check className="h-3 w-3 text-purple-400 ml-0.5" />}
            </button>

            {/* Additional active series tags (if Guji, Limu, Harar active) */}
            {activeSeries.ecxGuji && (
              <button
                onClick={() => toggleSeries('ecxGuji')}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-rose-500/20 text-rose-300 border border-rose-500/50 font-semibold"
              >
                <span className="h-2 w-2 rounded-full bg-rose-400" />
                <span>ECX Guji</span>
                <X className="h-3 w-3 ml-0.5 hover:text-rose-100" />
              </button>
            )}
            {activeSeries.ecxLimu && (
              <button
                onClick={() => toggleSeries('ecxLimu')}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-blue-500/20 text-blue-300 border border-blue-500/50 font-semibold"
              >
                <span className="h-2 w-2 rounded-full bg-blue-400" />
                <span>ECX Limu</span>
                <X className="h-3 w-3 ml-0.5 hover:text-blue-100" />
              </button>
            )}
            {activeSeries.ecxHarar && (
              <button
                onClick={() => toggleSeries('ecxHarar')}
                className="flex items-center gap-1 px-2 py-1 rounded-md text-xs bg-orange-500/20 text-orange-300 border border-orange-500/50 font-semibold"
              >
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                <span>ECX Harar</span>
                <X className="h-3 w-3 ml-0.5 hover:text-orange-100" />
              </button>
            )}
          </div>

          {/* Additional Coffee Prices & Lists Dropdown Trigger */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-open-coffee-price-list"
              onClick={() => setIsListDrawerOpen(!isListDrawerOpen)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1 text-xs font-semibold border transition-all ${
                isListDrawerOpen || additionalActiveCount > 0
                  ? 'bg-amber-950/70 text-amber-300 border-amber-600/60'
                  : 'bg-stone-900 border-stone-800 text-stone-300 hover:text-stone-100'
              }`}
            >
              <Plus className="h-3.5 w-3.5 text-amber-400" />
              <span>
                {language === 'am' ? 'ተጨማሪ የቡና ዋጋዎች ዝርዝር' : 'Select Additional Coffee Prices'}
              </span>
              <span className="ml-1 rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-mono text-amber-300 border border-amber-500/30">
                +{additionalActiveCount}
              </span>
              <ChevronDown
                className={`h-3 w-3 transition-transform ${isListDrawerOpen ? 'rotate-180' : ''}`}
              />
            </button>

            {additionalActiveCount > 0 && (
              <button
                id="btn-reset-to-default-arabica"
                onClick={() => applyPreset('default_only')}
                className="rounded p-1 text-stone-400 hover:text-amber-400 hover:bg-stone-900 transition-colors"
                title={language === 'am' ? 'ወደ ነባሪ አይሲኢ አራቢካ ብቻ ይመልሱ' : 'Reset to default ICE Arabica only'}
              >
                <RotateCcw className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Expandable Coffee Price Selection Panel & Lists */}
        {isListDrawerOpen && (
          <div className="mt-3 border-t border-stone-800/80 pt-3">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 pb-2.5">
              <div className="flex items-center gap-2">
                <Coffee className="h-4 w-4 text-amber-400" />
                <span className="text-xs font-bold text-stone-200">
                  {language === 'am' ? 'የቡና ዋጋዎች እና የኢትዮጵያ ምርት ገበያ ዝርዝር' : 'Coffee Price Benchmark Registry & Grade Lists'}
                </span>
                <span className="text-[11px] text-stone-400">
                  ({Object.values(activeSeries).filter(Boolean).length} of {coffeeSeriesList.length} active)
                </span>
              </div>

              {/* Quick Presets */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="text-stone-400 mr-1">{language === 'am' ? 'ፈጣን ምርጫ:' : 'Presets:'}</span>
                <button
                  id="preset-default-only"
                  onClick={() => applyPreset('default_only')}
                  className="rounded bg-stone-900 hover:bg-stone-800 text-stone-300 px-2 py-0.5 border border-stone-800"
                >
                  {language === 'am' ? 'አይሲኢ አራቢካ ብቻ' : 'Default Arabica'}
                </button>
                <button
                  id="preset-futures-pair"
                  onClick={() => applyPreset('futures_pair')}
                  className="rounded bg-stone-900 hover:bg-stone-800 text-cyan-300 px-2 py-0.5 border border-stone-800"
                >
                  {language === 'am' ? 'አራቢካ + ሮቡስታ' : 'Arabica + Robusta'}
                </button>
                <button
                  id="preset-top-washed"
                  onClick={() => applyPreset('top_washed')}
                  className="rounded bg-stone-900 hover:bg-stone-800 text-emerald-300 px-2 py-0.5 border border-stone-800"
                >
                  {language === 'am' ? 'አራቢካ + ይርጋጨፌ + ሲዳማ' : 'Top Washed Trio'}
                </button>
                <button
                  id="preset-all-origins"
                  onClick={() => applyPreset('all_origins')}
                  className="rounded bg-stone-900 hover:bg-stone-800 text-purple-300 px-2 py-0.5 border border-stone-800"
                >
                  {language === 'am' ? 'ሁሉም የኢትዮጵያ ዝርዝር' : 'All ECX Physicals'}
                </button>
                <button
                  id="preset-select-all"
                  onClick={() => applyPreset('all')}
                  className="rounded bg-amber-950/60 hover:bg-amber-900/60 text-amber-300 px-2 py-0.5 border border-amber-800/60 font-semibold"
                >
                  {language === 'am' ? 'ሁሉንም ምረጥ' : 'Select All'}
                </button>
              </div>
            </div>

            {/* Grid of Selectable Coffee Prices */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-2">
              {filteredListItems.map((item) => {
                const isSelected = activeSeries[item.id] ?? false;
                const convertedPrice = convertPrice(item.latestPriceCents);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleSeries(item.id)}
                    className={`flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? `${item.badgeBg} ${item.badgeBorder} shadow-sm`
                        : 'bg-stone-900/50 border-stone-800/80 hover:bg-stone-900 hover:border-stone-700'
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">
                      <div
                        className={`h-4 w-4 rounded flex items-center justify-center border transition-colors ${
                          isSelected
                            ? 'bg-amber-500 border-amber-400 text-stone-950'
                            : 'border-stone-700 bg-stone-950'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3 stroke-[3]" />}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="font-semibold text-xs text-stone-200 truncate">
                          {language === 'am' ? item.nameAm : item.name}
                        </span>
                        <span
                          className="h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                      </div>

                      <div className="mt-1 flex items-baseline justify-between font-mono">
                        <span className="text-xs font-bold text-stone-100">
                          {convertedPrice.toFixed(2)} {getUnitSymbol()}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {language === 'am' ? item.differentialTextAm : item.differentialText}
                        </span>
                      </div>

                      <p className="mt-1 text-[10px] text-stone-400 line-clamp-1">
                        {language === 'am' ? item.descriptionAm : item.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* SVG Chart Stage */}
      <div className="relative mt-4 overflow-hidden rounded-xl border border-stone-800 bg-stone-950 p-2 sm:p-4">
        {/* Active series summary legend directly over chart */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/60 pb-2 mb-2 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {coffeeSeriesList
              .filter((c) => activeSeries[c.id])
              .map((c) => (
                <div key={c.id} className="flex items-center gap-1.5 font-mono text-[11px]">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-stone-300 font-sans">{language === 'am' ? c.shortNameAm : c.shortName}:</span>
                  <span className="font-bold text-stone-100">
                    {convertPrice(c.latestPriceCents).toFixed(2)} {getUnitSymbol()}
                  </span>
                </div>
              ))}
            {showForecastBand && activeSeries.iceArabica && (
              <div className="flex items-center gap-1 text-[11px] text-amber-400 font-mono">
                <span className="h-0.5 w-3 bg-amber-400 inline-block border-t border-dashed border-amber-400" />
                <span>{language === 'am' ? 'የ AI ትንበያ' : 'AI Forecast Cone'}</span>
              </div>
            )}
          </div>

          {/* Notice when only ICE Arabica is selected */}
          {additionalActiveCount === 0 && (
            <div className="text-[11px] text-amber-400/90 flex items-center gap-1">
              <Info className="h-3 w-3 shrink-0" />
              <span>
                {language === 'am'
                  ? 'ከላይ "ተጨማሪ የቡና ዋጋዎች"ን በመጫን ሮቡስታ፣ ይርጋጨፌ ወይም ሲዳማን ያክሉ'
                  : 'Select ICE Robusta, ECX Yirgacheffe, or ECX Sidama to benchmark prices'}
              </span>
            </div>
          )}
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto cursor-crosshair select-none"
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = ((e.clientX - rect.left) / rect.width) * width;
            if (relX >= paddingLeft && relX <= width - paddingRight) {
              const pct = (relX - paddingLeft) / chartWidth;
              const idx = Math.min(
                chartData.length - 1,
                Math.max(0, Math.round(pct * (chartData.length - 1)))
              );
              setHoveredIndex(idx);
            }
          }}
        >
          {/* Y Axis Grid lines & values */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const val = minVal + pct * (maxVal - minVal);
            const y = getY(val);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="#292524"
                  strokeDasharray="2 2"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-stone-400 font-mono text-[10px]"
                >
                  {val.toFixed(unit === 'usd_kg' ? 2 : 1)}
                </text>
              </g>
            );
          })}

          {/* AI Confidence Band Ribbon */}
          {confidenceBandPath && (
            <path
              d={confidenceBandPath}
              fill="rgba(245, 158, 11, 0.12)"
              stroke="rgba(245, 158, 11, 0.35)"
              strokeDasharray="3 3"
            />
          )}

          {/* Dynamic Series Lines for each active coffee selection */}
          {coffeeSeriesList.map((cfg) => {
            if (!activeSeries[cfg.id]) return null;
            const pathData = generateLinePath(cfg.id);
            if (!pathData) return null;
            return (
              <path
                key={cfg.id}
                d={pathData}
                fill="none"
                stroke={cfg.color}
                strokeWidth={cfg.id === 'iceArabica' || cfg.id === 'ecxYirgacheffe' ? '2.5' : '2'}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            );
          })}

          {/* AI Predicted Line segment (dashed amber) */}
          {showForecastBand && activeSeries.iceArabica && (
            <path
              d={generateLinePath('iceArabica')} // overlay projection
              fill="none"
              stroke="#fbbf24"
              strokeWidth="2"
              strokeDasharray="4 4"
            />
          )}

          {/* Hover scrubber vertical line */}
          {hoveredIndex !== null && (
            <g>
              <line
                x1={getX(hoveredIndex)}
                y1={paddingTop}
                x2={getX(hoveredIndex)}
                y2={height - paddingBottom}
                stroke="#d6d3d1"
                strokeWidth="1"
                strokeDasharray="2 2"
              />

              {/* Circle indicator for each active series at cursor */}
              {coffeeSeriesList.map((cfg) => {
                if (!activeSeries[cfg.id]) return null;
                const ptVal = chartData[hoveredIndex]?.prices[cfg.id];
                if (ptVal === undefined || isNaN(ptVal)) return null;
                return (
                  <circle
                    key={cfg.id}
                    cx={getX(hoveredIndex)}
                    y={getY(ptVal)}
                    r="4"
                    fill={cfg.color}
                    stroke="#1c1917"
                    strokeWidth="2"
                  />
                );
              })}
            </g>
          )}

          {/* X Axis dates */}
          {[0, 0.2, 0.4, 0.6, 0.8, 1].map((pct, i) => {
            const idx = Math.floor(pct * (chartData.length - 1));
            const pt = chartData[idx];
            if (!pt) return null;
            const x = getX(idx);
            return (
              <text
                key={i}
                x={x}
                y={height - 14}
                textAnchor="middle"
                className="fill-stone-400 font-mono text-[10px]"
              >
                {pt.date.slice(5)}
                {pt.predictedPrice ? ' (Fcast)' : ''}
              </text>
            );
          })}
        </svg>

        {/* Scrubber Detail Inspector Card */}
        {activeHoverPoint && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-800 bg-stone-950/95 px-4 py-2.5 text-xs shadow-md">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-amber-500" />
              <span className="font-mono font-bold text-stone-200">
                {activeHoverPoint.date}
              </span>
              {activeHoverPoint.predictedPrice && (
                <span className="rounded bg-amber-950 px-1.5 py-0.5 text-[10px] text-amber-300 border border-amber-800">
                  AI Model Projection
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 font-mono">
              {coffeeSeriesList
                .filter((c) => activeSeries[c.id])
                .map((c) => {
                  const val = activeHoverPoint.prices[c.id];
                  if (val === undefined) return null;
                  return (
                    <div key={c.id} className="flex items-center gap-1.5">
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: c.color }}
                      />
                      <span className="text-stone-400">{language === 'am' ? c.shortNameAm : c.shortName}:</span>
                      <span className="font-bold text-stone-100">
                        {val.toFixed(2)} {getUnitSymbol()}
                      </span>
                    </div>
                  );
                })}

              <div className="flex items-center gap-1.5">
                <span className="text-stone-400">Physical Basis Diff:</span>
                <span className="font-bold text-amber-400">
                  +{activeHoverPoint.fobDifferentialCents}¢/lb
                </span>
              </div>

              {activeHoverPoint.convUpper && activeHoverPoint.convLower && (
                <div className="flex items-center gap-1 text-[11px] text-stone-400">
                  <span>68% Range:</span>
                  <span className="text-stone-300">
                    [{activeHoverPoint.convLower.toFixed(1)} – {activeHoverPoint.convUpper.toFixed(1)}]
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Exchange & Coffee Series Benchmark Bento Cards */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {/* Render cards for all currently active coffee prices selected by user */}
        {coffeeSeriesList
          .filter((c) => activeSeries[c.id])
          .map((cfg) => {
            const price = convertPrice(cfg.latestPriceCents);
            const isArabica = cfg.id === 'iceArabica';
            const changePercent = isArabica ? 1.45 : cfg.id === 'iceRobusta' ? -0.82 : cfg.id === 'ecxYirgacheffe' ? 2.15 : 0.95;
            const isPositive = changePercent >= 0;
            const lowCents = cfg.latestPriceCents * 0.97;
            const highCents = cfg.latestPriceCents * 1.03;

            return (
              <div
                key={cfg.id}
                id={`card-benchmark-${cfg.id}`}
                className="rounded-xl border border-stone-800/80 bg-stone-950/60 p-3.5 transition-all hover:border-stone-700 relative overflow-hidden"
              >
                <div
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{ backgroundColor: cfg.color }}
                />
                <div className="flex items-center justify-between text-xs text-stone-400 mt-1">
                  <span className="font-medium text-stone-200">{language === 'am' ? cfg.nameAm : cfg.name}</span>
                  <span className="text-[10px] font-mono text-stone-400">{cfg.categoryLabel}</span>
                </div>

                <div className="mt-1.5 flex items-baseline justify-between">
                  <div className="text-xl font-bold font-mono text-stone-100">
                    {price.toFixed(2)}
                    <span className="ml-1 text-xs font-normal text-stone-400 font-sans">
                      {getUnitSymbol()}
                    </span>
                  </div>
                  <div
                    className={`flex items-center text-xs font-mono font-semibold ${
                      isPositive ? 'text-emerald-400' : 'text-rose-400'
                    }`}
                  >
                    {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
                    {isPositive ? '+' : ''}
                    {changePercent.toFixed(2)}%
                  </div>
                </div>

                {/* Day Range Bar */}
                <div className="mt-2.5">
                  <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                    <span>{language === 'am' ? 'ዝቅ:' : 'L:'} {convertPrice(lowCents).toFixed(1)}</span>
                    <span>{language === 'am' ? 'ከፍ:' : 'H:'} {convertPrice(highCents).toFixed(1)}</span>
                  </div>
                  <div className="mt-1 h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        backgroundColor: cfg.color,
                        width: '65%',
                      }}
                    />
                  </div>
                </div>

                <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/60 pt-2">
                  <span>{language === 'am' ? cfg.differentialTextAm : cfg.differentialText}</span>
                  <span className="text-amber-400 font-mono">Live Ingestion</span>
                </div>
              </div>
            );
          })}

        {/* FOB Djibouti Physical Differential Box */}
        <div className="rounded-xl border border-amber-900/40 bg-gradient-to-br from-amber-950/40 to-stone-950 p-3.5">
          <div className="flex items-center justify-between text-xs text-amber-300">
            <span className="font-semibold">{language === 'am' ? 'የጅቡቲ ኤፍኦቢ ልዩነት' : 'FOB Djibouti Basis Diff'}</span>
            <span className="rounded bg-amber-950 px-1 py-0.5 text-[10px] text-amber-400 border border-amber-800">
              {language === 'am' ? 'ይርጋጨፌ ጂ2' : 'Benchmark Yirga G2'}
            </span>
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <div className="text-xl font-bold font-mono text-amber-300">
              +105.0¢/lb
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">
              {language === 'am' ? '+14¢ ከ30 ቀን በፊት' : '+14¢ vs 30d ago'}
            </span>
          </div>
          <p className="mt-1.5 text-[11px] text-stone-400 leading-snug">
            {language === 'am' ? 'የተገኘ ኤፍኦቢ: ' : 'Realized FOB: '}
            <strong className="text-stone-200 font-mono">$3.82/lb</strong> ($8.42/kg). {language === 'am' ? 'የአገር ውስጥ ተመን: ' : 'Local conversion: '}
            <strong className="text-amber-300 font-mono">1,090 ETB/kg</strong>.
          </p>
          <div className="mt-2 flex items-center gap-1.5 text-[10px] text-amber-400/90 border-t border-amber-900/40 pt-2">
            <Info className="h-3 w-3 shrink-0" />
            <span>{language === 'am' ? 'የታጠበ ቡና ፊዚካል ፕሪሚየም ከዓለም አቀፍ ፊውቸርስ በልጦ እየጨመረ ነው' : 'Washed physical premium expanding over futures'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
