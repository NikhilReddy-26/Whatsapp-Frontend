export type FunnelCategory = 'HOT' | 'WARM' | 'NURTURE' | 'OUT_OF_SCOPE';

export type PipelineStage = 'Lead' | 'Qualified' | 'Visit' | 'Quote' | 'Follow-up' | 'Won';

export interface ExtractedField {
  key: string;
  value: string;
  confidence?: number;
  source_message?: string;
  timestamp?: string;
  is_verified?: boolean;
}

export interface ScoreBreakdown {
  fit: number;          // Actual fit score
  fit_max?: number;     // e.g. 30
  opportunity: number;  // Actual opportunity score
  opportunity_max?: number; // e.g. 25
  intent: number;       // Actual intent score
  intent_max?: number;  // e.g. 20
  urgency: number;      // Actual urgency score
  urgency_max?: number; // e.g. 15
  completeness: number; // Actual completeness score
  completeness_max?: number; // e.g. 10
  overall_score?: number;
  confidence?: number;
  band?: string;
  reasons?: string[];
  summary_quote?: string;
}

export interface LocationInfo {
  address: string;
  maps_link: string;
  city: string;
  state: string;
  area_sqft?: number;
}

export interface NextAction {
  title: string;
  description: string;
  due_date?: string;
  type?: 'visit' | 'call' | 'quote' | 'review' | 'manual';
}

export type FlooringAreaCategory =
  | 'Factory & Industrial'
  | 'Pharma & Cleanroom'
  | 'Warehouse & Logistics'
  | 'Commercial & Terrace'
  | 'Cold Storage & Food'
  | 'Household & Residential'
  | 'Automobile & Garages'
  | 'Other / General'
  | (string & {});

export const COLOURPLUS_PRODUCTS = [
  'Epoxy Floor Coating',
  'Epoxy Self-Leveling – Matt Finish',
  'Anti-Skid Coating Flooring',
  'ESD Coating Flooring',
  'Epoxy Matt Finish Flooring',
  'High-Build Epoxy Mortar',
  'Epoxy Polyurethane (EPU) Coating',
  'Polyurethane Coating',
  'Dielectric Insulation Flooring',
  'Polycrete Flooring',
  'Wall Coating',
  'Waterproofing',
  'Anti-Corrosive Coating',
  'Cementitious Underlay',
  'Coving',
  'Marking (Yellow / White)',
] as const;

export type ProductType = (typeof COLOURPLUS_PRODUCTS)[number] | (string & {});

export interface FlooringAreaInfo {
  category: FlooringAreaCategory;
  sub_type?: string;
  source_message: string;
  confidence: number;
  extracted_at?: string;
}

export interface Lead {
  id: string;
  whatsapp_number: string;
  name: string;
  company: string;
  campaign: string;
  language: string;
  status: string;
  funnel: FunnelCategory;
  score: number;
  confidence: number;
  reason: string;
  score_breakdown: ScoreBreakdown;
  location: LocationInfo;
  fields: ExtractedField[];
  next_action: NextAction;
  stage: PipelineStage;
  assigned_to: string;
  ai_active: boolean;
  unreplied_hours?: number;
  created_at: string;
  updated_at: string;
  flooring_category?: FlooringAreaCategory;
  flooring_area?: FlooringAreaInfo;
  product?: ProductType;
  // Backend API attributes
  ref_no?: string;
  campaign_id?: string;
  matched_partner?: MatchedPartner;
  assigned_partner?: string;
  product_specification?: string;
  recommended_product?: string;
  facility_sector?: string;
  facility_specifics?: string;
  quote_text?: string;
  timeline_days?: number;
  needs_human?: boolean;
  bot_status?: string;
  score_reasons?: string[];
  facts?: Record<string, unknown>;
}

// Territory partner the backend matched to a lead (by location)
export interface MatchedPartner {
  code: string;
  firm_name: string;
  territory: string;
  tier: string;
  full_address: string;
  google_maps_url?: string;
}

export type MessageSender = 'customer' | 'ai' | 'human' | 'system';
export type MessageType = 'text' | 'location' | 'image' | 'voice' | 'system_note';

export interface MessageLocationData {
  name: string;
  address: string;
  maps_url: string;
  lat?: number;
  lng?: number;
}

export interface ExtractedChip {
  label: string;
  value: string;
}

export interface ConversationComposeState {
  can_reply: boolean;
  reason?: 'WINDOW_CLOSED' | 'OPTED_OUT' | 'LEAD_CLOSED' | 'FORBIDDEN' | string;
  will_take_over?: boolean;
  window_expires_at?: string;
}

