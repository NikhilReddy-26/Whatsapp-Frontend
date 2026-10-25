import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  UserCheck,
  Send,
  MapPin,
  Building,
  Phone,
  Mail,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ExternalLink,
  UserPlus,
  Sparkles,
  ShieldCheck,
  Target,
} from 'lucide-react';
import type { Lead, ChannelPartner } from '../types/crm';
import type { AssignLeadOptions } from '../services/api';
import { formatLeadAssignmentMessage } from '../utils/formatAssignmentMessage';
import { findSuggestedChannelPartner } from '../data/territories';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { useToast } from '../context/ToastContext';

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onAssign: (leadId: string, assignee: string, options?: AssignLeadOptions) => void;
  channelPartners?: ChannelPartner[];
  onOpenAddChannelPartner?: () => void;
}

export const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onAssign,
  channelPartners = [],
  onOpenAddChannelPartner,
}) => {
  const { toast } = useToast();
  const isCurrentlyAssigned = Boolean(
    lead?.assigned_to &&
    lead.assigned_to.trim() !== '' &&
    !lead.assigned_to.toLowerCase().includes('unassigned') &&
    !lead.assigned_to.toLowerCase().includes('disqualification')
  );

  // Compute territory suggestion based on lead city & state
  const suggestion = React.useMemo(() => {
    if (!lead) return null;
    return findSuggestedChannelPartner(lead, channelPartners);
  }, [lead, channelPartners]);

  const defaultRep = (isCurrentlyAssigned && lead?.assigned_to) || (suggestion?.partner?.name) || (channelPartners.length > 0 ? channelPartners[0].name : '');
  const [selectedRepName, setSelectedRepName] = useState<string>(defaultRep);

  useEffect(() => {
    if (lead) {
      const isLeadAssigned = Boolean(
        lead.assigned_to &&
        lead.assigned_to.trim() !== '' &&
        !lead.assigned_to.toLowerCase().includes('unassigned') &&
        !lead.assigned_to.toLowerCase().includes('disqualification')
      );
      const sugg = findSuggestedChannelPartner(lead, channelPartners);
      setSelectedRepName(
        (isLeadAssigned && lead.assigned_to) || (sugg?.partner?.name) || (channelPartners.length > 0 ? channelPartners[0].name : '')
      );
    }
  }, [lead, channelPartners]);

  const [sendWhatsappAlert, setSendWhatsappAlert] = useState(true);
  const [sendEmailAlert, setSendEmailAlert] = useState(true);
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [assignmentSuccess, setAssignmentSuccess] = useState(false);
  const [successInfo, setSuccessInfo] = useState<{ repName: string; email: string; phone: string } | null>(null);

  const selectedPartner = channelPartners.find((cp) => cp.name === selectedRepName) || null;
  const formattedMessage = lead ? formatLeadAssignmentMessage(lead, selectedPartner, selectedRepName) : '';

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(formattedMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !selectedRepName) return;

    onAssign(lead.id, selectedRepName, {
      sendWhatsappAlert,
      sendEmailAlert,
      partner: selectedPartner,
    });

    setSuccessInfo({
      repName: selectedRepName,
      email: selectedPartner?.email || 'sales.team@colourplus.co.in',
      phone: selectedPartner?.whatsapp_number || '+91 98000 00000',
    });
    setAssignmentSuccess(true);

    toast({
      title: 'Lead Dispatched',
      message: `Assigned to ${selectedRepName} with technical brief dispatched.`,
      type: 'success',
    });

    setTimeout(() => {
      setAssignmentSuccess(false);
      onClose();
    }, 2200);
  };

  const previewLines = formattedMessage.split('\n');

  return (
    <Modal
      isOpen={isOpen && !!lead}
      onClose={onClose}
      title="Assign Lead to Sales Representative"
      subtitle="Dispatches full project intelligence, location & extracted chat data via WhatsApp & Email"
      icon={<UserCheck className="w-5 h-5 text-brand-navy dark:text-blue-400" />}
      maxWidth="2xl"
    >
      {!lead ? null : assignmentSuccess && successInfo ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-6 text-center space-y-3"
        >
          <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto text-brand-green">
            <Check className="w-6 h-6 stroke-[3]" />
          </div>
          <div>
            <h4 className="text-base font-bold text-text-primary">Lead Successfully Assigned!</h4>
            <p className="text-xs text-text-secondary mt-1">
              Routed to <strong className="text-text-primary">{successInfo.repName}</strong>
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2 text-xs pt-1">
            {sendWhatsappAlert && (
              <span className="bg-surface border border-border-base px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs font-mono text-[11px]">
                <MessageSquare className="w-3.5 h-3.5 text-brand-green" />
                <span>WhatsApp to {successInfo.phone}</span>
              </span>
            )}
            {sendEmailAlert && (
              <span className="bg-surface border border-border-base px-3 py-1 rounded-full flex items-center gap-1.5 shadow-2xs font-mono text-[11px]">
                <Mail className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400" />
                <span>Email to {successInfo.email}</span>
              </span>
            )}
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 text-xs">
          
          {/* LEAD SUMMARY CARD */}
          <div className="bg-surface-subtle border border-border-base rounded-2xl p-4 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-2.5">
              <div className="flex items-center space-x-2">
                <Building className="w-4 h-4 text-brand-navy dark:text-blue-400" />
                <span className="font-extrabold text-sm text-text-primary">{lead.name}</span>
                <span className="text-text-tertiary font-medium">({lead.company})</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={lead.funnel === 'HOT' ? 'hot' : 'warm'} size="xs">
                  {lead.funnel} ({lead.score}/100)
                </Badge>
                <span className="text-text-tertiary flex items-center gap-1 font-mono">
                  <Phone className="w-3 h-3 text-brand-green" /> {lead.whatsapp_number}
                </span>
              </div>
            </div>

            {/* LOCATION DETAILS */}
            <div className="bg-surface p-3 rounded-xl border border-border-subtle space-y-1.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase tracking-wider text-[10px] flex items-center gap-1 text-rose-500 font-mono">
                  <MapPin className="w-3.5 h-3.5" /> Site Location Details:
                </span>
                {lead.location?.maps_link && (
                  <a
                    href={lead.location.maps_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-[11px] text-brand-navy dark:text-blue-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <span>Open Maps</span> <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
              <p className="text-text-primary text-xs font-medium">
                {lead.location?.address || 'Location address not specified'}
              </p>
              <div className="flex flex-wrap gap-3 text-[11px] text-text-secondary pt-0.5">
                <span>City: <strong className="text-text-primary">{lead.location?.city}, {lead.location?.state}</strong></span>
                {lead.location?.area_sqft && (
                  <span>Project Area: <strong className="text-brand-green font-mono">{lead.location.area_sqft.toLocaleString()} sq ft</strong></span>
                )}
              </div>
            </div>
          </div>

          {/* TERRITORY & CHANNEL PARTNER SMART RECOMMENDATION BANNER */}
          {suggestion?.partner && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-brand-navy/10 via-brand-navy/5 to-transparent border border-brand-navy/30 dark:border-blue-500/30 rounded-2xl p-3.5 space-y-2 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-xl bg-brand-navy/15 text-brand-navy dark:text-blue-400">
                    <Sparkles className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400" />
                  </span>
                  <div>
                    <span className="font-extrabold text-xs text-text-primary block">
                      Territory Channel Partner Recommendation
                    </span>
                    <span className="text-[11px] text-text-tertiary">
                      Matched by city: <strong className="text-text-primary">{lead.location?.city}</strong> ({suggestion.territory?.territoryName})
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="navy" size="xs">
                    {suggestion.territory?.territoryId || suggestion.partner.id}
                  </Badge>
                  {selectedRepName !== suggestion.partner.name && (
                    <button
                      type="button"
                      onClick={() => setSelectedRepName(suggestion.partner.name)}
                      className="px-2.5 py-1 rounded-lg bg-brand-navy text-white text-[11px] font-bold hover:bg-brand-navy/90 transition shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="w-3 h-3" /> Select Match
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-text-secondary pt-1 border-t border-brand-navy/15">
                <span className="font-bold text-text-primary flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-brand-green" /> {suggestion.partner.name}
                </span>
                <span>•</span>
                <span className="font-mono text-xs">{suggestion.partner.whatsapp_number}</span>
                <span>•</span>
                <span className="text-brand-green font-semibold">{suggestion.matchReason}</span>
              </div>

              {suggestion.territory?.cities && (
                <p className="text-[10px] text-text-tertiary truncate">
                  <strong className="text-text-secondary">Cities in Territory:</strong> {suggestion.territory.cities.join(', ')}
                </p>
              )}
            </motion.div>
          )}

          {/* SELECT CHANNEL PARTNER / SALES REP */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-bold text-text-primary block text-xs">
                Select Representative / Channel Partner
              </label>
              {onOpenAddChannelPartner && (
                <button
                  type="button"
                  onClick={onOpenAddChannelPartner}
                  className="text-brand-navy dark:text-blue-400 hover:underline flex items-center gap-1 font-bold text-[11px] cursor-pointer"
                >
                  <UserPlus className="w-3 h-3" /> + Add New Partner
                </button>
              )}
            </div>

            <div className="relative">
              <select
                aria-label="Select sales representative"
                value={selectedRepName}
                onChange={(e) => setSelectedRepName(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary text-xs font-medium focus:outline-none focus:border-brand-navy cursor-pointer shadow-2xs"
                required
              >
                <option value="" disabled>-- Select Channel Partner / Sales Representative --</option>
                {suggestion?.partner && (
                  <optgroup label="⭐ RECOMMENDED TERRITORY MATCH (Based on Lead City)">
                    <option value={suggestion.partner.name}>
                      ⭐ {suggestion.partner.name} - {suggestion.partner.id} ({suggestion.territory?.territoryName})
                    </option>
                  </optgroup>
                )}
                {lead.location?.state && (
                  <optgroup label={`TERRITORY PARTNERS IN ${lead.location.state.toUpperCase()}`}>
                    {channelPartners
                      .filter((cp) => cp.state.toLowerCase() === lead.location.state.toLowerCase() && cp.name !== suggestion?.partner?.name)
                      .map((cp) => (
                        <option key={cp.id} value={cp.name}>
                          {cp.id} - {cp.name} ({cp.territory_name || cp.state})
                        </option>
                      ))}
                  </optgroup>
                )}
                <optgroup label="ALL 100 TERRITORY PARTNERS (CP-001 to CP-100)">
                  {channelPartners
                    .filter((cp) => cp.name !== suggestion?.partner?.name)
                    .map((cp) => (
                      <option key={cp.id} value={cp.name}>
                        {cp.id} - {cp.name} ({cp.state} • {cp.territory_name || cp.role})
                      </option>
                    ))}
                </optgroup>
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

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
                <span className="font-bold text-text-primary block">Dispatch WhatsApp Alert</span>
                <span className="text-[11px] text-text-tertiary">Direct handoff into rep's phone</span>
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
                <span className="font-bold text-text-primary block">Dispatch Email Brief</span>
                <span className="text-[11px] text-text-tertiary">Detailed technical specification PDF</span>
              </div>
            </label>
          </div>

          {/* EXPANDABLE LINE-BY-LINE DISPATCH PREVIEW */}
          <div className="space-y-2 pt-1 border-t border-border-subtle">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setShowPreview(!showPreview)}
                className="text-xs text-text-secondary hover:text-text-primary flex items-center gap-1 font-semibold cursor-pointer"
              >
                {showPreview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                <span>{showPreview ? 'Hide Dispatch Preview' : 'Show WhatsApp Dispatch Message Preview'}</span>
              </button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="text-xs text-brand-navy dark:text-blue-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-brand-green" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied to Clipboard!' : 'Copy Template'}</span>
              </button>
            </div>

            <AnimatePresence>
              {showPreview && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-canvas border border-border-base rounded-xl p-3.5 font-mono text-[11px] text-text-secondary max-h-52 overflow-y-auto space-y-1 overflow-hidden"
                >
                  {previewLines.map((line, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -6 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.02, duration: 0.15 }}
                      className="whitespace-pre-wrap leading-relaxed"
                    >
                      {line}
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center justify-end space-x-3 pt-3 border-t border-border-subtle">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              variant="brand"
              size="sm"
              disabled={!selectedRepName}
              leftIcon={<Send className="w-4 h-4" />}
              className="rounded-xl px-6"
            >
              Dispatch & Assign Lead
            </Button>
          </div>

        </form>
      )}
    </Modal>
  );
};
