/**
 * ColourPlus Lead Desk - Backend API Endpoints & Contract Definitions
 *
 * Mirrors the backend team's API docs (00_ADMIN_AND_AUTHENTICATION.md … 04_CAMPAIGNS_API.md).
 * Every response is wrapped in the envelope `{ success, data }` / `{ success: false, error }`.
 */

// Base API URL configured via Vite environment variables.
// In dev the default '/api/v1' is proxied to the backend by vite.config.ts (avoids CORS).
export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '/api/v1').replace(/\/+$/, '');

// Set VITE_USE_MOCK_API=true to run the whole UI against the bundled demo data (no backend needed).
export const USE_MOCK_API = import.meta.env.VITE_USE_MOCK_API === 'true';

export const API_ENDPOINTS = {
  // --- AUTH ---
  AUTH_LOGIN: `${API_BASE_URL}/auth/login`,

  // --- LEADS ---
  LEADS: `${API_BASE_URL}/leads`,
  LEAD_BY_ID: (id: string) => `${API_BASE_URL}/leads/${id}`,
  LEAD_ASSIGN: (id: string) => `${API_BASE_URL}/leads/${id}/assign`,
  LEADS_BULK_ASSIGN: `${API_BASE_URL}/leads/bulk-assign`,
  LEAD_STAGE: (id: string) => `${API_BASE_URL}/leads/${id}/stage`,
  LEAD_AI_STATUS: (id: string) => `${API_BASE_URL}/leads/${id}/ai-status`,
  LEAD_NOTES: (id: string) => `${API_BASE_URL}/leads/${id}/notes`,
  LEAD_MESSAGES: (id: string) => `${API_BASE_URL}/leads/${id}/messages`,
  LEAD_EXTRACTED_FIELDS: (id: string) => `${API_BASE_URL}/leads/${id}/extracted-fields`,
  LEAD_SITE_VISITS: (id: string) => `${API_BASE_URL}/leads/${id}/site-visits`,

  // --- SITE VISITS ---
  SITE_VISITS: `${API_BASE_URL}/site-visits`,
  SITE_VISIT_BY_ID: (id: string) => `${API_BASE_URL}/site-visits/${id}`,

  // --- CHANNEL PARTNERS ---
  PARTNERS: `${API_BASE_URL}/partners`,
  PARTNER_BY_ID: (id: string) => `${API_BASE_URL}/partners/${id}`,

  // --- CAMPAIGNS ---
  CAMPAIGNS: `${API_BASE_URL}/campaigns`,
  CAMPAIGN_BY_ID: (id: string) => `${API_BASE_URL}/campaigns/${id}`,

  // --- SETTINGS & KPIS ---
  SETTINGS: `${API_BASE_URL}/settings`,
  KPIS: `${API_BASE_URL}/kpis`,
} as const;

// ============================================================================
// RESPONSE ENVELOPE
// ============================================================================

export type ApiEnvelope<T> = { success: true; data: T } | { success: false; error: string };

