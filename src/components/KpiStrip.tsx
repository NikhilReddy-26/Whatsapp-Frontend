import React from 'react';
import type { KpiData } from '../types/crm';

interface KpiStripProps {
  kpis: KpiData;
}

export const KpiStrip: React.FC<KpiStripProps> = ({ kpis }) => {
  return (
    <div className="bg-[#0a1018] px-6 sm:px-10 pt-8 pb-8">
      <div className="max-w-[1600px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-5">
        
        {/* KPI 1: Total leads */}
        <div className="bg-[#101823] border border-[#1f2d3f] rounded-[18px] p-6 sm:p-7 shadow-sm hover:border-[#2c3e56] transition">
          <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {kpis.total_leads || 142}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            Total leads
          </div>
        </div>

        {/* KPI 2: Today leads */}
        <div className="bg-[#101823] border border-[#1f2d3f] rounded-[18px] p-6 sm:p-7 shadow-sm hover:border-[#2c3e56] transition">
          <div className="text-3xl sm:text-4xl font-extrabold text-white mb-2">
            {kpis.new_leads_today || 18}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            Today leads
          </div>
        </div>

        {/* KPI 3: Site visit confirmed */}
        <div className="bg-[#101823] border border-[#1f2d3f] rounded-[18px] p-6 sm:p-7 shadow-sm hover:border-[#2c3e56] transition">
          <div className="text-3xl sm:text-4xl font-extrabold text-emerald-400 mb-2">
            {kpis.site_visits_confirmed || 8}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            Site visit confirmed
          </div>
        </div>

        {/* KPI 4: Closed leads */}
        <div className="bg-[#101823] border border-[#1f2d3f] rounded-[18px] p-6 sm:p-7 shadow-sm hover:border-[#2c3e56] transition">
          <div className="text-3xl sm:text-4xl font-extrabold text-blue-400 mb-2">
            {kpis.closed_leads || 12}
          </div>
          <div className="text-xs sm:text-sm text-slate-400 font-medium">
            Closed leads
          </div>
        </div>

      </div>
    </div>
  );
};
