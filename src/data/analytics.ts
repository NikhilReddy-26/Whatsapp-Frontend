import { Lead, CampaignAnalyticsMetric, HourlyLeadBucket, DayOfWeekTrend } from '../types/crm';

export interface RealtimeMessagingStats {
  delivery_rate: number;
  total_messages_sent: number;
  total_delivered: number;
  total_failed: number;
  avg_delivery_latency_sec: number;

  read_rate: number;
  total_read: number;
  total_unread: number;
  median_time_to_read_min: number;

  reply_rate: number;
  total_replies: number;
  median_reply_time_min: number;
  ai_automated_replies_pct: number;

  click_rate: number;
  total_clicks: number;
  quote_pdf_clicks: number;
  tds_brochure_clicks: number;
  location_map_clicks: number;

  lead_generation_rate: number;
  total_leads_generated: number;
  avg_lead_score: number;
  high_intent_rate: number;
}

export interface LiveActivityEvent {
  id: string;
  timestamp: string;
  lead_name: string;
  company: string;
  campaign: string;
  type: 'delivery' | 'read' | 'reply' | 'click';
  event_detail: string;
  badge_color: string;
}

export const getRealtimeMessagingStats = (leads: Lead[]): RealtimeMessagingStats => {
  const leadCount = Math.max(leads.length, 1);
  const multiplier = 750; // Real-world B2B campaign message volume scale

  const total_messages_sent = leadCount * multiplier;
  const delivery_rate = 98.7;
  const total_delivered = Math.round((total_messages_sent * delivery_rate) / 100);
  const total_failed = total_messages_sent - total_delivered;

  const read_rate = 86.4;
  const total_read = Math.round((total_delivered * read_rate) / 100);
  const total_unread = total_delivered - total_read;

  const reply_rate = 44.8;
  const total_replies = Math.round((total_read * reply_rate) / 100);

  const click_rate = 29.6;
  const total_clicks = Math.round((total_read * click_rate) / 100);

  const lead_generation_rate = 31.8;
  const total_leads_generated = Math.round((total_replies * lead_generation_rate) / 100);
  const avg_lead_score = leadCount > 0 
    ? Math.round(leads.reduce((acc, curr) => acc + (curr.score || 75), 0) / leadCount)
    : 78;
  const hotAndWarmCount = leads.filter((l) => l.funnel === 'HOT' || l.funnel === 'WARM').length;
  const high_intent_rate = leadCount > 0 ? Math.round((hotAndWarmCount / leadCount) * 100) : 88;

  return {
    delivery_rate,
    total_messages_sent,
    total_delivered,
    total_failed,
    avg_delivery_latency_sec: 1.3,

    read_rate,
    total_read,
    total_unread,
    median_time_to_read_min: 3.4,

    reply_rate,
    total_replies,
    median_reply_time_min: 7.2,
    ai_automated_replies_pct: 91.5,

    click_rate,
    total_clicks,
    quote_pdf_clicks: Math.round(total_clicks * 0.44),
    tds_brochure_clicks: Math.round(total_clicks * 0.38),
    location_map_clicks: Math.round(total_clicks * 0.18),

    lead_generation_rate,
    total_leads_generated,
    avg_lead_score,
    high_intent_rate,
  };
};

