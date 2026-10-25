import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Search,
  MapPin,
  ArrowRight,
  Bot,
  UserCheck,
  UserPlus,
  Megaphone,
  Calendar,
  ChevronDown,
  RotateCcw,
  Check,
  Factory,
  Warehouse,
  Building2,
  Snowflake,
  Home,
  Car,
  FlaskConical,
  Layers,
  Package,
  Flame,
  Zap,
  Sprout,
  Ban,
  Clock,
  UserX,
  Sparkles,
  Users,
} from 'lucide-react';
import type { Lead, FunnelCategory, ChannelPartner, FlooringAreaCategory } from '../types/crm';
import { COLOURPLUS_PRODUCTS } from '../types/crm';
import type { AssignLeadOptions } from '../services/api';
import {
  isCityInState,
  getTerritoriesForState,
  findSuggestedChannelPartner,
  TERRITORIES,
  TERRITORY_STATES,
} from '../data/territories';
import { BulkAssignModal } from './BulkAssignModal';
import { Badge } from './ui/Badge';
import { Button } from './ui/Button';
import { AnimatedText } from './ui/AnimatedText';
import { stickyBarVariants } from '../lib/motion';
import { useToast } from '../context/ToastContext';

interface LeadInboxProps {
  leads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (leadId: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
  onOpenAddChannelPartner?: () => void;
  channelPartners?: ChannelPartner[];
  onAssignMultipleLeads?: (leadIds: string[], assignee: string, options?: AssignLeadOptions) => Promise<void>;
  onAutoAssignByTerritory?: (leadIds: string[]) => Promise<any>;
  onAssignLead?: (leadId: string, assignee: string, options?: AssignLeadOptions) => Promise<void> | void;
  headerAssignTrigger?: number;
  availableProducts?: string[];
  availableStates?: string[];
  availableFlooringAreas?: string[];
}

export const LeadInbox: React.FC<LeadInboxProps> = ({
  leads,
  onSelectLead,
  activeFilter,
  setActiveFilter,
  onOpenAddChannelPartner,
  channelPartners = [],
  onAssignMultipleLeads,
  onAutoAssignByTerritory,
  onAssignLead,
  headerAssignTrigger,
  availableProducts: availableProductsProp,
  availableStates: availableStatesProp,
  availableFlooringAreas: availableFlooringAreasProp,
}) => {
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<string>('ALL');
  const [selectedProduct, setSelectedProduct] = useState<string>('ALL');
  const [selectedMonth, setSelectedMonth] = useState<string>('ALL');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedState, setSelectedState] = useState<string>('ALL');
  const [selectedTerritoryId, setSelectedTerritoryId] = useState<string>('ALL');
  const [selectedFlooringArea, setSelectedFlooringArea] = useState<string>('ALL');

  // Bulk Selection States
  const [selectedLeadIds, setSelectedLeadIds] = useState<string[]>([]);
  const [bulkTargetLeadIds, setBulkTargetLeadIds] = useState<string[]>([]);
  const [isBulkAssignModalOpen, setIsBulkAssignModalOpen] = useState(false);

  // Dynamically extract unique campaigns from leads
  const availableCampaigns = Array.from(
    new Set(leads.map((l) => l.campaign).filter(Boolean))
  ).sort();

  // Dynamic products list from settings master data or fallback to COLOURPLUS_PRODUCTS
  const computedProducts = React.useMemo(() => {
    if (availableProductsProp && availableProductsProp.length > 0) {
      return availableProductsProp;
    }
    return [...COLOURPLUS_PRODUCTS];
  }, [availableProductsProp]);

  // Dynamically extract unique states from settings master data, territory list and leads
  const availableStates = React.useMemo(() => {
    const statesSet = new Set<string>([...TERRITORY_STATES, ...(availableStatesProp || [])]);
    leads.forEach((l) => {
      if (l.location?.state) {
        statesSet.add(l.location.state);
      }
    });
    return Array.from(statesSet)
      .filter((s) => Boolean(s) && !s.includes('/'))
      .sort();
  }, [availableStatesProp, leads]);

  // Handle state change: reset selected territory
  const handleStateChange = (st: string) => {
    setSelectedState(st);
    setSelectedTerritoryId('ALL');
  };

  // Get territories for currently selected state
  const stateTerritories = React.useMemo(() => {
    return getTerritoriesForState(selectedState);
  }, [selectedState]);

  // Dynamically extract unique flooring area categories from settings master data and leads
  const availableFlooringAreas: (FlooringAreaCategory | string)[] = React.useMemo(() => {
    const areasSet = new Set<string>(availableFlooringAreasProp || []);
    leads.forEach((l) => {
      if (l.flooring_category) {
        areasSet.add(l.flooring_category);
      }
    });
    return Array.from(areasSet).filter(Boolean).sort();
  }, [availableFlooringAreasProp, leads]);

