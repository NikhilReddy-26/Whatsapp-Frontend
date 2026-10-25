import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Paintbrush,
  Search,
  Plus,
  Trash2,
  MapPin,
  Phone,
  Star,
  ShieldCheck,
  ArrowRight,
  Award,
  MessageSquare,
  CheckCircle2,
  ExternalLink,
  Users,
  Wrench,
  TrendingUp,
} from 'lucide-react';
import type { Applicator, ApplicatorLead } from '../types/crm';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AnimatedText } from './ui/AnimatedText';
import { AddApplicatorModal } from './AddApplicatorModal';
import { RemoveApplicatorModal } from './RemoveApplicatorModal';
import { perspectiveCardIn, staggerContainer } from '../lib/motion';
import { crmApi } from '../services/api';
import { useToast } from '../context/ToastContext';

interface ApplicatorsViewProps {
  onNavigateToDesk?: () => void;
  availableStates?: string[];
}

export const ApplicatorsView: React.FC<ApplicatorsViewProps> = ({ onNavigateToDesk, availableStates }) => {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');
  const [applicators, setApplicators] = useState<Applicator[]>([]);
  const [applicatorLeads, setApplicatorLeads] = useState<ApplicatorLead[]>([]);
  const [leadsFilter, setLeadsFilter] = useState<'all' | 'new' | 'audit' | 'certified'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = async () => {
    try {
      const [apps, leads] = await Promise.all([
        crmApi.getApplicators(),
        crmApi.getApplicatorLeads(),
      ]);
      setApplicators(apps);
      setApplicatorLeads(leads);
    } catch (err) {
      console.error('Failed to load applicators data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const specialties = [
    'PU Concrete & Heavy Duty Epoxy',
    'Pharma Cleanroom & Anti-Static ESD',
    'PU Waterproofing & Concrete Repairs',
    'Automobile Assembly & Warehousing Flooring',
    'Polyurea Liquid Membrane & Terrace Screed',
  ];

  const filtered = applicators.filter((app) => {
    const matchesSearch =
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.agency.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.specialization.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'all' || app.specialization === selectedSpecialty;
    return matchesSearch && matchesSpecialty;
  });

  const filteredApplicatorLeads = applicatorLeads.filter((lead) => {
    if (leadsFilter === 'all') return true;
    if (leadsFilter === 'new') return lead.status === 'New Application';
    if (leadsFilter === 'audit') return lead.status === 'Skill Audit Pending';
    if (leadsFilter === 'certified') return lead.status === 'Certified';
    return true;
  });

  const handleAddApplicator = async (newApp: Omit<Applicator, 'id'>) => {
    try {
      await crmApi.addApplicator(newApp);
      await loadData();
    } catch (err) {
      console.error('Failed to add applicator:', err);
    }
  };

  const handleRemoveApplicator = async (id: string) => {
    try {
      await crmApi.deleteApplicator(id);
      await loadData();
    } catch (err) {
      console.error('Failed to remove applicator:', err);
    }
  };

  const handleSingleRemove = (app: Applicator) => {
    handleRemoveApplicator(app.id);
    toast({
      title: 'Applicator Removed',
      message: `${app.name} removed from certified applicators directory.`,
      type: 'warning',
    });
  };

  const handleApproveLead = async (lead: ApplicatorLead) => {
    try {
      await crmApi.approveApplicatorLead(lead.id);
      await loadData();
      toast({
        title: 'Applicator Certified!',
        message: `${lead.firm_name} authorized and added to Certified Applicators (${lead.city}).`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to approve applicator lead:', err);
    }
  };

  const handleDeleteLead = async (leadId: string, firmName: string) => {
    try {
      await crmApi.deleteApplicatorLead(leadId);
      await loadData();
      toast({
        title: 'Application Dismissed',
        message: `${firmName} application dismissed.`,
        type: 'warning',
      });
    } catch (err) {
      console.error('Failed to delete applicator lead:', err);
    }
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
          <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <Paintbrush className="w-4 h-4" />
            <span>Authorized Contractors & Applicator Network</span>
          </div>
          <AnimatedText
            text="Certified Applicators"
            as="h2"
            className="text-2xl font-black text-text-primary tracking-tight"
          />
          <p className="text-xs text-text-secondary mt-1 max-w-2xl leading-relaxed">
            Verified industrial flooring contractors and certified polyurethane waterproofing applicators across regions.
          </p>
        </div>

        {/* Action Buttons: Add & Remove Applicator */}
        <div className="flex items-center flex-wrap gap-2.5 self-start sm:self-auto">
          <Button
            variant="brand"
            size="sm"
            onClick={() => setIsAddModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
            className="rounded-full shadow-2xs"
          >
            Add Applicator
          </Button>

          <Button
            variant="secondary"
            size="sm"
            onClick={() => setIsRemoveModalOpen(true)}
            leftIcon={<Trash2 className="w-4 h-4 text-funnel-hot" />}
            className="rounded-full text-funnel-hot border-funnel-hot/30 hover:bg-funnel-hot/10 hover:border-funnel-hot shadow-2xs"
          >
            Remove Applicator
          </Button>
        </div>
      </motion.div>

      {/* SECTION 1: CERTIFIED APPLICATORS */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border-subtle pb-3">
          <div className="flex items-center space-x-2.5">
            <ShieldCheck className="w-4 h-4 text-amber-500" />
            <h3 className="text-base font-bold text-text-primary">
              Certified Contractors & Master Applicators
            </h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-500 font-mono font-bold border border-amber-500/20">
              {applicators.length} Certified
            </span>
          </div>
        </div>

        {/* SEARCH & FILTER BAR */}
        <div className="flex flex-col sm:flex-row items-center gap-3 bg-surface border border-border-subtle rounded-2xl p-4 shadow-elevation-1">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search applicators by name, agency, city, or specialization..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-surface-subtle border border-border-base rounded-xl text-xs text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 transition shadow-2xs"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <select
              aria-label="Filter applicators by specialization"
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full sm:w-auto px-3.5 py-2 bg-surface-subtle border border-border-base rounded-xl text-xs text-text-primary focus:outline-none focus:border-amber-500 transition cursor-pointer shadow-2xs font-medium"
            >
              <option value="all">All Specializations ({applicators.length})</option>
              {specialties.map((sp) => (
                <option key={sp} value={sp}>
                  {sp}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* APPLICATORS GRID */}
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading certified applicators...</div>
        ) : (
          <motion.div
            variants={staggerContainer(0.06)}
            initial="initial"
            animate="animate"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4.5 sm:gap-5"
          >
            {filtered.map((app) => (
              <motion.div key={app.id} variants={perspectiveCardIn}>
                <Card
                  elevation={1}
                  interactive
                  className="p-5 sm:p-6 space-y-4 flex flex-col justify-between h-full group relative"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="warm" size="xs" icon={<ShieldCheck className="w-3 h-3" />}>
                        CERTIFIED
                      </Badge>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center space-x-1 text-amber-500 font-bold text-xs font-mono">
                          <Star className="w-3.5 h-3.5 fill-amber-400" />
                          <span>{app.rating}</span>
                        </div>
                        {/* Direct delete button on card */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSingleRemove(app);
                          }}
                          title={`Remove ${app.name}`}
                          className="p-1 rounded-lg text-text-tertiary hover:text-funnel-hot hover:bg-funnel-hot/10 transition cursor-pointer"
                          aria-label={`Remove ${app.name}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-text-primary group-hover:text-amber-500 transition-colors">
                        {app.name}
                      </h3>
                      <p className="text-xs text-text-secondary font-medium mt-0.5">{app.agency}</p>
                    </div>

                    <div className="bg-surface-subtle p-2.5 rounded-xl border border-border-subtle text-xs text-text-secondary">
                      <span className="font-bold text-text-primary block text-[11px] uppercase tracking-wider mb-0.5">
                        Specialization
                      </span>
                      <span className="line-clamp-1">{app.specialization}</span>
                    </div>

                    <div className="space-y-2 text-xs pt-3 border-t border-border-subtle text-text-secondary">
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{app.city}, {app.state}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                          <span className="font-mono text-xs text-text-primary">{app.phone}</span>
                        </div>
                        <a
                          href={`https://wa.me/${app.phone.replace(/\D/g, '')}`}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[10px] text-brand-green hover:underline font-bold flex items-center gap-0.5"
                        >
                          Chat <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 mt-2 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary">
                    <span className="font-mono text-[11px]">{app.experienceYears} Years Exp</span>
                    <span className="text-brand-green font-bold text-xs inline-flex items-center gap-1">
                      <Award className="w-3.5 h-3.5" /> ColourPlus Verified
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}

            {filtered.length === 0 && (
              <div className="col-span-full py-10 text-center bg-surface border border-border-base rounded-card text-text-tertiary text-xs space-y-2 shadow-elevation-1">
                <Paintbrush className="w-8 h-8 text-text-tertiary mx-auto opacity-50" />
                <p>No certified applicators found matching "{searchTerm}".</p>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* SECTION 2: INBOUND APPLICATOR LEADS FROM WHATSAPP ADS */}
      <div className="space-y-4 pt-4 border-t border-border-subtle">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-amber-500/10 via-surface to-brand-green/10 border border-amber-500/20 rounded-2xl p-4 sm:p-5 shadow-2xs">
          <div>
            <div className="flex items-center space-x-2 text-amber-500 font-bold text-xs uppercase tracking-wider mb-1 font-mono">
              <MessageSquare className="w-4 h-4 text-brand-green" />
              <span>Contractor Recruitment Pipeline</span>
            </div>
            <h3 className="text-lg font-black text-text-primary tracking-tight flex items-center gap-2">
              <span>Applicator Leads (From WhatsApp Ads)</span>
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500/30">
                {applicatorLeads.filter((l) => l.status !== 'Certified').length} Pending Certification
              </span>
            </h3>
            <p className="text-xs text-text-secondary mt-1 max-w-3xl">
              Flooring contractors and waterproofing application crews acquired through our targeted WhatsApp recruitment ads. Review crew size, equipment, and verify past industrial projects before issuing ColourPlus certification.
            </p>
          </div>

          {/* Filter Pills for Inbound Applicator Leads */}
          <div className="flex items-center gap-1.5 self-start sm:self-center overflow-x-auto">
            {(['all', 'new', 'audit', 'certified'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setLeadsFilter(f)}
                className={`text-xs px-3 py-1.5 rounded-xl font-bold capitalize transition cursor-pointer select-none ${
                  leadsFilter === f
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-surface border border-border-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                {f === 'all' ? 'All Inquiries' : f === 'audit' ? 'Audit Pending' : f}
              </button>
            ))}
          </div>
        </div>

        {/* INBOUND APPLICATOR LEADS GRID */}
        {isLoading ? (
          <div className="p-8 text-center text-xs text-text-tertiary">Loading WhatsApp contractor leads...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4.5 sm:gap-5">
            {filteredApplicatorLeads.map((lead) => {
              const isCertified = lead.status === 'Certified';
              return (
                <Card
                  key={lead.id}
                  elevation={1}
                  glow={isCertified ? 'green' : 'none'}
                  className="p-5 sm:p-6 space-y-4 flex flex-col justify-between border-amber-500/20 transition-all duration-200"
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
                          isCertified
                            ? 'bg-brand-green/20 text-brand-green border-brand-green/30'
                            : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>

                    {/* Contractor Name & Master */}
                    <div>
                      <h4 className="text-base font-extrabold text-text-primary leading-snug">
                        {lead.firm_name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mt-1">
                        <Paintbrush className="w-3.5 h-3.5" />
                        <span>{lead.master_contractor}</span>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-1 text-xs text-text-secondary">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                      <span className="font-medium">{lead.city}, {lead.state}</span>
                    </div>

                    {/* Technical Profile Details */}
                    <div className="bg-surface-subtle p-3 rounded-xl border border-border-subtle text-xs space-y-2">
                      <div>
                        <span className="text-[10px] uppercase font-mono font-bold text-text-tertiary block">
                          Specialization
                        </span>
                        <p className="text-text-primary font-bold">{lead.specialization}</p>
                      </div>

                      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-border-subtle/60 text-[11px] font-mono">
                        <div className="flex items-center gap-1 text-text-primary font-bold">
                          <Users className="w-3 h-3 text-purple-400" />
                          <span>{lead.crew_size} Crew Members</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-primary font-bold">
                          <Award className="w-3 h-3 text-amber-400" />
                          <span>{lead.experience_years} Yrs Exp</span>
                        </div>
                      </div>

                      <div className="pt-1.5 border-t border-border-subtle/50 text-[11px] space-y-1">
                        <div className="flex items-start gap-1 text-text-secondary">
                          <Wrench className="w-3 h-3 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="line-clamp-2">{lead.machinery_equipment}</span>
                        </div>
                        <div className="flex items-center gap-1 text-text-tertiary pt-0.5">
                          <TrendingUp className="w-3 h-3 text-brand-green" />
                          <span className="font-mono text-text-secondary font-medium">Capacity: {lead.weekly_capacity_sqft}</span>
                        </div>
                      </div>
                    </div>

                    {/* Notes */}
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
                        href={`https://wa.me/${lead.whatsapp_number.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(lead.master_contractor)},%20we%20received%20your%20applicator%20certification%20request.`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-brand-green hover:underline font-bold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3" />
                        <span>Chat WhatsApp</span>
                      </a>
                    </div>

                    <div className="flex items-center gap-2">
                      {!isCertified ? (
                        <Button
                          variant="brand"
                          size="xs"
                          onClick={() => handleApproveLead(lead)}
                          leftIcon={<Award className="w-3.5 h-3.5" />}
                          className="flex-1 rounded-xl font-bold py-2 bg-amber-500 hover:bg-amber-600 border-amber-600"
                        >
                          Verify & Certify
                        </Button>
                      ) : (
                        <span className="flex-1 text-center py-1.5 text-xs font-bold text-brand-green bg-brand-green/10 rounded-xl border border-brand-green/30 flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Certified Contractor
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

            {filteredApplicatorLeads.length === 0 && (
              <div className="col-span-full py-10 text-center bg-surface border border-border-base rounded-card text-text-tertiary text-xs space-y-2 shadow-elevation-1">
                <MessageSquare className="w-8 h-8 text-text-tertiary mx-auto opacity-50" />
                <p>No inbound WhatsApp applicator leads found for this filter.</p>
              </div>
            )}
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

      {/* ADD APPLICATOR MODAL */}
      <AddApplicatorModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddApplicator={handleAddApplicator}
        availableStates={availableStates}
      />

      {/* REMOVE APPLICATOR MODAL */}
      <RemoveApplicatorModal
        isOpen={isRemoveModalOpen}
        onClose={() => setIsRemoveModalOpen(false)}
        applicators={applicators}
        onRemoveApplicator={handleRemoveApplicator}
      />
    </div>
  );
};
