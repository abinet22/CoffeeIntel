import React, { useState } from 'react';
import {
  X,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Share2,
  Printer,
  Copy,
  Check,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownRight,
  Download,
} from 'lucide-react';
import { ProConSummaryReport, Language } from '../types';

interface ProConReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: ProConSummaryReport | null;
  isLoading: boolean;
  onRegenerate: () => void;
  language: Language;
}

export const ProConReportModal: React.FC<ProConReportModalProps> = ({
  isOpen,
  onClose,
  report,
  isLoading,
  onRegenerate,
  language,
}) => {
  const [copied, setCopied] = useState(false);
  const isAm = language === 'am';

  if (!isOpen) return null;

  const handleCopy = () => {
    if (!report) return;
    const text = `
COFFEEINTEL STRATEGIC PRO VS CON REPORT
${report.headline}
Generated: ${report.generatedAt}
Posture: ${report.marketPosture} (Bullish: ${report.bullishScore}% / Bearish: ${report.bearishScore}%)

EXECUTIVE SUMMARY:
${report.executiveSummary}

KEY MARKET OPPORTUNITIES (PROS):
${report.pros.map((p, i) => `${i + 1}. [${p.category}] ${p.title} (${p.impactMetric})\n   ${p.detail} (Source: ${p.source})`).join('\n')}

KEY RISKS & HEADWINDS (CONS):
${report.cons.map((c, i) => `${i + 1}. [${c.category}] ${c.title} (${c.impactMetric})\n   Mitigation: ${c.mitigation} (Source: ${c.source})`).join('\n')}

TACTICAL ROADMAP:
${report.tacticalRoadmap.map((t) => `• ${t.timeframe}: ${t.action} -> Impact: ${t.impact}`).join('\n')}
    `.trim();

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950/80">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-stone-100 flex items-center gap-2">
                {isAm ? 'የስትራቴጂክ ዕድሎች እና ስጋቶች (Pros & Cons) ሪፖርት' : 'AI Strategic Pro vs. Con Market Report'}
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                  {report?.marketPosture || 'Multi-Pillar Engine'}
                </span>
              </h2>
              <p className="text-xs text-stone-400">
                {isAm ? 'በአለም አቀፍ የገበያ መረጃዎች እና በ 10 ቱ የመረጃ ዘርፎች የተጠናቀረ' : 'Synthesized across 10 intelligence pillars and real-time live data streams'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
              title="Copy formatted text"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (isAm ? 'ተቀድቷል' : 'Copied') : (isAm ? 'ቅዳ' : 'Copy')}</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors hidden sm:flex"
              title="Print report"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>{isAm ? 'አትም' : 'Print'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-200">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center justify-center space-y-4">
              <div className="w-12 h-12 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
              <p className="text-sm text-stone-300 font-medium">
                {isAm ? 'የ 10 ቱን የመረጃ ዘርፎች እና የቀጥታ ገበያ መረጃዎችን በማገናኘት ላይ...' : 'Synthesizing 10 intelligence pillars and live market feeds...'}
              </p>
              <p className="text-xs text-stone-500">
                {isAm ? 'ዕድሎች (Pros) እና ስጋቶች (Cons) በኢትዮጵያ ኤክስፖርት አግባብ እየተሰሉ ነው' : 'Mapping opportunities against Red Sea logistics, ICE futures, and FOB differentials'}
              </p>
            </div>
          ) : report ? (
            <>
              {/* Score / Posture Banner */}
              <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase tracking-wider text-stone-400 font-medium">
                    {isAm ? 'አጠቃላይ የገበያ ሚዛን አቋም' : 'Overall Market Balance & Posture'}
                  </span>
                  <h3 className="text-xl font-bold text-stone-100 mt-1">{report.headline}</h3>
                  <div className="flex items-center gap-4 mt-2 text-xs text-stone-400">
                    <span>{report.generatedAt}</span>
                    <span>•</span>
                    <span className="text-amber-400 font-medium">{report.marketPosture}</span>
                  </div>
                </div>

                {/* Bullish vs Bearish Gauge */}
                <div className="w-full sm:w-64 bg-stone-900 p-3 rounded-lg border border-stone-800">
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-emerald-400 flex items-center gap-1">
                      <ArrowUpRight className="w-3.5 h-3.5" /> {isAm ? 'ዕድሎች (Pros)' : 'Bullish / Pros'} {report.bullishScore}%
                    </span>
                    <span className="text-rose-400 flex items-center gap-1">
                      <ArrowDownRight className="w-3.5 h-3.5" /> {isAm ? 'ስጋቶች (Cons)' : 'Risks / Cons'} {report.bearishScore}%
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-stone-800 rounded-full overflow-hidden flex">
                    <div
                      className="bg-emerald-500 h-full transition-all duration-500"
                      style={{ width: `${report.bullishScore}%` }}
                    />
                    <div
                      className="bg-rose-500 h-full transition-all duration-500"
                      style={{ width: `${report.bearishScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Executive Summary */}
              <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  {isAm ? 'አስፈፃሚ ማጠቃለያ' : 'Executive Synthesis'}
                </h4>
                <p className="text-sm text-stone-300 leading-relaxed">{report.executiveSummary}</p>
              </div>

              {/* PROS vs CONS Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* PROS (Opportunities) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-emerald-500/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-emerald-500/20 text-emerald-400">
                        <TrendingUp className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-emerald-400">
                        {isAm ? 'ቁልፍ የገበያ ዕድሎች (PROS)' : 'Key Market Opportunities (PROS)'}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-emerald-400/80 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                      {report.pros.length} {isAm ? 'ነጥቦች' : 'Factors'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {report.pros.map((pro, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/20 space-y-2 hover:border-emerald-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-emerald-300">{pro.title}</span>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 whitespace-nowrap">
                            {pro.impactMetric}
                          </span>
                        </div>
                        <p className="text-xs text-stone-300 leading-relaxed">{pro.detail}</p>
                        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-emerald-500/10">
                          <span className="text-stone-400">
                            {isAm ? 'ዘርፍ' : 'Pillar'}: <strong className="text-stone-300">{pro.category}</strong>
                          </span>
                          <span className="text-stone-400 italic">
                            {isAm ? 'ምንጭ' : 'Source'}: {pro.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* CONS (Risks & Headwinds) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-rose-500/20">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded bg-rose-500/20 text-rose-400">
                        <AlertTriangle className="w-4 h-4" />
                      </div>
                      <h4 className="text-sm font-bold text-rose-400">
                        {isAm ? 'ቁልፍ ስጋቶች እና እንቅፋቶች (CONS)' : 'Key Risks & Headwinds (CONS)'}
                      </h4>
                    </div>
                    <span className="text-xs font-mono text-rose-400/80 bg-rose-500/10 px-2 py-0.5 rounded-full">
                      {report.cons.length} {isAm ? 'ስጋቶች' : 'Risks'}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {report.cons.map((con, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/20 space-y-2 hover:border-rose-500/40 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-xs font-bold text-rose-300">{con.title}</span>
                          <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 whitespace-nowrap">
                            {con.impactMetric}
                          </span>
                        </div>
                        <div className="p-2 rounded bg-stone-900/60 border border-stone-800 text-xs">
                          <span className="text-amber-400 font-semibold text-[11px] block mb-0.5">
                            {isAm ? 'የመከላከያ መፍትሄ (Mitigation):' : 'Exporter Mitigation Action:'}
                          </span>
                          <p className="text-stone-300 leading-relaxed">{con.mitigation}</p>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-rose-500/10">
                          <span className="text-stone-400">
                            {isAm ? 'ዘርፍ' : 'Pillar'}: <strong className="text-stone-300">{con.category}</strong>
                          </span>
                          <span className="text-stone-400 italic">
                            {isAm ? 'ምንጭ' : 'Source'}: {con.source}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Tactical Exporter Roadmap */}
              <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-300 flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-amber-400" />
                  {isAm ? 'ለኢትዮጵያ ቡና ላኪዎች የድርጊት መርሃ ግብር (Tactical Roadmap)' : 'Actionable Exporter Execution Roadmap'}
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {report.tacticalRoadmap.map((item, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg bg-stone-900/80 border border-stone-800 space-y-2">
                      <span className="text-xs font-mono font-bold text-amber-400 block pb-1 border-b border-stone-800">
                        {item.timeframe}
                      </span>
                      <p className="text-xs text-stone-200 font-medium leading-relaxed">{item.action}</p>
                      <div className="text-[11px] text-emerald-400/90 pt-1 border-t border-stone-800/80">
                        <strong>{isAm ? 'ተፅዕኖ' : 'Payoff'}:</strong> {item.impact}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="py-12 text-center text-stone-400">
              <p>{isAm ? 'ሪፖርቱ ሊመጣ አልቻለም' : 'No report data available.'}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950 text-xs text-stone-400">
          <span>CoffeeIntel Live Intelligence Engine • Real Data Ingested</span>
          <button
            onClick={onRegenerate}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold flex items-center gap-1.5 transition-colors disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isAm ? 'ሪፖርቱን በድጋሚ አዘጋጅ' : 'Regenerate Analysis'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
