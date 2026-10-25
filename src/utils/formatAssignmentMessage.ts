import type { Lead, ChannelPartner } from '../types/crm';

/**
 * Generates a clean, professional, fully-formatted lead handoff message
 * for WhatsApp and Email containing:
 * - Lead Name
 * - Company Name
 * - Phone / WhatsApp Number
 * - Location Details (Address, City, State, Sq Ft area, Google Maps Link)
 * - Extracted Data fields from WhatsApp chat
 * - Qualification Score & Funnel
 * - Next Recommended Action
 * - Representative contact info (Name, Role, Email, WhatsApp)
 */
export function formatLeadAssignmentMessage(
  lead: Lead,
  partner?: ChannelPartner | null,
  assigneeNameFallback?: string
): string {
  const repName = partner?.name || assigneeNameFallback || lead.assigned_to || 'Assigned Representative';
  const repRole = partner?.role || 'Sales Representative';
  const repEmail = partner?.email || 'N/A';
  const repPhone = partner?.whatsapp_number || 'N/A';

  const locAddress = lead.location?.address || 'Address not specified';
  const locCityState = [lead.location?.city, lead.location?.state].filter(Boolean).join(', ') || 'N/A';
  const locSqft = lead.location?.area_sqft
    ? `${lead.location.area_sqft.toLocaleString()} sq ft`
    : 'Not specified';
  const locMaps = lead.location?.maps_link || 'N/A';

  // Format extracted fields list
  const extractedList =
    lead.fields && lead.fields.length > 0
      ? lead.fields.map((f) => `  • *${f.key}:* ${f.value}`).join('\n')
      : '  • No specific technical fields extracted yet.';

  const timestampStr = new Date().toLocaleString([], {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const flooringAreaStr = lead.flooring_category
    ? `${lead.flooring_category}${lead.flooring_area?.sub_type ? ` (${lead.flooring_area.sub_type})` : ''}`
    : 'General Industrial';
  const flooringSourceStr = lead.flooring_area?.source_message
    ? `  • *Detected From Chat:* "${lead.flooring_area.source_message}"`
    : '';

  return `🚨 *NEW LEAD ASSIGNED TO YOU* 🚨
----------------------------------------
👤 *LEAD NAME:* ${lead.name}
🏢 *COMPANY:* ${lead.company}
📞 *PHONE / WHATSAPP:* ${lead.whatsapp_number}
📊 *QUALIFICATION SCORE:* ${lead.score}/100 [${lead.funnel} Lead]

🏗️ *FLOORING AREA & FACILITY SECTOR:*
  • *Category:* ${flooringAreaStr}
${flooringSourceStr ? flooringSourceStr + '\n' : ''}
📍 *LOCATION & SITE DETAILS:*
  • *Address:* ${locAddress}
  • *City / Region:* ${locCityState}
  • *Project Area:* ${locSqft}
  • *Google Maps Location:* ${locMaps}

🔍 *EXTRACTED DATA FROM CONVERSATION:*
${extractedList}

🎯 *RECOMMENDED NEXT ACTION:*
  • *Title:* ${lead.next_action?.title || 'Initial Contact'}
  • *Details:* ${lead.next_action?.description || 'Reach out to customer to confirm site requirements'}
  • *Due:* ${lead.next_action?.due_date || 'ASAP'}

👨‍💼 *ASSIGNED REPRESENTATIVE DETAILS:*
  • *Name:* ${repName} (${repRole})
  • *WhatsApp Alert:* ${repPhone}
  • *Email Notification:* ${repEmail}

⏰ *Assigned At:* ${timestampStr}
----------------------------------------
*ColourPlus Polyurethanes Lead Desk System*`;
}
