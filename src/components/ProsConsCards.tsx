import React from 'react';
import {
  Scale,
  TrendingUp,
  TrendingDown,
  Info,
  CheckCircle2,
  AlertOctagon,
  ArrowRight,
} from 'lucide-react';
import { ExchangeProsCons } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ProsConsCardsProps {
  prosCons: Record<string, ExchangeProsCons>;
}

export const ProsConsCards: React.FC<ProsConsCardsProps> = ({ prosCons }) => {
  const { language, t } = useLanguage();
  const exchanges = Object.entries(prosCons);

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
      <div className="border-b border-stone-800 pb-4">
        <div className="flex items-center gap-2">
          <Scale className="h-5 w-5 text-amber-500" />
          <h3 className="text-base font-bold text-stone-100 sm:text-lg">
            {t.prosConsTitle}
          </h3>
        </div>
        <p className="text-xs text-stone-400 mt-0.5">
          {t.prosConsSubtitle}
        </p>
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 lg:grid-cols-3">
        {exchanges.map(([key, data]) => {
          const exchangeName =
            key === 'ICE_ARABICA'
              ? (language === 'am' ? 'አይሲኢ ኒው ዮርክ (አራቢካ "C")' : data.exchangeName)
              : key === 'ICE_ROBUSTA'
              ? (language === 'am' ? 'አይሲኢ ለንደን (ሮቡስታ)' : data.exchangeName)
              : (language === 'am' ? 'የኢትዮጵያ ምርት ገበያ (ECX)' : data.exchangeName);

          const sentimentText =
            data.currentSentiment === 'Bullish'
              ? (language === 'am' ? 'አዎንታዊ (Bullish)' : 'Bullish')
              : data.currentSentiment === 'Bearish'
              ? (language === 'am' ? 'አሉታዊ (Bearish)' : 'Bearish')
              : (language === 'am' ? 'ገለልተኛ (Neutral)' : 'Neutral');

          return (
            <div
              key={key}
              className="flex flex-col justify-between rounded-xl border border-stone-800 bg-stone-950/80 p-4 transition-all hover:border-stone-700"
            >
              <div>
                {/* Header */}
                <div className="flex items-center justify-between border-b border-stone-800/80 pb-2.5">
                  <h4 className="font-bold text-sm text-stone-100">{exchangeName}</h4>
                  <span
                    className={`text-[11px] font-bold font-mono px-2 py-0.5 rounded ${
                      data.currentSentiment === 'Bullish'
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : data.currentSentiment === 'Bearish'
                        ? 'bg-rose-950 text-rose-300 border border-rose-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}
                  >
                    {sentimentText}
                  </span>
                </div>

                {/* Pros List */}
                <div className="mt-3">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 uppercase tracking-wider mb-1.5">
                    <TrendingUp className="h-3.5 w-3.5" />
                    <span>{t.bullishFactorsHeader}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {data.pros.map((pro, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-emerald-500 mt-0.5" />
                        <span className="leading-snug">{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Cons List */}
                <div className="mt-4">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-rose-400 uppercase tracking-wider mb-1.5">
                    <TrendingDown className="h-3.5 w-3.5" />
                    <span>{t.bearishFactorsHeader}</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {data.cons.map((con, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <AlertOctagon className="h-3.5 w-3.5 shrink-0 text-rose-500 mt-0.5" />
                        <span className="leading-snug">{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Basis Spread Commentary */}
                <div className="mt-4 rounded-lg bg-stone-900/90 p-2.5 text-xs border border-stone-800">
                  <div className="flex items-center gap-1 font-semibold text-amber-400 text-[11px] mb-1">
                    <Info className="h-3 w-3" />
                    <span>{t.basisAssessment}</span>
                  </div>
                  <p className="text-stone-300 leading-snug text-[11px]">
                    {data.basisCommentary}
                  </p>
                </div>
              </div>

              {/* Action Lean */}
              <div className="mt-4 border-t border-stone-800/80 pt-3">
                <div className="text-[10px] uppercase font-bold text-stone-400">
                  {t.recommendedAction}
                </div>
                <div className="mt-1 flex items-start gap-1 text-xs font-semibold text-amber-300">
                  <ArrowRight className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                  <span>{data.actionLean}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
