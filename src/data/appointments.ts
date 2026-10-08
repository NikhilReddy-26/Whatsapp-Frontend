import { Appointment } from '../types/crm';

export const initialAppointments: Appointment[] = [
  {
    id: 'app-001',
    lead_id: 'lead-001',
    lead_name: 'Ramesh Kumar',
    company: 'SK Industrial Solutions Pvt. Ltd.',
    date: '2026-10-07',
    time: '04:00 PM',
    location: 'Plot 42, Phase II, Hosur Industrial Complex, Hosur',
    engineer: 'Vikram Mehta (Senior Sales Manager)',
    status: 'scheduled',
    notes: 'Conduct concrete slab moisture test and Elcometer substrate hardness check.'
  },
  {
    id: 'app-002',
    lead_id: 'lead-002',
    lead_name: 'Dr. Priya Sharma',
    company: 'Apex Pharma Labs Ltd.',
    date: '2026-10-08',
    time: '11:30 AM',
    location: 'Peenya Industrial Area Phase 3, Bengaluru',
    engineer: 'Ananya Roy (Key Accounts)',
    status: 'scheduled',
    notes: 'Verify coving radius and cleanroom floor junction layout ahead of WHO-GMP audit.'
  },
  {
    id: 'app-003',
    lead_id: 'lead-006',
    lead_name: 'Rajesh Nair',
    company: 'Kerala Marine Processing Ltd.',
    date: '2026-10-10',
    time: '10:00 AM',
    location: 'Baikampady Industrial Area, Mangaluru Port',
    engineer: 'Vikram Mehta (Senior Sales Manager)',
    status: 'scheduled',
    notes: 'Sub-zero freezer floor inspection and expansion joint mapping.'
  }
];
