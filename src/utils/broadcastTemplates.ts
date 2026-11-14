import type { WhatsAppTemplate } from '../types/broadcast';

/** Lead fields a template placeholder can be mapped to (same set as the Streamlit dashboard). */
export const LEAD_FIELD_CHOICES: { key: string; label: string; sample: string }[] = [
  { key: 'full_name', label: 'Lead full name', sample: 'Karthik' },
  { key: 'project_city', label: 'Project city', sample: 'Bengaluru' },
  { key: 'industry', label: 'Industry', sample: 'Commercial Flooring' },
  { key: 'project_type', label: 'Project type', sample: 'Epoxy PU Flooring' },
  { key: 'project_area', label: 'Project area', sample: '2500 sq ft' },
  { key: 'project_start_timeline', label: 'Timeline', sample: 'Immediate' },
  { key: 'project_role', label: 'Role', sample: 'Decision Maker' },
  { key: 'phone_e164', label: 'Phone number', sample: '+917892707563' },
];

/** Number of {{n}} placeholders: the larger of Meta's count and what the body text actually uses. */
export function countPlaceholders(template: Pick<WhatsAppTemplate, 'body_text' | 'variable_count'>): number {
  const used = new Set(Array.from(template.body_text.matchAll(/\{\{(\d+)\}\}/g), (m) => Number(m[1])));
  const highest = used.size ? Math.max(...used) : 0;
  return Math.max(template.variable_count || 0, highest);
}

/** Default mapping: placeholder i uses the i-th field, clamped to the last field. */
export function defaultMappings(count: number): string[] {
  return Array.from({ length: count }, (_, i) => LEAD_FIELD_CHOICES[Math.min(i, LEAD_FIELD_CHOICES.length - 1)].key);
}

/** Renders the template body with sample lead values so the operator can preview the message. */
export function renderSample(body: string, mappings: string[]): string {
  return mappings.reduce((text, fieldKey, i) => {
    const sample = LEAD_FIELD_CHOICES.find((f) => f.key === fieldKey)?.sample ?? `[${fieldKey}]`;
    return text.split(`{{${i + 1}}}`).join(sample);
  }, body);
}
