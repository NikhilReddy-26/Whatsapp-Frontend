import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Send, Bot, User, CheckCheck, RefreshCw, Sparkles, MapPin, PhoneCall, ExternalLink, Factory, Warehouse, Building2, Snowflake, Home, Car, FlaskConical, Layers } from 'lucide-react';
import { Lead, Message } from '../types/crm';
import { AnimatedText } from './ui/AnimatedText';
import { perspectiveCardIn } from '../lib/motion';

interface WhatsAppSimulatorViewProps {
  leads: Lead[];
  activeLead: Lead | null;
  messages: Message[];
  onSimulateCustomerMessage: (leadId: string, text: string) => void;
  onSelectLead: (leadId: string) => void;
}

export const WhatsAppSimulatorView: React.FC<WhatsAppSimulatorViewProps> = ({
  leads,
  activeLead,
  messages,
  onSimulateCustomerMessage,
  onSelectLead,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const selectedLead = activeLead || leads[0];
  const [custInput, setCustInput] = useState('');
  const [isSending, setIsSending] = useState(false);

  const presetMessages = [
    '🏭 Factory: Namaskara, namg 15,000 sq ft epoxy coating bekagide for CNC factory floor in Hosur',
    '🧪 Cleanroom: We need WHO-GMP compliant antibacterial cleanroom PU floor for pharma unit in Peenya',
    '📦 Warehouse: What is the rate for 40,000 sq ft logistics warehouse concrete dust-proofing hardener?',
    '🏢 Commercial Terrace: We have rain water leakage in our 8,000 sq ft commercial terrace in Whitefield',
    '❄️ Cold Storage: Need -25°C thermal shock resistant polyurethane screed for seafood cold storage plant',
    '🚗 Auto Workshop: Setting up automobile workshop bay and service station 12,000 sq ft with oil resistance',
    '🏠 Household Paint: House bedroom paint ideya and RCB cricket match ticket ideya sir?'
  ];

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || !selectedLead) return;
    setIsSending(true);
    await onSimulateCustomerMessage(selectedLead.id, textToSend);
    setCustInput('');
    setIsSending(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* HEADER */}
      <motion.div
        variants={perspectiveCardIn}
        initial={shouldReduceMotion ? undefined : 'initial'}
        animate="animate"
        className="bg-brand-panel border border-brand-border rounded-[18px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-elevation-1"
      >
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4" />
            <span>Interactive Testing Environment</span>
          </div>
          <AnimatedText
            text="WhatsApp AI Engine Simulator"
            as="h2"
            className="text-2xl font-black text-brand-text"
          />
          <p className="text-xs text-brand-muted mt-1">
            Simulate sending WhatsApp messages as a customer. Watch the AI Qualification Engine calculate score, extract technical fields, and update the CRM live!
          </p>
        </div>

        {/* Lead Selector Dropdown */}
        <div className="flex items-center space-x-2 bg-brand-body p-2 rounded-xl border border-brand-border text-xs">
          <span className="font-semibold text-brand-muted">Simulate As:</span>
          <select
            value={selectedLead?.id || ''}
            onChange={(e) => onSelectLead(e.target.value)}
            className="bg-[#101823] text-brand-text font-bold border border-brand-border rounded px-2.5 py-1 focus:outline-none focus:border-cp-navy"
          >
            {leads.map((l) => (
              <option key={l.id} value={l.id}>
                {l.name} ({l.company}) - {l.funnel} ({l.score} pts)
              </option>
            ))}
          </select>
        </div>
      </motion.div>

      {/* TWO COLUMN SIMULATOR LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT 7 COLS: WHATSAPP MOBILE PHONE UI */}
        <motion.div
          variants={perspectiveCardIn}
          initial={shouldReduceMotion ? undefined : 'initial'}
          animate="animate"
          className="lg:col-span-7 bg-[#0b141a] border border-[#202c33] rounded-[24px] overflow-hidden flex flex-col h-[650px] shadow-2xl relative"
        >
          
          {/* FAKE WHATSAPP TOP BAR */}
          <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between text-white border-b border-[#2a3942]">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-full bg-[#00a884] flex items-center justify-center font-bold text-sm text-white">
                {selectedLead?.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-sm text-stone-100">{selectedLead?.name}</h3>
                <p className="text-[11px] text-stone-400">
                  ColourPlus Official WhatsApp Business • {selectedLead?.whatsapp_number}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <span className="px-2 py-0.5 rounded bg-[#00a884]/20 text-[#00a884] font-semibold border border-[#00a884]/40">
                Connected
              </span>
            </div>
          </div>

          {/* CHAT MESSAGES WINDOW */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-[#0b141a]">
            {messages.map((m) => {
              if (m.type === 'system_note') {
                return (
                  <div key={m.id} className="text-center my-2">
                    <span className="bg-[#182229] text-stone-300 text-[11px] px-3 py-1 rounded-lg border border-[#222d34]">
                      {m.text}
                    </span>
                  </div>
                );
              }

              const isCust = m.sender === 'customer';

              return (
                <div
                  key={m.id}
                  className={`flex flex-col ${isCust ? 'items-end' : 'items-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-xl text-xs leading-relaxed ${
                      isCust
                        ? 'bg-[#005c4b] text-stone-100 rounded-tr-none'
                        : 'bg-[#202c33] text-stone-200 rounded-tl-none'
                    }`}
                  >
                    <div className="font-semibold text-[10px] text-stone-400 mb-0.5">
                      {isCust ? 'You (Customer)' : m.sender === 'ai' ? 'ColourPlus AI Bot' : 'Human Agent'}
                    </div>
                    {m.text}
                    <div className="text-[10px] text-stone-400 text-right mt-1">
                      {m.timestamp}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* PRESET PROMPTS CHIPS */}
          <div className="p-2 bg-[#182229] border-t border-[#222d34] flex items-center gap-1.5 overflow-x-auto no-scrollbar">
            <span className="text-[10px] text-stone-400 font-bold uppercase flex-shrink-0 px-2">
              Presets:
            </span>
            {presetMessages.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSend(p)}
                className="whitespace-nowrap bg-[#202c33] hover:bg-[#2a3942] text-stone-300 text-[11px] px-2.5 py-1 rounded-full border border-[#2a3942] transition"
              >
                {p.slice(0, 32)}...
              </button>
            ))}
          </div>

          {/* CUSTOMER INPUT BAR */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(custInput);
            }}
            className="p-3 bg-[#202c33] flex items-center space-x-2"
          >
            <input
              type="text"
              placeholder="Type a message as Customer (e.g. 'site Hosur alli ide')..."
              value={custInput}
              onChange={(e) => setCustInput(e.target.value)}
              className="flex-1 bg-[#2a3942] text-white placeholder-stone-400 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:ring-1 focus:ring-[#00a884]"
            />
            <button
              type="submit"
              disabled={isSending || !custInput.trim()}
              className="bg-[#00a884] hover:bg-[#008f6f] text-white p-2.5 rounded-xl transition flex items-center justify-center font-bold"
            >
              {isSending ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </button>
          </form>
        </motion.div>

        {/* RIGHT 5 COLS: LIVE CRM ENGINE DIAGNOSTICS */}
        <motion.div
          variants={perspectiveCardIn}
          initial={shouldReduceMotion ? undefined : 'initial'}
          animate="animate"
          transition={{ delay: 0.1 }}
          className="lg:col-span-5 bg-brand-panel border border-brand-border rounded-[24px] p-5 space-y-4 h-[650px] overflow-y-auto shadow-elevation-1"
        >
          <div className="flex items-center justify-between border-b border-brand-border pb-3">
            <h3 className="font-bold text-sm text-brand-text flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-blue-400" />
              Live CRM Scoring Diagnostics
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold border border-emerald-500/30">
              Active Sync
            </span>
          </div>

          {selectedLead && (
            <div className="space-y-4 text-xs">
              <div className="bg-brand-body p-3.5 rounded-xl border border-brand-border space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-white">{selectedLead.name}</span>
                  <span className="text-xs font-black text-cp-red bg-funnel-hotBg px-2 py-0.5 rounded border border-funnel-hotBorder">
                    Score: {selectedLead.score}/100
                  </span>
                </div>
                <p className="text-brand-muted text-[11px]">
                  Funnel Status: <strong className="text-brand-text">{selectedLead.funnel}</strong>
                </p>
                <p className="text-brand-text text-[11px] italic">
                  "{selectedLead.reason}"
                </p>
              </div>

              {/* LIVE FLOORING AREA CLASSIFICATION (EXTRACTED FROM CHAT) */}
              <div className="bg-[#0b131f] p-3.5 rounded-xl border border-blue-500/30 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                    <Factory className="w-3.5 h-3.5 text-amber-400" />
                    <span>Flooring Area Categorization</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-white">
                    {selectedLead.flooring_category || 'Industrial Sector'}
                  </span>
                  {selectedLead.flooring_area?.confidence && (
                    <span className="text-xs text-emerald-400 font-mono font-bold">
                      {(selectedLead.flooring_area.confidence * 100).toFixed(0)}% Confidence
                    </span>
                  )}
                </div>
                {selectedLead.flooring_area?.sub_type && (
                  <p className="text-[11px] text-slate-300">
                    <strong className="text-slate-400">Facility Type:</strong> {selectedLead.flooring_area.sub_type}
                  </p>
                )}
                {selectedLead.flooring_area?.source_message && (
                  <div className="bg-[#0a1018] p-2 rounded-lg border border-[#1f2d3f] text-[11px] text-slate-300 italic">
                    💬 "{selectedLead.flooring_area.source_message}"
                  </div>
                )}
              </div>

              {/* Extracted Fields */}
              <div className="space-y-2">
                <h4 className="font-bold text-brand-muted uppercase text-[10px] tracking-wider">
                  Extracted Fields ({selectedLead.fields.length})
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {selectedLead.fields.map((f, i) => (
                    <div key={i} className="bg-brand-body p-2 rounded border border-brand-border flex items-center justify-between">
                      <span className="font-semibold text-brand-muted">{f.key}:</span>
                      <span className="font-bold text-brand-text">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Rules explanation */}
              <div className="bg-blue-950/20 border border-blue-500/30 rounded-xl p-3 text-blue-300 text-[11px] leading-relaxed">
                💡 <strong>How AI Engine Works:</strong> Every inbound customer message is evaluated by ColourPlus NLP for B2B substrate compatibility, area in sq ft, location pin, urgency, and WHO-GMP compliance. Scores adjust dynamically in real time!
              </div>
            </div>
          )}
        </motion.div>

      </div>
    </div>
  );
};
