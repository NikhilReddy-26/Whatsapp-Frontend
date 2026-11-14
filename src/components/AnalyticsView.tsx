import React, { useState, useEffect, useRef, useCallback } from 'react';
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
  ArrowDownRight,
  Megaphone,
  Sparkles,
  Zap,
  Flame,
  RefreshCw,
  AlertCircle,
} from 'lucide-react';
import type { Lead, CampaignAnalyticsMetric, HourlyLeadBucket, AnalyticsOverviewResponse } from '../types/crm';
import { crmApi } from '../services/api';
import { useToast } from '../context/ToastContext';
import { AnimatedNumber } from './ui/AnimatedNumber';
import { Card } from './ui/Card';
import { Button } from './ui/Button';
import { Badge } from './ui/Badge';
import { AnimatedText } from './ui/AnimatedText';
import { perspectiveCardIn, staggerContainer } from '../lib/motion';

interface AnalyticsViewProps {
  leads?: Lead[];
  onSelectCampaignForDesk?: (campaign: string) => void;
  onNavigateToDesk?: () => void;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  leads: _leads,
  onSelectCampaignForDesk: _onSelectCampaignForDesk,
  onNavigateToDesk: _onNavigateToDesk,
}) => {
  const shouldReduceMotion = useReducedMotion();
  const { toast } = useToast();

  const [selectedCampaignId, setSelectedCampaignId] = useState<string>('ALL');
  const [selectedTimeWindow, setSelectedTimeWindow] = useState<'today' | '7d' | '30d' | 'all'>('7d');
  const [selectedPlatformTab, setSelectedPlatformTab] = useState<string>('ALL');
  const [activeHoverHour, setActiveHoverHour] = useState<HourlyLeadBucket | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingInitial, setIsLoadingInitial] = useState(true);
  const [overviewData, setOverviewData] = useState<AnalyticsOverviewResponse | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const requestSeqRef = useRef(0);
  const overviewDataRef = useRef<AnalyticsOverviewResponse | null>(null);
  overviewDataRef.current = overviewData;

  const fetchData = useCallback(
    async (isManualSync = false) => {
      const seq = ++requestSeqRef.current;
      if (isManualSync) {
        setIsRefreshing(true);
      } else if (!overviewDataRef.current) {
        setIsLoadingInitial(true);
      }
      setFetchError(null);

      try {
        const data = await crmApi.getAnalyticsOverview(
          selectedTimeWindow,
          selectedCampaignId !== 'ALL' ? selectedCampaignId : undefined
        );
        if (seq === requestSeqRef.current) {
          setOverviewData(data);
        }
      } catch (err) {
        if (seq === requestSeqRef.current) {
          const errorMsg = err instanceof Error ? err.message : 'Failed to load analytics data';
          setFetchError(errorMsg);
          toast({
            title: 'Analytics sync failed',
            message: errorMsg,
            type: 'error',
          });
        }
      } finally {
        if (seq === requestSeqRef.current) {
          setIsLoadingInitial(false);
          setIsRefreshing(false);
        }
      }
    },
    [selectedTimeWindow, selectedCampaignId, toast]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Periodic background refresh every 60s while the document is visible
  useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
        fetchData();
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleManualRefresh = () => {
    fetchData(true);
  };

  const messagingStats = overviewData?.summary;
  const hourlyData = overviewData?.hourly || [];
  const dayOfWeekData = overviewData?.weekdays || [];
  const timingAdvice = overviewData?.timing;
  const rawCampaignList = overviewData?.campaigns || [];

  // Campaigns with a valid UUID / identifier (skips Direct Inbound / null campaign_id)
  const campaignsWithId = rawCampaignList.filter(
    (c): c is CampaignAnalyticsMetric & { campaign_id: string } =>
      typeof c.campaign_id === 'string' && c.campaign_id.length > 0
  );

  // Table lists all campaigns (server-side filtering only applies to summary/hourly/weekdays/timing)
  const filteredCampaignList = rawCampaignList.filter((c) => {
    if (selectedPlatformTab !== 'ALL' && c.platform !== selectedPlatformTab) return false;
    return true;
  });

  const maxLeads = Math.max(1, ...hourlyData.map((b) => b.leads_count));

  const renderDeltaBadge = (delta: number | null | undefined, defaultColor = 'text-brand-green') => {
    if (delta === null || delta === undefined) return null;
    const isNegative = delta < 0;
    return (
      <span
        className={`text-xs font-bold flex items-center ${
          isNegative ? 'text-funnel-hot' : defaultColor
        }`}
      >
        {isNegative ? (
          <ArrowDownRight className="w-3.5 h-3.5" />
        ) : (
          <ArrowUpRight className="w-3.5 h-3.5" />
        )}
        {delta > 0 ? `+${delta}%` : `${delta}%`}
      </span>
    );
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
      default:
        return {
          badge: 'bg-blue-500/15 text-blue-400 border-blue-500/30 font-bold',
          label: 'Maintain Pacing',
          subtext: 'Consistent Conversion',
          icon: '🟢',
        };
    }
  };

  if (isLoadingInitial && !overviewData) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6 animate-pulse">
        <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8 h-36" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4.5 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="bg-surface border border-border-subtle rounded-card h-44" />
          ))}
        </div>
        <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8 h-80" />
        <div className="bg-surface border border-border-subtle rounded-card p-6 sm:p-8 h-96" />
      </div>
    );
  }

  if (fetchError && !overviewData) {
    return (
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-funnel-hot mx-auto" />
        <h3 className="text-xl font-bold text-text-primary">Could not load Analytics overview</h3>
        <p className="text-sm text-text-secondary max-w-md mx-auto">{fetchError}</p>
        <Button variant="primary" onClick={() => fetchData(true)}>
          Retry
        </Button>
      </div>
    );
  }

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
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="bg-surface border border-border-base text-text-primary text-xs sm:text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-brand-navy font-medium truncate max-w-md cursor-pointer shadow-2xs"
            >
              <option value="ALL">All Active Campaigns Aggregate ({campaignsWithId.length})</option>
              {campaignsWithId.map((c) => (
                <option key={c.campaign_id} value={c.campaign_id}>
                  {c.campaign} ({c.total_leads} leads)
                </option>
              ))}
            </select>
          </div>

          {selectedCampaignId !== 'ALL' && (
            <button
              onClick={() => setSelectedCampaignId('ALL')}
              className="text-xs text-brand-navy dark:text-blue-400 hover:underline flex items-center gap-1 font-semibold cursor-pointer"
            >
              Reset to All Campaigns
            </button>
          )}
        </div>
      </div>

      {/* 2. CORE REAL-TIME ANALYTICS CARDS (DELIVERY, READ, REPLY, LEAD GENERATION) */}
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
                  value={messagingStats?.delivery_rate ?? 0}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                {renderDeltaBadge(messagingStats?.deltas?.delivery_rate, 'text-brand-green')}
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
                animate={{ width: `${messagingStats?.delivery_rate ?? 0}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-brand-green h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{(messagingStats?.total_delivered ?? 0).toLocaleString()} delivered</span>
              <span className="text-funnel-hot font-semibold">{(messagingStats?.total_failed ?? 0)} failed</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-brand-green font-semibold">
              <CheckCircle2 className="w-3 h-3 text-brand-green" /> Handshake
            </span>
            <span className="font-mono text-text-primary">
              {messagingStats?.avg_delivery_latency_sec != null
                ? `${messagingStats.avg_delivery_latency_sec}s latency`
                : (messagingStats?.total_failed !== undefined ? `${messagingStats.total_failed} failed` : '—')}
            </span>
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
                  value={messagingStats?.read_rate ?? 0}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                {renderDeltaBadge(messagingStats?.deltas?.read_rate, 'text-blue-500')}
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
                animate={{ width: `${messagingStats?.read_rate ?? 0}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-blue-500 h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{(messagingStats?.total_read ?? 0).toLocaleString()} opened</span>
              <span>{(messagingStats?.total_unread ?? 0).toLocaleString()} pending</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-blue-500 font-semibold">
              <Clock className="w-3 h-3" /> Median Open
            </span>
            <span className="font-mono text-text-primary">
              {messagingStats?.median_time_to_read_min != null ? `${messagingStats.median_time_to_read_min} mins` : '—'}
            </span>
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
                  value={messagingStats?.reply_rate ?? 0}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                {renderDeltaBadge(messagingStats?.deltas?.reply_rate, 'text-brand-green')}
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
                animate={{ width: `${messagingStats?.reply_rate ?? 0}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-indigo-500 h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{(messagingStats?.total_replies ?? 0).toLocaleString()} replies</span>
              <span className="text-brand-green font-semibold">{messagingStats?.ai_automated_replies_pct ?? 0}% auto</span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-indigo-400 font-semibold">
              <Zap className="w-3 h-3" /> AI Engine
            </span>
            <span className="font-mono text-text-primary">
              {messagingStats?.median_reply_time_min != null ? `${messagingStats.median_reply_time_min}m latency` : '—'}
            </span>
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
                  value={messagingStats?.lead_generation_rate ?? 0}
                  decimals={1}
                  suffix="%"
                  className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight"
                />
                {renderDeltaBadge(messagingStats?.deltas?.lead_generation_rate, 'text-brand-green')}
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
                animate={{ width: `${messagingStats?.lead_generation_rate ?? 0}%` }}
                transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                className="bg-gradient-to-r from-purple-500 to-indigo-500 h-full rounded-full"
              />
            </div>
            <div className="flex items-center justify-between text-[11px] text-text-tertiary font-medium">
              <span>{(messagingStats?.total_leads_generated ?? 0).toLocaleString()} leads captured</span>
              <span className="text-purple-400 font-semibold">
                {messagingStats?.total_leads_qualified != null ? `${messagingStats.total_leads_qualified} qualified` : 'Google • Meta • LinkedIn'}
              </span>
            </div>
          </div>

          <div className="pt-2 border-t border-border-subtle flex items-center justify-between text-[11px] text-text-secondary">
            <span className="flex items-center gap-1 text-purple-400 font-semibold">
              <Sparkles className="w-3 h-3 text-purple-400" /> AI Rated Quality
            </span>
            <span className="font-mono text-text-primary">
              Avg Score: {messagingStats?.avg_lead_score ?? 0}/100
            </span>
          </div>
        </Card>
        </motion.div>

      </motion.div>

      {/* 3. PEAK HOURS TIMING INTELLIGENCE & 24-HOUR HISTOGRAM */}
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
            <span>
              {timingAdvice?.golden_hours === 'Not enough data yet'
                ? 'Not enough data yet'
                : `Prime window: ${timingAdvice?.golden_hours || 'Not enough data yet'}`}
            </span>
          </div>
        </div>

        {/* 24-HOUR INTERACTIVE BAR HISTOGRAM */}
        <div className="space-y-3">
          <div className="bg-surface-subtle p-4 sm:p-6 rounded-2xl border border-border-base">
            <div className="overflow-x-auto pb-2">
              <div
                className="gap-1 sm:gap-1.5 items-end h-44 pt-4 min-w-[640px]"
                style={{ display: 'grid', gridTemplateColumns: 'repeat(24, minmax(0, 1fr))' }}
              >
                {hourlyData.map((bucket, idx) => {
                  const heightPercent = maxLeads > 0 ? Math.max(Math.round((bucket.leads_count / maxLeads) * 100), 8) : 8;
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
                        animate={{ height: `${heightPercent}%` }}
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
                    {activeHoverHour.leads_count} Leads ({activeHoverHour.percentage}% of intake)
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
              {timingAdvice?.best_days_short && timingAdvice.best_days_short !== 'Not enough data yet' && (
                <Badge variant="green" size="xs">
                  {timingAdvice.best_days_short} Peak
                </Badge>
              )}
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
              {timingAdvice?.budget_allocation_advice || 'Not enough data yet'}
            </p>

            {(!timingAdvice?.channel_guidance || timingAdvice.channel_guidance.length === 0) ? (
              <div className="p-4 bg-surface rounded-xl border border-border-base text-text-tertiary text-xs">
                Not enough data yet to generate channel-specific pacing recommendations.
              </div>
            ) : (
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
            )}
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
                {filteredCampaignList.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-text-tertiary text-xs">
                      No campaigns found for the selected platform filter.
                    </td>
                  </tr>
                ) : (
                  filteredCampaignList.map((c) => {
                    const recInfo = getRecommendationBadge(c.recommendation);
                    return (
                      <tr
                        key={c.campaign_id || c.campaign}
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
                            {c.hot_leads === 0 && c.warm_leads === 0 && c.nurture_leads === 0 && (
                              <span className="text-text-tertiary font-normal">—</span>
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
                            <span className="text-amber-500 text-[10px] block">
                              Click: {c.click_rate != null ? `${c.click_rate}%` : '—'}
                            </span>
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
                            <span
                              title={c.recommendation_text}
                              className={`inline-flex items-center gap-1 text-[10.5px] px-2.5 py-1 rounded-full border cursor-help ${recInfo.badge}`}
                            >
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
                  })
                )}
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
