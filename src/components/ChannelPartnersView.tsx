import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Users,
  Search,
  Plus,
  Trash2,
  Phone,
  Mail,
  MapPin,
  Building,
  ShieldCheck,
  ArrowRight,
  MessageSquare,
  Sparkles,
  UserCheck,
  CheckCircle2,
  ExternalLink,
  Briefcase,
  Warehouse,
  TrendingUp,
} from 'lucide-react';
import type { ChannelPartner, ChannelPartnerLead, Lead } from '../types/crm';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AnimatedText } from './ui/AnimatedText';
import { RemoveChannelPartnerModal } from './RemoveChannelPartnerModal';
import { perspectiveCardIn, staggerContainer } from '../lib/motion';
import { crmApi } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ChannelPartnersViewProps {
  channelPartners: ChannelPartner[];
  leads?: Lead[];
  onOpenAddPartner: () => void;
  onRemovePartner: (partnerId: string) => Promise<void> | void;
  onApprovePartnerLead?: (leadId: string) => Promise<void> | void;
  onNavigateToDesk?: () => void;
  availableStates?: string[];
}

export const ChannelPartnersView: React.FC<ChannelPartnersViewProps> = ({
  channelPartners,
  leads: propsLeads,
  onOpenAddPartner,
  onRemovePartner,
  onApprovePartnerLead,
  onNavigateToDesk,
  availableStates,
}) => {
  const { toast } = useToast();
  const [internalLeads, setInternalLeads] = useState<Lead[]>(propsLeads || []);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState<string>('all');
  const [assignedOnlyFilter, setAssignedOnlyFilter] = useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [partnerLeads, setPartnerLeads] = useState<ChannelPartnerLead[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'new' | 'screening' | 'approved'>('all');
  const [isLoadingLeads, setIsLoadingLeads] = useState(true);

  useEffect(() => {
    if (propsLeads && propsLeads.length > 0) {
      setInternalLeads(propsLeads);
    } else {
      crmApi.getLeads().then((data) => setInternalLeads(data)).catch(() => {});
    }
  }, [propsLeads]);

  const activeLeads = propsLeads && propsLeads.length > 0 ? propsLeads : internalLeads;

  const getAssignedLeadsCount = (partner: ChannelPartner): number => {
    if (!activeLeads || activeLeads.length === 0) return 0;
    const pId = partner.id.toLowerCase();
    const pName = partner.name.toLowerCase();
    const pTerritory = (partner.territory_name || '').toLowerCase();
    const pTerritoryId = (partner.territory_id || '').toLowerCase();

    return activeLeads.filter((lead) => {
      if (!lead.assigned_to || !lead.assigned_to.trim()) return false;
      const a = lead.assigned_to.toLowerCase();
      if (a.includes('unassigned') || a.includes('disqualification')) return false;

      // Direct ID or name match
      if (a === pId || a === pName || a.includes(pId) || a.includes(pName)) return true;
      if (pTerritoryId && a.includes(pTerritoryId)) return true;
      if (pTerritory && pTerritory.length > 3 && a.includes(pTerritory)) return true;
      if (partner.email && a.includes(partner.email.toLowerCase())) return true;

      return false;
    }).length;
  };

  const totalAssignedLeadsCount = channelPartners.reduce(
    (acc, partner) => acc + getAssignedLeadsCount(partner),
    0
  );

  const loadPartnerLeads = async () => {
    try {
      const data = await crmApi.getChannelPartnerLeads();
      setPartnerLeads(data);
    } catch (err) {
      console.error('Failed to load partner leads:', err);
    } finally {
      setIsLoadingLeads(false);
    }
  };

  useEffect(() => {
    loadPartnerLeads();
  }, []);

  const states = Array.from(
    new Set([...(availableStates || []), ...channelPartners.map((cp) => cp.state).filter(Boolean)])
  )
    .filter((s) => !s.includes('/'))
    .sort();

  const filteredPartners = channelPartners.filter((cp) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      cp.name.toLowerCase().includes(term) ||
      cp.id.toLowerCase().includes(term) ||
      (cp.territory_id && cp.territory_id.toLowerCase().includes(term)) ||
      (cp.territory_name && cp.territory_name.toLowerCase().includes(term)) ||
      (cp.cities && cp.cities.some((c) => c.toLowerCase().includes(term))) ||
      (cp.priority_tier && cp.priority_tier.toLowerCase().includes(term)) ||
      (cp.state && cp.state.toLowerCase().includes(term)) ||
      cp.role.toLowerCase().includes(term) ||
      (cp.email && cp.email.toLowerCase().includes(term)) ||
      cp.whatsapp_number.includes(term);

    const matchesState = selectedState === 'all' || cp.state === selectedState;
    const matchesAssigned = !assignedOnlyFilter || getAssignedLeadsCount(cp) > 0;
    return matchesSearch && matchesState && matchesAssigned;
  });

  const filteredPartnerLeads = partnerLeads.filter((lead) => {
    if (leadsFilter === 'all') return true;
    if (leadsFilter === 'new') return lead.status === 'New Inquiry';
    if (leadsFilter === 'screening') return lead.status === 'In Screening';
    if (leadsFilter === 'approved') return lead.status === 'Approved';
    return true;
  });

  const handleApproveLead = async (lead: ChannelPartnerLead) => {
    try {
      if (onApprovePartnerLead) {
        await onApprovePartnerLead(lead.id);
      } else {
        await crmApi.approveChannelPartnerLead(lead.id);
      }
      await loadPartnerLeads();
      toast({
        title: 'Partner Approved!',
        message: `${lead.firm_name} promoted to authorized territory network (${lead.city}, ${lead.state}).`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to approve partner lead:', err);
      toast({
        title: 'Approval Failed',
        message: err instanceof Error ? err.message : 'Please try again.',
        type: 'error',
      });
    }
  };

  const handleDeleteLead = async (leadId: string, firmName: string) => {
    try {
      await crmApi.deleteChannelPartnerLead(leadId);
      await loadPartnerLeads();
      toast({
        title: 'Inquiry Dismissed',
        message: `${firmName} application dismissed.`,
        type: 'warning',
      });
    } catch (err) {
      console.error('Failed to delete partner lead:', err);
    }
  };

  const handleSinglePartnerRemove = async (partner: ChannelPartner) => {
    try {
      await onRemovePartner(partner.id);
    } catch (err) {
      toast({
        title: 'Could Not Remove Partner',
        message: err instanceof Error ? err.message : 'Please try again.',
        type: 'error',
      });
      return;
    }
    toast({
      title: 'Partner Removed',
      message: `${partner.name} removed from active network.`,
      type: 'warning',
    });
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      {/* 1. TOP HEADER BANNER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface border border-border-subtle rounded-card p-6 shadow-elevation-1 transition-colors"
      >
        <div>
          <div className="flex items-center space-x-2 text-brand-navy dark:text-blue-400 font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <Users className="w-4 h-4" />
            <span>Distribution Network & Territory Coverage</span>
          </div>
          <AnimatedText
            text="Channel Partners"
            as="h2"
            className="text-2xl font-black text-text-primary tracking-tight"
          />
          <p className="text-xs text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Authorized regional dealers, distributors, and internal sales specialists for lead assignment and territory coverage.
          </p>
        </div>

        {/* Action Buttons: Add & Remove Channel Partner */}
        <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
          <Button
            variant="brand"
            size="sm"
            onClick={onOpenAddPartner}
            leftIcon={<Plus className="w-4 h-4" />}
            className="rounded-full shadow-2xs"
          >
            Add Channel Partner
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsRemoveModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4 text-funnel-hot" />}
            className="rounded-full text-funnel-hot border-funnel-hot/30 hover:bg-funnel-hot/10 hover:border-funnel-hot shadow-2xs"
          >
            Remove Channel Partner
          </Button>
        </div>
      </motion.div>

      {/* SECTION 1: ACTIVE CHANNEL PARTNERS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
          <div className="flex items-center space-x-2.5 flex-wrap gap-y-2">
            <ShieldCheck className="w-4 h-4 text-brand-navy dark:text-blue-400" />
            <h3 className="text-base font-bold text-text-primary">
              Active Channel Partners & Reps
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-brand-navy/10 text-brand-navy dark:text-blue-400 font-mono font-bold border border-brand-navy/20">
              {channelPartners.length} Active
            </span>
            {totalAssignedLeadsCount > 0 && (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-brand-green/15 text-brand-green font-mono font-bold border border-brand-green/30 flex items-center gap-1.5 shadow-2xs">
                <UserCheck className="w-3.5 h-3.5" />
                <span>{totalAssignedLeadsCount} Leads Assigned</span>
              </span>
            )}
          </div>
          <span className="text-xs text-text-tertiary font-medium">
            3 columns layout • Scroll to explore {filteredPartners.length} partners
            {filteredPartners.length < channelPartners.length && (
              <span className="text-brand-navy dark:text-blue-400 font-semibold ml-1">
                (of {channelPartners.length} total)
              </span>
            )}
          </span>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface border border-border-subtle rounded-2xl p-4 shadow-elevation-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ID (e.g. CP-001), name, city (e.g. Bhiwandi, Chakan), territory, or state..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-subtle border border-border-base rounded-xl text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setAssignedOnlyFilter(!assignedOnlyFilter)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition cursor-pointer shadow-2xs whitespace-nowrap border ${
                assignedOnlyFilter
                  ? 'bg-brand-navy text-white border-brand-navy shadow-sm'
                  : 'bg-surface-subtle text-text-secondary border-border-base hover:text-text-primary hover:border-border-strong'
              }`}
              title="Show only Channel Partners with at least 1 assigned lead"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Assigned Only</span>
            </button>

            <select
              aria-label="Filter partners by territory state"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 bg-surface-subtle border border-border-base rounded-xl text-xs text-text-primary focus:outline-none focus:border-brand-navy transition cursor-pointer shadow-2xs font-medium"
            >
              <option value="all">All States ({channelPartners.length} CPs)</option>
              {states.map((st) => {
                const count = channelPartners.filter((cp) => cp.state === st).length;
                return (
                  <option key={st} value={st}>
                    {st} ({count} {count === 1 ? 'CP' : 'CPs'})
                  </option>
                );
              })}
            </select>
          </div>
        </div>

        {/* ACTIVE FILTER NOTICE */}
        {assignedOnlyFilter && (
          <div className="flex items-center justify-between px-4 py-2.5 bg-brand-navy/10 border border-brand-navy/20 rounded-xl text-xs text-brand-navy dark:text-blue-300">
            <span className="flex items-center gap-2">
              <UserCheck className="w-4 h-4 text-brand-navy dark:text-blue-400 flex-shrink-0" />
              <span>
                Filtering by <strong>Assigned Only</strong>: Displaying {filteredPartners.length} channel partners with assigned leads ({channelPartners.length - filteredPartners.length} unassigned hidden).
              </span>
            </span>
            <button
              type="button"
              onClick={() => setAssignedOnlyFilter(false)}
              className="text-xs font-bold underline hover:opacity-80 cursor-pointer ml-3 whitespace-nowrap"
            >
              Show all {channelPartners.length} partners
            </button>
          </div>
        )}

        {/* ACTIVE PARTNERS GRID (3 COLUMNS & SCROLL CONTAINER) */}
        <div className="overflow-y-auto max-h-[720px] pr-2 table-scrollbar scroll-smooth rounded-2xl">
          <motion.div
            variants={staggerContainer(0.06)}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5 pb-2"
          >
          {filteredPartners.map((partner) => {
            const assignedCount = getAssignedLeadsCount(partner);
            return (
              <motion.div key={partner.id} variants={perspectiveCardIn}>
                <Card
                  elevation={1}
                  interactive
                  className="p-5 sm:p-6 space-y-3.5 flex flex-col justify-between h-full group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-brand-navy text-white shadow-2xs">
                          {partner.id}
                        </span>
                        {partner.priority_tier && (
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-subtle border border-border-subtle text-text-secondary">
                            {partner.priority_tier.split(' - ')[0]}
                          </span>
                        )}
                        {/* Assigned Leads Count Pill in Header */}
                        <span
                          className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shadow-2xs ${
                            assignedCount > 0
                              ? 'bg-brand-green/15 text-brand-green border-brand-green/30'
                              : 'bg-surface-subtle text-text-tertiary border-border-subtle'
                          }`}
                          title={`${assignedCount} qualified leads currently assigned to ${partner.name}`}
                        >
                          <UserCheck className={`w-3 h-3 ${assignedCount > 0 ? 'text-brand-green' : 'text-text-tertiary'}`} />
                          <span>{assignedCount} {assignedCount === 1 ? 'Lead' : 'Leads'}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {partner.state}
                        </span>
                        {/* Direct remove button on card */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSinglePartnerRemove(partner);
                          }}
                          title={`Remove ${partner.name}`}
                          className="p-1 rounded-lg text-text-tertiary hover:text-funnel-hot hover:bg-funnel-hot/10 transition cursor-pointer"
                          aria-label={`Remove ${partner.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-brand-navy dark:group-hover:text-blue-400 transition-colors">
                        {partner.name}
                      </h3>
                      <p className="text-xs text-text-secondary font-medium mt-0.5">
                        {partner.territory_name || partner.role}
                      </p>
                    </div>

                    {/* Assigned Leads Highlight Strip */}
                    <div className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                      assignedCount > 0
                        ? 'bg-gradient-to-r from-brand-navy/10 via-surface to-brand-green/10 border-brand-navy/25 shadow-2xs'
                        : 'bg-surface-subtle/70 border-border-subtle'
                    }`}>
                      <div className="flex items-center gap-1.5">
                        <UserCheck className={`w-3.5 h-3.5 ${assignedCount > 0 ? 'text-brand-green' : 'text-text-tertiary'}`} />
                        <span className="text-[11px] font-bold text-text-secondary">Assigned Leads:</span>
                      </div>
                      <span className={`font-mono font-black text-xs px-2.5 py-0.5 rounded-lg ${
                        assignedCount > 0
                          ? 'bg-brand-navy text-white shadow-2xs'
                          : 'bg-surface text-text-tertiary border border-border-subtle'
                      }`}>
                        {assignedCount} {assignedCount === 1 ? 'Lead' : 'Leads'}
                      </span>
                    </div>

                    {/* Covered Cities Preview */}
                    {partner.cities && partner.cities.length > 0 && (
                      <div className="bg-surface-subtle/80 p-2.5 rounded-xl border border-border-subtle text-[11px] text-text-secondary">
                        <div className="flex items-center justify-between text-[10px] font-semibold text-text-tertiary mb-1">
                          <span>Covered Cities ({partner.cities.length})</span>
                        </div>
                        <p className="line-clamp-2 leading-relaxed">
                          {partner.cities.join(', ')}
                        </p>
                      </div>
                    )}

                  <div className="space-y-2 text-xs pt-2 border-t border-border-subtle text-text-secondary">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                        <span className="font-mono text-xs text-text-primary">{partner.whatsapp_number}</span>
                      </div>
                      <a
                        href={`https://wa.me/${partner.whatsapp_number.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[10px] text-brand-green hover:underline font-bold flex items-center gap-0.5"
                      >
                        Chat <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                    {partner.email && (
                      <div className="flex items-center space-x-2 truncate">
                        <Mail className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400 flex-shrink-0" />
                        <span className="truncate text-xs">{partner.email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="pt-3 mt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary">
                  <span className="text-[11px] font-mono text-text-secondary font-semibold">
                    {partner.territory_id || partner.id}
                  </span>
                  <span className="text-brand-green font-bold text-xs inline-flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Active
                  </span>
                </div>
              </Card>
            </motion.div>
            );
          })}

          {filteredPartners.length === 0 && (
            <div className="col-span-full py-10 text-center bg-surface border border-border-base rounded-card text-text-tertiary text-xs space-y-3 shadow-elevation-1">
              <Building className="w-8 h-8 text-text-tertiary mx-auto opacity-50" />
              <p>No channel partners found matching current filters.</p>
              {(searchTerm || selectedState !== 'all' || assignedOnlyFilter) && (
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedState('all');
                    setAssignedOnlyFilter(false);
                  }}
                  className="rounded-full mx-auto"
                >
                  Reset All Filters
                </Button>
              )}
            </div>
          )}
        </motion.div>
        </div>
      </div>

      {/* SECTION 2: INBOUND CHANNEL PARTNERS FROM WHATSAPP LEADS */}
      <div className="space-y-4 pt-4 border-t border-border-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-brand-navy/10 via-surface to-brand-green/10 border border-brand-navy/20 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div>
            <div className="flex items-center space-x-2 text-brand-green font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <MessageSquare className="w-4 h-4 text-brand-green" />
              <span>Inbound Partner Acquisition Engine</span>
            </div>
            <h3 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
              <span>Channel Partner Leads (From WhatsApp Ads)</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30">
                {partnerLeads.filter((l) => l.status !== 'Approved').length} Pending Review
              </span>
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-3xl">
              Dealers, distributors, and stockists acquired through our active Meta & WhatsApp Channel Partner Recruitment ad campaigns. Verify qualifications and approve them directly into your active network.
            </p>
          </div>

          {/* Filter Pills for Inbound Partner Leads */}
          <div className="flex items-center gap-1.5 self-start sm:self-center overflow-x-auto">
            {(['all', 'new', 'screening', 'approved'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setLeadsFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold capitalize transition cursor-pointer select-none ${
                  leadsFilter === f
                    ? 'bg-brand-navy text-white shadow-2xs'
                    : 'bg-surface border border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                {f === 'all' ? 'All Leads' : f}
              </button>
            ))}
          </div>
        </div>

        {/* INBOUND LEADS CARDS (3 COLUMNS & SCROLL CONTAINER) */}
        {isLoadingLeads ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading WhatsApp partner leads...</div>
        ) : (
          <div className="overflow-y-auto max-h-[640px] pr-2 table-scrollbar scroll-smooth rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5 pb-2">
            {filteredPartnerLeads.map((lead) => {
              const isApproved = lead.status === 'Approved';
              return (
                <Card
                  key={lead.id}
                  elevation={1}
                  glow={isApproved ? 'green' : 'navy'}
                  className="p-5 sm:p-6 space-y-4 flex flex-col justify-between border-brand-navy/20 transition-all duration-200"
                >
                  <div className="space-y-3">
                    {/* Header: Campaign Badge & Status */}
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-surface-subtle border border-border-subtle text-text-secondary flex items-center gap-1 truncate max-w-[200px]">
                        <MessageSquare className="w-3 h-3 text-brand-green flex-shrink-0" />
                        <span className="truncate">{lead.campaign}</span>
                      </span>
                      <span
                        className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                          isApproved
                            ? 'bg-brand-green/20 text-brand-green border-brand-green/30'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    {/* Firm Name & Contact */}
                    <div>
                      <h4 className="text-base font-extrabold text-text-primary leading-snug">
                        {lead.firm_name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-brand-navy dark:text-blue-400 font-bold mt-1">
                        <Briefcase className="w-3.5 h-3.5" />
                        <span>{lead.contact_person}</span>
                      </div>
                    </div>

                    {/* Location & Territory */}
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span className="font-medium">{lead.city}, {lead.state}</span>
                    </div>

                    {/* Business Profile Details */}
                    <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle text-xs space-y-2">
                      <p className="text-text-secondary leading-relaxed line-clamp-2">
                        {lead.business_profile}
                      </p>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle/60 text-[11px] font-mono">
                        {lead.warehouse_sqft && (
                          <div className="flex items-center gap-1 text-text-primary font-bold">
                            <Warehouse className="w-3 h-3 text-blue-400" />
                            <span>{lead.warehouse_sqft.toLocaleString()} sq ft</span>
                          </div>
                        )}
                        {lead.dealers_network_count && (
                          <div className="flex items-center gap-1 text-text-primary font-bold">
                            <Users className="w-3 h-3 text-purple-400" />
                            <span>{lead.dealers_network_count} Dealers</span>
                          </div>
                        )}
                      </div>

                      <div className="text-[11px] text-text-tertiary flex items-center gap-1 pt-1">
                        <TrendingUp className="w-3 h-3 text-brand-green" />
                        <span className="text-text-secondary font-medium">{lead.investment_capacity}</span>
                      </div>
                    </div>

                    {/* Lead Notes */}
                    {lead.notes && (
                      <p className="text-[11px] italic text-text-tertiary bg-canvas/60 p-2 rounded-lg border border-border-subtle/50">
                        {lead.notes}
                      </p>
                    )}
                  </div>

                  {/* Actions Bar */}
                  <div className="pt-3 border-t border-border-subtle space-y-2.5">
                    <div className="flex items-center justify-between text-[11px] text-text-tertiary font-mono">
                      <span>Applied: {lead.applied_at}</span>
                      <a
                        href={`https://wa.me/${lead.whatsapp_number.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.contact_person)},%20thank%20you%20for%20your%20interest%20in%20ColourPlus%20dealership.`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-green hover:underline font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isApproved ? (
                        <Button
                          variant="brand"
                          size="xs"
                          onClick={() => handleApproveLead(lead)}
                          leftIcon={<UserCheck className="w-3.5 h-3.5" />}
                          className="flex-1 rounded-xl font-bold py-2"
                        >
                          Approve as Partner
                        </Button>
                      ) : (
                        <span className="flex-1 text-center py-1.5 text-xs font-bold text-brand-green bg-brand-green/10 rounded-xl border border-brand-green/30 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Approved Partner
                        </span>
                      )}

                      <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => handleDeleteLead(lead.id, lead.firm_name)}
                        leftIcon={<Trash2 className="w-3.5 h-3.5 text-funnel-hot" />}
                        className="text-funnel-hot hover:bg-funnel-hot/10 rounded-xl"
                      >
                        Dismiss
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}

            {filteredPartnerLeads.length === 0 && (
              <div className="col-span-full py-10 text-center bg-surface border border-border-base rounded-card text-text-tertiary text-xs space-y-2 shadow-elevation-1">
                <MessageSquare className="w-8 h-8 text-text-tertiary mx-auto opacity-50" />
                <p>No inbound WhatsApp partner leads found for this filter.</p>
              </div>
            )}
          </div>
          </div>
        )}
      </div>

      {/* FOOTER NOTICE / RETURN TO DESK */}
      {onNavigateToDesk && (
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onNavigateToDesk}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Back to Lead Desk
          </Button>
        </div>
      )}

      {/* REMOVE CHANNEL PARTNER MODAL */}
      <RemoveChannelPartnerModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        partners={channelPartners}
        onRemovePartner={onRemovePartner}
      />
    </div>
  );
};
