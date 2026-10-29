/**
 * Translates backend DTOs (snake_case, UPPER enums, 0-100 confidences) into the
 * frontend domain types the components were built against, and back again.
 */
import type { Lead, Appointment, ChannelPartner, FunnelCategory, PipelineStage, NextAction } from '../types/crm';
import { COLOURPLUS_PRODUCTS } from '../types/crm';
import type { AuthUser, UserRole } from '../types/auth';
import type {
  BackendLead,
  BackendLeadStage,
  BackendLeadBand,
  BackendSiteVisit,
  BackendSiteVisitStatus,
  BackendPartner,
  BackendPartnerTier,
  BackendUser,
  CreatePartnerPayload,
} from './endpoints';

// ----------------------------------------------------------------------------
// LEADS
// ----------------------------------------------------------------------------

const STAGE_FROM_BACKEND: Record<BackendLeadStage, PipelineStage> = {
  NEW: 'Lead',
  QUALIFIED: 'Qualified',
  ASSIGNED: 'Qualified',
  VISIT_SCHEDULED: 'Visit',
  WON: 'Won',
  LOST: 'Follow-up',
};

const NEXT_ACTION_BY_STAGE: Record<BackendLeadStage, NextAction> = {
  NEW: { title: 'Qualify Lead', description: 'Review the AI qualification and confirm project requirements.', type: 'call' },
  QUALIFIED: { title: 'Assign Channel Partner', description: 'Route this qualified lead to the matching territory partner.', type: 'manual' },
  ASSIGNED: { title: 'Schedule Site Visit', description: 'Book a technical site inspection with the customer.', type: 'visit' },
  VISIT_SCHEDULED: { title: 'Complete Site Inspection', description: 'Run the moisture test and verify the project area on site.', type: 'visit' },
  WON: { title: 'Project Won', description: 'Hand over to execution and track application progress.', type: 'review' },
  LOST: { title: 'Lead Closed (Lost)', description: 'Review the loss reason and schedule a nurture follow-up.', type: 'review' },
};

export function mapBand(band: BackendLeadBand | string | null | undefined): FunnelCategory {
  const upper = (band || '').toUpperCase();
  if (upper === 'HOT' || upper === 'WARM' || upper === 'NURTURE') return upper;
  return 'OUT_OF_SCOPE';
}

/** "Bengaluru, Karnataka" -> { city: "Bengaluru", state: "Karnataka" } */
function splitCityState(raw: string | null | undefined): { city: string; state: string } {
  if (!raw) return { city: '', state: '' };
  const idx = raw.lastIndexOf(',');
  if (idx === -1) return { city: raw.trim(), state: '' };
  return { city: raw.slice(0, idx).trim(), state: raw.slice(idx + 1).trim() };
}

const normalizeName = (s: string) => s.toLowerCase().replace(/[–—]/g, '-').replace(/\s+/g, ' ').trim();

/** "Epoxy Polyurethane (EPU)" -> "Epoxy Polyurethane (EPU) Coating", so the Product filter matches the catalog. */
export function toCatalogProduct(name: string | null | undefined): string | undefined {
  if (!name) return undefined;
  const n = normalizeName(name);
  return COLOURPLUS_PRODUCTS.find((p) => normalizeName(p) === n)
    || COLOURPLUS_PRODUCTS.find((p) => normalizeName(p).startsWith(n))
    || name;
}

function hoursSince(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Number.isFinite(ms) ? Math.max(0, Math.round(ms / 3_600_000)) : 0;
}

