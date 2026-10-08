import { Followup } from '../types/crm';

export const initialFollowups: Followup[] = [
  {
    id: 'fol-001',
    lead_id: 'lead-001',
    lead_name: 'Ramesh Kumar',
    title: 'Send formal quotation for 15,000 sq ft PU screed',
    due_date: 'Today, 6:00 PM',
    priority: 'high',
    status: 'pending',
    assigned_to: 'Vikram Mehta'
  },
  {
    id: 'fol-002',
    lead_id: 'lead-002',
    lead_name: 'Dr. Priya Sharma',
    title: 'Email WHO-GMP test certificates & IPA chemical resistance report',
    due_date: 'Today, 2:00 PM',
    priority: 'high',
    status: 'pending',
    assigned_to: 'Ananya Roy'
  },
  {
    id: 'fol-003',
    lead_id: 'lead-003',
    lead_name: 'Anand Vardhan',
    title: 'Pre-visit call to confirm terrace china mosaic slab strength',
    due_date: 'Tomorrow, 11:00 AM',
    priority: 'medium',
    status: 'pending',
    assigned_to: 'Suresh Patil'
  },
  {
    id: 'fol-004',
    lead_id: 'lead-004',
    lead_name: 'Sunita Reddy',
    title: 'Automated Q4 budget reminder for warehouse dust-proofing',
    due_date: 'Nov 01, 2026',
    priority: 'low',
    status: 'pending',
    assigned_to: 'AI Automated System'
  }
];
