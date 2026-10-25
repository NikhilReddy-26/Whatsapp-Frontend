import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Calendar,
  Send,
  Eye,
  MessageSquare,
  Target,
  CheckCircle2,
  ArrowUpRight,
  Megaphone,
  Sparkles,
  Zap,
  Flame,
  ShieldCheck,
  RefreshCw,
} from 'lucide-react';
import type { Lead, CampaignAnalyticsMetric, HourlyLeadBucket } from '../types/crm';
import {
  getRealtimeMessagingStats,
  getCampaignAnalyticsList,
  getHourlyLeadDistribution,
  getDayOfWeekLeadTrends,
  getCampaignTimingRecommendation,
  getLiveActivityFeed,
} from '../data/analytics';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AnimatedText } from './ui/AnimatedText';
import { perspectiveCardIn, staggerContainer } from '../lib/motion';

interface AnalyticsViewProps {
  leads: Lead[];
  onSelectCampaignForDesk?: (campaign: string) => void;
  onNavigateToDesk?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  leads,
  onSelectCampaignForDesk: _onSelectCampaignForDesk,
  onNavigateToDesk: _onNavigateToDesk,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [selectedCampaignFilter, setSelectedCampaignFilter] = useState<string>('ALL');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<string>('ALL');
  const [activeHoverHour, setActiveHoverHour] = useState<HourlyLeadBucket | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredLeads = selectedCampaignFilter === 'ALL'
    ? leads
    : leads.filter((l) => l.campaign === selectedCampaignFilter);

  const messagingStats = getRealtimeMessagingStats(filteredLeads);
  const rawCampaignList = getCampaignAnalyticsList(leads);
  const hourlyData = getHourlyLeadDistribution();
  const dayOfWeekData = getDayOfWeekLeadTrends();
  const timingAdvice = getCampaignTimingRecommendation();
  const _liveActivities = getLiveActivityFeed();

  const filteredCampaignList = rawCampaignList.filter((c) => {
    if (selectedPlatformTab !== 'ALL' && c.platform !== selectedPlatformTab) return false;
    if (selectedCampaignFilter !== 'ALL' && c.campaign !== selectedCampaignFilter) return false;
    return true;
  });

