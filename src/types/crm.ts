export type FunnelCategory = 'HOT' | 'WARM' | 'NURTURE' | 'OUT_OF_SCOPE';

export type PipelineStage = 'Lead' | 'Qualified' | 'Visit' | 'Quote' | 'Follow-up' | 'Won';

export interface ExtractedField {
  key: string;
  value: string;
  confidence: number;
  source_message?: string;
  timestamp?: string;
  is_verified?: boolean;
}

export interface ScoreBreakdown {
  fit: number;          // Max 30
  opportunity: number;  // Max 25
  intent: number;       // Max 20
  urgency: number;      // Max 15
  completeness: number; // Max 10
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
  whatsapp_business_number: string;
}

export type ActivePageView = 'desk' | 'appointments' | 'followups' | 'simulator' | 'settings';
