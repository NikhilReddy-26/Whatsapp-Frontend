import type { Lead, Message, KpiData, Appointment, Followup, CRMSettings, PipelineStage, ChannelPartner, ChannelPartnerLead, Applicator, ApplicatorLead, FlooringAreaCategory } from '../types/crm';
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
  try {
    if (typeof window !== 'undefined' && window.localStorage) {
      window.localStorage.setItem(key, JSON.stringify(value));
    }
  } catch (err) {
    console.warn(`[ColourPlus DB Layer] Failed to write ${key} to storage:`, err);
  }
}

// In-Memory store simulation backed by persistent local database
let leadsStore: Lead[] = loadFromStorage(DB_STORAGE_KEYS.LEADS, [...initialLeads]);
// Ensure we always have full updated leads loaded
if (!leadsStore || leadsStore.length < initialLeads.length) {
  leadsStore = [...initialLeads];
  saveToStorage(DB_STORAGE_KEYS.LEADS, leadsStore);
}

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

let messagesStore: Record<string, Message[]> = { ...initialMessages };
let kpisStore: KpiData = { ...initialKpis };
let appointmentsStore: Appointment[] = [...initialAppointments];
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

let channelPartnersStore: ChannelPartner[] = loadFromStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, [...initialChannelPartners]);
// Ensure all 100 territories/channel partners are always loaded
if (!channelPartnersStore || channelPartnersStore.length < initialChannelPartners.length) {
  channelPartnersStore = [...initialChannelPartners];
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
  async getLeads(): Promise<Lead[]> {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...leadsStore]), 100);
    });
  },

  async getLeadById(id: string): Promise<Lead | null> {
    return new Promise((resolve) => {
      const found = leadsStore.find((l) => l.id === id) || null;
      setTimeout(() => resolve(found ? { ...found } : null), 50);
    });
  },

  async updateLead(updated: Lead): Promise<Lead> {
    return new Promise((resolve) => {
      leadsStore = leadsStore.map((l) => (l.id === updated.id ? { ...updated, updated_at: new Date().toISOString() } : l));
      resolve({ ...updated });
    });
  },

  async assignLead(leadId: string, assignee: string, options?: AssignLeadOptions): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');

    // Find channel partner by name if not passed
    const partner = options?.partner || channelPartnersStore.find((cp) => cp.name === assignee) || null;
    const updated = { ...lead, assigned_to: assignee, updated_at: new Date().toISOString() };
    leadsStore = leadsStore.map((l) => (l.id === leadId ? updated : l));

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

  async assignMultipleLeads(leadIds: string[], assignee: string, options?: AssignLeadOptions): Promise<Lead[]> {
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

  async toggleAiStatus(leadId: string, aiActive: boolean): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    const updated = { ...lead, ai_active: aiActive, updated_at: new Date().toISOString() };
    leadsStore = leadsStore.map((l) => (l.id === leadId ? updated : l));
    
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

  async updateLeadStage(leadId: string, stage: PipelineStage): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    const updated = { ...lead, stage, updated_at: new Date().toISOString() };
    leadsStore = leadsStore.map((l) => (l.id === leadId ? updated : l));
    return Promise.resolve(updated);
  },

  async addExtractedField(leadId: string, field: { key: string; value: string; confidence: number; source_message?: string }): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    const updatedFields = [...lead.fields, { ...field, timestamp: 'Just now', is_verified: true }];
    const updated = { ...lead, fields: updatedFields, updated_at: new Date().toISOString() };
    leadsStore = leadsStore.map((l) => (l.id === leadId ? updated : l));
    return Promise.resolve(updated);
  },

  async updateLeadFlooringCategory(leadId: string, category: FlooringAreaCategory, subType?: string): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    lead.flooring_category = category;
    lead.flooring_area = {
      category,
      sub_type: subType || lead.flooring_area?.sub_type,
      source_message: lead.flooring_area?.source_message || 'Manually assigned by manager',
      confidence: 1.0,
      extracted_at: 'Just now'
    };
    lead.updated_at = new Date().toISOString();
    return Promise.resolve({ ...lead });
  },

  // --- MESSAGES ---
  async getMessages(leadId: string): Promise<Message[]> {
    return new Promise((resolve) => {
      let msgs = messagesStore[leadId];
      if (!msgs || msgs.length === 0) {
        const lead = leadsStore.find((l) => l.id === leadId);
        if (lead) {
          const suggestion = findSuggestedChannelPartner(lead, channelPartnersStore);
          const territoryId = suggestion.territory ? suggestion.territory.territoryId : 'CP-001';
          const territoryName = suggestion.territory ? suggestion.territory.territoryName : 'Metro';
          msgs = [
            {
              id: `m-${leadId}-1`,
              lead_id: leadId,
              sender: 'customer',
              text: `Hello, we need ${lead.product || 'Epoxy Flooring'} specification for our ${lead.flooring_category || 'industrial'} facility in ${lead.location.city}, ${lead.location.state}. Project area is approx ${lead.location.area_sqft ? lead.location.area_sqft.toLocaleString() + ' sq ft' : '15,000 sq ft'}.`,
              type: 'text',
              timestamp: '10:05 AM',
            },
            {
              id: `m-${leadId}-2`,
              lead_id: leadId,
              sender: 'ai',
              text: `Thank you for contacting ColourPlus! For your ${lead.flooring_category || 'facility'} in ${lead.location.city}, our ${lead.product || 'High-Build Epoxy'} specification offers superior chemical & mechanical wear resistance. Could you share the facility address or drop a location pin?`,
              type: 'text',
              timestamp: '10:06 AM',
            },
            {
              id: `m-${leadId}-3`,
              lead_id: leadId,
              sender: 'customer',
              text: `📍 Dropped Pin: ${lead.location.address || lead.location.city}. Project Area: ${lead.location.area_sqft ? lead.location.area_sqft.toLocaleString() + ' sq ft' : '15,000 sq ft'}.`,
              type: 'location',
              location_data: {
                name: `${lead.company} Site`,
                address: lead.location.address,
                maps_url: lead.location.maps_link,
              },
              timestamp: '10:08 AM',
            },
            {
              id: `m-${leadId}-4`,
              lead_id: leadId,
              sender: 'system',
              text: 'SILENTLY EXTRACTED INTELLIGENCE',
              type: 'system_note',
              timestamp: '10:08 AM',
              extracted_chips: [
                { label: 'Facility Sector', value: lead.flooring_category || 'Industrial' },
                { label: 'City & State', value: `${lead.location.city}, ${lead.location.state}` },
                { label: 'Matched Territory', value: `${territoryId} (${territoryName})` },
                { label: 'AI Score', value: `${lead.score}/100 (${lead.funnel})` },
              ],
            },
            {
              id: `m-${leadId}-5`,
              lead_id: leadId,
              sender: 'ai',
              text: `Thank you! Your location in ${lead.location.city} is covered by our regional Channel Partner (${territoryId} - ${territoryName}). Our technical engineer can conduct an on-site moisture and substrate hardness test.`,
              type: 'text',
              timestamp: '10:10 AM',
            },
            {
              id: `m-${leadId}-6`,
              lead_id: leadId,
              sender: 'customer',
              text: `Yes, please confirm the technical site visit at earliest convenience.`,
              type: 'text',
              timestamp: '10:12 AM',
            },
          ];
          messagesStore[leadId] = msgs;
        } else {
          msgs = [];
        }
      }
      setTimeout(() => resolve([...msgs]), 50);
    });
  },

  async sendMessage(leadId: string, text: string, sender: 'customer' | 'human' | 'ai' | 'system' = 'human'): Promise<Message> {
    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      lead_id: leadId,
      sender,
      text,
      type: 'text',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

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
    return new Promise((resolve) => {
      const unansweredCount = leadsStore.filter((l) => (l.unreplied_hours || 0) >= settingsStore.unreplied_warning_threshold_hours).length;
      const hotCount = leadsStore.filter((l) => l.funnel === 'HOT').length;
      const visitsCount = appointmentsStore.filter((a) => a.status === 'scheduled').length;
      const closedCount = leadsStore.filter((l) => l.stage === 'Won').length + 12;
      const avgScore = Math.round((leadsStore.reduce((acc, l) => acc + l.score, 0) / leadsStore.length) * 10) / 10;
      const assignedCount = leadsStore.filter((l) =>
        Boolean(
          l.assigned_to &&
          l.assigned_to.trim() !== '' &&
          !l.assigned_to.toLowerCase().includes('unassigned') &&
          !l.assigned_to.toLowerCase().includes('disqualification')
        )
      ).length;

      kpisStore = {
        ...kpisStore,
        total_leads: 142,
        new_leads_today: kpisStore.new_leads_today || 18,
        hot_leads: hotCount || 9,
        unanswered_over_20h: unansweredCount,
        site_visits_confirmed: visitsCount || 8,
        closed_leads: closedCount || 12,
        average_score: avgScore || 68,
        assigned_leads: 86 + (assignedCount > 14 ? (assignedCount - 14) : 0),
      };
      resolve({ ...kpisStore });
    });
  },

  // --- APPOINTMENTS ---
  async getAppointments(): Promise<Appointment[]> {
    return Promise.resolve([...appointmentsStore]);
  },

  async createAppointment(app: Omit<Appointment, 'id'>): Promise<Appointment> {
    const newApp: Appointment = {
      ...app,
      id: `app-${Date.now()}`
    };
    appointmentsStore.push(newApp);

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
  async getChannelPartners(): Promise<ChannelPartner[]> {
    return Promise.resolve([...channelPartnersStore]);
  },

  async addChannelPartner(partner: Omit<ChannelPartner, 'id'> & { id?: string }): Promise<ChannelPartner> {
    let partnerId = partner.id?.trim().toUpperCase();
    if (!partnerId) {
      const highestNum = channelPartnersStore.reduce((max, cp) => {
        const m = cp.id.match(/CP-(\d+)/i);
        return m ? Math.max(max, parseInt(m[1], 10)) : max;
      }, 0);
      partnerId = `CP-${String(highestNum + 1).padStart(3, '0')}`;
    }

    const newPartner: ChannelPartner = {
      ...partner,
      id: partnerId,
      territory_id: partner.territory_id?.trim().toUpperCase() || partnerId,
      territory_name: partner.territory_name?.trim() || partner.name,
      cities: partner.cities && partner.cities.length > 0 ? partner.cities.map((c) => c.trim()).filter(Boolean) : [],
      priority_tier: partner.priority_tier?.trim() || 'Tier 2 - Growth',
      demand_drivers: partner.demand_drivers?.trim() || '',
    };
    channelPartnersStore.push(newPartner);
    saveToStorage(DB_STORAGE_KEYS.CHANNEL_PARTNERS, channelPartnersStore);
    return Promise.resolve(newPartner);
  },

  async deleteChannelPartner(id: string): Promise<boolean> {
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
    lead.status = 'Approved';

    const newPartner: ChannelPartner = {
      id: `cp-${Date.now()}`,
      name: lead.firm_name,
      role: `Channel Partner (${lead.city})`,
      email: lead.email,
      state: lead.state,
      whatsapp_number: lead.whatsapp_number,
    };
    channelPartnersStore.push(newPartner);

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

