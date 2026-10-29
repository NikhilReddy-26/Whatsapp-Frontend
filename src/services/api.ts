import type { Lead, Message, KpiData, Appointment, Followup, CRMSettings, PipelineStage, ChannelPartner, ChannelPartnerLead, Applicator, ApplicatorLead, FlooringAreaCategory, Campaign } from '../types/crm';
import { API_ENDPOINTS, USE_MOCK_API } from './endpoints';
import type { BackendLead, BackendSiteVisit, BackendPartner, BackendCampaign, Paginated, UpdateSiteVisitPayload, LeadListQuery } from './endpoints';
import { http } from './http';
import { mapLead, mapSiteVisit, mapPartner, toPartnerPayload } from './mappers';
import { backendSampleCampaigns } from '../data/backendSampleLeads';
import { initialLeads } from '../data/leads';
import { initialMessages } from '../data/messages';
import { initialKpis } from '../data/kpis';
import { initialAppointments } from '../data/appointments';
import { initialFollowups } from '../data/followups';
import { initialSettings } from '../data/settings';
import { initialChannelPartners } from '../data/channelPartners';
import { initialChannelPartnerLeads } from '../data/channelPartnerLeads';
import { initialApplicators } from '../data/applicators';
import { initialApplicatorLeads } from '../data/applicatorLeads';
import { formatLeadAssignmentMessage } from '../utils/formatAssignmentMessage';

import { findSuggestedChannelPartner } from '../data/territories';

// Local Database Simulation Engine (syncs with browser localStorage for full persistence)
const DB_STORAGE_KEYS = {
  SETTINGS: 'colourplus_crm_settings_v3',
  CHANNEL_PARTNERS: 'colourplus_channel_partners_v3',
  CHANNEL_PARTNER_LEADS: 'colourplus_channel_partner_leads_v3',
  APPLICATORS: 'colourplus_applicators_v3',
  APPLICATOR_LEADS: 'colourplus_applicator_leads_v3',
  LEADS: 'colourplus_leads_v3',
};

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem(key);
      if (stored) {
        return JSON.parse(stored);
      }
    }
  } catch (err) {
    console.warn(`[ColourPlus DB Layer] Failed to read ${key} from storage:`, err);
  }
  return fallback;
}

function saveToStorage<T>(key: string, value: T): void {
  // Backend-owned data is never cached into the demo database
  if (!USE_MOCK_API && (key === DB_STORAGE_KEYS.LEADS || key === DB_STORAGE_KEYS.CHANNEL_PARTNERS)) return;
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`[ColourPlus DB Layer] Failed to write ${key} to storage:`, err);
  }
}

// In-Memory store. In mock mode it is seeded from demo data + localStorage;
// in live mode it caches what the backend returned (plus local-only edits, see localLeadPatches).
if (typeof window !== 'undefined' && window.localStorage) {
  try {
    const rawStored = window.localStorage.getItem(DB_STORAGE_KEYS.LEADS);
    if (rawStored && rawStored.includes('lead-mh-001')) {
      window.localStorage.removeItem(DB_STORAGE_KEYS.LEADS);
    }
  } catch {}
}

let leadsStore: Lead[] = USE_MOCK_API ? loadFromStorage(DB_STORAGE_KEYS.LEADS, [...initialLeads]) : [];

// Ensure any stale cached leads with slash in state (e.g. 'Karnataka / Kerala' or 'Tamil Nadu / KA') are cleaned up
let leadsStoreMigrated = false;
leadsStore = leadsStore.map((lead) => {
  if (lead.location?.state?.includes('/')) {
    leadsStoreMigrated = true;
    let cleanState = lead.location.state;
    if (cleanState.includes('Tamil Nadu')) cleanState = 'Tamil Nadu';
    else if (cleanState.includes('Karnataka')) cleanState = 'Karnataka';
    else if (cleanState.includes('Kerala')) cleanState = 'Kerala';
    else cleanState = cleanState.split('/')[0].trim();

    return {
      ...lead,
      location: {
        ...lead.location,
        state: cleanState,
        city: lead.location.city ? lead.location.city.split('/')[0].trim() : lead.location.city,
      },
    };
  }
  return lead;
});

// Migrate any old placeholder sales rep names to Regional Channel Partners
leadsStore = leadsStore.map((lead) => {
  if (lead.assigned_to) {
    if (lead.assigned_to.includes('Vikram Mehta')) {
      leadsStoreMigrated = true;
      return { ...lead, assigned_to: 'CP-001 (Mumbai Metro)' };
    }
    if (lead.assigned_to.includes('Ananya Roy')) {
      leadsStoreMigrated = true;
      return { ...lead, assigned_to: 'CP-002 (Pune Industrial Belt)' };
    }
    if (lead.assigned_to.includes('Suresh Patil')) {
      leadsStoreMigrated = true;
      return { ...lead, assigned_to: 'CP-003 (Nashik-Malegaon)' };
    }
  }
  return lead;
});

if (leadsStoreMigrated) {
  saveToStorage(DB_STORAGE_KEYS.LEADS, leadsStore);
}

let messagesStore: Record<string, Message[]> = USE_MOCK_API ? { ...initialMessages } : {};
let kpisStore: KpiData = { ...initialKpis };
let appointmentsStore: Appointment[] = USE_MOCK_API ? [...initialAppointments] : [];

// Live mode: edits the backend has no endpoint for yet (assignment, stage, AI toggle, fields)
// are kept here and re-applied whenever leads are re-fetched, so they survive a refresh of the list.
const localLeadPatches: Record<string, Partial<Lead>> = {};
let leadsLoadedFromBackend = false;

function commitLead(updated: Lead, patch: Partial<Lead>): Lead {
  leadsStore = leadsStore.map((l) => (l.id === updated.id ? updated : l));
  if (!USE_MOCK_API) {
    localLeadPatches[updated.id] = { ...localLeadPatches[updated.id], ...patch };
  }
  return { ...updated };
}

function withLocalPatch(lead: Lead): Lead {
  const patch = localLeadPatches[lead.id];
  return patch ? { ...lead, ...patch } : lead;
}

