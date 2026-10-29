import React from 'react';
import { motion } from 'motion/react';
import type { Lead, PipelineStage, ChannelPartner, FunnelCategory } from '../types/crm';
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
  const matchedPartner = lead.matched_partner;
  const assignedPartner = lead.assigned_partner || (lead.assigned_to && lead.assigned_to.trim() ? lead.assigned_to : null);

  const breakdown = lead.score_breakdown;
  const overallScore = breakdown?.overall_score ?? lead.score;
  const band: FunnelCategory = (breakdown?.band as FunnelCategory) || lead.funnel;
  const confidencePercent = breakdown?.confidence ?? (lead.confidence > 1 ? Math.round(lead.confidence) : Math.round(lead.confidence * 100));

  const fitVal = breakdown?.fit ?? 0;
  const fitMax = breakdown?.fit_max ?? 30;
  const oppVal = breakdown?.opportunity ?? 0;
  const oppMax = breakdown?.opportunity_max ?? 25;
  const intentVal = breakdown?.intent ?? 0;
  const intentMax = breakdown?.intent_max ?? 20;
  const urgencyVal = breakdown?.urgency ?? 0;
  const urgencyMax = breakdown?.urgency_max ?? 15;
  const compVal = breakdown?.completeness ?? 0;
  const compMax = breakdown?.completeness_max ?? 10;

  const factorList = [
    { label: 'Fit & Specification', val: fitVal, max: fitMax, color: 'var(--brand-navy)' },
    { label: 'Opportunity & Scale', val: oppVal, max: oppMax, color: '#3b82f6' },
    { label: 'Commercial Intent', val: intentVal, max: intentMax, color: '#8b5cf6' },
    { label: 'Timeline Urgency', val: urgencyVal, max: urgencyMax, color: '#f59e0b' },
    { label: 'Data Completeness', val: compVal, max: compMax, color: '#10b981' },
  ];

  // Explanations/Reasons list (deduplicated between score_reasons and score_breakdown.reasons)
  const combinedReasons = Array.from(
    new Set([...(breakdown?.reasons || []), ...(lead.score_reasons || [])].filter(Boolean))
  );

  const summaryQuote = breakdown?.summary_quote || lead.reason || '';
  const recommendedProduct = lead.recommended_product || lead.product;
  const productSpecification = lead.product_specification || 'ColourPlus OEM';
  const facilitySector = lead.facility_sector || lead.flooring_category || 'Factory & Industrial';
  const facilitySpecifics = lead.facility_specifics || lead.flooring_area?.sub_type;
  const quoteText = lead.quote_text || lead.flooring_area?.source_message;

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
    assignedPartner &&
    !assignedPartner.toLowerCase().includes('unassigned') &&
    !assignedPartner.toLowerCase().includes('disqualification')
  );

  return (
    <div className="bg-surface border border-border-subtle rounded-card flex flex-col min-h-[760px] overflow-hidden shadow-elevation-1 p-5 sm:p-6 space-y-5 transition-colors">
      
      {/* 1. TOP HEADER: ASSIGNED REP & ROUTING */}
      <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
        <div className="flex items-center gap-1.5 min-w-0">
          <Sparkles className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400 flex-shrink-0" />
          <AnimatedText
            text="LEAD DATA & INTELLIGENCE"
            as="h2"
            className="text-xs font-mono font-bold tracking-widest uppercase text-text-tertiary truncate"
          />
          {lead.ref_no && (
            <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-surface-subtle border border-border-base text-brand-navy dark:text-blue-400 ml-1 shrink-0">
              {lead.ref_no}
            </span>
          )}
        </div>
        <button
          onClick={onOpenAssignModal}
          className="text-xs text-brand-navy dark:text-blue-400 hover:underline font-bold flex items-center gap-1 cursor-pointer shrink-0 ml-2"
        >
          <UserCheck className="w-3.5 h-3.5 text-brand-green" />
          <span className="truncate max-w-[140px]">
            {isAssigned ? `Assigned: ${assignedPartner}` : 'Assign Lead'}
          </span>
          <ChevronRight className="w-3 h-3 opacity-60" />
        </button>
      </div>

      {/* 1.5 TERRITORY & CHANNEL PARTNER MATCH INTELLIGENCE */}
      <div className="bg-gradient-to-r from-brand-navy/10 via-surface-subtle to-brand-green/10 border border-brand-navy/25 rounded-2xl p-4 space-y-3 shadow-2xs">
        {/* Matched Partner (Territory Routing) */}
        {matchedPartner ? (
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2.5 min-w-0">
              <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-brand-navy text-white shadow-2xs mt-0.5 shrink-0">
                {matchedPartner.code}
              </span>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-text-primary leading-tight truncate">
                    {matchedPartner.firm_name}
                  </h4>
                  {matchedPartner.tier && (
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-brand-navy/15 text-brand-navy dark:text-blue-300 border border-brand-navy/20">
                      {matchedPartner.tier}
                    </span>
                  )}
                </div>
                <span className="text-[11px] text-text-secondary font-medium block truncate mt-0.5">
                  Territory: <strong className="text-text-primary">{matchedPartner.territory}</strong>
                </span>
                {matchedPartner.full_address && (
                  <p className="text-[10px] text-text-tertiary truncate mt-0.5">
                    {matchedPartner.full_address}
                  </p>
                )}
              </div>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-brand-green/20 text-brand-green border border-brand-green/30 shrink-0">
              Matched Territory
            </span>
          </div>
        ) : territorySuggestion.territory ? (
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
        ) : null}

        {/* Assigned Partner Status (Distinct from matched_partner) */}
        {assignedPartner && (
          <div className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-surface border border-border-subtle">
            <span className="text-text-tertiary font-semibold flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-brand-green" />
              <span>Assigned Channel Partner:</span>
            </span>
            <span className="font-bold text-text-primary truncate max-w-[220px]">
              {assignedPartner}
            </span>
          </div>
        )}

        {/* Location & Address */}
        {lead.location && (
          <div className="flex items-start gap-2 text-xs text-text-secondary bg-surface/90 p-2.5 rounded-xl border border-border-subtle">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0 mt-0.5" />
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-medium leading-relaxed text-text-primary">
                {lead.location.address || `${lead.location.city}, ${lead.location.state}`}
              </p>
              {(matchedPartner?.google_maps_url || lead.location.maps_link) && (
                <a
                  href={matchedPartner?.google_maps_url || lead.location.maps_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[10px] text-brand-navy dark:text-blue-400 hover:underline inline-flex items-center gap-1 font-semibold mt-0.5"
                >
                  Open in Google Maps ↗
                </a>
              )}
            </div>
            {lead.location.area_sqft && (
              <span className="font-mono text-xs font-bold text-text-primary bg-surface-subtle px-2 py-0.5 rounded border border-border-subtle shrink-0">
                {lead.location.area_sqft.toLocaleString()} sq ft
              </span>
            )}
          </div>
        )}
      </div>

      {/* 2. MATCHED COLOURPLUS PRODUCT SPECIFICATION (SHINE SWEEP EFFECT) */}
      {recommendedProduct && (
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
                  {recommendedProduct}
                </h3>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border border-brand-navy/30 bg-surface text-brand-navy dark:text-blue-300 flex-shrink-0 shadow-2xs">
              {productSpecification}
            </span>
          </div>
        </motion.div>
      )}

      {/* 3. FACILITY SECTOR & EXTRACTED WHATSAPP EVIDENCE */}
      <div className="bg-surface-subtle border border-border-base rounded-2xl p-4 space-y-3 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-surface border border-border-base flex-shrink-0 shadow-2xs">
              {getFlooringAreaIcon(facilitySector)}
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-text-tertiary block">
                FACILITY SECTOR CLASSIFICATION
              </span>
              <h3 className="text-sm font-black text-text-primary flex items-center gap-2">
                <span>{facilitySector}</span>
              </h3>
            </div>
          </div>
        </div>

        {facilitySpecifics && (
          <div className="text-xs text-text-secondary font-medium bg-surface px-3 py-1.5 rounded-lg border border-border-subtle flex items-center justify-between shadow-2xs">
            <span className="text-text-tertiary font-semibold">Facility Specifics:</span>
            <span className="text-text-primary font-bold">{facilitySpecifics}</span>
          </div>
        )}

        {quoteText && (
          <div className="bg-surface p-3 rounded-xl border border-border-subtle space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-[10px] font-semibold text-text-tertiary">
              <span className="flex items-center gap-1 text-brand-green font-bold">
                <MessageSquare className="w-3 h-3" /> WhatsApp Quote Evidence
              </span>
              <span className="text-brand-green font-mono font-bold">
                {confidencePercent}% Confidence
              </span>
            </div>
            <p className="text-xs text-text-primary italic font-medium leading-relaxed">
              "{quoteText}"
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
            Overall Score: <strong className="text-sm">{overallScore}/100</strong>
          </span>
        </div>

        <div className="bg-surface-subtle border border-border-base rounded-2xl p-4 sm:p-5 space-y-4 shadow-2xs">
          {/* Circular Gauge & Reason Quote */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <ScoreGauge score={overallScore} funnel={band} size={94} strokeWidth={8} />

            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex items-center space-x-2">
                <Badge variant={band === 'HOT' ? 'hot' : band === 'WARM' ? 'warm' : 'nurture'} size="xs">
                  {band.replace('_', ' ')}
                </Badge>
                <span className="text-xs font-semibold text-text-secondary">
                  Confidence: <strong className="text-text-primary">{confidencePercent}%</strong>
                </span>
              </div>
              {summaryQuote && (
                <p className="text-xs text-text-secondary italic leading-relaxed bg-surface p-2.5 rounded-xl border border-border-subtle">
                  "{summaryQuote}"
                </p>
              )}
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

          {/* Qualification Reasons List */}
          {combinedReasons.length > 0 && (
            <div className="pt-2 border-t border-border-subtle space-y-1.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-text-tertiary block">
                QUALIFICATION FACTORS & AUDIT REASONS
              </span>
              <ul className="space-y-1 text-xs text-text-secondary">
                {combinedReasons.map((reason, rIdx) => (
                  <li key={rIdx} className="flex items-start gap-1.5 bg-surface/80 p-2 rounded-lg border border-border-subtle">
                    <span className="text-brand-green font-bold shrink-0 mt-0.5">•</span>
                    <span className="leading-snug text-text-primary font-medium">{reason}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

    </div>
  );
};