export interface PaginationInfo {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

export interface Paginated<T> {
  pagination?: PaginationInfo;
  items?: T[];
  data?: T[] | { items: T[]; pagination?: PaginationInfo };
}

// ============================================================================
// AUTH
// ============================================================================

export type BackendUserRole = 'ADMIN' | 'MANAGER' | 'SALES' | 'VIEWER';

export interface BackendUser {
  id: string;
  name: string;
  email: string;
  role: BackendUserRole;
  phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface LoginResponse {
  access_token?: string;
  refresh_token?: string;
  id_token?: string;
  token_type?: string;
  expires_in?: number;
  token?: string;
  user: BackendUser;
}

// ============================================================================
// LEADS
// ============================================================================

export type BackendLeadBand = 'HOT' | 'WARM' | 'NURTURE' | 'out_of_scope' | 'OUT_OF_SCOPE';
export type BackendLeadStage = 'NEW' | 'QUALIFIED' | 'ASSIGNED' | 'VISIT_SCHEDULED' | 'WON' | 'LOST' | string;

export interface BackendMatchedPartner {
  code: string;
  firm_name: string;
  territory: string;
  tier: string;
  full_address: string;
  google_maps_url?: string;
}

export interface BackendExtractedField {
  key: string;
  value: string;
  confidence?: number; // 0-100 or 0-1
}

export interface BackendScoreBreakdown {
  overall_score?: number;
  band?: BackendLeadBand;
  confidence?: number; // 0-100
  fit_and_spec?: number;
  fit_and_spec_max?: number;
  opportunity_scale?: number;
  opportunity_scale_max?: number;
  commercial_intent?: number;
  commercial_intent_max?: number;
  timeline_urgency?: number;
  timeline_urgency_max?: number;
  data_completeness?: number;
  data_completeness_max?: number;
  reasons?: string[];
  summary_quote?: string;
}

export interface BackendFacts {
  address_text?: string;
  area_sqft?: number;
  assigned_partner?: string;
  city?: string;
  company_name?: string;
  confidence?: number;
  facility_sector?: string;
  facility_specifics?: string;
  lat?: string | number;
  lng?: string | number;
  matched_partner?: BackendMatchedPartner;
  product_specification?: string;
  quote_text?: string;
  recommended_product?: string;
  timeline_days?: number;
  summary_quote?: string;
  extracted_technical_fields?: BackendExtractedField[];
  [key: string]: unknown;
}

export interface BackendLead {
  id: string;
  ref_no: string;
  contact_id?: string;
  contact_name: string;
  contact_phone: string;
  campaign_id: string | null;
  campaign_name: string | null;
  company_name: string | null;
  area_sqft: number | null;
  timeline_days: number | null;
  city: string | null;
  address_text: string | null;
  lat: number | null;
  lng: number | null;
  product: string | null;
  recommended_product?: string | null;
  product_specification?: string | null;
  facility_sector?: string | null;
  facility_specifics?: string | null;
  quote_text?: string | null;
  stage: BackendLeadStage;
  band: BackendLeadBand;
  score_total: number;
  score_fit?: number;
  score_opportunity?: number;
  score_intent?: number;
  score_urgency?: number;
  score_completeness?: number;
  score_reasons?: string[] | null;
  bot_status: string;
  needs_human: boolean;
  assigned_partner?: string | null;
  matched_partner?: BackendMatchedPartner | null;
  extracted_technical_fields?: BackendExtractedField[] | null;
  score_breakdown?: BackendScoreBreakdown | null;
  facts?: BackendFacts;
  created_at: string;
  updated_at: string;
}

export interface LeadListQuery {
  page?: number;
  limit?: number;
  q?: string;
  search?: string;
  campaign_id?: string;
  campaign?: string;
  product?: string;
  month?: string;
  date?: string;
  state?: string;
  territory?: string;
  facility_sector?: string;
  assignment?: 'assigned' | 'unassigned';
  today?: boolean;
  band?: string;
  stage?: BackendLeadStage;
  needs_human?: boolean;
  assigned_to?: string;
}

// ============================================================================
// SITE VISITS
// ============================================================================

export type BackendSiteVisitStatus = 'SCHEDULED' | 'RESCHEDULED' | 'COMPLETED' | 'CANCELLED';

export interface BackendSiteVisit {
  id: string;
  lead_id: string;
  contact_name?: string;
  company_name?: string;
  area_sqft?: number;
  city?: string;
  visit_date: string;
  time_slot: string;
  field_engineer_assigned: string;
  field_engineer_id?: string | null;
  site_address: string;
  inspection_objectives: string;
  status: BackendSiteVisitStatus;
  notes?: string | null;
  created_at: string;
  updated_at?: string;
}

export interface CreateSiteVisitPayload {
  lead_id?: string; // only for the standalone POST /site-visits
  visit_date: string;
  time_slot: string;
  field_engineer_assigned: string;
  field_engineer_id?: string;
  site_address: string;
  inspection_objectives: string;
  notes?: string;
}

export type UpdateSiteVisitPayload = Partial<Omit<CreateSiteVisitPayload, 'lead_id'>> & {
  status?: BackendSiteVisitStatus;
};

// ============================================================================
// CHANNEL PARTNERS
// ============================================================================

export type BackendPartnerTier = 'TIER_1' | 'TIER_2' | 'TIER_3';

export interface BackendPartner {
  id: string;
  partner_code: string;
  firm_name: string;
  contact_person?: string | null;
  role_designation?: string | null;
  state: string;
  territory_name?: string | null;
  priority_tier?: BackendPartnerTier | null;
  covered_cities?: string[] | null;
  phone_e164: string;
  email?: string | null;
  focus_industries?: string | null;
  is_active: boolean;
  assigned_leads_count: number;
  created_at: string;
  updated_at: string;
}

export interface CreatePartnerPayload {
  partner_code: string;
  firm_name: string;
  contact_person?: string;
  role_designation: string;
  state: string;
  territory_name: string;
  priority_tier: BackendPartnerTier;
  covered_cities: string[];
  phone_e164: string;
  email: string;
  focus_industries?: string;
  is_active?: boolean;
}

// ============================================================================
// CAMPAIGNS
// ============================================================================

export interface BackendCampaign {
  id: string;
  name: string;
  code: string;
  product: string;
  status: 'ACTIVE' | 'PAUSED' | 'ARCHIVED';
  leads_count: number;
  created_at: string;
}
