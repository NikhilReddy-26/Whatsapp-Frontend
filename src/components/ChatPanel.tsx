import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { Send, Sparkles, MapPin, ExternalLink, Zap } from 'lucide-react';
import type { Lead, Message, ExtractedChip } from '../types/crm';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { AnimatedText } from './ui/AnimatedText';
import { messageInCustomer, messageInAgent, messageInSystem } from '../lib/motion';

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
  const shouldReduceMotion = useReducedMotion();
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  if (!lead) {
    return (
      <div className="bg-surface border border-border-subtle rounded-card flex items-center justify-center h-[760px] text-text-tertiary text-sm font-medium shadow-elevation-1">
        Select a lead from the inbox to inspect live WhatsApp conversation.
      </div>
    );
  }

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const textToSend = inputText;
    setInputText('');

    // Simulate sending with brief typing feel
    setIsTyping(true);
    setTimeout(() => {
      onSendMessage(textToSend);
      setIsTyping(false);
    }, 300);
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
    <div className="bg-surface border border-border-subtle rounded-card flex flex-col h-[760px] overflow-hidden shadow-elevation-1 font-sans transition-colors">
      
      {/* 1. CHAT HEADER */}
      <div className="p-4 border-b border-border-subtle bg-surface-subtle/80 flex items-center justify-between shadow-2xs">
        <div className="flex items-center space-x-3 min-w-0">
          {/* Customer Avatar */}
          <div className="w-10 h-10 rounded-2xl bg-brand-navy border border-white/10 flex items-center justify-center font-bold text-white text-xs flex-shrink-0 shadow-elevation-1">
            {getInitials(lead.name)}
          </div>
          <div className="truncate">
            <div className="flex items-center gap-2">
              <AnimatedText
                text={lead.name}
                as="h2"
                className="text-base font-bold text-text-primary truncate"
              />
              <span className="bg-brand-green/15 text-brand-green border border-brand-green/30 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider font-mono">
                WhatsApp
              </span>
              {lead.flooring_category && (
                <span className="hidden sm:inline-flex items-center gap-1 bg-surface border border-border-base text-text-secondary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                  <span>{lead.flooring_category}</span>
                </span>
              )}
            </div>
            <p className="text-xs text-text-tertiary truncate mt-0.5">
              {lead.whatsapp_number} · {lead.campaign}
            </p>
          </div>
        </div>

        {/* AI Active Indicator & Take Over Toggle with Cross-Fade */}
        <div className="flex items-center space-x-2.5 flex-shrink-0">
          <AnimatePresence mode="wait">
            {lead.ai_active ? (
              <motion.div
                key="ai-pill"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center"
              >
                <Badge variant="green" pulse size="xs">
                  AI Active
                </Badge>
              </motion.div>
            ) : (
              <motion.div
                key="human-pill"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="flex items-center"
              >
                <Badge variant="navy" size="xs">
                  Human Active
                </Badge>
              </motion.div>
            )}
          </AnimatePresence>

          {lead.ai_active ? (
            <Button
              variant="brand"
              size="xs"
              onClick={() => onToggleAi(false)}
              className="rounded-full"
            >
              Take over
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="xs"
              onClick={() => onToggleAi(true)}
              className="rounded-full"
            >
              Hand back
            </Button>
          )}
        </div>
      </div>

      {/* 2. CHAT MESSAGES STREAM */}
      <div ref={messagesContainerRef} className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-3.5 bg-canvas/60">
        <AnimatePresence initial={false}>
          {messages.map((msg) => {
            // A) SYSTEM EXTRACTED NOTE CARD
            if (msg.type === 'system_note') {
              const chips: ExtractedChip[] = msg.extracted_chips || [
                { label: 'System Event', value: msg.text }
              ];

              return (
                <motion.div
                  key={msg.id}
                  variants={shouldReduceMotion ? undefined : messageInSystem}
                  initial="initial"
                  animate="animate"
                  className="w-full my-2"
                >
                  <div className="bg-amber-500/10 border border-amber-500/25 rounded-2xl p-3.5 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-amber-500 dark:text-amber-400 text-[11px] font-bold tracking-wider uppercase mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{msg.text}</span>
                    </div>

                    {chips.length > 0 && (
                      <div className="flex flex-wrap gap-2 items-center">
                        {chips.map((chip, idx) => (
                          <div
                            key={idx}
                            className="bg-surface border border-border-base rounded-xl px-2.5 py-1 text-xs text-text-secondary shadow-2xs font-medium flex items-center gap-1.5"
                          >
                            <span className="font-bold text-text-primary">{chip.label}:</span>
                            <span>{chip.value}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            }

            const isCustomer = msg.sender === 'customer';
            const isAi = msg.sender === 'ai';

            // B) AI MESSAGE (LEFT ALIGNED WITH EMERALD BOT AVATAR)
            if (isAi) {
              return (
                <motion.div
                  key={msg.id}
                  variants={shouldReduceMotion ? undefined : messageInCustomer}
                  initial="initial"
                  animate="animate"
                  className="flex items-start gap-3 my-1.5 max-w-[92%] sm:max-w-[85%] self-start"
                >
                  <div className="w-8 h-8 rounded-xl bg-brand-green text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-elevation-1 mt-0.5">
                    AI
                  </div>

                  <div className="bg-surface border border-border-base rounded-2xl rounded-tl-xs p-4 text-text-primary text-[13.5px] leading-relaxed shadow-elevation-1 w-full">
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    <div className="flex items-center justify-between text-xs mt-2.5 pt-1 border-t border-border-subtle">
                      <span className="text-text-tertiary text-[11px] font-medium font-mono">{msg.timestamp}</span>
                      <span className="text-brand-green text-[11px] font-semibold font-mono flex items-center gap-1">
                        Pacing delay: {msg.pacing_delay || '8s'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            }

            // C) CUSTOMER MESSAGE (RIGHT ALIGNED WITH GREEN BUBBLE)
            if (isCustomer) {
              return (
                <motion.div
                  key={msg.id}
                  variants={shouldReduceMotion ? undefined : messageInAgent}
                  initial="initial"
                  animate="animate"
                  className="flex items-start justify-end gap-3 my-1.5 ml-auto max-w-[92%] sm:max-w-[85%] self-end"
                >
                  <div className="bg-emerald-500/15 border border-emerald-500/30 dark:bg-emerald-950/40 text-text-primary rounded-2xl rounded-tr-xs p-4 text-[13.5px] leading-relaxed shadow-elevation-1 w-full">
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* Google Maps Location Preview Card */}
                    {msg.type === 'location' && msg.location_data && (
                      <div className="mt-2.5 pt-2.5 border-t border-emerald-500/20 bg-surface/80 rounded-xl p-3">
                        <div className="flex items-start space-x-2.5">
                          <div className="p-1.5 bg-rose-500/10 text-rose-500 rounded-lg">
                            <MapPin className="w-4 h-4" />
                          </div>
                          <div className="flex-1 text-xs">
                            <span className="font-bold block text-text-primary">{msg.location_data.name}</span>
                            <span className="text-text-secondary block text-[11px] mt-0.5">{msg.location_data.address}</span>
                            <a
                              href={msg.location_data.maps_url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-green hover:underline mt-1.5"
                            >
                              Open in Google Maps <ExternalLink className="w-3 h-3" />
                            </a>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="text-text-tertiary text-[11px] font-medium font-mono mt-2 pt-0.5 text-right">
                      {msg.timestamp}
                    </div>
                  </div>

                  <div className="w-8 h-8 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-elevation-1 mt-0.5">
                    C
                  </div>
                </motion.div>
              );
            }

            // D) HUMAN SALES REP MESSAGE
            return (
              <motion.div
                key={msg.id}
                variants={shouldReduceMotion ? undefined : messageInAgent}
                initial="initial"
                animate="animate"
                className="flex items-start justify-end gap-3 my-1.5 ml-auto max-w-[92%] sm:max-w-[85%] self-end"
              >
                <div className="bg-brand-navy/15 border border-brand-navy/30 dark:bg-blue-950/40 text-text-primary rounded-2xl rounded-tr-xs p-4 text-[13.5px] leading-relaxed shadow-elevation-1 w-full">
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                  <div className="text-brand-navy dark:text-blue-300 text-[11px] font-medium font-mono mt-2 pt-0.5 flex items-center justify-between">
                    <span>Sales Representative</span>
                    <span>{msg.timestamp}</span>
                  </div>
                </div>
                <div className="w-8 h-8 rounded-xl bg-brand-navy text-white flex items-center justify-center font-bold text-xs flex-shrink-0 shadow-elevation-1 mt-0.5">
                  SR
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* TYPING INDICATOR (3 BOUNCING DOTS) */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-2 text-xs text-text-tertiary pl-2"
          >
            <div className="flex space-x-1 p-2 bg-surface border border-border-base rounded-full shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-brand-navy animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 rounded-full bg-brand-navy animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 rounded-full bg-brand-navy animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
            <span className="font-mono text-[11px]">Transmitting message...</span>
          </motion.div>
        )}
      </div>

      {/* 3. CANNED QUICK REPLIES & COMPOSER FOOTER */}
      <div className="p-3.5 border-t border-border-subtle bg-surface space-y-2.5">
        {/* Quick Suggestions Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
          <span className="text-[10px] text-text-tertiary uppercase font-bold flex-shrink-0 flex items-center gap-1 font-mono">
            <Zap className="w-3 h-3 text-amber-500" /> Quick Replies:
          </span>
          {quickSuggestions.map((sug, i) => (
            <motion.button
              key={i}
              whileHover={shouldReduceMotion ? undefined : { scale: 1.03 }}
              whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
              onClick={() => {
                if (sug.includes('inspection')) {
                  onOpenConfirmVisit();
                } else {
                  setInputText(sug);
                }
              }}
              className="whitespace-nowrap px-3 py-1 rounded-full bg-surface-subtle hover:bg-surface-hover text-text-secondary hover:text-text-primary border border-border-base text-[11px] font-medium transition cursor-pointer select-none"
            >
              {sug}
            </motion.button>
          ))}
        </div>

        {/* Message Input Form */}
        <form onSubmit={handleSend} className="flex items-center space-x-2">
          <input
            type="text"
            placeholder={
              lead.ai_active
                ? "Type message... (Will switch to Human active mode)"
                : "Type message to customer on WhatsApp..."
            }
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-surface-subtle border border-border-base rounded-xl px-4 py-2.5 text-xs sm:text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy focus:ring-1 focus:ring-brand-navy/30 transition"
          />
          <Button
            type="submit"
            variant="brand"
            size="sm"
            disabled={!inputText.trim()}
            className="rounded-xl px-3.5"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>

    </div>
  );
};
