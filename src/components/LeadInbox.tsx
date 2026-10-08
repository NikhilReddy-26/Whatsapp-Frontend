import React, { useState } from 'react';
import { Search, MapPin, ArrowRight, Bot, UserCheck } from 'lucide-react';
import type { Lead, FunnelCategory } from '../types/crm';

interface LeadInboxProps {
  leads: Lead[];
  selectedLeadId: string | null;
  onSelectLead: (leadId: string) => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

export const LeadInbox: React.FC<LeadInboxProps> = ({
  leads,
  onSelectLead,
  activeFilter,
  setActiveFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState<string>('ALL');

  // Dynamically extract unique states from leads
  const availableStates = Array.from(
    new Set(leads.map((l) => l.location?.state).filter((s): s is string => Boolean(s)))
  ).sort();

  const stateFilteredLeads = leads.filter((lead) => {
    if (selectedState === 'ALL') return true;
    return lead.location?.state?.toLowerCase().includes(selectedState.toLowerCase());
  });

  const filterTabs: { id: string; label: string; count?: number }[] = [
    { id: 'ALL', label: 'All Leads', count: stateFilteredLeads.length },
    { id: 'HOT', label: '🔥 Hot', count: stateFilteredLeads.filter((l) => l.funnel === 'HOT').length },
    { id: 'WARM', label: '⚡ Warm', count: stateFilteredLeads.filter((l) => l.funnel === 'WARM').length },
    { id: 'NURTURE', label: '🌱 Nurture', count: stateFilteredLeads.filter((l) => l.funnel === 'NURTURE').length },
    { id: 'OUT_OF_SCOPE', label: '🚫 Out of Scope', count: stateFilteredLeads.filter((l) => l.funnel === 'OUT_OF_SCOPE').length },
  ];

  const filteredLeads = leads.filter((lead) => {
    if (selectedState !== 'ALL') {
      const stateMatch = lead.location?.state?.toLowerCase().includes(selectedState.toLowerCase());
      if (!stateMatch) return false;
    }

    if (activeFilter === 'HOT' && lead.funnel !== 'HOT') return false;
    if (activeFilter === 'WARM' && lead.funnel !== 'WARM') return false;
    if (activeFilter === 'NURTURE' && lead.funnel !== 'NURTURE') return false;
    if (activeFilter === 'OUT_OF_SCOPE' && lead.funnel !== 'OUT_OF_SCOPE') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        lead.name.toLowerCase().includes(q) ||
        lead.company.toLowerCase().includes(q) ||
        lead.location.city.toLowerCase().includes(q) ||
        (lead.location.state && lead.location.state.toLowerCase().includes(q)) ||
        lead.whatsapp_number.includes(q)
      );
    }
    return true;
  });

