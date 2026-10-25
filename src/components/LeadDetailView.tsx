import React, { useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { ArrowLeft, Bot, UserCheck, UserPlus, Package } from 'lucide-react';
import type { Lead, Message, PipelineStage, ChannelPartner } from '../types/crm';
import { ScorePanel } from './ScorePanel';
import { ChatPanel } from './ChatPanel';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { AnimatedText } from './ui/AnimatedText';

interface LeadDetailViewProps {
  lead: Lead;
  messages: Message[];
  channelPartners?: ChannelPartner[];
  onBackToInbox: () => void;
  onSendMessage: (text: string) => void;
  onToggleAi: (aiActive: boolean) => void;
  onOpenConfirmVisit: () => void;
  onOpenAddNote: () => void;
  onOpenAssignModal: () => void;
  onAddField: (leadId: string, key: string, value: string) => void;
  onSelectStage: (stage: PipelineStage) => void;
}

export const LeadDetailView: React.FC<LeadDetailViewProps> = ({
  lead,
  messages,
  channelPartners = [],
  onBackToInbox,
  onSendMessage,
  onToggleAi,
  onOpenConfirmVisit,
  onOpenAddNote,
  onOpenAssignModal,
  onAddField,
  onSelectStage,
}) => {
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    const rafId = requestAnimationFrame(() => {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
    return () => cancelAnimationFrame(rafId);
  }, [lead?.id]);

  const getFunnelVariant = (funnel: string) => {
    switch (funnel) {
      case 'HOT':
        return 'hot';
      case 'WARM':
        return 'warm';
      case 'NURTURE':
        return 'nurture';
      default:
        return 'scope';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. TOP NAVIGATION & LEAD SUMMARY HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="bg-surface border border-border-subtle rounded-card p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-elevation-1 transition-colors"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            variant="secondary"
            size="sm"
            onClick={onBackToInbox}
            leftIcon={<ArrowLeft className="w-4 h-4 text-text-secondary" />}
            className="rounded-full self-start sm:self-auto"
          >
            Back to Inbox
          </Button>

          <div className="h-8 w-[1px] bg-border-base hidden sm:block" />

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <AnimatedText
                text={lead.name}
                as="h2"
                className="text-xl sm:text-2xl font-black text-text-primary tracking-tight"
              />
              <span className="text-xs sm:text-sm text-text-secondary font-medium">({lead.company})</span>
              
              <Badge variant={getFunnelVariant(lead.funnel)} size="sm">
                {lead.funnel} ({lead.score}/100)
              </Badge>

              {lead.product && (
                <span className="text-xs px-3 py-1 rounded-full font-bold border bg-brand-navy/10 text-brand-navy dark:text-blue-300 border-brand-navy/30 flex items-center gap-1.5 shadow-2xs">
                  <Package className="w-3.5 h-3.5" />
                  <span>{lead.product}</span>
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs sm:text-sm text-text-tertiary">
              <span>{lead.whatsapp_number}</span>
              <span>•</span>
              <span className="font-medium text-text-secondary">{lead.location.city}, {lead.location.state}</span>
            </div>
          </div>
        </div>

        {/* AI Active Toggle & Assign Actions */}
        <div className="flex items-center space-x-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-border-subtle">
          <Button
            variant="secondary"
            size="sm"
            onClick={onOpenAssignModal}
            leftIcon={<UserPlus className="w-4 h-4 text-brand-navy dark:text-blue-400" />}
            className="rounded-full"
          >
            Assign Lead
          </Button>

          {lead.ai_active ? (
            <Button
              variant="brand"
              size="sm"
              onClick={() => onToggleAi(false)}
              leftIcon={<Bot className="w-4 h-4 text-blue-200" />}
              className="rounded-full"
            >
              Take over chat
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onToggleAi(true)}
              leftIcon={<UserCheck className="w-4 h-4 text-brand-green" />}
              className="rounded-full"
            >
              Hand back to AI
            </Button>
          )}
        </div>
      </motion.div>

      {/* 2. 50/50 DUAL-PANEL WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN: EXTRACTED DATA & INTELLIGENCE PANEL */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-navy" />
              <span>Extracted Data & Intelligence</span>
            </h3>
            <span className="text-xs text-text-secondary">
              Confidence: <strong className="text-brand-green font-mono font-bold">{(lead.confidence * 100).toFixed(0)}%</strong>
            </span>
          </div>

          <ScorePanel
            lead={lead}
            channelPartners={channelPartners}
            onOpenConfirmVisit={onOpenConfirmVisit}
            onOpenAddNote={onOpenAddNote}
            onOpenAssignModal={onOpenAssignModal}
            onAddField={onAddField}
            onToggleAi={onToggleAi}
            onSelectStage={onSelectStage}
          />
        </motion.div>

        {/* RIGHT COLUMN: WHATSAPP CONVERSATION PANEL */}
        <motion.div
          initial={{ opacity: 0, x: shouldReduceMotion ? 0 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-3"
        >
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-mono font-bold uppercase tracking-widest text-text-tertiary flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-brand-green" />
              <span>Live WhatsApp Customer Stream</span>
            </h3>
            <span className="text-xs text-text-tertiary font-mono">
              Lead #{lead.id}
            </span>
          </div>

          <ChatPanel
            lead={lead}
            messages={messages}
            onSendMessage={onSendMessage}
            onToggleAi={onToggleAi}
            onOpenConfirmVisit={onOpenConfirmVisit}
          />
        </motion.div>

      </div>
    </div>
  );
};
