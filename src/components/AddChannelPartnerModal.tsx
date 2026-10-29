import React, { useState, useEffect, useMemo } from 'react';
import {
  UserPlus,
  User,
  Briefcase,
  Mail,
  MapPin,
  Phone,
  Hash,
  Award,
  Plus,
  X,
  ExternalLink,
  Eye,
  Building2,
  Sparkles,
  ShieldCheck,
  Check,
  AlertCircle,
  RotateCcw,
} from 'lucide-react';
import type { ChannelPartner } from '../types/crm';
import { getTerritoriesForState } from '../data/territories';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

interface AddChannelPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddPartner: (partner: Omit<ChannelPartner, 'id'> & { id?: string }) => Promise<void> | void;
  availableStates?: string[];
  existingPartners?: ChannelPartner[];
}

export const AddChannelPartnerModal: React.FC<AddChannelPartnerModalProps> = ({
  isOpen,
  onClose,
  onAddPartner,
  availableStates: availableStatesProp,
  existingPartners = [],
}) => {
  const { toast } = useToast();

  const defaultStates = [
    'Karnataka',
    'Maharashtra',
    'Tamil Nadu',
    'Telangana',
    'Gujarat',
    'Andhra Pradesh',
    'Kerala',
    'Delhi NCR',
    'Rajasthan',
    'West Bengal',
    'Madhya Pradesh',
    'Haryana',
    'Punjab',
    'Odisha',
    'Uttar Pradesh',
    'Goa',
  ];

  const statesList = availableStatesProp && availableStatesProp.length > 0 ? availableStatesProp : defaultStates;

  // Compute next CP ID e.g. 'CP-101'
  const computeNextId = (partners: ChannelPartner[]) => {
    if (!partners || partners.length === 0) return 'CP-101';
    const highestNum = partners.reduce((max, cp) => {
      const m = (cp.id || '').match(/CP-(\d+)/i);
      return m ? Math.max(max, parseInt(m[1], 10)) : max;
    }, 0);
    return `CP-${String(highestNum + 1).padStart(3, '0')}`;
  };

  const [partnerId, setPartnerId] = useState('CP-101');
  const [priorityTier, setPriorityTier] = useState('Tier 2 - Growth');
  const [state, setState] = useState('Karnataka');
  const [territoryName, setTerritoryName] = useState('Hubli-Dharwad Industrial Belt');
  const [cities, setCities] = useState<string[]>(['Hubli', 'Dharwad', 'Belagavi', 'Gadag']);
  const [newCityInput, setNewCityInput] = useState('');
  const [name, setName] = useState('CP-101 (Hubli-Dharwad Industrial Belt)');
  const [autoSyncName, setAutoSyncName] = useState(true);
  const [role, setRole] = useState('Channel Partner (Tier 2)');
  const [whatsappNumber, setWhatsappNumber] = useState('');
  const [email, setEmail] = useState('');
  const [demandDrivers, setDemandDrivers] = useState('Engineering, auto-ancillaries, warehousing & agro-logistics');
  const [activeTab, setActiveTab] = useState<'form' | 'preview'>('form');

  // Initialize defaults whenever modal opens
  useEffect(() => {
    if (isOpen) {
      const nextId = computeNextId(existingPartners);
      const defaultState = statesList[0] || 'Karnataka';
      const initialTerritory = 'Hubli-Dharwad Industrial Belt';
      setPartnerId(nextId);
      setState(defaultState);
      setPriorityTier('Tier 2 - Growth');
      setTerritoryName(initialTerritory);
      setCities(['Hubli', 'Dharwad', 'Belagavi', 'Gadag']);
      setName(`${nextId} (${initialTerritory})`);
      setAutoSyncName(true);
      setRole('Channel Partner (Tier 2)');
      setWhatsappNumber('+91 98');
      setEmail(`${nextId.toLowerCase()}@channelpartner.colourplus.co.in`);
      setDemandDrivers('Engineering, auto-ancillaries, warehousing & agro-logistics');
      setActiveTab('form');
    }
  }, [isOpen, existingPartners]);

  // Sync name with ID & Territory Name if autoSync is true
  useEffect(() => {
    if (autoSyncName) {
      const cleanId = partnerId.trim() || 'CP-XXX';
      const cleanTerritory = territoryName.trim();
      setName(cleanTerritory ? `${cleanId} (${cleanTerritory})` : cleanId);
    }
  }, [partnerId, territoryName, autoSyncName]);

  // Sync role with priority tier if standard
  const handleTierChange = (tier: string) => {
    setPriorityTier(tier);
    const tierShort = tier.split(' - ')[0]; // 'Tier 1', 'Tier 2', etc.
    setRole(`Channel Partner (${tierShort})`);
  };

  // Check if Partner ID already exists
  const isIdDuplicate = useMemo(() => {
    if (!partnerId.trim()) return false;
    return existingPartners.some((cp) => cp.id.toLowerCase() === partnerId.trim().toLowerCase());
  }, [partnerId, existingPartners]);

  // Popular / available cities for currently selected state
  const suggestedCitiesForState = useMemo(() => {
    const territoryList = getTerritoriesForState(state);
    const existingCities = existingPartners
      .filter((cp) => cp.state.toLowerCase() === state.toLowerCase())
      .flatMap((cp) => cp.cities || []);

    const allTerritoryCities = territoryList.flatMap((t) => t.cities || []);
    const merged = Array.from(new Set([...allTerritoryCities, ...existingCities]))
      .map((c) => c.trim())
      .filter((c) => c.length > 1);

    return merged.slice(0, 16);
  }, [state, existingPartners]);

  // Add City Handler
  const handleAddCity = (cityName?: string) => {
    const raw = cityName !== undefined ? cityName : newCityInput;
    if (!raw || !raw.trim()) return;

    // Support comma-separated batch input
    const parts = raw
      .split(/[,;\n]+/)
      .map((p) => p.trim())
      .filter(Boolean);

    const updated = [...cities];
    parts.forEach((p) => {
      if (!updated.some((c) => c.toLowerCase() === p.toLowerCase())) {
        updated.push(p);
      }
    });

    setCities(updated);
    if (cityName === undefined) {
      setNewCityInput('');
    }
  };

  // Remove City Handler
  const handleRemoveCity = (cityToRemove: string) => {
    setCities(cities.filter((c) => c !== cityToRemove));
  };

  // State Change Handler - suggests regional territory and reset sample cities
  const handleStateChange = (newState: string) => {
    setState(newState);
    const stateTerrs = getTerritoriesForState(newState);
    if (stateTerrs.length > 0) {
      const topTerr = stateTerrs[0];
      setTerritoryName(`${newState} Central Corridor`);
      if (topTerr.cities && topTerr.cities.length > 0) {
        setCities(topTerr.cities.slice(0, 5));
      }
    } else {
      setTerritoryName(`${newState} Regional Belt`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const finalPartnerId = partnerId.trim().toUpperCase() || computeNextId(existingPartners);
    const finalTerritoryName = territoryName.trim() || `${state} Territory`;
    const finalName = name.trim() || `${finalPartnerId} (${finalTerritoryName})`;

    if (!whatsappNumber.trim()) {
      toast({
        title: 'Missing WhatsApp Number',
        message: 'A valid WhatsApp phone number is required for instant lead dispatch.',
        type: 'warning',
      });
      return;
    }

    if (isIdDuplicate) {
      toast({
        title: 'Duplicate Partner ID',
        message: `Partner ID "${finalPartnerId}" is already assigned. Please choose a unique ID.`,
        type: 'error',
      });
      return;
    }

    try {
      await onAddPartner({
        id: finalPartnerId,
        name: finalName,
        role: role.trim() || `Channel Partner (${priorityTier.split(' - ')[0]})`,
        email: email.trim() || `${finalPartnerId.toLowerCase()}@channelpartner.colourplus.co.in`,
        state: state.trim(),
        whatsapp_number: whatsappNumber.trim(),
        territory_id: finalPartnerId,
        territory_name: finalTerritoryName,
        cities: cities.length > 0 ? cities : [finalTerritoryName],
        priority_tier: priorityTier,
        demand_drivers: demandDrivers.trim(),
      });
    } catch (err) {
      toast({
        title: 'Could Not Register Partner',
        message: err instanceof Error ? err.message : 'Please try again.',
        type: 'error',
      });
      return;
    }

    toast({
      title: 'Channel Partner Registered',
      message: `${finalPartnerId} • ${finalTerritoryName} registered with ${cities.length} covered cities.`,
      type: 'success',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <span>Add Channel Partner & Territory</span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-brand-navy/10 text-brand-navy dark:text-blue-400 font-bold border border-brand-navy/20">
            {partnerId || 'CP-NEW'}
          </span>
        </div>
      }
      subtitle="Register an authorized territory distributor with ID, state, covered cities & contact parameters matching existing partner network"
      icon={<UserPlus className="w-5 h-5 text-brand-navy dark:text-blue-400" />}
      maxWidth="2xl"
    >
      {/* VIEW TABS: FORM vs LIVE DIRECTORY PREVIEW */}
      <div className="flex items-center justify-between border-b border-border-subtle pb-3 mb-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('form')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'form'
                ? 'bg-brand-navy text-white shadow-2xs'
                : 'bg-surface-subtle text-text-secondary hover:text-text-primary'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Partner Configuration</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('preview')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'preview'
                ? 'bg-brand-navy text-white shadow-2xs'
                : 'bg-surface-subtle text-text-secondary hover:text-text-primary'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Card Preview & Comparison ({cities.length} Cities)</span>
          </button>
        </div>

        <span className="text-[11px] text-text-tertiary hidden sm:inline-block">
          Matches directory schema of {existingPartners.length} partners
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4.5 text-xs max-h-[72vh] overflow-y-auto pr-1 table-scrollbar">
        {activeTab === 'preview' ? (
          /* LIVE COMPARISON PREVIEW TAB */
          <div className="space-y-4">
            <div className="bg-brand-navy/5 dark:bg-blue-950/30 border border-brand-navy/20 rounded-2xl p-3.5 text-xs text-text-secondary flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-brand-navy dark:text-blue-400 mt-0.5 flex-shrink-0" />
              <div>
                <span className="font-bold text-text-primary block">
                  Live Card Preview vs. Existing Channel Partner Cards
                </span>
                <p className="text-[11px] text-text-tertiary mt-0.5 leading-relaxed">
                  Below is how this newly created channel partner will render inside the 3-column directory grid alongside
                  other authorized territory partners. All fields (ID badge, Priority Tier, State, Covered Cities count,
                  and WhatsApp contact) are matched to the existing schema.
                </p>
              </div>
            </div>

            {/* PREVIEW CARD STYLED EXACTLY LIKE ChannelPartnersView.tsx */}
            <div className="p-5 rounded-2xl bg-surface border border-border-base shadow-elevation-1 space-y-3.5 flex flex-col justify-between max-w-md mx-auto">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className="font-mono font-black text-xs px-2.5 py-1 rounded-lg bg-brand-navy text-white shadow-2xs">
                      {partnerId || 'CP-NEW'}
                    </span>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-surface-subtle border border-border-subtle text-text-secondary">
                      {priorityTier.split(' - ')[0]}
                    </span>
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 shadow-2xs bg-surface-subtle text-text-tertiary border-border-subtle">
                      <ShieldCheck className="w-3 h-3 text-text-tertiary" />
                      <span>0 Leads</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-medium text-text-tertiary flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      {state}
                    </span>
                  </div>
                </div>

                <div>
                  <h3 className="text-base font-bold text-text-primary">
                    {name || `${partnerId} (${territoryName})`}
                  </h3>
                  <p className="text-xs text-text-secondary font-medium mt-0.5">
                    {territoryName || role}
                  </p>
                </div>

                {/* Assigned Leads Highlight Strip */}
                <div className="p-2.5 rounded-xl border flex items-center justify-between text-xs bg-surface-subtle/70 border-border-subtle">
                  <div className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-text-tertiary" />
                    <span className="text-[11px] font-bold text-text-secondary">Assigned Leads:</span>
                  </div>
                  <span className="font-mono font-black text-xs px-2.5 py-0.5 rounded-lg bg-surface text-text-tertiary border border-border-subtle">
                    0 Leads
                  </span>
                </div>

                {/* Covered Cities Preview */}
                <div className="bg-surface-subtle/80 p-2.5 rounded-xl border border-border-subtle text-[11px] text-text-secondary">
                  <div className="flex items-center justify-between text-[10px] font-semibold text-text-tertiary mb-1">
                    <span>Covered Cities ({cities.length})</span>
                    <span className="text-brand-navy dark:text-blue-400 font-mono">
                      Territory ID: {partnerId}
                    </span>
                  </div>
                  <p className="line-clamp-2 leading-relaxed">
                    {cities.length > 0 ? cities.join(', ') : 'No cities assigned yet.'}
                  </p>
                </div>

                <div className="space-y-2 text-xs pt-2 border-t border-border-subtle text-text-secondary">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Phone className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                      <span className="font-mono text-xs text-text-primary">
                        {whatsappNumber || '+91 98000 00000'}
                      </span>
                    </div>
                    <span className="text-[10px] text-brand-green font-bold flex items-center gap-0.5">
                      Chat <ExternalLink className="w-2.5 h-2.5" />
                    </span>
                  </div>
                  {email && (
                    <div className="flex items-center space-x-2 truncate">
                      <Mail className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400 flex-shrink-0" />
                      <span className="truncate text-xs">{email}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-center pt-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setActiveTab('form')}
              >
                Back to Edit Fields
              </Button>
            </div>
          </div>
        ) : (
          /* PARTNER CONFIGURATION FORM TAB */
          <div className="space-y-4.5">
            {/* SECTION 1: TERRITORY IDENTIFIER & STATE */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div className="flex items-center gap-1.5 font-bold text-text-primary text-xs">
                  <Hash className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400" />
                  <span>Territory Identification & Classification</span>
                </div>
                <span className="text-[10px] text-text-tertiary font-mono">
                  Existing Partners: {existingPartners.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* Channel Partner ID */}
                <div className="space-y-1.5">
                  <label className="font-bold text-text-secondary flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Hash className="w-3 h-3 text-brand-navy dark:text-blue-400" />
                      Partner ID <span className="text-funnel-hot">*</span>
                    </span>
                    {isIdDuplicate ? (
                      <span className="text-[10px] text-funnel-hot flex items-center gap-0.5 font-normal">
                        <AlertCircle className="w-2.5 h-2.5" /> Duplicate
                      </span>
                    ) : (
                      <span className="text-[10px] text-brand-green flex items-center gap-0.5 font-normal">
                        <Check className="w-2.5 h-2.5" /> Valid
                      </span>
                    )}
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CP-101"
                    value={partnerId}
                    onChange={(e) => setPartnerId(e.target.value.toUpperCase())}
                    className={`w-full bg-surface-subtle border rounded-xl px-3 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none transition shadow-2xs font-mono font-bold ${
                      isIdDuplicate
                        ? 'border-funnel-hot text-funnel-hot focus:border-funnel-hot'
                        : 'border-border-base focus:border-brand-navy'
                    }`}
                    required
                  />
                </div>

                {/* State / Territory Dropdown */}
                <div className="space-y-1.5">
                  <label className="font-bold text-text-secondary flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-500" />
                    <span>State / Region</span>
                    <span className="text-funnel-hot">*</span>
                  </label>
                  <select
                    aria-label="State / Region"
                    value={state}
                    onChange={(e) => handleStateChange(e.target.value)}
                    className="w-full bg-surface-subtle border border-border-base text-text-primary rounded-xl px-3 py-2 focus:outline-none focus:border-brand-navy transition cursor-pointer shadow-2xs font-medium"
                  >
                    {statesList.map((st) => (
                      <option key={st} value={st}>
                        {st}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Priority Tier */}
                <div className="space-y-1.5">
                  <label className="font-bold text-text-secondary flex items-center gap-1">
                    <Award className="w-3 h-3 text-amber-500" />
                    <span>Priority Tier</span>
                    <span className="text-funnel-hot">*</span>
                  </label>
                  <select
                    aria-label="Priority Tier"
                    value={priorityTier}
                    onChange={(e) => handleTierChange(e.target.value)}
                    className="w-full bg-surface-subtle border border-border-base text-text-primary rounded-xl px-3 py-2 focus:outline-none focus:border-brand-navy transition cursor-pointer shadow-2xs font-medium"
                  >
                    <option value="Tier 1 - Core">Tier 1 - Core (High Density)</option>
                    <option value="Tier 2 - Growth">Tier 2 - Growth (Expanding)</option>
                    <option value="Tier 3 - Emerging">Tier 3 - Emerging (Developing)</option>
                  </select>
                </div>
              </div>

              {/* Territory Corridor Name */}
              <div className="space-y-1.5">
                <label className="font-bold text-text-secondary flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-brand-navy dark:text-blue-400" />
                    Territory / Corridor Name <span className="text-funnel-hot">*</span>
                  </span>
                  <span className="text-[10px] text-text-tertiary">
                    Matches territory network
                  </span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Hubli-Dharwad Industrial Belt, Bengaluru North (Peenya & Hebbal)"
                  value={territoryName}
                  onChange={(e) => setTerritoryName(e.target.value)}
                  className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs font-medium"
                  required
                />
              </div>
            </div>

            {/* SECTION 2: COVERED CITIES UNDER THIS PARTNER */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-4 space-y-3 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div className="flex items-center gap-1.5 font-bold text-text-primary text-xs">
                  <MapPin className="w-3.5 h-3.5 text-brand-green" />
                  <span>Covered Cities Under Territory</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-green/15 text-brand-green font-mono font-bold">
                    {cities.length} {cities.length === 1 ? 'City' : 'Cities'}
                  </span>
                </div>
                {cities.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setCities([])}
                    className="text-[10px] text-text-tertiary hover:text-funnel-hot transition flex items-center gap-0.5 cursor-pointer"
                  >
                    <RotateCcw className="w-2.5 h-2.5" /> Clear All
                  </button>
                )}
              </div>

              {/* Active Cities Tags Display */}
              <div className="min-h-[52px] p-2.5 bg-surface-subtle border border-border-base rounded-xl flex flex-wrap gap-1.5 items-center">
                {cities.length === 0 ? (
                  <span className="text-text-tertiary italic text-[11px] px-1">
                    No cities added yet. Add cities below or click suggestions from {state}.
                  </span>
                ) : (
                  cities.map((city) => (
                    <span
                      key={city}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface border border-border-subtle text-text-primary font-medium text-[11px] shadow-2xs group"
                    >
                      <span>{city}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveCity(city)}
                        className="text-text-tertiary hover:text-funnel-hot transition rounded-full p-0.5 cursor-pointer"
                        title={`Remove ${city}`}
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))
                )}
              </div>

              {/* City Input Bar with Add Button */}
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type city name(s) separated by commas, e.g. Hubli, Dharwad, Gadag..."
                  value={newCityInput}
                  onChange={(e) => setNewCityInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddCity();
                    }
                  }}
                  className="flex-1 bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs text-xs"
                />
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAddCity()}
                  leftIcon={<Plus className="w-3.5 h-3.5" />}
                  className="rounded-xl px-4"
                >
                  Add City
                </Button>
              </div>

              {/* Quick-Add Popular Cities for Current State */}
              {suggestedCitiesForState.length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[10px] font-semibold text-text-tertiary block">
                    Quick-add common cities in {state}:
                  </span>
                  <div className="flex flex-wrap gap-1.5 max-h-20 overflow-y-auto pr-1 table-scrollbar">
                    {suggestedCitiesForState.map((sCity) => {
                      const isAdded = cities.some((c) => c.toLowerCase() === sCity.toLowerCase());
                      return (
                        <button
                          key={sCity}
                          type="button"
                          onClick={() => {
                            if (isAdded) {
                              handleRemoveCity(sCity);
                            } else {
                              handleAddCity(sCity);
                            }
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition cursor-pointer flex items-center gap-1 ${
                            isAdded
                              ? 'bg-brand-navy/10 text-brand-navy dark:text-blue-400 border-brand-navy/30 font-bold'
                              : 'bg-surface-subtle text-text-secondary border-border-subtle hover:text-text-primary hover:border-border-strong'
                          }`}
                        >
                          {isAdded ? <Check className="w-2.5 h-2.5" /> : <Plus className="w-2.5 h-2.5" />}
                          <span>{sCity}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* SECTION 3: CONTACT & REPRESENTATIVE DETAILS */}
            <div className="bg-surface border border-border-subtle rounded-2xl p-4 space-y-3.5 shadow-2xs">
              <div className="flex items-center justify-between border-b border-border-subtle pb-2">
                <div className="flex items-center gap-1.5 font-bold text-text-primary text-xs">
                  <User className="w-3.5 h-3.5 text-blue-500" />
                  <span>Representative & Dispatch Contact</span>
                </div>
                <label className="text-[10px] text-text-tertiary flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoSyncName}
                    onChange={(e) => setAutoSyncName(e.target.checked)}
                    className="rounded text-brand-navy focus:ring-0"
                  />
                  <span>Auto-format Name as ID + Territory</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Full / Firm Name */}
                <div className="space-y-1.5">
                  <label className="font-bold text-text-secondary flex items-center gap-1">
                    <User className="w-3 h-3 text-brand-navy dark:text-blue-400" />
                    <span>Contact Person / Firm Name</span>
                    <span className="text-funnel-hot">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CP-101 (Hubli-Dharwad Industrial Belt)"
                    value={name}
                    onChange={(e) => {
                      setAutoSyncName(false);
                      setName(e.target.value);
                    }}
                    className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs"
                    required
                  />
                </div>

                {/* Role */}
                <div className="space-y-1.5">
                  <label className="font-bold text-text-secondary flex items-center gap-1">
                    <Briefcase className="w-3 h-3 text-amber-500" />
                    <span>Role / Designation</span>
                    <span className="text-funnel-hot">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Channel Partner (Tier 2)"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs"
                    required
                  />
                </div>

                {/* WhatsApp Phone Number */}
                <div className="space-y-1.5">
                  <label className="font-bold text-text-secondary flex items-center gap-1">
                    <Phone className="w-3 h-3 text-brand-green" />
                    <span>WhatsApp Number</span>
                    <span className="text-funnel-hot">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. +91 98765 43210"
                    value={whatsappNumber}
                    onChange={(e) => setWhatsappNumber(e.target.value)}
                    className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs font-mono"
                    required
                  />
                </div>

                {/* Email Address */}
                <div className="space-y-1.5">
                  <label className="font-bold text-text-secondary flex items-center gap-1">
                    <Mail className="w-3 h-3 text-blue-500" />
                    <span>Email Address</span>
                  </label>
                  <input
                    type="email"
                    placeholder="e.g. cp101@channelpartner.colourplus.co.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs"
                  />
                </div>
              </div>

              {/* Demand Drivers / Target Sectors */}
              <div className="space-y-1.5 pt-1">
                <label className="font-bold text-text-secondary flex items-center justify-between">
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3 h-3 text-text-tertiary" />
                    <span>Territory Demand Drivers / Focus Industries</span>
                  </span>
                  <span className="text-[10px] text-text-tertiary">Optional</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Automotive & engineering plants, pharma, cold storage, warehousing..."
                  value={demandDrivers}
                  onChange={(e) => setDemandDrivers(e.target.value)}
                  className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy transition shadow-2xs text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border-subtle mt-4">
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-mono text-text-tertiary hidden sm:inline">
              Target ID: <strong className="text-text-primary">{partnerId}</strong> • State:{' '}
              <strong className="text-text-primary">{state}</strong> • Cities:{' '}
              <strong className="text-brand-green">{cities.length}</strong>
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="brand"
              size="sm"
              leftIcon={<UserPlus className="w-3.5 h-3.5" />}
              className="rounded-xl px-5"
              disabled={isIdDuplicate}
            >
              Add Partner
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
};
