import React, { useState, useMemo, useEffect, useRef } from 'react';
import {
  Globe2,
  TrendingUp,
  TrendingDown,
  Clock,
  Activity,
  Layers,
  BarChart3,
  CandlestickChart,
  Ship,
  Sparkles,
  RefreshCw,
  Info,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  ShieldCheck,
  Zap,
  Check,
  SlidersHorizontal,
} from 'lucide-react';
import {
  GlobalCMarket,
  GlobalCHistoricalPoint,
  GlobalExchangeId,
  PriceUnit,
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface LiveCMarketsViewProps {
  markets: GlobalCMarket[];
  unit: PriceUnit;
  currencyMode: 'USD' | 'ETB';
  onRefresh?: () => void;
}

type Timeframe = '1D' | '1W' | '1M' | '3M' | '1Y' | '5Y';
type ChartViewMode = 'COMPARISON' | 'CANDLESTICK' | 'ARBITRAGE_SPREAD';

const USD_TO_ETB = 129.4;
const KG_PER_LB = 0.45359237;

export const LiveCMarketsView: React.FC<LiveCMarketsViewProps> = ({
  markets,
  unit,
  currencyMode,
  onRefresh,
}) => {
  const { language } = useLanguage();
  const isAmharic = language === 'am';

  // Active selections
  const [selectedMarketId, setSelectedMarketId] = useState<GlobalExchangeId>('ICE_NY_ARABICA');
  const [timeframe, setTimeframe] = useState<Timeframe>('3M');
  const [chartMode, setChartMode] = useState<ChartViewMode>('COMPARISON');
  const [isLivePulseActive, setIsLivePulseActive] = useState<boolean>(true);
  const [livePoints, setLivePoints] = useState<GlobalCHistoricalPoint[]>([]);
  const [isLoadingPoints, setIsLoadingPoints] = useState<boolean>(false);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [lastTickTime, setLastTickTime] = useState<string>(new Date().toLocaleTimeString());
  const [tickCounter, setTickCounter] = useState<number>(0);

  // Active series toggles for comparison mode
  const [activeSeries, setActiveSeries] = useState<Record<GlobalExchangeId, boolean>>({
    ICE_NY_ARABICA: true,
    ICE_LON_ROBUSTA: true,
    CHINA_YUNNAN: true,
    JAPAN_TOKYO: true,
    DUBAI_DMCC: true,
    ECX_ETHIOPIA: false,
  });

  // Fetch or update historical points when timeframe changes
  useEffect(() => {
    fetchTimeframeData(timeframe);
  }, [timeframe]);

  const fetchTimeframeData = async (tf: Timeframe) => {
    setIsLoadingPoints(true);
    try {
      const res = await fetch(`/api/c-markets?timeframe=${tf}`);
      if (res.ok) {
        const data = await res.json();
        if (data.points && Array.isArray(data.points)) {
          setLivePoints(data.points);
        }
      }
    } catch (e) {
      console.error('Failed to load C-market points:', e);
    } finally {
      setIsLoadingPoints(false);
    }
  };

  // Live Pulse Simulation interval (every 4 seconds if active)
  useEffect(() => {
    if (!isLivePulseActive) return;

    const interval = setInterval(() => {
      setLastTickTime(new Date().toLocaleTimeString());
      setTickCounter((prev) => prev + 1);

      // Subtle jitter on the last point for real-time live feeling
      setLivePoints((prev) => {
        if (prev.length === 0) return prev;
        const last = { ...prev[prev.length - 1] };
        const jitter = (Math.random() - 0.48) * 0.35;
        last.newYorkArabica = Math.round((last.newYorkArabica + jitter) * 100) / 100;
        last.londonRobusta = Math.round((last.londonRobusta + ((Math.random() - 0.5) * 0.25)) * 100) / 100;
        last.chinaYunnan = Math.round((last.chinaYunnan + ((Math.random() - 0.46) * 0.3)) * 100) / 100;
        last.dubaiDmcc = Math.round((last.dubaiDmcc + ((Math.random() - 0.47) * 0.28)) * 100) / 100;
        last.close = last.newYorkArabica;
        last.high = Math.max(last.high, last.close);
        last.low = Math.min(last.low, last.close);
        return [...prev.slice(0, -1), last];
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [isLivePulseActive]);

  // Selected market reference
  const selectedMarket = useMemo(() => {
    return markets.find((m) => m.id === selectedMarketId) || markets[0];
  }, [markets, selectedMarketId]);

  // Unit conversion helper
  const convertPrice = (centsLb: number): number => {
    if (unit === 'cents_lb') return centsLb;
    const usdPerLb = centsLb / 100;
    const usdPerKg = usdPerLb / KG_PER_LB;
    if (unit === 'usd_kg') return usdPerKg;
    return usdPerKg * USD_TO_ETB; // etb_kg
  };

  const getUnitSymbol = (): string => {
    if (unit === 'cents_lb') return '¢/lb';
    if (unit === 'usd_kg') return '$/kg';
    return 'ETB/kg';
  };

  // Color mapping per market
  const marketColors: Record<GlobalExchangeId, { stroke: string; fill: string; text: string; bg: string }> = {
    ICE_NY_ARABICA: { stroke: '#f59e0b', fill: 'rgba(245, 158, 11, 0.12)', text: 'text-amber-500', bg: 'bg-amber-500/10' }, // Amber
    ICE_LON_ROBUSTA: { stroke: '#3b82f6', fill: 'rgba(59, 130, 246, 0.12)', text: 'text-blue-500', bg: 'bg-blue-500/10' },   // Blue
    CHINA_YUNNAN: { stroke: '#ef4444', fill: 'rgba(239, 68, 68, 0.12)', text: 'text-red-500', bg: 'bg-red-500/10' },        // Red
    JAPAN_TOKYO: { stroke: '#a855f7', fill: 'rgba(168, 85, 247, 0.12)', text: 'text-purple-500', bg: 'bg-purple-500/10' },    // Purple
    DUBAI_DMCC: { stroke: '#10b981', fill: 'rgba(16, 185, 129, 0.12)', text: 'text-emerald-500', bg: 'bg-emerald-500/10' },  // Emerald
    ECX_ETHIOPIA: { stroke: '#eab308', fill: 'rgba(234, 179, 8, 0.12)', text: 'text-yellow-500', bg: 'bg-yellow-500/10' },    // Gold
  };

  // Key stats calculations
  const nyMarket = markets.find((m) => m.id === 'ICE_NY_ARABICA');
  const lonMarket = markets.find((m) => m.id === 'ICE_LON_ROBUSTA');
  const dxbMarket = markets.find((m) => m.id === 'DUBAI_DMCC');
  const chnMarket = markets.find((m) => m.id === 'CHINA_YUNNAN');
  const jpnMarket = markets.find((m) => m.id === 'JAPAN_TOKYO');

  const arabicaRobustaSpread = nyMarket && lonMarket ? (nyMarket.priceCentsLb - lonMarket.priceCentsLb).toFixed(2) : '30.80';
  const japanPremium = nyMarket && jpnMarket ? (jpnMarket.priceCentsLb - nyMarket.priceCentsLb).toFixed(2) : '22.50';
  const dubaiSpread = nyMarket && dxbMarket ? (dxbMarket.priceCentsLb - nyMarket.priceCentsLb).toFixed(2) : '11.90';

  // SVG dimensions
  const svgWidth = 920;
  const svgHeight = 360;
  const padLeft = 65;
  const padRight = 35;
  const padTop = 25;
  const padBottom = 40;
  const chartWidth = svgWidth - padLeft - padRight;
  const chartHeight = svgHeight - padTop - padBottom;

  // Chart data calculations
  const { minVal, maxVal, processedPoints } = useMemo(() => {
    if (livePoints.length === 0) {
      return { minVal: 150, maxVal: 320, processedPoints: [] };
    }

    let min = Infinity;
    let max = -Infinity;

    const pointsWithConverted = livePoints.map((p) => {
      const cNY = convertPrice(p.newYorkArabica);
      const cLon = convertPrice(p.londonRobusta);
      const cChn = convertPrice(p.chinaYunnan);
      const cJpn = convertPrice(p.japanTokyo);
      const cDxb = convertPrice(p.dubaiDmcc);
      const cEcx = convertPrice(p.ethiopiaEcx);

      // In comparison mode, inspect all active series
      if (chartMode === 'COMPARISON') {
        if (activeSeries.ICE_NY_ARABICA) { min = Math.min(min, cNY); max = Math.max(max, cNY); }
        if (activeSeries.ICE_LON_ROBUSTA) { min = Math.min(min, cLon); max = Math.max(max, cLon); }
        if (activeSeries.CHINA_YUNNAN) { min = Math.min(min, cChn); max = Math.max(max, cChn); }
        if (activeSeries.JAPAN_TOKYO) { min = Math.min(min, cJpn); max = Math.max(max, cJpn); }
        if (activeSeries.DUBAI_DMCC) { min = Math.min(min, cDxb); max = Math.max(max, cDxb); }
        if (activeSeries.ECX_ETHIOPIA) { min = Math.min(min, cEcx); max = Math.max(max, cEcx); }
      } else if (chartMode === 'CANDLESTICK') {
        const cOpen = convertPrice(p.open);
        const cHigh = convertPrice(p.high);
        const cLow = convertPrice(p.low);
        const cClose = convertPrice(p.close);
        min = Math.min(min, cLow);
        max = Math.max(max, cHigh);
      } else if (chartMode === 'ARBITRAGE_SPREAD') {
        // Spread between NY and London
        const spread = cNY - cLon;
        min = Math.min(min, spread);
        max = Math.max(max, spread);
      }

      return {
        ...p,
        cNY,
        cLon,
        cChn,
        cJpn,
        cDxb,
        cEcx,
        cOpen: convertPrice(p.open),
        cHigh: convertPrice(p.high),
        cLow: convertPrice(p.low),
        cClose: convertPrice(p.close),
        spread: cNY - cLon,
      };
    });

    if (min === Infinity || max === -Infinity) {
      min = 180;
      max = 300;
    }

    const buffer = (max - min) * 0.08 || 10;
    return {
      minVal: Math.max(0, min - buffer),
      maxVal: max + buffer,
      processedPoints: pointsWithConverted,
    };
  }, [livePoints, chartMode, activeSeries, unit]);

  const getX = (idx: number) => {
    if (processedPoints.length <= 1) return padLeft;
    return padLeft + (idx / (processedPoints.length - 1)) * chartWidth;
  };

  const getY = (val: number) => {
    if (maxVal === minVal) return padTop + chartHeight / 2;
    return padTop + (1 - (val - minVal) / (maxVal - minVal)) * chartHeight;
  };

  // Generate SVG path
  const makeLinePath = (getter: (d: any) => number) => {
    if (processedPoints.length === 0) return '';
    return processedPoints
      .map((d, i) => `${i === 0 ? 'M' : 'L'} ${getX(i).toFixed(1)},${getY(getter(d)).toFixed(1)}`)
      .join(' ');
  };

  const makeAreaPath = (getter: (d: any) => number) => {
    if (processedPoints.length === 0) return '';
    const line = makeLinePath(getter);
    const lastX = getX(processedPoints.length - 1);
    const firstX = getX(0);
    const bottomY = padTop + chartHeight;
    return `${line} L ${lastX},${bottomY} L ${firstX},${bottomY} Z`;
  };

  return (
    <div className="space-y-6">
      {/* 1. TOP HEADER & WORLD TRADING MATRIX */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                <Globe2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-stone-900 dark:text-stone-100">
                {isAmharic
                  ? 'የአለም አቀፍ የቡና ሲ-ገበያዎች እና የመዳረሻዎች የቀጥታ ቻርት ተርሚናል'
                  : 'Global C-Markets & Destination Benchmark Live Terminal'}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                LIVE STREAM
              </span>
            </div>
            <p className="text-sm text-stone-600 dark:text-stone-400 max-w-3xl">
              {isAmharic
                ? 'የለንደን ሮቡስታ፣ የኒው ዮርክ አራቢካ፣ የቻይና ዩናን/ሻንጋይ፣ የጃፓን ቶኪዮ እና የመካከለኛው ምስራቅ (ዱባይ DMCC) የቀጥታ ዋጋዎች ከኢትዮጵያ ምርት ገበያ እና ከወጪ ንግድ ፍሰት ጋር በንፅፅር።'
                : 'Direct live synchronization across London (Robusta), New York (Arabica C), China (Yunnan & Shanghai), Japan (Tokyo AJCA), and Middle East (Dubai DMCC) with exporter freight transit metrics.'}
            </p>
          </div>

          {/* Quick Actions & Live Stream Controller */}
          <div className="flex items-center flex-wrap gap-2.5">
            <button
              onClick={() => setIsLivePulseActive(!isLivePulseActive)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 border transition-colors ${
                isLivePulseActive
                  ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                  : 'border-stone-300 dark:border-stone-700 bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
              }`}
            >
              <Activity className={`w-3.5 h-3.5 ${isLivePulseActive ? 'animate-spin' : ''}`} />
              {isLivePulseActive
                ? isAmharic ? 'የቀጥታ ስርጭት ክፍት ነው' : 'Live Ticks Active'
                : isAmharic ? 'ስርጭቱ ቆሟል' : 'Live Paused'}
            </button>

            <button
              onClick={() => {
                fetchTimeframeData(timeframe);
                if (onRefresh) onRefresh();
              }}
              className="px-3 py-1.5 rounded-lg text-xs font-medium border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800/60 hover:bg-stone-100 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoadingPoints ? 'animate-spin' : ''}`} />
              {isAmharic ? 'አድስ' : 'Refresh'}
            </button>
          </div>
        </div>

        {/* Global Trading Sessions Clock Bar */}
        <div className="mt-5 pt-4 border-t border-stone-200 dark:border-stone-800 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {markets.map((m) => {
            const isOpen = m.status === 'OPEN';
            return (
              <div
                key={m.id}
                onClick={() => setSelectedMarketId(m.id)}
                className={`p-2.5 rounded-xl border transition-all cursor-pointer ${
                  selectedMarketId === m.id
                    ? 'border-amber-500/70 bg-amber-50/70 dark:bg-amber-950/20 shadow-xs'
                    : 'border-stone-200/70 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-stone-800 dark:text-stone-200 truncate">
                    <span>{m.flag}</span>
                    <span className="truncate">{m.region}</span>
                  </div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isOpen ? 'bg-emerald-500 animate-ping' : 'bg-stone-400 dark:bg-stone-600'
                    }`}
                  />
                </div>
                <div className="flex items-baseline justify-between text-xs">
                  <span className="font-semibold text-stone-900 dark:text-stone-100">
                    {m.priceCentsLb.toFixed(1)}¢
                  </span>
                  <span
                    className={`text-[11px] font-medium ${
                      m.changePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {m.changePercent >= 0 ? '+' : ''}
                    {m.changePercent.toFixed(1)}%
                  </span>
                </div>
                <div className="text-[10px] text-stone-500 dark:text-stone-400 truncate mt-0.5">
                  {m.timezone} • {m.timeDiffEAT}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 2. SUMMARY METRIC TICKER CARDS (LONDON, NEW YORK, CHINA, JAPAN, MIDDLE EAST) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {markets.map((m) => {
          const isSelected = selectedMarketId === m.id;
          const colorConfig = marketColors[m.id];
          const displayPrice = convertPrice(m.priceCentsLb);

          return (
            <div
              key={m.id}
              onClick={() => setSelectedMarketId(m.id)}
              className={`p-4 rounded-2xl border transition-all cursor-pointer relative overflow-hidden flex flex-col justify-between ${
                isSelected
                  ? 'border-amber-500 dark:border-amber-500 bg-white dark:bg-stone-900 shadow-md ring-2 ring-amber-500/20'
                  : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 hover:border-stone-300 dark:hover:border-stone-700'
              }`}
            >
              {/* Header Badge */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xl">{m.flag}</span>
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1">
                        {m.shortName}
                      </div>
                      <div className="text-[10px] font-mono text-stone-500 dark:text-stone-400">
                        {m.symbol}
                      </div>
                    </div>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      m.status === 'OPEN'
                        ? 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400'
                        : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                    }`}
                  >
                    {m.status}
                  </span>
                </div>

                {/* Price Display */}
                <div className="my-2">
                  <div className="text-2xl font-black tracking-tight text-stone-900 dark:text-stone-100">
                    {displayPrice.toFixed(unit === 'etb_kg' ? 1 : 2)}
                    <span className="text-xs font-normal text-stone-500 ml-1">{getUnitSymbol()}</span>
                  </div>

                  <div className="flex items-center gap-1.5 mt-1">
                    <span
                      className={`text-xs font-bold flex items-center ${
                        m.changePercent >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                      }`}
                    >
                      {m.changePercent >= 0 ? (
                        <ArrowUpRight className="w-3.5 h-3.5 inline mr-0.5" />
                      ) : (
                        <ArrowDownRight className="w-3.5 h-3.5 inline mr-0.5" />
                      )}
                      {m.changePercent >= 0 ? '+' : ''}
                      {m.changePercent.toFixed(2)}% ({m.changeCentsLb >= 0 ? '+' : ''}
                      {m.changeCentsLb.toFixed(2)}¢)
                    </span>
                  </div>
                </div>
              </div>

              {/* Local Price & Top Grade in demand */}
              <div className="mt-3 pt-2.5 border-t border-stone-100 dark:border-stone-800 text-[11px] space-y-1">
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>{isAmharic ? 'አገር ውስጥ ዋጋ:' : 'Local Parity:'}</span>
                  <span className="font-semibold text-stone-800 dark:text-stone-200">
                    {m.localCurrencySymbol}
                    {m.localPricePerKg} {m.localPriceUnit}
                  </span>
                </div>
                <div className="flex justify-between text-stone-500 dark:text-stone-400">
                  <span>{isAmharic ? 'የባህር ጉዞ:' : 'Djibouti Lead:'}</span>
                  <span className="font-medium text-stone-700 dark:text-stone-300">
                    {m.ethiopianTradeFlow.transitDaysFromDjibouti} {isAmharic ? 'ቀናት' : 'days'}
                  </span>
                </div>
                <div className="text-[10px] text-amber-700 dark:text-amber-400/90 font-medium truncate pt-1">
                  ★ {m.ethiopianTradeFlow.topDemandGrades[0]}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* 3. MAIN LIVE CHART TERMINAL */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
        {/* Chart Top Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-5">
          {/* Chart View Modes */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60 self-start">
            <button
              onClick={() => setChartMode('COMPARISON')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartMode === 'COMPARISON'
                  ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <BarChart3 className="w-3.5 h-3.5" />
              {isAmharic ? 'የሁሉም ገበያዎች ንፅፅር' : 'Multi-Market Overlay'}
            </button>

            <button
              onClick={() => setChartMode('CANDLESTICK')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartMode === 'CANDLESTICK'
                  ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <CandlestickChart className="w-3.5 h-3.5" />
              {isAmharic ? 'የሻማ (OHLC) ቻርት' : 'Candlestick (OHLC)'}
            </button>

            <button
              onClick={() => setChartMode('ARBITRAGE_SPREAD')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                chartMode === 'ARBITRAGE_SPREAD'
                  ? 'bg-white dark:bg-stone-900 text-amber-600 dark:text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              {isAmharic ? 'አራቢካ-ሮቡስታ ልዩነት' : 'Arbitrage Spread'}
            </button>
          </div>

          {/* Timeframe Selectors */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700/60">
            {(['1D', '1W', '1M', '3M', '1Y', '5Y'] as Timeframe[]).map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                  timeframe === tf
                    ? 'bg-amber-500 text-white shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {tf === '1D' ? (isAmharic ? 'ቀጥታ (1D)' : '1D LIVE') : tf}
              </button>
            ))}
          </div>
        </div>

        {/* Series Legend Checkboxes (in comparison mode) */}
        {chartMode === 'COMPARISON' && (
          <div className="flex flex-wrap items-center gap-2 mb-4 p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800">
            <span className="text-xs font-semibold text-stone-500 dark:text-stone-400 mr-1">
              {isAmharic ? 'የገበያ መስመሮች:' : 'Active Feeds:'}
            </span>
            {markets.map((m) => {
              const isActive = activeSeries[m.id];
              const color = marketColors[m.id];
              return (
                <button
                  key={m.id}
                  onClick={() =>
                    setActiveSeries((prev) => ({
                      ...prev,
                      [m.id]: !prev[m.id],
                    }))
                  }
                  className={`px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer border ${
                    isActive
                      ? 'bg-white dark:bg-stone-900 border-stone-300 dark:border-stone-700 shadow-xs'
                      : 'bg-stone-100/70 dark:bg-stone-800/60 border-transparent opacity-50'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: color.stroke }}
                  />
                  <span>{m.shortName}</span>
                  <span className="font-mono text-[11px] text-stone-500">
                    {convertPrice(m.priceCentsLb).toFixed(1)}
                  </span>
                </button>
              );
            })}
          </div>
        )}

        {/* Interactive SVG Chart Canvas */}
        <div className="relative w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgWidth} ${svgHeight}`}
            className="w-full h-auto select-none overflow-visible"
            onMouseLeave={() => setHoveredIdx(null)}
          >
            <defs>
              <linearGradient id="nyAreaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
              </linearGradient>
              <linearGradient id="spreadGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Horizontal Gridlines & Y-Axis Labels */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, i) => {
              const yVal = minVal + ratio * (maxVal - minVal);
              const y = getY(yVal);
              return (
                <g key={i}>
                  <line
                    x1={padLeft}
                    y1={y}
                    x2={padLeft + chartWidth}
                    y2={y}
                    stroke="currentColor"
                    className="text-stone-200 dark:text-stone-800 stroke-[1]"
                    strokeDasharray={i === 0 || i === 4 ? '' : '3 3'}
                  />
                  <text
                    x={padLeft - 10}
                    y={y + 4}
                    textAnchor="end"
                    className="fill-stone-400 dark:fill-stone-500 text-[11px] font-mono"
                  >
                    {yVal.toFixed(unit === 'etb_kg' ? 0 : 1)}
                  </text>
                </g>
              );
            })}

            {/* Time / Date Axis Labels */}
            {processedPoints.map((p, idx) => {
              // Show label every few points
              const step = Math.max(1, Math.floor(processedPoints.length / 6));
              if (idx % step !== 0 && idx !== processedPoints.length - 1) return null;
              const x = getX(idx);
              return (
                <g key={idx}>
                  <line
                    x1={x}
                    y1={padTop + chartHeight}
                    x2={x}
                    y2={padTop + chartHeight + 6}
                    stroke="currentColor"
                    className="text-stone-300 dark:text-stone-700 stroke-[1]"
                  />
                  <text
                    x={x}
                    y={padTop + chartHeight + 20}
                    textAnchor="middle"
                    className="fill-stone-500 text-[10px] font-mono"
                  >
                    {p.date}
                  </text>
                </g>
              );
            })}

            {/* MODE A: COMPARISON OVERLAY LINES */}
            {chartMode === 'COMPARISON' && (
              <>
                {/* Area fill under New York Arabica */}
                {activeSeries.ICE_NY_ARABICA && (
                  <path d={makeAreaPath((d) => d.cNY)} fill="url(#nyAreaGrad)" />
                )}

                {/* Market Lines */}
                {activeSeries.ECX_ETHIOPIA && (
                  <path
                    d={makeLinePath((d) => d.cEcx)}
                    fill="none"
                    stroke={marketColors.ECX_ETHIOPIA.stroke}
                    strokeWidth="2.5"
                    strokeDasharray="4 4"
                  />
                )}
                {activeSeries.JAPAN_TOKYO && (
                  <path
                    d={makeLinePath((d) => d.cJpn)}
                    fill="none"
                    stroke={marketColors.JAPAN_TOKYO.stroke}
                    strokeWidth="2.2"
                  />
                )}
                {activeSeries.DUBAI_DMCC && (
                  <path
                    d={makeLinePath((d) => d.cDxb)}
                    fill="none"
                    stroke={marketColors.DUBAI_DMCC.stroke}
                    strokeWidth="2.2"
                  />
                )}
                {activeSeries.CHINA_YUNNAN && (
                  <path
                    d={makeLinePath((d) => d.cChn)}
                    fill="none"
                    stroke={marketColors.CHINA_YUNNAN.stroke}
                    strokeWidth="2.2"
                  />
                )}
                {activeSeries.ICE_LON_ROBUSTA && (
                  <path
                    d={makeLinePath((d) => d.cLon)}
                    fill="none"
                    stroke={marketColors.ICE_LON_ROBUSTA.stroke}
                    strokeWidth="2.4"
                  />
                )}
                {activeSeries.ICE_NY_ARABICA && (
                  <path
                    d={makeLinePath((d) => d.cNY)}
                    fill="none"
                    stroke={marketColors.ICE_NY_ARABICA.stroke}
                    strokeWidth="3"
                  />
                )}
              </>
            )}

            {/* MODE B: CANDLESTICK (OHLC) VIEW */}
            {chartMode === 'CANDLESTICK' && (
              <g>
                {processedPoints.map((p, idx) => {
                  const x = getX(idx);
                  const isGreen = p.cClose >= p.cOpen;
                  const candleColor = isGreen ? '#10b981' : '#f43f5e';
                  const yHigh = getY(p.cHigh);
                  const yLow = getY(p.cLow);
                  const yTop = getY(Math.max(p.cOpen, p.cClose));
                  const yBottom = getY(Math.min(p.cOpen, p.cClose));
                  const candleHeight = Math.max(2, yBottom - yTop);
                  const candleWidth = Math.max(3, chartWidth / processedPoints.length - 3);

                  return (
                    <g key={idx}>
                      {/* Upper & Lower Wicks */}
                      <line
                        x1={x}
                        y1={yHigh}
                        x2={x}
                        y2={yLow}
                        stroke={candleColor}
                        strokeWidth="1.5"
                      />
                      {/* Real Body */}
                      <rect
                        x={x - candleWidth / 2}
                        y={yTop}
                        width={candleWidth}
                        height={candleHeight}
                        fill={candleColor}
                        rx="1"
                      />
                    </g>
                  );
                })}
              </g>
            )}

            {/* MODE C: ARBITRAGE SPREAD VIEW (NY ARABICA - LONDON ROBUSTA) */}
            {chartMode === 'ARBITRAGE_SPREAD' && (
              <>
                <path d={makeAreaPath((d) => d.spread)} fill="url(#spreadGrad)" />
                <path
                  d={makeLinePath((d) => d.spread)}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2.5"
                />
              </>
            )}

            {/* Interactive Cursor Hover Overlay */}
            {hoveredIdx !== null && processedPoints[hoveredIdx] && (
              <g>
                <line
                  x1={getX(hoveredIdx)}
                  y1={padTop}
                  x2={getX(hoveredIdx)}
                  y2={padTop + chartHeight}
                  stroke="#78716c"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                {/* Active indicator points */}
                {chartMode === 'COMPARISON' && (
                  <>
                    {activeSeries.ICE_NY_ARABICA && (
                      <circle
                        cx={getX(hoveredIdx)}
                        cy={getY(processedPoints[hoveredIdx].cNY)}
                        r="5"
                        fill="#f59e0b"
                        stroke="#ffffff"
                        strokeWidth="2"
                      />
                    )}
                    {activeSeries.ICE_LON_ROBUSTA && (
                      <circle
                        cx={getX(hoveredIdx)}
                        cy={getY(processedPoints[hoveredIdx].cLon)}
                        r="4"
                        fill="#3b82f6"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    )}
                    {activeSeries.CHINA_YUNNAN && (
                      <circle
                        cx={getX(hoveredIdx)}
                        cy={getY(processedPoints[hoveredIdx].cChn)}
                        r="4"
                        fill="#ef4444"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    )}
                    {activeSeries.DUBAI_DMCC && (
                      <circle
                        cx={getX(hoveredIdx)}
                        cy={getY(processedPoints[hoveredIdx].cDxb)}
                        r="4"
                        fill="#10b981"
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    )}
                  </>
                )}
              </g>
            )}

            {/* Mouse Tracking Rect */}
            <rect
              x={padLeft}
              y={padTop}
              width={chartWidth}
              height={chartHeight}
              fill="transparent"
              className="cursor-crosshair"
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const mouseX = e.clientX - rect.left;
                const ratio = mouseX / rect.width;
                const idx = Math.round(ratio * (processedPoints.length - 1));
                if (idx >= 0 && idx < processedPoints.length) {
                  setHoveredIdx(idx);
                }
              }}
            />
          </svg>

          {/* Hover Tooltip Popup Box */}
          {hoveredIdx !== null && processedPoints[hoveredIdx] && (
            <div
              className="absolute pointer-events-none p-3 rounded-xl bg-stone-900/95 dark:bg-stone-950/95 text-white border border-stone-700 shadow-xl text-xs z-30 min-w-[200px]"
              style={{
                left: Math.min(
                  Math.max(20, (getX(hoveredIdx) / svgWidth) * 100),
                  75
                ) + '%',
                top: '20px',
              }}
            >
              <div className="font-bold text-stone-300 border-b border-stone-800 pb-1.5 mb-2 flex justify-between">
                <span>{processedPoints[hoveredIdx].date}</span>
                <span className="text-[10px] text-stone-400">
                  {timeframe === '1D' ? 'Live Tick' : 'Session Close'}
                </span>
              </div>

              {chartMode === 'COMPARISON' && (
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-amber-400 font-semibold">
                    <span className="flex items-center gap-1">🇺🇸 NY Arabica (KC):</span>
                    <span>
                      {processedPoints[hoveredIdx].cNY.toFixed(2)} {getUnitSymbol()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-blue-400">
                    <span className="flex items-center gap-1">🇬🇧 Lon Robusta (RC):</span>
                    <span>
                      {processedPoints[hoveredIdx].cLon.toFixed(2)} {getUnitSymbol()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-red-400">
                    <span className="flex items-center gap-1">🇨🇳 China Yunnan:</span>
                    <span>
                      {processedPoints[hoveredIdx].cChn.toFixed(2)} {getUnitSymbol()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-purple-400">
                    <span className="flex items-center gap-1">🇯🇵 Japan AJCA:</span>
                    <span>
                      {processedPoints[hoveredIdx].cJpn.toFixed(2)} {getUnitSymbol()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-emerald-400">
                    <span className="flex items-center gap-1">🇦🇪 Dubai DMCC:</span>
                    <span>
                      {processedPoints[hoveredIdx].cDxb.toFixed(2)} {getUnitSymbol()}
                    </span>
                  </div>
                </div>
              )}

              {chartMode === 'CANDLESTICK' && (
                <div className="space-y-1 text-stone-300 font-mono text-[11px]">
                  <div className="flex justify-between">
                    <span>Open:</span>
                    <span className="font-semibold text-white">{processedPoints[hoveredIdx].cOpen.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400">
                    <span>High:</span>
                    <span className="font-semibold">{processedPoints[hoveredIdx].cHigh.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-rose-400">
                    <span>Low:</span>
                    <span className="font-semibold">{processedPoints[hoveredIdx].cLow.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Close:</span>
                    <span className="font-semibold text-white">{processedPoints[hoveredIdx].cClose.toFixed(2)}</span>
                  </div>
                </div>
              )}

              {chartMode === 'ARBITRAGE_SPREAD' && (
                <div className="space-y-1">
                  <div className="text-stone-400 text-[11px]">Arabica - Robusta Differential:</div>
                  <div className="text-lg font-black text-blue-400">
                    +{processedPoints[hoveredIdx].spread.toFixed(2)} {getUnitSymbol()}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4. DESTINATION BENCHMARK & EXPORTER TRADE FLOW INTELLIGENCE */}
      <div className="rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-5 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 mb-5 pb-4 border-b border-stone-100 dark:border-stone-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">{selectedMarket.flag}</span>
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {selectedMarket.name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-700">
                {selectedMarket.contractStandard}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
              {isAmharic ? selectedMarket.regionAm : selectedMarket.benchmarkType} • {selectedMarket.exchangeOperator}
            </p>
          </div>

          {/* Quick Tab Selector between markets */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1">
            {markets.map((m) => (
              <button
                key={m.id}
                onClick={() => setSelectedMarketId(m.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  selectedMarketId === m.id
                    ? 'bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
                }`}
              >
                <span>{m.flag}</span>
                <span>{m.region}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tactical 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Col 1: Preferred Ethiopian Export Grades */}
          <div className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-500" />
              {isAmharic ? 'በዚህ ገበያ ተፈላጊ የሆኑ የኢትዮጵያ ቡናዎች' : 'Top Ethiopian Demand Grades'}
            </div>
            <div className="space-y-1.5">
              {selectedMarket.ethiopianTradeFlow.topDemandGrades.map((grade, idx) => (
                <div
                  key={idx}
                  className="px-2.5 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200/60 dark:border-stone-700/60 text-xs font-semibold text-stone-800 dark:text-stone-200 flex items-center gap-1.5"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                  {grade}
                </div>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-stone-500 dark:text-stone-400">
              {isAmharic ? 'የአገሪቱ ድርሻ ከኢትዮጵያ ጠቅላላ ኤክስፖርት:' : 'Share of Ethiopian Coffee Exports:'}
              <span className="font-bold text-stone-800 dark:text-stone-200 ml-1">
                {selectedMarket.ethiopianTradeFlow.annualExportSharePct}%
              </span>
            </div>
          </div>

          {/* Col 2: Maritime Shipping & Port of Djibouti Transit */}
          <div className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-1.5">
              <Ship className="w-4 h-4 text-blue-500" />
              {isAmharic ? 'የጅቡቲ ወደብ የባህር ጭነት እና የጉዞ ጊዜ' : 'Djibouti Freight & Ocean Transit'}
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">{isAmharic ? 'የባህር ጉዞ ጊዜ:' : 'Transit Time:'}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {selectedMarket.ethiopianTradeFlow.transitDaysFromDjibouti} {isAmharic ? 'ቀናት' : 'days'}
                </span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-stone-500">{isAmharic ? 'የኮንቴነር ጭነት ዋጋ:' : 'Container Cost:'}</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {selectedMarket.ethiopianTradeFlow.freightSurchargeUSD}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-2 pt-2 border-t border-stone-200 dark:border-stone-700">
                {selectedMarket.ethiopianTradeFlow.targetBuyersRoasters}
              </div>
            </div>
          </div>

          {/* Col 3: Key Institutional Buyers & Roasters */}
          <div className="p-4 rounded-xl border border-stone-200/80 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-800/30">
            <div className="text-xs font-bold text-stone-900 dark:text-stone-100 mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              {isAmharic ? 'ዋና ዋና ገዢዎች እና የቡና ሰንሰለቶች' : 'Key Buyers & Roaster Chains'}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {selectedMarket.keyBuyers.map((buyer, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md bg-stone-200/80 dark:bg-stone-700/80 text-[11px] font-medium text-stone-800 dark:text-stone-200"
                >
                  {buyer}
                </span>
              ))}
            </div>
            <div className="mt-3 text-[11px] text-stone-500">
              {isAmharic ? 'የግብይት ሰዓታት:' : 'Trading Hours:'}{' '}
              <span className="font-semibold text-stone-700 dark:text-stone-300">
                {selectedMarket.tradingHours}
              </span>
            </div>
          </div>

          {/* Col 4: Actionable Exporter Commercial Strategy */}
          <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-50/40 dark:bg-amber-950/20">
            <div className="text-xs font-bold text-amber-900 dark:text-amber-300 mb-2 flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              {isAmharic ? 'የላኪዎች የውል ስትራቴጂ እና ምክር' : 'Exporter Contract Playbook'}
            </div>
            <p className="text-xs text-amber-950 dark:text-amber-200/90 leading-relaxed">
              {isAmharic
                ? selectedMarket.ethiopianTradeFlow.exporterAdviceAm
                : selectedMarket.ethiopianTradeFlow.exporterAdvice}
            </p>
          </div>
        </div>
      </div>

      {/* 5. GLOBAL ARBITRAGE & SPREAD BAROMETER */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Card 1: Arabica vs Robusta Arbitrage Spread */}
        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
          <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
            {isAmharic ? 'የአራቢካ እና ሮቡስታ የዋጋ ልዩነት (Spread)' : 'Arabica / Robusta Arbitrage'}
          </div>
          <div className="text-2xl font-black text-blue-600 dark:text-blue-400">
            +{arabicaRobustaSpread} ¢/lb
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
            {isAmharic
              ? 'የለንደን ሮቡስታ ዋጋ ወደ ሪኮርድ ከፍተኛ ደረጃ በማደጉ፣ የአራቢካ-ሮቡስታ ልዩነት በጣም ጠቧል። ይህ ሁኔታ የአውሮፓ አቀናባሪዎች ርካሽ የሆነውን የኢትዮጵያ ጅማ እና ለቀምቲ ተፈጥሯዊ ቡና እንዲገዙ እያበረታታ ነው።'
              : 'Historic tight spread (~30.8¢/lb). European blenders are heavily blending Ethiopian commercial naturals (Jimma G5) to substitute for expensive Vietnamese & Brazilian Robusta.'}
          </p>
        </div>

        {/* Card 2: Japan Specialty Quality Premium */}
        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
          <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
            {isAmharic ? 'የጃፓን የጥራት ልዩነት ዋጋ (Japan Premium)' : 'Japan Specialty Premium'}
          </div>
          <div className="text-2xl font-black text-purple-600 dark:text-purple-400">
            +{japanPremium} ¢/lb Parity
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
            {isAmharic
              ? 'የጃፓን ገዢዎች ለይርጋጨፌ ደረጃ 1 እና ለሲዳማ ተፈጥሯዊ ቡና ከፍተኛ ዋጋ ይከፍላሉ (+110¢ እስከ +160¢ በላይ)። ጥብቅ የኬሚካል ፍተሻዎችን ማሟላት ቅድመ ሁኔታ ነው።'
              : 'Japan commands the highest differentials globally for Grade 1 Washed Yirgacheffe and floral Geisha micro-lots. Precision moisture and triple defect sorting yield maximum margins.'}
          </p>
        </div>

        {/* Card 3: Dubai & Gulf Express Logistics Hub */}
        <div className="p-4 rounded-2xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 shadow-xs">
          <div className="text-xs font-bold text-stone-500 dark:text-stone-400 uppercase tracking-wider mb-1">
            {isAmharic ? 'የዱባይ/ሳውዲ የቀይ ባህር ፈጣን የጭነት መስመር' : 'Middle East Red Sea Hub'}
          </div>
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
            3-5 Days Transit
          </div>
          <p className="text-xs text-stone-600 dark:text-stone-400 mt-2 leading-relaxed">
            {isAmharic
              ? 'ከጅቡቲ ወደብ በአጭር ጊዜ ውስጥ የሚደርስ ሲሆን፤ ለሐረር ሎንግቤሪ እና ለጉጂ ተፈጥሯዊ ቡናዎች በሳውዲ አረቢያና በኤምሬትስ ከፍተኛ ፍላጎት አለ። ፈጣን የክፍያ ዝውውር ይከናወናል።'
              : 'Shortest maritime distance from Port of Djibouti with zero Cape of Good Hope delay. Huge appetite for Harar Longberry and fruity Guji naturals across Saudi Arabia and UAE.'}
          </p>
        </div>
      </div>
    </div>
  );
};
