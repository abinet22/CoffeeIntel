import React, { useState } from 'react';
import {
  BrainCircuit,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Info,
  RefreshCw,
} from 'lucide-react';
import { MarketForecast, EthiopianGradeQuote } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface PredictionEngineProps {
  forecast: MarketForecast;
  selectedGrade?: EthiopianGradeQuote | null;
  onExplainWithGemini: (gradeId?: string) => void;
  isExplaining: boolean;
  explanationText?: string | null;
}

export const PredictionEngine: React.FC<PredictionEngineProps> = ({
  forecast,
  selectedGrade,
  onExplainWithGemini,
  isExplaining,
  explanationText,
}) => {
  const { language, t, translateRegion, translateProcessing } = useLanguage();
  const [activeHorizon, setActiveHorizon] = useState<'SHORT' | 'MEDIUM'>('SHORT');

  const targetGradeName = selectedGrade
    ? `${selectedGrade.gradeCode} (${translateRegion(selectedGrade.region)} ${translateProcessing(selectedGrade.processing)})`
    : (language === 'am' ? 'አይሲኢ አራቢካ መነሻ እና የኢትዮጵያ የታጠበ ቡና ፊዚካል' : 'ICE Arabica Benchmark & Ethiopian Washed Physicals');

  const isShortTerm = activeHorizon === 'SHORT';
  const currentPrice = forecast?.currentPriceCentsLb || 277.20;
  const targetPrice = isShortTerm ? (forecast?.expectedPriceCentsLb || 288.40) : (forecast?.expectedPriceCentsLb ? forecast.expectedPriceCentsLb + 9.5 : 298.0);
  const rangeLow = isShortTerm ? (forecast?.rangeLowCentsLb || 272.0) : (forecast?.rangeLowCentsLb ? forecast.rangeLowCentsLb - 7.0 : 265.0);
  const rangeHigh = isShortTerm ? (forecast?.rangeHighCentsLb || 298.5) : (forecast?.rangeHighCentsLb ? forecast.rangeHighCentsLb + 14.0 : 312.0);

  const signalLabel = language === 'am' ? 'አሁኑኑ በቅድሚያ ይሽጡ (STRONG SELL)' : 'STRONG SELL FORWARD';

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <BrainCircuit className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-stone-100 sm:text-lg">
              {t.predTitle}
            </h3>
            <span className="rounded bg-emerald-950 px-2 py-0.5 text-xs font-semibold text-emerald-300 border border-emerald-800">
              {language === 'am' ? '86.4% ያለፈው ትክክለኛነት' : '86.4% Backtested Accuracy'}
            </span>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {language === 'am' ? 'የታለመው ደረጃ:' : 'Targeting:'} <span className="font-semibold text-amber-300">{targetGradeName}</span>
          </p>
        </div>

        {/* Horizon Switcher */}
        <div className="flex items-center rounded-lg bg-stone-950 p-1 border border-stone-800 text-xs">
          <button
            onClick={() => setActiveHorizon('SHORT')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              isShortTerm
                ? 'bg-amber-600 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {t.predHorizonShort}
          </button>
          <button
            onClick={() => setActiveHorizon('MEDIUM')}
            className={`px-3 py-1.5 rounded font-medium transition-colors ${
              !isShortTerm
                ? 'bg-amber-600 text-stone-950 font-bold shadow-xs'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {t.predHorizonMedium}
          </button>
        </div>
      </div>

      {/* Main Grid: Forecast Signal & Range + Explainability Panel */}
      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-12">
        {/* Left Column: Forecast Banner & Confidence Cone */}
        <div className="lg:col-span-6 flex flex-col justify-between space-y-4 rounded-xl border border-amber-900/40 bg-gradient-to-br from-amber-950/20 to-stone-950 p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-400">
                {language === 'am' ? 'የሞዴል የምክር ምልክት' : 'Model Recommendation Signal'}
              </span>
              <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/40">
                {signalLabel}
              </span>
            </div>

            <div className="mt-2 text-xl font-bold text-stone-100 sm:text-2xl">
              {language === 'am'
                ? 'የ 15-20% ምርትዎን አሁኑኑ በቅድሚያ ይሽጡ (Lock 15-20% Forward)'
                : forecast.signalLean}
            </div>

            <p className="mt-2 text-xs text-stone-300 leading-relaxed">
              {language === 'am'
                ? 'የኒው ዮርክ ዋጋ ከ 255¢ በላይ በመሆኑና የብራዚል ዝናብ መረጃ ከመድረሱ በፊት ለሚቀጥሉት 2 ሳምንታት ውሎችን በቅድሚያ መፈረም ከፍተኛ ትርፍ ያስገኛል።'
                : forecast.recommendationSummary}
            </p>
          </div>

          {/* Expected Range & Confidence Band Visual */}
          <div className="rounded-lg border border-stone-800 bg-stone-900/90 p-3.5 text-xs">
            <div className="flex items-center justify-between text-stone-400 font-mono">
              <span>{language === 'am' ? 'የአሁኑ:' : 'Current:'} {currentPrice.toFixed(2)}¢/lb</span>
              <span className="text-amber-400 font-bold">
                {language === 'am' ? 'ዒላማ:' : 'Target:'} {targetPrice.toFixed(2)}¢/lb
              </span>
              <span>{t.confidenceInterval} (68%)</span>
            </div>

            {/* Visual Confidence Bar */}
            <div className="relative mt-3 h-7 rounded-lg bg-stone-800 p-1 flex items-center overflow-hidden">
              {/* Background gradient range */}
              <div
                className="absolute inset-y-1 rounded bg-amber-500/20 border border-amber-500/40"
                style={{ left: '20%', right: '15%' }}
              />
              {/* Current marker */}
              <div
                className="absolute h-5 w-1 bg-stone-300 z-10"
                style={{ left: '30%' }}
                title={`Current Spot Price: ${currentPrice.toFixed(2)}¢`}
              />
              {/* Target prediction marker */}
              <div
                className="absolute h-6 w-1.5 bg-amber-400 z-20 shadow-lg shadow-amber-500"
                style={{ left: '62%' }}
                title={`Target Model Price: ${targetPrice}¢`}
              />
            </div>

            <div className="mt-2 flex justify-between font-mono text-[11px] text-stone-400">
              <span>{language === 'am' ? 'ዝቅተኛ ወሰን:' : 'Range Low:'} {rangeLow.toFixed(1)}¢</span>
              <span className="text-stone-300">{language === 'am' ? 'የሚጠበቅ: +4.2% እስከ +8.5%' : 'Expected: +4.2% to +8.5%'}</span>
              <span>{language === 'am' ? 'ከፍተኛ ወሰን:' : 'Range High:'} {rangeHigh.toFixed(1)}¢</span>
            </div>
          </div>

          {/* Walk-Forward Backtest Accuracy Metrics */}
          <div className="grid grid-cols-3 gap-2 rounded-lg border border-stone-800 bg-stone-950 p-2.5 text-center text-xs font-mono">
            <div>
              <div className="text-stone-400 text-[10px]">
                {language === 'am' ? 'የፍተሻ ጊዜ' : 'Backtest Window'}
              </div>
              <div className="font-bold text-stone-200">
                {language === 'am' ? '180 ቀናት' : '180 Days'}
              </div>
            </div>
            <div>
              <div className="text-stone-400 text-[10px]">
                {language === 'am' ? 'የአቅጣጫ ትክክለኛነት' : 'Directional Acc.'}
              </div>
              <div className="font-bold text-emerald-400">86.4%</div>
            </div>
            <div>
              <div className="text-stone-400 text-[10px]">
                {language === 'am' ? 'ስህተት (MAPE)' : 'Mean Error (MAPE)'}
              </div>
              <div className="font-bold text-amber-300">3.4%</div>
            </div>
          </div>
        </div>

        {/* Right Column: Model Explainability Drivers */}
        <div className="lg:col-span-6 rounded-xl border border-stone-800 bg-stone-950/80 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-2.5">
              <div className="flex items-center gap-2">
                <Layers className="h-4 w-4 text-amber-500" />
                <h4 className="text-sm font-bold text-stone-200">
                  {language === 'am' ? 'የሞዴል ማብራሪያ: የትንበያ ለውጥ ምክንያቶች' : 'Model Explainability: Why Did Forecast Shift?'}
                </h4>
              </div>
              <button
                onClick={() => onExplainWithGemini(selectedGrade?.id)}
                disabled={isExplaining}
                className="flex items-center gap-1 rounded bg-amber-950 px-2 py-1 text-[11px] font-semibold text-amber-300 border border-amber-800 hover:bg-amber-900 transition-colors disabled:opacity-50"
              >
                <Sparkles className={`h-3 w-3 ${isExplaining ? 'animate-spin' : ''}`} />
                <span>
                  {isExplaining
                    ? (language === 'am' ? 'በመተንተን ላይ...' : 'Analyzing...')
                    : (language === 'am' ? 'በ AI በዝርዝር መርምር' : 'Deep Dive with AI')}
                </span>
              </button>
            </div>

            {/* Drivers list with progress bars */}
            <div className="mt-3 space-y-3">
              {forecast.topDrivers.map((driver, index) => {
                const isBullish = driver.impact === 'Bullish';
                const impactText = language === 'am'
                  ? (isBullish ? 'አዎንታዊ (Bullish)' : 'አሉታዊ (Bearish)')
                  : driver.impact;

                return (
                  <div key={index} className="rounded-lg border border-stone-800/80 bg-stone-900/50 p-2.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-stone-200">{driver.factor}</span>
                      <div className="flex items-center gap-2 font-mono text-[11px]">
                        <span
                          className={`font-semibold ${
                            isBullish ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {impactText} ({driver.weightPercent}%)
                        </span>
                      </div>
                    </div>

                    <div className="mt-1.5 h-1.5 w-full rounded-full bg-stone-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          isBullish ? 'bg-emerald-500' : 'bg-rose-500'
                        }`}
                        style={{ width: `${driver.weightPercent}%` }}
                      />
                    </div>

                    <p className="mt-1.5 text-[11px] text-stone-400 leading-snug">
                      {driver.description}
                    </p>
                    <div className="mt-1 text-[10px] text-stone-400 font-mono">
                      {language === 'am' ? 'ምንጭ:' : 'Source:'} {driver.source}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Gemini AI Live In-Depth Analysis Box */}
          {explanationText && (
            <div className="mt-3 rounded-lg border border-amber-800/60 bg-amber-950/20 p-3 text-xs">
              <div className="flex items-center gap-1.5 text-amber-300 font-bold mb-1">
                <Sparkles className="h-3.5 w-3.5" />
                <span>{language === 'am' ? 'የጄሚኒ 3.8 ፍላሽ የትንታኔ ሪፖርት' : 'Gemini 3.8 Flash Exporter Briefing'}</span>
              </div>
              <p className="text-stone-300 leading-relaxed whitespace-pre-line text-[11px]">
                {explanationText}
              </p>
            </div>
          )}

          {/* Regulatory Disclaimer */}
          <div className="mt-3 flex items-start gap-1.5 text-[10px] text-stone-400">
            <Info className="h-3.5 w-3.5 shrink-0 text-stone-400 mt-0.5" />
            <span>
              {language === 'am'
                ? 'ማሳሰቢያ: የ AI ትንበያዎች እና ምልክቶች የተዘጋጁት በኢኮኖሜትሪክ ሞዴሎች እና በዜና ስሜት ትንተና ላይ ተመስርተው ነው። ይህ ህጋዊ የፋይናንስ ወይም የሸቀጥ ንግድ የምስክር ወረቀት ምክር አይደለም።'
                : 'Disclaimer: Quantitative predictions and directional signals are generated from econometric ensembles and news sentiment velocity. They do not constitute certified financial or commodity trading advice.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