async function fetchAllPages<T>(url: string, query: Record<string, string | number> = {}): Promise<T[]> {
  const items: T[] = [];
  for (let page = 1; ; page++) {
    const res = await http.get<Paginated<T>>(url, { ...query, page, limit: 100 });
    items.push(...(res.items || []));
    if (page >= (res.pagination?.total_pages || 1)) return items;
  }
}

function nextPartnerCode(): string {
  const highestNum = channelPartnersStore.reduce((max, cp) => {
    const m = cp.id.match(/CP-(\d+)/i);
    return m ? Math.max(max, parseInt(m[1], 10)) : max;
  }, 0);
  return `CP-${String(highestNum + 1).padStart(3, '0')}`;
}
let followupsStore: Followup[] = [...initialFollowups];

// Hydrate settings ensuring any new fields (products, states, facility_sectors) are safely merged
const loadedSettings = loadFromStorage<Partial<CRMSettings>>(DB_STORAGE_KEYS.SETTINGS, initialSettings);
const sanitizedLoadedStates = loadedSettings?.states?.filter((s) => !s.includes('/'));
let settingsStore: CRMSettings = {
  ...initialSettings,
  ...loadedSettings,
  scoring_thresholds: {
    ...initialSettings.scoring_thresholds,
    ...(loadedSettings?.scoring_thresholds || {}),
  },
  products:
    loadedSettings?.products && Array.isArray(loadedSettings.products) && loadedSettings.products.length > 0
      ? loadedSettings.products
      : [...initialSettings.products],
  states:
    sanitizedLoadedStates && Array.isArray(sanitizedLoadedStates) && sanitizedLoadedStates.length > 0
      ? sanitizedLoadedStates
      : [...initialSettings.states],
  facility_sectors:
    loadedSettings?.facility_sectors && Array.isArray(loadedSettings.facility_sectors) && loadedSettings.facility_sectors.length > 0
      ? loadedSettings.facility_sectors
      : [...initialSettings.facility_sectors],
};

if (loadedSettings?.states?.some((s) => s.includes('/'))) {
  saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
}

const DELETED_PARTNERS_KEY = 'colourplus_deleted_partner_ids';
let deletedPartnerIdsStore: string[] = loadFromStorage(DELETED_PARTNERS_KEY, []);

// Load channel partners store with fallback to all 100 initial territories
let channelPartnersStore: ChannelPartner[] = loadFromStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, [...initialChannelPartners]);
// Ensure all 100 territories/channel partners are always loaded (both mock and live dev modes)
if (!channelPartnersStore || channelPartnersStore.length < initialChannelPartners.length) {
  const existingMap = new Map((channelPartnersStore || []).map((p) => [p.id.toUpperCase(), p]));
  const activeDeleted = new Set(deletedPartnerIdsStore.map((id) => id.toUpperCase()));
  channelPartnersStore = initialChannelPartners
    .filter((init) => !activeDeleted.has(init.id.toUpperCase()))
    .map((init) => {
      const existing = existingMap.get(init.id.toUpperCase());
      return existing ? { ...init, ...existing } : init;
    });
  saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, channelPartnersStore);
}

let channelPartnerLeadsStore: ChannelPartnerLead[] = loadFromStorage(DB_STORAGE_KEYS.CHANNEL_PARTNER_LEADS, [...initialChannelPartnerLeads]);
let applicatorsStore: Applicator[] = loadFromStorage(DB_STORAGE_KEYS.APPLICATORS, [...initialApplicators]);
let applicatorLeadsStore: ApplicatorLead[] = loadFromStorage(DB_STORAGE_KEYS.APPLICATOR_LEADS, [...initialApplicatorLeads]);

export interface AssignLeadOptions {
  sendWhatsappAlert?: boolean;
  sendEmailAlert?: boolean;
  partner?: ChannelPartner | null;
}

/**
 * Service API Abstraction Layer
 * All UI components interact with backend data exclusively via these async methods.
 * To connect to a live FastAPI backend later, simply replace the returned Promises
 * with standard fetch() / axios calls to your FastAPI endpoints.
 */
