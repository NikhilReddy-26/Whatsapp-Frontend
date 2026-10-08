import React, { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, MapPin, ExternalLink, Zap } from 'lucide-react';
import type { Lead, Message, ExtractedChip } from '../types/crm';

interface ChatPanelProps {
  lead: Lead | null;
  messages: Message[];
  onSendMessage: (text: string) => void;
  onToggleAi: (aiActive: boolean) => void;
  onOpenConfirmVisit: () => void;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  lead,
  messages,
  onSendMessage,
  onToggleAi,
  onOpenConfirmVisit,
}) => {
  const [inputText, setInputText] = useState('');
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!lead) {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl flex items-center justify-center h-[760px] text-slate-400 text-sm font-medium shadow-xs">
        Select a lead from the inbox to view WhatsApp conversation.
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    onSendMessage(inputText);
    setInputText('');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .substring(0, 2)
      .toUpperCase();
  };

  const quickSuggestions = [
    'Ask for site area in sq ft',
    'Propose site inspection on Wednesday',
    'Send PU Coating TDS Catalog',
  ];

  return (
    <div className="bg-[#f8f9fa] border border-slate-200 rounded-2xl flex flex-col h-[760px] overflow-hidden shadow-xs font-sans">
      
      {/* 1. CHAT HEADER - Clean Light Styling */}
      <div className="p-3.5 sm:p-4 border-b border-slate-200 bg-white flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3 min-w-0">
          {/* Customer Avatar */}
          <div className="w-10 h-10 rounded-full bg-[#0f2d4a] border border-[#1e3a5f] flex items-center justify-center font-bold text-white text-sm flex-shrink-0 shadow-2xs">
            {getInitials(lead.name)}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-slate-900 truncate">{lead.name}</h2>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                WhatsApp
              </span>
            </div>
            <p className="text-xs text-slate-500 truncate mt-0.5">
              {lead.whatsapp_number} · {lead.campaign}
            </p>
          </div>
        </div>

        {/* AI Active Indicator & Take Over Toggle */}
        <div className="flex items-center space-x-3 flex-shrink-0">
          <div className="flex items-center space-x-1.5 text-xs font-medium">
            {lead.ai_active ? (
              <span className="flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>AI active</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-full">
                <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                <span>Human active</span>
              </span>
            )}
          </div>

          {lead.ai_active ? (
            <button
              onClick={() => onToggleAi(false)}
              className="bg-[#0f3f8a] hover:bg-[#154fb0] text-white text-xs font-semibold px-3.5 py-1.5 rounded-full transition shadow-2xs"
            >
              Take over
            </button>
          ) : (
            <button
              onClick={() => onToggleAi(true)}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-semibold px-3.5 py-1.5 rounded-full transition"
            >
              Hand back to AI
            </button>
          )}
        </div>
      </div>

      {/* 2. CHAT MESSAGES FEED - Light Grey Background with Exact Bubble Colors */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 bg-[#f4f5f7]">
        {messages.map((msg) => {
          // --- A) SILENTLY EXTRACTED SYSTEM CARD ---
          if (msg.type === 'system_note') {
            const chips: ExtractedChip[] = msg.extracted_chips || [
              { label: 'System Event', value: msg.text }
            ];

            return (
              <div key={msg.id} className="w-full my-2.5">
                <div className="bg-[#fffbe6] border border-[#fef08a] rounded-2xl p-3.5 shadow-2xs">
                  {/* Header Title */}
                  <div className="flex items-center gap-1.5 text-amber-700 text-[11px] font-bold tracking-wider uppercase mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                    <span>SILENTLY EXTRACTED:</span>
                  </div>

                  {/* Chips Container */}
                  <div className="flex flex-wrap gap-2 items-center">
                    {chips.map((chip, idx) => (
                      <div
                        key={idx}
                        className="bg-white border border-amber-300/80 rounded-xl px-3 py-1.5 text-xs text-slate-800 shadow-2xs font-medium flex items-center gap-1.5"
                      >
                        <span className="font-bold text-amber-900">{chip.label}:</span>
                        <span>{chip.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          }

          const isCustomer = msg.sender === 'customer';
          const isAi = msg.sender === 'ai';

          // --- B) AI MESSAGE (LEFT ALIGNED WITH GREEN AI AVATAR & WHITE BUBBLE) ---
          if (isAi) {
            return (
              <div key={msg.id} className="flex items-start gap-3 my-1.5 max-w-[92%] sm:max-w-[85%] self-start">
                {/* AI Green Circle Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#059669] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs mt-0.5">
                  AI
                </div>

                {/* White Message Bubble */}
                <div className="bg-white border border-slate-200/90 rounded-2xl rounded-tl-xs p-4 text-[#2d3748] text-[13.5px] leading-relaxed shadow-2xs w-full">
                  <p>{msg.text}</p>

                  {/* Bubble Footer: Timestamp & Pacing Delay */}
                  <div className="flex items-center justify-between text-xs mt-3 pt-1 border-t border-slate-100">
                    <span className="text-slate-400 text-[11px] font-medium">{msg.timestamp}</span>
                    <span className="text-[#059669] text-[11px] font-semibold font-mono flex items-center gap-1">
                      Pacing delay: {msg.pacing_delay || '12s'}
                    </span>
                  </div>
                </div>
              </div>
            );
          }

          // --- C) CUSTOMER MESSAGE (RIGHT ALIGNED WITH MINT GREEN BUBBLE & NAVY C AVATAR) ---
          if (isCustomer) {
            return (
              <div key={msg.id} className="flex items-start justify-end gap-3 my-1.5 ml-auto max-w-[92%] sm:max-w-[85%] self-end">
                {/* Mint Green Message Bubble */}
                <div className="bg-[#dcfce7] border border-[#bbf7d0] rounded-2xl rounded-tr-xs p-4 text-[#1e293b] text-[13.5px] leading-relaxed shadow-2xs w-full">
                  <p>{msg.text}</p>

                  {/* Google Maps Location Preview Card if Location Message */}
                  {msg.type === 'location' && msg.location_data && (
                    <div className="mt-2.5 pt-2.5 border-t border-emerald-300/40 bg-emerald-100/50 rounded-xl p-2.5">
                      <div className="flex items-start space-x-2">
                        <div className="p-1.5 bg-red-500/10 text-red-600 rounded-lg">
                          <MapPin className="w-4 h-4" />
                        </div>
                        <div className="flex-1 text-xs">
                          <span className="font-bold block text-slate-900">{msg.location_data.name}</span>
                          <span className="text-slate-600 block text-[11px] mt-0.5">{msg.location_data.address}</span>
                          <a
                            href={msg.location_data.maps_url}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-800 hover:underline mt-1.5"
                          >
                            Open in Google Maps <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Bubble Footer: Timestamp */}
                  <div className="text-slate-500 text-[11px] font-medium mt-2 pt-0.5">
                    {msg.timestamp}
                  </div>
                </div>

                {/* Customer Navy Circle Avatar */}
                <div className="w-8 h-8 rounded-full bg-[#0f2d4a] text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs mt-0.5">
                  C
                </div>
              </div>
            );
          }

          // --- D) HUMAN SALES REP MESSAGE ---
          return (
            <div key={msg.id} className="flex items-start justify-end gap-3 my-1.5 ml-auto max-w-[92%] sm:max-w-[85%] self-end">
              <div className="bg-blue-50 border border-blue-200 rounded-2xl rounded-tr-xs p-4 text-[#1e293b] text-[13.5px] leading-relaxed shadow-2xs w-full">
                <p>{msg.text}</p>
                <div className="text-blue-600 text-[11px] font-medium mt-2 pt-0.5 flex items-center justify-between">
                  <span>Sales Rep</span>
                  <span>{msg.timestamp}</span>
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-2xs mt-0.5">
                SR
              </div>
            </div>
          );
        })}

        <div ref={chatBottomRef} />
      </div>

      {/* 3. QUICK SUGGESTIONS & INPUT FOOTER */}
      <div className="p-3 sm:p-3.5 border-t border-slate-200 bg-white space-y-2.5">
        {/* Quick Suggestions Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 no-scrollbar text-xs">
          <span className="text-[10px] text-slate-500 uppercase font-bold flex-shrink-0 flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-500" /> Quick Replies:
          </span>
          {quickSuggestions.map((sug, i) => (
            <button
              key={i}
              onClick={() => {
                if (sug.includes('inspection')) {
                  onOpenConfirmVisit();
                } else {
                  setInputText(sug);
                }
              }}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-[11px] font-medium transition"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={
              lead.ai_active
                ? "Type message... (Will switch to Human active mode)"
                : "Type response to customer on WhatsApp..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:border-[#0f3f8a] focus:bg-white transition"
          />
          <button
            type="submit"
            disabled={!inputText.trim()}
            className="bg-[#0f3f8a] hover:bg-[#154fb0] disabled:opacity-40 text-white p-2.5 rounded-xl transition flex items-center justify-center font-semibold"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};