export function mapLead(b: BackendLead): Lead {
  const facts = b.facts || {};
  const rawCity = b.city || (typeof facts.city === 'string' ? facts.city : '');
  const { city, state } = splitCityState(rawCity);
  const addressText = b.address_text || (typeof facts.address_text === 'string' ? facts.address_text : rawCity);
  const areaSqft = b.area_sqft ?? (typeof facts.area_sqft === 'number' ? facts.area_sqft : undefined);

  const rawFields = b.extracted_technical_fields || facts.extracted_technical_fields || [];
  const quoteText = b.quote_text || (typeof facts.quote_text === 'string' ? facts.quote_text : undefined);

  const fields = rawFields.map((f) => {
    const rawConf = f.confidence;
    const normConf = typeof rawConf === 'number' ? (rawConf > 1 ? rawConf / 100 : rawConf) : undefined;
    return {
      key: f.key,
      value: f.value,
      confidence: normConf,
      source_message: quoteText,
      is_verified: typeof normConf === 'number' ? normConf >= 0.9 : true,
    };
  });

  const sb = b.score_breakdown;
  const rawConf = sb?.confidence ?? facts.confidence;
  const confidence = rawConf != null
    ? (Number(rawConf) > 1 ? Number(rawConf) / 100 : Number(rawConf))
    : fields.length && fields.some((f) => f.confidence != null)
    ? fields.reduce((sum, f) => sum + (f.confidence ?? 0.9), 0) / fields.length
    : 0.92;

  const lat = b.lat != null ? Number(b.lat) : (facts.lat != null ? Number(facts.lat) : null);
  const lng = b.lng != null ? Number(b.lng) : (facts.lng != null ? Number(facts.lng) : null);

  const matchedPartner = b.matched_partner || facts.matched_partner || undefined;
  const assignedPartner = b.assigned_partner || (typeof facts.assigned_partner === 'string' ? facts.assigned_partner : undefined);

  const mapsLink = matchedPartner?.google_maps_url
    || (lat != null && lng != null && !isNaN(lat) && !isNaN(lng)
      ? `https://maps.google.com/?q=${lat},${lng}`
      : `https://maps.google.com/?q=${encodeURIComponent(addressText || rawCity)}`);

  // A qualified lead that already has a partner is effectively at the ASSIGNED step
  const effectiveStage: BackendLeadStage = b.stage === 'QUALIFIED' && assignedPartner ? 'ASSIGNED' : b.stage;
  const nextAction = b.needs_human
    ? { title: 'Reply to Customer', description: 'Customer inquiry requires human dispatch attention.', type: 'call' as const }
    : NEXT_ACTION_BY_STAGE[effectiveStage as BackendLeadStage] || NEXT_ACTION_BY_STAGE.NEW;

  const scoreTotal = typeof b.score_total === 'number' ? b.score_total : (sb?.overall_score ?? 0);
  const reasons = sb?.reasons && sb.reasons.length > 0
    ? sb.reasons
    : (b.score_reasons && b.score_reasons.length > 0 ? b.score_reasons : []);
  const reason = sb?.summary_quote || (reasons.length > 0 ? reasons.join('. ') : 'Lead qualified via automated assessment.');

  const facilitySector = b.facility_sector || (typeof facts.facility_sector === 'string' ? facts.facility_sector : undefined);
  const facilitySpecifics = b.facility_specifics || (typeof facts.facility_specifics === 'string' ? facts.facility_specifics : undefined);
  const recommendedProduct = b.recommended_product || (typeof facts.recommended_product === 'string' ? facts.recommended_product : undefined) || b.product || undefined;
  const productSpecification = b.product_specification || (typeof facts.product_specification === 'string' ? facts.product_specification : 'ColourPlus OEM');

  return {
    id: b.id,
    ref_no: b.ref_no || b.id,
    campaign_id: b.campaign_id || undefined,
    whatsapp_number: b.contact_phone || (typeof facts.contact_phone === 'string' ? facts.contact_phone : ''),
    name: b.contact_name || (typeof facts.contact_name === 'string' ? facts.contact_name : 'Lead'),
    company: b.company_name || (typeof facts.company_name === 'string' ? facts.company_name : ''),
    campaign: b.campaign_name || (typeof facts.campaign_name === 'string' ? facts.campaign_name : 'Direct Inbound'),
    language: 'English',
    status: String(b.stage || 'NEW'),
    funnel: mapBand(b.band || sb?.band),
    score: scoreTotal,
    confidence,
    reason,
    score_breakdown: {
      fit: b.score_fit ?? sb?.fit_and_spec ?? 25,
      fit_max: sb?.fit_and_spec_max ?? 30,
      opportunity: b.score_opportunity ?? sb?.opportunity_scale ?? 20,
      opportunity_max: sb?.opportunity_scale_max ?? 25,
      intent: b.score_intent ?? sb?.commercial_intent ?? 18,
      intent_max: sb?.commercial_intent_max ?? 20,
      urgency: b.score_urgency ?? sb?.timeline_urgency ?? 12,
      urgency_max: sb?.timeline_urgency_max ?? 15,
      completeness: b.score_completeness ?? sb?.data_completeness ?? 8,
      completeness_max: sb?.data_completeness_max ?? 10,
      overall_score: scoreTotal,
      confidence: sb?.confidence != null ? (sb.confidence > 1 ? sb.confidence / 100 : sb.confidence) : confidence,
      band: b.band ?? sb?.band,
      reasons,
      summary_quote: sb?.summary_quote,
    },
    location: {
      address: addressText,
      maps_link: mapsLink,
      city,
      state,
      area_sqft: areaSqft,
    },
    fields,
    next_action: nextAction,
    stage: STAGE_FROM_BACKEND[b.stage as BackendLeadStage] || 'Lead',
    assigned_to: (assignedPartner || '').replace(/^Assigned:\s*/i, '').trim(),
    ai_active: b.bot_status === 'BOT_ACTIVE',
    unreplied_hours: b.needs_human ? Math.max(20, hoursSince(b.updated_at)) : 0,
    created_at: b.created_at,
    updated_at: b.updated_at,
    flooring_category: facilitySector,
    flooring_area: facilitySector
      ? {
          category: facilitySector,
          sub_type: facilitySpecifics,
          source_message: quoteText || '',
          confidence,
        }
      : undefined,
    product: toCatalogProduct(recommendedProduct) || recommendedProduct,
    recommended_product: recommendedProduct,
    product_specification: productSpecification,
    facility_sector: facilitySector,
    facility_specifics: facilitySpecifics,
    quote_text: quoteText,
    matched_partner: matchedPartner,
    assigned_partner: assignedPartner,
    timeline_days: b.timeline_days ?? (typeof facts.timeline_days === 'number' ? facts.timeline_days : undefined),
    needs_human: Boolean(b.needs_human),
    bot_status: b.bot_status,
    score_reasons: b.score_reasons || undefined,
    facts: b.facts,
  };
}

