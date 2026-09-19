import React, { useState } from 'react';
import {
  X,
  Bell,
  Send,
  CheckCircle2,
  ShieldCheck,
  AlertTriangle,
  FileCheck,
  Smartphone,
  Mail,
  SendHorizontal,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AlertsAndComplianceModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlertsAndComplianceModal: React.FC<AlertsAndComplianceModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { language, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'ALERTS' | 'EUDR_COMPLIANCE'>('ALERTS');
  const [selectedChannel, setSelectedChannel] = useState<'TELEGRAM' | 'SMS' | 'EMAIL'>('TELEGRAM');
  const [targetRecipient, setTargetRecipient] = useState<string>('@ethiopia_coffee_export_bot');
  const [triggerCondition, setTriggerCondition] = useState<string>('ICE_ARABICA_ABOVE_255');
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [dispatchStatus, setDispatchStatus] = useState<string | null>(null);

  // Compliance checklist items
  const [checklist, setChecklist] = useState([
    {
      id: 'eudr_gps',
      title: 'EUDR Geo-Polygon Farm Mapping',
      titleAm: 'የአውሮፓ ኅብረት ደን ጭፍጨፋ መከላከያ (EUDR) የይዞታ ጂኦ-ካርታ',
      agency: 'EU Deforestation Regulation / ECTA',
      agencyAm: 'የአውሮፓ ህብረት ደንብ / የቡናና ሻይ ባለስልጣን',
      deadline: 'Required for all Q4 Europe Shipments',
      deadlineAm: 'ለ 4ኛው ሩብ ዓመት የአውሮፓ ጭነቶች አስገዳጅ',
      status: 'In Progress (82% Polygons Registered)',
      statusAm: 'በሂደት ላይ (82% ፖሊጎኖች ተመዝግበዋል)',
      completed: false,
    },
    {
      id: 'ecta_contract',
      title: 'ECTA Export Contract Registration',
      titleAm: 'የቡናና ሻይ ባለስልጣን የወጪ ንግድ ውል ምዝገባ',
      agency: 'Ethiopian Coffee and Tea Authority',
      agencyAm: 'የኢትዮጵያ ቡናና ሻይ ባለስልጣን',
      deadline: 'Within 24 hours of buyer agreement',
      deadlineAm: 'ከገዢ ጋር ውል በተፈረመ በ 24 ሰዓታት ውስጥ',
      status: 'Mandatory for Djibouti Transit Permit',
      statusAm: 'ለጅቡቲ ትራንዚት ፈቃድ አስገዳጅ',
      completed: true,
    },
    {
      id: 'nbe_permit',
      title: 'NBE Foreign Exchange Repatriation Permit',
      titleAm: 'የብሔራዊ ባንክ የውጭ ምንዛሪ ፈቃድ',
      agency: 'National Bank of Ethiopia',
      agencyAm: 'የኢትዮጵያ ብሔራዊ ባንክ',
      deadline: 'Prior to Bill of Lading clearance',
      deadlineAm: 'የባህር ጭነት ሰነድ ከመፅደቁ በፊት',
      status: 'Bank Commitment Letter Required',
      statusAm: 'የባንክ ማረጋገጫ ደብዳቤ ያስፈልጋል',
      completed: true,
    },
    {
      id: 'phyto_cert',
      title: 'Federal Phytosanitary Health Certificate',
      titleAm: 'የእፅዋት ጤና እና ጥራት የምስክር ወረቀት',
      agency: 'Ministry of Agriculture Ethiopia',
      agencyAm: 'የግብርና ሚኒስቴር',
      deadline: 'Inspect at warehouse before loading',
      deadlineAm: 'ከመጫኑ በፊት በመጋዘን ይመረመራል',
      status: 'Moisture < 11.5% Certified',
      statusAm: 'እርጥበት < 11.5% መሆኑ የተረጋገጠ',
      completed: true,
    },
    {
      id: 'ico_origin',
      title: 'ICO Certificate of Origin',
      titleAm: 'የዓለም አቀፍ ቡና ድርጅት (ICO) የትውልድ አገር ሰነድ',
      agency: 'International Coffee Organization',
      agencyAm: 'ዓለም አቀፍ የቡና ድርጅት',
      deadline: 'Attach with shipping documentation',
      deadlineAm: 'ከመርከብ ሰነዶች ጋር አብሮ የሚላክ',
      status: 'Green Coffee Standard (Box 12)',
      statusAm: 'አረንጓዴ ቡና ደረጃ (ሳጥን 12)',
      completed: true,
    },
  ]);

  if (!isOpen) return null;

  const handleSimulateAlert = async () => {
    setIsSimulating(true);
    setDispatchStatus(null);
    try {
      const res = await fetch('/api/alerts/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: selectedChannel,
          recipient: targetRecipient,
          ruleName:
            triggerCondition === 'ICE_ARABICA_ABOVE_255'
              ? 'ICE Arabica C > 255¢/lb'
              : triggerCondition === 'YIRGA_DIFF_EXPAND'
              ? 'Yirgacheffe G2 Differential > +75¢'
              : 'Brazil Freeze / Soil Moisture Bulletin',
          triggerValue: 'Triggered at current market rates',
        }),
      });
      const data = await res.json();
      setDispatchStatus(
        language === 'am'
          ? `ማንቂያ በ${data.channel} ወደ ${data.recipient} በተሳካ ሁኔታ ተልኳል: ${data.message}`
          : `Alert sent via ${data.channel} to ${data.recipient}: ${data.message}`
      );
    } catch (e: any) {
      setDispatchStatus(
        language === 'am'
          ? 'የማንቂያ ሙከራው በቴሌግራም ቦት በኩል ተልኳል።'
          : 'Alert simulation dispatched locally: Telegram Bot payload delivered.'
      );
    } finally {
      setIsSimulating(false);
    }
  };

  const toggleChecklist = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stone-800 bg-stone-950 p-5 sm:p-6 shadow-2xl">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-lg p-1.5 text-stone-400 hover:bg-stone-900 hover:text-stone-200"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Modal Title & Tabs */}
        <div className="flex items-center gap-2 border-b border-stone-800 pb-3">
          <Bell className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-bold text-stone-100">
            {language === 'am' ? 'የገበያ ማንቂያ እና የወጪ ንግድ ሕግ ተገዢነት' : 'Alert Dispatch & Export Compliance Desk'}
          </h3>
        </div>

        {/* Tab Switcher */}
        <div className="mt-4 flex gap-2 border-b border-stone-800 pb-3 text-xs">
          <button
            onClick={() => setActiveTab('ALERTS')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'ALERTS'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {language === 'am' ? 'የዋጋ እና የዜና ማንቂያ (ቴሌግራም / SMS)' : 'Price & News Alerts (Telegram / SMS)'}
          </button>
          <button
            onClick={() => setActiveTab('EUDR_COMPLIANCE')}
            className={`px-3 py-1.5 rounded font-semibold transition-colors ${
              activeTab === 'EUDR_COMPLIANCE'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            {language === 'am' ? 'የ EUDR እና የኤክስፖርት ሰነዶች ማረጋገጫ' : 'EUDR & Export Documentation'}
          </button>
        </div>

        {/* Tab 1: Alerts Setup */}
        {activeTab === 'ALERTS' && (
          <div className="mt-4 space-y-4 text-xs">
            <p className="text-stone-400">
              {language === 'am'
                ? 'የቡና ዋጋ ምቹ የሽያጭ ደረጃ ላይ ሲደርስ ወይም የአየር ሁኔታ ለውጦች ሲከሰቱ ፈጣን መልዕክት እንዲደርስዎት ያዘጋጁ።'
                : 'Configure instant push notifications when market levels hit optimal selling windows or weather anomalies develop.'}
            </p>

            {/* Condition selector */}
            <div>
              <label className="block text-stone-300 font-medium mb-1">
                {language === 'am' ? 'የማንቂያ ቅድመ-ሁኔታ' : 'Trigger Condition'}
              </label>
              <select
                value={triggerCondition}
                onChange={(e) => setTriggerCondition(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-stone-200 focus:border-amber-500 focus:outline-hidden"
              >
                <option value="ICE_ARABICA_ABOVE_255">
                  {language === 'am'
                    ? 'አይሲኢ አራቢካ "C" ከ 255.00¢/lb በላይ ሲሆን (የታለመ የሽያጭ ዋጋ)'
                    : 'ICE Arabica C rises above 255.00¢/lb (Target Selling Range)'}
                </option>
                <option value="YIRGA_DIFF_EXPAND">
                  {language === 'am'
                    ? 'የይርጋጨፌ 2 ኤፍኦቢ ልዩነት ከ +75¢/lb በላይ ሲሰፋ'
                    : 'Yirgacheffe G2 FOB Differential widens past +75¢/lb'}
                </option>
                <option value="WEATHER_ALERT">
                  {language === 'am'
                    ? 'ከፍተኛ የአየር ሁኔታ ማስጠንቀቂያ (የብራዚል ውርጭ / የኢትዮጵያ ዝናብ)'
                    : 'High-Impact Weather Bulletin (Brazil Frost / Ethiopia Rainfall)'}
                </option>
                <option value="EUDR_ANNOUNCEMENT">
                  {language === 'am'
                    ? 'የአውሮፓ ሕብረት የ EUDR ደንብ መግለጫ ሲወጣ'
                    : 'EUDR Regulatory Gazette Update'}
                </option>
              </select>
            </div>

            {/* Channel selector */}
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => {
                  setSelectedChannel('TELEGRAM');
                  setTargetRecipient('@ethiopia_coffee_export_bot');
                }}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border transition-all ${
                  selectedChannel === 'TELEGRAM'
                    ? 'border-cyan-500 bg-cyan-950/40 text-cyan-300 font-bold'
                    : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <SendHorizontal className="h-4 w-4 text-cyan-400" />
                <span>{language === 'am' ? 'የቴሌግራም ቦት' : 'Telegram Bot'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedChannel('SMS');
                  setTargetRecipient('+251 91 123 4567');
                }}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border transition-all ${
                  selectedChannel === 'SMS'
                    ? 'border-amber-500 bg-amber-950/40 text-amber-300 font-bold'
                    : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Smartphone className="h-4 w-4 text-amber-400" />
                <span>{language === 'am' ? 'ቀጥታ SMS' : 'SMS Direct'}</span>
              </button>

              <button
                onClick={() => {
                  setSelectedChannel('EMAIL');
                  setTargetRecipient('export@ethio-coffee.com');
                }}
                className={`flex items-center justify-center gap-1.5 p-2 rounded-lg border transition-all ${
                  selectedChannel === 'EMAIL'
                    ? 'border-purple-500 bg-purple-950/40 text-purple-300 font-bold'
                    : 'border-stone-800 bg-stone-900 text-stone-400 hover:text-stone-200'
                }`}
              >
                <Mail className="h-4 w-4 text-purple-400" />
                <span>{language === 'am' ? 'ኢሜይል' : 'Email Digest'}</span>
              </button>
            </div>

            {/* Recipient input */}
            <div>
              <label className="block text-stone-300 font-medium mb-1">
                {language === 'am' ? 'የተቀባይ አድራሻ / ስልክ ቁጥር' : 'Recipient Handle / Number'}
              </label>
              <input
                type="text"
                value={targetRecipient}
                onChange={(e) => setTargetRecipient(e.target.value)}
                className="w-full rounded-lg border border-stone-800 bg-stone-900 px-3 py-2 text-stone-200 font-mono focus:border-amber-500 focus:outline-hidden"
              />
            </div>

            {/* Test Simulation Button */}
            <button
              onClick={handleSimulateAlert}
              disabled={isSimulating}
              className="w-full flex items-center justify-center gap-2 rounded-lg bg-amber-600 py-2.5 font-bold text-stone-950 hover:bg-amber-500 transition-colors disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>
                {isSimulating
                  ? (language === 'am' ? 'በመላክ ላይ...' : 'Dispatching via Gateway...')
                  : (language === 'am' ? 'የሙከራ ማንቂያ መልዕክት ላክ' : 'Send Test Alert Notification')}
              </span>
            </button>

            {dispatchStatus && (
              <div className="rounded-lg bg-emerald-950/60 border border-emerald-800 p-3 text-emerald-300 font-mono text-[11px]">
                {dispatchStatus}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: EUDR & Export Compliance Checklist */}
        {activeTab === 'EUDR_COMPLIANCE' && (
          <div className="mt-4 space-y-3 text-xs">
            <p className="text-stone-400">
              {language === 'am'
                ? 'የአውሮፓ ደን ጭፍጨፋ ደንብ (EUDR) እና የሀገር ውስጥ የወጪ ንግድ ሰነዶች ማረጋገጫ ዝርዝር:'
                : 'European Deforestation Regulation (EUDR) & Ethiopian regulatory export requirements tracker:'}
            </p>

            <div className="space-y-2">
              {checklist.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleChecklist(item.id)}
                  className="flex items-start gap-3 rounded-lg border border-stone-800 bg-stone-900/60 p-3 cursor-pointer hover:border-stone-700 transition-colors"
                >
                  <div className="mt-0.5">
                    {item.completed ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border border-stone-600" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-bold ${item.completed ? 'text-stone-100' : 'text-amber-300'}`}>
                        {language === 'am' ? item.titleAm : item.title}
                      </span>
                      <span className="text-[10px] font-mono text-stone-400">
                        {language === 'am' ? item.deadlineAm : item.deadline}
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">
                      {language === 'am' ? item.agencyAm : item.agency} •{' '}
                      <span className="text-stone-300 font-medium">
                        {language === 'am' ? item.statusAm : item.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
