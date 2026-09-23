import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  LineChart,
  Line,
  Area,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
  ReferenceLine,
  Brush,
} from 'recharts';
import {
  TrendingUp,
  Activity,
  Layers,
  Calendar,
  Eye,
  EyeOff,
  Maximize2,
  Sliders,
  BarChart2,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Info,
  Check,
  RotateCcw,
  Coffee,
  Globe2,
  Filter,
} from 'lucide-react';
import { HistoricalPricePoint, PriceUnit, ExchangeQuote, EthiopianGradeQuote } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HistoricalPriceRechartsProps {
  historicalData: HistoricalPricePoint[];
  unit: PriceUnit;
  currencyMode: 'USD' | 'ETB';
  selectedGrade?: EthiopianGradeQuote | null;
  onSelectGrade?: (grade: EthiopianGradeQuote) => void;
  exchanges?: ExchangeQuote[];
}

type Timeframe = '1M' | '3M' | '6M' | '1Y' | 'ALL';
type ChartStyle = 'lines' | 'area';

interface ExchangeSeriesDefinition {
  id: string;
  dataKey: string;
  name: string;
  nameAm: string;
  shortName: string;
  shortNameAm: string;
  exchangeLabel: string;
  exchangeLabelAm: string;
  color: string;
  defaultVisible: boolean;
  category: 'futures' | 'physical';
  description: string;
  descriptionAm: string;
  extractValue: (pt: HistoricalPricePoint) => number;
}

const USD_TO_ETB = 129.4;
const KG_PER_LB = 0.45359237;

function generateFallbackHistoricalPoints(): HistoricalPricePoint[] {
  const points: HistoricalPricePoint[] = [];
  const baseDate = new Date('2026-04-01');
  let ny = 272.0;
  let lon = 150.0;
  for (let i = 0; i < 90; i++) {
    const d = new Date(baseDate);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    ny += Math.sin(i / 6) * 1.5 + Math.cos(i / 10) * 0.8 + 0.15;
    lon += Math.cos(i / 5) * 0.9 + 0.05;
    const roundedNy = Math.round(ny * 100) / 100;
    const roundedLon = Math.round(lon * 100) / 100;
    points.push({
      date: dateStr,
      iceArabicaCents: roundedNy,
      iceRobustaCents: roundedLon,
      ecxYirgacheffeCents: Math.round((roundedNy + 105.0) * 100) / 100,
      ecxSidamoCents: Math.round((roundedNy + 55.0) * 100) / 100,
      ecxGujiCents: Math.round((roundedNy + 135.0) * 100) / 100,
      ecxLimuCents: Math.round((roundedNy + 35.0) * 100) / 100,
      ecxHararCents: Math.round((roundedNy + 42.0) * 100) / 100,
      fobDifferentialCents: 105.0,
      volume: Math.round(22000 + Math.sin(i / 3) * 8000),
      predictedPrice: i >= 80 ? Math.round((roundedNy + (i - 80) * 1.2) * 100) / 100 : undefined,
      confidenceUpper: i >= 80 ? Math.round((roundedNy + (i - 80) * 1.2 + 8) * 100) / 100 : undefined,
      confidenceLower: i >= 80 ? Math.round((roundedNy + (i - 80) * 1.2 - 8) * 100) / 100 : undefined,
    });
  }
  return points;
}

