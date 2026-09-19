import React from 'react';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { ExchangeQuote, EthiopianGradeQuote, MacroIndicator } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface TickerBarProps {
  exchanges: ExchangeQuote[];
  grades: EthiopianGradeQuote[];
  macroRates: MacroIndicator[];
  onSelectGrade?: (grade: EthiopianGradeQuote) => void;
}

export const TickerBar: React.FC<TickerBarProps> = ({
  exchanges,
  grades,
  macroRates,
  onSelectGrade,
}) => {
  const { language, t } = useLanguage();
  const topGrades = grades.slice(0, 4);

  return (
    <div className="border-b border-stone-800 bg-stone-900/80 px-4 py-2 text-xs overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-6 whitespace-nowrap min-w-max">
        {/* Pulse Live indicator */}
        <div className="flex items-center gap-1.5 text-stone-400 font-mono pr-2 border-r border-stone-800">
          <Activity className="h-3.5 w-3.5 text-emerald-400 animate-pulse" />
          <span className="font-semibold text-stone-300">
            {language === 'am' ? 'የቀጥታ ገበያዎች:' : 'MARKETS:'}
          </span>
          <span className="text-[11px] text-stone-400">
            {language === 'am' ? 'አዲስ አበባ / ኒው ዮርክ / ለንደን' : 'ADDIS / NY / LDN'}
          </span>
        </div>

        {/* Major Exchanges */}
        {exchanges.map((exc) => {
          const isPositive = exc.changePercent >= 0;
          return (
            <div key={exc.id} className="flex items-center gap-1.5">
              <span className="font-semibold text-stone-300">{exc.symbol}:</span>
              <span className="font-mono font-bold text-stone-100">
                {exc.priceCentsLb.toFixed(2)}¢
              </span>
              <span
                className={`flex items-center font-mono font-medium text-[11px] ${
                  isPositive ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {isPositive ? (
                  <ArrowUpRight className="h-3 w-3" />
                ) : (
                  <ArrowDownRight className="h-3 w-3" />
                )}
                {isPositive ? '+' : ''}
                {exc.changePercent.toFixed(2)}%
              </span>
            </div>
          );
        })}

        {/* Divider */}
        <span className="text-stone-700">|</span>

        {/* Ethiopian Key Physicals (FOB Djibouti Differentials) */}
        {topGrades.map((grade) => (
          <button
            key={grade.id}
            onClick={() => onSelectGrade && onSelectGrade(grade)}
            className="flex items-center gap-1.5 hover:opacity-80 transition-opacity cursor-pointer text-left"
            title={language === 'am' ? `${grade.gradeCode}ን ለመተንተን ይጫኑ` : `Click to analyze ${grade.gradeCode}`}
          >
            <span className="rounded bg-amber-950/60 px-1 py-0.5 font-mono text-[10px] text-amber-300 border border-amber-900/50">
              {grade.gradeCode}
            </span>
            <span className="font-mono text-stone-200">${grade.realizedFobUSDPerLb.toFixed(2)}/lb</span>
            <span className="font-mono text-[11px] text-amber-400 font-semibold">
              ({language === 'am' ? 'ልዩነት:' : 'Diff:'} {grade.fobDjiboutiDiffCentsLb > 0 ? '+' : ''}
              {grade.fobDjiboutiDiffCentsLb}¢)
            </span>
          </button>
        ))}

        {/* Divider */}
        <span className="text-stone-700">|</span>

        {/* Macro & FX Tickers */}
        {macroRates.map((macro) => (
          <div key={macro.code} className="flex items-center gap-1 text-stone-400 font-mono text-[11px]">
            <span className="text-stone-300 font-sans font-medium">{macro.code}:</span>
            <span className="text-amber-200 font-semibold">{macro.value.toLocaleString()}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
