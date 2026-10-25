/**
 * ColourPlus Lead Desk - Backend API Endpoints & Contract Definitions
 * 
 * This file centralizes all backend endpoint URLs, request payload types,
 * and response contracts for connecting the Frontend to FastAPI / Express / PostgreSQL.
 */

import type {
  Lead,
  Message,
  KpiData,
  Appointment,
  Followup,
  CRMSettings,
  PipelineStage,
  ChannelPartner,
  ChannelPartnerLead,
  Applicator,
  ApplicatorLead,
  CampaignAnalyticsMetric,
  ScoreBreakdown,
  FlooringAreaCategory,
  ExtractedField,
} from '../types/crm';

// Base API URL configured via Vite environment variables
export const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api';

export const API_ENDPOINTS = {
  // --- 1. HEALTH & SYSTEM ---
  HEALTH: `${API_BASE_URL}/health`,

  // --- 2. KPIS & ANALYTICS ---
  KPIS: `${API_BASE_URL}/kpis`,
  CAMPAIGN_ANALYTICS: `${API_BASE_URL}/analytics/campaigns`,

  // --- 3. LEADS MANAGEMENT ---
  LEADS: `${API_BASE_URL}/leads`,
  LEAD_BY_ID: (id: string) => `${API_BASE_URL}/leads/${id}`,
  LEAD_ASSIGN: (id: string) => `${API_BASE_URL}/leads/${id}/assign`,
  LEADS_BULK_ASSIGN: `${API_BASE_URL}/leads/bulk-assign`,
  LEAD_STAGE: (id: string) => `${API_BASE_URL}/leads/${id}/stage`,
  LEAD_NOTES: (id: string) => `${API_BASE_URL}/leads/${id}/notes`,
  LEAD_AI_STATUS: (id: string) => `${API_BASE_URL}/leads/${id}/ai-status`,
  LEAD_SCORE: (id: string) => `${API_BASE_URL}/leads/${id}/score`,
  LEAD_FLOORING_CATEGORY: (id: string) => `${API_BASE_URL}/leads/${id}/flooring-category`,
  LEAD_EXTRACTED_FIELDS: (id: string) => `${API_BASE_URL}/leads/${id}/extracted-fields`,

  // --- 4. WHATSAPP CHAT & MESSAGES ---
  LEAD_MESSAGES: (id: string) => `${API_BASE_URL}/leads/${id}/messages`,
  WHATSAPP_WEBHOOK: `${API_BASE_URL}/webhooks/whatsapp`,

  // --- 5. SITE VISITS & APPOINTMENTS ---
  APPOINTMENTS: `${API_BASE_URL}/appointments`,
  APPOINTMENT_BY_ID: (id: string) => `${API_BASE_URL}/appointments/${id}`,

  // --- 6. FOLLOW-UP TASKS ---
  FOLLOWUPS: `${API_BASE_URL}/followups`,
  FOLLOWUP_TOGGLE: (id: string) => `${API_BASE_URL}/followups/${id}/toggle-status`,

  // --- 7. CRM SETTINGS & MASTER DATA ---
  SETTINGS: `${API_BASE_URL}/settings`,
  SETTINGS_RESET: `${API_BASE_URL}/settings/reset-defaults`,
  SETTINGS_PRODUCTS: `${API_BASE_URL}/settings/products`,
  SETTINGS_PRODUCT_DELETE: (productName: string) => `${API_BASE_URL}/settings/products/${encodeURIComponent(productName)}`,
  SETTINGS_STATES: `${API_BASE_URL}/settings/states`,
  SETTINGS_STATE_DELETE: (stateName: string) => `${API_BASE_URL}/settings/states/${encodeURIComponent(stateName)}`,
  SETTINGS_SECTORS: `${API_BASE_URL}/settings/facility-sectors`,
  SETTINGS_SECTOR_DELETE: (sectorName: string) => `${API_BASE_URL}/settings/facility-sectors/${encodeURIComponent(sectorName)}`,

  // --- 8. CHANNEL PARTNERS / SALES REPS ---
  CHANNEL_PARTNERS: `${API_BASE_URL}/channel-partners`,
  CHANNEL_PARTNER_BY_ID: (id: string) => `${API_BASE_URL}/channel-partners/${id}`,
  CHANNEL_PARTNER_LEADS: `${API_BASE_URL}/channel-partners/leads`,
  CHANNEL_PARTNER_LEAD_APPROVE: (id: string) => `${API_BASE_URL}/channel-partners/leads/${id}/approve`,
  CHANNEL_PARTNER_LEAD_BY_ID: (id: string) => `${API_BASE_URL}/channel-partners/leads/${id}`,

  // --- 9. CERTIFIED APPLICATORS ---
  APPLICATORS: `${API_BASE_URL}/applicators`,
  APPLICATOR_BY_ID: (id: string) => `${API_BASE_URL}/applicators/${id}`,
  APPLICATOR_LEADS: `${API_BASE_URL}/applicators/leads`,
  APPLICATOR_LEAD_APPROVE: (id: string) => `${API_BASE_URL}/applicators/leads/${id}/approve`,
  APPLICATOR_LEAD_BY_ID: (id: string) => `${API_BASE_URL}/applicators/leads/${id}`,
} as const;

// ============================================================================
// REQUEST PAYLOAD INTERFACES
// ============================================================================

export interface AssignLeadPayload {
  assignee: string;
  sendWhatsappAlert?: boolean;
  sendEmailAlert?: boolean;
  partner?: ChannelPartner | null;
}

export interface BulkAssignPayload {
  lead_ids: string[];
  assignee: string;
  sendWhatsappAlert?: boolean;
  sendEmailAlert?: boolean;
}

export interface UpdateStagePayload {
  stage: PipelineStage;
}

export interface AddNotePayload {
  text: string;
}

export interface ToggleAiPayload {
  ai_active: boolean;
}

export interface UpdateScorePayload {
  lead_score: number;
  score_breakdown: ScoreBreakdown;
}

export interface UpdateFlooringCategoryPayload {
  category: FlooringAreaCategory;
  sub_type?: string;
}

export interface AddExtractedFieldPayload {
  field: ExtractedField;
}

export interface SendMessagePayload {
  text: string;
  sender: 'user' | 'bot' | 'human';
  ai_generated?: boolean;
}

export interface CreateAppointmentPayload {
  lead_id: string;
  lead_name: string;
  company: string;
  date: string;       // YYYY-MM-DD
  time: string;       // e.g. "10:30 AM"
  location: string;
  engineer: string;
  notes?: string;
}

export interface CreateFollowupPayload {
  lead_id: string;
  lead_name: string;
  company: string;
  title: string;
  description: string;
  due_date: string;
  type: 'call' | 'visit' | 'quote' | 'review' | 'manual';
}

export interface AddProductPayload {
  name: string;
}

export interface AddStatePayload {
  name: string;
}

export interface AddFacilitySectorPayload {
  name: string;
}

export interface CreateChannelPartnerPayload {
  id?: string;
  name: string;
  role: string;
  email?: string;
  state: string;
  whatsapp_number: string;
  territory_id?: string;
  territory_name?: string;
  cities?: string[];
  priority_tier?: string;
  demand_drivers?: string;
}

export interface CreateApplicatorPayload {
  name: string;
  agency: string;
  specialization: string;
  city: string;
  state: string;
  phone: string;
  experienceYears: number;
}

// ============================================================================
// GENERIC API RESPONSE CONTRACT
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}