  // Dynamically extract available months from leads & calendar reference
  const availableMonths = React.useMemo(() => {
    const monthsSet = new Set<string>();

    leads.forEach((l) => {
      if (l.created_at) {
        const ym = l.created_at.slice(0, 7);
        if (/^\d{4}-\d{2}$/.test(ym)) {
          monthsSet.add(ym);
        }
      }
    });

    // Ensure common 2026 calendar months are selectable
    const referenceMonths = [
      '2026-10',
      '2026-09',
      '2026-08',
      '2026-07',
      '2026-06',
      '2026-05',
    ];
    referenceMonths.forEach((m) => monthsSet.add(m));

    return Array.from(monthsSet)
      .sort((a, b) => b.localeCompare(a))
      .map((value) => {
        const [year, month] = value.split('-').map(Number);
        const dateObj = new Date(year, month - 1, 1);
        const label = dateObj.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        return { value, label };
      });
  }, [leads]);

  const handleMonthChange = (month: string) => {
    setSelectedMonth(month);
    // If a specific date is selected and it does not belong to the selected month, clear it
    if (month !== 'ALL' && selectedDate && !selectedDate.startsWith(month)) {
      setSelectedDate('');
    }
  };

  const handleDateChange = (date: string) => {
    setSelectedDate(date);
    if (date) {
      const ym = date.slice(0, 7);
      setSelectedMonth(ym);
    }
  };

