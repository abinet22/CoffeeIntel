import React, { useState } from 'react';
import {
  BookOpen,
  Newspaper,
  FileText,
  Search,
  Filter,
  ExternalLink,
  Sparkles,
  TrendingUp,
  AlertTriangle,
  Clock,
  Building2,
  Calendar,
  Layers,
  ChevronRight,
  X,
  Share2,
  Bookmark,
  CheckCircle2,
} from 'lucide-react';
import { PublicationItem, PublicationType, Language, NewsItem } from '../types';

interface PublicationsReaderViewProps {
  publications: PublicationItem[];
  newsItems: NewsItem[];
  language: Language;
  onOpenProConReport: () => void;
}

export const PublicationsReaderView: React.FC<PublicationsReaderViewProps> = ({
  publications,
  newsItems,
  language,
  onOpenProConReport,
}) => {
  const isAm = language === 'am';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'ALL' | PublicationType | 'NEWS'>('ALL');
  const [selectedProCon, setSelectedProCon] = useState<'ALL' | 'PRO' | 'CON'>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');
  const [activeReadingItem, setActiveReadingItem] = useState<PublicationItem | null>(null);

  // Combine publications and convert some news items for comprehensive reading
  const allItems: PublicationItem[] = [
    ...publications,
    // Convert news items to publication items if needed
    ...newsItems.slice(0, 10).map((n) => ({
      id: `pub-news-${n.id}`,
      title: n.title,
      publication: n.source,
      type: 'NEWS_DISPATCH' as PublicationType,
      publishedDate: n.publishedAt,
      authorOrOrg: n.source,
      readTime: '2 min read',
      summary: n.summary,
      fullExcerpt: `${n.summary} Additional exporter intelligence indicates that physical differentials and export parity remain sensitive to this market development. ${n.exporterTakeaway}`,
      keyTakeaways: [
        n.exporterTakeaway || 'Monitor market developments closely.',
        `Affected markets: ${n.affectedMarkets.join(', ')}`,
        `Key entity: ${n.keyEntities.join(', ')}`,
      ],
      url: n.url || '#',
      proConTag: (n.sentiment === 'Bullish' ? 'PRO' : n.sentiment === 'Bearish' ? 'CON' : 'NEUTRAL') as 'PRO' | 'CON' | 'NEUTRAL',
      proConLabel: n.sentiment === 'Bullish' ? 'Opportunity / Basis Premium' : 'Risk / Headwind',
      pillars: ['Market', 'Trade'] as any,
      impactMagnitude: n.impactMagnitude as 'High' | 'Medium' | 'Low',
      relevantCommodities: n.affectedMarkets,
    })),
  ];

  // Filtering logic
  const filteredItems = allItems.filter((item) => {
    // Type filter
    if (selectedType !== 'ALL') {
      if (selectedType === 'NEWS' && item.type !== 'NEWS_DISPATCH') return false;
      if (selectedType !== 'NEWS' && item.type !== selectedType) return false;
    }
    // Pro/Con filter
    if (selectedProCon !== 'ALL' && item.proConTag !== selectedProCon) return false;
    // Pillar filter
    if (selectedPillar !== 'ALL' && !item.pillars.includes(selectedPillar as any)) return false;
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchPub = item.publication.toLowerCase().includes(q);
      const matchSummary = item.summary.toLowerCase().includes(q);
      if (!matchTitle && !matchPub && !matchSummary) return false;
    }
    return true;
  });

  const proCount = allItems.filter((i) => i.proConTag === 'PRO').length;
  const conCount = allItems.filter((i) => i.proConTag === 'CON').length;

  return (
    <div className="space-y-6">
      {/* Top Banner & Strategy Summary Bar */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-stone-950 border border-stone-800 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              {isAm ? 'የዜና፣ መጽሔቶች እና ይፋዊ ሪፖርቶች ቤተ-መጽሐፍት' : 'Publications, Magazines & Reports Archive'}
            </span>
            <span className="text-xs text-stone-400">
              {filteredItems.length} {isAm ? 'የተገኙ ሰነዶች' : 'Documents Available'}
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-100">
            {isAm ? 'አለም አቀፍ የቡና ኢንዱስትሪ ህትመቶች እና የተከፋፈሉ የ AI ትንተናዎች' : 'Global Industry Reports & Pro/Con Intelligence Reader'}
          </h2>
          <p className="text-xs text-stone-400 max-w-2xl">
            {isAm
              ? 'ከ ICO፣ USDA፣ Daily Coffee News፣ Tea & Coffee Trade Journal እና ከ ECTA የተሰበሰቡ ይፋዊ ሰነዶችን ያንብቡ። እያንዳንዱ መረጃ በዕድል (PRO) እና በስጋት (CON) ተከፍሎ ቀርቧል።'
              : 'Read official reports from the ICO, USDA GAIN, Daily Coffee News, Tea & Coffee Trade Journal, and ECTA. All signals are parsed with Pro (Opportunity) and Con (Risk) tags.'}
          </p>
        </div>

        {/* Action Button: Generate AI Pro/Con Summary Report */}
        <button
          onClick={onOpenProConReport}
          className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
        >
          <Sparkles className="w-4 h-4" />
          <span>{isAm ? 'የ AI ስትራቴጂክ ሪፖርት አዘጋጅ' : 'Generate AI Pro/Con Report'}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 space-y-4">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                isAm
                  ? 'በህትመት ስም፣ በርዕስ ወይም በይዘት ፈልግ (ለምሳሌ፡ ICO, USDA, Differentials)...'
                  : 'Search by title, publisher, or content (e.g. ICO, USDA, Differentials, Antwerp)...'
              }
              className="w-full pl-10 pr-4 py-2 rounded-lg bg-stone-950 border border-stone-800 text-xs text-stone-200 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Pro / Con Quick Chips */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSelectedProCon('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                selectedProCon === 'ALL'
                  ? 'bg-stone-800 text-stone-100 border border-stone-700'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/50'
              }`}
            >
              {isAm ? 'ሁሉም' : 'All Tags'} ({allItems.length})
            </button>
            <button
              onClick={() => setSelectedProCon('PRO')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                selectedProCon === 'PRO'
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'text-emerald-400 hover:bg-emerald-500/10'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{isAm ? 'ዕድሎች (PROS)' : 'PROS (Catalysts)'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20">{proCount}</span>
            </button>
            <button
              onClick={() => setSelectedProCon('CON')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors ${
                selectedProCon === 'CON'
                  ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  : 'text-rose-400 hover:bg-rose-500/10'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{isAm ? 'ስጋቶች (CONS)' : 'CONS (Risks)'}</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20">{conCount}</span>
            </button>
          </div>
        </div>

        {/* Secondary Filters: Publication Type & Intelligence Pillar */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-800 text-xs">
          {/* Document Type Chips */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-stone-400 font-medium mr-1">{isAm ? 'አይነት:' : 'Type:'}</span>
            {[
              { id: 'ALL', label: isAm ? 'ሁሉም ህትመቶች' : 'All Types' },
              { id: 'REPORT', label: isAm ? 'ይፋዊ ሪፖርቶች' : 'Official Reports' },
              { id: 'MAGAZINE', label: isAm ? 'የንግድ መጽሔቶች' : 'Trade Magazines' },
              { id: 'NEWS', label: isAm ? 'የዜና መግለጫዎች' : 'News Dispatches' },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setSelectedType(t.id as any)}
                className={`px-2.5 py-1 rounded-md text-xs transition-colors ${
                  selectedType === t.id
                    ? 'bg-amber-500/20 text-amber-300 font-semibold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-950/60'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* Pillar Selector */}
          <div className="flex items-center gap-1.5">
            <span className="text-stone-400 font-medium">{isAm ? 'የመረጃ ዘርፍ:' : 'Pillar:'}</span>
            <select
              value={selectedPillar}
              onChange={(e) => setSelectedPillar(e.target.value)}
              className="bg-stone-950 border border-stone-800 rounded-md px-2.5 py-1 text-xs text-stone-200 focus:outline-none focus:border-amber-500"
            >
              <option value="ALL">{isAm ? 'ሁሉም 10 ዘርፎች' : 'All 10 Pillars'}</option>
              <option value="Market">Market Intelligence</option>
              <option value="Trade">Trade & Export Flows</option>
              <option value="Weather">Agri-Weather & Climate</option>
              <option value="Commodity">Commodity & FX Macro</option>
              <option value="Geopolitics">Geopolitics & Policy</option>
              <option value="Logistics">Logistics & Shipping</option>
              <option value="Origin">Origin Intelligence</option>
            </select>
          </div>
        </div>
      </div>

      {/* Document & Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filteredItems.map((item) => {
          const isPro = item.proConTag === 'PRO';
          const isReport = item.type === 'REPORT';
          const isMagazine = item.type === 'MAGAZINE';

          return (
            <div
              key={item.id}
              className="p-5 rounded-2xl bg-stone-900/90 border border-stone-800 hover:border-stone-700 transition-all flex flex-col justify-between space-y-4 group"
            >
              <div className="space-y-3">
                {/* Meta Row: Type Badge + Pro/Con Tag + Read Time */}
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                        isReport
                          ? 'bg-blue-500/10 text-blue-400 border-blue-500/20'
                          : isMagazine
                          ? 'bg-purple-500/10 text-purple-400 border-purple-500/20'
                          : 'bg-stone-800 text-stone-300 border-stone-700'
                      }`}
                    >
                      {isReport ? 'INSTITUTIONAL REPORT' : isMagazine ? 'TRADE MAGAZINE' : 'MARKET DISPATCH'}
                    </span>

                    <span className="text-[11px] text-stone-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {item.readTime}
                    </span>
                  </div>

                  {/* PRO or CON tag */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      isPro
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isPro ? <TrendingUp className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                    <span>{item.proConTag}: {item.proConLabel}</span>
                  </span>
                </div>

                {/* Title and Publication */}
                <div>
                  <h3 className="text-base font-bold text-stone-100 group-hover:text-amber-400 transition-colors leading-snug">
                    {item.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-stone-400 mt-1">
                    <Building2 className="w-3.5 h-3.5 text-stone-400" />
                    <span className="font-medium text-stone-300">{item.publication}</span>
                    <span>•</span>
                    <span className="text-stone-400">{item.publishedDate}</span>
                  </div>
                </div>

                {/* Summary */}
                <p className="text-xs text-stone-300 line-clamp-3 leading-relaxed">
                  {item.summary}
                </p>

                {/* Key Takeaways Preview */}
                {item.keyTakeaways && item.keyTakeaways.length > 0 && (
                  <div className="p-3 rounded-xl bg-stone-950/70 border border-stone-800/80 space-y-1.5">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> {isAm ? 'ዋና ዋና ነጥቦች (Key Takeaways):' : 'Key Takeaways:'}
                    </span>
                    <ul className="space-y-1">
                      {item.keyTakeaways.slice(0, 2).map((takeaway, tIdx) => (
                        <li key={tIdx} className="text-[11px] text-stone-300 flex items-start gap-1.5">
                          <span className="text-amber-500/70 mt-0.5">•</span>
                          <span className="line-clamp-2">{takeaway}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Card Footer: Pillar Tags + Read Full Article Button */}
              <div className="pt-3 border-t border-stone-800 flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-1.5 flex-wrap">
                  {item.pillars.map((p, pIdx) => (
                    <span
                      key={pIdx}
                      className="text-[10px] px-2 py-0.5 rounded bg-stone-800 text-stone-300 font-mono"
                    >
                      {p}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActiveReadingItem(item)}
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 text-xs font-semibold flex items-center gap-1 transition-colors"
                  >
                    <span>{isAm ? 'ሙሉውን አንብብ' : 'Read Full Report'}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>

                  {item.url && (
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                      title={isAm ? 'ወደ ምንጭ ድረ-ገጽ ሂድ' : 'Visit source website'}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredItems.length === 0 && (
        <div className="py-16 text-center text-stone-400 bg-stone-900 rounded-2xl border border-stone-800">
          <p className="text-sm">{isAm ? 'ምንም አይነት ህትመት አልተገኘም' : 'No publications match your filter criteria.'}</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedType('ALL');
              setSelectedProCon('ALL');
              setSelectedPillar('ALL');
            }}
            className="mt-3 px-3 py-1.5 rounded-lg bg-stone-800 text-xs text-amber-400 hover:bg-stone-700 font-medium"
          >
            {isAm ? 'ሁሉንም አጣሪዎች አጽዳ' : 'Reset All Filters'}
          </button>
        </div>
      )}

      {/* In-App Reading Modal */}
      {activeReadingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                    {activeReadingItem.publication} • {activeReadingItem.publishedDate}
                  </span>
                  <h3 className="text-base font-bold text-stone-100 line-clamp-1">{activeReadingItem.title}</h3>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {activeReadingItem.url && (
                  <a
                    href={activeReadingItem.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <span>{isAm ? 'ይፋዊ ድረ-ገጽ' : 'Official Publisher'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  onClick={() => setActiveReadingItem(null)}
                  className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-200">
              {/* Pro/Con Banner */}
              <div
                className={`p-4 rounded-xl border flex items-center justify-between ${
                  activeReadingItem.proConTag === 'PRO'
                    ? 'bg-emerald-950/30 border-emerald-500/30 text-emerald-300'
                    : 'bg-rose-950/30 border-rose-500/30 text-rose-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  {activeReadingItem.proConTag === 'PRO' ? (
                    <TrendingUp className="w-5 h-5" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" />
                  )}
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider">
                      {activeReadingItem.proConTag}: {activeReadingItem.proConLabel}
                    </span>
                    <p className="text-xs opacity-90 mt-0.5">
                      {activeReadingItem.proConTag === 'PRO'
                        ? (isAm ? 'ይህ መረጃ ለኢትዮጵያ ቡና ላኪዎች የዋጋ ዕድልን እና ትርፋማነትን ያሳያል' : 'Identified as a favorable market catalyst and basis support factor.')
                        : (isAm ? 'ይህ መረጃ የጭነት ወጪ ወይም የዋጋ ስጋትን የሚያመላክት ነው' : 'Identified as a risk factor, regulatory constraint, or logistics cost bottleneck.')}
                    </p>
                  </div>
                </div>

                <span className="text-xs font-mono font-bold px-2 py-1 rounded bg-stone-900/60 border border-stone-700">
                  {activeReadingItem.impactMagnitude} Impact
                </span>
              </div>

              {/* Full Article Text */}
              <div className="space-y-3">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  {isAm ? 'የሰነዱ ዝርዝር ይዘት' : 'Executive Article & Report Text'}
                </h4>
                <p className="text-sm text-stone-200 leading-relaxed font-serif bg-stone-950/40 p-5 rounded-xl border border-stone-800/80">
                  {activeReadingItem.fullExcerpt || activeReadingItem.summary}
                </p>
              </div>

              {/* Key Takeaways */}
              {activeReadingItem.keyTakeaways && activeReadingItem.keyTakeaways.length > 0 && (
                <div className="p-4 rounded-xl bg-stone-950 border border-stone-800 space-y-2.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    {isAm ? 'ለኢትዮጵያ ላኪዎች ቁልፍ ውሳኔ ሰጪ ነጥቦች' : 'Institutional Takeaways for Coffee Exporters'}
                  </h4>
                  <ul className="space-y-2">
                    {activeReadingItem.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="text-xs text-stone-300 flex items-start gap-2">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Metadata details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">{isAm ? 'ደራሲ / ተቋም' : 'Author / Organization'}</span>
                  <span className="font-semibold text-stone-200">{activeReadingItem.authorOrOrg}</span>
                </div>
                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">{isAm ? 'የንባብ ጊዜ' : 'Estimated Read'}</span>
                  <span className="font-semibold text-stone-200">{activeReadingItem.readTime}</span>
                </div>
                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">{isAm ? 'ተዛማጅ ሸቀጦች' : 'Relevant Commodities'}</span>
                  <span className="font-semibold text-stone-200">{activeReadingItem.relevantCommodities.join(', ')}</span>
                </div>
                <div className="p-3 rounded-lg bg-stone-950 border border-stone-800">
                  <span className="text-stone-400 block mb-1">{isAm ? 'የመረጃ ዘርፎች' : 'Covered Pillars'}</span>
                  <span className="font-semibold text-stone-200">{activeReadingItem.pillars.join(', ')}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950 text-xs">
              <span className="text-stone-400">CoffeeIntel Intelligence Archive</span>
              <button
                onClick={() => {
                  setActiveReadingItem(null);
                  onOpenProConReport();
                }}
                className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isAm ? 'ይህን በመጠቀም የ AI ሪፖርት አዘጋጅ' : 'Synthesize in AI Pro/Con Report'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
