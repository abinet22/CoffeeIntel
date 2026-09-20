import React, { useState } from 'react';
import {
  Zap,
  SlidersHorizontal,
  TrendingUp,
  AlertTriangle,
  Sparkles,
  Database,
  ArrowRight,
  Globe2,
  CloudRain,
  Coins,
  ShieldCheck,
  Ship,
  Newspaper,
  MapPin,
  Flame,
  Info,
  ChevronRight,
  Filter,
  ExternalLink,
} from 'lucide-react';
import { IntelligenceEventItem, Language, SourceRegistryItem } from '../types';

interface MarketEventAndImpactEngineViewProps {
  events: IntelligenceEventItem[];
  language: Language;
  onOpenProConReport: () => void;
  onOpenDataSources: () => void;
  onOpenArchitecture: () => void;
}

export const MarketEventAndImpactEngineView: React.FC<MarketEventAndImpactEngineViewProps> = ({
  events,
  language,
  onOpenProConReport,
  onOpenDataSources,
  onOpenArchitecture,
}) => {
  const isAm = language === 'am';
  const [selectedProCon, setSelectedProCon] = useState<'ALL' | 'PRO' | 'CON'>('ALL');
  const [selectedPillar, setSelectedPillar] = useState<string>('ALL');
  const [selectedSeverity, setSelectedSeverity] = useState<number | 'ALL'>('ALL');

  const pillars = [
    { id: 'Market', name: isAm ? 'የቡና ገበያ መረጃ' : 'Coffee Market Intel', icon: TrendingUp, count: 6, desc: isAm ? 'ዋጋዎች፣ የወደፊት ውሎች፣ አቅርቦት እና ፍላጎት' : 'Prices, futures, supply & demand' },
    { id: 'Trade', name: isAm ? 'የንግድ እና ኤክስፖርት' : 'Coffee Trade Intel', icon: Globe2, count: 5, desc: isAm ? 'ኤክስፖርት፣ መዳረሻዎች፣ ገዢዎች' : 'Exports, imports, destinations, buyers' },
    { id: 'Weather', name: isAm ? 'የግብርና አየር ሁኔታ' : 'Agri-Weather Intel', icon: CloudRain, count: 4, desc: isAm ? 'የዝናብ መጠን፣ ድርቅ፣ የቡና ሰብል ሁኔታ' : 'Rainfall, drought, crop flowering' },
    { id: 'Commodity', name: isAm ? 'የሸቀጦች እና ማክሮ' : 'Commodity & FX Intel', icon: Coins, count: 4, desc: isAm ? 'የነዳጅ ዋጋ፣ የብር ምንዛሪ፣ ኮኮዋ' : 'Oil, unified USD/ETB rate, cocoa' },
    { id: 'Geopolitics', name: isAm ? 'ጂኦ-ፖለቲካ እና ፖሊሲ' : 'Geopolitical Intel', icon: ShieldCheck, count: 3, desc: isAm ? 'የቀይ ባህር ደህንነት፣ ማዕቀብ፣ EUDR' : 'Red Sea security, EUDR compliance' },
    { id: 'Logistics', name: isAm ? 'የሎጅስቲክስ መረጃ' : 'Logistics Intel', icon: Ship, count: 4, desc: isAm ? 'የጅቡቲ ወደብ፣ የባህር ጉዞ፣ የጭነት ዋጋ' : 'Djibouti port, Cape detour, freight' },
    { id: 'News', name: isAm ? 'የዜና እና ኢኮኖሚ' : 'News Intelligence', icon: Newspaper, count: 8, desc: isAm ? 'አለም አቀፍ የቡና ዜናዎች እና መግለጫዎች' : 'Global coffee & economic news' },
    { id: 'Origin', name: isAm ? 'የአምራች አገራት' : 'Origin Intelligence', icon: MapPin, count: 6, desc: isAm ? 'ኢትዮጵያ፣ ብራዚል፣ ኮሎምቢያ፣ ቬትናም' : 'Ethiopia, Brazil, Colombia, Vietnam' },
  ];

  const filteredEvents = events.filter((e) => {
    if (selectedProCon !== 'ALL' && e.proConType !== selectedProCon) return false;
    if (selectedPillar !== 'ALL' && e.pillar !== selectedPillar) return false;
    if (selectedSeverity !== 'ALL' && e.severity !== selectedSeverity) return false;
    return true;
  });

  const prosCount = events.filter((e) => e.proConType === 'PRO').length;
  const consCount = events.filter((e) => e.proConType === 'CON').length;

  return (
    <div className="space-y-6">
      {/* Top Hero Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 border border-stone-800 shadow-xl flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5">
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5" />
              {isAm ? 'የገበያ ክስተቶች እና የተፅዕኖ ሞተር' : 'Market Event Engine & Coffee Impact Engine'}
            </span>
            <span className="text-xs text-stone-400">
              {events.length} {isAm ? 'የተዋቀሩ የቀጥታ ክስተቶች' : 'Live Structured Events'}
            </span>
          </div>

          <h2 className="text-xl font-bold text-stone-100">
            {isAm ? 'ጥሬ መረጃዎችን ወደ ተዋቀረ የገበያ ክስተት እና የዋጋ ተፅዕኖ መቀየሪያ' : 'Causal Intelligence: Converting Raw Feeds into Market Impact'}
          </h2>

          <p className="text-xs text-stone-400 max-w-3xl leading-relaxed">
            {isAm
              ? 'የገበያ ክስተት ሞተር (Market Event Engine) ዜናዎችን እና የሳተላይት መረጃዎችን ወደ ተዋቀሩ ክስተቶች ይቀይራል። ከዚያም የቡና ተፅዕኖ ሞተር (Coffee Impact Engine) በእያንዳንዱ ክስተት ምክንያት በአይሲኢ አራቢካ፣ በኤፍኦቢ ልዩነት እና በሀገር ውስጥ የቼሪ ዋጋ ላይ የሚከሰተውን የዋጋ ለውጥ ያሰላል።'
              : 'The Market Event Engine scans live streams and formats them into structured events with severity scores. The Coffee Impact Engine propagates them into downstream pricing effects across ICE futures, FOB differentials, and ECX farmgate cherries.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={onOpenProConReport}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all transform hover:-translate-y-0.5"
          >
            <Sparkles className="w-4 h-4" />
            <span>{isAm ? 'የ AI ስትራቴጂክ ሪፖርት አዘጋጅ' : 'Generate AI Pro/Con Report'}</span>
          </button>

          <button
            onClick={onOpenArchitecture}
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 flex items-center gap-1.5 transition-colors"
          >
            <Info className="w-4 h-4 text-amber-400" />
            <span>{isAm ? 'እንዴት ይሰራል?' : 'How It Works'}</span>
          </button>

          <button
            onClick={onOpenDataSources}
            className="px-3.5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 font-semibold text-xs border border-stone-700 flex items-center gap-1.5 transition-colors"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>{isAm ? 'የመረጃ ምንጮች (23)' : 'Data Sources (23)'}</span>
          </button>
        </div>
      </div>

      {/* The 10 Core Intelligence Pillars Grid */}
      <div className="p-5 rounded-2xl bg-stone-900 border border-stone-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-amber-400" />
            {isAm ? 'የ 10 ቱ የቡና ኢንተለጀንስ ምሰሶዎች (10 Intelligence Pillars)' : 'The 10 Core Intelligence Pillars'}
          </h3>
          <span className="text-xs text-stone-400">
            {isAm ? 'ዘርፍን በመጫን ክስተቶችን ለይተህ ተመልከት' : 'Click a pillar to filter active events'}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-3">
          {pillars.map((p) => {
            const IconComponent = p.icon;
            const isSelected = selectedPillar === p.id;

            return (
              <button
                key={p.id}
                onClick={() => setSelectedPillar(isSelected ? 'ALL' : p.id)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/15 border-amber-500/50 shadow-md ring-1 ring-amber-500/30'
                    : 'bg-stone-950/70 border-stone-800 hover:border-stone-700 hover:bg-stone-950'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'}`}>
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-stone-800 text-stone-300">
                    Live
                  </span>
                </div>
                <h4 className="text-xs font-bold text-stone-100">{p.name}</h4>
                <p className="text-[11px] text-stone-400 line-clamp-1 mt-0.5">{p.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter and Engine Pipeline Controls */}
      <div className="p-4 rounded-xl bg-stone-900 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
        {/* Pro vs Con Toggle */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-400 mr-1">{isAm ? 'የ AI ትንተና:' : 'Signal Lens:'}</span>
          <button
            onClick={() => setSelectedProCon('ALL')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              selectedProCon === 'ALL'
                ? 'bg-stone-800 text-stone-100 border border-stone-700'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {isAm ? 'ሁሉም ክስተቶች' : 'All Events'} ({events.length})
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
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20">{prosCount}</span>
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
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-500/20">{consCount}</span>
          </button>
        </div>

        {/* Severity Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-stone-400">{isAm ? 'ክብደት:' : 'Severity:'}</span>
          <div className="flex items-center gap-1">
            {['ALL', 5, 4, 3].map((sev) => (
              <button
                key={sev}
                onClick={() => setSelectedSeverity(sev as any)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  selectedSeverity === sev
                    ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30'
                    : 'text-stone-400 hover:text-stone-200 bg-stone-950/60'
                }`}
              >
                {sev === 'ALL' ? (isAm ? 'ሁሉም' : 'All') : `L${sev}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Structured Events & Coffee Impact List */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => {
          const isPro = evt.proConType === 'PRO';
          const isSeverityHigh = evt.severity >= 4;

          return (
            <div
              key={evt.id}
              className="p-5 rounded-2xl bg-stone-900 border border-stone-800 hover:border-stone-700 transition-all space-y-4"
            >
              {/* Event Header: Severity + Pro/Con Tag + Country + Category */}
              <div className="flex items-center justify-between gap-2 flex-wrap">
                <div className="flex items-center gap-2">
                  {/* Severity Badge */}
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1 border ${
                      isSeverityHigh
                        ? 'bg-rose-500/15 text-rose-300 border-rose-500/30 animate-pulse'
                        : 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    <Flame className="w-3 h-3" />
                    <span>Severity L{evt.severity}</span>
                  </span>

                  {/* Pro/Con Tag */}
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 border ${
                      isPro
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}
                  >
                    {isPro ? <TrendingUp className="w-3 h-3" /> : <AlertTriangle className="w-3 h-3" />}
                    <span>{evt.proConType}: {evt.proConLabel}</span>
                  </span>

                  {/* Pillar */}
                  {evt.pillar && (
                    <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                      {evt.pillar}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2 text-xs text-stone-400">
                  <span className="text-stone-300 font-medium">{evt.country} ({evt.region})</span>
                  <span>•</span>
                  <span>{evt.publishedAt}</span>
                  <span>•</span>
                  <span className="italic text-stone-400">{evt.source}</span>
                </div>
              </div>

              {/* Event Title */}
              <div>
                <h3 className="text-base font-bold text-stone-100">{evt.title}</h3>
                <p className="text-xs text-stone-400 mt-1">
                  <strong>{isAm ? 'የክስተት ምደባ' : 'Classification'}:</strong> {evt.category} • {evt.commodity} • {evt.impact}
                </p>
              </div>

              {/* Coffee Impact Engine Causal Mapping Block */}
              <div className="p-4 rounded-xl bg-stone-950/80 border border-stone-800/90 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    {isAm ? 'የቡና ተፅዕኖ ሞተር ስሌት (Coffee Impact Engine Calculation)' : 'Coffee Impact Engine Output'}
                  </span>
                  <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                    {isPro ? (isAm ? 'የዋጋ ድጋፍ / አዎንታዊ' : 'Basis Support') : (isAm ? 'የወጪ ጫና / ስጋት' : 'Cost / Supply Headwind')}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80">
                    <span className="text-[10px] text-stone-400 block mb-0.5">
                      {isAm ? 'አይሲኢ አራቢካ ተፅዕኖ' : 'ICE Arabica Futures Impact'}
                    </span>
                    <span className="font-bold text-stone-200">
                      {isPro ? '+2.5¢ to +4.0¢/lb Support' : '-1.5¢ to -3.0¢ Resistance'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80">
                    <span className="text-[10px] text-stone-400 block mb-0.5">
                      {isAm ? 'የኤፍኦቢ ጅቡቲ ልዩነት ዋጋ' : 'FOB Djibouti Differential'}
                    </span>
                    <span className="font-bold text-emerald-400">
                      {isPro ? '+105¢ Washed G2 Premium' : 'Neutral Spread Pressure'}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-900 border border-stone-800/80">
                    <span className="text-[10px] text-stone-400 block mb-0.5">
                      {isAm ? 'የሀገር ውስጥ ቼሪ / ሎጅስቲክስ' : 'Domestic Cherry / Freight Effect'}
                    </span>
                    <span className="font-bold text-amber-400">
                      {evt.category === 'SHIPPING' ? '34-day Cape Detour / $5.8k' : '230 ETB/kg Cherry Parity'}
                    </span>
                  </div>
                </div>

                {/* Exporter Impact Summary */}
                <div className="text-xs text-stone-300 pt-1 border-t border-stone-800/60 flex items-start gap-2">
                  <span className="text-amber-400 font-semibold whitespace-nowrap">
                    {isAm ? 'ለላኪው ያለው ፋይዳ:' : 'Actionable Exporter Takeaway:'}
                  </span>
                  <span className="leading-relaxed">{isAm ? evt.exporterImpactAm : evt.exporterImpact}</span>
                </div>
              </div>

              {/* Event Footer */}
              <div className="flex items-center justify-between text-xs text-stone-400 pt-1">
                <span>Event ID: <strong className="font-mono text-stone-300">{evt.id}</strong></span>
                {evt.url && (
                  <a
                    href={evt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 font-medium"
                  >
                    <span>{isAm ? 'ዋናውን ዜና ተመልከት' : 'View Ingested Source'}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
          );
        })}

        {filteredEvents.length === 0 && (
          <div className="py-16 text-center text-stone-400 bg-stone-900 rounded-2xl border border-stone-800">
            <p className="text-sm">{isAm ? 'በተመረጡት አጣሪዎች ምንም ክስተት አልተገኘም' : 'No market events match the selected filters.'}</p>
            <button
              onClick={() => {
                setSelectedProCon('ALL');
                setSelectedPillar('ALL');
                setSelectedSeverity('ALL');
              }}
              className="mt-3 px-3 py-1.5 rounded-lg bg-stone-800 text-xs text-amber-400 hover:bg-stone-700 font-medium"
            >
              {isAm ? 'አጣሪዎችን አጽዳ' : 'Reset Filters'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
