import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Users, Send, Check, Sparkles, MapPin, ShieldCheck, ChevronDown, CheckCircle2, ArrowRight } from 'lucide-react';
import type { Lead, ChannelPartner } from '../types/crm';
import type { AssignLeadOptions } from '../services/api';
import { findSuggestedChannelPartner } from '../data/territories';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useToast } from '../context/ToastContext';

interface BulkAssignModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLeadIds: string[];
  leads: Lead[];
  channelPartners?: ChannelPartner[];
  onAssignMultipleLeads: (leadIds: string[], assignee: string, options?: AssignLeadOptions) => Promise<void>;
  onAutoAssignByTerritory?: (leadIds: string[]) => Promise<any>;
  onOpenAddChannelPartner?: () => void;
  onClearSelection?: () => void;
}

export const BulkAssignModal: React.FC<BulkAssignModalProps> = ({
  isOpen,
  onClose,
  selectedLeadIds,
  leads,
  channelPartners = [],
  onAssignMultipleLeads,
  onAutoAssignByTerritory,
  onOpenAddChannelPartner: _onOpenAddChannelPartner,
  onClearSelection,
}) => {
  const { toast } = useToast();
  const selectedLeads = useMemo(() => leads.filter((l) => selectedLeadIds.includes(l.id)), [leads, selectedLeadIds]);

  // Compute territory mappings for each selected lead
  const leadMappings = useMemo(() => {
    return selectedLeads.map((lead) => {
      const suggestion = findSuggestedChannelPartner(lead, channelPartners);
      return {
        lead,
        suggestion,
        targetPartnerName: suggestion.partner?.name || 'Regional Channel Partner',
        territoryId: suggestion.territory?.territoryId || 'CP-001',
        territoryName: suggestion.territory?.territoryName || 'Metro',
        matchedCity: suggestion.matchedCity || lead.location?.city || '',
      };
    });
  }, [selectedLeads, channelPartners]);

  // Group mappings by territory/partner
  const territorySummary = useMemo(() => {
    const summary: Record<string, { count: number; territoryName: string; partnerName: string; cities: string[] }> = {};
    leadMappings.forEach((m) => {
      const key = m.territoryId;
      if (!summary[key]) {
        summary[key] = {
          count: 0,
          territoryName: m.territoryName,
          partnerName: m.targetPartnerName,
          cities: [],
        };
      }
      summary[key].count += 1;
      if (m.matchedCity && !summary[key].cities.includes(m.matchedCity)) {
        summary[key].cities.push(m.matchedCity);
      }
    });
    return summary;
  }, [leadMappings]);

  const [assignmentMode, setAssignmentMode] = useState<'auto_territory' | 'single_partner'>('auto_territory');
  const [selectedRepName, setSelectedRepName] = useState<string>(
    channelPartners[0]?.name || ''
  );

  const [sendWhatsappAlert, setSendWhatsappAlert] = useState(true);
  const [sendEmailAlert, setSendEmailAlert] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ mode: string; count: number; details: string } | null>(null);

  const selectedPartner = channelPartners.find((cp) => cp.name === selectedRepName) || null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (assignmentMode === 'auto_territory') {
        if (onAutoAssignByTerritory) {
          await onAutoAssignByTerritory(selectedLeadIds);
        } else {
          // Fallback if prop not supplied
          for (const item of leadMappings) {
            await onAssignMultipleLeads([item.lead.id], item.targetPartnerName, {
              sendWhatsappAlert,
              sendEmailAlert,
              partner: item.suggestion.partner,
            });
          }
        }

        setSuccessInfo({
          mode: 'auto_territory',
          count: selectedLeadIds.length,
          details: `Mapped across ${Object.keys(territorySummary).length} territories based on lead cities`,
        });
      } else {
        if (!selectedRepName) return;
        await onAssignMultipleLeads(selectedLeadIds, selectedRepName, {
          sendWhatsappAlert,
          sendEmailAlert,
          partner: selectedPartner,
        });

        setSuccessInfo({
          mode: 'single_partner',
          count: selectedLeadIds.length,
          details: `Assigned directly to ${selectedRepName}`,
        });
      }

      setAssignmentSuccess(true);
      toast({
        title: 'Bulk Assignment Dispatched',
        message: `${selectedLeadIds.length} leads successfully assigned to territory partners.`,
        type: 'success',
      });

      setTimeout(() => {
        setAssignmentSuccess(false);
        setIsSubmitting(false);
        if (onClearSelection) onClearSelection();
        onClose();
      }, 2200);
    } catch (err) {
      console.error('Failed to bulk assign leads:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Bulk Assign Leads</span>
          <Badge variant="navy" size="xs">
            {selectedLeadIds.length} Leads
          </Badge>
        </div>
      }
      subtitle="Dispatch filtered leads to their respective territory channel partners (CP-001..CP-100) or a specific representative"
      icon={<Users className="w-5 h-5 text-brand-green" />}
      maxWidth="2xl"
    >
      {assignmentSuccess && successInfo ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3"
        >
          <div className="w-14 h-14 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-brand-green">
            <Check className="w-7 h-7 stroke-[3]" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-text-primary">
              {successInfo.count} Leads Successfully Assigned!
            </h4>
            <p className="text-xs text-text-secondary mt-1">
              {successInfo.details}. Technical briefs & WhatsApp alerts dispatched.
            </p>
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          
          {/* MODE SELECTOR TABS */}
          <div className="grid grid-cols-2 gap-2 bg-surface-subtle p-1.5 rounded-2xl border border-border-base">
            <button
              type="button"
              onClick={() => setAssignmentMode('auto_territory')}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                assignmentMode === 'auto_territory'
                  ? 'bg-brand-navy text-white shadow-2xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>⚡ Auto-Route by City / Territory</span>
            </button>

            <button
              type="button"
              onClick={() => setAssignmentMode('single_partner')}
              className={`py-2 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition cursor-pointer ${
                assignmentMode === 'single_partner'
                  ? 'bg-brand-navy text-white shadow-2xs'
                  : 'text-text-secondary hover:text-text-primary hover:bg-surface'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Assign All to One Partner</span>
            </button>
          </div>

          {/* TERRITORY AUTO-MAPPING PREVIEW */}
          {assignmentMode === 'auto_territory' ? (
            <div className="space-y-3">
              <div className="bg-gradient-to-r from-brand-navy/10 via-brand-navy/5 to-transparent border border-brand-navy/30 rounded-2xl p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-xs text-text-primary flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-brand-green" />
                    <span>Territory Routing Distribution</span>
                  </span>
                  <Badge variant="navy" size="xs">
                    {Object.keys(territorySummary).length} Channel Partners
                  </Badge>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {Object.entries(territorySummary).map(([tid, sum]) => (
                    <div
                      key={tid}
                      className="bg-surface p-2.5 rounded-xl border border-border-subtle flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono font-bold text-[11px] text-brand-navy dark:text-blue-400">
                            {tid}
                          </span>
                          <span className="font-semibold text-xs text-text-primary truncate">
                            {sum.territoryName}
                          </span>
                        </div>
                        <span className="text-[10px] text-text-tertiary truncate block">
                          Cities: {sum.cities.join(', ')}
                        </span>
                      </div>
                      <Badge variant="green" size="xs">
                        {sum.count} {sum.count === 1 ? 'Lead' : 'Leads'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* INDIVIDUAL LEADS LIST WITH TARGET TERRITORY */}
              <div className="bg-surface-subtle border border-border-base rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block font-mono">
                  Lead By Lead Territory Handoff Preview ({selectedLeads.length})
                </span>
                <div className="max-h-40 overflow-y-auto space-y-1.5 pr-1">
                  {leadMappings.map(({ lead, territoryId, territoryName, matchedCity }) => (
                    <div
                      key={lead.id}
                      className="bg-surface p-2 rounded-xl border border-border-subtle flex items-center justify-between gap-2 shadow-2xs text-[11px]"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-bold text-text-primary truncate">{lead.name}</span>
                        <span className="text-text-tertiary truncate">({lead.company})</span>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-text-secondary font-mono flex items-center gap-1 text-[10px]">
                          <MapPin className="w-3 h-3 text-rose-400" />
                          {matchedCity || lead.location?.city}
                        </span>
                        <ArrowRight className="w-3 h-3 text-text-tertiary" />
                        <span className="font-mono font-bold text-brand-navy dark:text-blue-400 bg-brand-navy/10 px-2 py-0.5 rounded-md">
                          {territoryId}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* SINGLE PARTNER SELECTION MODE */
            <div className="space-y-3">
              <div className="bg-surface-subtle border border-border-base rounded-2xl p-3.5 space-y-2">
                <label className="font-bold text-text-primary block text-xs">
                  Select Channel Partner / Representative
                </label>
                <div className="relative">
                  <select
                    aria-label="Select sales representative for bulk assignment"
                    value={selectedRepName}
                    onChange={(e) => setSelectedRepName(e.target.value)}
                    className="w-full bg-surface border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary text-xs font-medium focus:outline-none focus:border-brand-navy cursor-pointer shadow-2xs"
                    required
                  >
                    <option value="" disabled>-- Select Channel Partner --</option>
                    {channelPartners.map((cp) => (
                      <option key={cp.id} value={cp.name}>
                        {cp.id} - {cp.name} ({cp.state} • {cp.territory_name || cp.role})
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* LIST OF SELECTED LEADS CHIPS */}
              <div className="bg-surface-subtle border border-border-base rounded-2xl p-3.5 space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-text-secondary block font-mono">
                  Selected Leads ({selectedLeads.length})
                </span>
                <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1">
                  {selectedLeads.map((lead) => (
                    <div
                      key={lead.id}
                      className="bg-surface p-2 rounded-xl border border-border-subtle flex items-center justify-between gap-2 shadow-2xs"
                    >
                      <span className="font-bold text-text-primary truncate">{lead.name} ({lead.company})</span>
                      <span className="font-mono text-[10px] text-text-secondary flex-shrink-0">{lead.location.city}, {lead.location.state}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* DISPATCH ALERT TOGGLES */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-surface-subtle border border-border-base cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendWhatsappAlert}
                onChange={(e) => setSendWhatsappAlert(e.target.checked)}
                className="rounded accent-brand-navy w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-text-primary block">Dispatch WhatsApp Alerts</span>
                <span className="text-[11px] text-text-tertiary">Direct messages to each territory partner</span>
              </div>
            </label>

            <label className="flex items-center space-x-2.5 p-3 rounded-xl bg-surface-subtle border border-border-base cursor-pointer select-none">
              <input
                type="checkbox"
                checked={sendEmailAlert}
                onChange={(e) => setSendEmailAlert(e.target.checked)}
                className="rounded accent-brand-navy w-4 h-4"
              />
              <div className="text-xs">
                <span className="font-bold text-text-primary block">Dispatch Email Summary</span>
                <span className="text-[11px] text-text-tertiary">Consolidated briefing sheets</span>
              </div>
            </label>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border-subtle">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="brand"
              size="sm"
              disabled={(assignmentMode === 'single_partner' && !selectedRepName) || isSubmitting}
              isLoading={isSubmitting}
              leftIcon={<Send className="w-4 h-4" />}
              className="rounded-xl px-6"
            >
              {assignmentMode === 'auto_territory'
                ? `⚡ Auto-Assign ${selectedLeadIds.length} Leads to Respective CPs`
                : `Assign All ${selectedLeadIds.length} Leads`}
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
};

