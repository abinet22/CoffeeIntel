import React from 'react';
import {
  TrendingUp,
  FileText,
  Bell,
  Sparkles,
  RefreshCw,
  Globe2,
  DollarSign,
  Scale,
  ShieldCheck,
  Languages,
} from 'lucide-react';
import { PriceUnit } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  unit: PriceUnit;
  onUnitChange: (unit: PriceUnit) => void;
  currencyMode: 'USD' | 'ETB';
  onCurrencyModeChange: (mode: 'USD' | 'ETB') => void;
  onOpenCopilot: () => void;
  onOpenReport: () => void;
  onOpenAlerts: () => void;
  isRefreshing: boolean;
  onRefreshData: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  unit,
  onUnitChange,
  currencyMode,
  onCurrencyModeChange,
  onOpenCopilot,
  onOpenReport,
  onOpenAlerts,
  isRefreshing,
  onRefreshData,
}) => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-800 bg-stone-950/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        {/* Brand & Market Identity */}
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950 p-2 shadow-lg shadow-amber-900/30 ring-1 ring-amber-500/30">
            <span className="text-lg font-black tracking-tight text-white">☕</span>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-stone-950" title="Live data feed online" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold tracking-tight text-stone-100 sm:text-xl">
                Coffee<span className="text-amber-500">Intel</span>
              </h1>
              <span className="rounded-md bg-amber-950/60 px-2 py-0.5 text-xs font-semibold text-amber-300 border border-amber-800/40">
                {t.exporterDesk}
              </span>
            </div>
            <p className="hidden text-xs text-stone-400 sm:block">
              {t.brandTagline}
            </p>
          </div>
        </div>

        {/* Global Controls & Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher: EN / አማርኛ */}
          <div className="flex items-center rounded-lg bg-stone-900 p-1 border border-stone-800 text-xs shadow-inner">
            <button
              id="lang-en-btn"
              onClick={() => setLanguage('en')}
              className={`rounded px-2 py-1 font-semibold transition-all ${
                language === 'en'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="English Version"
            >
              EN
            </button>
            <button
              id="lang-am-btn"
              onClick={() => setLanguage('am')}
              className={`rounded px-2.5 py-1 font-semibold transition-all flex items-center gap-1 ${
                language === 'am'
                  ? 'bg-amber-600 text-white shadow-xs font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title="የአማርኛ ስሪት (Amharic Language Version)"
            >
              <span className="text-xs">🇪🇹</span>
              <span>አማርኛ</span>
            </button>
          </div>

          {/* Unit Toggle */}
          <div className="hidden sm:flex items-center rounded-lg bg-stone-900 p-1 border border-stone-800 text-xs">
            <button
              id="unit-cents-lb"
              onClick={() => onUnitChange('cents_lb')}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                unit === 'cents_lb'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title={language === 'am' ? 'የአሜሪካ ሳንቲም በፓውንድ' : 'US Cents per Pound (Global Futures Benchmark)'}
            >
              ¢/lb
            </button>
            <button
              id="unit-usd-kg"
              onClick={() => onUnitChange('usd_kg')}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                unit === 'usd_kg'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title={language === 'am' ? 'ዶላር በኪሎግራም' : 'USD per Kilogram'}
            >
              $/kg
            </button>
            <button
              id="unit-etb-kg"
              onClick={() => onUnitChange('etb_kg')}
              className={`rounded px-2 py-1 font-medium transition-colors ${
                unit === 'etb_kg'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
              title={language === 'am' ? 'የኢትዮጵያ ብር በኪሎግራም' : 'Ethiopian Birr per Kilogram (Local Realization)'}
            >
              ETB/kg
            </button>
          </div>

          {/* Currency Realization Mode */}
          <button
            id="currency-toggle-btn"
            onClick={() => onCurrencyModeChange(currencyMode === 'USD' ? 'ETB' : 'USD')}
            className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
            title="Toggle between USD international and ETB local currency perspective"
          >
            <DollarSign className="h-3.5 w-3.5 text-amber-500" />
            <span className="hidden sm:inline">{t.viewCurrency}</span>
            <span className="font-mono text-amber-400">{currencyMode}</span>
          </button>

          {/* Refresh Data */}
          <button
            id="refresh-market-btn"
            onClick={onRefreshData}
            disabled={isRefreshing}
            className="rounded-lg border border-stone-800 bg-stone-900 p-2 text-stone-400 hover:text-amber-400 hover:border-stone-700 transition-colors disabled:opacity-50"
            title={t.refreshFeeds}
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-amber-500' : ''}`} />
          </button>

          {/* Alerts & Notifications */}
          <button
            id="open-alerts-btn"
            onClick={onOpenAlerts}
            className="relative rounded-lg border border-stone-800 bg-stone-900 p-2 text-stone-300 hover:text-amber-300 hover:border-amber-500/40 transition-colors"
            title={t.alertsBtn}
          >
            <Bell className="h-4 w-4" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5 rounded-full bg-amber-500" />
          </button>

          {/* Export Report */}
          <button
            id="export-report-btn"
            onClick={onOpenReport}
            className="hidden items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-semibold text-stone-200 hover:bg-stone-700 hover:text-white transition-colors sm:flex"
            title="Generate print-ready briefing for banks & buyers"
          >
            <FileText className="h-3.5 w-3.5 text-stone-400" />
            <span>{t.exportReportBtn}</span>
          </button>

          {/* AI Copilot Button */}
          <button
            id="open-ai-copilot-btn"
            onClick={onOpenCopilot}
            className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-600 to-amber-500 px-3 py-1.5 text-xs font-bold text-stone-950 shadow-md shadow-amber-900/20 hover:from-amber-500 hover:to-amber-400 transition-all"
            title={t.copilotModalTitle}
          >
            <Sparkles className="h-3.5 w-3.5 fill-stone-950" />
            <span className="hidden sm:inline">{t.aiCopilotBtn}</span>
            <span className="sm:hidden">AI</span>
          </button>
        </div>
      </div>
    </header>
  );
};