  // Base filtering with master territory city matching
  const baseFilteredLeads = leads.filter((lead) => {
    if (selectedCampaign !== 'ALL' && lead.campaign !== selectedCampaign) return false;
    if (selectedProduct !== 'ALL' && lead.product !== selectedProduct) return false;

    // Month filter: matches leads created in that month
    if (selectedMonth !== 'ALL') {
      if (!lead.created_at) return false;
      const leadYm = lead.created_at.slice(0, 7);
      if (leadYm !== selectedMonth) {
        const d = new Date(lead.created_at);
        if (isNaN(d.getTime())) return false;
        const formatted = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        if (formatted !== selectedMonth) return false;
      }
    }

    if (selectedDate && (!lead.created_at || !lead.created_at.startsWith(selectedDate))) return false;

    // State / Region matching:
    // Matches if lead's state matches, OR if lead's city belongs to any territory in that state!
    if (selectedState !== 'ALL') {
      const stateMatch = Boolean(lead.location?.state?.toLowerCase().includes(selectedState.toLowerCase()));
      const cityMatch = isCityInState(lead.location?.city, selectedState);
      const addressMatch = isCityInState(lead.location?.address, selectedState);
      if (!stateMatch && !cityMatch && !addressMatch) return false;
    }

    // Specific territory filter (e.g. CP-001 Mumbai Metro, CP-002 Pune Industrial)
    if (selectedTerritoryId !== 'ALL') {
      const terr = TERRITORIES.find((t) => t.territoryId === selectedTerritoryId);
      if (terr) {
        const normCity = (lead.location?.city || '').toLowerCase();
        const normAddr = (lead.location?.address || '').toLowerCase();
        const matches = terr.cities.some((c) => {
          const nc = c.toLowerCase();
          return normCity.includes(nc) || nc.includes(normCity) || normAddr.includes(nc);
        });
        if (!matches) return false;
      }
    }

    if (selectedFlooringArea !== 'ALL' && lead.flooring_category !== selectedFlooringArea) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const suggestion = findSuggestedChannelPartner(lead, channelPartners);
      const territoryMatches = Boolean(
        suggestion.territory && (
          suggestion.territory.territoryId.toLowerCase().includes(q) ||
          suggestion.territory.territoryName.toLowerCase().includes(q) ||
          suggestion.territory.cities.some((c) => c.toLowerCase().includes(q))
        )
      );

      return (
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.campaign.toLowerCase().includes(q) ||
        (lead.product && lead.product.toLowerCase().includes(q)) ||
        lead.location.city.toLowerCase().includes(q) ||
        (lead.location.state && lead.location.state.toLowerCase().includes(q)) ||
        (lead.flooring_category && lead.flooring_category.toLowerCase().includes(q)) ||
        (lead.flooring_area?.sub_type && lead.flooring_area.sub_type.toLowerCase().includes(q)) ||
        (lead.flooring_area?.source_message && lead.flooring_area.source_message.toLowerCase().includes(q)) ||
        territoryMatches
      );
    }
    return true;
  });

  const isLeadAssigned = (lead: Lead) =>
    Boolean(
      lead.assigned_to &&
      lead.assigned_to.trim() !== '' &&
      !lead.assigned_to.toLowerCase().includes('unassigned') &&
      !lead.assigned_to.toLowerCase().includes('disqualification')
    );

  const handleQuickAssign = async (lead: Lead, partner?: ChannelPartner) => {
    if (!partner) return;
    try {
      if (onAssignLead) {
        await onAssignLead(lead.id, partner.name, {
          sendWhatsappAlert: true,
          sendEmailAlert: true,
          partner,
        });
      } else if (onAssignMultipleLeads) {
        await onAssignMultipleLeads([lead.id], partner.name, {
          sendWhatsappAlert: true,
          sendEmailAlert: true,
          partner,
        });
      }
      toast({
        title: 'Lead Dispatched to Channel Partner',
        message: `${lead.name} assigned to ${partner.name} (${partner.id}) with automated WhatsApp brief.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed to quick assign lead:', err);
    }
  };

  const handleAutoAssignFilteredLeads = async () => {
    const unassignedInView = filteredLeads.filter((l) => !isLeadAssigned(l));
    const targetLeads = unassignedInView.length > 0 ? unassignedInView : filteredLeads;
    const ids = targetLeads.map((l) => l.id);
    if (ids.length === 0) return;

    try {
      if (onAutoAssignByTerritory) {
        await onAutoAssignByTerritory(ids);
      } else if (onAssignMultipleLeads) {
        for (const l of targetLeads) {
          const sugg = findSuggestedChannelPartner(l, channelPartners);
          if (sugg.partner) {
            await onAssignMultipleLeads([l.id], sugg.partner.name, {
              sendWhatsappAlert: true,
              sendEmailAlert: true,
              partner: sugg.partner,
            });
          }
        }
      }
      toast({
        title: 'Territory Routing Complete',
        message: `${ids.length} leads successfully mapped by city and dispatched to respective Channel Partners.`,
        type: 'success',
      });
    } catch (err) {
      console.error('Failed auto-assigning filtered leads:', err);
    }
  };

  const isLeadToday = (lead: Lead) => {
    const todayStr = new Date().toISOString().slice(0, 10);
    if (lead.created_at && lead.created_at.startsWith(todayStr)) return true;
    if (lead.next_action?.due_date?.toLowerCase().includes('today')) return true;
    if (lead.status === 'New') return true;
    if (lead.created_at && (lead.created_at.startsWith('2026-10-07') || lead.created_at.startsWith('2026-10-08'))) return true;
    return false;
  };

  // Funnel status tabs filtering
  const filteredLeads = baseFilteredLeads.filter((lead) => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'UNASSIGNED') return !isLeadAssigned(lead);
    if (activeFilter === 'ASSIGNED') return isLeadAssigned(lead);
    if (activeFilter === 'TODAY') return isLeadToday(lead);
    return lead.funnel === activeFilter;
  });

  const filterTabs = [
    { id: 'ALL', label: 'All Leads', count: baseFilteredLeads.length, icon: null },
    {
      id: 'ASSIGNED',
      label: 'Assigned Leads',
      count: baseFilteredLeads.filter(isLeadAssigned).length,
      icon: UserCheck,
      iconColor: 'text-brand-navy dark:text-blue-400',
    },
    {
      id: 'UNASSIGNED',
      label: 'Unassigned',
      count: baseFilteredLeads.filter((l) => !isLeadAssigned(l)).length,
      icon: UserX,
      iconColor: 'text-blue-500',
    },
    {
      id: 'TODAY',
      label: "Today's Leads",
      count: baseFilteredLeads.filter(isLeadToday).length,
      icon: Clock,
      iconColor: 'text-funnel-hot',
    },
    { id: 'HOT', label: 'Hot', count: baseFilteredLeads.filter((l) => l.funnel === 'HOT').length, icon: Flame, iconColor: 'text-funnel-hot' },
    { id: 'WARM', label: 'Warm', count: baseFilteredLeads.filter((l) => l.funnel === 'WARM').length, icon: Zap, iconColor: 'text-funnel-warm' },
    { id: 'NURTURE', label: 'Nurture', count: baseFilteredLeads.filter((l) => l.funnel === 'NURTURE').length, icon: Sprout, iconColor: 'text-funnel-nurture' },
    { id: 'OUT_OF_SCOPE', label: 'Out of Scope', count: baseFilteredLeads.filter((l) => l.funnel === 'OUT_OF_SCOPE').length, icon: Ban, iconColor: 'text-funnel-scope' },
  ];

  const isAllSelected = filteredLeads.length > 0 && filteredLeads.every((l) => selectedLeadIds.includes(l.id));
  const isSomeSelected = selectedLeadIds.length > 0 && !isAllSelected;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      const currentIds = new Set(filteredLeads.map((l) => l.id));
      setSelectedLeadIds((prev) => prev.filter((id) => !currentIds.has(id)));
    } else {
      const currentIds = filteredLeads.map((l) => l.id);
      setSelectedLeadIds((prev) => Array.from(new Set([...prev, ...currentIds])));
    }
  };

  const handleToggleSelectLead = (leadId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedLeadIds((prev) =>
      prev.includes(leadId) ? prev.filter((id) => id !== leadId) : [...prev, leadId]
    );
  };

  const handleOpenBulkAssignModal = () => {
    const targetIds = selectedLeadIds.length > 0 ? selectedLeadIds : filteredLeads.map((l) => l.id);
    if (targetIds.length > 0) {
      setBulkTargetLeadIds(targetIds);
      setIsBulkAssignModalOpen(true);
    }
  };

  const lastTriggerRef = useRef(headerAssignTrigger ?? 0);
  useEffect(() => {
    if (headerAssignTrigger && headerAssignTrigger > lastTriggerRef.current) {
      lastTriggerRef.current = headerAssignTrigger;
      handleOpenBulkAssignModal();
    } else if (!headerAssignTrigger) {
      lastTriggerRef.current = 0;
    }
  }, [headerAssignTrigger]);

  const getFunnelBadgeVariant = (funnel: FunnelCategory) => {
    switch (funnel) {
      case 'HOT':
        return 'hot';
      case 'WARM':
        return 'warm';
      case 'NURTURE':
        return 'nurture';
      case 'OUT_OF_SCOPE':
      default:
        return 'scope';
    }
  };

  const getCategoryIcon = (category?: FlooringAreaCategory) => {
    switch (category) {
      case 'Factory & Industrial':
        return <Factory className="w-3.5 h-3.5 text-amber-500" />;
      case 'Pharma & Cleanroom':
        return <FlaskConical className="w-3.5 h-3.5 text-teal-400" />;
      case 'Warehouse & Logistics':
        return <Warehouse className="w-3.5 h-3.5 text-blue-400" />;
      case 'Commercial & Terrace':
        return <Building2 className="w-3.5 h-3.5 text-purple-400" />;
      case 'Cold Storage & Food':
        return <Snowflake className="w-3.5 h-3.5 text-sky-400" />;
      case 'Automobile & Garages':
        return <Car className="w-3.5 h-3.5 text-rose-400" />;
      case 'Household & Residential':
        return <Home className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Layers className="w-3.5 h-3.5 text-text-tertiary" />;
    }
  };

  const isAnyFilterActive =
    selectedCampaign !== 'ALL' ||
    selectedProduct !== 'ALL' ||
    selectedMonth !== 'ALL' ||
    selectedDate !== '' ||
    selectedState !== 'ALL' ||
    selectedFlooringArea !== 'ALL' ||
    searchQuery.trim() !== '' ||
    activeFilter !== 'ALL';

  const handleResetFilters = () => {
    setSelectedCampaign('ALL');
    setSelectedProduct('ALL');
    setSelectedMonth('ALL');
    setSelectedDate('');
    setSelectedState('ALL');
    setSelectedFlooringArea('ALL');
    setSearchQuery('');
    setActiveFilter('ALL');
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. SEARCH & FACETED FILTERS PANEL */}
      <div className="bg-surface border border-border-subtle rounded-card p-4 sm:p-5 shadow-elevation-1 space-y-4 transition-colors">
        
        {/* TOP ROW: COMPACT SEARCH BAR & QUICK ACTIONS */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          
          {/* Proportional, compact search bar */}
          <div className="relative w-full sm:max-w-md lg:max-w-lg">
            <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search leads by name, company, city, product..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-subtle border border-border-base text-text-primary placeholder:text-text-tertiary rounded-xl pl-10 pr-8 py-2 text-xs sm:text-sm focus:outline-none focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 transition shadow-2xs hover:border-border-strong"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                aria-label="Clear search"
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary p-1 rounded-md hover:bg-surface transition"
              >
                <span className="text-xs font-semibold leading-none">✕</span>
              </button>
            )}
          </div>

          {/* Top Actions: Reset & Add Channel Partner */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {isAnyFilterActive && (
              <Button
                variant="ghost"
                size="xs"
                onClick={handleResetFilters}
                leftIcon={<RotateCcw className="w-3.5 h-3.5" />}
              >
                Reset Filters
              </Button>
            )}

            {onOpenAddChannelPartner && (
              <Button
                variant="secondary"
                size="sm"
                onClick={onOpenAddChannelPartner}
                leftIcon={<UserPlus className="w-4 h-4 text-brand-navy dark:text-blue-400" />}
              >
                + Add Channel Partner
              </Button>
            )}
          </div>
        </div>

        {/* 6-DIMENSIONAL FILTER GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          
          {/* 1. Campaign Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Megaphone className="w-3.5 h-3.5 text-blue-500" />
              <span>Ad Campaign</span>
            </label>
            <div className="relative">
              <select
                aria-label="Filter by campaign"
                value={selectedCampaign}
                onChange={(e) => setSelectedCampaign(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary text-xs sm:text-sm rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:border-brand-navy transition cursor-pointer font-medium truncate shadow-2xs hover:border-border-strong"
              >
                <option value="ALL">All Campaigns ({leads.length})</option>
                {availableCampaigns.map((camp) => (
                  <option key={camp} value={camp}>
                    {camp}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 2. Product Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Package className="w-3.5 h-3.5 text-indigo-400" />
              <span>Product Range</span>
            </label>
            <div className="relative">
              <select
                aria-label="Filter by product"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary text-xs sm:text-sm rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:border-brand-navy transition cursor-pointer font-medium truncate shadow-2xs hover:border-border-strong"
              >
                <option value="ALL">All Products ({computedProducts.length})</option>
                {computedProducts.map((prod) => (
                  <option key={prod} value={prod}>
                    {prod}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 3. Month Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-500" />
              <span>Ingested Month</span>
            </label>
            <div className="relative">
              <select
                aria-label="Filter by month"
                value={selectedMonth}
                onChange={(e) => handleMonthChange(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary text-xs sm:text-sm rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:border-brand-navy transition cursor-pointer font-medium truncate shadow-2xs hover:border-border-strong"
              >
                <option value="ALL">All Months</option>
                {availableMonths.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 4. Date Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-teal-500" />
              <span>Specific Date</span>
            </label>
            <input
              type="date"
              aria-label="Filter by specific date"
              value={selectedDate}
              onChange={(e) => handleDateChange(e.target.value)}
              className="w-full bg-surface-subtle border border-border-base text-text-primary text-xs sm:text-sm rounded-xl px-3 py-2.5 focus:outline-none focus:border-brand-navy transition cursor-pointer font-medium shadow-2xs hover:border-border-strong"
            />
          </div>

          {/* 5. State / Region Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>State / Region</span>
            </label>
            <div className="relative">
              <select
                aria-label="Filter by state"
                value={selectedState}
                onChange={(e) => handleStateChange(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary text-xs sm:text-sm rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:border-brand-navy transition cursor-pointer font-medium truncate shadow-2xs hover:border-border-strong"
              >
                <option value="ALL">All States ({availableStates.length})</option>
                {availableStates.map((st) => (
                  <option key={st} value={st}>
                    {st}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 6. Specific Territory (CP-xxx) Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400" />
              <span>Territory (CP ID)</span>
            </label>
            <div className="relative">
              <select
                aria-label="Filter by territory"
                value={selectedTerritoryId}
                onChange={(e) => setSelectedTerritoryId(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary text-xs sm:text-sm rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:border-brand-navy transition cursor-pointer font-medium truncate shadow-2xs hover:border-border-strong"
              >
                <option value="ALL">
                  {selectedState !== 'ALL'
                    ? `All ${selectedState} Territories (${stateTerritories.length})`
                    : `All 100 Territories`}
                </option>
                {stateTerritories.map((terr) => (
                  <option key={terr.territoryId} value={terr.territoryId}>
                    {terr.territoryId} - {terr.territoryName} ({terr.cities.slice(0, 3).join(', ')}...)
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* 7. Flooring Area / Sector Filter */}
          <div className="space-y-1.5">
            <label className="text-[11px] font-bold uppercase tracking-wider text-text-secondary flex items-center gap-1.5">
              <Factory className="w-3.5 h-3.5 text-amber-500" />
              <span>Facility Sector</span>
            </label>
            <div className="relative">
              <select
                aria-label="Filter by flooring area sector"
                value={selectedFlooringArea}
                onChange={(e) => setSelectedFlooringArea(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary text-xs sm:text-sm rounded-xl pl-3 pr-8 py-2.5 appearance-none focus:outline-none focus:border-brand-navy transition cursor-pointer font-medium truncate shadow-2xs hover:border-border-strong"
              >
                <option value="ALL">All Sectors ({availableFlooringAreas.length})</option>
                {availableFlooringAreas.map((area) => (
                  <option key={area} value={area}>
                    {area}
                  </option>
                ))}
              </select>
              <ChevronDown className="w-4 h-4 text-text-tertiary absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

        </div>

        {/* ACTIVE TERRITORY & FILTERED LEADS DISPATCH BANNER */}
        {selectedState !== 'ALL' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-brand-navy/15 via-blue-500/10 to-brand-green/10 border border-brand-navy/30 dark:border-blue-500/30 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-elevation-1"
          >
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                <span className="p-1.5 rounded-xl bg-brand-navy text-white shadow-2xs">
                  <MapPin className="w-4 h-4" />
                </span>
                <h3 className="text-base font-extrabold text-text-primary">
                  {selectedState} Territory Network
                </h3>
                <Badge variant="navy" size="xs">
                  {stateTerritories.length} Territories ({stateTerritories[0]?.territoryId} to {stateTerritories[stateTerritories.length - 1]?.territoryId})
                </Badge>
                <Badge variant="green" size="xs">
                  {filteredLeads.length} Leads in State
                </Badge>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Showing all leads across {selectedState} cities: <strong className="text-text-primary">{stateTerritories.flatMap((t) => t.cities).slice(0, 10).join(', ')}{stateTerritories.flatMap((t) => t.cities).length > 10 ? '...' : ''}</strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2 self-start md:self-auto flex-shrink-0">
              <Button
                variant="success"
                size="sm"
                onClick={handleAutoAssignFilteredLeads}
                leftIcon={<Sparkles className="w-4 h-4" />}
                className="rounded-xl shadow-2xs font-bold"
                disabled={filteredLeads.length === 0}
                title="Automatically matches each lead's city and assigns to its specific Channel Partner (CP-xxx)"
              >
                Auto-Assign {filteredLeads.length} Leads to Respective CPs
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleOpenBulkAssignModal}
                leftIcon={<Users className="w-4 h-4 text-brand-navy dark:text-blue-400" />}
                className="rounded-xl shadow-2xs"
                disabled={filteredLeads.length === 0}
              >
                Assign All to Specific Partner...
              </Button>
            </div>
          </motion.div>
        )}

        {/* FUNNEL STATUS TABS WITH ANIMATED SLIDING PILL */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 pt-1 text-xs border-t border-border-subtle pt-3">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`relative px-4 py-2 rounded-xl font-semibold transition-colors flex items-center gap-2 cursor-pointer select-none whitespace-nowrap ${
                  isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary hover:bg-surface-subtle'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="funnel-tab-indicator"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-brand-navy rounded-xl shadow-elevation-1"
                  />
                )}
                {Icon && (
                  <span className={`relative z-10 ${isActive ? 'text-white' : tab.iconColor}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </span>
                )}
                <span className="relative z-10">{tab.label}</span>
                <span
                  className={`relative z-10 text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    isActive ? 'bg-white/20 text-white' : 'bg-surface-subtle text-text-tertiary border border-border-subtle'
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

      </div>

      {/* 2. SELECTION BAR (SELECT ALL & QUICK COUNTS) */}
      <motion.div
        initial={shouldReduceMotion ? undefined : { opacity: 0, y: 14, rotateX: -10 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ type: 'spring', stiffness: 360, damping: 26 }}
        style={{ transformPerspective: 900 }}
        className="bg-surface border border-border-subtle rounded-2xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-elevation-1"
      >
        <div className="flex items-center gap-3">
          {/* Select All Checkbox */}
          <div
            onClick={handleToggleSelectAll}
            className="flex items-center space-x-2.5 cursor-pointer select-none group"
          >
            <div
              className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                isAllSelected
                  ? 'bg-brand-navy border-brand-navy text-white shadow-2xs'
                  : isSomeSelected
                  ? 'bg-blue-500/20 border-brand-navy text-brand-navy'
                  : 'bg-surface-subtle border-border-base text-transparent hover:border-border-strong'
              }`}
            >
              <Check className="w-3.5 h-3.5 stroke-[3]" />
            </div>
            <span className="text-xs sm:text-sm font-bold text-text-primary group-hover:text-brand-navy transition">
              Select All ({filteredLeads.length})
            </span>
          </div>

          <Badge variant="navy" pulse={selectedLeadIds.length > 0} size="sm">
            {selectedLeadIds.length > 0
              ? `${selectedLeadIds.length} Selected`
              : `${filteredLeads.length} Qualified Leads`}
          </Badge>
        </div>

        {selectedLeadIds.length > 0 && (
          <button
            onClick={() => setSelectedLeadIds([])}
            className="text-xs text-text-tertiary hover:text-text-primary underline cursor-pointer self-start sm:self-auto"
          >
            Clear Selection
          </button>
        )}
      </motion.div>

      {/* 3. LEADS CARDS / GRID WITH REFINED MOTION */}
      {filteredLeads.length === 0 ? (
        <div className="bg-surface border border-border-base rounded-card p-12 text-center space-y-4 shadow-elevation-1">
          <MapPin className="w-12 h-12 text-text-tertiary mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-text-primary">No leads match your criteria</h3>
          <p className="text-sm text-text-secondary max-w-md mx-auto">
            Try resetting your filters or adjusting your search query.
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={handleResetFilters}
          >
            Clear All Filters
          </Button>
        </div>
      ) : (
        <div className="overflow-y-auto max-h-[760px] pr-2 table-scrollbar scroll-smooth rounded-2xl">
          <motion.div
            layout={!shouldReduceMotion}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 pb-2"
          >
          <AnimatePresence mode="popLayout">
            {filteredLeads.map((lead, idx) => {
              const isSelected = selectedLeadIds.includes(lead.id);
              const isHot = lead.funnel === 'HOT';
              const isUrgent = (lead.unreplied_hours || 0) >= 20;
              const isAssigned = Boolean(
                lead.assigned_to &&
                lead.assigned_to.trim() !== '' &&
                !lead.assigned_to.toLowerCase().includes('unassigned') &&
                !lead.assigned_to.toLowerCase().includes('disqualification')
              );
              const territorySuggestion = findSuggestedChannelPartner(lead, channelPartners);

              return (
                <motion.div
                  key={lead.id}
                  layout={!shouldReduceMotion}
                  initial={
                    shouldReduceMotion
                      ? { opacity: 0 }
                      : {
                          opacity: 0,
                          y: 28,
                          rotateX: -16,
                          scale: 0.95,
                          filter: 'blur(3px)',
                        }
                  }
                  animate={{
                    opacity: 1,
                    y: 0,
                    rotateX: 0,
                    scale: 1,
                    filter: 'blur(0px)',
                    transition: {
                      type: 'spring',
                      stiffness: 340,
                      damping: 26,
                      delay: shouldReduceMotion ? 0 : Math.min(idx * 0.035, 0.35),
                    },
                  }}
                  style={{
                    transformPerspective: 1000,
                    transformOrigin: '50% 100%',
                  }}
                  exit={{ opacity: 0, scale: 0.96, transition: { duration: 0.15 } }}
                  whileHover={shouldReduceMotion ? undefined : { y: -3, transition: { duration: 0.18 } }}
                  onClick={() => onSelectLead(lead.id)}
                  className={`group relative bg-surface border rounded-card p-5 transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden shadow-elevation-1 hover:shadow-elevation-2 select-none ${
                    isSelected
                      ? 'border-brand-navy ring-2 ring-brand-navy/30 bg-surface-elevated'
                      : isHot
                      ? 'border-funnel-hotBorder/80 hover:border-funnel-hot shadow-glow-hot/20'
                      : 'border-border-subtle hover:border-border-strong'
                  }`}
                >
                  {/* Subtle Top Accent Sheen Bar */}
                  <div
                    className={`absolute top-0 left-0 right-0 h-1 transition-opacity ${
                      isHot ? 'bg-gradient-to-r from-funnel-hot via-amber-500 to-funnel-hot' : 'bg-gradient-to-r from-brand-navy to-brand-green'
                    }`}
                  />

                  <div className="space-y-3.5 pt-1">
                    {/* Header Row: Checkbox, Name, AI/Agent Tag, Funnel Badge */}
                    <div className="flex items-start justify-between gap-2.5">
                      <div className="flex items-start gap-2.5 min-w-0 flex-1">
                        {/* Checkbox */}
                        <div
                          onClick={(e) => handleToggleSelectLead(lead.id, e)}
                          className={`mt-0.5 w-4.5 h-4.5 rounded-md border flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                            isSelected
                              ? 'bg-brand-navy border-brand-navy text-white shadow-2xs'
                              : 'bg-surface-subtle border-border-base text-transparent hover:border-border-strong'
                          }`}
                        >
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <h3 className="text-base font-bold text-text-primary group-hover:text-brand-navy transition-colors truncate">
                              {lead.name}
                            </h3>
                            {lead.ai_active ? (
                              <Badge variant="navy" size="xs" icon={<Bot className="w-3 h-3" />}>
                                AI
                              </Badge>
                            ) : (
                              <Badge variant="green" size="xs" icon={<UserCheck className="w-3 h-3" />}>
                                Agent
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-text-secondary truncate mt-0.5 font-medium">
                            {lead.company}
                          </p>
                        </div>
                      </div>

                      {/* Funnel & Score Badge */}
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        <Badge variant={getFunnelBadgeVariant(lead.funnel)} size="xs" pulse={isHot}>
                          {lead.funnel.replace('_', ' ')}
                        </Badge>
                        <span className="font-mono text-xs font-black px-2 py-0.5 rounded-lg bg-surface-subtle border border-border-base text-text-primary tabular-nums">
                          {lead.score}<span className="text-[10px] text-text-tertiary">/100</span>
                        </span>
                      </div>
                    </div>

                    {/* Sector Badge & Recommended Product */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {lead.flooring_category && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-text-secondary bg-surface-subtle px-2 py-0.5 rounded-md border border-border-subtle">
                          {getCategoryIcon(lead.flooring_category)}
                          <span className="truncate max-w-[170px]">{lead.flooring_category}</span>
                        </span>
                      )}
                      {lead.product && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-navy dark:text-blue-300 bg-brand-navy/10 px-2 py-0.5 rounded-md border border-brand-navy/20">
                          <Package className="w-3 h-3" />
                          <span className="truncate max-w-[150px]">{lead.product}</span>
                        </span>
                      )}
                    </div>

                    {/* Extracted Chat Quote Preview */}
                    {lead.flooring_area?.source_message && (
                      <p className="text-xs text-text-secondary italic line-clamp-2 bg-surface-subtle/70 p-2.5 rounded-xl border border-border-subtle leading-relaxed">
                        "{lead.flooring_area.source_message}"
                      </p>
                    )}

                    {/* Location & Square Footage */}
                    <div className="flex items-center justify-between text-xs text-text-tertiary pt-1 border-t border-border-subtle">
                      <div className="flex items-center space-x-1.5 truncate pr-2">
                        <MapPin className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
                        <span className="truncate">{lead.location.city}, {lead.location.state}</span>
                      </div>
                      {lead.location.area_sqft && (
                        <span className="font-mono font-semibold text-text-secondary text-[11px] flex-shrink-0">
                          {lead.location.area_sqft.toLocaleString()} sq ft
                        </span>
                      )}
                    </div>

                    {/* Matched Territory & Channel Partner Suggestion */}
                    {territorySuggestion.territory && (
                      <div className="flex items-center justify-between gap-1.5 px-2.5 py-1.5 rounded-lg bg-surface-subtle border border-brand-navy/15 text-[11px]">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="font-mono font-bold text-brand-navy dark:text-blue-400 shrink-0">
                            {territorySuggestion.territory.territoryId}
                          </span>
                          <span className="text-text-secondary truncate font-medium">
                            {territorySuggestion.territory.territoryName}
                          </span>
                        </div>
                        {territorySuggestion.partner && (
                          <span className="shrink-0 text-[10px] font-mono font-bold text-brand-green dark:text-emerald-400 bg-brand-green/10 px-1.5 py-0.5 rounded border border-brand-green/20">
                            {territorySuggestion.partner.id}
                          </span>
                        )}
                      </div>
                    )}

                    {/* SLA SLA Badge if unreplied */}
                    {isUrgent && (
                      <div className="flex items-center justify-between text-[11px] bg-funnel-hotBg text-funnel-hot border border-funnel-hotBorder/50 px-2.5 py-1 rounded-lg font-bold">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 animate-pulse" />
                          <span>Unanswered &gt; 20h</span>
                        </span>
                        <span className="font-mono text-[10px] underline">Immediate Attention</span>
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Assigned Rep & Quick Territory Route */}
                  <div className={`pt-3.5 mt-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary min-h-[32px]`}>
                    {isAssigned ? (
                      <span className="truncate font-medium pr-2 text-xs">
                        Assigned: <strong className="text-text-primary">{lead.assigned_to}</strong>
                      </span>
                    ) : territorySuggestion.partner ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickAssign(lead, territorySuggestion.partner);
                        }}
                        className="inline-flex items-center gap-1 text-[11px] font-bold text-brand-navy hover:text-white dark:text-blue-300 bg-brand-navy/10 hover:bg-brand-navy px-2.5 py-1 rounded-md transition-all shadow-xs border border-brand-navy/20 cursor-pointer"
                        title={`Assign to ${territorySuggestion.partner.name} (${territorySuggestion.partner.id})`}
                      >
                        <Zap className="w-3 h-3 text-amber-500 fill-amber-500" />
                        <span>Assign {territorySuggestion.partner.id}</span>
                      </button>
                    ) : (
                      <span className="text-[11px] text-text-tertiary italic">
                        Unassigned
                      </span>
                    )}
                    <span className="flex items-center gap-1 font-bold text-brand-navy dark:text-blue-400 group-hover:translate-x-1 transition-transform ml-auto">
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>

                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
        </div>
      )}

      {/* 4. STICKY BULK ASSIGN ACTION BAR (SPRINGS UP WHEN SELECTION > 0) */}
      <AnimatePresence>
        {selectedLeadIds.length > 0 && (
          <motion.div
            variants={stickyBarVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 max-w-2xl w-[92%] sm:w-full bg-surface-elevated/95 backdrop-blur-md border border-brand-navy/40 rounded-2xl p-4 shadow-elevation-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-text-primary"
          >
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-brand-navy flex items-center justify-center text-white font-mono font-bold shadow-elevation-1">
                {selectedLeadIds.length}
              </div>
              <div>
                <h4 className="text-sm font-bold text-text-primary">
                  {selectedLeadIds.length} {selectedLeadIds.length === 1 ? 'Lead' : 'Leads'} Selected
                </h4>
                <p className="text-xs text-text-secondary">
                  Ready for bulk channel partner routing & WhatsApp dispatch
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 self-end sm:self-auto flex-wrap gap-y-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedLeadIds([])}
              >
                Cancel
              </Button>
              {onAutoAssignByTerritory && (
                <Button
                  variant="brand"
                  size="sm"
                  onClick={async () => {
                    try {
                      const res = await onAutoAssignByTerritory(selectedLeadIds);
                      setSelectedLeadIds([]);
                      toast({
                        title: 'Territory Auto-Routing Complete',
                        message: `Successfully routed ${res?.assignedCount || selectedLeadIds.length} leads to their matched Channel Partner IDs based on city territory!`,
                        type: 'success',
                      });
                    } catch {
                      toast({
                        title: 'Auto-Route Failed',
                        message: 'Could not auto-assign leads by territory.',
                        type: 'error',
                      });
                    }
                  }}
                  leftIcon={<Zap className="w-4 h-4 text-amber-400 fill-amber-400" />}
                >
                  Auto-Assign by Territory
                </Button>
              )}
              <Button
                variant="success"
                size="sm"
                onClick={handleOpenBulkAssignModal}
                leftIcon={<UserCheck className="w-4 h-4" />}
              >
                Bulk Assign Leads
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* BULK ASSIGN MODAL */}
      <BulkAssignModal
        isOpen={isBulkAssignModalOpen}
        onClose={() => setIsBulkAssignModalOpen(false)}
        selectedLeadIds={bulkTargetLeadIds}
        leads={leads}
        channelPartners={channelPartners}
        onAssignMultipleLeads={onAssignMultipleLeads || (async () => {})}
        onOpenAddChannelPartner={onOpenAddChannelPartner}
        onClearSelection={() => setSelectedLeadIds([])}
      />

    </div>
  );
};
