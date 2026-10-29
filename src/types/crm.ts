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

export interface Followup {
  id: string;
  lead_id: string;
  lead_name: string;
  title: string;
  due_date: string;
  priority: 'high' | 'medium' | 'low';
  status: 'pending' | 'completed';
  assigned_to: string;
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

export type ActivePageView = 'desk' | 'analytics' | 'appointments' | 'channel_partners' | 'applicators' | 'simulator' | 'settings';

export interface CampaignAnalyticsMetric {
  campaign: string;
  platform: 'Google Search' | 'Google Ads' | 'Meta Ads' | 'LinkedIn' | 'Direct Inbound' | 'WhatsApp Direct';
  total_leads: number;
  delivery_rate: number;
  read_rate: number;
  reply_rate: number;
  click_rate: number;
  hot_leads: number;
  warm_leads: number;
  nurture_leads: number;
  out_of_scope_leads: number;
  avg_score: number;
  conversion_rate: number;
  cost_per_lead: number;
  est_pipeline_value: number;
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


