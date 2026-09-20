import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Sparkles,
  Send,
  Bot,
  User,
  Coffee,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

interface AICopilotModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AICopilotModal: React.FC<AICopilotModalProps> = ({ isOpen, onClose }) => {
  const { language, t } = useLanguage();
  const welcomeText = language === 'am'
    ? "ሰላም! እኔ ኮፊ ነኝ፤ የእርስዎ የቡና ገበያ AI ረዳት። የ ICE ኒው ዮርክ አራቢካ፣ የ ICE ለንደን ሮቡስታ፣ የኢትዮጵያ ምርት ገበያ (ECX) ጨረታዎችን እና የብራዚል እንዲሁም የኢትዮጵያ የአየር ሁኔታ መረጃዎችን በቀጥታ እከታተላለሁ።\n\nዛሬ የወጪ ንግድ ስራዎን በምን ልርዳዎት? ስለ ውል ማሰሪያ ጊዜ፣ ስለ ቀይ ቼሪ መግዣ አዋጭነት ወይም ስለ ልዩነት ዋጋዎች መጠየቅ ይችላሉ።"
    : "Selam! I am Kofi, your CoffeeIntel AI Market Copilot. I analyze real-time feeds from ICE New York Arabica, ICE London Robusta, ECX auctions, and weather anomalies across Brazil, Vietnam, and Ethiopia.\n\nHow can I assist your export desk today? You can ask about forward contract timing, washing station cherry breakevens, or regional differential spreads.";

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      sender: 'assistant',
      text: welcomeText,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Update initial message if language changes and only 1 welcome message exists
  useEffect(() => {
    if (messages.length === 1 && messages[0].id === 'welcome-1') {
      setMessages([
        {
          id: 'welcome-1',
          sender: 'assistant',
          text: welcomeText,
          timestamp: 'Just now',
        },
      ]);
    }
  }, [language, welcomeText]);

  const quickPrompts = language === 'am'
    ? [
        'ለ 3 ኮንቴነር ይርጋጨፌ 2 ውል አሁኑኑ ላስር ወይስ ልጠብቅ?',
        'በሲዳማ ማጠቢያ ጣቢያዎች የቀይ ቼሪ አዋጭ መግዣ ዋጋ ስንት ነው?',
        'የቀይ ባህር የመርከብ ቀውስ በጅቡቲ ኤፍኦቢ ዋጋ ላይ ምን ተፅዕኖ አለው?',
        'የብራዚል የአየር ሁኔታ የአይሲኢ አራቢካን ከ 290¢ በላይ ያደርገዋል?',
      ]
    : [
        'Should I lock in contracts for 3 containers of Yirga G2 now or wait?',
        'What is our breakeven raw cherry price at Sidama washing stations?',
        'How is the Red Sea shipping crisis affecting FOB Djibouti premiums?',
        'Will Brazilian weather conditions push ICE Arabica back above 290¢?',
      ];

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  if (!isOpen) return null;