export interface Message {
  id: string;
  lead_id: string;
  sender: MessageSender;
  text: string;
  type: MessageType;
  media_url?: string;
  location_data?: MessageLocationData;
  timestamp: string;
  pacing_delay?: string;
  extracted_chips?: ExtractedChip[];
  status?: string;
  status_icon?: string;
  ai_generated?: boolean;
  sender_label?: string;
  created_at?: string;
  side?: string;
  sent_by?: { id: string; name: string } | null;
  day?: string;
}

export interface Appointment {
  id: string;
  lead_id: string;
  lead_name: string;
  company: string;
  date: string;
  time: string;
  location: string;
  engineer: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  inspection_objectives?: string;
  notes?: string;
}

/**
 * Follow-ups screen (GET /api/v1/followups). Every lead on the screen sits in exactly one bucket:
 *  - SCHEDULED       the follow-up engine planned a message that has not gone out yet
 *  - AWAITING_REPLY  a follow-up was sent and the customer has not written back
 *  - REPLIED         the customer wrote back after a follow-up
 *  - NO_REPLY        a follow-up went out and the customer stayed silent: sales should call
 *  - NEEDS_MANUAL    the 24-hour WhatsApp window is closed and the lead is unfinished: call, or use a template
 *  - NOT_SENT        a planned follow-up was cancelled or failed
 */
export type FollowupBucket =
  | 'SCHEDULED'
  | 'AWAITING_REPLY'
  | 'REPLIED'
  | 'NO_REPLY'
  | 'NEEDS_MANUAL'
  | 'NOT_SENT';

export type FollowupKind = 'INCOMPLETE_INFO' | 'QUALIFIED_INACTIVE';

export interface FollowupCounts {
  scheduled: number;
  awaiting_reply: number;
  replied: number;
  no_reply: number;
  needs_manual: number;
  not_sent: number;
  followed_up: number;
  reply_rate: number; // 0..1
}

export interface FollowupItem {
  lead_id: string;
  ref_no: string;
  name: string;
  phone: string;
  company: string;
  city: string;
  stage: string;
  band: string;
  assigned_to_name: string;
  bot_status: string;
  needs_human: boolean;
  bucket: FollowupBucket;
  kind: FollowupKind;
  /** The follow-up's own status; empty for NEEDS_MANUAL leads the engine never planned. */
  status: string;
  /** The message the engine wrote (empty until one is generated). */
  message: string;
  missing_fields: string[];
  cancel_reason: string;
  last_error: string;
  due_at: string | null;
  sent_at: string | null;
  last_customer_message_at: string | null;
  window_expires_at: string | null;
  window_open: boolean;
  opted_out: boolean;
  call_attempts: number;
  last_outcome: string;
}

export interface FollowupList {
  counts: FollowupCounts;
  items: FollowupItem[];
  pagination: { page: number; limit: number; total: number; total_pages: number };
}

export interface FollowupQuery {
  bucket?: FollowupBucket;
  kind?: FollowupKind;
  window?: 'open' | 'closed';
  q?: string;
  page?: number;
  limit?: number;
}

export type SalesActivityType = 'CALL' | 'WHATSAPP' | 'CALLBACK' | 'VISIT';
export type SalesActivityOutcome =
  | 'NO_ANSWER'
  | 'INTERESTED'
  | 'NOT_INTERESTED'
  | 'CALLBACK_REQUESTED'
  | 'SCHEDULED'
  | 'COMPLETED';

export interface FollowupActivityRequest {
  lead_ids: string[];
  type: SalesActivityType;
  outcome: SalesActivityOutcome;
  note?: string;
}

export interface FollowupActivityResponse {
  succeeded: number;
  failed: number;
  results: { lead_id: string; ok: boolean; code?: string; message?: string }[];
}

export interface Note {
  id: string;
  lead_id: string;
  author: string;
  text: string;
  timestamp: string;
}

export interface ActivityLog {
  id: string;
  lead_id: string;
  action: string;
  actor: string;
  timestamp: string;
  details?: string;
}

export interface KpiData {
  total_leads: number;
  new_leads_today: number;
  hot_leads: number;
  unanswered_over_20h: number;
  site_visits_confirmed: number;
  closed_leads: number;
  average_score: number;
  cost_per_lead: string;
  assigned_leads?: number;
}

export interface CRMSettings {
  scoring_thresholds: {
    hot_min: number;
    warm_min: number;
    nurture_min: number;
  };
  supported_languages: string[];
  ai_mode: 'auto' | 'hybrid' | 'manual';
  auto_assign_hot: boolean;
  unreplied_warning_threshold_hours: number;
  products: string[];
  states: string[];
  facility_sectors: string[];
}

export type ActivePageView = 'desk' | 'followups' | 'analytics' | 'appointments' | 'channel_partners' | 'applicators' | 'broadcast' | 'simulator' | 'settings';

