import React, { useId, useState } from 'react';
import {
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  TrendingDown,
  Minus,
  Activity,
  Sparkles,
} from 'lucide-react';
import { ExchangeQuote, EthiopianGradeQuote, MacroIndicator, HistoricalPricePoint } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface TickerBarProps {
  exchanges: ExchangeQuote[];
  grades: EthiopianGradeQuote[];
  macroRates: MacroIndicator[];
  historicalData?: HistoricalPricePoint[];
  onSelectGrade?: (grade: EthiopianGradeQuote) => void;
}

/**
 * High-performance, lightweight SVG mini-sparkline component
 * Renders an area curve with glowing stroke and active pulse dot
 */
const MiniSparkline: React.FC<{
  points: number[];
  width?: number;
  height?: number;
  isPositive?: boolean;
  colorScheme?: 'auto' | 'emerald' | 'rose' | 'amber' | 'blue';
  className?: string;
}> = ({
  points,
  width = 46,
  height = 16,
  isPositive,
  colorScheme = 'auto',
  className = '',
}) => {
  const reactId = useId();
  const gradId = `spark-grad-${reactId.replace(/:/g, '')}`;

  if (!points || points.length < 2) return null;

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min === 0 ? 1 : max - min;
  const paddingY = 2;
  const usableHeight = height - paddingY * 2;

  // Calculate coordinates
  const coords = points.map((val, idx) => {
    const x = (idx / (points.length - 1)) * (width - 4) + 2;
    const y = height - paddingY - ((val - min) / range) * usableHeight;
    return { x, y };
  });

  const pathD = coords
    .map((pt, i) => `${i === 0 ? 'M' : 'L'} ${pt.x.toFixed(1)},${pt.y.toFixed(1)}`)
    .join(' ');

  const lastPoint = coords[coords.length - 1];
  const firstPoint = coords[0];
  const areaD = `${pathD} L ${lastPoint.x.toFixed(1)},${height} L ${firstPoint.x.toFixed(1)},${height} Z`;

  // Color assignments
  let strokeColor = '#34d399'; // emerald
  let stopColor = '#10b981';

  if (colorScheme === 'amber') {
    strokeColor = '#fbbf24';
    stopColor = '#f59e0b';
  } else if (colorScheme === 'blue') {
    strokeColor = '#60a5fa';
    stopColor = '#3b82f6';
  } else if (colorScheme === 'rose' || (colorScheme === 'auto' && isPositive === false)) {
    strokeColor = '#f87171';
    stopColor = '#ef4444';
  } else if (colorScheme === 'emerald' || (colorScheme === 'auto' && isPositive === true)) {
    strokeColor = '#34d399';
    stopColor = '#10b981';
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className={`overflow-visible shrink-0 transition-transform duration-200 group-hover:scale-105 ${className}`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={stopColor} stopOpacity="0.32" />
          <stop offset="100%" stopColor={stopColor} stopOpacity="0.0" />
        </linearGradient>
      </defs>
      {/* Area gradient under the path */}
      <path d={areaD} fill={`url(#${gradId})`} />
      {/* Sparkline curve */}
      <path
        d={pathD}
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Active pulse endpoint */}
      <circle
        cx={lastPoint.x}
        cy={lastPoint.y}
        r="1.75"
        fill={strokeColor}
      />
    </svg>
  );
};