// ----------------------------------------------------------------------------
// SITE VISITS <-> APPOINTMENTS
// ----------------------------------------------------------------------------

const VISIT_STATUS_FROM_BACKEND: Record<BackendSiteVisitStatus, Appointment['status']> = {
  SCHEDULED: 'scheduled',
  RESCHEDULED: 'scheduled',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
};

export function mapSiteVisit(v: BackendSiteVisit, leadLookup?: (id: string) => Lead | undefined): Appointment {
  const lead = leadLookup?.(v.lead_id);
  return {
    id: v.id,
    lead_id: v.lead_id,
    lead_name: v.contact_name || lead?.name || 'Lead',
    company: v.company_name || lead?.company || '',
    date: v.visit_date,
    time: v.time_slot,
    location: v.site_address,
    engineer: v.field_engineer_assigned,
    status: VISIT_STATUS_FROM_BACKEND[v.status] || 'scheduled',
    inspection_objectives: v.inspection_objectives,
    notes: v.notes || undefined,
  };
}

// ----------------------------------------------------------------------------
// CHANNEL PARTNERS
// ----------------------------------------------------------------------------

const TIER_LABELS: Record<BackendPartnerTier, string> = {
  TIER_1: 'Tier 1 - Core',
  TIER_2: 'Tier 2 - Growth',
  TIER_3: 'Tier 3 - Emerging',
};

export function mapPartner(p: BackendPartner): ChannelPartner {
  return {
    id: p.partner_code,
    backend_id: p.id,
    name: p.firm_name,
    role: p.role_designation || 'Channel Partner',
    contact_person: p.contact_person || undefined,
    email: p.email || undefined,
    state: p.state,
    whatsapp_number: p.phone_e164,
    territory_id: p.partner_code,
    territory_name: p.territory_name || p.firm_name,
    cities: p.covered_cities || [],
    priority_tier: p.priority_tier ? TIER_LABELS[p.priority_tier] : undefined,
    demand_drivers: p.focus_industries || undefined,
    assigned_lead_count: p.assigned_leads_count,
  };
}

function toTier(label: string | undefined): BackendPartnerTier {
  const n = label?.match(/tier\s*_?(\d)/i)?.[1];
  return n === '1' ? 'TIER_1' : n === '3' ? 'TIER_3' : 'TIER_2';
}

/** "+91 98450 00026" / "9845000026" -> "+919845000026" */
export function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, '');
  if (phone.trim().startsWith('+')) return `+${digits}`;
  return digits.length === 10 ? `+91${digits}` : `+${digits}`;
}

export function toPartnerPayload(partner: Omit<ChannelPartner, 'id'> & { id: string }): CreatePartnerPayload {
  return {
    partner_code: partner.id,
    firm_name: partner.name,
    contact_person: partner.contact_person,
    role_designation: partner.role || 'Channel Partner',
    state: partner.state,
    territory_name: partner.territory_name || partner.name,
    priority_tier: toTier(partner.priority_tier),
    covered_cities: partner.cities || [],
    phone_e164: toE164(partner.whatsapp_number),
    email: partner.email || '',
    focus_industries: partner.demand_drivers,
    is_active: true,
  };
}

// ----------------------------------------------------------------------------
// AUTH
// ----------------------------------------------------------------------------

const ROLE_FROM_BACKEND: Record<string, { role: UserRole; title: string; clearance: AuthUser['securityClearance'] }> = {
  ADMIN: { role: 'admin', title: 'Administrator', clearance: 'Level 3 - Root Command' },
  MANAGER: { role: 'dispatcher', title: 'Territory Manager', clearance: 'Level 2' },
  SALES: { role: 'dispatcher', title: 'Sales Executive', clearance: 'Level 2' },
  VIEWER: { role: 'dispatcher', title: 'Viewer (Read-only)', clearance: 'Level 1' },
};

export function mapAuthUser(u: BackendUser): AuthUser {
  const r = ROLE_FROM_BACKEND[u.role] || ROLE_FROM_BACKEND.VIEWER;
  const initials = u.name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('') || u.email.slice(0, 2).toUpperCase();

  return {
    id: u.id,
    name: u.name,
    email: u.email,
    employeeId: u.id.slice(0, 8).toUpperCase(),
    role: r.role,
    roleTitle: r.title,
    department: 'ColourPlus Lead Desk',
    territory: 'National Network',
    initials,
    lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    securityClearance: r.clearance,
  };
}
