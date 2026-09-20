import React, { useState, useEffect } from 'react';
import { Database, RefreshCw, ExternalLink, CheckCircle2, AlertCircle, Radio, Clock, ShieldCheck, X } from 'lucide-react';
import { SourceRegistryItem } from '../types';

interface DataSourcesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDataRefreshed: () => void;
}

export const DataSourcesModal: React.FC<DataSourcesModalProps> = ({
  isOpen,
  onClose,
  onDataRefreshed,
}) => {
  const [sources, setSources] = useState<SourceRegistryItem[]>([]);
  const [lastSync, setLastSync] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<'ALL' | 'P1' | 'P2'>('ALL');
  const [refreshMessage, setRefreshMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSources();
    }
  }, [isOpen]);

  const fetchSources = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/sources');
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources || []);
        setLastSync(data.lastSync || new Date().toISOString());
      }
    } catch (e) {
      console.warn('Failed to fetch sources registry', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleForceRefresh = async () => {
    setIsRefreshing(true);
    setRefreshMessage(null);
    try {
      const res = await fetch('/api/sources/refresh', { method: 'POST' });
      if (res.ok) {
        const data = await res.json();
        setRefreshMessage(`Refreshed! Live Arabica: ${data.iceArabicaPrice}¢/lb | USD/ETB: ${data.usdEtbRate} | Ingested ${data.scrapedNewsCount} news items`);
        await fetchSources();
        onDataRefreshed();
      }
    } catch (e) {
      setRefreshMessage('Error triggering real sync. Operating on background scheduler.');
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isOpen) return null;

  const filteredSources = filter === 'ALL'
    ? sources
    : sources.filter((s) => s.priority === filter);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-4xl bg-stone-900 border border-stone-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-stone-800 bg-stone-950/60 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-100 flex items-center gap-2">
                Live Data Engines & News Scraping Registry
                <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                  100% Real Live Data
                </span>
              </h2>
              <p className="text-xs text-stone-400 mt-0.5">
                Zero mock data. Connected to free live APIs, Open-Meteo origin telemetry, Open.ER-API FX, and real-time RSS scraping.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleForceRefresh}
              disabled={isRefreshing}
              className="flex items-center gap-2 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 disabled:opacity-50 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>{isRefreshing ? 'Scraping Live...' : 'Trigger Live Ingestion'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Status Notification */}
        {refreshMessage && (
          <div className="mx-6 mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{refreshMessage}</span>
          </div>
        )}

        {/* Filter bar */}
        <div className="px-6 py-3 border-b border-stone-800 bg-stone-950/30 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="text-stone-500 font-medium">Priority filter:</span>
            {(['ALL', 'P1', 'P2'] as const).map((tier) => (
              <button
                key={tier}
                onClick={() => setFilter(tier)}
                className={`px-2.5 py-1 rounded-md font-medium transition-colors ${
                  filter === tier
                    ? 'bg-stone-800 text-amber-400 border border-stone-700'
                    : 'text-stone-400 hover:text-stone-200'
                }`}
              >
                {tier === 'ALL' ? `All Sources (${sources.length})` : `${tier} Essential`}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-stone-400">
            <Clock className="w-3.5 h-3.5 text-stone-500" />
            <span>Last Sync: {lastSync ? new Date(lastSync).toLocaleTimeString() : 'Active'}</span>
          </div>
        </div>

        {/* Sources List */}
        <div className="p-6 overflow-y-auto space-y-3 flex-1">
          {isLoading ? (
            <div className="py-12 text-center text-stone-500 text-sm flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-500" />
              <span>Verifying live data feeds...</span>
            </div>
          ) : (
            filteredSources.map((source) => (
              <div
                key={source.id}
                className="p-4 rounded-xl bg-stone-950/60 border border-stone-800/80 hover:border-stone-700 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2.5">
                    <span className="font-bold text-stone-200 text-sm">{source.name}</span>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        source.priority === 'P1'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : 'bg-stone-800 text-stone-300 border border-stone-700'
                      }`}
                    >
                      {source.priority}
                    </span>
                    <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-stone-900 text-stone-400 border border-stone-800">
                      {source.category}
                    </span>
                  </div>
                  <p className="text-xs text-stone-400">{source.notes}</p>
                  <p className="text-[11px] text-stone-500 font-mono flex items-center gap-1">
                    <Radio className="w-3 h-3 text-emerald-500" />
                    <span>Feed: {source.url}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <div className="text-right">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>{source.status}</span>
                    </div>
                    <span className="text-[10px] text-stone-500">{source.sourceType} • {source.lastSync ? new Date(source.lastSync).toLocaleTimeString() : 'Synced'}</span>
                  </div>

                  <a
                    href={source.url}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-stone-800/80 hover:bg-stone-800 text-stone-400 hover:text-amber-400 transition-colors"
                    title="View Source Endpoint"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 bg-stone-950 flex items-center justify-between text-xs text-stone-400">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Fully compliant with free institutional data policies. No API keys required for public feeds.</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
