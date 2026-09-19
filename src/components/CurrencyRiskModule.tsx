import React, { useState } from 'react';
import {
  Coins,
  TrendingDown,
  TrendingUp,
  AlertCircle,
  HelpCircle,
  Sliders,
  DollarSign,
  Layers,
} from 'lucide-react';
import { MacroIndicator } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface CurrencyRiskModuleProps {
  macroRates: MacroIndicator[];
}

export const CurrencyRiskModule: React.FC<CurrencyRiskModuleProps> = ({ macroRates }) => {
  const { language, t } = useLanguage();
  const [officialRate, setOfficialRate] = useState<number>(129.4);
  const [parallelRate, setParallelRate] = useState<number>(152.8);
  const [rawCherryPriceETB, setRawCherryPriceETB] = useState<number>(210); // ETB per kg of red ripe cherry
  const [processingCostETB, setProcessingCostETB] = useState<number>(35); // ETB per kg washed parchment

  // Ratio of raw cherry to export green bean is approx 5.5 to 1 for washed, 6 to 1 for natural
  const CHERRY_TO_GREEN_RATIO = 5.5;
  const KG_PER_LB = 0.45359237;

  // Cost to produce 1 kg of export green bean:
  const rawCherryCostPerKgGreen = rawCherryPriceETB * CHERRY_TO_GREEN_RATIO;
  const totalCostPerKgGreenETB = rawCherryCostPerKgGreen + (processingCostETB * CHERRY_TO_GREEN_RATIO) + 45; // inland transport + ECX fee

  // FOB benchmark export revenue (e.g. Yirga G2 at $3.15/lb = $6.94/kg)
  const fobUSDPerKg = 3.15 / KG_PER_LB; // ~$6.94/kg

  // Realized revenue in ETB at Official rate
  const realizedRevenueOfficialETB = fobUSDPerKg * officialRate;
  const netMarginOfficialETB = realizedRevenueOfficialETB - totalCostPerKgGreenETB;
  const marginPctOfficial = (netMarginOfficialETB / realizedRevenueOfficialETB) * 100;

  // Realized revenue if blending with authorized imports via forex retention
  const effectiveBlendedRate = (officialRate * 0.5) + (parallelRate * 0.5);
  const realizedRevenueBlendedETB = fobUSDPerKg * effectiveBlendedRate;
  const netMarginBlendedETB = realizedRevenueBlendedETB - totalCostPerKgGreenETB;
  const marginPctBlended = (netMarginBlendedETB / realizedRevenueBlendedETB) * 100;

  const parallelSpread = ((parallelRate - officialRate) / officialRate) * 100;

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
      <div className="border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Coins className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-stone-100 sm:text-lg">
            {t.fxTitle}
          </h3>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">
          {t.fxSubtitle}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Sliders & Rate Controls */}
        <div className="lg:col-span-5 space-y-4 rounded-xl border border-stone-800 bg-stone-950/80 p-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {language === 'am' ? 'የውጭ ምንዛሪ እና የቀይ ቼሪ ግብዓት መረጃዎች' : 'FX & Primary Procurement Inputs'}
          </h4>

          {/* Official Rate Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-300">
                {language === 'am' ? 'የብሔራዊ ባንክ ይፋዊ ተመን (USD/ETB)' : 'NBE Official USD/ETB Rate'}
              </span>
              <span className="font-mono text-amber-400 font-bold">{officialRate.toFixed(1)} ETB</span>
            </div>
            <input
              type="range"
              min="110"
              max="160"
              step="0.5"
              value={officialRate}
              onChange={(e) => setOfficialRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Parallel / Market Rate Slider */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-300">
                {language === 'am' ? 'የገበያ / የኢምፖርት ማካካሻ ተመን' : 'Parallel / Import Clearing Rate'}
              </span>
              <span className="font-mono text-amber-400 font-bold">{parallelRate.toFixed(1)} ETB</span>
            </div>
            <input
              type="range"
              min="130"
              max="190"
              step="0.5"
              value={parallelRate}
              onChange={(e) => setParallelRate(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-stone-400 font-mono mt-1">
              {language === 'am' ? 'የገበያው ልዩነት:' : 'Parallel Premium Spread:'}{' '}
              <span className="text-amber-300 font-bold">+{parallelSpread.toFixed(1)}%</span>
            </div>
          </div>

          {/* Raw Cherry Price */}
          <div className="pt-2 border-t border-stone-800">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-stone-300">
                {language === 'am' ? 'የቀይ ቼሪ መግዣ ዋጋ (በማጠቢያ ጣቢያ)' : 'Primary Cherry Gate Price (Washing Station)'}
              </span>
              <span className="font-mono text-amber-400 font-bold">{rawCherryPriceETB} ETB/kg</span>
            </div>
            <input
              type="range"
              min="120"
              max="320"
              step="5"
              value={rawCherryPriceETB}
              onChange={(e) => setRawCherryPriceETB(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer"
            />
            <div className="text-[10px] text-stone-400 mt-1">
              {language === 'am'
                ? `ሬሾ: 5.5 ኪ.ግ ቀይ ቼሪ = 1 ኪ.ግ አረንጓዴ ኤክስፖርት ቡና (~${Math.round(rawCherryCostPerKgGreen)} ብር የመነሻ ወጪ)`
                : `Ratio: 5.5kg red cherry = 1kg green export bean (~${Math.round(rawCherryCostPerKgGreen)} ETB base bean cost)`}
            </div>
          </div>
        </div>

        {/* Realized Profit Margin & Sensitivity Card */}
        <div className="lg:col-span-7 rounded-xl border border-stone-800 bg-stone-950/90 p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="text-xs uppercase font-bold text-stone-400">
              {language === 'am'
                ? 'የ 1 ኪ.ግ ኤክስፖርት አረንጓዴ ቡና ገቢ እና ትርፍ ንጽጽር'
                : 'Procurement & Export Unit Economics (Per 1 kg Export Green Bean)'}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {/* Scenario 1: Pure Official Conversion */}
              <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-3.5">
                <div className="text-[11px] text-stone-400 font-medium">
                  {language === 'am' ? 'ሁኔታ 1: በይፋዊ ተመን ብቻ ሲመነዘር' : 'SCENARIO 1: OFFICIAL REPATRIATION'}
                </div>
                <div className="mt-1 text-xs text-stone-300">
                  {language === 'am' ? 'ጠቅላላ ወጪ:' : 'Total Cost:'}{' '}
                  <span className="font-mono font-bold text-stone-100">{Math.round(totalCostPerKgGreenETB)} ETB/kg</span>
                </div>
                <div className="text-xs text-stone-300 mt-0.5">
                  {language === 'am' ? 'ኤፍኦቢ ገቢ:' : 'FOB Revenue:'}{' '}
                  <span className="font-mono font-bold text-stone-100">{Math.round(realizedRevenueOfficialETB)} ETB/kg</span>
                </div>
                <div className="mt-2 text-xl font-bold font-mono">
                  <span className={netMarginOfficialETB >= 0 ? 'text-emerald-400' : 'text-rose-400'}>
                    {netMarginOfficialETB >= 0 ? '+' : ''}{Math.round(netMarginOfficialETB)} ETB/kg
                  </span>
                </div>
                <div className="text-[11px] font-mono text-stone-400">
                  {language === 'am' ? 'የትርፍ መጠን:' : 'Margin:'} {marginPctOfficial.toFixed(1)}%
                </div>
              </div>

              {/* Scenario 2: Blended with Forex Retention */}
              <div className="rounded-lg border border-amber-800/50 bg-amber-950/20 p-3.5">
                <div className="text-[11px] text-amber-400 font-medium">
                  {language === 'am' ? 'ሁኔታ 2: 50% የምንዛሪ ይዞታ ሲካተት' : 'SCENARIO 2: 50% RETENTION VALUE'}
                </div>
                <div className="mt-1 text-xs text-stone-300">
                  {language === 'am' ? 'አማካይ ተመን:' : 'Effective Rate:'}{' '}
                  <span className="font-mono font-bold text-amber-300">{effectiveBlendedRate.toFixed(1)} ETB/$</span>
                </div>
                <div className="text-xs text-stone-300 mt-0.5">
                  {language === 'am' ? 'የተጣመረ ገቢ:' : 'Blended Revenue:'}{' '}
                  <span className="font-mono font-bold text-amber-300">{Math.round(realizedRevenueBlendedETB)} ETB/kg</span>
                </div>
                <div className="mt-2 text-xl font-bold font-mono text-emerald-400">
                  +{Math.round(netMarginBlendedETB)} ETB/kg
                </div>
                <div className="text-[11px] font-mono text-stone-400">
                  {language === 'am' ? 'የትርፍ መጠን:' : 'Margin:'} {marginPctBlended.toFixed(1)}% ({language === 'am' ? 'በኢምፖርት ማካካሻ' : 'via import arbitrage'})
                </div>
              </div>
            </div>

            {/* Strategic Commentary */}
            <div className="mt-4 rounded-lg bg-stone-900/80 p-3 text-xs border border-stone-800">
              <div className="font-semibold text-stone-200 mb-1">
                {language === 'am' ? 'ስልታዊ የግዥ መመሪያ:' : 'Strategic Sourcing Guidance:'}
              </div>
              <p className="text-stone-300 leading-relaxed text-[11px]">
                {language === 'am'
                  ? (rawCherryPriceETB > 240
                      ? 'የቀይ ቼሪ ዋጋ ከ 240 ብር በላይ ሲሆን በይፋዊው የምንዛሪ ተመን ትርፍን በእጅጉ ያጠበዋል። ላኪዎች የልዩ ደረጃ (Specialty Washed) ተጨማሪ ዋጋ ማረጋገጥ ወይም የ 50% የውጭ ምንዛሪ ይዞታቸውን ተጠቅመው ግዥውን ማካካስ አለባቸው።'
                      : 'በአሁኑ የቀይ ቼሪ መግዣ ዋጋ ደረጃ የቡና ዝግጅት ትርፍ ጤናማ ነው (>12%)። ከዓለም አቀፍ ገዢዎች ጋር የቅድሚያ ውሎችን ማሰር አስተማማኝ ትርፍ ያስገኛል።')
                  : (rawCherryPriceETB > 240
                      ? 'Cherry prices above 240 ETB/kg severely compress margins at current official FX rates. Exporters must either ensure high-tier Specialty Washed premiums (+85¢ differential) or utilize their 50% retention accounts to subsidize procurement.'
                      : 'At current cherry procurement levels, processing margins are healthy (>12%). Locking in forward sales with international buyers guarantees profitable repatriation.')}
              </p>
            </div>
          </div>

          <div className="mt-4 text-[10px] text-stone-400 font-mono">
            {language === 'am'
              ? '*ለመነሻ የተወሰደው የይርጋጨፌ ደረጃ 2 የታጠበ ቡና በ $3.15/lb ኤፍኦቢ ነው። ከሲዳማ/ይርጋጨፌ እስከ ጅቡቲ የትራንስፖርትና የአያያዝ ወጪ 45 ብር/ኪ.ግ ተገምቷል።'
              : '*Assumes benchmark Yirgacheffe Grade 2 Washed at $3.15/lb FOB. Transport and handling from Sidama/Yirgacheffe to Djibouti estimated at 45 ETB/kg.'}
          </div>
        </div>
      </div>
    </div>
  );
};
