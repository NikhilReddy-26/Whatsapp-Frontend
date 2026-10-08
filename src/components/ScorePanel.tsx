import React from 'react';
import type { Lead, PipelineStage } from '../types/crm';
import { FieldList } from './FieldList';
import { NextAction } from './NextAction';
import { StageProgress } from './StageProgress';
import { CalendarCheck, StickyNote, UserCheck, ChevronRight } from 'lucide-react';

interface ScorePanelProps {
  lead: Lead | null;
  onOpenConfirmVisit: () => void;
  onOpenAddNote: () => void;
  onOpenAssignModal: () => void;
  onAddField: (leadId: string, key: string, value: string) => void;
  onSelectStage: (stage: PipelineStage) => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  lead,
  onOpenConfirmVisit,
  onOpenAddNote,
  onOpenAssignModal,
  onAddField,
  onSelectStage,
}) => {
  if (!lead) {
    return (
      <div className="bg-[#101823] border border-[#1f2d3f] rounded-[18px] flex items-center justify-center h-[760px] text-slate-400 text-sm">
        Select a lead to inspect intelligence & breakdown.
      </div>
    );
  }

  // Circular Score Gauge Math
  const score = lead.score;
  const radius = 38;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = () => {
    switch (lead.funnel) {
      case 'HOT':
        return '#e5373b';
      case 'WARM':
        return '#f59e0b';
      case 'NURTURE':
        return '#2f9e5b';
      case 'OUT_OF_SCOPE':
      default:
        return '#8d99a8';
    }
  };

  const { fit, opportunity, intent, urgency, completeness } = lead.score_breakdown;

  const factorList = [
    { label: 'Fit', val: fit, max: 30 },
    { label: 'Opportunity', val: opportunity, max: 25 },
    { label: 'Intent', val: intent, max: 20 },
    { label: 'Urgency', val: urgency, max: 15 },
    { label: 'Completeness', val: completeness, max: 10 },
  ];

  return (
    <div className="bg-[#101823] border border-[#1f2d3f] rounded-[18px] flex flex-col min-h-[760px] overflow-hidden shadow-sm p-5 space-y-5">
      
      {/* 1. HEADER: QUALIFICATION */}
      <div className="flex items-center justify-between pb-1 border-b border-[#1f2d3f]/60">
        <h2 className="text-xs font-mono font-bold tracking-widest uppercase text-slate-400">
          QUALIFICATION
        </h2>
        <button
          onClick={onOpenAssignModal}
          className="text-xs text-[#0f3f8a] hover:underline font-semibold flex items-center gap-1"
        >
          <UserCheck className="w-3.5 h-3.5 text-blue-400" />
          <span className="truncate max-w-[120px] text-slate-300">{lead.assigned_to.split(' ')[0]}</span>
          <ChevronRight className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* 2. SCORE RING & SUMMARY CARD MATCHING REFERENCE IMAGE */}
      <div className="flex items-center space-x-4">
        {/* Score Circle */}
        <div className="relative w-22 h-22 sm:w-24 sm:h-24 flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke="#1f2d3f"
              strokeWidth="7"
              fill="transparent"
            />
            <circle
              cx="48"
              cy="48"
              r={radius}
              stroke={getScoreColor()}
              strokeWidth="7"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              fill="transparent"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-2xl sm:text-3xl font-black text-white leading-none">
              {score}
            </span>
          </div>
        </div>

        {/* Funnel Badge + Confidence + Reason */}
        <div className="space-y-1.5 flex-1">
          <div className="flex items-center space-x-2">
            <span
              className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border"
              style={{
                backgroundColor: `${getScoreColor()}20`,
                color: getScoreColor(),
                borderColor: `${getScoreColor()}50`,
              }}
            >
              {lead.funnel.replace('_', ' ')}
            </span>
            <span className="text-xs font-bold text-white">
              Confidence {(lead.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <p className="text-xs text-slate-300 leading-snug">
            "{lead.reason}"
          </p>
        </div>
      </div>

      {/* 3. SCORING FACTOR BREAKDOWN MATCHING REFERENCE IMAGE */}
      <div className="space-y-2.5 pt-2">
        {factorList.map((item) => (
          <div key={item.label} className="flex items-center justify-between gap-3 text-xs">
            <span className="w-28 text-slate-300 font-medium text-xs flex-shrink-0">
              {item.label}
            </span>

            {/* Blue Progress Bar */}
            <div className="flex-1 h-2 bg-[#0a1018] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#2b6cb0] rounded-full transition-all duration-700"
                style={{ width: `${(item.val / item.max) * 100}%` }}
              ></div>
            </div>

            <span className="text-slate-400 font-mono text-xs w-10 text-right flex-shrink-0">
              {item.val}/{item.max}
            </span>
          </div>
        ))}
      </div>

      {/* 4. CAPTURED BY THE CONVERSATION (FIELD LIST) */}
      <FieldList
        fields={lead.fields}
        onAddField={(k, v) => onAddField(lead.id, k, v)}
      />

      {/* 5. NEXT ACTION & STAGE PROGRESSION */}
      <div className="pt-2 space-y-4 border-t border-[#1f2d3f]">
        <NextAction
          action={lead.next_action}
          onExecuteAction={onOpenConfirmVisit}
        />

        <StageProgress
          currentStage={lead.stage}
          onSelectStage={(st) => onSelectStage(st)}
        />
      </div>

      {/* 6. ACTION BUTTONS */}
      <div className="grid grid-cols-2 gap-2 pt-2">
        <button
          onClick={onOpenConfirmVisit}
          className="flex items-center justify-center space-x-1.5 bg-[#0f3f8a] hover:bg-[#154fb0] text-white py-2.5 rounded-full text-xs font-semibold transition shadow-sm"
        >
          <CalendarCheck className="w-4 h-4" />
          <span>Confirm Site Visit</span>
        </button>

        <button
          onClick={onOpenAddNote}
          className="flex items-center justify-center space-x-1.5 bg-[#0a1018] hover:bg-[#162232] text-white border border-[#1f2d3f] py-2.5 rounded-full text-xs font-semibold transition"
        >
          <StickyNote className="w-4 h-4 text-amber-400" />
          <span>Add Note</span>
        </button>
      </div>

    </div>
  );
};