export const TickerBar: React.FC<TickerBarProps> = ({
  exchanges,
  grades,
  macroRates,
  historicalData,
  onSelectGrade,
}) => {
  const { language, t } = useLanguage();
  const [showSparklines, setShowSparklines] = useState<boolean>(true);

  const topGrades = grades.slice(0, 4);

  /**
   * Resolve or synthesize reliable short-term momentum trajectory points for an exchange
   */
  const getExchangePoints = (exc: ExchangeQuote): number[] => {
    // 1. If real multi-day historical data is available in state, use it
    if (historicalData && historicalData.length >= 3) {
      const slice = historicalData.slice(-8);
      if (exc.id === 'ICE_ARABICA' || exc.symbol.includes('KC')) {
        const pts = slice.map((p) => p.iceArabicaCents).filter((v) => typeof v === 'number' && v > 0);
        if (pts.length >= 3) return pts;
      } else if (exc.id === 'ICE_ROBUSTA' || exc.symbol.includes('RC')) {
        const pts = slice.map((p) => p.iceRobustaCents).filter((v) => typeof v === 'number' && v > 0);
        if (pts.length >= 3) return pts;
      } else if (exc.id === 'ECX_ETHIOPIA' || exc.symbol.includes('ECX')) {
        const pts = slice.map((p) => p.ecxYirgacheffeCents).filter((v) => typeof v === 'number' && v > 0);
        if (pts.length >= 3) return pts;
      }
    }

    // 2. High-fidelity intraday trajectory synthesized from real open, low, high, and current price
    const current = exc.priceCentsLb;
    const change = exc.changeCentsLb !== 0 ? exc.changeCentsLb : (current * (exc.changePercent || 0.5)) / 100;
    const open = current - change;
    const high = exc.highCentsLb > 0 ? exc.highCentsLb : Math.max(current, open) * 1.006;
    const low = exc.lowCentsLb > 0 ? exc.lowCentsLb : Math.min(current, open) * 0.994;

    if (exc.changePercent >= 0) {
      // Bullish contour: Open -> slight morning dip -> support bounce -> surge past high -> consolidates at current
      return [
        open,
        open - Math.abs(open - low) * 0.6,
        low,
        open + (high - open) * 0.45,
        high * 0.997,
        high,
        current,
      ];
    } else {
      // Bearish contour: Open -> early morning spike -> resistance reject -> slide to low -> slight bounce to current
      return [
        open,
        open + Math.abs(high - open) * 0.5,
        high,
        open - (open - low) * 0.4,
        low,
        low + Math.abs(current - low) * 0.4,
        current,
      ];
    }
  };

  /**
   * Resolve momentum points for Ethiopian Physical Coffee grades (differential basis)
   */
  const getGradePoints = (grade: EthiopianGradeQuote): number[] => {
    const realized = grade.realizedFobUSDPerLb;
    const diff = grade.fobDjiboutiDiffCentsLb;
    const isBullish = (grade.changePercent ?? 0) >= 0;
    const delta = (grade.changePercent || 1.2) / 100;
    const base = realized / (1 + delta);

    if (isBullish) {
      return [
        base,
        base + (realized - base) * 0.25,
        base + (realized - base) * 0.15,
        base + (realized - base) * 0.6,
        base + (realized - base) * 0.85,
        realized,
      ];
    } else {
      return [
        base,
        base - (base - realized) * 0.2,
        base - (base - realized) * 0.45,
        base - (base - realized) * 0.75,
        realized,
      ];
    }
  };

  /**
   * Resolve momentum points for Macro/FX Indicators
   */
  const getMacroPoints = (macro: MacroIndicator): number[] => {
    const val = macro.value;
    const chg = macro.change || 0.1;
    const prev = val - chg;
    return [
      prev,
      prev + chg * 0.25,
      prev + chg * 0.4,
      prev + chg * 0.8,
      val,
    ];
  };

  return (
    <div className="border-b border-stone-800 bg-stone-900/90 px-3 sm:px-4 py-2 text-xs overflow-x-auto no-scrollbar shadow-xs">
      <div className="flex items-center gap-4 sm:gap-6 whitespace-nowrap min-w-max">
        {/* Pulse Live Indicator & Section Title */}
        <div className="flex items-center gap-2 pr-3 border-r border-stone-800/90 font-mono">
          <div className="relative flex items-center justify-center">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping absolute opacity-75" />
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold tracking-wider text-stone-200 text-[11px] uppercase">
              {language === 'am' ? 'የቀጥታ ገበያዎች' : 'MARKETS & MOMENTUM'}
            </span>
            <span className="text-[10px] text-stone-400 font-sans hidden sm:inline">
              {language === 'am' ? 'ኒው ዮርክ • ለንደን • ኢምገ' : 'ICE NY • ICE LON • ECX Floor'}
            </span>
          </div>
        </div>

        {/* 1. Major Futures Exchange Benchmarks */}
        <div className="flex items-center gap-3 sm:gap-4">
          {exchanges.map((exc) => {
            const isPositive = exc.changePercent >= 0;
            const isStrongMove = Math.abs(exc.changePercent) >= 1.2;
            const points = getExchangePoints(exc);

            const tooltip = [
              `${exc.name} (${exc.exchange})`,
              `Last: ${exc.priceCentsLb.toFixed(2)}¢/lb`,
              `Change: ${isPositive ? '+' : ''}${exc.changeCentsLb.toFixed(2)}¢ (${isPositive ? '+' : ''}${exc.changePercent.toFixed(2)}%)`,
              exc.highCentsLb ? `Range: ${exc.lowCentsLb.toFixed(2)}¢ - ${exc.highCentsLb.toFixed(2)}¢` : '',
              exc.volume ? `Vol: ${exc.volume}` : '',
              `Status: ${exc.lastUpdated || 'Active'}`,
            ].filter(Boolean).join('\n');

            return (
              <div
                key={exc.id}
                title={tooltip}
                className="group flex items-center gap-2 rounded-lg bg-stone-950/40 border border-stone-800/80 px-2.5 py-1 hover:border-stone-700 hover:bg-stone-950/80 transition-all cursor-default"
              >
                {/* Symbol & Location */}
                <div className="flex flex-col">
                  <span className="font-bold text-stone-200 text-xs tracking-tight">
                    {exc.symbol}
                  </span>
                  <span className="text-[9px] text-stone-400 font-mono leading-none">
                    {exc.exchange.split(' ')[0]}
                  </span>
                </div>

                {/* Live Price */}
                <span className="font-mono font-bold text-stone-100 text-xs sm:text-sm pl-0.5">
                  {exc.priceCentsLb.toFixed(2)}¢
                </span>

                {/* Mini-Sparkline Curve */}
                {showSparklines && (
                  <div className="px-0.5">
                    <MiniSparkline
                      points={points}
                      isPositive={isPositive}
                      width={44}
                      height={16}
                    />
                  </div>
                )}

                {/* Directional Indicator Badge */}
                <div
                  className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-md font-mono font-bold text-[10px] border transition-colors ${
                    isPositive
                      ? 'bg-emerald-950/60 text-emerald-300 border-emerald-800/50 group-hover:bg-emerald-900/60'
                      : 'bg-rose-950/60 text-rose-300 border-rose-800/50 group-hover:bg-rose-900/60'
                  }`}
                >
                  {isStrongMove ? (
                    isPositive ? (
                      <TrendingUp className="h-3 w-3 text-emerald-400" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-rose-400" />
                    )
                  ) : isPositive ? (
                    <ArrowUpRight className="h-3 w-3 text-emerald-400" />
                  ) : (
                    <ArrowDownRight className="h-3 w-3 text-rose-400" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {exc.changePercent.toFixed(2)}%
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Subtle Vertical Divider */}
        <div className="h-6 w-px bg-stone-800 shrink-0" />

        {/* 2. Ethiopian Key Physical FOB Differentials */}
        <div className="flex items-center gap-2 sm:gap-3">
          <span className="text-[10px] uppercase font-mono tracking-wider text-amber-500/80 font-bold hidden md:inline">
            {language === 'am' ? 'የኢትዮጵያ ቡና:' : 'ETHIOPIA FOB BASIS:'}
          </span>

          {topGrades.map((grade) => {
            const gradePoints = getGradePoints(grade);
            const isDiffPositive = grade.fobDjiboutiDiffCentsLb >= 0;
            const isBullish = (grade.changePercent ?? 0) >= 0;

            const gradeTooltip = [
              `${grade.gradeCode} (${grade.region} • ${grade.processing})`,
              `FOB Djibouti Realized: $${grade.realizedFobUSDPerLb.toFixed(2)}/lb`,
              `Differential over ICE Arabica: ${isDiffPositive ? '+' : ''}${grade.fobDjiboutiDiffCentsLb}¢/lb`,
              `ECX Warehouse Floor: ${grade.ecxPriceETBPerQuintal.toLocaleString()} ETB/Qtl ($${grade.ecxPriceUSDPerLb.toFixed(2)}/lb eq)`,
              `Cup: ${grade.cupProfile}`,
              `Click to drill into contract analysis & hedging`,
            ].join('\n');

            return (
              <button
                key={grade.id}
                onClick={() => onSelectGrade && onSelectGrade(grade)}
                title={gradeTooltip}
                className="group flex items-center gap-2 rounded-lg bg-stone-950/40 border border-amber-900/30 px-2.5 py-1 hover:border-amber-500/60 hover:bg-stone-950/90 transition-all cursor-pointer text-left"
              >
                {/* Grade Badge */}
                <span className="rounded bg-amber-950/80 px-1.5 py-0.5 font-mono text-[10px] font-bold text-amber-300 border border-amber-800/60">
                  {grade.gradeCode}
                </span>

                {/* Realized FOB */}
                <span className="font-mono font-semibold text-stone-100 text-xs">
                  ${grade.realizedFobUSDPerLb.toFixed(2)}
                  <span className="text-[10px] text-stone-400 font-sans font-normal">/lb</span>
                </span>

                {/* Grade Differential Sparkline */}
                {showSparklines && (
                  <div className="px-0.5">
                    <MiniSparkline
                      points={gradePoints}
                      colorScheme="amber"
                      width={38}
                      height={14}
                    />
                  </div>
                )}

                {/* FOB Basis Differential Badge */}
                <span className="inline-flex items-center gap-0.5 rounded px-1.5 py-0.5 font-mono text-[10px] font-bold bg-amber-950/50 text-amber-300 border border-amber-800/40">
                  {isDiffPositive ? '+' : ''}
                  {grade.fobDjiboutiDiffCentsLb}¢
                  <ArrowUpRight className="h-2.5 w-2.5 text-amber-400" />
                </span>
              </button>
            );
          })}
        </div>

        {/* Subtle Vertical Divider */}
        <div className="h-6 w-px bg-stone-800 shrink-0" />

        {/* 3. Macro, FX & Supply Indicators */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {macroRates.map((macro) => {
            const macroPoints = getMacroPoints(macro);
            const isMacroPositive = macro.change >= 0;

            return (
              <div
                key={macro.code}
                title={`${macro.name}\nValue: ${macro.value.toLocaleString()} ${macro.unit}\nChange: ${isMacroPositive ? '+' : ''}${macro.change}\n${macro.commentary}`}
                className="flex items-center gap-1.5 rounded-lg bg-stone-950/30 border border-stone-800/60 px-2 py-1 text-stone-400 font-mono text-[11px] hover:border-stone-700 transition-colors"
              >
                <span className="text-stone-300 font-sans font-medium text-[10px]">
                  {macro.code}:
                </span>
                <span className="text-amber-200 font-semibold font-mono text-xs">
                  {macro.value.toLocaleString()}
                </span>

                {showSparklines && (
                  <MiniSparkline
                    points={macroPoints}
                    colorScheme={macro.code === 'USD_ETB' ? 'blue' : isMacroPositive ? 'emerald' : 'rose'}
                    width={32}
                    height={12}
                  />
                )}

                <span
                  className={`flex items-center text-[10px] font-bold ${
                    isMacroPositive ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isMacroPositive ? (
                    <ArrowUpRight className="h-2.5 w-2.5" />
                  ) : (
                    <ArrowDownRight className="h-2.5 w-2.5" />
                  )}
                  {isMacroPositive ? '+' : ''}
                  {macro.change}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mini Toggle for Sparkline Visuals */}
        <div className="pl-2 border-l border-stone-800">
          <button
            type="button"
            onClick={() => setShowSparklines(!showSparklines)}
            className={`flex items-center gap-1 rounded-md px-2 py-1 text-[10px] font-medium transition-all ${
              showSparklines
                ? 'bg-amber-950/40 text-amber-300 border border-amber-800/40'
                : 'bg-stone-950 text-stone-400 border border-stone-800 hover:text-stone-200'
            }`}
            title={language === 'am' ? 'የስፓርክላይን መስመሮችን አሳይ / ደብቅ' : 'Toggle Mini Sparklines'}
          >
            <Sparkles className="h-3 w-3 text-amber-400" />
            <span className="hidden xl:inline">{t.tickerSparklines}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
