import { BROADCAST_ENDPOINTS as E } from './endpoints';
import { broadcastHttp as http } from './broadcastHttp';
import type {
  BroadcastCampaign,
  BulkDeleteRequest,
  BulkDeleteResponse,
  CampaignCreatePayload,
  CampaignMessage,
  ImportConfirmResult,
  ImportPreview,
  LeadListQuery,
  LeadListResponse,
  WhatsAppTemplate,
} from '../types/broadcast';

export const broadcastApi = {
  // --- imports ---
  uploadLeadsFile(file: File): Promise<ImportPreview> {
    const form = new FormData();
    form.append('file', file);
    return http.upload<ImportPreview>(E.IMPORT_UPLOAD, form);
  },
  getImport: (importId: string) => http.get<ImportPreview>(E.IMPORT_BY_ID(importId)),
  confirmImport: (importId: string) => http.post<ImportConfirmResult>(E.IMPORT_CONFIRM(importId), undefined, true),

  // --- leads ---
  listLeads: (query: LeadListQuery = {}) =>
    http.get<LeadListResponse>(E.LEADS, query as Record<string, string | number | undefined>),
  deleteLead: (leadId: string) => http.delete<BulkDeleteResponse>(E.LEAD_BY_ID(leadId)),
  batchDeleteLeads: (leadIds: string[], clearImports = false) =>
    http.post<BulkDeleteResponse>(E.LEADS_BATCH_DELETE, { lead_ids: leadIds, clear_imports: clearImports } satisfies BulkDeleteRequest),
  purgeLeads: (clearImports = false) =>
    http.post<BulkDeleteResponse>(E.LEADS_BATCH_DELETE, { clear_all: true, clear_imports: clearImports } satisfies BulkDeleteRequest),

  // --- templates ---
  listTemplates: () => http.get<WhatsAppTemplate[]>(E.TEMPLATES),
  syncTemplates: () => http.post<WhatsAppTemplate[]>(E.TEMPLATES_SYNC, undefined, true),

  // --- campaigns ---
  createCampaign: (payload: CampaignCreatePayload) => http.post<BroadcastCampaign>(E.CAMPAIGNS, payload, true),
  listCampaigns: () => http.get<BroadcastCampaign[]>(E.CAMPAIGNS),
  getCampaign: (campaignId: string) => http.get<BroadcastCampaign>(E.CAMPAIGN_BY_ID(campaignId)),
  getCampaignMessages: (campaignId: string, query: { state?: string; limit?: number; offset?: number } = {}) =>
    http.get<CampaignMessage[]>(E.CAMPAIGN_MESSAGES(campaignId), query),
  pauseCampaign: (campaignId: string) => http.post<BroadcastCampaign>(E.CAMPAIGN_PAUSE(campaignId)),
  resumeCampaign: (campaignId: string) => http.post<BroadcastCampaign>(E.CAMPAIGN_RESUME(campaignId)),
  cancelCampaign: (campaignId: string) => http.post<BroadcastCampaign>(E.CAMPAIGN_CANCEL(campaignId)),
};
