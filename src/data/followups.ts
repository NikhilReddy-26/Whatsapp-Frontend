import type { FollowupBucket, FollowupCounts, FollowupItem } from '../types/crm';

// Demo data for VITE_USE_MOCK_API=true. Times are relative to "now" so the page always looks live.
const hoursAgo = (h: number) => new Date(Date.now() - h * 3_600_000).toISOString();
const hoursAhead = (h: number) => new Date(Date.now() + h * 3_600_000).toISOString();

const base = {
  band: 'WARM',
  bot_status: 'BOT_ACTIVE',
  needs_human: false,
  cancel_reason: '',
  last_error: '',
  opted_out: false,
  call_attempts: 0,
  last_outcome: '',
};

export const mockFollowupItems: FollowupItem[] = [
  {
    ...base,
    lead_id: 'mock-fu-1', ref_no: 'CP-000101', name: 'Ramesh Kumar', phone: '+919876500001', company: 'Kumar Pharma',
    city: 'Chennai', stage: 'QUALIFYING', assigned_to_name: '',
    bucket: 'SCHEDULED', kind: 'INCOMPLETE_INFO', status: 'SCHEDULED', message: '',
    missing_fields: ['area_sqft', 'site_location'],
    due_at: hoursAhead(1.5), sent_at: null,
    last_customer_message_at: hoursAgo(20.5), window_expires_at: hoursAhead(3.5), window_open: true,
  },
  {
    ...base,
    lead_id: 'mock-fu-2', ref_no: 'CP-000102', name: 'Dr. Priya Sharma', phone: '+919876500002', company: 'Sharma Labs',
    city: 'Pune', stage: 'QUALIFYING', assigned_to_name: '',
    bucket: 'AWAITING_REPLY', kind: 'INCOMPLETE_INFO', status: 'SENT',
    message: 'Hi Priya, thanks for your interest in ColourPlus flooring. Could you share the approximate area in sq ft and the site location so our team can take this forward?',
    missing_fields: ['area_sqft', 'site_location'],
    due_at: hoursAgo(2), sent_at: hoursAgo(2),
    last_customer_message_at: hoursAgo(23), window_expires_at: hoursAhead(1), window_open: true,
  },
  {
    ...base,
    lead_id: 'mock-fu-3', ref_no: 'CP-000103', name: 'Anand Vardhan', phone: '+919876500003', company: 'Vardhan Foods',
    city: 'Hyderabad', stage: 'QUALIFYING', assigned_to_name: '',
    bucket: 'REPLIED', kind: 'INCOMPLETE_INFO', status: 'SENT',
    message: 'Hello Anand, to prepare your flooring recommendation could you tell us your timeline for the project?',
    missing_fields: ['timeline'],
    due_at: hoursAgo(6), sent_at: hoursAgo(5.5),
    last_customer_message_at: hoursAgo(1), window_expires_at: hoursAhead(23), window_open: true,
  },
  {
    ...base,
    lead_id: 'mock-fu-4', ref_no: 'CP-000104', name: 'Sunita Reddy', phone: '+919876500004', company: 'Reddy Warehousing',
    city: 'Bengaluru', stage: 'QUALIFYING', assigned_to_name: 'Vikram Mehta',
    bucket: 'NO_REPLY', kind: 'INCOMPLETE_INFO', status: 'EXHAUSTED',
    message: 'Hi Sunita, just checking in on your warehouse flooring enquiry. Could you share the area in sq ft?',
    missing_fields: ['area_sqft'],
    due_at: hoursAgo(52), sent_at: hoursAgo(50),
    last_customer_message_at: hoursAgo(75), window_expires_at: hoursAgo(51), window_open: false,
  },
  {
    ...base,
    lead_id: 'mock-fu-5', ref_no: 'CP-000105', name: 'Meena Iyer', phone: '+919876500005', company: 'Iyer Textiles',
    city: 'Coimbatore', stage: 'QUALIFYING', assigned_to_name: '',
    bucket: 'NEEDS_MANUAL', kind: 'INCOMPLETE_INFO', status: '', message: '',
    missing_fields: ['industry', 'floor_type', 'timeline'],
    due_at: null, sent_at: null,
    last_customer_message_at: hoursAgo(30), window_expires_at: hoursAgo(6), window_open: false,
  },
  {
    ...base,
    lead_id: 'mock-fu-6', ref_no: 'CP-000106', name: 'Qadir Khan', phone: '+919876500006', company: 'Khan Engineering',
    city: 'Mumbai', stage: 'QUALIFIED', assigned_to_name: 'Ananya Roy', band: 'HOT',
    bucket: 'NEEDS_MANUAL', kind: 'QUALIFIED_INACTIVE', status: '', message: '',
    missing_fields: [],
    call_attempts: 2, last_outcome: 'NO_ANSWER',
    due_at: null, sent_at: null,
    last_customer_message_at: hoursAgo(40), window_expires_at: hoursAgo(16), window_open: false,
  },
];

/** The tiles for a list of items, computed the way the backend does. */
export function countFollowups(items: FollowupItem[]): FollowupCounts {
  const n = (bucket: FollowupBucket) => items.filter((i) => i.bucket === bucket).length;
  const awaiting = n('AWAITING_REPLY');
  const replied = n('REPLIED');
  const noReply = n('NO_REPLY');
  const followedUp = awaiting + replied + noReply;
  return {
    scheduled: n('SCHEDULED'),
    awaiting_reply: awaiting,
    replied,
    no_reply: noReply,
    needs_manual: n('NEEDS_MANUAL'),
    not_sent: n('NOT_SENT'),
    followed_up: followedUp,
    reply_rate: followedUp > 0 ? replied / followedUp : 0,
  };
}