export const crmApi = {
  // --- LEADS ---
  // GET /api/v1/leads (all pages). Pass refresh=true to re-fetch; query for server-side filter params.
  async getLeads(options?: { refresh?: boolean; query?: LeadListQuery }): Promise<Lead[]> {
    if (USE_MOCK_API) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([...leadsStore]), 100);
      });
    }
    try {
      if (options?.refresh || !leadsLoadedFromBackend) {
        const queryParams = options?.query ? { ...options.query } : {};
        const items = await fetchAllPages<BackendLead>(API_ENDPOINTS.LEADS, queryParams as Record<string, string | number>);
        if (items && items.length > 0) {
          leadsStore = items.map((b) => withLocalPatch(mapLead(b)));
          leadsLoadedFromBackend = true;
        } else {
          leadsStore = [];
        }
      }
    } catch (err) {
      console.warn('[crmApi.getLeads] Backend server unreachable or returned error:', err);
      if (!leadsLoadedFromBackend) {
        leadsStore = [];
      }
    }
    return [...leadsStore];
  },

  // GET /api/v1/leads/{id} - enriched drawer record (more extracted fields than the list)
  async getLeadById(id: string): Promise<Lead | null> {
    if (USE_MOCK_API) {
      return new Promise((resolve) => {
        const found = leadsStore.find((l) => l.id === id || l.ref_no === id) || null;
        setTimeout(() => resolve(found ? { ...found } : null), 50);
      });
    }
    try {
      const raw = await http.get<BackendLead>(API_ENDPOINTS.LEAD_BY_ID(id));
      if (raw) {
        const lead = withLocalPatch(mapLead(raw));
        leadsStore = leadsStore.some((l) => l.id === lead.id)
          ? leadsStore.map((l) => (l.id === lead.id ? lead : l))
          : [...leadsStore, lead];
        return { ...lead };
      }
    } catch (err) {
      console.warn(`[crmApi.getLeadById] Failed to fetch remote lead ${id}:`, err);
    }
    const found = leadsStore.find((l) => l.id === id || l.ref_no === id) || null;
    return found ? { ...found } : null;
  },

  async updateLead(updated: Lead): Promise<Lead> {
    return commitLead({ ...updated, updated_at: new Date().toISOString() }, updated);
  },

  // POST /api/v1/leads/{id}/assign - updates channel partner assignment
  async assignLead(leadId: string, assignee: string, options?: AssignLeadOptions): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    // Find channel partner by name if not passed
    const partner = options?.partner || channelPartnersStore.find((cp) => cp.name === assignee) || null;
    const partnerCode = partner ? partner.id : (assignee.startsWith('CP-') ? assignee.split(' ')[0] : undefined);

    if (!USE_MOCK_API) {
      try {
        await http.post(API_ENDPOINTS.LEAD_ASSIGN(leadId), {
          partner_code: partnerCode || assignee,
          assigned_partner: assignee,
        });
      } catch (err) {
        console.warn(`[crmApi.assignLead] Remote assignment endpoint not available, persisting locally:`, err);
      }
    }

    const updated = commitLead({ ...lead, assigned_to: assignee, assigned_partner: assignee, updated_at: new Date().toISOString() }, { assigned_to: assignee, assigned_partner: assignee });

    // Construct full assignment handoff text message
    const assignmentText = formatLeadAssignmentMessage(updated, partner, assignee);
    const timestamp = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    // 1. Post System Event Card
    const sysEventMsg: Message = {
      id: `sys-assign-${Date.now()}`,
      lead_id: leadId,
      sender: 'system',
      text: `📲 Lead Assigned to ${assignee}`,
      type: 'system_note',
      timestamp,
      extracted_chips: [
        { label: 'Assigned To', value: assignee },
        { label: 'WhatsApp Alert', value: options?.sendWhatsappAlert !== false ? (partner?.whatsapp_number || 'Sent') : 'Disabled' },
        { label: 'Email Notification', value: options?.sendEmailAlert !== false ? (partner?.email || 'Sent') : 'Disabled' },
      ],
    };

    // 2. Post Formatted Lead Assignment Handoff Message into WhatsApp Chat history
    const handoffMsg: Message = {
      id: `msg-assign-${Date.now()}`,
      lead_id: leadId,
      sender: 'system',
      text: assignmentText,
      type: 'text',
      timestamp,
    };

    messagesStore[leadId] = [...(messagesStore[leadId] || []), sysEventMsg, handoffMsg];

    return Promise.resolve(updated);
  },

  // POST /api/v1/leads/bulk-assign - bulk channel partner assignment
  async assignMultipleLeads(leadIds: string[], assignee: string, options?: AssignLeadOptions): Promise<Lead[]> {
    if (!USE_MOCK_API) {
      try {
        await http.post(API_ENDPOINTS.LEADS_BULK_ASSIGN, {
          lead_ids: leadIds,
          assigned_partner: assignee,
        });
      } catch (err) {
        console.warn(`[crmApi.assignMultipleLeads] Remote bulk assign failed, proceeding per-lead:`, err);
      }
    }
    const updatedLeads: Lead[] = [];
    for (const leadId of leadIds) {
      const updated = await this.assignLead(leadId, assignee, options);
      updatedLeads.push(updated);
    }
    return updatedLeads;
  },

  async autoAssignLeadsByTerritory(leadIds: string[]): Promise<{
    updatedLeads: Lead[];
    count: number;
    assignments: { leadId: string; leadName: string; partnerName: string; partnerId: string; city: string; state: string }[];
  }> {
    const updatedLeads: Lead[] = [];
    const assignments: { leadId: string; leadName: string; partnerName: string; partnerId: string; city: string; state: string }[] = [];

    for (const leadId of leadIds) {
      const lead = leadsStore.find((l) => l.id === leadId);
      if (!lead) continue;

      const suggestion = findSuggestedChannelPartner(lead, channelPartnersStore);
      const partner = suggestion.partner || channelPartnersStore[0];
      const partnerName = partner
        ? partner.name
        : suggestion.territory
        ? `${suggestion.territory.territoryId} (${suggestion.territory.territoryName})`
        : 'Regional Channel Partner';

      const updated = await this.assignLead(leadId, partnerName, {
        sendWhatsappAlert: true,
        sendEmailAlert: true,
        partner,
      });

      updatedLeads.push(updated);
      assignments.push({
        leadId,
        leadName: lead.name,
        partnerName,
        partnerId: partner?.id || suggestion.territory?.territoryId || '',
        city: lead.location?.city || '',
        state: lead.location?.state || '',
      });
    }

    return { updatedLeads, count: updatedLeads.length, assignments };
  },

  // PATCH /api/v1/leads/{id}/ai-status - toggle bot vs human takeover
  async toggleAiStatus(leadId: string, aiActive: boolean): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    if (!USE_MOCK_API) {
      try {
        await http.patch(API_ENDPOINTS.LEAD_AI_STATUS(leadId), {
          ai_active: aiActive,
          bot_status: aiActive ? 'BOT_ACTIVE' : 'HUMAN_TAKEOVER',
        });
      } catch (err) {
        console.warn(`[crmApi.toggleAiStatus] Remote AI toggle failed, updating locally:`, err);
      }
    }

    const updated = commitLead({
      ...lead,
      ai_active: aiActive,
      bot_status: aiActive ? 'BOT_ACTIVE' : 'HUMAN_TAKEOVER',
      needs_human: !aiActive,
      updated_at: new Date().toISOString()
    }, {
      ai_active: aiActive,
      bot_status: aiActive ? 'BOT_ACTIVE' : 'HUMAN_TAKEOVER',
      needs_human: !aiActive,
    });

    // Log a system message in the chat
    const sysMsg: Message = {
      id: `sys-${Date.now()}`,
      lead_id: leadId,
      sender: 'system',
      text: aiActive 
        ? '🤖 Handed back to AI Qualification Engine. Automated responses resumed.' 
        : '👤 Sales Executive took over chat. AI auto-reply paused.',
      type: 'system_note',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    messagesStore[leadId] = [...(messagesStore[leadId] || []), sysMsg];
    
    return Promise.resolve(updated);
  },

  // PATCH /api/v1/leads/{id}/stage - advance pipeline stage
  async updateLeadStage(leadId: string, stage: PipelineStage): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    if (!USE_MOCK_API) {
      try {
        await http.patch(API_ENDPOINTS.LEAD_STAGE(leadId), { stage });
      } catch (err) {
        console.warn(`[crmApi.updateLeadStage] Remote stage update failed, updating locally:`, err);
      }
    }

    return commitLead({ ...lead, stage, updated_at: new Date().toISOString() }, { stage });
  },

  // POST /api/v1/leads/{id}/extracted-fields - append new technical field
  async addExtractedField(leadId: string, field: { key: string; value: string; confidence: number; source_message?: string }): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    if (!USE_MOCK_API) {
      try {
        await http.post(API_ENDPOINTS.LEAD_EXTRACTED_FIELDS(leadId), field);
      } catch (err) {
        console.warn(`[crmApi.addExtractedField] Remote field post failed, updating locally:`, err);
      }
    }

    const updatedFields = [...lead.fields, { ...field, timestamp: 'Just now', is_verified: true }];
    return commitLead({ ...lead, fields: updatedFields, updated_at: new Date().toISOString() }, { fields: updatedFields });
  },

  async updateLeadFlooringCategory(leadId: string, category: FlooringAreaCategory, subType?: string): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    const flooring_area = {
      category,
      sub_type: subType || lead.flooring_area?.sub_type,
      source_message: lead.flooring_area?.source_message || 'Manually assigned by manager',
      confidence: 1.0,
      extracted_at: 'Just now'
    };
    return commitLead(
      { ...lead, flooring_category: category, flooring_area, updated_at: new Date().toISOString() },
      { flooring_category: category, flooring_area }
    );
  },

  // --- MESSAGES ---
  // GET /api/v1/leads/{id}/messages
  async getMessages(leadId: string): Promise<Message[]> {
    if (!USE_MOCK_API) {
      try {
        const remoteMsgs = await http.get<Message[]>(API_ENDPOINTS.LEAD_MESSAGES(leadId));
        if (remoteMsgs && Array.isArray(remoteMsgs) && remoteMsgs.length > 0) {
          messagesStore[leadId] = remoteMsgs;
          return [...remoteMsgs];
        }
      } catch (err) {
        // Endpoint not yet implemented on remote server; fall back to store
      }
    }

    const lead = leadsStore.find((l) => l.id === leadId || l.ref_no === leadId);
    let msgs = messagesStore[leadId] || (lead?.ref_no ? messagesStore[lead.ref_no] : undefined) || initialMessages[leadId] || (lead?.ref_no ? initialMessages[lead.ref_no] : undefined);

    if (!msgs || msgs.length === 0) {
      const quote = lead?.quote_text || lead?.flooring_area?.source_message;
      if (quote) {
        msgs = [
          {
            id: `m-${leadId}-quote`,
            lead_id: leadId,
            sender: 'customer',
            text: quote,
            type: 'text',
            timestamp: new Date(lead?.created_at || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          {
            id: `sys-${leadId}-note`,
            lead_id: leadId,
            sender: 'system',
            text: `Enquiry captured from ${lead?.company || lead?.name || 'Customer'}. Sector: ${lead?.facility_sector || lead?.flooring_category || 'Industrial'}. Area: ${lead?.location.area_sqft ? lead.location.area_sqft.toLocaleString() + ' sq ft' : 'N/A'}.`,
            type: 'system_note',
            timestamp: '',
            extracted_chips: [
              { label: 'Product Required', value: lead?.product || 'Epoxy Flooring' },
              { label: 'Facility Sector', value: lead?.facility_sector || lead?.flooring_category || 'Factory & Industrial' },
              { label: 'Location', value: `${lead?.location.city || ''}, ${lead?.location.state || ''}` },
              { label: 'AI Score', value: `${lead?.score || 0}/100 (${lead?.funnel || 'HOT'})` },
            ],
          },
        ];
        messagesStore[leadId] = msgs;
      } else {
        msgs = [];
      }
    }
    return Promise.resolve([...msgs]);
  },

  // POST /api/v1/leads/{id}/messages
  async sendMessage(leadId: string, text: string, sender: 'customer' | 'human' | 'ai' | 'system' = 'human'): Promise<Message> {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      lead_id: leadId,
      sender,
      text,
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    if (!USE_MOCK_API) {
      try {
        await http.post(API_ENDPOINTS.LEAD_MESSAGES(leadId), { text, sender });
      } catch (err) {
        console.warn(`[crmApi.sendMessage] Remote message endpoint unavailable, saved locally:`, err);
      }
    }

    messagesStore[leadId] = [...(messagesStore[leadId] || []), newMsg];
    
    // Update lead unreplied_hours to 0 when human/AI replies
    const lead = leadsStore.find((l) => l.id === leadId);
    if (lead) {
      if (sender === 'human' || sender === 'ai') {
        lead.unreplied_hours = 0;
      }
      lead.updated_at = new Date().toISOString();
    }

    return Promise.resolve(newMsg);
  },

  // --- SIMULATOR: LIVE AI RESPONSE SIMULATION ---
  async simulateWhatsAppInteraction(leadId: string, userText: string): Promise<{ lead: Lead; messages: Message[] }> {
    // 1. Save customer message
    await this.sendMessage(leadId, userText, 'customer');

    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    // If AI is paused (Human active), do not generate AI reply
    if (!lead.ai_active) {
      return { lead, messages: messagesStore[leadId] };
    }

    // 2. Simulate AI Processing Delay & Response Generation based on keywords
    let aiText = '';
    let extractedKey = '';
    let extractedVal = '';
    let confidence = 0.92;
    let scoreDelta = 0;

    const lower = userText.toLowerCase();

    // Live AI Flooring Area Classification from WhatsApp conversation text
    let detectedFlooringCategory: FlooringAreaCategory | null = null;
    let detectedSubType = '';

    if (lower.includes('factory') || lower.includes('industry') || lower.includes('manufacturing') || lower.includes('cnc') || lower.includes('machinery') || lower.includes('plant')) {
      detectedFlooringCategory = 'Factory & Industrial';
      detectedSubType = 'Factory / Heavy Machine Plant';
    } else if (lower.includes('cleanroom') || lower.includes('pharma') || lower.includes('who-gmp') || lower.includes('sterile') || lower.includes('lab')) {
      detectedFlooringCategory = 'Pharma & Cleanroom';
      detectedSubType = 'Cleanroom & Sterile Facility';
    } else if (lower.includes('warehouse') || lower.includes('godown') || lower.includes('logistics') || lower.includes('storage hub')) {
      detectedFlooringCategory = 'Warehouse & Logistics';
      detectedSubType = 'Logistics Warehouse & Storage Hub';
    } else if (lower.includes('terrace') || lower.includes('roof') || lower.includes('commercial') || lower.includes('office') || lower.includes('tech park') || lower.includes('mall')) {
      detectedFlooringCategory = 'Commercial & Terrace';
      detectedSubType = 'Commercial Facility / Roof Terrace';
    } else if (lower.includes('cold storage') || lower.includes('freeze') || lower.includes('seafood') || lower.includes('meat') || lower.includes('dairy') || lower.includes('beverage')) {
      detectedFlooringCategory = 'Cold Storage & Food';
      detectedSubType = 'Cold Storage & Food Processing';
    } else if (lower.includes('bedroom') || lower.includes('home') || lower.includes('house') || lower.includes('apartment') || lower.includes('villa') || lower.includes('flat') || lower.includes('residential')) {
      detectedFlooringCategory = 'Household & Residential';
      detectedSubType = 'Domestic Household Home';
    } else if (lower.includes('auto') || lower.includes('car') || lower.includes('workshop') || lower.includes('garage') || lower.includes('showroom')) {
      detectedFlooringCategory = 'Automobile & Garages';
      detectedSubType = 'Automotive Service Workshop & Bay';
    }

    if (detectedFlooringCategory) {
      lead.flooring_category = detectedFlooringCategory;
      lead.flooring_area = {
        category: detectedFlooringCategory,
        sub_type: detectedSubType,
        source_message: userText,
        confidence: 0.96,
        extracted_at: 'Just now'
      };
      // Log extraction chip into chat history
      const sysAreaMsg: Message = {
        id: `sys-area-${Date.now()}`,
        lead_id: leadId,
        sender: 'system',
        text: `🔍 Extracted from WhatsApp: Flooring Area classified as ${detectedFlooringCategory}`,
        type: 'system_note',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        extracted_chips: [
          { label: 'Flooring Area', value: detectedFlooringCategory },
          { label: 'Facility Type', value: detectedSubType }
        ]
      };
      messagesStore[leadId] = [...(messagesStore[leadId] || []), sysAreaMsg];
    }

    if (lower.includes('sq ft') || lower.includes('sqft') || lower.includes('area') || lower.includes('size')) {
      aiText = `Thank you for specifying the project size! For areas of this volume, ColourPlus offers direct factory material pricing and turnkey application warranties.\n\nCould you also share what type of chemical exposure or heavy loading (e.g., forklifts, acid cleaning) the floor will undergo?`;
      extractedKey = 'Mentioned Area';
      extractedVal = userText;
      confidence = 0.95;
      scoreDelta = 10;
    } else if (lower.includes('price') || lower.includes('cost') || lower.includes('rate') || lower.includes('quote')) {
      aiText = `Our polyurethane screed systems range from ₹ 85 to ₹ 240 per sq ft depending on slab thickness (2mm to 6mm) and surface preparation required.\n\nWould you like our technical sales engineer to visit your site for a free moisture test and substrate evaluation?`;
      extractedKey = 'Inquired Price';
      extractedVal = 'Per sq ft quote requested';
      confidence = 0.89;
      scoreDelta = 5;
    } else if (lower.includes('cricket') || lower.includes('ipl') || lower.includes('rcb') || lower.includes('paint')) {
      aiText = `ColourPlus Polyurethanes Pvt. Ltd. is an industrial heavy-duty flooring & waterproofing manufacturer (B2B only). We do not provide home wall paint or cricket tickets.`;
      extractedKey = 'Out of Scope Trigger';
      extractedVal = userText;
      confidence = 0.99;
      lead.funnel = 'OUT_OF_SCOPE';
      lead.score = 15;
    } else {
      aiText = `Thank you for details. ColourPlus technical team has received your message. Is your facility located in or near Bengaluru/Hosur?`;
      scoreDelta = 2;
    }

    // 3. Save AI message
    await this.sendMessage(leadId, aiText, 'ai');

    // 4. Update Lead Score & Fields if relevant
    if (extractedKey) {
      lead.fields.push({
        key: extractedKey,
        value: extractedVal,
        confidence,
        source_message: userText,
        timestamp: 'Just now'
      });
    }

    lead.score = Math.min(100, Math.max(0, lead.score + scoreDelta));
    if (lead.score >= settingsStore.scoring_thresholds.hot_min) {
      lead.funnel = 'HOT';
    } else if (lead.score >= settingsStore.scoring_thresholds.warm_min) {
      lead.funnel = 'WARM';
    } else if (lead.score > 15) {
      lead.funnel = 'NURTURE';
    }

    lead.updated_at = new Date().toISOString();

    return { lead, messages: messagesStore[leadId] };
  },

  // --- KPIS ---
  async getKpis(): Promise<KpiData> {
    const today = new Date().toDateString();
    const hotCount = leadsStore.filter((l) => l.funnel === 'HOT').length;
    const unansweredCount = leadsStore.filter((l) => (l.unreplied_hours || 0) >= (settingsStore?.unreplied_warning_threshold_hours || 20)).length;
    const visitsCount = appointmentsStore.filter((a) => a.status === 'scheduled').length;
    const closedCount = leadsStore.filter((l) => l.stage === 'Won').length;
    const avgScore = leadsStore.length
      ? Math.round((leadsStore.reduce((acc, l) => acc + l.score, 0) / leadsStore.length) * 10) / 10
      : 0;
    const assignedCount = leadsStore.filter((l) =>
      Boolean(
        (l.assigned_partner && l.assigned_partner.trim() !== '') ||
        (l.assigned_to &&
          l.assigned_to.trim() !== '' &&
          !l.assigned_to.toLowerCase().includes('unassigned') &&
          !l.assigned_to.toLowerCase().includes('disqualification'))
      )
    ).length;

    kpisStore = {
      total_leads: leadsStore.length,
      new_leads_today: leadsStore.filter((l) => l.created_at && new Date(l.created_at).toDateString() === today).length,
      hot_leads: hotCount,
      unanswered_over_20h: unansweredCount,
      site_visits_confirmed: visitsCount,
      closed_leads: closedCount,
      average_score: avgScore,
      cost_per_lead: kpisStore.cost_per_lead || '₹850',
      assigned_leads: assignedCount,
    };
    return { ...kpisStore };
  },

  // --- APPOINTMENTS ---
  // GET /api/v1/site-visits
  async getAppointments(): Promise<Appointment[]> {
    if (!USE_MOCK_API) {
      const visits = await http.get<BackendSiteVisit[]>(API_ENDPOINTS.SITE_VISITS);
      appointmentsStore = (visits || []).map((v) => mapSiteVisit(v, (id) => leadsStore.find((l) => l.id === id)));
    }
    return [...appointmentsStore];
  },

  // POST /api/v1/leads/{id}/site-visits (backend also moves the lead to VISIT_SCHEDULED)
  async createAppointment(app: Omit<Appointment, 'id'>): Promise<Appointment> {
    let newApp: Appointment;
    if (USE_MOCK_API) {
      newApp = { ...app, id: `app-${Date.now()}` };
      appointmentsStore.push(newApp);
    } else {
      const created = await http.post<BackendSiteVisit>(API_ENDPOINTS.LEAD_SITE_VISITS(app.lead_id), {
        visit_date: app.date,
        time_slot: app.time,
        field_engineer_assigned: app.engineer,
        site_address: app.location,
        inspection_objectives: app.inspection_objectives || app.notes || 'Site inspection',
        notes: app.notes,
      });
      newApp = mapSiteVisit(created, (id) => leadsStore.find((l) => l.id === id));
      appointmentsStore = [newApp, ...appointmentsStore];
    }

    // Also update lead stage to 'Visit' if not already
    const lead = leadsStore.find((l) => l.id === app.lead_id);
    if (lead && (lead.stage === 'Lead' || lead.stage === 'Qualified')) {
      lead.stage = 'Visit';
      lead.next_action = {
        title: `Site Visit Scheduled (${app.date})`,
        description: `Site visit by ${app.engineer}`,
        due_date: `${app.date}, ${app.time}`,
        type: 'visit'
      };
    }

    return Promise.resolve(newApp);
  },

  // PATCH /api/v1/site-visits/{id} - reschedule, mark completed, etc.
  async updateAppointment(id: string, changes: UpdateSiteVisitPayload): Promise<Appointment> {
    let updated: Appointment;
    if (USE_MOCK_API) {
      const existing = appointmentsStore.find((a) => a.id === id);
      if (!existing) throw new Error('Site visit not found');
      updated = {
        ...existing,
        date: changes.visit_date ?? existing.date,
        time: changes.time_slot ?? existing.time,
        engineer: changes.field_engineer_assigned ?? existing.engineer,
        location: changes.site_address ?? existing.location,
        inspection_objectives: changes.inspection_objectives ?? existing.inspection_objectives,
        notes: changes.notes ?? existing.notes,
        status: changes.status === 'COMPLETED' ? 'completed' : changes.status === 'CANCELLED' ? 'cancelled' : existing.status,
      };
    } else {
      const res = await http.patch<BackendSiteVisit>(API_ENDPOINTS.SITE_VISIT_BY_ID(id), changes);
      updated = mapSiteVisit(res, (leadId) => leadsStore.find((l) => l.id === leadId));
    }
    appointmentsStore = appointmentsStore.map((a) => (a.id === id ? updated : a));
    return updated;
  },

  // DELETE /api/v1/site-visits/{id}
  async deleteAppointment(id: string): Promise<boolean> {
    if (!USE_MOCK_API) {
      await http.delete(API_ENDPOINTS.SITE_VISIT_BY_ID(id));
    }
    appointmentsStore = appointmentsStore.filter((a) => a.id !== id);
    return true;
  },

  // --- CAMPAIGNS ---
  // GET /api/v1/campaigns?status=ACTIVE
  async getCampaigns(): Promise<Campaign[]> {
    if (USE_MOCK_API) {
      return [...backendSampleCampaigns];
    }
    try {
      const campaigns = await http.get<BackendCampaign[]>(API_ENDPOINTS.CAMPAIGNS);
      if (campaigns && Array.isArray(campaigns) && campaigns.length > 0) {
        return campaigns.map(({ id, name, code, product, status, leads_count }) => ({ id, name, code, product, status, leads_count }));
      }
    } catch (err) {
      console.warn('[crmApi.getCampaigns] Remote campaign fetch failed:', err);
    }
    return [];
  },

  // --- FOLLOWUPS ---
  async getFollowups(): Promise<Followup[]> {
    return Promise.resolve([...followupsStore]);
  },

  async createFollowup(fol: Omit<Followup, 'id'>): Promise<Followup> {
    const newFol: Followup = {
      ...fol,
      id: `fol-${Date.now()}`
    };
    followupsStore.push(newFol);
    return Promise.resolve(newFol);
  },

  async toggleFollowupStatus(id: string): Promise<Followup> {
    const fol = followupsStore.find((f) => f.id === id);
    if (!fol) throw new Error('Followup not found');
    fol.status = fol.status === 'completed' ? 'pending' : 'completed';
    return Promise.resolve({ ...fol });
  },

  // =========================================================================
  // --- SETTINGS & MASTER DATA (PRODUCTS, STATES, FACILITY SECTORS) ---
  // =========================================================================
  /*
   * BACKEND INTEGRATION HANDOFF NOTE:
   * When the backend team finishes the API/database endpoints:
   * 1. Replace localStorage reads & writes with standard fetch/axios calls to your backend:
   *    - GET    /api/settings                     -> Fetches CRMSettings (thresholds, master data)
   *    - PUT    /api/settings                     -> Updates entire CRMSettings
   *    - POST   /api/settings/products            -> Adds product to database catalog
   *    - DELETE /api/settings/products/:name      -> Deletes product from database
   *    - POST   /api/settings/states              -> Adds state/territory to database
   *    - DELETE /api/settings/states/:name        -> Deletes state from database
   *    - POST   /api/settings/facility-sectors    -> Adds facility sector to database
   *    - DELETE /api/settings/facility-sectors/:name -> Deletes facility sector
   *    - GET    /api/channel-partners             -> Fetches registered channel partners
   *    - POST   /api/channel-partners             -> Adds new channel partner
   *    - DELETE /api/channel-partners/:id         -> Removes channel partner
   *    - GET    /api/channel-partner-leads        -> Fetches inbound WhatsApp partner leads
   *    - POST   /api/channel-partner-leads/:id/approve -> Converts lead into active partner
   *    - GET    /api/applicators                  -> Fetches certified applicators
   *    - POST   /api/applicators                 -> Adds new applicator
   *    - DELETE /api/applicators/:id             -> Removes applicator
   *    - GET    /api/applicator-leads             -> Fetches inbound WhatsApp applicator leads
   *    - POST   /api/applicator-leads/:id/approve -> Certifies lead into active applicator
   */
  async getSettings(): Promise<CRMSettings> {
    return Promise.resolve({ ...settingsStore });
  },

  async updateSettings(updated: CRMSettings): Promise<CRMSettings> {
    settingsStore = { ...updated };
    saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    return Promise.resolve({ ...settingsStore });
  },

  // Master Data: Products Catalog
  async getProducts(): Promise<string[]> {
    return Promise.resolve([...settingsStore.products]);
  },

  async addProduct(product: string): Promise<string[]> {
    const trimmed = product.trim();
    if (trimmed && !settingsStore.products.includes(trimmed)) {
      settingsStore.products = [...settingsStore.products, trimmed];
      saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    }
    return Promise.resolve([...settingsStore.products]);
  },

  async deleteProduct(product: string): Promise<string[]> {
    settingsStore.products = settingsStore.products.filter((p) => p !== product);
    saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    return Promise.resolve([...settingsStore.products]);
  },

  // Master Data: Territory / States
  async getStates(): Promise<string[]> {
    return Promise.resolve([...settingsStore.states]);
  },

  async addState(state: string): Promise<string[]> {
    const trimmed = state.trim();
    if (trimmed && !settingsStore.states.includes(trimmed)) {
      settingsStore.states = [...settingsStore.states, trimmed];
      saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    }
    return Promise.resolve([...settingsStore.states]);
  },

  async deleteState(state: string): Promise<string[]> {
    settingsStore.states = settingsStore.states.filter((s) => s !== state);
    saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    return Promise.resolve([...settingsStore.states]);
  },

  // Master Data: Facility Sectors
  async getFacilitySectors(): Promise<string[]> {
    return Promise.resolve([...settingsStore.facility_sectors]);
  },

  async addFacilitySector(sector: string): Promise<string[]> {
    const trimmed = sector.trim();
    if (trimmed && !settingsStore.facility_sectors.includes(trimmed)) {
      settingsStore.facility_sectors = [...settingsStore.facility_sectors, trimmed];
      saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    }
    return Promise.resolve([...settingsStore.facility_sectors]);
  },

  async deleteFacilitySector(sector: string): Promise<string[]> {
    settingsStore.facility_sectors = settingsStore.facility_sectors.filter((s) => s !== sector);
    saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    return Promise.resolve([...settingsStore.facility_sectors]);
  },

  async resetSettingsToDefaults(): Promise<CRMSettings> {
    settingsStore = { ...initialSettings };
    saveToStorage(DB_STORAGE_KEYS.SETTINGS, settingsStore);
    return Promise.resolve({ ...settingsStore });
  },

  // =========================================================================
  // --- CHANNEL PARTNERS / SALES REPS ---
  // =========================================================================
  // GET /api/v1/partners (all pages, active partners only)
  async getChannelPartners(): Promise<ChannelPartner[]> {
    if (!USE_MOCK_API) {
      try {
        const items = await fetchAllPages<BackendPartner>(API_ENDPOINTS.PARTNERS);
        const backendPartners = (items || []).filter((p) => p.is_active !== false).map(mapPartner);

        // Merge backend partners with initialChannelPartners so that all 100 pan-India territories are present.
        // Backend partners take precedence.
        const backendMap = new Map(backendPartners.map((p) => [p.id.toUpperCase(), p]));
        const activeDeleted = new Set(deletedPartnerIdsStore.map((id) => id.toUpperCase()));

        const merged: ChannelPartner[] = initialChannelPartners
          .filter((init) => !activeDeleted.has(init.id.toUpperCase()))
          .map((init) => {
            const remote = backendMap.get(init.id.toUpperCase());
            return remote ? { ...init, ...remote } : init;
          });

        // Also append any new custom partners created on the backend that are not in initialChannelPartners
        for (const bp of backendPartners) {
          if (
            !activeDeleted.has(bp.id.toUpperCase()) &&
            !initialChannelPartners.some((init) => init.id.toUpperCase() === bp.id.toUpperCase())
          ) {
            merged.push(bp);
          }
        }

        channelPartnersStore = merged;
        saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, channelPartnersStore);
      } catch (err) {
        console.warn('[crmApi.getChannelPartners] Failed to fetch remote partners, using local store:', err);
        if (!channelPartnersStore || channelPartnersStore.length === 0) {
          channelPartnersStore = loadFromStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, [...initialChannelPartners]);
        }
      }
    }
    return [...channelPartnersStore];
  },

  // POST /api/v1/partners
  async addChannelPartner(partner: Omit<ChannelPartner, 'id'> & { id?: string }): Promise<ChannelPartner> {
    const partnerId = partner.id?.trim().toUpperCase() || nextPartnerCode();

    // If this partnerId was previously deleted, undelete it
    if (deletedPartnerIdsStore.includes(partnerId)) {
      deletedPartnerIdsStore = deletedPartnerIdsStore.filter((id) => id !== partnerId);
      saveToStorage(DELETED_PARTNERS_KEY, deletedPartnerIdsStore);
    }

    if (!USE_MOCK_API) {
      try {
        const created = mapPartner(
          await http.post<BackendPartner>(API_ENDPOINTS.PARTNERS, toPartnerPayload({ ...partner, id: partnerId }))
        );
        channelPartnersStore = [created, ...channelPartnersStore.filter((p) => p.id !== created.id)];
        saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, channelPartnersStore);
        return created;
      } catch (err) {
        console.warn('[crmApi.addChannelPartner] Backend POST failed, saving locally:', err);
      }
    }

    const newPartner: ChannelPartner = {
      ...partner,
      id: partnerId,
      name: partner.name || `${partnerId} (${partner.territory_name || 'Territory'})`,
      role: partner.role || 'Channel Partner',
      state: partner.state || 'Maharashtra',
      whatsapp_number: partner.whatsapp_number || '+91 98000 00000',
      territory_id: partner.territory_id?.trim().toUpperCase() || partnerId,
      territory_name: partner.territory_name?.trim() || partner.name,
      cities: partner.cities && partner.cities.length > 0 ? partner.cities.map((c) => c.trim()).filter(Boolean) : [],
      priority_tier: partner.priority_tier?.trim() || 'Tier 2 - Growth',
      demand_drivers: partner.demand_drivers?.trim() || '',
    };
    channelPartnersStore = [newPartner, ...channelPartnersStore.filter((p) => p.id !== newPartner.id)];
    saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, channelPartnersStore);
    return Promise.resolve(newPartner);
  },

  // DELETE /api/v1/partners/{uuid} (soft-delete: is_active = false)
  async deleteChannelPartner(id: string): Promise<boolean> {
    const partnerIdUpper = id.toUpperCase();
    if (!deletedPartnerIdsStore.includes(partnerIdUpper)) {
      deletedPartnerIdsStore.push(partnerIdUpper);
      saveToStorage(DELETED_PARTNERS_KEY, deletedPartnerIdsStore);
    }

    if (!USE_MOCK_API) {
      const backendId = channelPartnersStore.find((cp) => cp.id === id)?.backend_id;
      if (backendId) {
        try {
          await http.delete(API_ENDPOINTS.PARTNER_BY_ID(backendId));
        } catch (err) {
          console.warn('[crmApi.deleteChannelPartner] Backend DELETE failed:', err);
        }
      }
    }
    channelPartnersStore = channelPartnersStore.filter((cp) => cp.id !== id);
    saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, channelPartnersStore);
    return Promise.resolve(true);
  },

  // --- CHANNEL PARTNER LEADS (INBOUND FROM WHATSAPP ADS) ---
  async getChannelPartnerLeads(): Promise<ChannelPartnerLead[]> {
    return Promise.resolve([...channelPartnerLeadsStore]);
  },

  async approveChannelPartnerLead(leadId: string): Promise<{ partner: ChannelPartner; lead: ChannelPartnerLead }> {
    const leadIndex = channelPartnerLeadsStore.findIndex((l) => l.id === leadId);
    if (leadIndex === -1) throw new Error('Lead not found');

    const lead = channelPartnerLeadsStore[leadIndex];

    const partnerDetails = {
      name: lead.firm_name,
      role: `Channel Partner (${lead.city})`,
      contact_person: lead.contact_person,
      email: lead.email,
      state: lead.state,
      whatsapp_number: lead.whatsapp_number,
      territory_name: `${lead.city} Territory`,
      cities: [lead.city],
    };
    // Live mode registers the approved applicant as a real partner via POST /partners
    const newPartner: ChannelPartner = USE_MOCK_API
      ? { id: `cp-${Date.now()}`, ...partnerDetails }
      : await this.addChannelPartner(partnerDetails);
    if (USE_MOCK_API) channelPartnersStore.push(newPartner);
    lead.status = 'Approved';

    saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNER_LEADS, channelPartnerLeadsStore);
    saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, channelPartnersStore);

    return Promise.resolve({ partner: newPartner, lead });
  },

  async deleteChannelPartnerLead(leadId: string): Promise<boolean> {
    channelPartnerLeadsStore = channelPartnerLeadsStore.filter((l) => l.id !== leadId);
    saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNER_LEADS, channelPartnerLeadsStore);
    return Promise.resolve(true);
  },

  // =========================================================================
  // --- CERTIFIED APPLICATORS ---
  // =========================================================================
  async getApplicators(): Promise<Applicator[]> {
    return Promise.resolve([...applicatorsStore]);
  },

  async addApplicator(app: Omit<Applicator, 'id'>): Promise<Applicator> {
    const newApp: Applicator = {
      ...app,
      id: `app-${Date.now()}`,
    };
    applicatorsStore.push(newApp);
    saveToStorage(DB_STORAGE_KEYS.APPLICATORS, applicatorsStore);
    return Promise.resolve(newApp);
  },

  async deleteApplicator(id: string): Promise<boolean> {
    applicatorsStore = applicatorsStore.filter((app) => app.id !== id);
    saveToStorage(DB_STORAGE_KEYS.APPLICATORS, applicatorsStore);
    return Promise.resolve(true);
  },

  // --- APPLICATOR LEADS (INBOUND FROM WHATSAPP ADS) ---
  async getApplicatorLeads(): Promise<ApplicatorLead[]> {
    return Promise.resolve([...applicatorLeadsStore]);
  },

  async approveApplicatorLead(leadId: string): Promise<{ applicator: Applicator; lead: ApplicatorLead }> {
    const leadIndex = applicatorLeadsStore.findIndex((l) => l.id === leadId);
    if (leadIndex === -1) throw new Error('Applicator lead not found');

    const lead = applicatorLeadsStore[leadIndex];
    lead.status = 'Certified';

    const newApplicator: Applicator = {
      id: `app-${Date.now()}`,
      name: lead.firm_name,
      agency: `${lead.master_contractor} (${lead.city})`,
      specialization: lead.specialization,
      city: lead.city,
      state: lead.state,
      phone: lead.whatsapp_number,
      experienceYears: lead.experience_years || 5,
      rating: 4.8,
      verified: true,
    };
    applicatorsStore.push(newApplicator);

    saveToStorage(DB_STORAGE_KEYS.APPLICATOR_LEADS, applicatorLeadsStore);
    saveToStorage(DB_STORAGE_KEYS.APPLICATORS, applicatorsStore);

    return Promise.resolve({ applicator: newApplicator, lead });
  },

  async deleteApplicatorLead(leadId: string): Promise<boolean> {
    applicatorLeadsStore = applicatorLeadsStore.filter((l) => l.id !== leadId);
    saveToStorage(DB_STORAGE_KEYS.APPLICATOR_LEADS, applicatorLeadsStore);
    return Promise.resolve(true);
  }
};