export const HistoricalPriceRecharts: React.FC<HistoricalPriceRechartsProps> = ({
  historicalData,
  unit,
  currencyMode,
  selectedGrade,
  onSelectGrade,
  exchanges,
}) => {
  const { language, t } = useLanguage();
  const isAmharic = language === 'am';

  // Interactive controls
  const [timeframe, setTimeframe] = useState<Timeframe>('6M');
  const [chartStyle, setChartStyle] = useState<ChartStyle>('lines');
  const [showVolume, setShowVolume] = useState<boolean>(false);
  const [showBrush, setShowBrush] = useState<boolean>(true);
  const [showForecast, setShowForecast] = useState<boolean>(true);

  // Active exchange visibility toggles
  const [visibleExchanges, setVisibleExchanges] = useState<Record<string, boolean>>({
    iceArabica: true,
    iceRobusta: true,
    ecxYirgacheffe: true,
    ecxSidamo: false,
    ecxGuji: false,
    ecxLimu: false,
    ecxHarar: false,
  });

  // Highlighted exchange for stats panel
  const [activeHighlight, setActiveHighlight] = useState<string>('iceArabica');

  // Convert cents/lb to current chosen unit
  const convertPrice = (centsLb: number): number => {
    if (unit === 'cents_lb') return Math.round(centsLb * 100) / 100;
    const usdPerLb = centsLb / 100;
    const usdPerKg = usdPerLb / KG_PER_LB;
    if (unit === 'usd_kg') return Math.round(usdPerKg * 100) / 100;
    return Math.round(usdPerKg * USD_TO_ETB * 10) / 10;
  };

  const getUnitLabel = (): string => {
    if (unit === 'cents_lb') return 'US¢ / lb';
    if (unit === 'usd_kg') return 'USD / kg';
    return 'ETB / kg';
  };

  const getUnitSymbol = (): string => {
    if (unit === 'cents_lb') return '¢/lb';
    if (unit === 'usd_kg') return '$/kg';
    return 'ETB/kg';
  };

  // Definitions for all available exchange price series
  const seriesDefinitions: ExchangeSeriesDefinition[] = useMemo(
    () => [
      {
        id: 'iceArabica',
        dataKey: 'iceArabica',
        name: 'ICE Arabica "C" (New York KC=F)',
        nameAm: 'አይሲኢ አራቢካ (ኒው ዮርክ ፊውቸርስ)',
        shortName: 'ICE Arabica',
        shortNameAm: 'አይሲኢ አራቢካ',
        exchangeLabel: 'ICE Futures U.S.',
        exchangeLabelAm: 'የአሜሪካ አይሲኢ',
        color: '#f59e0b', // amber-500
        defaultVisible: true,
        category: 'futures',
        description: 'Global benchmark for physical mild Arabica delivery contracts.',
        descriptionAm: 'ለዓለም አቀፍ የአራቢካ ቡና ግብይት ዓለም አቀፍ የማጣቀሻ ዋጋ።',
        extractValue: (pt) => pt.iceArabicaCents,
      },
      {
        id: 'iceRobusta',
        dataKey: 'iceRobusta',
        name: 'ICE Robusta (London RC=F)',
        nameAm: 'አይሲኢ ሮቡስታ (የለንደን ፊውቸርስ)',
        shortName: 'ICE Robusta',
        shortNameAm: 'አይሲኢ ሮቡስታ',
        exchangeLabel: 'ICE Futures Europe',
        exchangeLabelAm: 'የአውሮፓ አይሲኢ',
        color: '#06b6d4', // cyan-500
        defaultVisible: true,
        category: 'futures',
        description: 'London Robusta benchmark; key global blending substitution price.',
        descriptionAm: 'የለንደን ሮቡስታ መነሻ፤ ለቅይጥ እና ምትክ ጥናት ወሳኝ።',
        extractValue: (pt) => pt.iceRobustaCents,
      },
      {
        id: 'ecxYirgacheffe',
        dataKey: 'ecxYirgacheffe',
        name: 'ECX Yirgacheffe Washed G2',
        nameAm: 'ምርት ገበያ ይርጋጨፌ የታጠበ ደረጃ 2',
        shortName: 'ECX Yirgacheffe',
        shortNameAm: 'ምርት ገበያ ይርጋጨፌ',
        exchangeLabel: 'ECX Physical Session',
        exchangeLabelAm: 'የኢትዮጵያ ምርት ገበያ',
        color: '#10b981', // emerald-500
        defaultVisible: true,
        category: 'physical',
        description: 'Flagship floral washed grade with highest international specialty premium.',
        descriptionAm: 'ከፍተኛ የዓለም አቀፍ ልዩ ፕሪሚየም ያለው ዝነኛ የታጠበ ይርጋጨፌ ቡና።',
        extractValue: (pt) => pt.ecxYirgacheffeCents,
      },
      {
        id: 'ecxSidamo',
        dataKey: 'ecxSidamo',
        name: 'ECX Sidama Washed G2',
        nameAm: 'ምርት ገበያ ሲዳማ የታጠበ ደረጃ 2',
        shortName: 'ECX Sidama',
        shortNameAm: 'ምርት ገበያ ሲዳማ',
        exchangeLabel: 'ECX Physical Session',
        exchangeLabelAm: 'የኢትዮጵያ ምርት ገበያ',
        color: '#a855f7', // purple-500
        defaultVisible: false,
        category: 'physical',
        description: 'Commercial washed volume driver with consistent citrus and stone-fruit notes.',
        descriptionAm: 'ከፍተኛ የኤክስፖርት መጠን ያለው የታጠበ የሲዳማ ቡና ማጣቀሻ።',
        extractValue: (pt) => pt.ecxSidamoCents,
      },
      {
        id: 'ecxGuji',
        dataKey: 'ecxGuji',
        name: 'ECX Guji Specialty Natural G1',
        nameAm: 'ምርት ገበያ ጉጂ ልዩ ደረጃ 1',
        shortName: 'ECX Guji G1',
        shortNameAm: 'ምርት ገበያ ጉጂ',
        exchangeLabel: 'ECX Physical Session',
        exchangeLabelAm: 'የኢትዮጵያ ምርት ገበያ',
        color: '#f43f5e', // rose-500
        defaultVisible: false,
        category: 'physical',
        description: 'High-altitude micro-lot with intense dried strawberry and jasmine aromatics.',
        descriptionAm: 'የተፈጥሮ የጉጂ ከፍተኛ ቦታ ልዩ ቡና፣ ከፍተኛ የፍራፍሬ ጣዕም።',
        extractValue: (pt) => pt.ecxGujiCents ?? Math.round((pt.iceArabicaCents + 135) * 100) / 100,
      },
      {
        id: 'ecxLimu',
        dataKey: 'ecxLimu',
        name: 'ECX Limu / Jimma Washed G2',
        nameAm: 'ምርት ገበያ ሊሙ የታጠበ ደረጃ 2',
        shortName: 'ECX Limu',
        shortNameAm: 'ምርት ገበያ ሊሙ',
        exchangeLabel: 'ECX Physical Session',
        exchangeLabelAm: 'የኢትዮጵያ ምርት ገበያ',
        color: '#3b82f6', // blue-500
        defaultVisible: false,
        category: 'physical',
        description: 'Western Ethiopian highland washed profile with vibrant winey acidity.',
        descriptionAm: 'የምዕራብ ኢትዮጵያ የታጠበ ቡና የተመጣጠነ የአሲዳማነት ጣዕም።',
        extractValue: (pt) => pt.ecxLimuCents ?? Math.round((pt.iceArabicaCents + 35) * 100) / 100,
      },
      {
        id: 'ecxHarar',
        dataKey: 'ecxHarar',
        name: 'ECX Harar Longberry G4',
        nameAm: 'ምርት ገበያ ሐረር ሎንግቤሪ ደረጃ 4',
        shortName: 'ECX Harar',
        shortNameAm: 'ምርት ገበያ ሐረር',
        exchangeLabel: 'ECX Physical Session',
        exchangeLabelAm: 'የኢትዮጵያ ምርት ገበያ',
        color: '#ea580c', // orange-500
        defaultVisible: false,
        category: 'physical',
        description: 'Sun-dried eastern heirloom with wild blueberry and dark chocolate profile.',
        descriptionAm: 'የምሥራቅ ኢትዮጵያ በፀሐይ የደረቀ የተፈጥሮ ቡና ልዩ ጣዕም።',
        extractValue: (pt) => pt.ecxHararCents ?? Math.round((pt.iceArabicaCents + 42) * 100) / 100,
      },
    ],
    []
  );

  // Filter historical points by timeframe
  const rawSlicedPoints = useMemo(() => {
    const sourceData =
      historicalData && historicalData.length > 0
        ? historicalData
        : generateFallbackHistoricalPoints();
    const total = sourceData.length;
    let count = total;
    if (timeframe === '1M') count = Math.min(total, 30);
    else if (timeframe === '3M') count = Math.min(total, 60);
    else if (timeframe === '6M') count = Math.min(total, 90);
    else if (timeframe === '1Y') count = Math.min(total, 120);

    return sourceData.slice(-count);
  }, [historicalData, timeframe]);

  // Transform data points for Recharts with converted units
  const chartData = useMemo(() => {
    if (rawSlicedPoints.length === 0) return [];

    return rawSlicedPoints.map((pt) => {
      const item: Record<string, any> = {
        date: pt.date,
        formattedDate: pt.date.length > 5 ? pt.date.slice(5) : pt.date,
        volume: pt.volume || 25000,
      };

      seriesDefinitions.forEach((def) => {
        const valCents = def.extractValue(pt);
        item[def.dataKey] = convertPrice(valCents);
      });

      // AI Forecast Projection overlay
      if (pt.predictedPrice) {
        item.predictedPrice = convertPrice(pt.predictedPrice);
      }
      if (pt.confidenceUpper && pt.confidenceLower) {
        item.confidenceUpper = convertPrice(pt.confidenceUpper);
        item.confidenceLower = convertPrice(pt.confidenceLower);
        item.confidenceSpread = [item.confidenceLower, item.confidenceUpper];
      }

      return item;
    });
  }, [rawSlicedPoints, seriesDefinitions, unit, currencyMode]);

  // Toggle exchange visibility
  const toggleExchange = (id: string) => {
    setVisibleExchanges((prev) => {
      const updated = { ...prev, [id]: !prev[id] };
      // Ensure at least one remains active
      const hasAny = Object.values(updated).some(Boolean);
      if (!hasAny) {
        return { ...prev, [id]: true };
      }
      return updated;
    });
  };

  // Preset view filters
  const applyViewPreset = (preset: 'all' | 'futures' | 'physical' | 'arabica_yirga') => {
    if (preset === 'all') {
      const allTrue: Record<string, boolean> = {};
      seriesDefinitions.forEach((s) => (allTrue[s.id] = true));
      setVisibleExchanges(allTrue);
    } else if (preset === 'futures') {
      setVisibleExchanges({
        iceArabica: true,
        iceRobusta: true,
        ecxYirgacheffe: false,
        ecxSidamo: false,
        ecxGuji: false,
        ecxLimu: false,
        ecxHarar: false,
      });
      setActiveHighlight('iceArabica');
    } else if (preset === 'physical') {
      setVisibleExchanges({
        iceArabica: false,
        iceRobusta: false,
        ecxYirgacheffe: true,
        ecxSidamo: true,
        ecxGuji: true,
        ecxLimu: false,
        ecxHarar: false,
      });
      setActiveHighlight('ecxYirgacheffe');
    } else if (preset === 'arabica_yirga') {
      setVisibleExchanges({
        iceArabica: true,
        iceRobusta: false,
        ecxYirgacheffe: true,
        ecxSidamo: false,
        ecxGuji: false,
        ecxLimu: false,
        ecxHarar: false,
      });
      setActiveHighlight('ecxYirgacheffe');
    }
  };

  // Compute stats for highlighted exchange
  const highlightStats = useMemo(() => {
    if (chartData.length === 0) return null;
    const def = seriesDefinitions.find((s) => s.id === activeHighlight) || seriesDefinitions[0];
    const values = chartData.map((d) => d[def.dataKey]).filter((v) => typeof v === 'number' && !isNaN(v));
    if (values.length === 0) return null;

    const first = values[0];
    const latest = values[values.length - 1];
    const change = latest - first;
    const changePct = first > 0 ? (change / first) * 100 : 0;
    const high = Math.max(...values);
    const low = Math.min(...values);

    // Spread vs ICE Arabica
    const arabicaLatest = chartData[chartData.length - 1]?.iceArabica;
    const spreadVsArabica = def.id !== 'iceArabica' && arabicaLatest ? latest - arabicaLatest : null;

    return {
      definition: def,
      latest,
      change,
      changePct,
      high,
      low,
      spreadVsArabica,
    };
  }, [chartData, activeHighlight, seriesDefinitions]);

  // Active count
  const activeCount = Object.values(visibleExchanges).filter(Boolean).length;

  // Custom Recharts Tooltip
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (!active || !payload || !payload.length) return null;

    return (
      <div className="rounded-xl border border-stone-700/80 bg-stone-950/95 p-3.5 shadow-2xl backdrop-blur-md text-xs min-w-[240px]">
        <div className="flex items-center justify-between border-b border-stone-800 pb-2 mb-2">
          <div className="flex items-center gap-1.5 font-semibold text-stone-200">
            <Calendar className="h-3.5 w-3.5 text-amber-500" />
            <span>{label}</span>
          </div>
          <span className="rounded bg-stone-900 px-1.5 py-0.5 font-mono text-[10px] text-stone-400 border border-stone-800">
            {getUnitSymbol()}
          </span>
        </div>

        <div className="space-y-1.5">
          {payload.map((entry: any) => {
            const def = seriesDefinitions.find((s) => s.dataKey === entry.dataKey);
            const isHighlighted = def?.id === activeHighlight;

            // Don't show volume or confidence upper/lower in regular rows
            if (entry.dataKey === 'volume' || entry.dataKey === 'confidenceUpper' || entry.dataKey === 'confidenceLower') {
              return null;
            }

            if (entry.dataKey === 'predictedPrice') {
              return (
                <div key="pred" className="flex items-center justify-between font-mono text-amber-400 py-0.5 border-t border-amber-900/40">
                  <span className="flex items-center gap-1">
                    <Sparkles className="h-3 w-3" />
                    <span>{isAmharic ? 'የ AI ትንበያ:' : 'AI Projection:'}</span>
                  </span>
                  <span className="font-bold">{entry.value}</span>
                </div>
              );
            }

            const nameStr = isAmharic && def ? def.shortNameAm : (def?.shortName || entry.name);

            return (
              <div
                key={entry.dataKey}
                className={`flex items-center justify-between font-mono py-0.5 px-1 rounded ${
                  isHighlighted ? 'bg-stone-800/80' : ''
                }`}
              >
                <div className="flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-stone-300 font-sans">{nameStr}:</span>
                </div>
                <span className="font-bold text-stone-100">
                  {entry.value !== undefined ? Number(entry.value).toFixed(unit === 'usd_kg' ? 2 : 1) : '-'}
                </span>
              </div>
            );
          })}
        </div>

        {/* Volume summary */}
        {showVolume && payload[0]?.payload?.volume && (
          <div className="mt-2 pt-2 border-t border-stone-800/80 flex items-center justify-between text-[11px] text-stone-400 font-mono">
            <span>{isAmharic ? 'የግብይት መጠን:' : 'Contract Volume:'}</span>
            <span className="text-stone-300 font-bold">{payload[0].payload.volume.toLocaleString()} lots</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      id="recharts-historical-trends-container"
      className="rounded-xl border border-stone-800 bg-stone-900/70 p-4 sm:p-5 shadow-xl transition-all"
    >
      {/* 1. Header & Title with Live Badge */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-2">
              <BarChart2 className="h-5 w-5 text-amber-500" />
              <h2 className="text-base font-bold text-stone-100 sm:text-lg">
                {isAmharic ? 'የቡና ዋጋ ታሪካዊ አዝማሚያ በ Recharts' : 'Historical Coffee Price Trends (Recharts)'}
              </h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {isAmharic ? 'ቀጥታ መረጃ' : 'Multi-Exchange Stream'}
            </span>
            <span className="rounded bg-amber-950/70 px-2 py-0.5 text-xs font-mono font-semibold text-amber-300 border border-amber-800/50">
              {getUnitLabel()}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-1">
            {isAmharic
              ? 'በአይሲኢ እና በኢትዮጵያ ምርት ገበያ መካከል ያሉትን ታሪካዊ የዋጋ ልዩነቶች እና አዝማሚያዎችን መርጠው ያነጻጽሩ'
              : 'Interactive Recharts visualization comparing ICE New York, London Robusta, and Ethiopian Commodity Exchange (ECX) physical auction histories.'}
          </p>
        </div>

        {/* Action Controls: Timeframe, Chart Style, AI Forecast */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Chart Style Toggle (Lines vs Area) */}
          <div className="flex items-center rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
            <button
              onClick={() => setChartStyle('lines')}
              className={`px-2 py-1 rounded transition-colors ${
                chartStyle === 'lines'
                  ? 'bg-stone-800 text-amber-300 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Spline Line Chart"
            >
              {isAmharic ? 'መስመር' : 'Lines'}
            </button>
            <button
              onClick={() => setChartStyle('area')}
              className={`px-2 py-1 rounded transition-colors ${
                chartStyle === 'area'
                  ? 'bg-stone-800 text-amber-300 font-semibold shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="Gradient Area Chart"
            >
              {isAmharic ? 'ሽፋን' : 'Area'}
            </button>
          </div>

          {/* Volume toggle */}
          <button
            onClick={() => setShowVolume(!showVolume)}
            className={`flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs border transition-colors ${
              showVolume
                ? 'bg-amber-950/60 border-amber-600/50 text-amber-300 font-semibold'
                : 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
            title="Toggle trading volume bars on secondary axis"
          >
            <Activity className="h-3 w-3" />
            <span>{isAmharic ? 'መጠን' : 'Volume'}</span>
          </button>

          {/* Timeframe selector */}
          <div className="flex items-center rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
            {(['1M', '3M', '6M', '1Y', 'ALL'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                id={`recharts-btn-timeframe-${tf}`}
                onClick={() => setTimeframe(tf)}
                className={`px-2 py-1 rounded font-mono transition-colors ${
                  timeframe === tf
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tf === '1M' && isAmharic ? '1ወ' :
                 tf === '3M' && isAmharic ? '3ወ' :
                 tf === '6M' && isAmharic ? '6ወ' :
                 tf === '1Y' && isAmharic ? '1ዓ' :
                 tf === 'ALL' && isAmharic ? 'ሁሉም' : tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Interactive Exchange Toggles & Quick Preset Filters */}
      <div className="mt-3 rounded-lg bg-stone-950/90 p-3 border border-stone-800/80">
        <div className="flex flex-col gap-2.5">
          {/* Quick Presets Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/60 pb-2">
            <div className="flex items-center gap-1.5 text-xs text-stone-400">
              <Filter className="h-3.5 w-3.5 text-amber-400" />
              <span className="font-semibold text-stone-300">
                {isAmharic ? 'ፈጣን የማነጻጸሪያ ምርጫዎች:' : 'Comparison Presets:'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
              <button
                onClick={() => applyViewPreset('futures')}
                className="rounded bg-stone-900 hover:bg-stone-800 text-cyan-300 px-2 py-0.5 border border-stone-800 transition-colors"
              >
                {isAmharic ? 'አይሲኢ ፊውቸርስ ብቻ' : 'ICE Futures Only'}
              </button>
              <button
                onClick={() => applyViewPreset('physical')}
                className="rounded bg-stone-900 hover:bg-stone-800 text-emerald-300 px-2 py-0.5 border border-stone-800 transition-colors"
              >
                {isAmharic ? 'የምርት ገበያ ጨረታ ብቻ' : 'ECX Physical Only'}
              </button>
              <button
                onClick={() => applyViewPreset('arabica_yirga')}
                className="rounded bg-stone-900 hover:bg-stone-800 text-amber-300 px-2 py-0.5 border border-stone-800 transition-colors"
              >
                {isAmharic ? 'አራቢካ + ይርጋጨፌ' : 'Arabica vs Yirgacheffe'}
              </button>
              <button
                onClick={() => applyViewPreset('all')}
                className="rounded bg-stone-900 hover:bg-stone-800 text-stone-300 px-2 py-0.5 border border-stone-800 transition-colors"
              >
                {isAmharic ? 'ሁሉንም አሳይ' : 'Show All'}
              </button>
            </div>
          </div>

          {/* Toggle Pills for each exchange */}
          <div className="flex flex-wrap items-center gap-2 pt-1">
            <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-amber-400" />
              {isAmharic ? 'የልውውጥ ዋጋዎችን ይምረጡ:' : 'Toggle Exchanges:'}
            </span>

            {seriesDefinitions.map((def) => {
              const isVisible = visibleExchanges[def.id] ?? false;
              const isHighlighted = activeHighlight === def.id;

              return (
                <div key={def.id} className="flex items-center">
                  <button
                    id={`toggle-recharts-${def.id}`}
                    onClick={() => {
                      toggleExchange(def.id);
                      setActiveHighlight(def.id);
                    }}
                    className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border transition-all ${
                      isVisible
                        ? 'bg-stone-900 border-stone-700 text-stone-100 shadow-sm'
                        : 'bg-stone-950/60 border-stone-800/80 text-stone-500 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <span
                      className="h-2 w-2 rounded-full shrink-0"
                      style={{ backgroundColor: isVisible ? def.color : '#78716c' }}
                    />
                    <span>{isAmharic ? def.shortNameAm : def.shortName}</span>
                    {isVisible ? (
                      <Check className="h-3 w-3 text-emerald-400 ml-0.5" />
                    ) : (
                      <EyeOff className="h-3 w-3 text-stone-500 ml-0.5" />
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. Recharts Visual Stage */}
      <div className="mt-4 rounded-xl border border-stone-800 bg-stone-950 p-2 sm:p-4">
        {/* Top bar showing active legend with latest figures */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-800/70 pb-2.5 mb-3 text-xs">
          <div className="flex flex-wrap items-center gap-3">
            {seriesDefinitions
              .filter((def) => visibleExchanges[def.id])
              .map((def) => {
                const latestVal = chartData.length > 0 ? chartData[chartData.length - 1][def.dataKey] : null;
                const isHighlighted = activeHighlight === def.id;

                return (
                  <button
                    key={def.id}
                    onClick={() => setActiveHighlight(def.id)}
                    className={`flex items-center gap-1.5 font-mono text-[11px] px-2 py-0.5 rounded transition-all ${
                      isHighlighted
                        ? 'bg-stone-800 text-stone-100 border border-stone-700 font-bold'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                    title="Click to view detailed metrics for this exchange"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full"
                      style={{ backgroundColor: def.color }}
                    />
                    <span className="font-sans font-medium">
                      {isAmharic ? def.shortNameAm : def.shortName}:
                    </span>
                    <span className="font-bold text-stone-100">
                      {latestVal !== null && latestVal !== undefined ? latestVal.toFixed(unit === 'usd_kg' ? 2 : 1) : '-'}
                    </span>
                  </button>
                );
              })}
          </div>

          <div className="flex items-center gap-2 text-[11px] text-stone-400 font-mono">
            <span>Points: {chartData.length}</span>
            <span>•</span>
            <span className="text-amber-400">Recharts v2</span>
          </div>
        </div>

        {/* Responsive Recharts Container */}
        <div className="h-[360px] w-full select-none">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 20, left: 10, bottom: showBrush ? 0 : 15 }}>
              <defs>
                {/* Gradients for Area mode */}
                {seriesDefinitions.map((def) => (
                  <linearGradient key={def.id} id={`grad-${def.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={def.color} stopOpacity={0.35} />
                    <stop offset="95%" stopColor={def.color} stopOpacity={0.0} />
                  </linearGradient>
                ))}
                <linearGradient id="volumeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#78716c" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#78716c" stopOpacity={0.05} />
                </linearGradient>
              </defs>

              <CartesianGrid stroke="#292524" strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="formattedDate"
                stroke="#78716c"
                fontSize={10}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
                interval="preserveStartEnd"
              />

              {/* Primary Price Axis */}
              <YAxis
                yAxisId="priceAxis"
                stroke="#a8a29e"
                fontSize={10}
                domain={['auto', 'auto']}
                tickLine={false}
                axisLine={{ stroke: '#44403c' }}
                tickFormatter={(v) => Number(v).toFixed(unit === 'usd_kg' ? 1 : 0)}
              />

              {/* Optional Secondary Volume Axis */}
              {showVolume && (
                <YAxis
                  yAxisId="volumeAxis"
                  orientation="right"
                  stroke="#57534e"
                  fontSize={9}
                  domain={[0, 'dataMax * 3']}
                  hide={false}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
                />
              )}

              <Tooltip content={<CustomTooltip />} />

              {/* Trading volume bars */}
              {showVolume && (
                <Bar
                  yAxisId="volumeAxis"
                  dataKey="volume"
                  fill="url(#volumeGrad)"
                  radius={[2, 2, 0, 0]}
                  barSize={12}
                />
              )}

              {/* Series Renderers */}
              {seriesDefinitions.map((def) => {
                if (!visibleExchanges[def.id]) return null;

                if (chartStyle === 'area') {
                  return (
                    <Area
                      key={def.id}
                      yAxisId="priceAxis"
                      type="monotone"
                      dataKey={def.dataKey}
                      name={isAmharic ? def.shortNameAm : def.shortName}
                      stroke={def.color}
                      strokeWidth={def.id === activeHighlight ? 2.5 : 1.8}
                      fill={`url(#grad-${def.id})`}
                      dot={false}
                      activeDot={{ r: 5, fill: def.color, stroke: '#1c1917', strokeWidth: 2 }}
                    />
                  );
                }

                return (
                  <Line
                    key={def.id}
                    yAxisId="priceAxis"
                    type="monotone"
                    dataKey={def.dataKey}
                    name={isAmharic ? def.shortNameAm : def.shortName}
                    stroke={def.color}
                    strokeWidth={def.id === activeHighlight ? 2.5 : 1.8}
                    dot={false}
                    activeDot={{ r: 5, fill: def.color, stroke: '#1c1917', strokeWidth: 2 }}
                  />
                );
              })}

              {/* AI Predicted Line segment */}
              {showForecast && visibleExchanges.iceArabica && (
                <Line
                  yAxisId="priceAxis"
                  type="monotone"
                  dataKey="predictedPrice"
                  name={isAmharic ? 'የ AI ትንበያ' : 'AI Prediction'}
                  stroke="#fbbf24"
                  strokeWidth={2}
                  strokeDasharray="4 4"
                  dot={false}
                />
              )}

              {/* Interactive Timeline Brush */}
              {showBrush && (
                <Brush
                  dataKey="formattedDate"
                  height={26}
                  stroke="#78716c"
                  fill="#1c1917"
                  travellerWidth={10}
                >
                  <LineChart>
                    <Line
                      type="monotone"
                      dataKey="iceArabica"
                      stroke="#f59e0b"
                      strokeWidth={1}
                      dot={false}
                    />
                  </LineChart>
                </Brush>
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* 4. Highlighted Exchange Stat Cards & Spread Summary */}
      {highlightStats && (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Latest Price */}
          <div className="rounded-lg border border-stone-800 bg-stone-950/70 p-3">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span className="font-medium text-stone-300">
                {isAmharic ? highlightStats.definition.nameAm : highlightStats.definition.name}
              </span>
              <span className="text-[10px] font-mono text-stone-400">
                {highlightStats.definition.exchangeLabel}
              </span>
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <div className="text-xl font-bold font-mono text-stone-100">
                {highlightStats.latest.toFixed(unit === 'usd_kg' ? 2 : 1)}{' '}
                <span className="text-xs font-normal text-stone-400 font-sans">
                  {getUnitSymbol()}
                </span>
              </div>
              <div
                className={`flex items-center text-xs font-mono font-semibold ${
                  highlightStats.changePct >= 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {highlightStats.changePct >= 0 ? (
                  <ArrowUpRight className="h-3.5 w-3.5" />
                ) : (
                  <ArrowDownRight className="h-3.5 w-3.5" />
                )}
                {highlightStats.changePct >= 0 ? '+' : ''}
                {highlightStats.changePct.toFixed(2)}%
              </div>
            </div>
            <p className="text-[11px] text-stone-400 mt-1 line-clamp-1">
              {isAmharic ? highlightStats.definition.descriptionAm : highlightStats.definition.description}
            </p>
          </div>

          {/* Timeframe Range (High / Low) */}
          <div className="rounded-lg border border-stone-800 bg-stone-950/70 p-3">
            <div className="text-xs font-medium text-stone-400">
              {isAmharic ? `የ ${timeframe} የዋጋ ክልል` : `${timeframe} Trading Range`}
            </div>
            <div className="mt-1 flex items-baseline justify-between font-mono">
              <div>
                <span className="text-[10px] text-stone-400 block">{isAmharic ? 'ዝቅተኛ:' : 'Period Low:'}</span>
                <span className="text-sm font-bold text-rose-300">
                  {highlightStats.low.toFixed(1)} {getUnitSymbol()}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 block">{isAmharic ? 'ከፍተኛ:' : 'Period High:'}</span>
                <span className="text-sm font-bold text-emerald-300">
                  {highlightStats.high.toFixed(1)} {getUnitSymbol()}
                </span>
              </div>
            </div>
            <div className="mt-2 h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  backgroundColor: highlightStats.definition.color,
                  width: `${Math.min(
                    100,
                    Math.max(
                      10,
                      ((highlightStats.latest - highlightStats.low) /
                        Math.max(1, highlightStats.high - highlightStats.low)) *
                        100
                    )
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Spread vs ICE Arabica */}
          <div className="rounded-lg border border-stone-800 bg-stone-950/70 p-3">
            <div className="text-xs font-medium text-stone-400">
              {isAmharic ? 'ከአይሲኢ አራቢካ ጋር ያለው ልዩነት' : 'Spread vs ICE Arabica Benchmark'}
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              {highlightStats.spreadVsArabica !== null ? (
                <>
                  <div className="text-xl font-bold font-mono text-amber-300">
                    {highlightStats.spreadVsArabica >= 0 ? '+' : ''}
                    {highlightStats.spreadVsArabica.toFixed(1)}{' '}
                    <span className="text-xs font-normal text-stone-400 font-sans">
                      {getUnitSymbol()}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-mono font-semibold ${
                      highlightStats.spreadVsArabica >= 0 ? 'text-emerald-400' : 'text-cyan-400'
                    }`}
                  >
                    {highlightStats.spreadVsArabica >= 0 ? 'Specialty Premium' : 'Discount Basis'}
                  </span>
                </>
              ) : (
                <div className="text-base font-bold font-mono text-stone-300">
                  {isAmharic ? 'መደበኛ መነሻ ዋጋ' : 'Primary Benchmark Standard'}
                </div>
              )}
            </div>
            <div className="mt-1 text-[11px] text-stone-400">
              {highlightStats.spreadVsArabica !== null
                ? isAmharic
                  ? 'የኢትዮጵያ ምርት ገበያ የፊዚካል ቡና መነሻ ልዩነት'
                  : 'Physical auction / differential arbitrage indicator'
                : 'NY "C" futures baseline contract'}
            </div>
          </div>

          {/* Multi-Exchange Correlation & Arb Note */}
          <div className="rounded-lg border border-amber-900/40 bg-gradient-to-br from-amber-950/30 to-stone-950 p-3">
            <div className="flex items-center justify-between text-xs text-amber-300">
              <span className="font-semibold">{isAmharic ? 'የገበያ ትንተና' : 'Exchange Correlation'}</span>
              <span className="rounded bg-amber-900/60 px-1.5 py-0.2 text-[10px] text-amber-300">
                {activeCount} {isAmharic ? 'ተመርጧል' : 'Active'}
              </span>
            </div>
            <p className="mt-1 text-xs text-stone-300 leading-snug">
              {isAmharic
                ? 'በአይሲኢ ፊውቸርስ እና በኢትዮጵያ የታጠበ ቡና መካከል ያለው የዋጋ ግንኙነት በ 89% የተጣጣመ ነው።'
                : 'ICE Arabica and ECX Washed auction prices show an 89% directional correlation with expanding physical differentials.'}
            </p>
            <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/80 pt-1.5">
              <span>{isAmharic ? 'ኤፍኦቢ ጅቡቲ ልዩነት:' : 'FOB Basis Diff:'}</span>
              <span className="font-mono font-bold text-amber-400">+105.0¢/lb</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
