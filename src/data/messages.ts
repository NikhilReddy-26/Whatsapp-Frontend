import { Message } from '../types/crm';

export const initialMessages: Record<string, Message[]> = {
  // --- REAL BACKEND SAMPLE LEADS ---
  '6f28f3a9-2ecd-43b0-814b-389cc4e679a8': [
    {
      id: 'm-esd-1',
      lead_id: '6f28f3a9-2ecd-43b0-814b-389cc4e679a8',
      sender: 'customer',
      text: 'Need ESD antistatic floor coating for mobile robotics line in Bengaluru. Surface resistivity must be ANSI/ESD S20.20 certified (10^6 to 10^9 ohms). Area is 8,200 sq ft.',
      type: 'text',
      timestamp: '09:20 AM',
    },
    {
      id: 'm-esd-2',
      lead_id: '6f28f3a9-2ecd-43b0-814b-389cc4e679a8',
      sender: 'ai',
      text: 'Hello Arun! ColourPlus provides ANSI/ESD S20.20 certified ESD Epoxy Flooring with conductive copper grid grounding. Could you share your site location and target handover date?',
      type: 'text',
      timestamp: '09:22 AM',
    },
    {
      id: 'm-esd-3',
      lead_id: '6f28f3a9-2ecd-43b0-814b-389cc4e679a8',
      sender: 'customer',
      text: '📍 Dropped Pin: ITPL Main Road, Bengaluru, Karnataka (12.9850° N, 77.7300° E). Need completion within 7 days for mobile robotics assembly line.',
      type: 'location',
      location_data: {
        name: 'NexGen Robotics & PCB Site',
        address: 'ITPL Main Road, Bengaluru, Karnataka',
        maps_url: 'https://maps.google.com/?q=12.9850,77.7300',
        lat: 12.985,
        lng: 77.73,
      },
      timestamp: '09:24 AM',
    },
    {
      id: 'm-esd-4',
      lead_id: '6f28f3a9-2ecd-43b0-814b-389cc4e679a8',
      sender: 'system',
      text: 'SILENTLY EXTRACTED INTELLIGENCE',
      type: 'system_note',
      timestamp: '09:25 AM',
      extracted_chips: [
        { label: 'Product Required', value: 'ESD Coating Flooring' },
        { label: 'Flooring Area Type', value: 'Factory & Industrial' },
        { label: 'Project Area', value: '8,200 sq ft' },
        { label: 'Target Timeline', value: 'Within 7 Days' },
        { label: 'Territory Partner', value: 'CP-029 (Bengaluru Metro)' },
      ],
    },
    {
      id: 'm-esd-5',
      lead_id: '6f28f3a9-2ecd-43b0-814b-389cc4e679a8',
      sender: 'ai',
      text: 'Thank you Arun. Your site on ITPL Main Road is mapped to CP-029 (Bengaluru Metro). Our technical engineer will perform a substrate surface resistivity and moisture evaluation.',
      type: 'text',
      timestamp: '09:26 AM',
    },
    {
      id: 'm-esd-6',
      lead_id: '6f28f3a9-2ecd-43b0-814b-389cc4e679a8',
      sender: 'customer',
      text: 'Confirmed. Site visit scheduled for tomorrow morning.',
      type: 'text',
      timestamp: '10:06 AM',
    },
  ],

  '2c29e84d-41a6-4777-b042-2e3d44d8ab3f': [
    {
      id: 'm-epu-1',
      lead_id: '2c29e84d-41a6-4777-b042-2e3d44d8ab3f',
      sender: 'customer',
      text: 'Automobile workshop bay and service station 12000 sqft in Peenya 3rd Phase. High wheel-load resistance and oil spillage tolerance needed for heavy commercial vehicles.',
      type: 'text',
      timestamp: '09:18 AM',
    },
    {
      id: 'm-epu-2',
      lead_id: '2c29e84d-41a6-4777-b042-2e3d44d8ab3f',
      sender: 'ai',
      text: 'Hello! For automobile workshops with heavy wheel load and grease spillage, ColourPlus Epoxy Polyurethane (EPU) Coating provides exceptional toughness and chemical resistance. Target timeline?',
      type: 'text',
      timestamp: '09:20 AM',
    },
    {
      id: 'm-epu-3',
      lead_id: '2c29e84d-41a6-4777-b042-2e3d44d8ab3f',
      sender: 'customer',
      text: 'Within 15 Days. Address: Peenya 3rd Phase, Bengaluru, Karnataka.',
      type: 'text',
      timestamp: '09:23 AM',
    },
    {
      id: 'm-epu-4',
      lead_id: '2c29e84d-41a6-4777-b042-2e3d44d8ab3f',
      sender: 'system',
      text: 'SILENTLY EXTRACTED INTELLIGENCE',
      type: 'system_note',
      timestamp: '09:24 AM',
      extracted_chips: [
        { label: 'Product Required', value: 'Epoxy Polyurethane (EPU)' },
        { label: 'Flooring Area Type', value: 'Automobile & Garages' },
        { label: 'Project Area', value: '12,000 sq ft' },
        { label: 'Target Timeline', value: 'Within 15 Days' },
      ],
    },
  ],

  'c93e94ea-9dbf-456a-9cf6-7f43d8b27cf8': [
    {
      id: 'm-poly-1',
      lead_id: 'c93e94ea-9dbf-456a-9cf6-7f43d8b27cf8',
      sender: 'customer',
      text: 'Cold storage processing hall 5500 sqft in Baikampady Industrial Area, Mangaluru. Sub-zero thermal shock flooring required for seafood blast freezing.',
      type: 'text',
      timestamp: '09:15 AM',
    },
    {
      id: 'm-poly-2',
      lead_id: 'c93e94ea-9dbf-456a-9cf6-7f43d8b27cf8',
      sender: 'ai',
      text: 'Hello Rajesh! For seafood blast freezers and sub-zero thermal cycling, ColourPlus Polycrete Flooring withstands -40°C to +120°C and frequent steam washdowns. Timeline required?',
      type: 'text',
      timestamp: '09:18 AM',
    },
    {
      id: 'm-poly-3',
      lead_id: 'c93e94ea-9dbf-456a-9cf6-7f43d8b27cf8',
      sender: 'customer',
      text: 'Within 30 Days before fishing season begins.',
      type: 'text',
      timestamp: '09:22 AM',
    },
  ],

  'cc7ff284-f386-443f-95b7-b82f2179a55b': [
    {
      id: 'm-water-1',
      lead_id: 'cc7ff284-f386-443f-95b7-b82f2179a55b',
      sender: 'customer',
      text: 'Terrace size around 8000 sq ft on Whitefield Main Road. Commercial rooftop terrace slab waterproofing required before monsoon.',
      type: 'text',
      timestamp: '09:10 AM',
    },
    {
      id: 'm-water-2',
      lead_id: 'cc7ff284-f386-443f-95b7-b82f2179a55b',
      sender: 'ai',
      text: 'Hello Anand! ColourPlus OEM Waterproofing systems provide seamless UV-resistant elastomeric membrane coating with ponding water tolerance and 10-year warranty.',
      type: 'text',
      timestamp: '09:12 AM',
    },
    {
      id: 'm-water-3',
      lead_id: 'cc7ff284-f386-443f-95b7-b82f2179a55b',
      sender: 'customer',
      text: 'Need installation completed within 20 Days.',
      type: 'text',
      timestamp: '09:15 AM',
    },
  ],

  'd4c84156-9943-42af-96fd-ba317b610f4c': [
    {
      id: 'm-pharma-1',
      lead_id: 'd4c84156-9943-42af-96fd-ba317b610f4c',
      sender: 'customer',
      text: 'Cleanroom area 6500 sqft in Electronic City Phase 1. Cleanroom class 10000 compliance required. Pharma audit scheduled next month.',
      type: 'text',
      timestamp: '09:05 AM',
    },
    {
      id: 'm-pharma-2',
      lead_id: 'd4c84156-9943-42af-96fd-ba317b610f4c',
      sender: 'ai',
      text: 'Hello Dr. Priya Sharma! ColourPlus Epoxy Self-Leveling – Matt provides coved, seamless, anti-microbial finish meeting US-FDA and Class 10,000 cleanroom standards.',
      type: 'text',
      timestamp: '09:08 AM',
    },
    {
      id: 'm-pharma-3',
      lead_id: 'd4c84156-9943-42af-96fd-ba317b610f4c',
      sender: 'customer',
      text: 'Target timeline is within 14 Days. Please send certified TDS package and quotation.',
      type: 'text',
      timestamp: '09:12 AM',
    },
  ],

  '5ad34f05-868e-4357-a18e-9ded252afd5f': [
    {
      id: 'm-cnc-1',
      lead_id: '5ad34f05-868e-4357-a18e-9ded252afd5f',
      sender: 'customer',
      text: 'Factory floor for CNC machinery. 15,000 sq ft in Plot 42, Phase II, Hosur Industrial Complex. High immediate intent, budget pre-approved.',
      type: 'text',
      timestamp: '09:00 AM',
    },
    {
      id: 'm-cnc-2',
      lead_id: '5ad34f05-868e-4357-a18e-9ded252afd5f',
      sender: 'ai',
      text: 'Hello Ramesh! ColourPlus High-Build Epoxy Mortar is specifically formulated for heavy CNC machine manufacturing plants with high impact and point-load resistance.',
      type: 'text',
      timestamp: '09:04 AM',
    },
    {
      id: 'm-cnc-3',
      lead_id: '5ad34f05-868e-4357-a18e-9ded252afd5f',
      sender: 'customer',
      text: 'Floor is new concrete slab (M30 grade). Target timeline within 10 days.',
      type: 'text',
      timestamp: '09:08 AM',
    },
    {
      id: 'm-cnc-4',
      lead_id: '5ad34f05-868e-4357-a18e-9ded252afd5f',
      sender: 'system',
      text: 'SILENTLY EXTRACTED INTELLIGENCE',
      type: 'system_note',
      timestamp: '09:10 AM',
      extracted_chips: [
        { label: 'Product Required', value: 'High-Build Epoxy Mortar' },
        { label: 'Flooring Area Type', value: 'Factory & Industrial (CNC Plant)' },
        { label: 'Project Area', value: '15,000 sq ft' },
        { label: 'Floor Condition', value: 'New Concrete Slab (M30 grade)' },
        { label: 'Target Timeline', value: 'Within 10 Days' },
        { label: 'Matched Partner', value: 'CP-026 (Northern TN Industrial)' },
      ],
    },
  ],
  'lead-001': [
    {
      id: 'm-101',
      lead_id: 'lead-001',
      sender: 'ai',
      text: 'Understood. For heavy forklift shear and chemical exposure, our 4mm Heavy-Duty Polyurethane Screed or 3mm Chemical-Resistant Epoxy is recommended. And where exactly is the facility located? You can either type the address or share the location pin here.',
      type: 'text',
      timestamp: '10:16 AM',
      pacing_delay: '12s'
    },
    {
      id: 'm-102',
      lead_id: 'lead-001',
      sender: 'customer',
      text: '📍 Dropped Pin: Plot 48/B, 2nd Phase, Peenya Industrial Area, Bengaluru 560058 (13.0312° N, 77.5186° E). Factory floor for CNC machinery.',
      type: 'location',
      location_data: {
        name: 'SK Industrial Site - Peenya Phase 2',
        address: 'Plot 48/B, 2nd Phase, Peenya Industrial Area, Bengaluru 560058',
        maps_url: 'https://maps.google.com/?q=13.0312,77.5186',
        lat: 13.0312,
        lng: 77.5186
      },
      timestamp: '10:17 AM'
    },
    {
      id: 'm-103',
      lead_id: 'lead-001',
      sender: 'system',
      text: 'SILENTLY EXTRACTED FROM WHATSAPP',
      type: 'system_note',
      timestamp: '10:17 AM',
      extracted_chips: [
        { label: 'Flooring Area', value: 'Factory & Industrial' },
        { label: 'Facility Type', value: 'Heavy CNC Machine Shop Floor' },
        { label: 'Exact Address', value: 'Plot 48/B, 2nd Phase, Peenya Industrial Area' },
        { label: 'Coordinates', value: '13.0312, 77.5186' }
      ]
    },
    {
      id: 'm-104',
      lead_id: 'lead-001',
      sender: 'ai',
      text: 'Perfect! Would next Wednesday afternoon around 3:00 PM work for our technical engineer to perform a free substrate moisture audit?',
      type: 'text',
      timestamp: '10:17 AM',
      pacing_delay: '6s'
    },
    {
      id: 'm-105',
      lead_id: 'lead-001',
      sender: 'customer',
      text: 'Yes, 14 Oct at 3:00 PM works.',
      type: 'text',
      timestamp: '10:18 AM'
    },
    {
      id: 'm-106',
      lead_id: 'lead-001',
      sender: 'system',
      text: 'SILENTLY EXTRACTED',
      type: 'system_note',
      timestamp: '10:18 AM',
      extracted_chips: [
        { label: 'Appointment Confirmed', value: '14 Oct 2026, 3:00 PM' },
        { label: 'AI Qualification', value: 'HOT (15,000 sq.ft + Forklift + Chemicals + <30 days)' }
      ]
    }
  ],

  'lead-002': [
    {
      id: 'm-201',
      lead_id: 'lead-002',
      sender: 'customer',
      text: 'Hello, we require seamless anti-static antibacterial PU screed flooring for our 6,500 sq ft pharma cleanroom in Peenya Phase 3. We have a WHO-GMP audit scheduled next week.',
      type: 'text',
      timestamp: '09:05 AM'
    },
    {
      id: 'm-202',
      lead_id: 'lead-002',
      sender: 'system',
      text: '🌐 System: Language detected as English. Flooring Area classified from WhatsApp conversation: Pharma & Cleanroom (WHO-GMP Sterile Lab).',
      type: 'system_note',
      timestamp: '09:05 AM',
      extracted_chips: [
        { label: 'Flooring Area', value: 'Pharma & Cleanroom' },
        { label: 'Cleanroom Area', value: '6,500 sq ft' },
        { label: 'Compliance', value: 'WHO-GMP & USFDA' }
      ]
    },
    {
      id: 'm-203',
      lead_id: 'lead-002',
      sender: 'ai',
      text: 'Hello Dr. Priya! ColourPlus specializes in WHO-GMP & USFDA compliant coved PU screed systems. We can meet your audit deadline with our fast-cure antimicrobial PU screed.\n\nAre you washing the cleanroom with aggressive solvents or acids during sanitization?',
      type: 'text',
      timestamp: '09:07 AM'
    },
    {
      id: 'm-204',
      lead_id: 'lead-002',
      sender: 'customer',
      text: 'Yes, daily cleaning with Isopropyl Alcohol (IPA) and 5% Peracetic acid. Need certified TDS documents today for management sign-off.',
      type: 'text',
      timestamp: '09:10 AM'
    },
    {
      id: 'm-205',
      lead_id: 'lead-002',
      sender: 'ai',
      text: 'Understood. ColourPlus CleanFloor PU-300 has full chemical resistance certificates against IPA and Peracetic acid. I am compiling the certified TDS package and quotation for 6,500 sq ft now.',
      type: 'text',
      timestamp: '09:12 AM'
    },
    {
      id: 'm-206',
      lead_id: 'lead-002',
      sender: 'system',
      text: '📌 System Note: Technical Data Sheet & Quotation pre-generated by AI. Pending sales approval.',
      type: 'system_note',
      timestamp: '09:15 AM'
    }
  ],

  'lead-003': [
    {
      id: 'm-301',
      lead_id: 'lead-003',
      sender: 'customer',
      text: 'Hi, we are facing rain water leakage in our 8,000 sq ft commercial building terrace in Whitefield. Do you provide 10-year warranty PU liquid waterproofing?',
      type: 'text',
      timestamp: 'Yesterday 02:20 PM'
    },
    {
      id: 'm-301b',
      lead_id: 'lead-003',
      sender: 'system',
      text: '🔍 Extracted from WhatsApp: Flooring Area classified as Commercial & Terrace.',
      type: 'system_note',
      timestamp: 'Yesterday 02:21 PM',
      extracted_chips: [
        { label: 'Flooring Area', value: 'Commercial & Terrace' },
        { label: 'Application', value: 'Roof Terrace Waterproofing' }
      ]
    },
    {
      id: 'm-302',
      lead_id: 'lead-003',
      sender: 'ai',
      text: 'Hello Anand! Yes, ColourPlus Polyurea & Elastomeric PU membranes come with up to a 10-year anti-seepage warranty.\n\nIs there existing china mosaic tile or old bitumous membrane on the terrace right now?',
      type: 'text',
      timestamp: 'Yesterday 02:22 PM'
    },
    {
      id: 'm-303',
      lead_id: 'lead-003',
      sender: 'customer',
      text: 'Existing china mosaic with some cracks. We plan to do site visit in 2 weeks once monsoon clears up.',
      type: 'text',
      timestamp: 'Yesterday 02:40 PM'
    },
    {
      id: 'm-304',
      lead_id: 'lead-003',
      sender: 'ai',
      text: 'Great! We can apply our ColourPlus Polycoat primer directly over prepared china mosaic. I have logged your request for a site visit in 2 weeks. Our executive will reach out to confirm exact date.',
      type: 'text',
      timestamp: 'Yesterday 02:42 PM'
    }
  ],

  'lead-004': [
    {
      id: 'm-401',
      lead_id: 'lead-004',
      sender: 'customer',
      text: 'Hello, what is the cost of dust-proofing 40,000 sq ft warehouse concrete floor in Electronic City logistics park?',
      type: 'text',
      timestamp: '2 days ago'
    },
    {
      id: 'm-401b',
      lead_id: 'lead-004',
      sender: 'system',
      text: '🔍 Extracted from WhatsApp: Flooring Area classified as Warehouse & Logistics.',
      type: 'system_note',
      timestamp: '2 days ago',
      extracted_chips: [
        { label: 'Flooring Area', value: 'Warehouse & Logistics' },
        { label: 'Volume', value: '40,000 sq ft' }
      ]
    },
    {
      id: 'm-402',
      lead_id: 'lead-004',
      sender: 'ai',
      text: 'Hello Sunita! For 40,000 sq ft logistics warehouses, lithium silicate concrete hardeners range between ₹ 18 to ₹ 35 per sq ft depending on slab porosity. Are you looking to execute this immediately?',
      type: 'text',
      timestamp: '2 days ago'
    },
    {
      id: 'm-403',
      lead_id: 'lead-004',
      sender: 'customer',
      text: 'We are preparing budget proposal for board approval in Q4 (Nov/Dec). Will get back then.',
      type: 'text',
      timestamp: '2 days ago'
    },
    {
      id: 'm-404',
      lead_id: 'lead-004',
      sender: 'system',
      text: '🌱 System Note: Categorized as NURTURE (Score 42/100). Next follow-up automated for Q4 budget review.',
      type: 'system_note',
      timestamp: '2 days ago'
    }
  ],

  'lead-005': [
    {
      id: 'm-501',
      lead_id: 'lead-005',
      sender: 'customer',
      text: 'Namaskara sir, nivu bedroom wall paint madtira? Eradu room paint bekittu Mysuru nalli house bedroom. Also namma RCB match ticket yavaga ide?',
      type: 'text',
      timestamp: 'Oct 04, 04:45 PM'
    },
    {
      id: 'm-502',
      lead_id: 'lead-005',
      sender: 'system',
      text: '⚠️ System Flag: Intent evaluated as Household/Residential & Out-of-Scope. Score 12/100.',
      type: 'system_note',
      timestamp: 'Oct 04, 04:45 PM',
      extracted_chips: [
        { label: 'Flooring Area', value: 'Household & Residential' },
        { label: 'Scope Status', value: 'Out of Scope (Retail)' }
      ]
    },
    {
      id: 'm-503',
      lead_id: 'lead-005',
      sender: 'ai',
      text: 'Namaskara! ColourPlus Polyurethanes Pvt. Ltd. is an industrial heavy-duty flooring and commercial waterproofing manufacturer (B2B only). We do not manufacture residential wall paints or sell IPL tickets.\n\nFor residential paints, please contact local retail paint shops in Mysuru. Thank you!',
      type: 'text',
      timestamp: 'Oct 04, 04:46 PM'
    }
  ],

  'lead-006': [
    {
      id: 'm-601',
      lead_id: 'lead-006',
      sender: 'customer',
      text: 'Need heavy chemical and thermal shock resistant floor for seafood processing plant cold storage (-25°C) in Mangaluru port area. Area is 5,500 sq ft.',
      type: 'text',
      timestamp: 'Oct 03, 10:15 AM'
    },
    {
      id: 'm-601b',
      lead_id: 'lead-006',
      sender: 'system',
      text: '🔍 Extracted from WhatsApp: Flooring Area classified as Cold Storage & Food Processing.',
      type: 'system_note',
      timestamp: 'Oct 03, 10:16 AM',
      extracted_chips: [
        { label: 'Flooring Area', value: 'Cold Storage & Food' },
        { label: 'Temperature Spec', value: '-25°C Thermal Shock' }
      ]
    },
    {
      id: 'm-602',
      lead_id: 'lead-006',
      sender: 'ai',
      text: 'Hello Mr. Rajesh! Our ColourPlus Heavy Duty Polyurethane Screed (6mm) is engineered specifically for sub-zero marine cold storage (-40°C thermal shock tolerance) and organic acid resistance from seafood brine.\n\nWould you like our regional manager for coastal Karnataka to visit your plant?',
      type: 'text',
      timestamp: 'Oct 03, 10:18 AM'
    }
  ],

  'lead-007': [
    {
      id: 'm-701',
      lead_id: 'lead-007',
      sender: 'customer',
      text: 'Hi, we are setting up a multi-brand automobile service workshop bay and showroom in Peenya. Area is 12,000 sq ft. Vehicles leak oil, grease, brake fluid. Need high gloss anti-slip polyurethane floor.',
      type: 'text',
      timestamp: '11:30 AM'
    },
    {
      id: 'm-702',
      lead_id: 'lead-007',
      sender: 'system',
      text: '🔍 Extracted: Product = Epoxy Polyurethane (EPU) Coating, Area = Automobile & Garages.',
      type: 'system_note',
      timestamp: '11:31 AM',
      extracted_chips: [
        { label: 'Product', value: 'Epoxy Polyurethane (EPU) Coating' },
        { label: 'Flooring Area', value: 'Automobile & Garages' },
        { label: 'Requirement', value: 'Oil & Brake Fluid Resistance' },
        { label: 'Project Area', value: '12,000 sq ft' }
      ]
    },
    {
      id: 'm-703',
      lead_id: 'lead-007',
      sender: 'ai',
      text: 'Hello! For automotive workshops and service bays, ColourPlus EPU (Epoxy Polyurethane) coating provides zero oil absorption, hot tire pickup resistance, and easy cleaning.\n\nCan we schedule a site inspection tomorrow around 3:00 PM?',
      type: 'text',
      timestamp: '11:33 AM'
    }
  ],

  'lead-008': [
    {
      id: 'm-801',
      lead_id: 'lead-008',
      sender: 'customer',
      text: 'Hi ColourPlus, we are expanding our semiconductor and mobile robotics line in Electronic City. Need ESD antistatic floor coating for 8,200 sq ft. Surface resistance must be 10^6 to 10^9 ohms.',
      type: 'text',
      timestamp: '10:45 AM'
    },
    {
      id: 'm-802',
      lead_id: 'lead-008',
      sender: 'system',
      text: '🔍 Extracted: Product = ESD Coating Flooring, Compliance = ANSI/ESD S20.20.',
      type: 'system_note',
      timestamp: '10:46 AM',
      extracted_chips: [
        { label: 'Product', value: 'ESD Coating Flooring' },
        { label: 'Resistance', value: '10^6 - 10^9 Ohms' },
        { label: 'Project Area', value: '8,200 sq ft' }
      ]
    },
    {
      id: 'm-803',
      lead_id: 'lead-008',
      sender: 'ai',
      text: 'Hello Mr. Swaminathan! Our ColourPlus ESD Coating Flooring with conductive carbon black matrix and copper grounding grid strictly complies with ANSI/ESD S20.20 for sensitive robotics and SMT assembly.\n\nI will send our copper tape layout and technical data sheet right away.',
      type: 'text',
      timestamp: '10:48 AM'
    }
  ],

  'lead-009': [
    {
      id: 'm-901',
      lead_id: 'lead-009',
      sender: 'customer',
      text: 'Hello, looking for anti-skid coating for 4 basement parking ramps at our tech park on Outer Ring Road. Area is 14,000 sq ft. Cars slip when tires are wet during rain.',
      type: 'text',
      timestamp: 'Yesterday, 3:15 PM'
    },
    {
      id: 'm-902',
      lead_id: 'lead-009',
      sender: 'ai',
      text: 'Hello Meera! For vehicle ramps, ColourPlus Anti-Skid Coating Flooring with bauxite/quartz aggregate broadcast offers maximum tyre grip even under steep incline and wet conditions. We can visit tomorrow for a friction test.',
      type: 'text',
      timestamp: 'Yesterday, 3:20 PM'
    }
  ],

  'lead-010': [
    {
      id: 'm-1001',
      lead_id: 'lead-010',
      sender: 'customer',
      text: 'Namaste, we need 33kV dielectric insulation matting replacement for our Hosur electrical substation control room. 4,500 sq ft. Must be CPRI certified.',
      type: 'text',
      timestamp: 'Yesterday, 11:45 AM'
    },
    {
      id: 'm-1002',
      lead_id: 'lead-010',
      sender: 'ai',
      text: 'Namaste Mr. Deshmukh. ColourPlus Dielectric Insulation Flooring is tested up to 33kV breakdown voltage and eliminates seam degradation. We are dispatching the CPRI certificate copy now.',
      type: 'text',
      timestamp: 'Yesterday, 11:50 AM'
    }
  ],

  'lead-011': [
    {
      id: 'm-1101',
      lead_id: 'lead-011',
      sender: 'customer',
      text: 'Hi, we have severe marine saline spray and chemical corrosion on bund walls and pump bases at our Mangalore terminal. Need heavy anti-corrosive coating for 9,000 sq ft.',
      type: 'text',
      timestamp: 'Oct 05, 9:40 AM'
    },
    {
      id: 'm-1102',
      lead_id: 'lead-011',
      sender: 'ai',
      text: 'Hello Mr. Singhania! ColourPlus Anti-Corrosive Coating provides high cross-linked barrier protection against coastal chlorides, splash acid, and harsh industrial weathering.',
      type: 'text',
      timestamp: 'Oct 05, 9:45 AM'
    }
  ],

  'lead-012': [
    {
      id: 'm-1201',
      lead_id: 'lead-012',
      sender: 'customer',
      text: 'Need yellow forklift transit lines and white pedestrian zebra crossings for our 22,000 sq ft logistics hub in Nelamangala.',
      type: 'text',
      timestamp: 'Oct 04, 11:20 AM'
    },
    {
      id: 'm-1202',
      lead_id: 'lead-012',
      sender: 'ai',
      text: 'Hello Rohit! ColourPlus Marking (Yellow / White) uses rapid-curing, high-visibility polyurethane formulations with exceptional tire-wear resistance. Please share the CAD layout to estimate linear meters.',
      type: 'text',
      timestamp: 'Oct 04, 11:25 AM'
    }
  ],

  'lead-013': [
    {
      id: 'm-1301',
      lead_id: 'lead-013',
      sender: 'customer',
      text: 'Hi, opening a luxury car showroom on 100ft road Indiranagar. 5,000 sq ft. We want seamless elegant matt finish epoxy with zero reflection under studio lighting.',
      type: 'text',
      timestamp: 'Oct 06, 3:00 PM'
    },
    {
      id: 'm-1302',
      lead_id: 'lead-013',
      sender: 'ai',
      text: 'Hello Tarun! ColourPlus Epoxy Matt Finish Flooring is designed specifically for premium automotive showrooms and corporate lobbies. We have samples ready in RAL 7016 Anthracite Grey.',
      type: 'text',
      timestamp: 'Oct 06, 3:05 PM'
    }
  ],

  'lead-014': [
    {
      id: 'm-1401',
      lead_id: 'lead-014',
      sender: 'customer',
      text: 'Need 50mm radius epoxy coving along 450 meters of cleanroom wall perimeter at our Bommasandra sterile injectable unit.',
      type: 'text',
      timestamp: 'Oct 05, 1:30 PM'
    },
    {
      id: 'm-1402',
      lead_id: 'lead-014',
      sender: 'ai',
      text: 'Hello Deepak! ColourPlus Coving creates seamless curved transitions eliminating 90-degree dirt traps, fully meeting WHO-GMP cleanroom standards.',
      type: 'text',
      timestamp: 'Oct 05, 1:35 PM'
    }
  ],

  'lead-015': [
    {
      id: 'm-1501',
      lead_id: 'lead-015',
      sender: 'customer',
      text: 'Looking for 18,000 sq ft outdoor bulk fertilizer yard coating that will withstand full sunlight UV and chemical salt exposure.',
      type: 'text',
      timestamp: 'Oct 05, 4:00 PM'
    },
    {
      id: 'm-1502',
      lead_id: 'lead-015',
      sender: 'ai',
      text: 'Hello Balaji! ColourPlus Polyurethane Coating is 100% aliphatic UV-stable and resists yellowing and chemical attack in outdoor storage yards.',
      type: 'text',
      timestamp: 'Oct 05, 4:05 PM'
    }
  ],

  'lead-016': [
    {
      id: 'm-1601',
      lead_id: 'lead-016',
      sender: 'customer',
      text: 'We have 11,000 sq ft of uneven subfloor in Brigade Road renovation. Need fast-setting self leveling cementitious underlayment.',
      type: 'text',
      timestamp: 'Oct 06, 11:45 AM'
    },
    {
      id: 'm-1602',
      lead_id: 'lead-016',
      sender: 'ai',
      text: 'Hello Sanjeev! ColourPlus Cementitious Underlay cures quickly to a perfectly flat, compressive-strength base ready for epoxy or vinyl top finish.',
      type: 'text',
      timestamp: 'Oct 06, 11:50 AM'
    }
  ]
};

// Alias ref_no keys so message lookup succeeds by either UUID or user-visible ref_no
initialMessages['CP-000462'] = initialMessages['6f28f3a9-2ecd-43b0-814b-389cc4e679a8'];
initialMessages['CP-000461'] = initialMessages['2c29e84d-41a6-4777-b042-2e3d44d8ab3f'];
initialMessages['CP-000460'] = initialMessages['c93e94ea-9dbf-456a-9cf6-7f43d8b27cf8'];
initialMessages['CP-000459'] = initialMessages['cc7ff284-f386-443f-95b7-b82f2179a55b'];
initialMessages['CP-000458'] = initialMessages['d4c84156-9943-42af-96fd-ba317b610f4c'];
initialMessages['CP-000457'] = initialMessages['5ad34f05-868e-4357-a18e-9ded252afd5f'];
