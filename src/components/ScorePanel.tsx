import React from 'react';
import { motion } from 'motion/react';
import type { Lead, PipelineStage, ChannelPartner } from '../types/crm';
import { findSuggestedChannelPartner } from '../data/territories';
import { FieldList } from './FieldList';
import { ScoreGauge } from './ui/ScoreGauge';
import { ProgressBar } from './ui/ProgressBar';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AnimatedText } from './ui/AnimatedText';
import {
  CalendarCheck,
  UserCheck,
  UserPlus,
  Bot,
  ChevronRight,
  Factory,
  Warehouse,
  Building2,
  Snowflake,
  Home,
  Car,
  FlaskConical,
  Layers,
  Package,
  MessageSquare,
  Sparkles,
  MapPin,
  Zap,
} from 'lucide-react';

interface ScorePanelProps {
  lead: Lead | null;
  channelPartners?: ChannelPartner[];
  onOpenConfirmVisit: () => void;
  onOpenAddNote?: () => void;
  onOpenAssignModal: () => void;
  onAddField: (leadId: string, key: string, value: string) => void;
  onToggleAi?: (aiActive: boolean) => void;
  onSelectStage?: (stage: PipelineStage) => void;
}

export const ScorePanel: React.FC<ScorePanelProps> = ({
  lead,
  channelPartners = [],
  onOpenConfirmVisit,
  onOpenAssignModal,
  onAddField,
  onToggleAi,
}) => {
  if (!lead) {
    return (
      <div className="bg-surface border border-border-subtle rounded-card flex items-center justify-center h-[760px] text-text-tertiary text-sm font-medium shadow-elevation-1">
        Select a lead to inspect intelligence & breakdown.
      </div>
    );
  }

  const territorySuggestion = findSuggestedChannelPartner(lead, channelPartners);

  const { fit, opportunity, intent, urgency, completeness } = lead.score_breakdown;

  const factorList = [
    { label: 'Fit & Specification', val: fit, max: 30, color: 'var(--brand-navy)' },
    { label: 'Opportunity & Scale', val: opportunity, max: 25, color: '#3b82f6' },
    { label: 'Commercial Intent', val: intent, max: 20, color: '#8b5cf6' },
    { label: 'Timeline Urgency', val: urgency, max: 15, color: '#f59e0b' },
    { label: 'Data Completeness', val: completeness, max: 10, color: '#10b981' },
  ];

  const getFlooringAreaIcon = (category?: string) => {
    switch (category) {
      case 'Factory & Industrial':
        return <Factory className="w-4 h-4 text-amber-500" />;
      case 'Pharma & Cleanroom':
        return <FlaskConical className="w-4 h-4 text-teal-400" />;
      case 'Warehouse & Logistics':
        return <Warehouse className="w-4 h-4 text-blue-400" />;
      case 'Commercial & Terrace':
        return <Building2 className="w-4 h-4 text-purple-400" />;
      case 'Cold Storage & Food':
        return <Snowflake className="w-4 h-4 text-sky-400" />;
      case 'Automobile & Garages':
        return <Car className="w-4 h-4 text-rose-400" />;
      case 'Household & Residential':
        return <Home className="w-4 h-4 text-emerald-400" />;
      default:
        return <Layers className="w-4 h-4 text-text-tertiary" />;
    }
  };

  const isAssigned = Boolean(
    lead.assigned_to &&
    lead.assigned_to.trim() !== '' &&
    !lead.assigned_to.toLowerCase().includes('unassigned') &&
    !lead.assigned_to.toLowerCase().includes('disqualification')
  );

  return (
    <div className="bg-surface border border-border-subtle rounded-card flex flex-col min-h-[760px] overflow-hidden shadow-elevation-1 p-5 sm:p-6 space-y-5 transition-colors">
      
      {/* 1. TOP HEADER: ASSIGNED REP & ROUTING */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400 flex-shrink-0" />
          <AnimatedText
            text="LEAD DATA & INTELLIGENCE"
            as="h2"
            className="text-xs font-mono font-bold tracking-widest uppercase text-text-tertiary"
          />
        </div>
        <button
          onClick={onOpenAssignModal}
          className="text-xs text-brand-navy dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer"
        >
          <UserCheck className="w-3.5 h-3.5 text-brand-green" />
          <span className="truncate max-w-[140px]">
            {isAssigned ? `Assigned: ${lead.assigned_to}` : 'Assign Lead'}
          </span>
          <ChevronRight className="w-3 h-3 opacity-60" />
        </button>
      </div>

      {/* 1.5 TERRITORY & CHANNEL PARTNER MATCH INTELLIGENCE */}
      {(territorySuggestion.territory || lead.location) && (
        <div className="bg-gradient-to-r from-brand-navy/10 via-surface-subtle to-brand-green/10 border border-brand-navy/25 rounded-2xl p-4 space-y-2.5 shadow-2xs">
          {territorySuggestion.territory && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-brand-navy text-white shadow-2xs">
                  {territorySuggestion.territory.territoryId}
                </span>
                <div>
                  <h4 className="text-sm font-bold text-text-primary leading-tight">
                    {territorySuggestion.territory.territoryName}
                  </h4>
                  <span className="text-[10px] text-text-tertiary font-mono">
                    {territorySuggestion.territory.state} • {territorySuggestion.territory.priorityTier}
                  </span>
                </div>
              </div>
              {territorySuggestion.partner && (
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-green/20 text-brand-green border border-brand-green/30">
                  Partner: {territorySuggestion.partner.id}
                </span>
              )}
            </div>
          )}

          {lead.location && (
            <div className="flex items-start gap-2 text-xs text-text-secondary bg-surface/90 p-2.5 rounded-xl border border-border-subtle">
              <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium leading-relaxed text-text-primary">
                  {lead.location.address || `${lead.location.city}, ${lead.location.state}`}
                </p>
                {lead.location.maps_link && (
                  <a
                    href={lead.location.maps_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-brand-navy dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold mt-0.5"
                  >
                    Open in Google Maps ↗
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* 2. MATCHED COLOURPLUS PRODUCT SPECIFICATION (SHINE SWEEP EFFECT) */}
      {lead.product && (
        <motion.div
          initial={{ opacity: 0, y: 16, rotateX: -14 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: 'spring', stiffness: 360, damping: 25 }}
          style={{ transformPerspective: 800 }}
          className="relative overflow-hidden bg-brand-navy/10 border border-brand-navy/30 rounded-2xl p-4 epoxy-gloss shadow-2xs"
        >
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <div className="p-2.5 rounded-xl bg-surface border border-brand-navy/30 text-brand-navy dark:text-blue-300 flex-shrink-0 shadow-elevation-1">
                <Package className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-brand-navy dark:text-blue-400 block">
                  RECOMMENDED PRODUCT SPECIFICATION
                </span>
                <h3 className="text-base font-extrabold text-text-primary truncate">
                  {lead.product}
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-brand-navy/30 bg-surface text-brand-navy dark:text-blue-300 flex-shrink-0 shadow-2xs">
              ColourPlus OEM
            </span>
          </div>
        </motion.div>
      )}

      {/* 3. FACILITY SECTOR & EXTRACTED WHATSAPP EVIDENCE */}
      <div className="bg-surface-subtle border border-border-base rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-surface border border-border-base flex-shrink-0 shadow-2xs">
              {getFlooringAreaIcon(lead.flooring_category)}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-text-tertiary block">
                FACILITY SECTOR CLASSIFICATION
              </span>
              <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                <span>{lead.flooring_category || 'Industrial Sector'}</span>
              </h3>
            </div>
          </div>
        </div>

        {lead.flooring_area?.sub_type && (
          <div className="text-xs text-text-secondary font-medium bg-surface px-3 py-1.5 rounded-lg border border-border-subtle flex items-center justify-between shadow-2xs">
            <span className="text-text-tertiary font-semibold">Facility Specifics:</span>
            <span className="text-text-primary font-bold">{lead.flooring_area.sub_type}</span>
          </div>
        )}

        {lead.flooring_area?.source_message && (
          <div className="bg-surface p-3 rounded-xl border border-border-subtle space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-semibold text-text-tertiary">
              <span className="flex items-center gap-1 text-brand-green font-bold">
                <MessageSquare className="w-3 h-3" /> WhatsApp Quote Evidence
              </span>
              {lead.flooring_area.confidence && (
                <span className="text-brand-green font-mono font-bold">
                  {(lead.flooring_area.confidence * 100).toFixed(0)}% Match
                </span>
              )}
            </div>
            <p className="text-xs text-text-primary italic font-medium leading-relaxed">
              "{lead.flooring_area.source_message}"
            </p>
          </div>
        )}
      </div>

      {/* 4. EXTRACTED TECHNICAL FIELDS LIST */}
      <FieldList
        fields={lead.fields}
        onAddField={(k, v) => onAddField(lead.id, k, v)}
      />

      {/* 5. ACTION BUTTONS: TAKEOVER CHAT | ASSIGN LEAD | SITE BOOKING */}
      <div className="grid grid-cols-3 gap-2.5 pt-2">
        {lead.ai_active ? (
          <Button
            variant="brand"
            size="sm"
            onClick={() => onToggleAi?.(false)}
            leftIcon={<Bot className="w-3.5 h-3.5 text-blue-200" />}
            className="w-full text-xs"
            title="Take over chat from AI"
          >
            Takeover
          </Button>
        ) : (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onToggleAi?.(true)}
            leftIcon={<UserCheck className="w-3.5 h-3.5 text-brand-green" />}
            className="w-full text-xs"
            title="Hand back chat to AI"
          >
            Hand to AI
          </Button>
        )}

        <Button
          variant="secondary"
          size="sm"
          onClick={onOpenAssignModal}
          leftIcon={<UserPlus className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400" />}
          className="w-full text-xs"
          title="Assign Lead"
        >
          Assign
        </Button>

        <Button
          variant="success"
          size="sm"
          onClick={onOpenConfirmVisit}
          leftIcon={<CalendarCheck className="w-3.5 h-3.5 text-white" />}
          className="w-full text-xs"
          title="Schedule Site Visit"
        >
          Site Visit
        </Button>
      </div>

      {/* 6. QUALIFICATION SCORE SUMMARY WITH CIRCULAR GAUGE & 5 FACTOR BARS */}
      <div className="pt-4 border-t border-border-subtle space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[11px] font-mono font-bold tracking-widest uppercase text-text-tertiary">
            QUALIFICATION BREAKDOWN
          </h4>
          <span className="text-xs font-mono font-bold text-text-primary">
            Overall Score: <strong className="text-sm">{lead.score}/100</strong>
          </span>
        </div>

        <div className="bg-surface-subtle border border-border-base rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          {/* Circular Gauge & Reason Quote */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ScoreGauge score={lead.score} funnel={lead.funnel} size={94} strokeWidth={8} />

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Badge variant={lead.funnel === 'HOT' ? 'hot' : lead.funnel === 'WARM' ? 'warm' : 'nurture'} size="xs">
                  {lead.funnel.replace('_', ' ')}
                </Badge>
                <span className="text-xs font-semibold text-text-secondary">
                  Confidence: <strong className="text-text-primary">{(lead.confidence * 100).toFixed(0)}%</strong>
                </span>
              </div>
              <p className="text-xs text-text-secondary italic leading-relaxed bg-surface p-2.5 rounded-xl border border-border-subtle">
                "{lead.reason}"
              </p>
            </div>
          </div>

          {/* 5-Factor Staggered Progress Bars */}
          <div className="space-y-2.5 pt-2 border-t border-border-subtle">
            {factorList.map((item, idx) => (
              <ProgressBar
                key={item.label}
                label={item.label}
                value={item.val}
                max={item.max}
                color={item.color}
                delay={idx * 0.08}
                height={5}
              />
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};
