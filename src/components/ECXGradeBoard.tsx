import React, { useState } from 'react';
import {
  Coffee,
  Sparkles,
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { EthiopianGradeQuote, PriceUnit } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface ECXGradeBoardProps {
  grades: EthiopianGradeQuote[];
  unit: PriceUnit;
  currencyMode: 'USD' | 'ETB';
  onAnalyzeGrade: (grade: EthiopianGradeQuote) => void;
  selectedGradeId?: string;
}

export const ECXGradeBoard: React.FC<ECXGradeBoardProps> = ({
  grades,
  unit,
  currencyMode,
  onAnalyzeGrade,
  selectedGradeId,
}) => {
  const { language, t, translateRegion, translateProcessing, translateStatus } = useLanguage();
  const [filterRegion, setFilterRegion] = useState<string>('ALL');
  const [filterProcessing, setFilterProcessing] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const USD_TO_ETB = 129.4;
  const KG_PER_LB = 0.45359237;

  const formatPrice = (usdPerLb: number) => {
    if (unit === 'cents_lb') {
      return `${(usdPerLb * 100).toFixed(1)}¢/lb`;
    }
    if (unit === 'usd_kg') {
      return `$${(usdPerLb / KG_PER_LB).toFixed(2)}/kg`;
    }
    // etb_kg
    return `${Math.round((usdPerLb / KG_PER_LB) * USD_TO_ETB).toLocaleString()} ETB/kg`;
  };

  const filteredGrades = grades.filter((g) => {
    const matchesRegion = filterRegion === 'ALL' || g.region === filterRegion;
    const matchesProcessing =
      filterProcessing === 'ALL' ||
      (filterProcessing === 'Washed' && g.processing.includes('Washed')) ||
      (filterProcessing === 'Natural' && g.processing.includes('Natural')) ||
      (filterProcessing === 'Specialty' && g.processing.includes('Specialty'));
    const matchesSearch =
      g.gradeCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.region.toLowerCase().includes(searchQuery.toLowerCase()) ||
      translateRegion(g.region).toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.cupProfile.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRegion && matchesProcessing && matchesSearch;
  });

  return (
    <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-4 sm:p-5 shadow-xl">
      {/* Header & Filters */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <Coffee className="h-5 w-5 text-amber-500" />
            <h3 className="text-base font-bold text-stone-100 sm:text-lg">
              {t.gradesTitle}
            </h3>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">
            {t.gradesSubtitle}
          </p>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-stone-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'am' ? 'ደረጃ ወይም ጣዕም ይፈልጉ...' : 'Search grade or profile...'}
              className="rounded-lg border border-stone-800 bg-stone-950 pl-8 pr-3 py-1.5 text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-hidden"
            />
          </div>

          {/* Region filter */}
          <select
            value={filterRegion}
            onChange={(e) => setFilterRegion(e.target.value)}
            className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-stone-300 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="ALL">{t.filterAllRegions}</option>
            <option value="Yirgacheffe">{translateRegion('Yirgacheffe')}</option>
            <option value="Sidama">{translateRegion('Sidama')}</option>
            <option value="Guji">{translateRegion('Guji')}</option>
            <option value="Limu">{translateRegion('Limu')}</option>
            <option value="Jimma">{translateRegion('Jimma')}</option>
            <option value="Harar">{translateRegion('Harar')}</option>
            <option value="Keffa/Nekemte">{translateRegion('Keffa/Nekemte')}</option>
          </select>

          {/* Processing filter */}
          <select
            value={filterProcessing}
            onChange={(e) => setFilterProcessing(e.target.value)}
            className="rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1.5 text-stone-300 focus:border-amber-500 focus:outline-hidden"
          >
            <option value="ALL">{language === 'am' ? 'ሁሉም አዘገጃጀት' : 'All Processing'}</option>
            <option value="Washed">{t.filterWashedOnly}</option>
            <option value="Natural">{t.filterNaturalOnly}</option>
            <option value="Specialty">{language === 'am' ? 'ልዩ ማይክሮ-ሎት' : 'Specialty Micro-lots'}</option>
          </select>
        </div>
      </div>

      {/* Table view */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-stone-800 text-stone-400 font-mono">
              <th className="py-2.5 px-3 font-semibold">{t.colGradeCode}</th>
              <th className="py-2.5 px-3 font-semibold">{t.colRegion}</th>
              <th className="py-2.5 px-3 font-semibold">{t.colEcxPrice}</th>
              <th className="py-2.5 px-3 font-semibold">{t.colFobDiff}</th>
              <th className="py-2.5 px-3 font-semibold">{t.colRealizedFob}</th>
              <th className="py-2.5 px-3 font-semibold">{t.cupProfileLabel}</th>
              <th className="py-2.5 px-3 font-semibold">{t.colDemandStatus}</th>
              <th className="py-2.5 px-3 font-semibold text-right">{language === 'am' ? 'የ AI ትንበያ' : 'AI Analysis'}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-800/60 font-sans">
            {filteredGrades.map((grade) => {
              const isSelected = selectedGradeId === grade.id;
              const isPositiveDiff = grade.fobDjiboutiDiffCentsLb >= 0;

              return (
                <tr
                  key={grade.id}
                  className={`group transition-colors hover:bg-stone-800/40 ${
                    isSelected ? 'bg-amber-950/30' : ''
                  }`}
                >
                  {/* Code */}
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-900/50">
                      {grade.gradeCode}
                    </span>
                  </td>

                  {/* Origin */}
                  <td className="py-3 px-3">
                    <div className="font-medium text-stone-200">{translateRegion(grade.region)}</div>
                    <div className="text-[11px] text-stone-400">{translateProcessing(grade.processing)}</div>
                  </td>

                  {/* ECX Price */}
                  <td className="py-3 px-3 font-mono">
                    <div className="font-semibold text-stone-100">
                      {grade.ecxPriceETBPerQuintal.toLocaleString()} ETB
                    </div>
                    <div className="text-[11px] text-stone-400">
                      ~${grade.ecxPriceUSDPerLb.toFixed(2)}/lb eq.
                    </div>
                  </td>

                  {/* Differential */}
                  <td className="py-3 px-3 font-mono">
                    <span
                      className={`inline-flex items-center font-bold px-2 py-0.5 rounded text-xs ${
                        isPositiveDiff
                          ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50'
                          : 'bg-rose-950/60 text-rose-300 border border-rose-800/50'
                      }`}
                    >
                      {isPositiveDiff ? '+' : ''}
                      {grade.fobDjiboutiDiffCentsLb}¢/lb
                    </span>
                  </td>

                  {/* Realized Export Price */}
                  <td className="py-3 px-3 font-mono">
                    <div className="font-bold text-amber-300 text-sm">
                      {formatPrice(grade.realizedFobUSDPerLb)}
                    </div>
                    <div className="text-[10px] text-stone-400">
                      {language === 'am' ? 'የጅቡቲ ወደብ ኤፍኦቢ' : 'FOB Port of Djibouti'}
                    </div>
                  </td>

                  {/* Sensory Profile */}
                  <td className="py-3 px-3 max-w-xs">
                    <p className="text-[11px] text-stone-300 line-clamp-2 leading-tight">
                      {grade.cupProfile}
                    </p>
                  </td>

                  {/* Market Status */}
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold ${
                        grade.status === 'High Demand'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : grade.status === 'Tight Supply'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                          : grade.status === 'Stable'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                      }`}
                    >
                      {translateStatus(grade.status)}
                    </span>
                  </td>

                  {/* AI Explain button */}
                  <td className="py-3 px-3 text-right">
                    <button
                      onClick={() => onAnalyzeGrade(grade)}
                      className="inline-flex items-center gap-1 rounded-lg border border-amber-600/40 bg-amber-950/40 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:bg-amber-600 hover:text-stone-950 transition-all"
                      title={language === 'am' ? 'ለዚህ ደረጃ የ AI ዋጋ ትንበያ አፍልቅ' : 'Generate AI price forecast and explainability for this grade'}
                    >
                      <Sparkles className="h-3 w-3" />
                      <span>{language === 'am' ? 'ትንበያ' : 'Forecast'}</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Basis Insight Footer Note */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between rounded-lg bg-stone-950/80 p-3 text-xs text-stone-400 border border-stone-800">
        <div className="flex items-center gap-2">
          <span className="font-mono text-amber-400 font-semibold">
            {language === 'am' ? 'የላኪዎች ምክር:' : 'EXPORTER TIP:'}
          </span>
          <span>
            {language === 'am'
              ? 'የተረጋገጠ የቡና ክምችት እጥረት በመኖሩ ምክንያት የፊዚካል ልዩነት ዋጋዎች ከዓለም አቀፍ ፊውቸርስ በበለጠ እያደጉ ይገኛሉ።'
              : 'Physical differentials are currently outperforming standard ICE futures due to certified stock shortages.'}
          </span>
        </div>
        <div className="text-[11px] text-stone-400 font-mono">
          {language === 'am'
            ? 'የምርት ገበያ እና የብሔራዊ ባንክ የምንዛሪ ደንብ'
            : 'ECX Reference: Floor Clearing Bulletins & NBE Repatriation Guidelines'}
        </div>
      </div>
    </div>
  );
};
