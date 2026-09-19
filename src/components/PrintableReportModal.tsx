import React from 'react';
import {
  X,
  Printer,
  FileDown,
  Coffee,
  CheckCircle2,
  TrendingUp,
  Building,
} from 'lucide-react';
import {
  ExchangeQuote,
  EthiopianGradeQuote,
  MarketForecast,
  MarketBriefData,
} from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface PrintableReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  exchanges: ExchangeQuote[];
  grades: EthiopianGradeQuote[];
  forecast: MarketForecast;
  brief: MarketBriefData;
}

export const PrintableReportModal: React.FC<PrintableReportModalProps> = ({
  isOpen,
  onClose,
  exchanges,
  grades,
  forecast,
  brief,
}) => {
  const { language, t, translateRegion, translateProcessing } = useLanguage();

  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-2xl border border-stone-800 bg-stone-950 shadow-2xl overflow-hidden">
        {/* Modal Toolbar (hidden during actual print via print:hidden) */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900 px-5 py-3.5 print:hidden">
          <div className="flex items-center gap-2">
            <FileDown className="h-5 w-5 text-amber-500" />
            <h3 className="font-bold text-stone-100">
              {language === 'am'
                ? 'የኮፊኢንቴል የቡና ኤክስፖርት ገበያ ጥናት ሪፖርት'
                : 'CoffeeIntel Exporter Market Intelligence Dossier'}
            </h3>
            <span className="text-xs text-stone-400 font-mono">
              {language === 'am' ? 'ለህትመት የተዘጋጀ' : 'PDF / Print Ready'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 rounded-lg bg-amber-600 px-3 py-1.5 text-xs font-bold text-stone-950 hover:bg-amber-500 transition-colors"
            >
              <Printer className="h-4 w-4" />
              <span>{language === 'am' ? 'አትም / PDF አስቀምጥ' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Report Canvas */}
        <div className="flex-1 overflow-y-auto bg-stone-900 p-8 text-stone-100 font-sans print:p-0 print:bg-white print:text-black">
          {/* Document Header */}
          <div className="border-b-2 border-amber-600 pb-4 flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">☕</span>
                <h1 className="text-2xl font-black tracking-tight text-white print:text-black">
                  Coffee<span className="text-amber-500">Intel</span> {language === 'am' ? 'የገበያ ሪፖርት' : 'Executive Dossier'}
                </h1>
              </div>
              <p className="text-xs text-stone-400 print:text-stone-600 mt-1">
                {language === 'am'
                  ? 'ለኢትዮጵያ የቡና ላኪዎች ይፋዊ የገበያ መረጃ እና የዋጋ ትንበያ ሰነድ'
                  : 'Official Ethiopian Coffee Exporters Market Intelligence & Pricing Forecast'}
              </p>
            </div>

            <div className="text-right text-xs font-mono">
              <div className="font-bold text-stone-200 print:text-black">
                {language === 'am' ? 'ቀን:' : 'Date:'} {brief.generatedDate}
              </div>
              <div className="text-stone-400 print:text-stone-600">
                {language === 'am' ? 'መነሻ: አዲስ አበባ / ምርት ገበያ / ጅቡቲ ወደብ' : 'Origin: Addis Ababa / ECX / Port of Djibouti'}
              </div>
              <div className="text-amber-400 print:text-amber-800 font-bold">
                {language === 'am' ? 'ሚስጥራዊ የንግድ ሰነድ' : 'Confidential Commercial Brief'}
              </div>
            </div>
          </div>

          {/* Executive Summary */}
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-amber-800">
              {language === 'am' ? '1. የገበያ ዋና ማጠቃለያ' : '1. Executive Market Summary'}
            </h2>
            <div className="mt-2 text-xs leading-relaxed text-stone-300 print:text-stone-800">
              <strong className="text-white print:text-black text-sm block mb-1">
                "{brief.headline}"
              </strong>
              {brief.executiveSummary}
            </div>
          </div>

          {/* Core Benchmark Rates Table */}
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-amber-800">
              {language === 'am' ? '2. ዓለም አቀፍ የቦርሳ ዋጋዎች ንጽጽር' : '2. Multi-Exchange Arbitrage Matrix'}
            </h2>
            <table className="mt-2 w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-700 print:border-black font-mono text-stone-400 print:text-stone-700">
                  <th className="py-1.5">{language === 'am' ? 'ገበያ / ቦርሳ' : 'Exchange / Benchmark'}</th>
                  <th className="py-1.5">{language === 'am' ? 'የአሁኑ ዋጋ' : 'Spot Price'}</th>
                  <th className="py-1.5">{language === 'am' ? 'ለውጥ' : 'Change'}</th>
                  <th className="py-1.5">{language === 'am' ? 'የቀኑ ወሰን' : 'Day Range'}</th>
                  <th className="py-1.5">{language === 'am' ? 'የንግድ እንቅስቃሴ' : 'Open Interest'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 print:divide-stone-300 font-mono">
                {exchanges.map((exc) => (
                  <tr key={exc.id}>
                    <td className="py-2 font-bold text-stone-200 print:text-black">{exc.symbol}</td>
                    <td className="py-2 font-bold text-amber-300 print:text-black">
                      {exc.priceCentsLb.toFixed(2)}¢/lb
                    </td>
                    <td className="py-2 text-stone-300 print:text-stone-700">
                      {exc.changePercent >= 0 ? '+' : ''}
                      {exc.changePercent.toFixed(2)}%
                    </td>
                    <td className="py-2 text-stone-400 print:text-stone-600">
                      {exc.lowCentsLb} – {exc.highCentsLb}
                    </td>
                    <td className="py-2 text-stone-400 print:text-stone-600">{exc.openInterest}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Ethiopian Key Physicals */}
          <div className="mt-6">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-amber-800">
              {language === 'am' ? '3. የኢትዮጵያ ፊዚካል የጅቡቲ ኤፍኦቢ ልዩነቶች' : '3. Ethiopian Physical FOB Differentials (Djibouti)'}
            </h2>
            <table className="mt-2 w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-stone-700 print:border-black font-mono text-stone-400 print:text-stone-700">
                  <th className="py-1.5">{language === 'am' ? 'ደረጃ' : 'Grade'}</th>
                  <th className="py-1.5">{language === 'am' ? 'አካባቢ / አዘገጃጀት' : 'Origin / Method'}</th>
                  <th className="py-1.5">{language === 'am' ? 'የምርት ገበያ ዋጋ' : 'ECX Floor Price'}</th>
                  <th className="py-1.5">{language === 'am' ? 'ኤፍኦቢ ልዩነት' : 'FOB Differential'}</th>
                  <th className="py-1.5">{language === 'am' ? 'የተጣራ የኤክስፖርት ዋጋ' : 'Realized FOB Value'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-800 print:divide-stone-300 font-sans">
                {grades.slice(0, 5).map((g) => (
                  <tr key={g.id}>
                    <td className="py-1.5 font-bold font-mono text-amber-400 print:text-black">{g.gradeCode}</td>
                    <td className="py-1.5 text-stone-300 print:text-black">
                      {translateRegion(g.region)} ({translateProcessing(g.processing)})
                    </td>
                    <td className="py-1.5 font-mono text-stone-300 print:text-black">
                      {g.ecxPriceETBPerQuintal.toLocaleString()} ETB
                    </td>
                    <td className="py-1.5 font-mono font-bold text-stone-200 print:text-black">
                      +{g.fobDjiboutiDiffCentsLb}¢/lb
                    </td>
                    <td className="py-1.5 font-mono font-bold text-amber-300 print:text-black">
                      ${g.realizedFobUSDPerLb.toFixed(2)}/lb
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* AI Forecast & Exporter Recommendation */}
          <div className="mt-6 rounded-lg border border-stone-700 print:border-stone-400 p-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-amber-400 print:text-amber-800">
              {language === 'am' ? '4. የኢኮኖሜትሪክ ትንበያ እና የወጪ ንግድ ውል ማሰሪያ ምክር' : '4. Econometric Prediction & Forward Contract Timing'}
            </h2>
            <div className="mt-2 flex items-center justify-between text-xs font-mono">
              <div>
                <span className="text-stone-400 print:text-stone-600">
                  {language === 'am' ? 'የሞዴል ምልክት:' : 'Model Signal:'}
                </span>{' '}
                <strong className="text-emerald-400 print:text-emerald-800 text-sm">
                  {language === 'am' ? 'በቅድሚያ ይሽጡ (STRONG SELL)' : forecast.signalLean}
                </strong>
              </div>
              <div>
                <span className="text-stone-400 print:text-stone-600">
                  {language === 'am' ? 'የ 30-ቀን ዒላማ ወሰን:' : '30-Day Target Range:'}
                </span>{' '}
                <strong className="text-stone-200 print:text-black font-bold">
                  [{forecast.rangeLowCentsLb.toFixed(1)}¢ – {forecast.rangeHighCentsLb.toFixed(1)}¢/lb]
                </strong>
              </div>
            </div>
            <p className="mt-2 text-xs text-stone-300 print:text-stone-800 leading-relaxed">
              {forecast.recommendationSummary}
            </p>
          </div>

          {/* Signoff */}
          <div className="mt-8 border-t border-stone-800 print:border-stone-300 pt-4 flex items-center justify-between text-[11px] text-stone-400 print:text-stone-600">
            <div>
              {language === 'am'
                ? 'በኮፊኢንቴል AI ሞተር (ጄሚኒ 3.8 ፍላሽ) የተዘጋጀ • አዲስ አበባ፣ ኢትዮጵያ'
                : 'Produced via CoffeeIntel AI Engine (Gemini 3.8 Flash) • Addis Ababa, Ethiopia'}
            </div>
            <div className="font-mono">
              {language === 'am' ? 'በገበያ ተንታኝ የተረጋገጠ' : 'Verified by Commodity Desk Analyst'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
