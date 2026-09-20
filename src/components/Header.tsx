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
  Cpu,
  LogOut,
  User,
} from 'lucide-react';
import { PriceUnit, UserSession } from '../types';
import { useLanguage } from '../i18n/LanguageContext';

interface HeaderProps {
  unit: PriceUnit;
  onUnitChange: (unit: PriceUnit) => void;
  currencyMode: 'USD' | 'ETB';
  onCurrencyModeChange: (mode: 'USD' | 'ETB') => void;
  onOpenCopilot: () => void;
  onOpenReport: () => void;
  onOpenAlerts: () => void;
  onOpenSources?: () => void;
  onOpenArchitecture?: () => void;
  user?: UserSession | null;
  onLogout?: () => void;
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
  onOpenSources,
  onOpenArchitecture,
  user,
  onLogout,
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

          {/* Live Data Sources & Scraping Engine Registry */}
          {onOpenSources && (
            <button
              id="open-sources-btn"
              onClick={onOpenSources}
              className="hidden md:flex items-center gap-2 rounded-lg border border-emerald-500/30 bg-emerald-950/20 px-2.5 py-1.5 text-xs font-semibold text-emerald-300 hover:bg-emerald-950/50 hover:border-emerald-500/50 transition-colors"
              title="Live Data Sources & Scraping Engine Registry"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="font-mono text-[11px]">Live Feeds</span>
            </button>
          )}

          {/* System Architecture & How It Works Button */}
          {onOpenArchitecture && (
            <button
              id="open-architecture-btn"
              onClick={onOpenArchitecture}
              className="hidden lg:flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-stone-300 hover:border-amber-500/40 hover:text-amber-300 transition-colors"
              title="How It Works & System Architecture"
            >
              <Cpu className="h-3.5 w-3.5 text-amber-500" />
              <span>{language === 'am' ? 'አሰራር' : 'Architecture'}</span>
            </button>
          )}

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

          {/* Authenticated User Profile & Logout */}
          {user && (
            <div className="flex items-center gap-2 pl-2 border-l border-stone-800">
              <div
                className="hidden xl:flex items-center gap-2 rounded-lg border border-stone-800 bg-stone-900/80 px-2.5 py-1"
                title={`${user.fullName} (${user.organization})`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-500/20 border border-amber-500/40 text-[11px] font-bold text-amber-300">
                  {user.fullName.charAt(0)}
                </div>
                <div className="text-left">
                  <div className="text-xs font-semibold text-stone-200 leading-tight flex items-center gap-1">
                    <span>{user.fullName}</span>
                    {user.isDemo && (
                      <span className="text-[9px] px-1 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono">
                        DEMO
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] text-stone-400 leading-none">
                    {language === 'am' && user.roleAm ? user.roleAm : user.role}
                  </div>
                </div>
              </div>

              {onLogout && (
                <button
                  id="header-logout-btn"
                  onClick={onLogout}
                  className="flex items-center gap-1.5 rounded-lg border border-stone-800 bg-stone-900 px-2.5 py-1.5 text-xs font-semibold text-stone-400 hover:border-rose-500/40 hover:bg-rose-950/30 hover:text-rose-300 transition-colors"
                  title={t.logoutBtn}
                >
                  <LogOut className="h-3.5 w-3.5 text-rose-400" />
                  <span className="hidden sm:inline">{t.logoutBtn}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
