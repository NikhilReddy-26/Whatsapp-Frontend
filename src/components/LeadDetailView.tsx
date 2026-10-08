import React from 'react';
import { ArrowLeft, Bot, UserCheck, UserPlus } from 'lucide-react';
import type { Lead, Message, PipelineStage } from '../types/crm';
import { ScorePanel } from './ScorePanel';
import { ChatPanel } from './ChatPanel';

interface LeadDetailViewProps {
  lead: Lead;
  messages: Message[];
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
  onBackToInbox,
  onSendMessage,
  onToggleAi,
  onOpenConfirmVisit,
  onOpenAddNote,
  onOpenAssignModal,
  onAddField,
  onSelectStage,
}) => {
  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-8 space-y-6">
      
      {/* 1. TOP NAVIGATION BAR: Back to Inbox & Lead Summary Header */}
      <div className="bg-[#101823] border border-[#1f2d3f] rounded-[22px] p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <button
            onClick={onBackToInbox}
            className="bg-[#0a1018] hover:bg-[#162232] text-white border border-[#1f2d3f] px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center space-x-2 self-start sm:self-auto hover:border-slate-500"
          >
            <ArrowLeft className="w-4 h-4 text-slate-300" />
            <span>← Back to Lead Inbox</span>
          </button>

          <div className="h-8 w-[1px] bg-[#1f2d3f] hidden sm:block"></div>

          <div className="space-y-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="text-xl sm:text-2xl font-black text-white">{lead.name}</h2>
              <span className="text-xs sm:text-sm text-slate-400 font-medium">({lead.company})</span>
              <span className={`text-xs px-3 py-1 rounded-full font-extrabold border ${
                lead.funnel === 'HOT' ? 'bg-red-500/10 text-red-400 border-red-500/30' :
                lead.funnel === 'WARM' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
                lead.funnel === 'NURTURE' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
                'bg-slate-500/10 text-slate-400 border-slate-500/30'
              }`}>
                {lead.funnel} ({lead.score}/100)
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400">
              {lead.whatsapp_number} • {lead.location.city}, {lead.location.state}
            </p>
          </div>
        </div>

        {/* AI Active Toggle & Assign Actions */}
        <div className="flex items-center space-x-3 pt-2 lg:pt-0 border-t lg:border-t-0 border-[#1f2d3f]">
          <button
            onClick={onOpenAssignModal}
            className="text-xs sm:text-sm text-slate-200 bg-[#0f3f8a]/20 hover:bg-[#0f3f8a]/30 border border-[#0f3f8a]/40 px-4 py-2.5 rounded-full font-semibold flex items-center space-x-2 transition"
          >
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>Assign: {lead.assigned_to.split(' ')[0]}</span>
          </button>

          {lead.ai_active ? (
            <button
              onClick={() => onToggleAi(false)}
              className="bg-[#0f3f8a] hover:bg-[#154fb0] text-white text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition shadow-md flex items-center space-x-2"
            >
              <Bot className="w-4 h-4 text-blue-300" />
              <span>Take over chat</span>
            </button>
          ) : (
            <button
              onClick={() => onToggleAi(true)}
              className="bg-[#162232] hover:bg-[#1f2d3f] text-white border border-[#1f2d3f] text-xs sm:text-sm font-bold px-5 py-2.5 rounded-full transition flex items-center space-x-2"
            >
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>Hand back to AI</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. EQUAL 50/50 SIDE-BY-SIDE LAYOUT: EXTRACTED DATA (50%) & WHATSAPP CHAT (50%) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* LEFT COLUMN (50% WIDTH): EXTRACTED DATA & LEAD INTELLIGENCE */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>📊</span> Extracted Data & Intelligence
            </h3>
            <span className="text-xs text-slate-400">
              Confidence: <strong className="text-emerald-400">{(lead.confidence * 100).toFixed(0)}%</strong>
            </span>
          </div>

          <ScorePanel
            lead={lead}
            onOpenConfirmVisit={onOpenConfirmVisit}
            onOpenAddNote={onOpenAddNote}
            onOpenAssignModal={onOpenAssignModal}
            onAddField={onAddField}
            onSelectStage={onSelectStage}
          />
        </div>

        {/* RIGHT COLUMN (50% WIDTH): WHATSAPP CONVERSATION CHAT */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-2">
              <span>💬</span> WhatsApp Live Conversation
            </h3>
            <span className="text-xs text-slate-400">
              Syncing with {lead.whatsapp_number}
            </span>
          </div>

          <ChatPanel
            lead={lead}
            messages={messages}
            onSendMessage={onSendMessage}
            onToggleAi={onToggleAi}
            onOpenConfirmVisit={onOpenConfirmVisit}
          />
        </div>

      </div>

    </div>
  );
};
