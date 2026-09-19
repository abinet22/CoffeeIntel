import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  BarChart2,
  Calendar,
  Layers,
  Sparkles,
  Maximize2,
  Sliders,
  DollarSign,
  Info,
  ArrowUpRight,
  ArrowDownRight,
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
  const [activeSeries, setActiveSeries] = useState<{
    iceArabica: boolean;
    iceRobusta: boolean;
    ecxYirgacheffe: boolean;
    ecxSidamo: boolean;
  }>({
    iceArabica: true,
    iceRobusta: true,
    ecxYirgacheffe: true,
    ecxSidamo: false,
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
      const iceA = convertPrice(pt.iceArabicaCents);
      const iceR = convertPrice(pt.iceRobustaCents);
      const ecxY = convertPrice(pt.ecxYirgacheffeCents);
      const ecxS = convertPrice(pt.ecxSidamoCents);
      const pred = pt.predictedPrice ? convertPrice(pt.predictedPrice) : undefined;
      const upper = pt.confidenceUpper ? convertPrice(pt.confidenceUpper) : undefined;
      const lower = pt.confidenceLower ? convertPrice(pt.confidenceLower) : undefined;

      if (activeSeries.iceArabica) {
        min = Math.min(min, iceA);
        max = Math.max(max, iceA);
      }
      if (activeSeries.iceRobusta) {
        min = Math.min(min, iceR);
        max = Math.max(max, iceR);
      }
      if (activeSeries.ecxYirgacheffe) {
        min = Math.min(min, ecxY);
        max = Math.max(max, ecxY);
      }
      if (activeSeries.ecxSidamo) {
        min = Math.min(min, ecxS);
        max = Math.max(max, ecxS);
      }
      if (upper && showForecastBand) max = Math.max(max, upper);
      if (lower && showForecastBand) min = Math.min(min, lower);

      return {
        ...pt,
        convIceA: iceA,
        convIceR: iceR,
        convEcxY: ecxY,
        convEcxS: ecxS,
        convPred: pred,
        convUpper: upper,
        convLower: lower,
      };
    });

    if (min === Infinity) min = 150;
    if (max === -Infinity) max = 350;

    // Buffer 5%
    const padding = (max - min) * 0.08;
    return {
      minVal: Math.max(0, min - padding),
      maxVal: max + padding,
      chartData: converted,
    };
  }, [filteredPoints, activeSeries, showForecastBand, unit]);

  // SVG dimensions
  const width = 800;
  const height = 320;
  const paddingLeft = 60;
  const paddingRight = 30;
  const paddingTop = 20;
  const paddingBottom = 40;

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
  const generateLinePath = (getter: (d: any) => number | undefined) => {
    let path = '';
    chartData.forEach((d, idx) => {
      const val = getter(d);
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
    if (!showForecastBand) return '';
    const forecastIndices: number[] = [];
    chartData.forEach((d, i) => {
      if (d.convUpper !== undefined && d.convLower !== undefined) {
        forecastIndices.push(i);
      }
    });
    if (forecastIndices.length === 0) return '';

    // Upper line forward
    let upperStr = '';
    forecastIndices.forEach((i, count) => {
      const x = getX(i);
      const y = getY(chartData[i].convUpper!);
      upperStr += (count === 0 ? 'M' : 'L') + `${x.toFixed(1)},${y.toFixed(1)} `;
    });

    // Lower line backward
    let lowerStr = '';
    for (let j = forecastIndices.length - 1; j >= 0; j--) {
      const i = forecastIndices[j];
      const x = getX(i);
      const y = getY(chartData[i].convLower!);
      lowerStr += `L${x.toFixed(1)},${y.toFixed(1)} `;
    }

    return `${upperStr} ${lowerStr} Z`;
  }, [chartData, showForecastBand, minVal, maxVal]);

  const activeHoverPoint = hoveredIndex !== null ? chartData[hoveredIndex] : null;

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
      {/* Top Controls Bar */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-stone-800/80 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-amber-500" />
            <h2 className="text-base font-bold text-stone-100 sm:text-lg">
              {t.dashTitle}
            </h2>
            <span className="rounded bg-amber-950/70 px-2 py-0.5 text-xs font-semibold text-amber-300 border border-amber-800/50">
              {getUnitSymbol()}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {t.dashSubtitle}
          </p>
        </div>

        {/* Series and Timeframe Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Series Toggles */}
          <div className="flex items-center gap-1.5 rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
            <button
              onClick={() =>
                setActiveSeries((s) => ({ ...s, iceArabica: !s.iceArabica }))
              }
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeSeries.iceArabica
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 font-semibold'
                  : 'text-stone-500 hover:text-stone-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-amber-400" />
              {language === 'am' ? 'አይሲኢ አራቢካ' : 'ICE Arabica'}
            </button>
            <button
              onClick={() =>
                setActiveSeries((s) => ({ ...s, iceRobusta: !s.iceRobusta }))
              }
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeSeries.iceRobusta
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-semibold'
                  : 'text-stone-500 hover:text-stone-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-cyan-400" />
              {language === 'am' ? 'አይሲኢ ሮቡስታ' : 'ICE Robusta'}
            </button>
            <button
              onClick={() =>
                setActiveSeries((s) => ({ ...s, ecxYirgacheffe: !s.ecxYirgacheffe }))
              }
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeSeries.ecxYirgacheffe
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-semibold'
                  : 'text-stone-500 hover:text-stone-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              {language === 'am' ? 'ምርት ገበያ ይርጋጨፌ' : 'ECX Yirgacheffe'}
            </button>
            <button
              onClick={() =>
                setActiveSeries((s) => ({ ...s, ecxSidamo: !s.ecxSidamo }))
              }
              className={`flex items-center gap-1 px-2 py-1 rounded transition-colors ${
                activeSeries.ecxSidamo
                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40 font-semibold'
                  : 'text-stone-500 hover:text-stone-400'
              }`}
            >
              <span className="h-2 w-2 rounded-full bg-purple-400" />
              {language === 'am' ? 'ምርት ገበያ ሲዳማ' : 'ECX Sidama'}
            </button>
          </div>

          {/* Forecast Band Toggle */}
          <button
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

      {/* SVG Interactive Chart Canvas */}
      <div className="relative mt-4 w-full select-none">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto overflow-visible cursor-crosshair"
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const relX = e.clientX - rect.left;
            const svgX = (relX / rect.width) * width;
            const clampedX = Math.max(paddingLeft, Math.min(width - paddingRight, svgX));
            const ratio = (clampedX - paddingLeft) / chartWidth;
            const index = Math.round(ratio * (chartData.length - 1));
            setHoveredIndex(index);
          }}
        >
          {/* Background gridlines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const y = paddingTop + pct * chartHeight;
            const val = maxVal - pct * (maxVal - minVal);
            return (
              <g key={i}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke="rgba(120, 113, 108, 0.15)"
                  strokeDasharray="4 4"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  className="fill-stone-500 font-mono text-[10px]"
                >
                  {val.toFixed(1)}
                </text>
              </g>
            );
          })}

          {/* AI Confidence Band Polygon (shaded forecast cone) */}
          {showForecastBand && confidenceBandPath && (
            <path
              d={confidenceBandPath}
              fill="rgba(245, 158, 11, 0.12)"
              stroke="rgba(245, 158, 11, 0.3)"
              strokeDasharray="3 3"
            />
          )}

          {/* Series Lines */}
          {activeSeries.iceRobusta && (
            <path
              d={generateLinePath((d) => d.convIceR)}
              fill="none"
              stroke="#22d3ee"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {activeSeries.ecxSidamo && (
            <path
              d={generateLinePath((d) => d.convEcxS)}
              fill="none"
              stroke="#c084fc"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {activeSeries.ecxYirgacheffe && (
            <path
              d={generateLinePath((d) => d.convEcxY)}
              fill="none"
              stroke="#10b981"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {activeSeries.iceArabica && (
            <path
              d={generateLinePath((d) => d.convIceA)}
              fill="none"
              stroke="#f59e0b"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          )}

          {/* AI Predicted Line segment (dashed amber) */}
          {showForecastBand && (
            <path
              d={generateLinePath((d) => d.convPred)}
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
              {/* Highlight point on ICE Arabica */}
              {activeSeries.iceArabica && (
                <circle
                  cx={getX(hoveredIndex)}
                  y={getY(chartData[hoveredIndex].convIceA)}
                  r="4"
                  fill="#f59e0b"
                  stroke="#1c1917"
                  strokeWidth="2"
                />
              )}
              {/* Highlight point on ECX Yirgacheffe */}
              {activeSeries.ecxYirgacheffe && (
                <circle
                  cx={getX(hoveredIndex)}
                  y={getY(chartData[hoveredIndex].convEcxY)}
                  r="4"
                  fill="#10b981"
                  stroke="#1c1917"
                  strokeWidth="2"
                />
              )}
            </g>
          )}

          {/* X Axis Date labels */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => {
            const idx = Math.floor(pct * (chartData.length - 1));
            const pt = chartData[idx];
            if (!pt) return null;
            const x = getX(idx);
            return (
              <text
                key={i}
                x={x}
                y={height - 15}
                textAnchor="middle"
                className="fill-stone-400 font-mono text-[10px]"
              >
                {pt.date.slice(5)}
                {pt.predictedPrice ? ' (Fcast)' : ''}
              </text>
            );
          })}
        </svg>

        {/* Hover Inspector Card */}
        {activeHoverPoint && (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-stone-800 bg-stone-950/90 px-4 py-2.5 text-xs shadow-md">
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
              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-amber-400" />
                <span className="text-stone-400">ICE Arabica:</span>
                <span className="font-bold text-stone-100">
                  {activeHoverPoint.convIceA.toFixed(2)} {getUnitSymbol()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-cyan-400" />
                <span className="text-stone-400">ICE Robusta:</span>
                <span className="font-bold text-cyan-300">
                  {activeHoverPoint.convIceR.toFixed(2)} {getUnitSymbol()}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                <span className="text-stone-400">ECX Yirga G2:</span>
                <span className="font-bold text-emerald-300">
                  {activeHoverPoint.convEcxY.toFixed(2)} {getUnitSymbol()}
                </span>
              </div>

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

      {/* Exchange Summary Metrics Bento */}
      <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {exchanges.map((exc) => {
          const isPositive = exc.changePercent >= 0;
          return (
            <div
              key={exc.id}
              className="rounded-xl border border-stone-800/80 bg-stone-950/60 p-3.5 transition-all hover:border-stone-700"
            >
              <div className="flex items-center justify-between text-xs text-stone-400">
                <span className="font-medium">{exc.symbol}</span>
                <span className="text-[11px] font-mono text-stone-400">{exc.lastUpdated}</span>
              </div>
              <div className="mt-1 flex items-baseline justify-between">
                <div className="text-xl font-bold font-mono text-stone-100">
                  {convertPrice(exc.priceCentsLb).toFixed(2)}
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
                  {exc.changePercent.toFixed(2)}%
                </div>
              </div>

              {/* Day range bar */}
              <div className="mt-2.5">
                <div className="flex justify-between text-[10px] text-stone-400 font-mono">
                  <span>{language === 'am' ? 'ዝቅ:' : 'L:'} {convertPrice(exc.lowCentsLb).toFixed(1)}</span>
                  <span>{language === 'am' ? 'ከፍ:' : 'H:'} {convertPrice(exc.highCentsLb).toFixed(1)}</span>
                </div>
                <div className="mt-1 h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-amber-500"
                    style={{
                      width: `${Math.min(
                        100,
                        Math.max(
                          10,
                          ((exc.priceCentsLb - exc.lowCentsLb) /
                            (exc.highCentsLb - exc.lowCentsLb || 1)) *
                            100
                        )
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="mt-2 flex items-center justify-between text-[11px] text-stone-400 border-t border-stone-800/60 pt-2">
                <span>{language === 'am' ? 'መጠን:' : 'Vol:'} {exc.volume}</span>
                <span>{language === 'am' ? 'ክፍት ውል:' : 'OI:'} {exc.openInterest}</span>
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
              +68.0¢/lb
            </div>
            <span className="text-xs font-mono text-emerald-400 font-semibold">{language === 'am' ? '+12¢ ከ30 ቀን በፊት' : '+12¢ vs 30d ago'}</span>
          </div>
          <p className="mt-1.5 text-[11px] text-stone-400 leading-snug">
            {language === 'am' ? 'የተገኘ ኤፍኦቢ: ' : 'Realized FOB: '}
            <strong className="text-stone-200 font-mono">$3.15/lb</strong> ($6.94/kg). {language === 'am' ? 'የአገር ውስጥ ተመን: ' : 'Local conversion: '}
            <strong className="text-amber-300 font-mono">898 ETB/kg</strong>.
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
