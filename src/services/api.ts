import type { Lead, Message, KpiData, Appointment, Followup, CRMSettings, PipelineStage } from '../types/crm';
import { initialLeads } from '../data/leads';
import { initialMessages } from '../data/messages';
import { initialKpis } from '../data/kpis';
import { initialAppointments } from '../data/appointments';
import { initialFollowups } from '../data/followups';
import { initialSettings } from '../data/settings';

// In-Memory store simulation
let leadsStore: Lead[] = [...initialLeads];
let messagesStore: Record<string, Message[]> = { ...initialMessages };
let kpisStore: KpiData = { ...initialKpis };
let appointmentsStore: Appointment[] = [...initialAppointments];
let followupsStore: Followup[] = [...initialFollowups];
let settingsStore: CRMSettings = { ...initialSettings };

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

  async assignLead(leadId: string, assignee: string): Promise<Lead> {
    const lead = leadsStore.find((l) => l.id === leadId);
    if (!lead) throw new Error('Lead not found');
    const updated = { ...lead, assigned_to: assignee, updated_at: new Date().toISOString() };
    leadsStore = leadsStore.map((l) => (l.id === leadId ? updated : l));
    return Promise.resolve(updated);
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

  // --- MESSAGES ---
  async getMessages(leadId: string): Promise<Message[]> {
    return new Promise((resolve) => {
      const msgs = messagesStore[leadId] || [];
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

      kpisStore = {
        ...kpisStore,
        total_leads: 142,
        new_leads_today: kpisStore.new_leads_today || 18,
        hot_leads: hotCount || 9,
        unanswered_over_20h: unansweredCount,
        site_visits_confirmed: visitsCount || 8,
        closed_leads: closedCount || 12,
        average_score: avgScore || 68
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

  // --- SETTINGS ---
  async getSettings(): Promise<CRMSettings> {
    return Promise.resolve({ ...settingsStore });
  },

  async updateSettings(updated: CRMSettings): Promise<CRMSettings> {
    settingsStore = { ...updated };
    return Promise.resolve({ ...settingsStore });
  }
};
