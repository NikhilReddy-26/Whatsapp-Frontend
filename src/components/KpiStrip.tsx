import React from 'react';
import { motion } from 'motion/react';
import type { ActivePageView, KpiData } from '../types/crm';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Card } from './ui/Card';
import { Layers, Flame, CalendarCheck, TrendingUp, UserCheck, ArrowUpRight } from 'lucide-react';
import { staggerContainer, perspectiveCardIn } from '../lib/motion';

interface KpiStripProps {
  kpis: KpiData;
  activeFilter?: string;
  onFilterChange?: (filter: string) => void;
  onNavigateToTab?: (tab: ActivePageView) => void;
}

export const KpiStrip: React.FC<KpiStripProps> = ({
  kpis,
  activeFilter = 'ALL',
  onFilterChange,
  onNavigateToTab,
}) => {
  const cards = [
    {
      id: 'total',
      filterTarget: 'UNASSIGNED',
      label: 'Total Leads Ingested',
      value: kpis.total_leads || 142,
      trend: '+14% this month',
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      glow: 'none' as const,
      textColor: 'text-text-primary',
      isActive: activeFilter === 'UNASSIGNED',
      hintText: 'Click to filter unassigned leads',
    },
    {
      id: 'today',
      filterTarget: 'TODAY',
      label: 'New Today & Hot Queue',
      value: kpis.new_leads_today || 18,
      subValue: `${kpis.hot_leads || 5} HOT leads`,
      trend: '+8 today',
      icon: <Flame className="w-5 h-5 text-funnel-hot" />,
      glow: 'hot' as const,
      textColor: 'text-funnel-hot',
      isHot: true,
      isActive: activeFilter === 'TODAY',
      hintText: "Click to filter today's leads",
    },
    {
      id: 'assigned',
      filterTarget: 'ASSIGNED',
      label: 'Assigned Leads',
      value: kpis.assigned_leads || 86,
      trend: '+12 this week',
      icon: <UserCheck className="w-5 h-5 text-brand-navy dark:text-blue-400" />,
      glow: 'navy' as const,
      textColor: 'text-brand-navy dark:text-blue-400',
      isActive: activeFilter === 'ASSIGNED',
      hintText: 'Click to filter assigned leads',
    },
    {
      id: 'visits',
      filterTarget: 'APPOINTMENTS_TAB',
      label: 'Site Visits Confirmed',
      value: kpis.site_visits_confirmed || 8,
      trend: 'Technical audits',
      icon: <CalendarCheck className="w-5 h-5 text-brand-green" />,
      glow: 'green' as const,
      textColor: 'text-brand-green',
      isTabLink: true,
      hintText: 'Click to open Site Visits tab',
    },
  ];

  const handleCardClick = (card: typeof cards[number]) => {
    if (card.isTabLink) {
      onNavigateToTab?.('appointments');
      return;
    }

    if (card.filterTarget) {
      const nextFilter = activeFilter === card.filterTarget ? 'ALL' : card.filterTarget;
      onFilterChange?.(nextFilter);
    }
  };

  return (
    <div className="bg-canvas pt-7 pb-6 transition-colors duration-300">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={staggerContainer(0.07)}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5"
        >
        {cards.map((c) => (
          <motion.div key={c.id} variants={perspectiveCardIn}>
            <Card
              elevation={c.isActive ? 2 : 1}
              interactive
              glow={c.glow}
              gloss
              onClick={() => handleCardClick(c)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  handleCardClick(c);
                }
              }}
              title={c.hintText}
              className={`p-5 sm:p-6 relative overflow-hidden transition-all duration-300 cursor-pointer select-none group ${
                c.isActive
                  ? 'ring-2 ring-brand-navy dark:ring-blue-400 shadow-elevation-2 scale-[1.01]'
                  : c.isHot
                  ? 'ring-1 ring-funnel-hot/30 dark:bg-surface/90 hover:ring-funnel-hot/60 hover:shadow-elevation-2'
                  : 'hover:border-border-strong hover:shadow-elevation-2'
              }`}
            >
              {/* Card Header: Icon & Trend */}
              <div className="flex items-center justify-between mb-3">
                <div className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle shadow-2xs group-hover:bg-surface transition-colors">
                  {c.icon}
                </div>
                {c.isTabLink ? (
                  <div className="flex items-center space-x-1 text-[11px] font-mono font-semibold text-brand-green group-hover:underline">
                    <span>{c.trend}</span>
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                ) : (
                  <div className="flex items-center space-x-1 text-[11px] font-mono font-semibold text-text-tertiary">
                    <TrendingUp className="w-3.5 h-3.5 text-brand-green" />
                    <span>{c.trend}</span>
                  </div>
                )}
              </div>

              {/* Number with animated count up */}
              <div className="flex items-baseline space-x-2">
                <AnimatedNumber
                  value={c.value}
                  duration={1100}
                  className={`text-3xl sm:text-4xl font-black tracking-tight leading-none ${c.textColor}`}
                />
                {c.subValue && (
                  <span className="text-xs font-bold text-funnel-hot font-mono">
                    ({c.subValue})
                  </span>
                )}
              </div>

              {/* Label & Active State */}
              <div className="flex items-center justify-between text-xs font-semibold text-text-secondary mt-2 tracking-tight">
                <span>{c.label}</span>
                {c.isActive && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full bg-brand-navy/15 text-brand-navy dark:text-blue-300 border border-brand-navy/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-navy dark:bg-blue-400 animate-pulse" />
                    Active
                  </span>
                )}
                {c.isTabLink && (
                  <span className="text-[10px] text-brand-green opacity-0 group-hover:opacity-100 transition-opacity font-mono font-semibold">
                    Open Tab →
                  </span>
                )}
              </div>
            </Card>
          </motion.div>
        ))}
        </motion.div>
      </div>
    </div>
  );
};