export const getLiveActivityFeed = (): LiveActivityEvent[] => {
  return [
    {
      id: 'act-01',
      timestamp: 'Just now (1 min ago)',
      lead_name: 'Ramesh Kumar',
      company: 'SK Industrial Solutions Pvt. Ltd.',
      campaign: 'Google Search - Industrial Flooring Bangalore',
      type: 'click',
      event_detail: 'Clicked TDS Brochure for High-Build Epoxy Mortar',
      badge_color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'act-02',
      timestamp: '3 mins ago',
      lead_name: 'Dr. Priya Sharma',
      company: 'Apex Pharma Labs Ltd.',
      campaign: 'LinkedIn - Pharma Cleanroom Flooring',
      type: 'reply',
      event_detail: 'Replied to AI site inspection proposal for cleanroom audit',
      badge_color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'act-03',
      timestamp: '7 mins ago',
      lead_name: 'Arun Swaminathan',
      company: 'NexGen Robotics & PCB Ltd.',
      campaign: 'Google Ads - ESD Antistatic Flooring',
      type: 'read',
      event_detail: 'Read message: ANSI/ESD S20.20 Earthing specification',
      badge_color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
    {
      id: 'act-04',
      timestamp: '11 mins ago',
      lead_name: 'Anand Vardhan',
      company: 'Anand Realty & Infra',
      campaign: 'Meta Ads - Commercial Roof Waterproofing',
      type: 'click',
      event_detail: 'Downloaded 10-Year Liquid Waterproofing Warranty PDF',
      badge_color: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    },
    {
      id: 'act-05',
      timestamp: '14 mins ago',
      lead_name: 'Kothari Automobiles',
      company: 'Apex Motors & Service Station',
      campaign: 'Google Ads - Auto Service Flooring',
      type: 'delivery',
      event_detail: 'Delivered WhatsApp broadcast with RAL Color Swatches',
      badge_color: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30',
    },
    {
      id: 'act-06',
      timestamp: '19 mins ago',
      lead_name: 'Rajesh Nair',
      company: 'Kerala Marine Processing Ltd.',
      campaign: 'Google Ads - Chemical Resistant PU',
      type: 'reply',
      event_detail: 'Sent message inquiring about -25°C thermal shock screed',
      badge_color: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    },
    {
      id: 'act-07',
      timestamp: '25 mins ago',
      lead_name: 'Kiran Deshmukh',
      company: 'Southern Grid Transmission Corp',
      campaign: 'Direct Inbound - Dielectric Flooring',
      type: 'read',
      event_detail: 'Read CPRI 33kV Dielectric breakdown certificate',
      badge_color: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
    },
  ];
};

export const getCampaignAnalyticsList = (leads: Lead[]): CampaignAnalyticsMetric[] => {
  // Extract all distinct campaigns
  const campaigns = Array.from(new Set(leads.map((l) => l.campaign).filter(Boolean)));

  return campaigns.map((campaignName) => {
    const campaignLeads = leads.filter((l) => l.campaign === campaignName);
    const count = campaignLeads.length;

    const hot = campaignLeads.filter((l) => l.funnel === 'HOT').length;
    const warm = campaignLeads.filter((l) => l.funnel === 'WARM').length;
    const nurture = campaignLeads.filter((l) => l.funnel === 'NURTURE').length;
    const outOfScope = campaignLeads.filter((l) => l.funnel === 'OUT_OF_SCOPE').length;

    const avgScore = count > 0 
      ? Math.round(campaignLeads.reduce((acc, curr) => acc + curr.score, 0) / count)
      : 70;

    const qualifiedCount = campaignLeads.filter((l) => l.status === 'Qualified' || l.stage === 'Visit' || l.stage === 'Quote').length;
    const conversionRate = count > 0 ? Math.round((qualifiedCount / count) * 100) : 50;

    let platform: CampaignAnalyticsMetric['platform'] = 'Google Ads';
    if (campaignName.includes('Google Search')) platform = 'Google Search';
    else if (campaignName.includes('Meta Ads')) platform = 'Meta Ads';
    else if (campaignName.includes('LinkedIn')) platform = 'LinkedIn';
    else if (campaignName.includes('WhatsApp')) platform = 'WhatsApp Direct';
    else if (campaignName.includes('Direct Inbound') || campaignName.includes('Website')) platform = 'Direct Inbound';

    // Tailored metric simulation based on platform characteristics
    let delivery_rate = 98.8;
    let read_rate = 87.5;
    let reply_rate = 45.0;
    let click_rate = 31.0;
    let cost_per_lead = 450;
    let est_pipeline_value = 4500000;
    let peak_hours = '10:00 AM – 01:00 PM';
    let recommendation: CampaignAnalyticsMetric['recommendation'] = 'SCALE_UP';
    let recommendation_text = 'High intent and solid conversion. Recommended to scale ad budget.';

    if (platform === 'Google Search') {
      delivery_rate = 99.4;
      read_rate = 92.0;
      reply_rate = 52.5;
      click_rate = 38.0;
      cost_per_lead = 380;
      est_pipeline_value = 18500000;
      peak_hours = '09:30 AM – 12:30 PM & 03:30 PM – 05:30 PM';
      recommendation = 'SCALE_UP';
      recommendation_text = '⭐ Top Lead Producer! Highest search commercial intent. Scale budget +45% during morning peak hours.';
    } else if (platform === 'LinkedIn') {
      delivery_rate = 99.1;
      read_rate = 90.5;
      reply_rate = 48.0;
      click_rate = 34.2;
      cost_per_lead = 850;
      est_pipeline_value = 24000000;
      peak_hours = '10:30 AM – 01:00 PM & 04:00 PM – 06:00 PM';
      recommendation = 'SCALE_UP';
      recommendation_text = '💎 Highest Deal Value! Generates enterprise pharma and cleanroom decision-makers with massive contract sizes.';
    } else if (platform === 'Meta Ads') {
      delivery_rate = 97.9;
      read_rate = 82.0;
      reply_rate = 36.5;
      click_rate = 24.5;
      cost_per_lead = 290;
      est_pipeline_value = 9500000;
      peak_hours = '11:00 AM – 02:00 PM & 06:00 PM – 09:00 PM';
      if (outOfScope > 0 || nurture > hot) {
        recommendation = 'OPTIMIZE_COPY';
        recommendation_text = '⚠️ High volume, moderate qualification. Add B2B minimum sq ft qualifiers in ad creatives to filter out retail noise.';
      } else {
        recommendation = 'MAINTAIN';
        recommendation_text = '⚡ Good cost efficiency for commercial roofs & multi-level parking. Maintain existing daily pacing.';
      }
    } else if (platform === 'Direct Inbound') {
      delivery_rate = 99.5;
      read_rate = 94.0;
      reply_rate = 61.0;
      click_rate = 42.0;
      cost_per_lead = 120;
      est_pipeline_value = 14000000;
      peak_hours = '09:00 AM – 01:00 PM';
      recommendation = 'SCALE_UP';
      recommendation_text = '🎯 Organic high-trust inquiries. Prompt AI auto-response yields 90%+ qualification.';
    } else if (platform === 'WhatsApp Direct') {
      delivery_rate = 98.2;
      read_rate = 78.0;
      reply_rate = 31.0;
      cost_per_lead = 50;
      est_pipeline_value = 1200000;
      peak_hours = 'All Day';
      recommendation = outOfScope > 0 ? 'PAUSE_REVISE' : 'MAINTAIN';
      recommendation_text = outOfScope > 0
        ? '⏸️ High consumer inquiries (retail paint). Tighten keywords and route consumer queries to retail dealers.'
        : 'Maintain automated qualification bot.';
    } else {
      // Google Ads
      delivery_rate = 98.6;
      read_rate = 86.0;
      reply_rate = 44.0;
      click_rate = 29.5;
      cost_per_lead = 520;
      est_pipeline_value = 11000000;
      peak_hours = '10:00 AM – 01:30 PM & 03:00 PM – 05:00 PM';
      recommendation = 'MAINTAIN';
      recommendation_text = '🟢 Solid industrial performer. Target high-density manufacturing clusters (Peenya, Hosur, Bommasandra).';
    }

    return {
      campaign: campaignName,
      platform,
      total_leads: count,
      delivery_rate,
      read_rate,
      reply_rate,
      click_rate,
      hot_leads: hot,
      warm_leads: warm,
      nurture_leads: nurture,
      out_of_scope_leads: outOfScope,
      avg_score: avgScore,
      conversion_rate: conversionRate,
      cost_per_lead,
      est_pipeline_value,
      recommendation,
      recommendation_text,
      peak_hours,
    };
  }).sort((a, b) => b.total_leads - a.total_leads || b.avg_score - a.avg_score);
};

export const getHourlyLeadDistribution = (): HourlyLeadBucket[] => {
  return [
    { hour_num: 0, hour_label: '00:00 - 02:00', leads_count: 1, intensity: 'low', percentage: 1.5, recommended_action: 'Pause ads (Sleep window)' },
    { hour_num: 2, hour_label: '02:00 - 04:00', leads_count: 0, intensity: 'low', percentage: 0.5, recommended_action: 'Pause ads (Zero intent)' },
    { hour_num: 4, hour_label: '04:00 - 06:00', leads_count: 1, intensity: 'low', percentage: 1.0, recommended_action: 'Pause ads' },
    { hour_num: 6, hour_label: '06:00 - 08:00', leads_count: 3, intensity: 'low', percentage: 3.5, recommended_action: 'Low bid baseline' },
    { hour_num: 8, hour_label: '08:00 - 09:00', leads_count: 6, intensity: 'moderate', percentage: 6.0, recommended_action: 'Warm-up pacing (Start shift)' },
    { hour_num: 9, hour_label: '09:00 - 10:00', leads_count: 14, intensity: 'high', percentage: 14.5, recommended_action: '🚀 High Bid Window (Plant managers checking repairs)' },
    { hour_num: 10, hour_label: '10:00 - 11:00', leads_count: 22, intensity: 'peak', percentage: 22.0, recommended_action: '🔥 PEAK HOUR 1: 100% budget pacing (Contractor queries surge)' },
    { hour_num: 11, hour_label: '11:00 - 12:00', leads_count: 20, intensity: 'peak', percentage: 19.5, recommended_action: '🔥 PEAK HOUR 2: Maximum site visit bookings' },
    { hour_num: 12, hour_label: '12:00 - 13:00', leads_count: 15, intensity: 'high', percentage: 15.0, recommended_action: 'High Bid Window (TDS downloads)' },
    { hour_num: 13, hour_label: '13:00 - 14:00', leads_count: 5, intensity: 'moderate', percentage: 5.5, recommended_action: 'Lunch dip: scale bids -20%' },
    { hour_num: 14, hour_label: '14:00 - 15:00', leads_count: 9, intensity: 'moderate', percentage: 9.0, recommended_action: 'Afternoon resume' },
    { hour_num: 15, hour_label: '15:00 - 16:00', leads_count: 18, intensity: 'peak', percentage: 18.0, recommended_action: '⚡ PEAK HOUR 3: Commercial procurement reviews' },
    { hour_num: 16, hour_label: '16:00 - 17:00', leads_count: 16, intensity: 'high', percentage: 16.5, recommended_action: '⚡ PEAK HOUR 4: Site inspection confirmations' },
    { hour_num: 17, hour_label: '17:00 - 18:00', leads_count: 11, intensity: 'high', percentage: 11.0, recommended_action: 'Evening wrap-up' },
    { hour_num: 18, hour_label: '18:00 - 20:00', leads_count: 6, intensity: 'moderate', percentage: 6.5, recommended_action: 'Taper ad spend' },
    { hour_num: 20, hour_label: '20:00 - 22:00', leads_count: 4, intensity: 'low', percentage: 4.0, recommended_action: 'Off-hours minimum bid' },
    { hour_num: 22, hour_label: '22:00 - 24:00', leads_count: 2, intensity: 'low', percentage: 2.0, recommended_action: 'Pause ads (Prevent wasted clicks)' },
  ];
};

export const getDayOfWeekLeadTrends = (): DayOfWeekTrend[] => {
  return [
    { day: 'Monday', lead_count: 24, qualification_rate: 76, is_peak: false },
    { day: 'Tuesday', lead_count: 38, qualification_rate: 89, is_peak: true },
    { day: 'Wednesday', lead_count: 42, qualification_rate: 93, is_peak: true },
    { day: 'Thursday', lead_count: 36, qualification_rate: 88, is_peak: true },
    { day: 'Friday', lead_count: 28, qualification_rate: 80, is_peak: false },
    { day: 'Saturday', lead_count: 14, qualification_rate: 45, is_peak: false },
    { day: 'Sunday', lead_count: 8, qualification_rate: 30, is_peak: false },
  ];
};

export const getCampaignTimingRecommendation = () => {
  return {
    golden_hours: '09:30 AM – 01:00 PM & 03:00 PM – 05:30 PM',
    best_days: 'Tuesday through Thursday',
    budget_allocation_advice: 'Allocate 75% of your Google & Meta ad budget between 09:30 AM – 01:00 PM and 03:00 PM – 05:30 PM. Turn off overnight deliveries (10:00 PM – 07:00 AM) to save ~₹18,500/month in non-B2B clicks.',
    channel_guidance: [
      {
        channel: 'Google Search Ads',
        timing: '09:00 AM – 02:00 PM',
        rationale: 'Highest search intent when factory plant heads and project managers report floor damage or new shed concrete pours.',
        action: 'Bid +35% higher on keywords like "industrial epoxy flooring contractor" and "cleanroom PU screed" during morning hours.',
      },
      {
        channel: 'LinkedIn Ads',
        timing: '10:00 AM – 01:00 PM & 04:00 PM – 06:30 PM',
        rationale: 'Pharma QC directors and engineering VPs check feeds before lunch and during evening transit.',
        action: 'Promote WHO-GMP & USFDA Cleanroom Flooring compliance whitepapers.',
      },
      {
        channel: 'Meta (Instagram / Facebook)',
        timing: '11:00 AM – 02:00 PM & 05:00 PM – 08:00 PM',
        rationale: 'Terrace waterproofing and car showroom owners browse reels and video case studies during breaks.',
        action: 'Use video before/after transformation reels. Pause residential weekend campaigns.',
      },
    ],
  };
};
