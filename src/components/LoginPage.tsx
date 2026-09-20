import React, { useState } from 'react';
import {
  Lock,
  User,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  Globe,
  CheckCircle2,
  AlertCircle,
  Building2,
  TrendingUp,
  Cpu,
} from 'lucide-react';
import { UserSession, DemoUserAccount } from '../types';
import { DEMO_ACCOUNTS } from '../data/demoUsers';
import { useLanguage } from '../i18n/LanguageContext';

interface LoginPageProps {
  onLoginSuccess: (user: UserSession) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess }) => {
  const { language, setLanguage, t } = useLanguage();
  const [username, setUsername] = useState<string>('demo');
  const [password, setPassword] = useState<string>('demo123');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<string>('demo');

  // Direct autofill of a demo persona
  const handleSelectPersona = (account: DemoUserAccount) => {
    setUsername(account.username);
    setPassword(account.password);
    setSelectedPersona(account.username);
    setErrorMessage(null);
  };

  // Perform login submission
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    const trimmedUser = username.trim();
    const trimmedPass = password.trim();

    if (!trimmedUser || !trimmedPass) {
      setErrorMessage(
        language === 'am'
          ? 'እባክዎ የተጠቃሚ ስም እና የይለፍ ቃል ያስገቡ።'
          : 'Please enter both username and password.'
      );
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: trimmedUser, password: trimmedPass }),
      });

      const data = await res.json();

      if (res.ok && data.success && data.user) {
        if (rememberMe) {
          try {
            localStorage.setItem('coffee_intel_session', JSON.stringify(data.user));
          } catch (storageErr) {
            console.warn('LocalStorage save skipped:', storageErr);
          }
        }
        onLoginSuccess(data.user);
      } else {
        setErrorMessage(data.error || t.loginInvalidError);
      }
    } catch (err) {
      console.warn('Server auth failed, falling back to local demo check', err);
      // Client-side fallback if network or server transiently fails
      const matched = DEMO_ACCOUNTS.find(
        (a) => a.username.toLowerCase() === trimmedUser.toLowerCase()
      );
      if (matched && matched.password === trimmedPass) {
        const fallbackUser: UserSession = {
          username: matched.username,
          fullName: matched.fullName,
          role: matched.role,
          roleAm: matched.roleAm,
          organization: matched.organization,
          loginTime: new Date().toISOString(),
          isDemo: true,
          token: `token_fallback_${matched.username}_${Date.now()}`,
        };
        if (rememberMe) {
          try {
            localStorage.setItem('coffee_intel_session', JSON.stringify(fallbackUser));
          } catch (e) {}
        }
        onLoginSuccess(fallbackUser);
      } else if (trimmedPass === 'demo123' || trimmedPass.length >= 4) {
        const customUser: UserSession = {
          username: trimmedUser,
          fullName: trimmedUser.charAt(0).toUpperCase() + trimmedUser.slice(1),
          role: 'Senior Exporter',
          roleAm: 'ዋና ቡና ላኪ',
          organization: 'Ethiopian Coffee Exporters Association',
          loginTime: new Date().toISOString(),
          isDemo: true,
          token: `token_custom_${Date.now()}`,
        };
        if (rememberMe) {
          try {
            localStorage.setItem('coffee_intel_session', JSON.stringify(customUser));
          } catch (e) {}
        }
        onLoginSuccess(customUser);
      } else {
        setErrorMessage(t.loginInvalidError);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // One-click instant demo access
  const handleInstantDemo = () => {
    const defaultAccount = DEMO_ACCOUNTS[0]; // Abebe Tadesse
    setUsername(defaultAccount.username);
    setPassword(defaultAccount.password);
    setSelectedPersona(defaultAccount.username);
    const session: UserSession = {
      username: defaultAccount.username,
      fullName: defaultAccount.fullName,
      role: defaultAccount.role,
      roleAm: defaultAccount.roleAm,
      organization: defaultAccount.organization,
      loginTime: new Date().toISOString(),
      isDemo: true,
      token: `token_instant_${Date.now()}`,
    };
    try {
      localStorage.setItem('coffee_intel_session', JSON.stringify(session));
    } catch (e) {}
    onLoginSuccess(session);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col justify-between selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar with Brand & Language Toggle */}
      <header className="border-b border-stone-800/80 bg-stone-950/80 backdrop-blur-md px-4 py-3 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-700 to-amber-950 p-2 shadow-lg shadow-amber-900/30 ring-1 ring-amber-500/30">
            <span className="text-lg font-black tracking-tight text-white">☕</span>
            <span className="absolute -bottom-1 -right-1 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-emerald-500 ring-2 ring-stone-950" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-stone-100 sm:text-xl">
                Coffee<span className="text-amber-500">Intel</span>
              </span>
              <span className="rounded-md bg-amber-950/70 px-2 py-0.5 text-[11px] font-semibold text-amber-300 border border-amber-800/40">
                {t.exporterDesk}
              </span>
            </div>
            <p className="hidden text-xs text-stone-400 sm:block">
              {t.brandTagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Language Selector */}
          <div className="flex items-center rounded-lg border border-stone-800 bg-stone-900 p-0.5 text-xs font-semibold">
            <button
              id="login-lang-en"
              type="button"
              onClick={() => setLanguage('en')}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                language === 'en'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
            <button
              id="login-lang-am"
              type="button"
              onClick={() => setLanguage('am')}
              className={`rounded-md px-2.5 py-1 transition-colors ${
                language === 'am'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              አማ
            </button>
          </div>

          <div className="hidden md:flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs text-emerald-300">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>ICE NY • ECX • NBE FX Online</span>
          </div>
        </div>
      </header>

      {/* Main Login Workspace */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left / Top Info Column (Brand & Value Proposition) */}
          <div className="lg:col-span-5 flex flex-col justify-between rounded-2xl border border-stone-800/90 bg-stone-900/60 p-6 sm:p-8 backdrop-blur-md">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/40 px-3 py-1 text-xs font-medium text-amber-300 mb-6">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>{t.loginBadge}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-100 mb-3">
                {t.loginTitle}
              </h2>
              <p className="text-sm text-stone-300 leading-relaxed mb-6">
                {t.loginSubtitle}
              </p>

              {/* Institutional feature bullets */}
              <div className="space-y-4 pt-4 border-t border-stone-800/80">
                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-200">
                      {language === 'am' ? 'ባለብዙ-ገበያ የቀጥታ ንፅፅር' : 'Real-Time Multi-Exchange Arbitrage'}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {language === 'am'
                        ? 'የአይሲኢ ኒው ዮርክ (ICE NY)፣ የለንደን ሮቡስታ እና የኢትዮጵያ ምርት ገበያ (ECX) የቀጥታ ዋጋ'
                        : 'Live synchronized ICE Arabica, Robusta & ECX floor differentials.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    <Cpu className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-200">
                      {language === 'am' ? 'የ AI የዋጋ ትንበያ እና 10 የገበያ ምሰሶዎች' : '10-Pillar Intelligence & AI Forecast'}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {language === 'am'
                        ? 'በጄሚኒ 3.8 የሚሰራ የ28 ቀናት የዋጋ ትንበያ እና የክስተት ተፅዕኖ ሞተር'
                        : 'Gemini 3.8 predictive cone with automated Pro/Con risk evaluation.'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <Building2 className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-semibold text-stone-200">
                      {language === 'am' ? 'የ EUDR እና የወጪ ንግድ ካልኩሌተር' : 'EUDR Compliance & Parity Engine'}
                    </h3>
                    <p className="text-xs text-stone-400 mt-0.5">
                      {language === 'am'
                        ? 'የጅቡቲ ወደብ ጭነት፣ የትይዩ ምንዛሪ ስጋት እና የአውሮፓ ደንብ ተገዢነት'
                        : 'FOB Djibouti spread, container freight & official NBE FX parity calculations.'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Market Mini-Ticker */}
            <div className="mt-8 pt-4 border-t border-stone-800/80">
              <div className="text-[11px] uppercase tracking-wider text-stone-400 mb-2 font-mono">
                {language === 'am' ? 'የቀጥታ ገበያ ፍንጭ' : 'Live Benchmark Feeds'}
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-stone-950/70 p-2.5 border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">ICE NY Arabica</span>
                  <span className="text-amber-400 font-bold font-mono text-sm">384.25¢/lb</span>
                </div>
                <div className="rounded-lg bg-stone-950/70 p-2.5 border border-stone-800">
                  <span className="text-stone-400 block text-[10px]">Yirgacheffe G1 ECX</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">$4.75/lb</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (Login Form & Demo Personas) */}
          <div className="lg:col-span-7 flex flex-col justify-between rounded-2xl border border-stone-800 bg-stone-900/90 p-6 sm:p-8 backdrop-blur-md shadow-2xl">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-stone-100">
                    {t.loginBtn}
                  </h3>
                  <p className="text-xs text-stone-400 mt-0.5">
                    {t.loginDemoHint}
                  </p>
                </div>

                {/* Instant Demo Shortcut */}
                <button
                  id="instant-demo-shortcut-btn"
                  type="button"
                  onClick={handleInstantDemo}
                  className="flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 text-xs font-bold text-stone-950 shadow-md shadow-amber-900/30 hover:from-amber-400 hover:to-amber-500 transition-all cursor-pointer"
                  title="Direct 1-click login as Senior Exporter"
                >
                  <Zap className="h-3.5 w-3.5 fill-stone-950" />
                  <span>{t.loginInstantDemo}</span>
                </button>
              </div>

              {/* Error Alert */}
              {errorMessage && (
                <div
                  id="login-error-alert"
                  className="mb-5 flex items-start gap-2.5 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3.5 text-xs text-rose-300 animate-in fade-in duration-200"
                >
                  <AlertCircle className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
                  <div className="flex-1">
                    <p className="font-semibold">{errorMessage}</p>
                    <button
                      type="button"
                      onClick={() => handleSelectPersona(DEMO_ACCOUNTS[0])}
                      className="mt-1 text-amber-400 underline hover:text-amber-300 font-medium"
                    >
                      {language === 'am'
                        ? 'የመጀመሪያውን የሙከራ አካውንት ይጫኑ (demo / demo123)'
                        : 'Click here to load demo credentials (demo / demo123)'}
                    </button>
                  </div>
                </div>
              )}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Username */}
                <div>
                  <label
                    htmlFor="login-username-input"
                    className="block text-xs font-semibold text-stone-300 mb-1.5"
                  >
                    {t.loginUsername}
                  </label>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                      <User className="h-4 w-4" />
                    </div>
                    <input
                      id="login-username-input"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="e.g. demo"
                      autoComplete="username"
                      required
                      className="w-full rounded-xl border border-stone-700 bg-stone-950/80 py-2.5 pl-9 pr-3 text-sm text-stone-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label
                      htmlFor="login-password-input"
                      className="block text-xs font-semibold text-stone-300"
                    >
                      {t.loginPassword}
                    </label>
                    <span className="text-[11px] font-mono text-amber-400/80">
                      Default: demo123
                    </span>
                  </div>
                  <div className="relative">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-stone-400">
                      <Lock className="h-4 w-4" />
                    </div>
                    <input
                      id="login-password-input"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="e.g. demo123"
                      autoComplete="current-password"
                      required
                      className="w-full rounded-xl border border-stone-700 bg-stone-950/80 py-2.5 pl-9 pr-10 text-sm text-stone-100 placeholder-stone-400 focus:border-amber-500 focus:outline-none focus:ring-1 focus:ring-amber-500 transition-colors"
                    />
                    <button
                      id="toggle-password-visibility-btn"
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 flex items-center pr-3 text-stone-400 hover:text-stone-200"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Remember Me */}
                <div className="flex items-center justify-between pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-300">
                    <input
                      id="login-remember-me-checkbox"
                      type="checkbox"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-4 w-4 rounded border-stone-700 bg-stone-950 text-amber-500 focus:ring-amber-500/20 focus:ring-offset-0"
                    />
                    <span>{t.loginRememberMe}</span>
                  </label>
                  <span className="text-[11px] text-stone-400">
                    Auto-hydrates session
                  </span>
                </div>

                {/* Submit Button */}
                <button
                  id="login-submit-btn"
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 py-3 px-4 text-sm font-bold text-stone-950 shadow-lg shadow-amber-900/30 hover:from-amber-500 hover:to-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 disabled:opacity-50 transition-all cursor-pointer"
                >
                  {isLoading ? (
                    <>
                      <span className="h-4 w-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                      <span>{t.loginLoggingIn}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.loginBtn}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Demo Accounts Selector Grid */}
              <div className="mt-6 pt-5 border-t border-stone-800">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold uppercase tracking-wider text-stone-400">
                    {t.loginDemoAccounts}
                  </span>
                  <span className="text-[11px] text-amber-400 font-mono">
                    Click to auto-fill
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {DEMO_ACCOUNTS.map((account) => {
                    const isSelected = selectedPersona === account.username;
                    return (
                      <button
                        key={account.username}
                        id={`demo-user-${account.username}-btn`}
                        type="button"
                        onClick={() => handleSelectPersona(account)}
                        className={`text-left p-3 rounded-xl border transition-all ${
                          isSelected
                            ? 'border-amber-500/60 bg-amber-950/20 shadow-xs ring-1 ring-amber-500/40'
                            : 'border-stone-800 bg-stone-950/60 hover:border-stone-700 hover:bg-stone-950'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-stone-100">
                            {account.fullName}
                          </span>
                          <span
                            className={`text-[10px] px-1.5 py-0.2 rounded-md font-semibold ${
                              account.badgeColor === 'amber'
                                ? 'bg-amber-500/20 text-amber-300'
                                : account.badgeColor === 'emerald'
                                ? 'bg-emerald-500/20 text-emerald-300'
                                : account.badgeColor === 'blue'
                                ? 'bg-blue-500/20 text-blue-300'
                                : 'bg-purple-500/20 text-purple-300'
                            }`}
                          >
                            {language === 'am' ? account.roleAm : account.role}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-400 truncate mb-1">
                          {language === 'am' ? account.organizationAm : account.organization}
                        </div>
                        <div className="flex items-center justify-between text-[10px] font-mono text-stone-400">
                          <span>user: <strong className="text-stone-300">{account.username}</strong></span>
                          <span>pass: <strong className="text-stone-300">{account.password}</strong></span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Bottom Demo Banner */}
            <div className="mt-6 pt-4 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                <span>ECTA Security Gateway • 256-bit TLS</span>
              </span>
              <span>v3.8 Multi-Exchange Engine</span>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-3 px-4 sm:px-8 text-center text-xs text-stone-400">
        <p>
          {t.demoNotice}
        </p>
      </footer>
    </div>
  );
};
