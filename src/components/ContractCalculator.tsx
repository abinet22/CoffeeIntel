import React, { useState } from 'react';
import {
  Calculator,
  Calendar,
  DollarSign,
  TrendingUp,
  Package,
  Ship,
  ShieldAlert,
  ArrowRight,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { EthiopianGradeQuote } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ContractCalculatorProps {
  grades: EthiopianGradeQuote[];
}

export const ContractCalculator: React.FC<ContractCalculatorProps> = ({ grades }) => {
  const { language, t, translateRegion, translateProcessing } = useLanguage();
  const [selectedGradeId, setSelectedGradeId] = useState<string>(grades[1]?.id || grades[0]?.id);
  const [volumeBags, setVolumeBags] = useState<number>(640); // 2 containers = ~640 bags
  const [weeksToWait, setWeeksToWait] = useState<number>(3);
  const [usdEtbRate, setUsdEtbRate] = useState<number>(129.4);
  const [freightPerContainer, setFreightPerContainer] = useState<number>(3200); // 20ft container from Djibouti

  const currentGrade = grades.find((g) => g.id === selectedGradeId) || grades[0];

  // Calculations
  const BAG_WEIGHT_KG = 60;
  const LBS_PER_KG = 2.20462;
  const BAGS_PER_20FT = 320;

  const totalKg = volumeBags * BAG_WEIGHT_KG;
  const totalLbs = totalKg * LBS_PER_KG;
  const containerCount = Math.ceil(volumeBags / BAGS_PER_20FT);

  // Price today
  const priceTodayUSDPerLb = currentGrade.realizedFobUSDPerLb; // e.g. $3.15/lb
  const grossUSDToday = totalLbs * priceTodayUSDPerLb;
  const totalFreightUSD = containerCount * freightPerContainer;
  const netUSDToday = grossUSDToday - totalFreightUSD;
  const grossETBToday = netUSDToday * usdEtbRate;

  // Forecast model for waiting N weeks
  const expectedPriceChangePct = weeksToWait * 1.1; // +3.3% in 3 weeks
  const uncertaintySpreadPct = weeksToWait * 1.8;

  const priceExpectedUSDPerLb = priceTodayUSDPerLb * (1 + expectedPriceChangePct / 100);
  const priceLowUSDPerLb = priceTodayUSDPerLb * (1 + (expectedPriceChangePct - uncertaintySpreadPct) / 100);
  const priceHighUSDPerLb = priceTodayUSDPerLb * (1 + (expectedPriceChangePct + uncertaintySpreadPct) / 100);

  const grossUSDExpected = totalLbs * priceExpectedUSDPerLb;
  const netUSDExpected = grossUSDExpected - totalFreightUSD;
  const netGainUSD = netUSDExpected - netUSDToday;
  const netGainETB = netGainUSD * usdEtbRate;

  // NBE 50% FX retention
  const retention50USD = netUSDExpected * 0.5;
  const local50ETB = retention50USD * usdEtbRate;

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
      {/* Header */}
      <div className="border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Calculator className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-stone-100 sm:text-lg">
            {t.calcTitle}
          </h3>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">
          {t.calcSubtitle}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Input Parameters Controls */}
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-stone-800 bg-stone-950/80 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {language === 'am' ? 'የወጪ ንግድ ውል ዝርዝር መረጃዎች' : 'Export Deal Specifications'}
          </h4>

          {/* Grade selection */}
          <div>
            <label className="block text-xs font-medium text-stone-300 mb-1">
              {t.calcGradeSelect}
            </label>
            <select
              value={selectedGradeId}
              onChange={(e) => setSelectedGradeId(e.target.value)}
              className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-xs text-stone-200 focus:border-amber-500 focus:outline-hidden"
            >
              {grades.map((g) => (
                <option key={g.id} value={g.id}>
                  {g.gradeCode} — {translateRegion(g.region)} {translateProcessing(g.processing)} ({language === 'am' ? 'ልዩነት:' : 'Diff:'} {g.fobDjiboutiDiffCentsLb > 0 ? '+' : ''}
                  {g.fobDjiboutiDiffCentsLb}¢, FOB ${g.realizedFobUSDPerLb.toFixed(2)}/lb)
                </option>
              ))}
            </select>
          </div>

          {/* Volume input */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-stone-300">
                {language === 'am' ? 'የውል መጠን (የ60 ኪ.ግ ከረጢት)' : 'Contract Volume (60kg Bags)'}
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {volumeBags.toLocaleString()} {language === 'am' ? 'ከረጢቶች' : 'Bags'} (~{(totalKg / 1000).toFixed(1)} MT)
              </span>
            </div>
            <input
              type="range"
              min="160"
              max="3200"
              step="160"
              value={volumeBags}
              onChange={(e) => setVolumeBags(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
              <span>160 {language === 'am' ? 'ከረጢት (0.5 ኮንቴነር)' : 'Bags (0.5 Ctr)'}</span>
              <span>640 {language === 'am' ? 'ከረጢት (2 ኮንቴነር)' : 'Bags (2 Ctrs)'}</span>
              <span>1,600 {language === 'am' ? 'ከረጢት (5 ኮንቴነር)' : 'Bags (5 Ctrs)'}</span>
              <span>3,200 {language === 'am' ? 'ከረጢት (10 ኮንቴነር)' : 'Bags (10 Ctrs)'}</span>
            </div>
          </div>

          {/* Weeks to Wait Slider */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="font-medium text-stone-300">
                {language === 'am' ? 'የመቆያ ጊዜ (ሳምንታት)' : 'Model Waiting Horizon'}
              </span>
              <span className="font-mono text-amber-400 font-bold">
                {language === 'am' ? `ለ ${weeksToWait} ሳምንታት መጠበቅ` : `Wait ${weeksToWait} ${weeksToWait === 1 ? 'Week' : 'Weeks'}`}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="8"
              step="1"
              value={weeksToWait}
              onChange={(e) => setWeeksToWait(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-stone-400 font-mono mt-1">
              <span>1 {language === 'am' ? 'ሳምንት' : 'Week'}</span>
              <span>3 {language === 'am' ? 'ሳምንት (የሚመከር)' : 'Weeks (Recommended)'}</span>
              <span>8 {language === 'am' ? 'ሳምንት' : 'Weeks'}</span>
            </div>
          </div>

          {/* Freight & FX inputs */}
          <div className="grid grid-cols-2 gap-3 pt-1">
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">
                {language === 'am' ? 'የጭነት ዋጋ / 20ft ($)' : 'Freight / 20ft Ctr ($)'}
              </label>
              <input
                type="number"
                value={freightPerContainer}
                onChange={(e) => setFreightPerContainer(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs text-stone-200 font-mono focus:border-amber-500 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-[11px] text-stone-400 mb-1">
                {language === 'am' ? 'ይፋዊ ዶላር/ብር ምንዛሪ' : 'USD / ETB Official'}
              </label>
              <input
                type="number"
                step="0.5"
                value={usdEtbRate}
                onChange={(e) => setUsdEtbRate(Number(e.target.value))}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs text-stone-200 font-mono focus:border-amber-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Container summary pill */}
          <div className="flex items-center gap-2 rounded-lg bg-stone-900 p-2.5 text-xs text-stone-300 border border-stone-800">
            <Package className="h-4 w-4 text-amber-500 shrink-0" />
            <span>
              {language === 'am' ? 'የሎጂስቲክስ ፍላጎት: ' : 'Logistics requirement: '}
              <strong className="text-stone-100 font-mono">
                {containerCount} × 20ft {language === 'am' ? 'ኮንቴነሮች' : 'containers'}
              </strong> (~
              {totalLbs.toLocaleString(undefined, { maximumFractionDigits: 0 })} lbs).
            </span>
          </div>
        </div>

        {/* Results & Comparison Output */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4 rounded-xl border border-amber-900/30 bg-stone-950/90 p-4 sm:p-5">
          <div>
            <div className="flex items-center justify-between border-b border-stone-800 pb-3">
              <div>
                <span className="text-xs uppercase font-bold text-stone-400">
                  {t.exportRecommendation}
                </span>
                <div className="text-lg font-bold text-stone-100 flex items-center gap-2 mt-0.5">
                  <span>
                    {language === 'am'
                      ? `40% አሁኑኑ ይሽጡ፣ 60% ደግሞ እስከ ሳምንት ${weeksToWait} ይጠብቁ`
                      : `Sign 40% Now, Hold 60% for Week ${weeksToWait}`}
                  </span>
                  <span className="rounded bg-emerald-950 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-800">
                    +${Math.round(netGainUSD).toLocaleString()} USD
                  </span>
                </div>
              </div>
            </div>

            {/* Comparison Cards: Today vs In N Weeks */}
            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Option A: Sign Today */}
              <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-3.5">
                <div className="text-[11px] text-stone-400 font-medium">
                  {language === 'am' ? 'አማራጭ ሀ: ዛሬ መፈረም' : 'OPTION A: SIGN TODAY'}
                </div>
                <div className="mt-1 text-xs text-stone-300">
                  {language === 'am' ? 'ዋጋ: ' : 'Price: '}
                  <strong className="font-mono text-stone-100">${priceTodayUSDPerLb.toFixed(2)}/lb</strong>
                </div>
                <div className="mt-2 text-xl font-bold font-mono text-stone-100">
                  ${Math.round(netUSDToday).toLocaleString()}
                </div>
                <div className="text-xs text-stone-400 font-mono">
                  {language === 'am' ? 'የተጣራ ብር: ' : 'Net ETB: '}
                  {Math.round(grossETBToday / 1000).toLocaleString()}k ETB
                </div>
                <div className="mt-2 text-[10px] text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 shrink-0" />
                  <span>{language === 'am' ? 'የዋጋ መውረድ ስጋት የለውም' : 'Zero market downside risk'}</span>
                </div>
              </div>

              {/* Option B: Wait N Weeks */}
              <div className="rounded-lg border border-amber-800/60 bg-amber-950/20 p-3.5">
                <div className="text-[11px] text-amber-400 font-medium">
                  {language === 'am' ? `አማራጭ ለ: ${weeksToWait} ሳምንታት መጠበቅ` : `OPTION B: WAIT ${weeksToWait} ${weeksToWait === 1 ? 'WEEK' : 'WEEKS'}`}
                </div>
                <div className="mt-1 text-xs text-stone-300">
                  {language === 'am' ? 'የሚጠበቅ ዋጋ: ' : 'Expected: '}
                  <strong className="font-mono text-amber-300">
                    ${priceExpectedUSDPerLb.toFixed(2)}/lb
                  </strong>
                </div>
                <div className="mt-2 text-xl font-bold font-mono text-amber-300">
                  ${Math.round(netUSDExpected).toLocaleString()}
                </div>
                <div className="text-xs text-stone-400 font-mono">
                  {language === 'am' ? 'የተገመተ ትርፍ ጭማሪ: ' : 'Projected Gain: '}
                  <span className="text-emerald-400 font-bold">
                    +${Math.round(netGainUSD).toLocaleString()} (+{Math.round(netGainETB / 1000).toLocaleString()}k ETB)
                  </span>
                </div>
                <div className="mt-2 text-[10px] text-stone-400 font-mono">
                  {language === 'am' ? 'የእርግጠኝነት ወሰን:' : 'Confidence range:'} [${priceLowUSDPerLb.toFixed(2)} – ${priceHighUSDPerLb.toFixed(2)}]
                </div>
              </div>
            </div>

            {/* NBE FX Retention Quota Breakdown */}
            <div className="mt-4 rounded-lg bg-stone-900/80 p-3 text-xs border border-stone-800">
              <div className="flex items-center gap-1.5 font-bold text-stone-200 mb-1.5">
                <DollarSign className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.calcNbeRetention}</span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-[11px] font-mono">
                <div className="rounded bg-stone-950 p-2">
                  <div className="text-stone-400">
                    {language === 'am' ? '50% በውጭ ምንዛሪ የሚቆይ:' : '50% Foreign Forex Retention:'}
                  </div>
                  <div className="font-bold text-emerald-400 text-sm">
                    ${Math.round(retention50USD).toLocaleString()} USD
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {language === 'am' ? 'የተፈቀዱ ዕቃዎችን ለማስመጣት የሚውል' : 'Can import authorized goods'}
                  </div>
                </div>
                <div className="rounded bg-stone-950 p-2">
                  <div className="text-stone-400">
                    {language === 'am' ? '50% ወደ ብር የሚቀየር:' : '50% Converted to Local Birr:'}
                  </div>
                  <div className="font-bold text-amber-300 text-sm">
                    {Math.round(local50ETB / 1000).toLocaleString()}k ETB
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {language === 'am' ? 'በንግድ ባንክ ሂሳብ ገቢ የሚደረግ' : 'Credited to commercial bank'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-[10px] text-stone-400 border-t border-stone-800 pt-3">
            <Info className="h-3.5 w-3.5 text-stone-400 shrink-0" />
            <span>
              {language === 'am'
                ? 'ስሌቱ የባህር ኮንቴነር ጭነትና መደበኛ ወደብ ወጪዎችን ያካትታል። በጅቡቲ ወደብ የቆይታ እና የመዘግየት ወጪዎች እንደየሁኔታው ሊጨመሩ ይችላሉ።'
                : 'Calculations include sea container freight deductions and standard ocean export allowances. Actual demurrage or Djibouti port dwell charges may apply.'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
