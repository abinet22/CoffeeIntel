import React from 'react';
import {
  Globe2,
  TrendingUp,
  Award,
  Clock,
  Compass,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { CompetitorOrigin } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface CompetitorOriginViewProps {
  competitors: CompetitorOrigin[];
}

export const CompetitorOriginView: React.FC<CompetitorOriginViewProps> = ({ competitors }) => {
  const { language, t } = useLanguage();

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
      <div className="border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Globe2 className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-stone-100 sm:text-lg">
            {t.compTitle}
          </h3>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">
          {t.compSubtitle}
        </p>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {competitors.map((comp, idx) => {
          const isEthiopia = comp.origin.includes('Ethiopia');
          const isPositiveDiff = comp.fobDifferentialCentsLb >= 0;

          return (
            <div
              key={idx}
              className={`rounded-xl border p-4 transition-all ${
                isEthiopia
                  ? 'border-amber-500/50 bg-gradient-to-br from-amber-950/40 via-stone-950 to-stone-950 ring-1 ring-amber-500/20 shadow-lg shadow-amber-950/20'
                  : 'border-stone-800 bg-stone-950/70 hover:border-stone-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-stone-100 text-sm">
                      {isEthiopia && language === 'am' ? 'ኢትዮጵያ (ይርጋጨፌ/ሲዳማ)' : comp.origin}
                    </span>
                    {isEthiopia && (
                      <span className="rounded bg-amber-500 px-1.5 py-0.2 text-[10px] font-black text-stone-950">
                        {language === 'am' ? 'የእኛ ሀገር' : 'OUR ORIGIN'}
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-stone-400 mt-0.5">{comp.variety}</div>
                </div>

                {/* FOB Differential Badge */}
                <div className="text-right">
                  <div
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded inline-block ${
                      isPositiveDiff
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-stone-800 text-stone-300'
                    }`}
                  >
                    {isPositiveDiff ? '+' : ''}
                    {comp.fobDifferentialCentsLb}¢/lb {language === 'am' ? 'ልዩነት' : 'Diff'}
                  </div>
                  <div className="text-xs font-bold font-mono text-stone-200 mt-1">
                    ${comp.priceUSDPerLb.toFixed(2)}/lb FOB
                  </div>
                </div>
              </div>

              {/* Crop & Pace Details */}
              <div className="mt-3 space-y-1.5 text-xs text-stone-300 border-t border-stone-800/80 pt-2.5">
                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    {language === 'am' ? 'የምርት እና መኸር ሁኔታ:' : 'Crop & Harvest Status:'}
                  </span>
                  <p className="text-[11px] text-stone-300 leading-snug mt-0.5">
                    {comp.cropStatus}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    {language === 'am' ? 'የወጪ ንግድ ፍጥነት እና የገዢዎች ፍላጎት:' : 'Export Pace & Roaster Demand:'}
                  </span>
                  <p className="text-[11px] text-stone-300 leading-snug mt-0.5">
                    {comp.exportPace}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-stone-400 block">
                    {language === 'am' ? 'የጥራት እና የሕግ ተገዢነት ማስታወሻ:' : 'Sensory & Compliance Notes:'}
                  </span>
                  <p className="text-[11px] text-stone-400 leading-snug mt-0.5">
                    {comp.qualityNotes}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
