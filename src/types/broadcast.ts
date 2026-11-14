// Mirrors lead-broadcaster app/schemas/*.py

export interface BroadcastLead {
  id: string;
  phone_e164: string;
  phone_raw?: string | null;
  full_name?: string | null;
  email?: string | null;
  lead_status?: string | null;
  project_city?: string | null;
  industry?: string | null;
  project_type?: string | null;
  project_area?: string | null;
  project_start_timeline?: string | null;
  project_role?: string | null;
  meta_campaign_name?: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadListResponse {
  total: number;
  items: BroadcastLead[];
}

export interface LeadListQuery {
  phone?: string;
  city?: string;
  industry?: string;
  project_type?: string;
  limit?: number;
  offset?: number;
}

export interface BulkDeleteRequest {
  lead_ids?: string[];
  clear_all?: boolean;
  clear_imports?: boolean;
}

export interface BulkDeleteResponse {
  status: string;
  deleted_count: number;
  imports_cleared: boolean;
  message: string;
}

export type ImportRowOutcome = 'valid' | 'invalid' | 'duplicate_file' | 'duplicate_db';

export interface ImportRowPreview {
  row_number: number;
  raw_data: Record<string, unknown>;
  outcome: ImportRowOutcome | string;
  error_reason?: string | null;
}

export interface ImportPreview {
  import_id: string;
  filename: string;
  file_hash: string;
  total_rows: number;
  valid_rows: number;
  invalid_rows: number;
  duplicate_rows: number;
  status: string;
  created_at: string;
  preview_sample: ImportRowPreview[];
}

export interface ImportConfirmResult {
  import_id: string;
  status: string;
  inserted_leads: number;
  updated_leads: number;
  message: string;
}

export interface WhatsAppTemplate {
  id: string;
  name: string;
  language: string;
  category: string;
  body_text: string;
  variable_count: number;
  meta_template_id?: string | null;
  status: string;
  created_at: string;
}

/** draft | queued | sending | completed | cancelled | paused */
export type CampaignStatus = 'draft' | 'queued' | 'sending' | 'completed' | 'cancelled' | 'paused' | string;

export interface BroadcastCampaign {
  id: string;
  name: string;
  template_name: string;
  language_code: string;
  status: CampaignStatus;
  total_recipients: number;
  sent_count: number;
  delivered_count: number;
  read_count: number;
  failed_count: number;
  created_at: string;
  started_at?: string | null;
  completed_at?: string | null;
}

export interface CampaignCreatePayload {
  name: string;
  template_name: string;
  language_code: string;
  variable_mappings: string[];
  import_id?: string;
  lead_ids?: string[];
  industry_filter?: string;
  city_filter?: string;
}

/** PENDING | CLAIMED | SENDING | ACCEPTED | DELIVERED | READ | FAILED */
export type CampaignMessageState = 'PENDING' | 'CLAIMED' | 'SENDING' | 'ACCEPTED' | 'DELIVERED' | 'READ' | 'FAILED' | string;

export interface CampaignMessage {
  id: string;
  campaign_id: string;
  lead_id?: string | null;
  phone_e164: string;
  template_name: string;
  rendered_variables: unknown[];
  state: CampaignMessageState;
  attempts: number;
  whatsapp_message_id?: string | null;
  error_message?: string | null;
  created_at: string;
  sent_at?: string | null;
}

/** What the audience picker in NewCampaignTab can be pre-filled with from other tabs. */
export type AudienceSeed =
  | { kind: 'import'; importId: string; label: string }
  | { kind: 'leads'; leadIds: string[]; label: string };