  const handleManualRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 600);
  };

  const getPlatformBadge = (platform: string) => {
    switch (platform) {
      case 'Google Search':
        return 'bg-blue-500/15 text-blue-500 border-blue-500/30';
      case 'Google Ads':
        return 'bg-sky-500/15 text-sky-400 border-sky-500/30';
      case 'Meta Ads':
        return 'bg-indigo-500/15 text-indigo-400 border-indigo-500/30';
      case 'LinkedIn':
        return 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30';
      case 'Direct Inbound':
      case 'WhatsApp Direct':
      default:
        return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    }
  };

  const getRecommendationBadge = (rec: CampaignAnalyticsMetric['recommendation']) => {
    switch (rec) {
      case 'SCALE_UP':
        return {
          badge: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30 font-bold',
          label: 'Scale Up (+40%)',
          subtext: 'High Intent & ROI',
          icon: '🚀',
        };
      case 'MAINTAIN':
        return {
          badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold',
          label: 'Maintain Pacing',
          subtext: 'Consistent Conversion',
          icon: '🟢',
        };
      case 'OPTIMIZE_COPY':
        return {
          badge: 'bg-amber-500/15 text-amber-500 border-amber-500/30 font-bold',
          label: 'Optimize Ad Copy',
          subtext: 'Add B2B Qualifiers',
          icon: '⚠️',
        };
      case 'PAUSE_REVISE':
        return {
          badge: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-bold',
          label: 'Pause / Revise',
          subtext: 'High Consumer Noise',
          icon: '⏸️',
        };
    }
  };

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* 1. TOP HEADER & TELEMETRY CONTROLS */}
      <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8 space-y-5 shadow-elevation-1 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-5 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-7 h-7 text-brand-navy dark:text-blue-400 flex-shrink-0" />
                <AnimatedText
                  text="Real-Time Campaign Analytics"
                  as="h2"
                  className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight"
                />
              </div>
              <Badge variant="green" pulse size="sm">
                Live Feed
              </Badge>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1.5 max-w-3xl leading-relaxed">
              Real-time message delivery, read, reply & click telemetry. Discover peak lead intake hours and automate B2B ad schedules.
            </p>
          </div>

          {/* Time Window & Refresh Controls */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="bg-surface-subtle border border-border-base rounded-xl p-1 flex items-center gap-1 text-xs font-semibold shadow-2xs">
              {(['today', '7d', '30d', 'all'] as const).map((win) => (
                <button
                  key={win}
                  onClick={() => setSelectedTimeWindow(win)}
                  className={`px-3 py-1.5 rounded-lg transition cursor-pointer capitalize ${
                    selectedTimeWindow === win
                      ? 'bg-brand-navy text-white font-bold shadow-2xs'
                      : 'text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {win === 'all' ? 'All Time' : win === 'today' ? 'Today' : `Last ${win}`}
                </button>
              ))}
            </div>

            <Button
              variant="secondary"
              size="sm"
              onClick={handleManualRefresh}
              leftIcon={<RefreshCw className={`w-3.5 h-3.5 text-brand-navy dark:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              Sync
            </Button>
          </div>
        </div>

        {/* CAMPAIGN SCOPE SELECTOR BAR */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface-subtle p-3.5 rounded-xl border border-border-base">
          <div className="flex items-center gap-2.5 min-w-0 flex-1">
            <Megaphone className="w-4 h-4 text-brand-navy dark:text-blue-400 flex-shrink-0" />
            <span className="text-xs font-bold text-text-secondary uppercase tracking-wider whitespace-nowrap">
              Campaign Scope:
            </span>
            <select
              aria-label="Filter by campaign scope"
              value={selectedCampaignFilter}
              onChange={(e) => setSelectedCampaignFilter(e.target.value)}
              className="bg-surface border border-border-base text-text-primary text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-navy font-medium truncate max-w-md cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Active Campaigns Aggregate ({rawCampaignList.length})</option>
              {rawCampaignList.map((c) => (
                <option key={c.campaign} value={c.campaign}>
                  {c.campaign} ({c.total_leads} leads)
                </option>
              ))}
            </select>
          </div>

          {selectedCampaignFilter !== 'ALL' && (
            <button
              onClick={() => setSelectedCampaignFilter('ALL')}
              className="text-xs text-brand-navy dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              Reset to All Campaigns
            </button>
          )}
        </div>
      </div>

      {/* 2. CORE REAL-TIME ANALYTICS CARDS (DELIVERY, READ, REPLY, CLICK RATES) WITH WHILEINVIEW ANIMATION */}
      <motion.div
        variants={staggerContainer(0.08)}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 sm:gap-5"
      >
        
        {/* Card 1: Delivery Rate */}
        <motion.div variants={perspectiveCardIn}>
        <Card elevation={1} interactive className="p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-text-tertiary block font-mono">
                DELIVERY RATE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <AnimatedNumber
                  value={messagingStats.delivery_rate}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                <span className="text-xs font-bold text-brand-green flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +0.6%
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-brand-green/10 border border-brand-green/20 text-brand-green">
              <Send className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-border-base/50 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${messagingStats.delivery_rate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-brand-green h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{messagingStats.total_delivered.toLocaleString()} delivered</span>
              <span className="text-funnel-hot font-semibold">{messagingStats.total_failed} failed</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-brand-green font-semibold">
              <CheckCircle2 className="w-3 h-3 text-brand-green" /> Handshake
            </span>
            <span className="font-mono text-text-primary">{messagingStats.avg_delivery_latency_sec}s latency</span>
          </div>
        </Card>
        </motion.div>

        {/* Card 2: Read Rate */}
        <motion.div variants={perspectiveCardIn}>
        <Card elevation={1} interactive className="p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-text-tertiary block font-mono">
                READ RATE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <AnimatedNumber
                  value={messagingStats.read_rate}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                <span className="text-xs font-bold text-blue-500 flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +2.1%
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-500">
              <Eye className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-border-base/50 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${messagingStats.read_rate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-blue-500 h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{messagingStats.total_read.toLocaleString()} opened</span>
              <span>{messagingStats.total_unread.toLocaleString()} pending</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-blue-500 font-semibold">
              <Clock className="w-3 h-3" /> Median Open
            </span>
            <span className="font-mono text-text-primary">{messagingStats.median_time_to_read_min} mins</span>
          </div>
        </Card>
        </motion.div>

        {/* Card 3: Reply Rate */}
        <motion.div variants={perspectiveCardIn}>
        <Card elevation={1} interactive className="p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-text-tertiary block font-mono">
                REPLY RATE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <AnimatedNumber
                  value={messagingStats.reply_rate}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                <span className="text-xs font-bold text-brand-green flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +5.4%
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <MessageSquare className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-border-base/50 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${messagingStats.reply_rate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-indigo-500 h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{messagingStats.total_replies.toLocaleString()} replies</span>
              <span className="text-brand-green font-semibold">{messagingStats.ai_automated_replies_pct}% auto</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <Zap className="w-3 h-3" /> AI Engine
            </span>
            <span className="font-mono text-text-primary">4.2m latency</span>
          </div>
        </Card>
        </motion.div>

        {/* Card 4: Lead Generation Rate & Lead Rating */}
        <motion.div variants={perspectiveCardIn}>
        <Card elevation={1} interactive className="p-5 space-y-3 relative overflow-hidden group">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-[11px] font-bold tracking-wider uppercase text-text-tertiary block font-mono">
                LEADS GENERATION RATE
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <AnimatedNumber
                  value={messagingStats.lead_generation_rate}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                <span className="text-xs font-bold text-brand-green flex items-center">
                  <ArrowUpRight className="w-3.5 h-3.5" /> +3.4%
                </span>
              </div>
            </div>
            <div className="p-2.5 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Target className="w-5 h-5" />
            </div>
          </div>

          <div className="space-y-1.5 pt-1">
            <div className="w-full bg-border-base/50 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${messagingStats.lead_generation_rate}%` }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{messagingStats.total_leads_generated.toLocaleString()} leads captured</span>
              <span className="text-purple-400 font-semibold">Google • Meta • LinkedIn</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-purple-400 font-semibold">
              <Sparkles className="w-3 h-3 text-purple-400" /> AI Rated Quality
            </span>
            <span className="font-mono text-text-primary">Avg Score: {messagingStats.avg_lead_score}/100</span>
          </div>
        </Card>
        </motion.div>

      </motion.div>

      {/* 3. PEAK HOURS TIMING INTELLIGENCE & 24-HOUR HISTOGRAM (UPWARD GROWING BARS) */}
      <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8 space-y-6 shadow-elevation-1 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-amber-500" />
              <h3 className="text-xl font-black text-text-primary tracking-tight">
                24-Hour Lead Influx Histogram & Optimal Ad Windows
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Hourly distribution identifying high-conversion windows for Meta & Google campaign pacing.
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/25 px-3.5 py-1.5 rounded-full text-xs font-bold text-amber-500 shadow-2xs">
            <Flame className="w-4 h-4 text-funnel-hot" />
            <span>Prime B2B Window: 09:30 AM – 01:00 PM & 03:00 PM – 05:30 PM</span>
          </div>
        </div>

        {/* 24-HOUR INTERACTIVE BAR HISTOGRAM */}
        <div className="space-y-3">
          <div className="bg-surface-subtle p-4 sm:p-6 rounded-2xl border border-border-base">
            <div className="grid grid-cols-6 sm:grid-cols-9 md:grid-cols-17 gap-1.5 items-end h-44 pt-4">
              {hourlyData.map((bucket, idx) => {
                const maxLeads = 22;
                const heightPercent = Math.max(Math.round((bucket.leads_count / maxLeads) * 100), 8);
                const isPeak = bucket.intensity === 'peak';
                const isHigh = bucket.intensity === 'high';
                const isMod = bucket.intensity === 'moderate';

                let barColor = 'bg-border-base hover:bg-border-strong';
                if (isPeak) barColor = 'bg-gradient-to-t from-funnel-hot to-amber-500 shadow-glow-hot';
                else if (isHigh) barColor = 'bg-gradient-to-t from-brand-navy to-blue-400';
                else if (isMod) barColor = 'bg-blue-500/50';

                return (
                  <div
                    key={bucket.hour_num}
                    onMouseEnter={() => setActiveHoverHour(bucket)}
                    className="flex flex-col items-center justify-end h-full group relative cursor-pointer"
                  >
                    {/* Tooltip on Hover */}
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-full mb-2 bg-surface-elevated border border-border-strong text-text-primary text-[11px] rounded-xl p-2.5 whitespace-nowrap z-30 pointer-events-none shadow-elevation-3">
                      <p className="font-bold text-amber-400 font-mono">{bucket.hour_label}</p>
                      <p className="text-text-secondary">{bucket.leads_count} Leads ({bucket.percentage}%)</p>
                      <p className="text-[10px] text-brand-green font-semibold mt-0.5">{bucket.recommended_action}</p>
                    </div>

                    {/* Upward growing animated bar */}
                    <motion.div
                      initial={{ height: 0 }}
                      whileInView={{ height: `${heightPercent}%` }}
                      viewport={{ once: true }}
                      transition={{
                        duration: shouldReduceMotion ? 0 : 0.6,
                        delay: shouldReduceMotion ? 0 : idx * 0.02,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={`w-full rounded-t-lg transition-colors ${barColor}`}
                    />

                    <span className="text-[10px] font-mono text-text-tertiary mt-2 truncate max-w-full">
                      {bucket.hour_num < 10 ? `0${bucket.hour_num}h` : `${bucket.hour_num}h`}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Active Hover Detail Bar */}
            {activeHoverHour && (
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 pt-3 border-t border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs bg-surface p-3 rounded-xl border border-border-base shadow-2xs"
              >
                <div className="flex items-center gap-2">
                  <span className="font-bold text-text-primary">{activeHoverHour.hour_label}:</span>
                  <span className="text-brand-navy dark:text-blue-400 font-bold font-mono">
                    {activeHoverHour.leads_count} Leads ({activeHoverHour.percentage}% of daily intake)
                  </span>
                </div>
                <div className="text-amber-500 font-semibold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5" />
                  <span>Ad Strategy: {activeHoverHour.recommended_action}</span>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* DAY OF WEEK MATRIX & ADVISORY */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 pt-2">
          
          {/* Day of Week Lead Influx */}
          <div className="bg-surface-subtle border border-border-base rounded-2xl p-5 space-y-3.5 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-text-primary flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-green" />
                <span>Day of Week Influx</span>
              </h4>
              <Badge variant="green" size="xs">
                Tue-Thu Peak
              </Badge>
            </div>

            <div className="space-y-2">
              {dayOfWeekData.map((d) => (
                <div key={d.day} className="flex items-center justify-between text-xs py-1.5 px-3 rounded-xl bg-surface border border-border-subtle shadow-2xs">
                  <div className="flex items-center gap-2">
                    <span className={`font-semibold ${d.is_peak ? 'text-amber-500' : 'text-text-secondary'}`}>
                      {d.day}
                    </span>
                    {d.is_peak && <Flame className="w-3 h-3 text-amber-500" />}
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-text-tertiary">{d.lead_count} leads</span>
                    <span className={`font-bold font-mono text-[11px] px-2 py-0.5 rounded ${
                      d.qualification_rate >= 80 ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-surface-subtle text-text-tertiary'
                    }`}>
                      {d.qualification_rate}% qualified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Golden Hours & Budget Advice */}
          <div className="bg-surface-subtle border border-amber-500/25 rounded-2xl p-5 space-y-4 lg:col-span-2 shadow-2xs">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-amber-500 flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                <span>Recommended Campaign Schedule & Pacing</span>
              </h4>
              <Badge variant="warm" size="xs">
                Budget Rules
              </Badge>
            </div>

            <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
              {timingAdvice.budget_allocation_advice}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
              {timingAdvice.channel_guidance.map((guide) => (
                <div key={guide.channel} className="bg-surface p-3.5 rounded-xl border border-border-base space-y-1.5 shadow-2xs">
                  <span className="font-bold text-text-primary text-xs block">{guide.channel}</span>
                  <div className="text-[11px] font-bold text-brand-navy dark:text-blue-400 flex items-center gap-1 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{guide.timing}</span>
                  </div>
                  <p className="text-[11px] text-text-tertiary leading-tight">
                    {guide.rationale}
                  </p>
                  <p className="text-[11px] text-brand-green font-semibold pt-1 border-t border-border-subtle">
                    Action: {guide.action}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* 4. CAMPAIGN PERFORMANCE TABLE & DECISION MATRIX */}
      <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8 space-y-6 shadow-elevation-1 transition-colors">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
          <div>
            <div className="flex items-center gap-2.5">
              <TrendingUp className="w-5 h-5 text-brand-navy dark:text-blue-400" />
              <h3 className="text-xl font-black text-text-primary tracking-tight">
                Campaign Performance & Decision Matrix
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-text-secondary mt-1">
              Compare lead volume, qualification scores, cost per lead, and budget recommendations.
            </p>
          </div>

          {/* Platform Tab Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            {['ALL', 'Google Search', 'Google Ads', 'Meta Ads', 'LinkedIn', 'Direct Inbound'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedPlatformTab(tab)}
                className={`px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition cursor-pointer ${
                  selectedPlatformTab === tab
                    ? 'bg-brand-navy text-white shadow-2xs'
                    : 'bg-surface-subtle text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                {tab === 'ALL' ? 'All Platforms' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* CAMPAIGN COMPARISON TABLE */}
        <div className="bg-surface border border-border-base rounded-2xl overflow-hidden shadow-elevation-1 flex flex-col">
          <div className="overflow-x-auto overflow-y-auto max-h-[660px] table-scrollbar">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 z-20 bg-surface-subtle text-text-secondary font-bold border-b border-border-subtle uppercase text-[10.5px] tracking-wider font-mono shadow-xs">
                <tr>
                  <th className="py-3.5 px-4 bg-surface-subtle">Campaign Name & Channel</th>
                  <th className="py-3.5 px-4 bg-surface-subtle">Leads</th>
                  <th className="py-3.5 px-4 bg-surface-subtle">Quality Breakdown</th>
                  <th className="py-3.5 px-4 bg-surface-subtle">Delivery / Read</th>
                  <th className="py-3.5 px-4 bg-surface-subtle">Reply / Click</th>
                  <th className="py-3.5 px-4 bg-surface-subtle">Avg Score</th>
                  <th className="py-3.5 px-4 bg-surface-subtle">Recommended Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {filteredCampaignList.map((c) => {
                  const recInfo = getRecommendationBadge(c.recommendation);
                  return (
                    <tr
                      key={c.campaign}
                      className="hover:bg-surface-subtle/80 transition"
                    >
                      {/* Campaign Name & Platform */}
                      <td className="py-3.5 px-4 min-w-[240px]">
                        <div className="space-y-1">
                          <span className="font-bold text-text-primary block truncate max-w-xs" title={c.campaign}>
                            {c.campaign}
                          </span>
                          <span className={`inline-block text-[10px] px-2 py-0.5 rounded-full border font-semibold ${getPlatformBadge(c.platform)}`}>
                            {c.platform}
                          </span>
                        </div>
                      </td>

                      {/* Leads Count */}
                      <td className="py-3.5 px-4 font-mono font-black text-text-primary text-sm">
                        {c.total_leads}
                      </td>

                      {/* Quality Breakdown */}
                      <td className="py-3.5 px-4 min-w-[130px]">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold">
                          {c.hot_leads > 0 && (
                            <span className="bg-funnel-hotBg text-funnel-hot border border-funnel-hotBorder px-1.5 py-0.5 rounded">
                              🔥 {c.hot_leads}
                            </span>
                          )}
                          {c.warm_leads > 0 && (
                            <span className="bg-funnel-warmBg text-funnel-warm border border-funnel-warmBorder px-1.5 py-0.5 rounded">
                              ⚡ {c.warm_leads}
                            </span>
                          )}
                          {c.nurture_leads > 0 && (
                            <span className="bg-funnel-nurtureBg text-funnel-nurture border border-funnel-nurtureBorder px-1.5 py-0.5 rounded">
                              🌱 {c.nurture_leads}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Delivery / Read */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div>
                          <span className="font-semibold text-brand-green">{c.delivery_rate}%</span>
                          <span className="text-text-tertiary text-[10px] block">Read: {c.read_rate}%</span>
                        </div>
                      </td>

                      {/* Reply / Click */}
                      <td className="py-3.5 px-4 font-mono text-xs">
                        <div>
                          <span className="font-semibold text-indigo-400">{c.reply_rate}%</span>
                          <span className="text-amber-500 text-[10px] block">Click: {c.click_rate}%</span>
                        </div>
                      </td>

                      {/* Avg Score */}
                      <td className="py-3.5 px-4">
                        <span className={`px-2 py-0.5 rounded-lg border font-mono font-black text-xs ${
                          c.avg_score >= 85 ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' :
                          c.avg_score >= 70 ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' :
                          'bg-surface-subtle text-text-tertiary border-border-base'
                        }`}>
                          {c.avg_score}
                        </span>
                      </td>

                      {/* Recommendation */}
                      <td className="py-3.5 px-4">
                        <div className="space-y-0.5">
                          <span className={`inline-flex items-center gap-1 text-[10.5px] px-2.5 py-1 rounded-full border ${recInfo.badge}`}>
                            <span>{recInfo.icon}</span>
                            <span>{recInfo.label}</span>
                          </span>
                          <span className="text-[10px] text-text-tertiary block font-medium">
                            {recInfo.subtext}
                          </span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Table Footer with Record Count & Vertical Scroll Hint */}
          <div className="px-5 py-2.5 bg-surface-subtle border-t border-border-subtle flex items-center justify-between text-xs text-text-tertiary font-mono">
            <span>
              Showing <strong className="text-text-primary font-bold">{filteredCampaignList.length}</strong> campaigns
            </span>
            <span className="text-[11px] text-text-tertiary flex items-center gap-1.5">
              <span>↕</span>
              <span>Scroll to view all campaigns</span>
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
