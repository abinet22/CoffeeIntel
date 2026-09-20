import React, { useState } from 'react';
import {
  X,
  Layers,
  Cpu,
  Database,
  SlidersHorizontal,
  TrendingUp,
  Globe2,
  CloudRain,
  Coins,
  ShieldCheck,
  Ship,
  Newspaper,
  MapPin,
  Zap,
  Sparkles,
  ArrowRight,
  ChevronRight,
  CheckCircle2,
  GitBranch,
} from 'lucide-react';
import { SYSTEM_ARCHITECTURE_COMPONENTS, ArchitectureComponent } from '../data/marketReference';
import { Language } from '../types';

interface SystemArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onOpenDataSources: () => void;
  onOpenProConReport: () => void;
}

export const SystemArchitectureModal: React.FC<SystemArchitectureModalProps> = ({
  isOpen,
  onClose,
  language,
  onOpenDataSources,
  onOpenProConReport,
}) => {
  const isAm = language === 'am';
  const [activeComponentId, setActiveComponentId] = useState<string>('event-engine');

  if (!isOpen) return null;

  const activeComponent =
    SYSTEM_ARCHITECTURE_COMPONENTS.find((c) => c.id === activeComponentId) ||
    SYSTEM_ARCHITECTURE_COMPONENTS[0];

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'TrendingUp': return TrendingUp;
      case 'Globe2': return Globe2;
      case 'CloudRain': return CloudRain;
      case 'Coins': return Coins;
      case 'ShieldCheck': return ShieldCheck;
      case 'Ship': return Ship;
      case 'Newspaper': return Newspaper;
      case 'MapPin': return MapPin;
      case 'Zap': return Zap;
      case 'SlidersHorizontal': return SlidersHorizontal;
      case 'Sparkles': return Sparkles;
      default: return Cpu;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden my-8 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-800 bg-stone-950">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                {isAm ? 'የ CoffeeIntel ስርዓት አሰራር እና አርክቴክቸር' : 'How CoffeeIntel Works: System Architecture & Engine Pipeline'}
              </h2>
              <p className="text-xs text-stone-400">
                {isAm ? 'የ 10 ቱ የኢንተለጀንስ ምሰሶዎች እና የተፅዕኖ ሞተሮች ትስስር' : 'Technical guide to the 10 intelligence pillars, Market Event Engine, and Coffee Impact Engine'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-stone-200">
          {/* End-to-End Pipeline Diagram Banner */}
          <div className="p-5 rounded-xl bg-stone-950 border border-stone-800 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <GitBranch className="w-4 h-4" />
                {isAm ? 'የመረጃ ፍሰት እና የስሌት ቅደም ተከተል' : 'End-to-End Intelligence Pipeline Flow'}
              </h3>
              <span className="text-[11px] text-stone-400">Real-time Autonomous Processing</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-amber-400 font-bold block text-[10px]">STEP 1: INGESTION</span>
                <span className="font-semibold text-stone-100">23 Live Sources</span>
                <p className="text-[11px] text-stone-400 leading-tight">Yahoo Finance ticks, Open-Meteo satellites, Open.ER-API FX, RSS feeds.</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-blue-400 font-bold block text-[10px]">STEP 2: STRUCTURING</span>
                <span className="font-semibold text-stone-100">Market Event Engine</span>
                <p className="text-[11px] text-stone-400 leading-tight">NLP entities, origin categorization, and severity ratings (L1 to L5).</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-purple-400 font-bold block text-[10px]">STEP 3: IMPACT MODEL</span>
                <span className="font-semibold text-stone-100">Coffee Impact Engine</span>
                <p className="text-[11px] text-stone-400 leading-tight">Causal propagation to ICE futures, FOB differentials, and ECX floor.</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-emerald-400 font-bold block text-[10px]">STEP 4: PRO/CON LENS</span>
                <span className="font-semibold text-stone-100">AI Pro/Con Synthesizer</span>
                <p className="text-[11px] text-stone-400 leading-tight">Division into Opportunities (Pros) vs Risks (Cons) and roadmap generation.</p>
              </div>

              <div className="p-3 rounded-lg bg-stone-900 border border-stone-800 space-y-1">
                <span className="text-amber-400 font-bold block text-[10px]">STEP 5: EXECUTION</span>
                <span className="font-semibold text-stone-100">Exporter Decision Suite</span>
                <p className="text-[11px] text-stone-400 leading-tight">Contract calculators, currency hedging, and alert dispatch.</p>
              </div>
            </div>
          </div>

          {/* Component Deep Dive Explorer */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Left Column: Component Selector List */}
            <div className="space-y-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block px-1">
                {isAm ? 'የስርዓቱ ክፍሎች (ይምረጡ)' : 'Select Engine / Pillar:'}
              </span>
              <div className="space-y-1 max-h-[420px] overflow-y-auto pr-1">
                {SYSTEM_ARCHITECTURE_COMPONENTS.map((comp) => {
                  const IconC = getIcon(comp.icon);
                  const isSelected = comp.id === activeComponentId;

                  return (
                    <button
                      key={comp.id}
                      onClick={() => setActiveComponentId(comp.id)}
                      className={`w-full p-2.5 rounded-xl text-left flex items-center justify-between transition-all ${
                        isSelected
                          ? 'bg-amber-500/15 border border-amber-500/40 text-stone-100'
                          : 'bg-stone-950/60 border border-stone-800 text-stone-300 hover:bg-stone-800/60'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`p-1.5 rounded-lg ${
                            isSelected ? 'bg-amber-500 text-stone-950' : 'bg-stone-800 text-amber-400'
                          }`}
                        >
                          <IconC className="w-4 h-4" />
                        </div>
                        <div>
                          <span className="text-xs font-bold block line-clamp-1">
                            {isAm ? comp.nameAm : comp.name}
                          </span>
                          <span className="text-[10px] text-stone-400 line-clamp-1">{comp.category}</span>
                        </div>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${isSelected ? 'text-amber-400' : 'text-stone-400'}`} />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right 2 Columns: Detailed Specifications of Selected Component */}
            <div className="md:col-span-2 p-5 rounded-2xl bg-stone-950 border border-stone-800 space-y-4">
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-stone-800">
                <div>
                  <span className="text-[11px] font-mono text-amber-400 uppercase tracking-wider font-semibold">
                    {activeComponent.category}
                  </span>
                  <h3 className="text-lg font-bold text-stone-100 mt-0.5">
                    {isAm ? activeComponent.nameAm : activeComponent.name}
                  </h3>
                  <p className="text-xs text-stone-400 mt-1">{activeComponent.tagline}</p>
                </div>

                <span className="px-2.5 py-1 rounded-full text-xs font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-semibold">
                  Active in Platform
                </span>
              </div>

              {/* How It Works Explanation */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-300 flex items-center gap-1.5">
                  <Cpu className="w-3.5 h-3.5 text-amber-400" />
                  {isAm ? 'እንዴት ይሰራል? (Operational Logic):' : 'How It Operates:'}
                </h4>
                <p className="text-xs text-stone-300 leading-relaxed bg-stone-900/60 p-3.5 rounded-xl border border-stone-800/80">
                  {isAm ? activeComponent.howItWorksAm : activeComponent.howItWorks}
                </p>
              </div>

              {/* Inputs and Outputs Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                {/* Data Inputs */}
                <div className="p-3.5 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-blue-400 flex items-center gap-1">
                    <Database className="w-3.5 h-3.5" />
                    {isAm ? 'የመረጃ ግብዓቶች (Data Inputs):' : 'Data Inputs:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {activeComponent.dataInputs.map((input, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
                        <span>{input}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Key Outputs */}
                <div className="p-3.5 rounded-xl bg-stone-900/40 border border-stone-800 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {isAm ? 'ውጤቶች (Key Outputs):' : 'Key Outputs Generated:'}
                  </span>
                  <ul className="space-y-1.5 text-xs text-stone-300">
                    {activeComponent.keyOutputs.map((output, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        <span>{output}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-stone-800 bg-stone-950 text-xs text-stone-400">
          <span>CoffeeIntel Core Engineering Framework • Clean Live Ingestion Architecture</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onOpenDataSources();
              }}
              className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 font-medium transition-colors"
            >
              {isAm ? 'ሁሉንም የመረጃ ምንጮች ተመልከት' : 'View Master Sources Registry'}
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenProConReport();
              }}
              className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-semibold transition-colors flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isAm ? 'የ AI ሪፖርት አዘጋጅ' : 'Generate AI Pro/Con Report'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
