import { Lead } from '../types/crm';

export const initialLeads: Lead[] = [
  {
    id: "lead-mh-001",
    whatsapp_number: "+91 98201 55432",
    name: "Rajesh Singhania",
    company: "Apex Logistics & Warehousing Hub",
    campaign: "Google Search - Industrial Flooring Mumbai",
    language: "Hindi/English",
    status: "Qualified",
    funnel: "HOT",
    score: 94,
    confidence: 0.98,
    product: "High-Build Epoxy Mortar",
    reason: "Urgent 28,000 sq ft logistics park warehousing floor in Bhiwandi corridor. Heavy reach-truck traffic, pre-approved budget \u20b925L.",
    score_breakdown: {"fit": 29, "opportunity": 25, "intent": 19, "urgency": 13, "completeness": 8},
    location: {
      address: "Gala 14, Mankoli Naka, Bhiwandi Warehousing Zone, Thane District",
      maps_link: "https://maps.google.com/?q=19.2967,73.0631",
      city: "Bhiwandi",
      state: "Maharashtra",
      area_sqft: 28000
    },
    flooring_category: "Warehouse & Logistics",
    flooring_area: {
      category: "Warehouse & Logistics",
      sub_type: "High-Bay Heavy Pallet Storage Floor",
      source_message: "Require 28,000 sq ft epoxy mortar for heavy forklift and reach-truck traffic in Bhiwandi warehouse",
      confidence: 0.98,
      extracted_at: "10:30 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "High-Build Epoxy Mortar",
            "confidence": 0.98,
            "source_message": "Heavy-duty 4mm epoxy screed for reach trucks"
      },
      {
            "key": "Location City",
            "value": "Bhiwandi (Mumbai Metro)",
            "confidence": 0.99,
            "source_message": "Mankoli Naka Bhiwandi"
      },
      {
            "key": "Project Area",
            "value": "28,000 sq ft",
            "confidence": 0.97,
            "source_message": "28,000 sq ft warehouse floor"
      },
      {
            "key": "Matched Territory",
            "value": "CP-001 (Mumbai Metro)",
            "confidence": 0.99,
            "source_message": "Territory routing to Bhiwandi partner"
      }
],
    next_action: {
      title: "Site Moisture Inspection",
      description: "Senior applicator engineer site moisture measurement.",
      due_date: "Today, 3:30 PM",
      type: "visit"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 3,
    created_at: "2026-10-22T08:15:00Z",
    updated_at: "2026-10-22T09:30:00Z"
  },
  {
    id: "lead-mh-002",
    whatsapp_number: "+91 98902 44321",
    name: "Sunil Deshmukh",
    company: "Precision Auto-Components Ltd.",
    campaign: "Meta Ads - Factory Floor Epoxy Pune",
    language: "Marathi/English",
    status: "Qualified",
    funnel: "HOT",
    score: 91,
    confidence: 0.95,
    product: "Epoxy Polyurethane (EPU) Coating",
    reason: "18,500 sq ft automotive machining shop in Chakan MIDC Phase 2. Oil spillage resistance required, installation target within 12 days.",
    score_breakdown: {"fit": 28, "opportunity": 23, "intent": 18, "urgency": 14, "completeness": 8},
    location: {
      address: "Plot B-24, Chakan MIDC Phase 2, Pune Industrial Belt",
      maps_link: "https://maps.google.com/?q=18.7606,73.8643",
      city: "Chakan",
      state: "Maharashtra",
      area_sqft: 18500
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "CNC Automotive Component Machine Shop",
      source_message: "Automotive plant floor in Chakan Pune needing chemical & oil resistant EPU coating",
      confidence: 0.96,
      extracted_at: "09:45 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Epoxy Polyurethane (EPU) Coating",
            "confidence": 0.96,
            "source_message": "High chemical & oil resistance"
      },
      {
            "key": "Location City",
            "value": "Chakan (Pune Industrial Belt)",
            "confidence": 0.99,
            "source_message": "Chakan MIDC Phase 2"
      },
      {
            "key": "Project Area",
            "value": "18,500 sq ft",
            "confidence": 0.96,
            "source_message": "18,500 sqft plant area"
      },
      {
            "key": "Matched Territory",
            "value": "CP-002 (Pune Industrial Belt)",
            "confidence": 0.99,
            "source_message": "Chakan covered under CP-002"
      }
],
    next_action: {
      title: "Dispatch Technical Specification & Quote",
      description: "Send ColourPlus EPU TDS and quotation to plant head.",
      due_date: "Today, 2:00 PM",
      type: "quote"
    },
    stage: "Visit",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 1,
    created_at: "2026-10-22T07:30:00Z",
    updated_at: "2026-10-22T08:50:00Z"
  },
  {
    id: "lead-mh-003",
    whatsapp_number: "+91 97633 88120",
    name: "Girish Kulkarni",
    company: "Sahyadri Agro-Processing & Cold Store",
    campaign: "Direct Inbound - Cold Storage Flooring Nashik",
    language: "Marathi/Hindi",
    status: "Qualified",
    funnel: "WARM",
    score: 78,
    confidence: 0.91,
    product: "Polyurethane Coating",
    reason: "12,000 sq ft temperature controlled cold room (-20 deg C) in Sinnar MIDC near Nashik. Requires thermal shock resistant PU screed.",
    score_breakdown: {"fit": 26, "opportunity": 20, "intent": 16, "urgency": 10, "completeness": 6},
    location: {
      address: "MIDC Malegaon-Sinnar Industrial Estate, Sinnar, Nashik District",
      maps_link: "https://maps.google.com/?q=19.8458,73.9926",
      city: "Nashik",
      state: "Maharashtra",
      area_sqft: 12000
    },
    flooring_category: "Cold Storage & Food",
    flooring_area: {
      category: "Cold Storage & Food",
      sub_type: "Sub-Zero Controlled Cold Room",
      source_message: "Sub-zero cold storage food processing unit near Nashik Sinnar",
      confidence: 0.92,
      extracted_at: "11:10 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Polyurethane Coating",
            "confidence": 0.92,
            "source_message": "PU coating for low temperature"
      },
      {
            "key": "Location City",
            "value": "Nashik / Sinnar",
            "confidence": 0.95,
            "source_message": "Sinnar MIDC Nashik"
      },
      {
            "key": "Project Area",
            "value": "12,000 sq ft",
            "confidence": 0.93,
            "source_message": "12,000 sq ft cold storage"
      },
      {
            "key": "Matched Territory",
            "value": "CP-003 (Nashik-Malegaon)",
            "confidence": 0.98,
            "source_message": "Nashik & Sinnar covered under CP-003"
      }
],
    next_action: {
      title: "Technical Consultation Call",
      description: "Discuss polyurethane screed thickness for -20\u00b0C conditions.",
      due_date: "Tomorrow, 11:00 AM",
      type: "call"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 5,
    created_at: "2026-10-21T14:20:00Z",
    updated_at: "2026-10-21T16:00:00Z"
  },
  {
    id: "lead-mh-004",
    whatsapp_number: "+91 94221 67890",
    name: "Nitin Bawankar",
    company: "Vidarbha Power & Heavy Engineering",
    campaign: "LinkedIn - Heavy Industrial Nagpur",
    language: "Hindi/English",
    status: "Qualified",
    funnel: "HOT",
    score: 89,
    confidence: 0.94,
    product: "Polycrete Flooring",
    reason: "22,000 sq ft heavy equipment assembly bay in Butibori MIDC, Nagpur. High impact resistance and heavy wheel load handling needed.",
    score_breakdown: {"fit": 28, "opportunity": 22, "intent": 17, "urgency": 14, "completeness": 8},
    location: {
      address: "Plot 55, Butibori Industrial Area, Nagpur",
      maps_link: "https://maps.google.com/?q=20.9287,78.9902",
      city: "Nagpur",
      state: "Maharashtra",
      area_sqft: 22000
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Heavy Equipment & Transformer Bay",
      source_message: "Heavy machinery manufacturing bay in Butibori Nagpur",
      confidence: 0.95,
      extracted_at: "08:40 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Polycrete Flooring",
            "confidence": 0.95,
            "source_message": "Heavy load polyurethane concrete Polycrete"
      },
      {
            "key": "Location City",
            "value": "Nagpur (Butibori)",
            "confidence": 0.98,
            "source_message": "Butibori Nagpur"
      },
      {
            "key": "Project Area",
            "value": "22,000 sq ft",
            "confidence": 0.94,
            "source_message": "22,000 sq ft assembly workshop"
      },
      {
            "key": "Matched Territory",
            "value": "CP-004 (Vidarbha East)",
            "confidence": 0.99,
            "source_message": "Nagpur covered under CP-004"
      }
],
    next_action: {
      title: "Sample Tile Dispatch & Onsite Audit",
      description: "Send 6mm Polycrete sample block and arrange engineer visit.",
      due_date: "Today, 5:00 PM",
      type: "visit"
    },
    stage: "Visit",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 2,
    created_at: "2026-10-22T06:45:00Z",
    updated_at: "2026-10-22T08:10:00Z"
  },
  {
    id: "lead-mh-005",
    whatsapp_number: "+91 98230 99887",
    name: "Pramod Patwardhan",
    company: "Marathwada Auto Precision Pvt. Ltd.",
    campaign: "Google Ads - Auto Component Coating",
    language: "Marathi/English",
    status: "Qualified",
    funnel: "HOT",
    score: 86,
    confidence: 0.92,
    product: "Epoxy Self-Leveling \u2013 Matt Finish",
    reason: "14,000 sq ft CNC turning center in Waluj MIDC, Chhatrapati Sambhajinagar. Dust-proof seamless matt finish required for export audit.",
    score_breakdown: {"fit": 27, "opportunity": 21, "intent": 17, "urgency": 13, "completeness": 8},
    location: {
      address: "Sector K, Waluj MIDC, Chhatrapati Sambhajinagar",
      maps_link: "https://maps.google.com/?q=19.8370,75.2505",
      city: "Chhatrapati Sambhajinagar",
      state: "Maharashtra",
      area_sqft: 14000
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Automotive Precision Gear Manufacturing",
      source_message: "Waluj MIDC Sambhajinagar facility needing 2mm self leveling epoxy",
      confidence: 0.93,
      extracted_at: "12:20 PM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Epoxy Self-Leveling \u2013 Matt Finish",
            "confidence": 0.94,
            "source_message": "Dust-proof matt finish epoxy"
      },
      {
            "key": "Location City",
            "value": "Chhatrapati Sambhajinagar",
            "confidence": 0.99,
            "source_message": "Waluj MIDC Sambhajinagar"
      },
      {
            "key": "Project Area",
            "value": "14,000 sq ft",
            "confidence": 0.95,
            "source_message": "14,000 sqft gear manufacturing unit"
      },
      {
            "key": "Matched Territory",
            "value": "CP-005 (Marathwada Central)",
            "confidence": 0.99,
            "source_message": "Chhatrapati Sambhajinagar covered under CP-005"
      }
],
    next_action: {
      title: "Commercial Proposal Submission",
      description: "Submit formal proposal with 2-year OEM warranty.",
      due_date: "Today, 4:30 PM",
      type: "quote"
    },
    stage: "Quote",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 4,
    created_at: "2026-10-21T11:00:00Z",
    updated_at: "2026-10-21T13:45:00Z"
  },
  {
    id: "lead-mh-006",
    whatsapp_number: "+91 98908 12345",
    name: "Dhananjay Ghatge",
    company: "Ghatge Foundry & Engineering Works",
    campaign: "Meta Ads - Foundry Floor Coating Kolhapur",
    language: "Marathi/Hindi",
    status: "Qualified",
    funnel: "WARM",
    score: 81,
    confidence: 0.89,
    product: "High-Build Epoxy Mortar",
    reason: "16,000 sq ft foundry fettling and pattern shop in Gokul Shirgaon MIDC, Kolhapur. Extreme thermal and impact stress.",
    score_breakdown: {"fit": 27, "opportunity": 21, "intent": 16, "urgency": 10, "completeness": 7},
    location: {
      address: "Gokul Shirgaon MIDC, Kolhapur",
      maps_link: "https://maps.google.com/?q=16.6342,74.2694",
      city: "Kolhapur",
      state: "Maharashtra",
      area_sqft: 16000
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Heavy Iron Casting Foundry & Fettling Shop",
      source_message: "Foundry unit in Kolhapur needing heavy duty mortar floor",
      confidence: 0.91,
      extracted_at: "13:00 PM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "High-Build Epoxy Mortar",
            "confidence": 0.91,
            "source_message": "Heavy abrasion mortar screed"
      },
      {
            "key": "Location City",
            "value": "Kolhapur",
            "confidence": 0.98,
            "source_message": "Gokul Shirgaon Kolhapur"
      },
      {
            "key": "Project Area",
            "value": "16,000 sq ft",
            "confidence": 0.92,
            "source_message": "16,000 sq ft foundry area"
      },
      {
            "key": "Matched Territory",
            "value": "CP-006 (Western Maharashtra South)",
            "confidence": 0.99,
            "source_message": "Kolhapur covered under CP-006"
      }
],
    next_action: {
      title: "Substrate Quality Audit",
      description: "Check oil contamination depth in existing concrete floor.",
      due_date: "Tomorrow, 2:00 PM",
      type: "visit"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 6,
    created_at: "2026-10-20T10:15:00Z",
    updated_at: "2026-10-20T12:00:00Z"
  },
  {
    id: "lead-mh-007",
    whatsapp_number: "+91 94220 55667",
    name: "Mahesh Solapure",
    company: "Shree Siddheshwar Textile Processing Mills",
    campaign: "Google Search - Textile Mill Waterproofing Flooring",
    language: "Marathi/Hindi",
    status: "Qualified",
    funnel: "HOT",
    score: 85,
    confidence: 0.9,
    product: "Anti-Corrosive Coating",
    reason: "10,500 sq ft textile dyeing and processing hall in Solapur MIDC. Wet chemicals, acid exposure, needs chemical resistant screed.",
    score_breakdown: {"fit": 26, "opportunity": 21, "intent": 17, "urgency": 13, "completeness": 8},
    location: {
      address: "Plot C-12, Chincholi MIDC, Solapur",
      maps_link: "https://maps.google.com/?q=17.7491,75.9287",
      city: "Solapur",
      state: "Maharashtra",
      area_sqft: 10500
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Wet Textile Dyeing & Bleaching Plant",
      source_message: "Dyeing hall in Solapur with continuous chemical washdowns",
      confidence: 0.92,
      extracted_at: "14:20 PM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Anti-Corrosive Coating",
            "confidence": 0.92,
            "source_message": "Chemical resistant anti-corrosive floor coating"
      },
      {
            "key": "Location City",
            "value": "Solapur",
            "confidence": 0.99,
            "source_message": "Chincholi MIDC Solapur"
      },
      {
            "key": "Project Area",
            "value": "10,500 sq ft",
            "confidence": 0.94,
            "source_message": "10,500 sq ft wet processing hall"
      },
      {
            "key": "Matched Territory",
            "value": "CP-007 (Marathwada South)",
            "confidence": 0.99,
            "source_message": "Solapur covered under CP-007"
      }
],
    next_action: {
      title: "Chemical Resistance Compatibility Report",
      description: "Verify acid/alkali tolerance chart with textile chemist.",
      due_date: "Today, 5:30 PM",
      type: "quote"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 3,
    created_at: "2026-10-21T09:00:00Z",
    updated_at: "2026-10-21T10:30:00Z"
  },
  {
    id: "lead-mh-008",
    whatsapp_number: "+91 98223 77889",
    name: "Vinayak Shinde",
    company: "Godavari Agro Biotech & Seeds Ltd.",
    campaign: "LinkedIn - Agro Seed Processing Floor",
    language: "Marathi/English",
    status: "Qualified",
    funnel: "WARM",
    score: 76,
    confidence: 0.88,
    product: "Epoxy Floor Coating",
    reason: "9,000 sq ft hybrid seed packaging and storage warehouse in Jalgaon MIDC. Requires dust-free smooth epoxy coating.",
    score_breakdown: {"fit": 25, "opportunity": 19, "intent": 16, "urgency": 10, "completeness": 6},
    location: {
      address: "Industrial Area, Jalgaon MIDC, Jalgaon",
      maps_link: "https://maps.google.com/?q=21.0077,75.5626",
      city: "Jalgaon",
      state: "Maharashtra",
      area_sqft: 9000
    },
    flooring_category: "Warehouse & Logistics",
    flooring_area: {
      category: "Warehouse & Logistics",
      sub_type: "Clean Seed Packaging & Warehouse Floor",
      source_message: "Seed storage unit in Jalgaon requiring dust free epoxy",
      confidence: 0.9,
      extracted_at: "15:15 PM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Epoxy Floor Coating",
            "confidence": 0.9,
            "source_message": "Dust free epoxy coating"
      },
      {
            "key": "Location City",
            "value": "Jalgaon",
            "confidence": 0.98,
            "source_message": "Jalgaon MIDC"
      },
      {
            "key": "Project Area",
            "value": "9,000 sq ft",
            "confidence": 0.92,
            "source_message": "9,000 sq ft seed store"
      },
      {
            "key": "Matched Territory",
            "value": "CP-009 (North Maharashtra)",
            "confidence": 0.99,
            "source_message": "Jalgaon covered under CP-009"
      }
],
    next_action: {
      title: "Follow-up Call with Managing Director",
      description: "Confirm installation window before harvesting season.",
      due_date: "Friday, 10:00 AM",
      type: "call"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 7,
    created_at: "2026-10-19T14:00:00Z",
    updated_at: "2026-10-19T16:20:00Z"
  },
  {
    id: "lead-mh-009",
    whatsapp_number: "+91 98200 44556",
    name: "Ketan Mehta",
    company: "Albatross Cold Logistics & Marine Export",
    campaign: "Direct Inbound - Coastal Industrial Flooring",
    language: "English/Hindi",
    status: "Qualified",
    funnel: "HOT",
    score: 90,
    confidence: 0.96,
    product: "Polyurethane Coating",
    reason: "15,000 sq ft marine seafood processing and cold blast freezing zone in Roha MIDC, Raigad. Extreme saline exposure and thermal cycling.",
    score_breakdown: {"fit": 29, "opportunity": 23, "intent": 18, "urgency": 13, "completeness": 7},
    location: {
      address: "Plot 10, Dhatav MIDC, Roha, Raigad / Konkan Belt",
      maps_link: "https://maps.google.com/?q=18.4357,73.1189",
      city: "Roha",
      state: "Maharashtra",
      area_sqft: 15000
    },
    flooring_category: "Cold Storage & Food",
    flooring_area: {
      category: "Cold Storage & Food",
      sub_type: "Marine Export Blast Freezer & Processing",
      source_message: "Seafood export processing facility in Roha Konkan belt",
      confidence: 0.96,
      extracted_at: "09:10 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Polyurethane Coating",
            "confidence": 0.96,
            "source_message": "Heavy thermal shock PU coating"
      },
      {
            "key": "Location City",
            "value": "Roha (Konkan Coast)",
            "confidence": 0.99,
            "source_message": "Roha MIDC Raigad"
      },
      {
            "key": "Project Area",
            "value": "15,000 sq ft",
            "confidence": 0.95,
            "source_message": "15,000 sqft seafood unit"
      },
      {
            "key": "Matched Territory",
            "value": "CP-010 (Konkan Coast)",
            "confidence": 0.99,
            "source_message": "Roha covered under CP-010"
      }
],
    next_action: {
      title: "Technical Onsite Measurement",
      description: "Assess slab salt crystallization and moisture before primer choice.",
      due_date: "Today, 2:30 PM",
      type: "visit"
    },
    stage: "Visit",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 1,
    created_at: "2026-10-22T08:00:00Z",
    updated_at: "2026-10-22T09:15:00Z"
  },
  {
    id: "lead-mh-010",
    whatsapp_number: "+91 98905 66778",
    name: "Sanjay Thorat",
    company: "Sahyadri Sugar & Distillery Engineering",
    campaign: "Meta Ads - Chemical Resistant Screed",
    language: "Marathi/English",
    status: "Qualified",
    funnel: "WARM",
    score: 83,
    confidence: 0.91,
    product: "Polycrete Flooring",
    reason: "11,000 sq ft fermentation and bottling section in Baramati MIDC. Organic acid and boiling washdowns.",
    score_breakdown: {"fit": 27, "opportunity": 21, "intent": 16, "urgency": 11, "completeness": 8},
    location: {
      address: "Baramati Industrial Area, Baramati, Pune District",
      maps_link: "https://maps.google.com/?q=18.1519,74.5770",
      city: "Baramati",
      state: "Maharashtra",
      area_sqft: 11000
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Agro-Chemical & Distillation Hall",
      source_message: "Bottling and distillery hall in Baramati",
      confidence: 0.91,
      extracted_at: "16:00 PM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Polycrete Flooring",
            "confidence": 0.91,
            "source_message": "Polycrete heavy thermal floor"
      },
      {
            "key": "Location City",
            "value": "Baramati",
            "confidence": 0.98,
            "source_message": "Baramati MIDC"
      },
      {
            "key": "Project Area",
            "value": "11,000 sq ft",
            "confidence": 0.93,
            "source_message": "11,000 sq ft floor"
      },
      {
            "key": "Matched Territory",
            "value": "CP-011 (Central Maharashtra)",
            "confidence": 0.99,
            "source_message": "Baramati covered under CP-011"
      }
],
    next_action: {
      title: "Send Detailed Specification PDF",
      description: "Send ColourPlus Polycrete engineering brochure and chemical chart.",
      due_date: "Tomorrow, 11:30 AM",
      type: "quote"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 4,
    created_at: "2026-10-21T15:30:00Z",
    updated_at: "2026-10-21T17:00:00Z"
  },
  {
    id: "lead-gj-001",
    whatsapp_number: "+91 98250 11990",
    name: "Bhavesh Patel",
    company: "Torrent Pharma & Formulation Plant",
    campaign: "Google Search - Pharma Cleanroom Flooring Ahmedabad",
    language: "Gujarati/English",
    status: "Qualified",
    funnel: "HOT",
    score: 93,
    confidence: 0.97,
    product: "Epoxy Self-Leveling \u2013 Matt Finish",
    reason: "20,000 sq ft US-FDA compliant pharmaceutical sterile formulation cleanroom in Sanand GIDC, Ahmedabad. Seamless coved epoxy screed.",
    score_breakdown: {"fit": 30, "opportunity": 24, "intent": 19, "urgency": 13, "completeness": 7},
    location: {
      address: "Plot 88, Sanand GIDC II, Ahmedabad",
      maps_link: "https://maps.google.com/?q=22.9868,72.3812",
      city: "Ahmedabad",
      state: "Gujarat",
      area_sqft: 20000
    },
    flooring_category: "Pharma & Cleanroom",
    flooring_area: {
      category: "Pharma & Cleanroom",
      sub_type: "US-FDA Sterile Injection Cleanroom",
      source_message: "Sanand GIDC sterile pharma cleanroom requiring seamless 3mm self leveling epoxy",
      confidence: 0.97,
      extracted_at: "10:00 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Epoxy Self-Leveling \u2013 Matt Finish",
            "confidence": 0.97,
            "source_message": "3mm seamless self-leveling epoxy with anti-microbial additive"
      },
      {
            "key": "Location City",
            "value": "Ahmedabad (Sanand)",
            "confidence": 0.99,
            "source_message": "Sanand GIDC Ahmedabad"
      },
      {
            "key": "Project Area",
            "value": "20,000 sq ft",
            "confidence": 0.98,
            "source_message": "20,000 sq ft sterile cleanroom"
      },
      {
            "key": "Matched Territory",
            "value": "CP-012 (Ahmedabad Core)",
            "confidence": 0.99,
            "source_message": "Ahmedabad covered under CP-012"
      }
],
    next_action: {
      title: "Pre-Audit Site Moisture Test",
      description: "Tramex moisture test and RH measurement in HVAC room.",
      due_date: "Today, 4:00 PM",
      type: "visit"
    },
    stage: "Visit",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 2,
    created_at: "2026-10-22T08:30:00Z",
    updated_at: "2026-10-22T09:40:00Z"
  },
  {
    id: "lead-gj-002",
    whatsapp_number: "+91 98241 88334",
    name: "Hiren Shah",
    company: "Surat Synthetic Filament Weaving Ltd.",
    campaign: "Meta Ads - Textile Anti-Skid Surat",
    language: "Gujarati/Hindi",
    status: "Qualified",
    funnel: "WARM",
    score: 82,
    confidence: 0.9,
    product: "Anti-Skid Coating Flooring",
    reason: "14,500 sq ft high-speed water jet loom weaving hall in Sachin GIDC, Surat. Anti-skid surface for wet oily walkways.",
    score_breakdown: {"fit": 26, "opportunity": 21, "intent": 17, "urgency": 11, "completeness": 7},
    location: {
      address: "Road No. 6, Sachin GIDC, Surat",
      maps_link: "https://maps.google.com/?q=21.0827,72.8732",
      city: "Surat",
      state: "Gujarat",
      area_sqft: 14500
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Textile Water Jet Weaving Shed",
      source_message: "Weaving unit in Surat requiring anti-skid epoxy coating",
      confidence: 0.92,
      extracted_at: "11:45 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Anti-Skid Coating Flooring",
            "confidence": 0.92,
            "source_message": "Textured anti-skid floor"
      },
      {
            "key": "Location City",
            "value": "Surat",
            "confidence": 0.99,
            "source_message": "Sachin GIDC Surat"
      },
      {
            "key": "Project Area",
            "value": "14,500 sq ft",
            "confidence": 0.94,
            "source_message": "14,500 sq ft weaving floor"
      },
      {
            "key": "Matched Territory",
            "value": "CP-013 (Surat Industrial)",
            "confidence": 0.99,
            "source_message": "Surat covered under CP-013"
      }
],
    next_action: {
      title: "Sample Board Delivery",
      description: "Send R11 anti-skid aggregate sample tiles to Surat office.",
      due_date: "Tomorrow, 3:00 PM",
      type: "quote"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 4,
    created_at: "2026-10-21T12:00:00Z",
    updated_at: "2026-10-21T13:20:00Z"
  },
  {
    id: "lead-up-001",
    whatsapp_number: "+91 98110 99221",
    name: "Amitav Sengupta",
    company: "Optimus Electronics Assembly SMT",
    campaign: "Google Search - ESD Flooring Noida",
    language: "English/Hindi",
    status: "Qualified",
    funnel: "HOT",
    score: 95,
    confidence: 0.98,
    product: "ESD Coating Flooring",
    reason: "32,000 sq ft mobile phone motherboard surface mount (SMT) assembly plant in Sector 68, Noida. Critical static dissipative ESD spec (10^6 - 10^9 ohms).",
    score_breakdown: {"fit": 30, "opportunity": 25, "intent": 19, "urgency": 13, "completeness": 8},
    location: {
      address: "B-14, Sector 68, Noida, Gautam Buddha Nagar",
      maps_link: "https://maps.google.com/?q=28.5997,77.3879",
      city: "Noida",
      state: "Uttar Pradesh",
      area_sqft: 32000
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "High-Tech SMT Electronics Assembly Cleanroom",
      source_message: "Sector 68 Noida SMT electronics line requiring ESD anti-static epoxy flooring with copper grid grounding",
      confidence: 0.98,
      extracted_at: "09:20 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "ESD Coating Flooring",
            "confidence": 0.98,
            "source_message": "Electrostatic dissipative ESD epoxy with copper tape earthing"
      },
      {
            "key": "Location City",
            "value": "Noida (Western UP/NCR)",
            "confidence": 0.99,
            "source_message": "Sector 68 Noida"
      },
      {
            "key": "Project Area",
            "value": "32,000 sq ft",
            "confidence": 0.98,
            "source_message": "32,000 sq ft SMT floor"
      },
      {
            "key": "Matched Territory",
            "value": "CP-036 (Western UP - NCR)",
            "confidence": 0.99,
            "source_message": "Noida covered under CP-036"
      }
],
    next_action: {
      title: "Grounding & Earthing Audit with Engineer",
      description: "Verify copper foil grid spacing and earth pit connection.",
      due_date: "Today, 3:00 PM",
      type: "visit"
    },
    stage: "Visit",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 1,
    created_at: "2026-10-22T08:10:00Z",
    updated_at: "2026-10-22T09:25:00Z"
  },
  {
    id: "lead-up-002",
    whatsapp_number: "+91 94150 23456",
    name: "Pradeep Awasthi",
    company: "Kanpur Leather & Chemical Processing Park",
    campaign: "Meta Ads - Chemical Resistant Screed Kanpur",
    language: "Hindi/English",
    status: "Qualified",
    funnel: "WARM",
    score: 80,
    confidence: 0.89,
    product: "Polycrete Flooring",
    reason: "13,000 sq ft tannery effluent and chemical storage yard in Jajmau Industrial Area, Kanpur. Severe acidic/alkali washdowns.",
    score_breakdown: {"fit": 26, "opportunity": 20, "intent": 17, "urgency": 10, "completeness": 7},
    location: {
      address: "Plot 42, Jajmau Industrial Area, Kanpur",
      maps_link: "https://maps.google.com/?q=26.4357,80.4011",
      city: "Kanpur",
      state: "Uttar Pradesh",
      area_sqft: 13000
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Heavy Chemical Processing & Tannery Yard",
      source_message: "Kanpur tannery chemical handling zone needing heavy Polycrete flooring",
      confidence: 0.91,
      extracted_at: "12:40 PM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Polycrete Flooring",
            "confidence": 0.91,
            "source_message": "Heavy acid resistant Polycrete screed"
      },
      {
            "key": "Location City",
            "value": "Kanpur",
            "confidence": 0.99,
            "source_message": "Jajmau Kanpur"
      },
      {
            "key": "Project Area",
            "value": "13,000 sq ft",
            "confidence": 0.93,
            "source_message": "13,000 sq ft yard"
      },
      {
            "key": "Matched Territory",
            "value": "CP-038 (Kanpur Region)",
            "confidence": 0.99,
            "source_message": "Kanpur covered under CP-038"
      }
],
    next_action: {
      title: "Technical Datasheet Email",
      description: "Share acid exposure testing credentials to chemical consultant.",
      due_date: "Tomorrow, 12:00 PM",
      type: "quote"
    },
    stage: "Qualified",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 5,
    created_at: "2026-10-20T14:30:00Z",
    updated_at: "2026-10-20T16:00:00Z"
  },
  {
    id: "lead-tn-001",
    whatsapp_number: "+91 98401 77654",
    name: "Karthik Subramanian",
    company: "Hyundai Auto Ancillary Supplier Corp",
    campaign: "LinkedIn - Automotive Flooring Sriperumbudur",
    language: "Tamil/English",
    status: "Qualified",
    funnel: "HOT",
    score: 92,
    confidence: 0.96,
    product: "High-Build Epoxy Mortar",
    reason: "24,000 sq ft heavy press shop in Sriperumbudur / Irungattukottai corridor near Chennai. 5-ton coil forklift traffic, needs 5mm heavy-duty screed.",
    score_breakdown: {"fit": 29, "opportunity": 24, "intent": 18, "urgency": 13, "completeness": 8},
    location: {
      address: "Plot 12, Irungattukottai SIPCOT, Sriperumbudur / Chennai Outer",
      maps_link: "https://maps.google.com/?q=12.9734,79.9482",
      city: "Chennai",
      state: "Tamil Nadu",
      area_sqft: 24000
    },
    flooring_category: "Factory & Industrial",
    flooring_area: {
      category: "Factory & Industrial",
      sub_type: "Heavy Automotive Stamping & Press Plant",
      source_message: "Sriperumbudur auto ancillary stamping plant requiring 5mm heavy-duty epoxy mortar",
      confidence: 0.96,
      extracted_at: "09:05 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "High-Build Epoxy Mortar",
            "confidence": 0.96,
            "source_message": "Heavy 5mm epoxy mortar for 5-ton forklift loads"
      },
      {
            "key": "Location City",
            "value": "Chennai (Sriperumbudur)",
            "confidence": 0.99,
            "source_message": "Irungattukottai SIPCOT Chennai"
      },
      {
            "key": "Project Area",
            "value": "24,000 sq ft",
            "confidence": 0.97,
            "source_message": "24,000 sq ft press workshop"
      },
      {
            "key": "Matched Territory",
            "value": "CP-021 (Chennai Metro)",
            "confidence": 0.99,
            "source_message": "Chennai covered under CP-021"
      }
],
    next_action: {
      title: "Substrate Compressive Strength Core Test",
      description: "Schmidt hammer rebound test on fresh concrete floor.",
      due_date: "Today, 4:30 PM",
      type: "visit"
    },
    stage: "Visit",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 2,
    created_at: "2026-10-22T07:45:00Z",
    updated_at: "2026-10-22T09:10:00Z"
  },
  {
    id: "lead-tg-001",
    whatsapp_number: "+91 99890 33221",
    name: "Venkat Reddy",
    company: "Genome Valley Life Sciences Laboratories",
    campaign: "Google Search - Cleanroom Flooring Hyderabad",
    language: "Telugu/English",
    status: "Qualified",
    funnel: "HOT",
    score: 94,
    confidence: 0.97,
    product: "Epoxy Self-Leveling \u2013 Matt Finish",
    reason: "19,000 sq ft biotechnology vaccine synthesis facility in Genome Valley, Shamirpet, Hyderabad. Anti-microbial seamless finish.",
    score_breakdown: {"fit": 30, "opportunity": 24, "intent": 19, "urgency": 13, "completeness": 8},
    location: {
      address: "Plot 4, Phase 3, Genome Valley, Shamirpet, Hyderabad",
      maps_link: "https://maps.google.com/?q=17.5925,78.5833",
      city: "Hyderabad",
      state: "Telangana",
      area_sqft: 19000
    },
    flooring_category: "Pharma & Cleanroom",
    flooring_area: {
      category: "Pharma & Cleanroom",
      sub_type: "Biotech Vaccine Formulation Sterile Suite",
      source_message: "Genome Valley Hyderabad facility needing 3mm antibacterial epoxy self leveling",
      confidence: 0.98,
      extracted_at: "10:15 AM"
    },
    fields: [
      {
            "key": "Product Required",
            "value": "Epoxy Self-Leveling \u2013 Matt Finish",
            "confidence": 0.98,
            "source_message": "3mm antibacterial seamless self leveling epoxy"
      },
      {
            "key": "Location City",
            "value": "Hyderabad (Genome Valley)",
            "confidence": 0.99,
            "source_message": "Genome Valley Shamirpet Hyderabad"
      },
      {
            "key": "Project Area",
            "value": "19,000 sq ft",
            "confidence": 0.97,
            "source_message": "19,000 sq ft vaccine cleanroom"
      },
      {
            "key": "Matched Territory",
            "value": "CP-044 (Hyderabad Metro)",
            "confidence": 0.99,
            "source_message": "Hyderabad covered under CP-044"
      }
],
    next_action: {
      title: "Substrate Relative Humidity Audit",
      description: "Perform ASTM F2170 in-situ probe RH test.",
      due_date: "Today, 2:00 PM",
      type: "visit"
    },
    stage: "Visit",
    assigned_to: "",
    ai_active: true,
    unreplied_hours: 1,
    created_at: "2026-10-22T08:00:00Z",
    updated_at: "2026-10-22T09:20:00Z"
  },
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
    product: 'High-Build Epoxy Mortar',
    reason: 'High immediate intent, 15,000 sq ft factory floor requirement, specific location (Hosur Industrial Hub), budget pre-approved.',
    score_breakdown: {
      fit: 29,         // out of 30
      opportunity: 24, // out of 25
      intent: 19,      // out of 20
      urgency: 12,     // out of 15
      completeness: 8, // out of 10
    },
    location: {
      address: 'Plot 42, Phase II, Hosur Industrial Complex, Hosur, Tamil Nadu',
      maps_link: 'https://maps.google.com/?q=12.7409,77.8253',
      city: 'Hosur',
      state: 'Tamil Nadu',
      area_sqft: 15000
    },
    flooring_category: 'Factory & Industrial',
    flooring_area: {
      category: 'Factory & Industrial',
      sub_type: 'Heavy CNC Machinery Plant Floor',
      source_message: 'Factory floor for CNC machinery',
      confidence: 0.96,
      extracted_at: '10:18 AM'
    },
    fields: [
      { key: 'Product Required', value: 'High-Build Epoxy Mortar', confidence: 0.96, source_message: 'High abrasion resistance needed for forklift traffic', timestamp: '10:20 AM' },
      { key: 'Flooring Area Type', value: 'Factory & Industrial (CNC Plant)', confidence: 0.96, source_message: 'Factory floor for CNC machinery', timestamp: '10:18 AM' },
      { key: 'Project Area', value: '15,000 sq ft', confidence: 0.98, source_message: 'Namaskara, namg 15,000 sq ft epoxy coating bekagide', timestamp: '10:14 AM' },
      { key: 'Floor Condition', value: 'New Concrete Slab (M30 grade)', confidence: 0.91, source_message: 'Fresh concrete slab laid last month', timestamp: '10:17 AM' },
      { key: 'Industry Type', value: 'Heavy Machine Manufacturing', confidence: 0.95, source_message: 'Factory floor for CNC machinery', timestamp: '10:18 AM' },
      { key: 'Required Coating', value: 'Heavy Duty High-Build Epoxy Mortar', confidence: 0.88, source_message: 'High abrasion resistance needed for forklift traffic', timestamp: '10:20 AM' },
      { key: 'Estimated Budget', value: '₹ 12,000,000 - ₹ 15,000,000', confidence: 0.74, source_message: 'Management approved around 14 Lakhs total', timestamp: '10:22 AM' },
      { key: 'Target Timeline', value: 'Within 10 Days', confidence: 0.93, source_message: 'Need to finish before new machinery installation', timestamp: '10:24 AM' }
    ],
    next_action: {
      title: 'Confirm Technical Site Inspection',
      description: 'Senior application engineer needs to measure moisture content (%) and substrate surface hardness.',
      due_date: 'Today, 4:00 PM',
      type: 'visit'
    },
    stage: 'Visit',
    assigned_to: 'CP-001 (Mumbai Metro)',
    ai_active: true,
    unreplied_hours: 22,
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
    product: 'Epoxy Self-Leveling – Matt Finish',
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
    flooring_category: 'Pharma & Cleanroom',
    flooring_area: {
      category: 'Pharma & Cleanroom',
      sub_type: 'WHO-GMP Compliant Sterile Cleanroom',
      source_message: 'Cleanroom area 6500 sqft',
      confidence: 0.99,
      extracted_at: '09:05 AM'
    },
    fields: [
      { key: 'Product Required', value: 'Epoxy Self-Leveling – Matt Finish', confidence: 0.97, source_message: 'WHO-GMP grade seamless antibacterial screed', timestamp: '09:08 AM' },
      { key: 'Flooring Area Type', value: 'Pharma & Cleanroom (Sterile Zone)', confidence: 0.99, source_message: 'Cleanroom area 6500 sqft', timestamp: '09:05 AM' },
      { key: 'Project Area', value: '6,500 sq ft Cleanroom', confidence: 0.99, source_message: 'Cleanroom area 6500 sqft', timestamp: '09:05 AM' },
      { key: 'System Spec', value: 'ColourPlus Epoxy Self-Leveling Matt Finish', confidence: 0.94, source_message: 'WHO-GMP grade seamless antibacterial screed', timestamp: '09:08 AM' },
      { key: 'Regulatory Requirement', value: 'WHO-GMP & USFDA Compliance', confidence: 0.96, source_message: 'Auditscheduled next Wednesday', timestamp: '09:10 AM' },
      { key: 'Chemical Exposure', value: 'Frequent Alcohol & Acid Washdowns', confidence: 0.78, source_message: 'Cleaned daily with isopropyl alcohol', timestamp: '09:12 AM' }
    ],
    next_action: {
      title: 'Dispatch Technical Data Sheet & Quotation',
      description: 'Send ColourPlus PU Cleanroom TDS and formal commercial quote.',
      due_date: 'Today, 2:00 PM',
      type: 'quote'
    },
    stage: 'Quote',
    assigned_to: 'CP-002 (Pune Industrial Belt)',
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
    product: 'Waterproofing',
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
    flooring_category: 'Commercial & Terrace',
    flooring_area: {
      category: 'Commercial & Terrace',
      sub_type: 'Commercial Tech Park Roof Terrace',
      source_message: 'Terrace size around 8000 sq ft',
      confidence: 0.92,
      extracted_at: 'Yesterday'
    },
    fields: [
      { key: 'Product Required', value: 'Waterproofing (Liquid Elastomeric Membrane)', confidence: 0.94, source_message: 'Looking for 10-year warranty membrane', timestamp: 'Yesterday' },
      { key: 'Flooring Area Type', value: 'Commercial & Terrace (IT Tech Park)', confidence: 0.92, source_message: 'Terrace size around 8000 sq ft', timestamp: 'Yesterday' },
      { key: 'Project Area', value: '8,000 sq ft Roof Terrace', confidence: 0.92, source_message: 'Terrace size around 8000 sq ft', timestamp: 'Yesterday' },
      { key: 'Problem Type', value: 'Active Seepage in 4th floor ceiling', confidence: 0.90, source_message: 'Rainwater seepage coming down', timestamp: 'Yesterday' },
      { key: 'Preferred Solution', value: 'Polyurea / Elastomeric PU Liquid Membrane', confidence: 0.71, source_message: 'Looking for 10-year warranty membrane', timestamp: 'Yesterday' }
    ],
    next_action: {
      title: 'Schedule Pre-Visit Discovery Call',
      description: 'Call client to verify structural slab type before site visit.',
      due_date: 'Tomorrow, 11:00 AM',
      type: 'call'
    },
    stage: 'Qualified',
    assigned_to: 'CP-003 (Nashik-Malegaon)',
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
    product: 'Epoxy Floor Coating',
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
    flooring_category: 'Warehouse & Logistics',
    flooring_area: {
      category: 'Warehouse & Logistics',
      sub_type: 'Logistics Distribution & Warehousing Hub',
      source_message: 'Logistics park warehouse 40k sqft',
      confidence: 0.95,
      extracted_at: '2 days ago'
    },
    fields: [
      { key: 'Product Required', value: 'Epoxy Floor Coating', confidence: 0.91, source_message: 'Logistics park warehouse 40k sqft', timestamp: '2 days ago' },
      { key: 'Flooring Area Type', value: 'Warehouse & Logistics (Hub)', confidence: 0.95, source_message: 'Logistics park warehouse 40k sqft', timestamp: '2 days ago' },
      { key: 'Project Area', value: '40,000 sq ft Warehouse', confidence: 0.95, source_message: 'Logistics park warehouse 40k sqft', timestamp: '2 days ago' },
      { key: 'Requirement', value: 'Lithium Silicate Hardener / Dust-proofing', confidence: 0.85, source_message: 'Need low cost dust sealing', timestamp: '2 days ago' },
      { key: 'Timeline', value: 'Q4 2026 (November/December)', confidence: 0.65, source_message: 'Management looking at next quarter budget', timestamp: '2 days ago' }
    ],
    next_action: {
      title: 'Send Educational Case Study',
      description: 'Email case study on warehouse floor hardener vs PU sealers.',
      due_date: 'Oct 12, 2026',
      type: 'review'
    },
    stage: 'Lead',
    assigned_to: '',
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
    product: 'Wall Coating',
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
    flooring_category: 'Household & Residential',
    flooring_area: {
      category: 'Household & Residential',
      sub_type: 'Residential House / Bedroom Wall Paint',
      source_message: 'House bedroom paint',
      confidence: 0.99,
      extracted_at: 'Oct 04'
    },
    fields: [
      { key: 'Product Required', value: 'Wall Coating (Retail Paint Inquiry)', confidence: 0.99, source_message: 'House bedroom paint', timestamp: 'Oct 04' },
      { key: 'Flooring Area Type', value: 'Household & Residential (Consumer)', confidence: 0.99, source_message: 'House bedroom paint', timestamp: 'Oct 04' },
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
    assigned_to: '',
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
    product: 'Polycrete Flooring',
    reason: 'Seafood cold storage plant flooring (-25°C thermal shock resist). 5,500 sq ft. Needs heavy chemical & salt water resistance.',
    score_breakdown: {
      fit: 24,
      opportunity: 18,
      intent: 12,
      urgency: 5,
      completeness: 3
    },
    location: {
      address: 'Baikampady Industrial Area, Mangaluru Port Road',
      maps_link: 'https://maps.google.com/?q=12.9363,74.8156',
      city: 'Mangaluru',
      state: 'Karnataka',
      area_sqft: 5500
    },
    flooring_category: 'Cold Storage & Food',
    flooring_area: {
      category: 'Cold Storage & Food',
      sub_type: 'Seafood Deep Freeze Cold Storage Unit',
      source_message: 'Cold storage processing hall 5500 sqft',
      confidence: 0.96,
      extracted_at: 'Oct 03'
    },
    fields: [
      { key: 'Product Required', value: 'Polycrete Flooring (Heavy Screed)', confidence: 0.95, source_message: 'Needs heavy polyurethane screed for freeze cycles', timestamp: 'Oct 03' },
      { key: 'Flooring Area Type', value: 'Cold Storage & Food (Seafood Unit)', confidence: 0.96, source_message: 'Cold storage processing hall 5500 sqft', timestamp: 'Oct 03' },
      { key: 'Project Area', value: '5,500 sq ft Cold Storage', confidence: 0.96, source_message: 'Cold storage processing hall 5500 sqft', timestamp: 'Oct 03' },
      { key: 'Operating Temp', value: '-25°C to +15°C', confidence: 0.94, source_message: 'Sub zero temperature deep freeze unit', timestamp: 'Oct 03' },
      { key: 'Substrate Spec', value: 'Thermal Shock Heavy PU Screed 6mm', confidence: 0.76, source_message: 'Needs heavy polyurethane screed for freeze cycles', timestamp: 'Oct 03' }
    ],
    next_action: {
      title: 'Send Polyurethane Screed Tech Specs',
      description: 'Share ColourPlus Polycrete HD 6mm TDS & chemical resistance table.',
      due_date: 'Oct 08, 2026',
      type: 'quote'
    },
    stage: 'Qualified',
    assigned_to: 'CP-001 (Mumbai Metro)',
    ai_active: true,
    unreplied_hours: 6,
    created_at: '2026-10-03T10:15:00Z',
    updated_at: '2026-10-04T12:00:00Z'
  },
  {
    id: 'lead-007',
    whatsapp_number: '+91 98441 55670',
    name: 'Kothari Automobiles',
    company: 'Apex Motors & Service Station',
    campaign: 'Google Ads - Auto Service Flooring',
    language: 'English/Hindi',
    status: 'Qualified',
    funnel: 'HOT',
    score: 86,
    confidence: 0.93,
    product: 'Epoxy Polyurethane (EPU) Coating',
    reason: 'Multi-brand service station & showroom floor. 12,000 sq ft requiring oil-resistant, high-gloss polyurethane floor.',
    score_breakdown: {
      fit: 28,
      opportunity: 22,
      intent: 18,
      urgency: 11,
      completeness: 7
    },
    location: {
      address: 'Plot 104, 1st Cross, Peenya 1st Stage, Bengaluru',
      maps_link: 'https://maps.google.com/?q=13.0280,77.5250',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 12000
    },
    flooring_category: 'Automobile & Garages',
    flooring_area: {
      category: 'Automobile & Garages',
      sub_type: 'Automotive Workshop Bay & Service Station',
      source_message: 'Automobile workshop bay and service station 12000 sqft',
      confidence: 0.94,
      extracted_at: '11:30 AM'
    },
    fields: [
      { key: 'Product Required', value: 'Epoxy Polyurethane (EPU) Coating', confidence: 0.95, source_message: 'Vehicles leak oil and grease, need high gloss non-staining surface', timestamp: '11:32 AM' },
      { key: 'Flooring Area Type', value: 'Automobile & Garages (Workshop Bay)', confidence: 0.94, source_message: 'Automobile workshop bay and service station 12000 sqft', timestamp: '11:30 AM' },
      { key: 'Project Area', value: '12,000 sq ft Workshop & Bay', confidence: 0.96, source_message: 'Automobile workshop bay 12000 sqft', timestamp: '11:30 AM' },
      { key: 'Required Property', value: 'Oil, Brake Fluid & Battery Acid Resistant', confidence: 0.92, source_message: 'Vehicles leak oil and grease, need high gloss non-staining surface', timestamp: '11:32 AM' }
    ],
    next_action: {
      title: 'Schedule Site Visit & Color Sample Presentation',
      description: 'Show RAL colour samples (Light Grey & Signal Blue) for bay zoning.',
      due_date: 'Tomorrow, 3:00 PM',
      type: 'visit'
    },
    stage: 'Visit',
    assigned_to: 'CP-001 (Mumbai Metro)',
    ai_active: true,
    unreplied_hours: 1,
    created_at: '2026-10-07T11:20:00Z',
    updated_at: '2026-10-07T11:35:00Z'
  },
  {
    id: 'lead-008',
    whatsapp_number: '+91 97401 22345',
    name: 'Arun Swaminathan',
    company: 'NexGen Robotics & PCB Ltd.',
    campaign: 'Google Ads - ESD Antistatic Flooring',
    language: 'English',
    status: 'Qualified',
    funnel: 'HOT',
    score: 90,
    confidence: 0.95,
    product: 'ESD Coating Flooring',
    reason: 'High-precision electronics and robotics assembly lines require static dissipative ESD flooring (surface resistance 10^6 to 10^9 ohms).',
    score_breakdown: {
      fit: 30,
      opportunity: 23,
      intent: 19,
      urgency: 11,
      completeness: 7
    },
    location: {
      address: 'Electronic City Phase 1, Near Infosys Gate 4, Bengaluru',
      maps_link: 'https://maps.google.com/?q=12.8452,77.6602',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 8200
    },
    flooring_category: 'Factory & Industrial',
    flooring_area: {
      category: 'Factory & Industrial',
      sub_type: 'Semiconductor Plants & PCB Robotics Assembly',
      source_message: 'Need ESD antistatic floor coating for mobile robotics line',
      confidence: 0.97,
      extracted_at: 'Today, 10:45 AM'
    },
    fields: [
      { key: 'Product Required', value: 'ESD Coating Flooring', confidence: 0.98, source_message: 'Need ESD antistatic floor coating for mobile robotics line', timestamp: '10:45 AM' },
      { key: 'Flooring Area Type', value: 'Factory & Industrial (Robotics Assembly)', confidence: 0.97, source_message: 'Need ESD antistatic floor coating for mobile robotics line', timestamp: '10:45 AM' },
      { key: 'Project Area', value: '8,200 sq ft', confidence: 0.96, source_message: 'Total assembly shop floor area is 8200 sqft', timestamp: '10:46 AM' },
      { key: 'Electrical Resistance', value: '10^6 - 10^9 Ohms (ANSI/ESD S20.20)', confidence: 0.93, source_message: 'Must meet ANSI/ESD S20.20 standard for PCB handling', timestamp: '10:48 AM' }
    ],
    next_action: {
      title: 'Send Copper Grid Earthing Layout & ESD TDS',
      description: 'Share ColourPlus ESD Conductive primer & earthing tape layout specifications.',
      due_date: 'Tomorrow, 11:30 AM',
      type: 'quote'
    },
    stage: 'Quote',
    assigned_to: 'CP-002 (Pune Industrial Belt)',
    ai_active: true,
    unreplied_hours: 3,
    created_at: '2026-10-08T09:15:00Z',
    updated_at: '2026-10-08T10:50:00Z'
  },
  {
    id: 'lead-009',
    whatsapp_number: '+91 98800 66789',
    name: 'Meera Nambiar',
    company: 'Prestige Sky Tech Park',
    campaign: 'Meta Ads - Multi-Level Parking & Ramps',
    language: 'English',
    status: 'New',
    funnel: 'WARM',
    score: 74,
    confidence: 0.90,
    product: 'Anti-Skid Coating Flooring',
    reason: 'Commercial multi-level basement parking ramps require heavy textured aggregate anti-skid coating to prevent vehicular slippage in wet monsoons.',
    score_breakdown: {
      fit: 24,
      opportunity: 21,
      intent: 15,
      urgency: 8,
      completeness: 6
    },
    location: {
      address: 'Outer Ring Road, Bellandur, Bengaluru',
      maps_link: 'https://maps.google.com/?q=12.9260,77.6762',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 14000
    },
    flooring_category: 'Commercial & Terrace',
    flooring_area: {
      category: 'Commercial & Terrace',
      sub_type: 'Multi-Level Basement Parking Ramps & Sloped Walkways',
      source_message: 'High traction anti-skid coating on 4 basement vehicle ramps',
      confidence: 0.93,
      extracted_at: 'Yesterday'
    },
    fields: [
      { key: 'Product Required', value: 'Anti-Skid Coating Flooring', confidence: 0.95, source_message: 'High traction anti-skid coating on 4 basement vehicle ramps', timestamp: 'Yesterday' },
      { key: 'Flooring Area Type', value: 'Commercial & Terrace (Parking Ramps)', confidence: 0.93, source_message: 'High traction anti-skid coating on 4 basement vehicle ramps', timestamp: 'Yesterday' },
      { key: 'Project Area', value: '14,000 sq ft (4 Ramps + Driveways)', confidence: 0.94, source_message: '4 ramps totaling around 14000 sq ft', timestamp: 'Yesterday' }
    ],
    next_action: {
      title: 'Schedule Site Friction Audit',
      description: 'Field engineer to test current ramp slope incline and concrete profile.',
      due_date: 'Oct 14, 2026',
      type: 'visit'
    },
    stage: 'Visit',
    assigned_to: 'CP-003 (Nashik-Malegaon)',
    ai_active: true,
    unreplied_hours: 5,
    created_at: '2026-10-07T14:10:00Z',
    updated_at: '2026-10-07T16:00:00Z'
  },
  {
    id: 'lead-010',
    whatsapp_number: '+91 99452 33411',
    name: 'Kiran Deshmukh',
    company: 'Southern Grid Transmission Corp',
    campaign: 'Direct Inbound - Dielectric Flooring',
    language: 'English/Hindi',
    status: 'Qualified',
    funnel: 'HOT',
    score: 84,
    confidence: 0.93,
    product: 'Dielectric Insulation Flooring',
    reason: '33kV electrical substation and transformer yards require seamless dielectric non-conductive safety flooring as per CEA electrical regulations.',
    score_breakdown: {
      fit: 28,
      opportunity: 21,
      intent: 18,
      urgency: 11,
      completeness: 6
    },
    location: {
      address: 'Plot 77, SIPCOT Phase 1, Hosur Industrial Complex',
      maps_link: 'https://maps.google.com/?q=12.7480,77.8190',
      city: 'Hosur',
      state: 'Tamil Nadu',
      area_sqft: 4500
    },
    flooring_category: 'Factory & Industrial',
    flooring_area: {
      category: 'Factory & Industrial',
      sub_type: 'High Voltage Electrical Substations & Control Rooms',
      source_message: '33kV dielectric insulation matting replacement for control room',
      confidence: 0.95,
      extracted_at: 'Yesterday'
    },
    fields: [
      { key: 'Product Required', value: 'Dielectric Insulation Flooring', confidence: 0.97, source_message: '33kV dielectric insulation matting replacement for control room', timestamp: 'Yesterday' },
      { key: 'Voltage Rating', value: 'Class C / 33,000 Volts Tested', confidence: 0.95, source_message: 'Substation operating voltage is 33kV', timestamp: 'Yesterday' },
      { key: 'Project Area', value: '4,500 sq ft Substation Control Room', confidence: 0.94, source_message: 'Area is 4500 sq ft', timestamp: 'Yesterday' }
    ],
    next_action: {
      title: 'Dispatch CPRI Dielectric Test Certificate',
      description: 'Email CPRI laboratory dielectric breakdown voltage test report for ColourPlus Dielectric system.',
      due_date: 'Tomorrow, 2:00 PM',
      type: 'quote'
    },
    stage: 'Quote',
    assigned_to: 'CP-001 (Mumbai Metro)',
    ai_active: true,
    unreplied_hours: 8,
    created_at: '2026-10-07T12:00:00Z',
    updated_at: '2026-10-07T15:30:00Z'
  },
  {
    id: 'lead-011',
    whatsapp_number: '+91 94801 88902',
    name: 'Vijay Singhania',
    company: 'Mangalore Coastal Petrochemicals',
    campaign: 'Google Search - Anti Corrosive Chemical Coating',
    language: 'English',
    status: 'In Progress',
    funnel: 'WARM',
    score: 71,
    confidence: 0.88,
    product: 'Anti-Corrosive Coating',
    reason: 'Coastal petrochemical terminal experiencing heavy marine salt spray and acid vapor corrosion on bund walls and steel pump plinths.',
    score_breakdown: {
      fit: 25,
      opportunity: 19,
      intent: 14,
      urgency: 7,
      completeness: 6
    },
    location: {
      address: 'Panambur Marine Industrial Zone, Mangaluru Port',
      maps_link: 'https://maps.google.com/?q=12.9450,74.8210',
      city: 'Mangaluru',
      state: 'Karnataka',
      area_sqft: 9000
    },
    flooring_category: 'Factory & Industrial',
    flooring_area: {
      category: 'Factory & Industrial',
      sub_type: 'Coastal Facilities, Refineries & Pipelines',
      source_message: 'Heavy saline corrosion protection for chemical drainage and pumps',
      confidence: 0.91,
      extracted_at: 'Oct 05'
    },
    fields: [
      { key: 'Product Required', value: 'Anti-Corrosive Coating', confidence: 0.93, source_message: 'Heavy saline corrosion protection for chemical drainage and pumps', timestamp: 'Oct 05' },
      { key: 'Environment', value: 'Marine Saline Spray + Acid Fumes', confidence: 0.91, source_message: 'Heavy saline corrosion near seaport', timestamp: 'Oct 05' },
      { key: 'Project Area', value: '9,000 sq ft Bund Walls & Plinths', confidence: 0.89, source_message: 'Roughly 9000 sq ft surface area', timestamp: 'Oct 05' }
    ],
    next_action: {
      title: 'Send Chemical Resistance Matrix',
      description: 'Provide immersion test data for sulfuric and hydrochloric acid resistance.',
      due_date: 'Oct 15, 2026',
      type: 'quote'
    },
    stage: 'Qualified',
    assigned_to: 'CP-001 (Mumbai Metro)',
    ai_active: true,
    unreplied_hours: 12,
    created_at: '2026-09-24T09:40:00Z',
    updated_at: '2026-09-24T14:15:00Z'
  },
  {
    id: 'lead-012',
    whatsapp_number: '+91 96112 55431',
    name: 'Rohit Malhotra',
    company: 'ExpressLogix Distribution Centers',
    campaign: 'Meta Ads - Warehouse Line Marking',
    language: 'English/Hindi',
    status: 'Qualified',
    funnel: 'WARM',
    score: 66,
    confidence: 0.89,
    product: 'Marking (Yellow / White)',
    reason: 'Distribution center needs high-visibility yellow forklift transit lanes, zebra crossings, and white pedestrian walkways for OSHA safety compliance.',
    score_breakdown: {
      fit: 23,
      opportunity: 18,
      intent: 13,
      urgency: 7,
      completeness: 5
    },
    location: {
      address: 'Nelamangala Logistics Corridor, Bengaluru Outer',
      maps_link: 'https://maps.google.com/?q=13.0970,77.3820',
      city: 'Nelamangala',
      state: 'Karnataka',
      area_sqft: 22000
    },
    flooring_category: 'Warehouse & Logistics',
    flooring_area: {
      category: 'Warehouse & Logistics',
      sub_type: 'Warehouses, Assembly Lines & Safety Walkways',
      source_message: 'Yellow forklift driveway lines and white pedestrian safety walkways',
      confidence: 0.94,
      extracted_at: 'Oct 04'
    },
    fields: [
      { key: 'Product Required', value: 'Marking (Yellow / White)', confidence: 0.96, source_message: 'Yellow forklift driveway lines and white pedestrian safety walkways', timestamp: 'Oct 04' },
      { key: 'Marking Spec', value: '100mm Width Yellow / White Polyurethane Line Marking', confidence: 0.94, source_message: 'Standard 4 inch yellow lines and zebra walkways', timestamp: 'Oct 04' },
      { key: 'Total Warehouse Size', value: '22,000 sq ft Logistics Hub', confidence: 0.92, source_message: 'Overall warehouse is 22000 sq ft', timestamp: 'Oct 04' }
    ],
    next_action: {
      title: 'Send Line Marking CAD Estimator',
      description: 'Request warehouse floor layout DWG file to calculate exact linear meters of stripe marking.',
      due_date: 'Tomorrow, 5:00 PM',
      type: 'call'
    },
    stage: 'Qualified',
    assigned_to: 'CP-002 (Pune Industrial Belt)',
    ai_active: true,
    unreplied_hours: 7,
    created_at: '2026-09-19T11:20:00Z',
    updated_at: '2026-09-19T13:40:00Z'
  },
  {
    id: 'lead-013',
    whatsapp_number: '+91 98455 77810',
    name: 'Tarun Kapoor',
    company: 'Elite Motors BMW & Audi Gallery',
    campaign: 'Google Ads - Premium Showroom Flooring',
    language: 'English',
    status: 'Qualified',
    funnel: 'HOT',
    score: 85,
    confidence: 0.92,
    product: 'Epoxy Matt Finish Flooring',
    reason: 'Ultra-luxury car showroom needs seamless, scratch-resistant matt finish epoxy flooring with zero glare for showroom spotlighting.',
    score_breakdown: {
      fit: 27,
      opportunity: 22,
      intent: 18,
      urgency: 11,
      completeness: 7
    },
    location: {
      address: 'Indiranagar 100ft Road, Bengaluru',
      maps_link: 'https://maps.google.com/?q=12.9784,77.6408',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 5000
    },
    flooring_category: 'Commercial & Terrace',
    flooring_area: {
      category: 'Commercial & Terrace',
      sub_type: 'Showrooms, Retail Stores & Corporate Lounges',
      source_message: 'Seamless elegant matt finish epoxy for our new premium car showroom',
      confidence: 0.95,
      extracted_at: 'Oct 06'
    },
    fields: [
      { key: 'Product Required', value: 'Epoxy Matt Finish Flooring', confidence: 0.96, source_message: 'Seamless elegant matt finish epoxy for our new premium car showroom', timestamp: 'Oct 06' },
      { key: 'Surface Sheen', value: 'Low Gloss Matt Finish (Anti-Glare)', confidence: 0.94, source_message: 'Zero glare needed under studio spotlighting', timestamp: 'Oct 06' },
      { key: 'Project Area', value: '5,000 sq ft Showroom & Display Area', confidence: 0.95, source_message: 'Showroom size 5000 sq ft', timestamp: 'Oct 06' }
    ],
    next_action: {
      title: 'Present Physical Mockup Sample Tile',
      description: 'Show executive Matt finish physical 30cmx30cm sample tile in Anthracite Grey RAL 7016.',
      due_date: 'Tomorrow, 4:00 PM',
      type: 'visit'
    },
    stage: 'Visit',
    assigned_to: 'CP-003 (Nashik-Malegaon)',
    ai_active: true,
    unreplied_hours: 2,
    created_at: '2026-09-14T15:00:00Z',
    updated_at: '2026-09-15T11:00:00Z'
  },
  {
    id: 'lead-014',
    whatsapp_number: '+91 97390 11984',
    name: 'Deepak Choudhury',
    company: 'BioPharma Formulations Pvt Ltd',
    campaign: 'LinkedIn - Cleanroom Wall-to-Floor Coving',
    language: 'English',
    status: 'Qualified',
    funnel: 'HOT',
    score: 87,
    confidence: 0.94,
    product: 'Coving',
    reason: 'Sterile formulation facility requires 50mm radius seamless epoxy cove base joints between walls and floors for high washdown microbiological compliance.',
    score_breakdown: {
      fit: 29,
      opportunity: 21,
      intent: 18,
      urgency: 12,
      completeness: 7
    },
    location: {
      address: 'Bommasandra Industrial Area, Phase 4, Bengaluru',
      maps_link: 'https://maps.google.com/?q=12.8150,77.6890',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 3200
    },
    flooring_category: 'Pharma & Cleanroom',
    flooring_area: {
      category: 'Pharma & Cleanroom',
      sub_type: 'Food Plants, Pharma Units & Cleanroom Corners',
      source_message: 'Epoxy coving radius 50mm around all cleanroom wall corners',
      confidence: 0.96,
      extracted_at: 'Oct 05'
    },
    fields: [
      { key: 'Product Required', value: 'Coving (Epoxy Cove Base)', confidence: 0.97, source_message: 'Epoxy coving radius 50mm around all cleanroom wall corners', timestamp: 'Oct 05' },
      { key: 'Radius Dimension', value: '50mm Radius Curved Mortar Coving', confidence: 0.95, source_message: 'Need 50mm radius cove base to avoid dust accumulation', timestamp: 'Oct 05' },
      { key: 'Linear Coverage', value: '450 Linear Meters', confidence: 0.91, source_message: 'Approximately 450 meters total perimeter', timestamp: 'Oct 05' }
    ],
    next_action: {
      title: 'Send Coving Installation Detail Drawing',
      description: 'Share standard detail cross-section DWG/PDF for wall-to-floor curved coving joint.',
      due_date: 'Today, 5:30 PM',
      type: 'quote'
    },
    stage: 'Quote',
    assigned_to: 'CP-002 (Pune Industrial Belt)',
    ai_active: true,
    unreplied_hours: 4,
    created_at: '2026-09-08T13:30:00Z',
    updated_at: '2026-09-09T10:00:00Z'
  },
  {
    id: 'lead-015',
    whatsapp_number: '+91 98451 99201',
    name: 'Balaji Minerals & Fertilizers',
    company: 'Coromandel Bulk Fertilizer Terminal',
    campaign: 'Google Ads - Outdoor Heavy PU Coating',
    language: 'English/Kannada',
    status: 'Qualified',
    funnel: 'WARM',
    score: 75,
    confidence: 0.91,
    product: 'Polyurethane Coating',
    reason: 'Fertilizer bulk storage bays and outdoor loading yard subject to harsh UV rays and chemical salts require aliphatic polyurethane coating.',
    score_breakdown: {
      fit: 26,
      opportunity: 20,
      intent: 15,
      urgency: 8,
      completeness: 6
    },
    location: {
      address: 'Bulk Cargo Terminal, Old Port Road, Mangaluru',
      maps_link: 'https://maps.google.com/?q=12.8680,74.8390',
      city: 'Mangaluru',
      state: 'Karnataka',
      area_sqft: 18000
    },
    flooring_category: 'Factory & Industrial',
    flooring_area: {
      category: 'Factory & Industrial',
      sub_type: 'Outdoor Yards, Fertilizer Plants & Bulk Storage',
      source_message: 'Outdoor fertilizer loading yard and bulk storage 18000 sqft',
      confidence: 0.93,
      extracted_at: 'Oct 05'
    },
    fields: [
      { key: 'Product Required', value: 'Polyurethane Coating', confidence: 0.95, source_message: 'Outdoor fertilizer loading yard and bulk storage 18000 sqft', timestamp: 'Oct 05' },
      { key: 'UV Stability', value: '100% Aliphatic UV Resistant PU', confidence: 0.92, source_message: 'Full sunlight outdoor exposure', timestamp: 'Oct 05' },
      { key: 'Project Area', value: '18,000 sq ft Outdoor Yard', confidence: 0.94, source_message: 'Area 18000 sqft', timestamp: 'Oct 05' }
    ],
    next_action: {
      title: 'Send UV Stability & Weathering Report',
      description: 'Provide QUV accelerated weathering test data for ColourPlus PU system.',
      due_date: 'Oct 16, 2026',
      type: 'quote'
    },
    stage: 'Qualified',
    assigned_to: 'CP-001 (Mumbai Metro)',
    ai_active: true,
    unreplied_hours: 9,
    created_at: '2026-08-26T16:00:00Z',
    updated_at: '2026-08-27T14:00:00Z'
  },
  {
    id: 'lead-016',
    whatsapp_number: '+91 99003 44552',
    name: 'Sanjeev Goel',
    company: 'Goel Commercial Real Estate Developers',
    campaign: 'Meta Ads - Subfloor Leveling Screed',
    language: 'English/Hindi',
    status: 'Qualified',
    funnel: 'WARM',
    score: 72,
    confidence: 0.89,
    product: 'Cementitious Underlay',
    reason: 'Commercial renovation project with heavily undulated, uneven subfloor requiring fast-setting self-leveling cementitious underlayment before vinyl/epoxy finish.',
    score_breakdown: {
      fit: 24,
      opportunity: 20,
      intent: 14,
      urgency: 8,
      completeness: 6
    },
    location: {
      address: 'Commercial Hub, Brigade Road, Bengaluru',
      maps_link: 'https://maps.google.com/?q=12.9720,77.6080',
      city: 'Bengaluru',
      state: 'Karnataka',
      area_sqft: 11000
    },
    flooring_category: 'Commercial & Terrace',
    flooring_area: {
      category: 'Commercial & Terrace',
      sub_type: 'Uneven Subfloors & Renovation Base Leveling',
      source_message: 'Uneven subfloor needing fast self-leveling cementitious screed 11000 sqft',
      confidence: 0.92,
      extracted_at: 'Oct 06'
    },
    fields: [
      { key: 'Product Required', value: 'Cementitious Underlay', confidence: 0.94, source_message: 'Uneven subfloor needing fast self-leveling cementitious screed 11000 sqft', timestamp: 'Oct 06' },
      { key: 'Thickness Required', value: '8mm - 12mm Self-Leveling Screed', confidence: 0.90, source_message: 'Average 10mm variation across old concrete', timestamp: 'Oct 06' },
      { key: 'Project Area', value: '11,000 sq ft', confidence: 0.93, source_message: 'Total 11000 sq ft floor space', timestamp: 'Oct 06' }
    ],
    next_action: {
      title: 'Schedule Laser Level Survey',
      description: 'Site engineer to conduct laser level survey across floors to compute exact bag yield required.',
      due_date: 'Tomorrow, 10:00 AM',
      type: 'visit'
    },
    stage: 'Visit',
    assigned_to: 'CP-003 (Nashik-Malegaon)',
    ai_active: true,
    unreplied_hours: 6,
    created_at: '2026-08-15T11:45:00Z',
    updated_at: '2026-08-16T09:20:00Z'
  }
];