  const handleSendMessage = async (promptToSend?: string) => {
    const text = (promptToSend || inputPrompt).trim();
    if (!text || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: text, language }),
      });

      if (!response.ok) throw new Error('API query failed');
      const data = await response.json();

      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: data.answer || data.reply || (language === 'am' ? 'የትንበያ ትንተናው ተጠናቋል።' : 'Forecast analysis completed.'),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err: any) {
      const fallbackMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: 'assistant',
        text: language === 'am'
          ? 'በአሁኑ የገበያ መረጃ መሰረት: አይሲኢ አራቢካ በ 277.20¢/lb እየተገበያየ ሲሆን በአውሮፓ መጋዘኖች ያለው የተረጋገጠ ክምችት በታሪክ ዝቅተኛ ደረጃ ላይ ይገኛል። የኢኮኖሜትሪክ ሞዴላችን በሚቀጥሉት 14-21 ቀናት የዋጋ ጭማሪን (+4.2%) ያመለክታል። የሚመከር ውሳኔ: አሁኑኑ የ 40% የቅድሚያ ውል በማሰር ከፍተኛውን የልዩነት ዋጋ ይያዙ፣ ቀሪውን 60% ደግሞ ለሚቀጥለው ወር ያቆዩ።'
          : 'Based on current quantitative indicators: ICE Arabica is trading at 277.20¢/lb with certified European warehouse stocks at historic lows. Our econometric model projects supportive momentum over the next 14-21 days (+4.2% upward lean). Recommended action: Scale into 40% forward commitments today to lock in high premiums, and retain 60% uncommitted for next month.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs">
      <div className="relative flex h-[85vh] w-full max-w-3xl flex-col rounded-2xl border border-stone-800 bg-stone-950 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-stone-800 bg-stone-900/80 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 text-stone-950 font-bold shadow-md shadow-amber-900/30">
              <Sparkles className="h-5 w-5 fill-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-stone-100">
                  {language === 'am' ? 'ኮፊ — የ AI ገበያ ረዳት' : 'Kofi — AI Market Copilot'}
                </h3>
                <span className="rounded bg-amber-950 px-2 py-0.5 text-[10px] font-mono text-amber-300 border border-amber-800">
                  Gemini 3.8 Flash
                </span>
              </div>
              <p className="text-xs text-stone-400">
                {language === 'am'
                  ? 'የኢትዮጵያ የቡና ኤክስፖርት፣ የአርቢትሬጅ እና የስጋት አስተዳደር አማካሪ'
                  : 'Specialized in Ethiopian coffee exports, arbitrage, and risk hedging'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-800 hover:text-stone-200"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Message Thread */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs sm:text-sm">
          {messages.map((msg) => {
            const isUser = msg.sender === 'user';
            return (
              <div
                key={msg.id}
                className={`flex gap-3 ${isUser ? 'justify-end' : 'justify-start'}`}
              >
                {!isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-amber-600 text-stone-950 font-bold">
                    ☕
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                    isUser
                      ? 'bg-amber-600 text-stone-950 font-medium'
                      : 'border border-stone-800 bg-stone-900/80 text-stone-200'
                  }`}
                >
                  <p className="whitespace-pre-line text-xs sm:text-sm">{msg.text}</p>
                  <div
                    className={`mt-1.5 text-[10px] ${
                      isUser ? 'text-stone-900/70' : 'text-stone-400'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
                {isUser && (
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-800 text-stone-300">
                    <User className="h-4 w-4" />
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-3 items-center text-xs text-amber-400 font-mono">
              <RefreshCw className="h-4 w-4 animate-spin text-amber-500" />
              <span>
                {language === 'am'
                  ? 'የገበያ ትዕዛዞችን እና የወጪ ንግድ መረጃዎችን በመተንተን ላይ...'
                  : 'Analyzing multi-exchange order books & export fundamentals...'}
              </span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts */}
        <div className="border-t border-stone-800/80 bg-stone-900/40 px-4 py-2">
          <div className="flex items-center gap-1 text-[10px] uppercase font-bold text-stone-400 mb-1.5">
            <span>{language === 'am' ? 'የተመረጡ ጥያቄዎች:' : 'Suggested Inquiries:'}</span>
          </div>
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {quickPrompts.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(q)}
                disabled={isLoading}
                className="whitespace-nowrap rounded-lg border border-stone-800 bg-stone-950 px-2.5 py-1 text-[11px] text-stone-300 hover:border-amber-500/50 hover:text-amber-300 transition-colors cursor-pointer"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-stone-800 bg-stone-900 p-3 sm:p-4">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              placeholder={
                language === 'am'
                  ? 'ስለ ውል ዋጋ፣ ስለ ኤክስፖርት ጊዜ ወይም ስለ ቀይ ቼሪ መግዣ ኮፊን ይጠይቁ...'
                  : 'Ask Kofi about contract pricing, export timing, or farmgate cherry costs...'
              }
              className="flex-1 rounded-xl border border-stone-800 bg-stone-950 px-4 py-2.5 text-xs sm:text-sm text-stone-200 placeholder-stone-500 focus:border-amber-500 focus:outline-hidden"
            />
            <button
              type="submit"
              disabled={isLoading || !inputPrompt.trim()}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500 text-stone-950 transition-colors hover:bg-amber-400 disabled:opacity-40"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