  const getFunnelBadgeStyle = (funnel: FunnelCategory) => {
    switch (funnel) {
      case 'HOT':
        return 'bg-red-500/10 text-red-400 border-red-500/30 font-bold';
      case 'WARM':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30 font-bold';
      case 'NURTURE':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 font-medium';
      case 'OUT_OF_SCOPE':
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30 font-normal';
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-6 sm:px-10 py-8 space-y-8">
      
      {/* FULL WIDTH LEAD INBOX HEADER & SEARCH */}
      <div className="bg-[#101823] border border-[#1f2d3f] rounded-[22px] p-6 sm:p-8 space-y-6 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-black text-white">Lead Inbox Desk</h2>
            <p className="text-sm text-slate-400 mt-1">
              Click on any lead card below to inspect extracted technical fields and open WhatsApp chat.
            </p>
          </div>

          {/* Controls: State Selector & Search */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* State Filter Dropdown */}
            <div className="relative flex-shrink-0">
              <select
                aria-label="Filter leads by state"
                value={selectedState}
                onChange={(e) => setSelectedState(e.target.value)}
                className="w-full sm:w-auto bg-[#0a1018] border border-[#1f2d3f] text-white text-xs sm:text-sm rounded-full pl-9 pr-9 py-2.5 appearance-none focus:outline-none focus:border-[#0f3f8a] transition cursor-pointer font-medium"
              >
                <option value="ALL">All States ({leads.length})</option>
                {availableStates.map((state) => {
                  const stateCount = leads.filter((l) =>
                    l.location?.state?.toLowerCase().includes(state.toLowerCase())
                  ).length;
                  return (
                    <option key={state} value={state}>
                      {state} ({stateCount})
                    </option>
                  );
                })}
              </select>
              <MapPin className="w-4 h-4 text-red-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 text-[10px]">
                ▼
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-full sm:w-72 md:w-80">
              <Search className="w-4.5 h-4.5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search leads by name, company, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0a1018] border border-[#1f2d3f] rounded-full pl-11 pr-5 py-2.5 text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-[#0f3f8a] transition"
              />
            </div>
          </div>
        </div>

        {/* FILTER TABS */}
        <div className="flex items-center gap-2.5 overflow-x-auto pb-1 text-xs sm:text-sm no-scrollbar">
          {filterTabs.map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveFilter(tab.id)}
                className={`whitespace-nowrap px-5 py-2.5 rounded-full font-semibold transition flex items-center gap-2 ${
                  isActive
                    ? 'bg-[#0f3f8a] text-white shadow-md'
                    : 'bg-[#0a1018] text-slate-400 hover:bg-[#162232] hover:text-white border border-[#1f2d3f]'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-[#1f2d3f] text-slate-400'
                    }`}
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* FULL WIDTH LEADS GRID / CARDS VIEW */}
      {filteredLeads.length === 0 ? (
        <div className="bg-[#101823] border border-[#1f2d3f] rounded-[22px] p-12 text-center space-y-4 shadow-sm">
          <MapPin className="w-12 h-12 text-slate-500 mx-auto opacity-50" />
          <h3 className="text-lg font-bold text-white">No leads found</h3>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            No leads match your current criteria
            {selectedState !== 'ALL' && <span> for state <strong className="text-slate-200">"{selectedState}"</strong></span>}
            {searchQuery && <span> matching query <strong className="text-slate-200">"{searchQuery}"</strong></span>}.
          </p>
          <button
            onClick={() => {
              setSelectedState('ALL');
              setActiveFilter('ALL');
              setSearchQuery('');
            }}
            className="inline-flex items-center px-4 py-2 bg-[#0f3f8a] hover:bg-[#154fb0] text-white text-xs font-bold rounded-full transition shadow-sm"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLeads.map((lead) => (
            <div
              key={lead.id}
              onClick={() => onSelectLead(lead.id)}
              className="bg-[#101823] border border-[#1f2d3f] hover:border-[#0f3f8a] rounded-[22px] p-6 space-y-5 shadow-sm cursor-pointer hover:scale-[1.01] transition flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Top Row: Name, Company, Funnel & Score */}
                <div className="flex items-start justify-between gap-3">
                  <div className="truncate">
                    <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition truncate flex items-center gap-2">
                      {lead.name}
                      {lead.ai_active ? (
                        <span title="AI Bot Active"><Bot className="w-4 h-4 text-blue-400 inline" /></span>
                      ) : (
                        <span title="Human Active"><UserCheck className="w-4 h-4 text-emerald-400 inline" /></span>
                      )}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-400 truncate font-medium mt-0.5">
                      {lead.company}
                    </p>
                  </div>

                  <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                    <span className={`text-xs px-3 py-1 rounded-full border ${getFunnelBadgeStyle(lead.funnel)}`}>
                      {lead.funnel.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-black text-white bg-[#1f2d3f] px-2.5 py-1 rounded-md">
                      {lead.score}<span className="text-[10px] text-slate-400 font-normal">/100</span>
                    </span>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-center justify-between text-xs sm:text-sm text-slate-400 pt-2 border-t border-[#1f2d3f]">
                  <span className="flex items-center gap-1.5 truncate">
                    <MapPin className="w-4 h-4 text-red-400 flex-shrink-0" />
                    <span className="truncate">{lead.location.city}</span>
                    {lead.location.state && (
                      <span className="text-xs text-slate-400 font-medium">({lead.location.state})</span>
                    )}
                    {lead.location.area_sqft && (
                      <span className="text-xs text-slate-300 font-semibold">• {lead.location.area_sqft} sq ft</span>
                    )}
                  </span>
                </div>

                {/* AI Reason Summary */}
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-2 italic bg-[#0a1018] p-3 rounded-xl border border-[#1f2d3f]">
                  "{lead.reason}"
                </p>
              </div>

              {/* Bottom Action Row */}
              <div className="pt-4 border-t border-[#1f2d3f] flex items-center justify-between text-xs sm:text-sm font-semibold">
                <span className="text-slate-400">
                  Stage: <strong className="text-white">{lead.stage}</strong>
                </span>
                
                <button className="bg-[#0f3f8a] group-hover:bg-[#154fb0] text-white px-4 py-2 rounded-full transition flex items-center gap-1.5 shadow-sm text-xs font-bold">
                  <span>View Extracted Data & Chat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
