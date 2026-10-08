import { Lead } from '../types/crm';

export const initialLeads: Lead[] = [
  {
    id: 'lead-001',
    whatsapp_number: '+91 98450 12890',
    name: 'Ramesh Kumar',
    company: 'SK Industrial Solutions Pvt. Ltd.',
    campaign: 'Google Search - Industrial Flooring Bangalore',
    language: 'Kannada/English',
    status: 'Qualified',
    funnel: 'HOT',
    score: 92,
    confidence: 0.96,
    reason: 'High immediate intent, 15,000 sq ft factory floor requirement, specific location (Hosur Industrial Hub), budget pre-approved.',
    score_breakdown: {
      fit: 29,         // out of 30
      opportunity: 24, // out of 25
      intent: 19,      // out of 20
      urgency: 12,     // out of 15
      completeness: 8, // out of 10
    },
    location: {
      address: 'Plot 42, Phase II, Hosur Industrial Complex, Hosur, Tamil Nadu / KA border',
      maps_link: 'https://maps.google.com/?q=12.7409,77.8253',
      city: 'Hosur (Bengaluru Outer)',
      state: 'Tamil Nadu / KA',
      area_sqft: 15000
    },
    fields: [
      { key: 'Project Area', value: '15,000 sq ft', confidence: 0.98, source_message: 'Namaskara, namg 15,000 sq ft epoxy coating bekagide', timestamp: '10:14 AM' },
      { key: 'Floor Condition', value: 'New Concrete Slab (M30 grade)', confidence: 0.91, source_message: 'Fresh concrete slab laid last month', timestamp: '10:17 AM' },
      { key: 'Industry Type', value: 'Heavy Machine Manufacturing', confidence: 0.95, source_message: 'Factory floor for CNC machinery', timestamp: '10:18 AM' },
      { key: 'Required Coating', value: 'Heavy Duty PU Concrete / Epoxy Topcoat', confidence: 0.88, source_message: 'High abrasion resistance needed for forklift traffic', timestamp: '10:20 AM' },
      { key: 'Estimated Budget', value: '₹ 12,000,000 - ₹ 15,000,000', confidence: 0.74, source_message: 'Management approved around 14 Lakhs total', timestamp: '10:22 AM' }, // Amber warning < 0.8
      { key: 'Target Timeline', value: 'Within 10 Days', confidence: 0.93, source_message: 'Need to finish before new machinery installation', timestamp: '10:24 AM' }
    ],
    next_action: {
      title: 'Confirm Technical Site Inspection',
      description: 'Senior application engineer needs to measure moisture content (%) and substrate surface hardness.',
      due_date: 'Today, 4:00 PM',
      type: 'visit'
    },
    stage: 'Visit',
    assigned_to: 'Vikram Mehta (Senior Sales Manager)',
    ai_active: true,
    unreplied_hours: 22, // Triggers amber unanswered warning!
    created_at: '2026-10-06T09:30:00Z',
    updated_at: '2026-10-07T10:25:00Z'
  },
  {
    id: 'lead-002',
    whatsapp_number: '+91 99002 44110',
    name: 'Dr. Priya Sharma',
    company: 'Apex Pharma Labs Ltd.',
    campaign: 'LinkedIn - Pharma Cleanroom Flooring',
    language: 'English',
    status: 'Qualified',
    funnel: 'HOT',
    score: 88,
    confidence: 0.94,
    reason: 'Urgent WHO-GMP compliance audit next week. Requires seamless antibacterial PU screed for 6,500 sq ft sterile zone.',
    score_breakdown: {
      fit: 30,
      opportunity: 21,
      intent: 18,
      urgency: 14,
      completeness: 5
    },
    location: {
      address: 'Plot 18A, 3rd Phase, Peenya Industrial Area, Bengaluru',
      maps_link: 'https://maps.google.com/?q=13.0310,77.5190',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 6500
    },
    fields: [
      { key: 'Project Area', value: '6,500 sq ft Cleanroom', confidence: 0.99, source_message: 'Cleanroom area 6500 sqft', timestamp: '09:05 AM' },
      { key: 'System Spec', value: 'ColourPlus Polyurethane Antistatic Screed (3mm)', confidence: 0.94, source_message: 'WHO-GMP grade seamless antibacterial screed', timestamp: '09:08 AM' },
      { key: 'Regulatory Requirement', value: 'WHO-GMP & USFDA Compliance', confidence: 0.96, source_message: 'Auditscheduled next Wednesday', timestamp: '09:10 AM' },
      { key: 'Chemical Exposure', value: 'Frequent Alcohol & Acid Washdowns', confidence: 0.78, source_message: 'Cleaned daily with isopropyl alcohol', timestamp: '09:12 AM' } // Amber warning < 0.8
    ],
    next_action: {
      title: 'Dispatch Technical Data Sheet & Quotation',
      description: 'Send ColourPlus PU Cleanroom TDS and formal commercial quote.',
      due_date: 'Today, 2:00 PM',
      type: 'quote'
    },
    stage: 'Quote',
    assigned_to: 'Ananya Roy (Key Accounts)',
    ai_active: true,
    unreplied_hours: 4,
    created_at: '2026-10-07T08:00:00Z',
    updated_at: '2026-10-07T09:15:00Z'
  },
  {
    id: 'lead-003',
    whatsapp_number: '+91 97311 88204',
    name: 'Anand Vardhan',
    company: 'Anand Realty & Infra',
    campaign: 'Meta Ads - Commercial Roof Waterproofing',
    language: 'English',
    status: 'New',
    funnel: 'WARM',
    score: 68,
    confidence: 0.89,
    reason: '8,000 sq ft commercial terrace waterproofing. Moderate urgency, site visit requested in 2 weeks.',
    score_breakdown: {
      fit: 22,
      opportunity: 20,
      intent: 14,
      urgency: 7,
      completeness: 5
    },
    location: {
      address: 'IT Tech Park Tower B, Outer Ring Road, Whitefield, Bengaluru',
      maps_link: 'https://maps.google.com/?q=12.9698,77.7499',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 8000
    },
    fields: [
      { key: 'Project Area', value: '8,000 sq ft Roof Terrace', confidence: 0.92, source_message: 'Terrace size around 8000 sq ft', timestamp: 'Yesterday' },
      { key: 'Problem Type', value: 'Active Seepage in 4th floor ceiling', confidence: 0.90, source_message: 'Rainwater seepage coming down', timestamp: 'Yesterday' },
      { key: 'Preferred Solution', value: 'Polyurea / Elastomeric PU Liquid Membrane', confidence: 0.71, source_message: 'Looking for 10-year warranty membrane', timestamp: 'Yesterday' } // Amber warning < 0.8
    ],
    next_action: {
      title: 'Schedule Pre-Visit Discovery Call',
      description: 'Call client to verify structural slab type before site visit.',
      due_date: 'Tomorrow, 11:00 AM',
      type: 'call'
    },
    stage: 'Qualified',
    assigned_to: 'Suresh Patil (Field Executive)',
    ai_active: true,
    unreplied_hours: 14,
    created_at: '2026-10-06T14:20:00Z',
    updated_at: '2026-10-06T16:00:00Z'
  },
  {
    id: 'lead-004',
    whatsapp_number: '+91 94481 05678',
    name: 'Sunita Reddy',
    company: 'Deccan Warehousing Corp',
    campaign: 'Direct Inbound - Website',
    language: 'English',
    status: 'In Progress',
    funnel: 'NURTURE',
    score: 42,
    confidence: 0.82,
    reason: 'Inquiring about dust-proofing 40,000 sq ft logistics hub. Budget allocation pending board approval in Q4.',
    score_breakdown: {
      fit: 18,
      opportunity: 15,
      intent: 5,
      urgency: 2,
      completeness: 2
    },
    location: {
      address: 'Deccan Logistics Hub, Phase 2, Electronic City, Bengaluru',
      maps_link: 'https://maps.google.com/?q=12.8399,77.6770',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 40000
    },
    fields: [
      { key: 'Project Area', value: '40,000 sq ft Warehouse', confidence: 0.95, source_message: 'Logistics park warehouse 40k sqft', timestamp: '2 days ago' },
      { key: 'Requirement', value: 'Lithium Silicate Hardener / Dust-proofing', confidence: 0.85, source_message: 'Need low cost dust sealing', timestamp: '2 days ago' },
      { key: 'Timeline', value: 'Q4 2026 (November/December)', confidence: 0.65, source_message: 'Management looking at next quarter budget', timestamp: '2 days ago' } // Amber warning < 0.8
    ],
    next_action: {
      title: 'Send Educational Case Study',
      description: 'Email case study on warehouse floor hardener vs PU sealers.',
      due_date: 'Oct 12, 2026',
      type: 'review'
    },
    stage: 'Lead',
    assigned_to: 'Unassigned (AI Managed)',
    ai_active: true,
    unreplied_hours: 2,
    created_at: '2026-10-05T11:10:00Z',
    updated_at: '2026-10-05T11:15:00Z'
  },
  {
    id: 'lead-005',
    whatsapp_number: '+91 98860 33991',
    name: 'Suresh Gowda',
    company: 'Self / Residential',
    campaign: 'WhatsApp Direct',
    language: 'Kannada/English',
    status: 'Disqualified',
    funnel: 'OUT_OF_SCOPE',
    score: 12,
    confidence: 0.99,
    reason: 'Irrelevant inquiry. Asked for home interior wall emulsion paint and asked about RCB IPL cricket match tickets ("namma RCB match yavaga ide?"). Out of industrial B2B scope.',
    score_breakdown: {
      fit: 2,
      opportunity: 4,
      intent: 3,
      urgency: 1,
      completeness: 2
    },
    location: {
      address: 'Gokulam 3rd Stage, Mysuru',
      maps_link: 'https://maps.google.com/?q=12.3168,76.6433',
      city: 'Mysuru',
      state: 'Karnataka',
      area_sqft: 800
    },
    fields: [
      { key: 'Inquiry Type', value: 'Residential Wall Paint / Tickets', confidence: 0.99, source_message: 'Wall paint ideya & RCB match ticket ideya?', timestamp: 'Oct 04' },
      { key: 'B2B Industrial Fit', value: 'NO (Consumer / Retail)', confidence: 0.99, source_message: 'House bedroom paint', timestamp: 'Oct 04' }
    ],
    next_action: {
      title: 'No Action Required',
      description: 'Lead flagged as Out of Scope by AI Qualification engine.',
      due_date: 'N/A',
      type: 'manual'
    },
    stage: 'Lead',
    assigned_to: 'AI Automated Disqualification',
    ai_active: true,
    unreplied_hours: 0,
    created_at: '2026-10-04T16:45:00Z',
    updated_at: '2026-10-04T16:46:00Z'
  },
  {
    id: 'lead-006',
    whatsapp_number: '+91 94470 77123',
    name: 'Rajesh Nair',
    company: 'Kerala Marine Processing Ltd.',
    campaign: 'Google Ads - Chemical Resistant PU',
    language: 'English',
    status: 'Qualified',
    funnel: 'WARM',
    score: 62,
    confidence: 0.91,
    reason: 'Seafood cold storage plant flooring (-25°C thermal shock resist). 5,500 sq ft. Needs heavy chemical & salt water resistance.',
    score_breakdown: {
      fit: 24,
      opportunity: 18,
      intent: 12,
      urgency: 5,
      completeness: 3
    },
    location: {
      address: 'Baikampady Industrial Area, Mangaluru / Kochi Port Road',
      maps_link: 'https://maps.google.com/?q=12.9363,74.8156',
      city: 'Mangaluru / Kochi',
      state: 'Karnataka / Kerala',
      area_sqft: 5500
    },
    fields: [
      { key: 'Project Area', value: '5,500 sq ft Cold Storage', confidence: 0.96, source_message: 'Cold storage processing hall 5500 sqft', timestamp: 'Oct 03' },
      { key: 'Operating Temp', value: '-25°C to +15°C', confidence: 0.94, source_message: 'Sub zero temperature deep freeze unit', timestamp: 'Oct 03' },
      { key: 'Substrate Spec', value: 'Thermal Shock Heavy PU Screed 6mm', confidence: 0.76, source_message: 'Needs heavy polyurethane screed for freeze cycles', timestamp: 'Oct 03' } // Amber warning < 0.8
    ],
    next_action: {
      title: 'Send Polyurethane Screed Tech Specs',
      description: 'Share ColourPlus Polycrete HD 6mm TDS & chemical resistance table.',
      due_date: 'Oct 08, 2026',
      type: 'quote'
    },
    stage: 'Qualified',
    assigned_to: 'Vikram Mehta (Senior Sales Manager)',
    ai_active: true,
    unreplied_hours: 6,
    created_at: '2026-10-03T10:15:00Z',
    updated_at: '2026-10-04T12:00:00Z'
  }
];