export interface CampaignAnalyticsMetric {
  campaign: string;
  campaign_id?: string | null;
  platform: 'Google Search' | 'Google Ads' | 'Meta Ads' | 'LinkedIn' | 'Direct Inbound' | 'WhatsApp Direct';
  total_leads: number;
  delivery_rate: number;
  read_rate: number;
  reply_rate: number;
  click_rate: number | null;
  hot_leads: number;
  warm_leads: number;
  nurture_leads: number;
  out_of_scope_leads: number;
  avg_score: number;
  conversion_rate: number;
  cost_per_lead: number | null;
  est_pipeline_value: number | null;
  recommendation: 'SCALE_UP' | 'MAINTAIN' | 'OPTIMIZE_COPY' | 'PAUSE_REVISE';
  recommendation_text: string;
  peak_hours: string;
}

export interface HourlyLeadBucket {
  hour_label: string;
  hour_num: number;
  leads_count: number;
  intensity: 'low' | 'moderate' | 'high' | 'peak';
  percentage: number;
  recommended_action: string;
}

export interface DayOfWeekTrend {
  day: string;
  lead_count: number;
  qualification_rate: number;
  is_peak: boolean;
}

export interface AnalyticsDeltas {
  delivery_rate: number | null;
  read_rate: number | null;
  reply_rate: number | null;
  lead_generation_rate: number | null;
}

export interface AnalyticsSummary {
  window?: 'today' | '7d' | '30d' | 'all';
  from?: string;
  to?: string;

  delivery_rate: number;
  total_messages_sent: number;
  total_delivered: number;
  total_failed: number;
  avg_delivery_latency_sec: number | null;

  read_rate: number;
  total_read: number;
  total_unread: number;
  median_time_to_read_min: number | null;

  reply_rate: number;
  total_replies: number;
  median_reply_time_min: number | null;
  ai_automated_replies_pct: number;

  click_rate: number | null;
  total_clicks: number | null;
  quote_pdf_clicks?: number | null;
  tds_brochure_clicks?: number | null;
  location_map_clicks?: number | null;

  lead_generation_rate: number;
  total_leads_generated: number;
  total_leads_qualified?: number;
  avg_lead_score: number;
  high_intent_rate: number;

  deltas?: AnalyticsDeltas | null;
}

export interface ChannelGuidance {
  channel: string;
  timing: string;
  rationale: string;
  action: string;
}

export interface AnalyticsTiming {
  golden_hours: string;
  best_days: string;
  best_days_short: string;
  budget_allocation_advice: string;
  channel_guidance: ChannelGuidance[];
  sample_size?: number;
}

export interface AnalyticsOverviewResponse {
  window: 'today' | '7d' | '30d' | 'all';
  from: string;
  to: string;
  summary: AnalyticsSummary;
  hourly: HourlyLeadBucket[];
  weekdays: DayOfWeekTrend[];
  timing: AnalyticsTiming;
  campaigns: CampaignAnalyticsMetric[];
}

export interface Territory {
  territoryId: string;
  state: string;
  priorityTier: string;
  territoryName: string;
  cities: string[];
  cityCount: number;
  demandDrivers: string;
}

export interface Campaign {
  id: string;
  name: string;
  code: string;
  product: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  leads_count: number;
}

export interface ChannelPartner {
  id: string; // partner code, e.g. CP-026
  backend_id?: string; // backend UUID, used for PATCH/DELETE
  name: string;
  role: string;
  contact_person?: string;
  email?: string;
  state: string;
  whatsapp_number: string;
  territory_id?: string;
  territory_name?: string;
  cities?: string[];
  priority_tier?: string;
  demand_drivers?: string;
  assigned_lead_count?: number;
}

export interface ChannelPartnerLead {
  id: string;
  firm_name: string;
  contact_person: string;
  whatsapp_number: string;
  email?: string;
  city: string;
  state: string;
  campaign: string;
  business_profile: string;
  warehouse_sqft?: number;
  dealers_network_count?: number;
  investment_capacity: string;
  applied_at: string;
  status: 'New Inquiry' | 'In Screening' | 'Approved' | 'Rejected';
  notes?: string;
}

export interface Applicator {
  id: string;
  name: string;
  agency: string;
  specialization: string;
  city: string;
  state: string;
  phone: string;
  experienceYears: number;
  rating: number;
  verified: boolean;
}

export interface ApplicatorLead {
  id: string;
  firm_name: string;
  master_contractor: string;
  whatsapp_number: string;
  city: string;
  state: string;
  campaign: string;
  specialization: string;
  crew_size: number;
  experience_years: number;
  machinery_equipment: string;
  weekly_capacity_sqft: string;
  applied_at: string;
  status: 'New Application' | 'Skill Audit Pending' | 'Certified' | 'Rejected';
  notes?: string;
}


