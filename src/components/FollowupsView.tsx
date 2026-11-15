import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import {
  Ban,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Download,
  MessageCircle,
  PhoneCall,
  RefreshCw,
  Search,
  Send,
  Repeat,
  X,
} from 'lucide-react';
import { crmApi } from '../services/api';
import type {
  FollowupBucket,
  FollowupCounts,
  FollowupItem,
  FollowupKind,
  FollowupList,
  SalesActivityOutcome,
  SalesActivityType,
} from '../types/crm';
import { Badge, type BadgeVariant } from './ui/Badge';
import { Button } from './ui/Button';
import { Card } from './ui/Card';
import { Modal } from './ui/Modal';
import { AnimatedText } from './ui/AnimatedText';
import { useToast } from '../context/ToastContext';

interface FollowupsViewProps {
  /** Opens the lead's chat in Lead Desk. */
  onOpenLead: (leadId: string) => void;
  /** Reports the tiles after every load so the nav badge can follow. */
  onCountsChange?: (counts: FollowupCounts) => void;
}

const PAGE_SIZE = 25;
const REFRESH_MS = 60_000;

// ---- Vocabulary -------------------------------------------------------------------------------

type TabId = FollowupBucket | 'ALL';

const BUCKETS: Record<
  FollowupBucket,
  { label: string; hint: string; variant: BadgeVariant; icon: React.ReactNode }
> = {
  SCHEDULED: {
    label: 'Scheduled',
    hint: 'The bot has planned a message and will send it at the planned time.',
    variant: 'navy',
    icon: <Clock className="w-4 h-4" />,
  },
  AWAITING_REPLY: {
    label: 'Awaiting reply',
    hint: 'A follow-up went out. The customer has not written back yet.',
    variant: 'warm',
    icon: <Send className="w-4 h-4" />,
  },
  REPLIED: {
    label: 'Replied',
    hint: 'The customer wrote back after a follow-up.',
    variant: 'green',
    icon: <CheckCircle2 className="w-4 h-4" />,
  },
  NO_REPLY: {
    label: 'No reply: call',
    hint: 'A follow-up went out and the customer stayed silent. Sales should call.',
    variant: 'hot',
    icon: <PhoneCall className="w-4 h-4" />,
  },
  NEEDS_MANUAL: {
    label: 'Needs follow-up',
    hint: 'The 24-hour WhatsApp window is closed, so the bot cannot message them. Call, or send an approved template.',
    variant: 'hot',
    icon: <Repeat className="w-4 h-4" />,
  },
  NOT_SENT: {
    label: 'Not sent',
    hint: 'A planned follow-up was cancelled or failed.',
    variant: 'neutral',
    icon: <Ban className="w-4 h-4" />,
  },
};

const TILE_ORDER: FollowupBucket[] = ['NEEDS_MANUAL', 'NO_REPLY', 'SCHEDULED', 'AWAITING_REPLY', 'REPLIED'];
const TAB_ORDER: TabId[] = ['ALL', 'NEEDS_MANUAL', 'NO_REPLY', 'SCHEDULED', 'AWAITING_REPLY', 'REPLIED', 'NOT_SENT'];

const TILE_FIELD: Record<FollowupBucket, keyof FollowupCounts> = {
  SCHEDULED: 'scheduled',
  AWAITING_REPLY: 'awaiting_reply',
  REPLIED: 'replied',
  NO_REPLY: 'no_reply',
  NEEDS_MANUAL: 'needs_manual',
  NOT_SENT: 'not_sent',
};

const KIND_LABEL: Record<FollowupKind, string> = {
  INCOMPLETE_INFO: 'Incomplete enquiry',
  QUALIFIED_INACTIVE: 'Qualified, unreachable',
};

const FIELD_LABEL: Record<string, string> = {
  name: 'Name',
  industry: 'Industry',
  application: 'Application',
  area_sqft: 'Area',
  floor_type: 'Floor type',
  existing_floor_condition: 'Floor condition',
  timeline: 'Timeline',
  site_location: 'Site location',
};
const fieldLabel = (f: string) => FIELD_LABEL[f] ?? f.replace(/_/g, ' ');

const REASON_LABEL: Record<string, string> = {
  CUSTOMER_REPLIED: 'Customer replied first',
  OPTED_OUT: 'Customer opted out',
  TAKEN_OVER: 'A person took over the chat',
  SALES_OUTCOME: 'Sales logged an outcome',
  WINDOW_CLOSED: '24-hour window closed',
  NO_SEND_SLOT: 'No safe time to send',
  REPLY_CAP: 'Bot reply limit reached',
  MESSAGE_CANCELLED: 'Message was withdrawn',
  LEAD_CLOSED: 'Lead was closed',
};
function reasonText(raw: string): string {
  if (!raw) return 'Not sent';
  if (REASON_LABEL[raw]) return REASON_LABEL[raw];
  if (raw.startsWith('LLM_')) return 'Customer situation changed';
  const s = raw.replace(/_/g, ' ').toLowerCase();
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const OUTCOMES: { value: SalesActivityOutcome; label: string; hint: string }[] = [
  { value: 'NO_ANSWER', label: 'No answer', hint: 'Keeps them on this list. A qualified lead then becomes eligible for an automatic follow-up.' },
  { value: 'INTERESTED', label: 'Interested', hint: 'Takes them off this list and cancels any pending follow-up.' },
  { value: 'CALLBACK_REQUESTED', label: 'Asked for a callback', hint: 'Takes them off this list and cancels any pending follow-up.' },
  { value: 'SCHEDULED', label: 'Visit scheduled', hint: 'Takes them off this list and cancels any pending follow-up.' },
  { value: 'COMPLETED', label: 'Completed', hint: 'Takes them off this list.' },
  { value: 'NOT_INTERESTED', label: 'Not interested', hint: 'Takes them off this list and cancels any pending follow-up.' },
];
const ACTIVITY_TYPES: { value: SalesActivityType; label: string }[] = [
  { value: 'CALL', label: 'Phone call' },
  { value: 'WHATSAPP', label: 'WhatsApp (sent by sales)' },
  { value: 'CALLBACK', label: 'Callback' },
  { value: 'VISIT', label: 'Site visit' },
];

// ---- Small helpers ----------------------------------------------------------------------------

function span(ms: number): string {
  const mins = Math.max(0, Math.round(ms / 60_000));
  if (mins < 1) return 'moments';
  if (mins < 60) return `${mins}m`;
  const hours = Math.floor(mins / 60);
  if (hours < 48) return `${hours}h${mins % 60 >= 1 && hours < 6 ? ` ${mins % 60}m` : ''}`;
  return `${Math.floor(hours / 24)}d`;
}
const ago = (iso: string | null) => (iso ? `${span(Date.now() - new Date(iso).getTime())} ago` : '');
const until = (iso: string | null) => {
  if (!iso) return '';
  const ms = new Date(iso).getTime() - Date.now();
  return ms <= 60_000 ? 'now' : `in ${span(ms)}`;
};

function windowLabel(item: FollowupItem): { text: string; variant: BadgeVariant } {
  if (item.opted_out) return { text: 'Opted out', variant: 'hot' };
  if (item.window_open && item.window_expires_at) {
    return { text: `Open · ${span(new Date(item.window_expires_at).getTime() - Date.now())} left`, variant: 'green' };
  }
  return { text: 'Closed', variant: 'neutral' };
}

function statusDetail(item: FollowupItem): string {
  switch (item.bucket) {
    case 'SCHEDULED':
      return `Goes out ${until(item.due_at)}`;
    case 'AWAITING_REPLY':
      return item.status === 'QUEUED' ? 'Sending now' : `Sent ${ago(item.sent_at)}`;
    case 'REPLIED':
      return `Replied ${ago(item.last_customer_message_at)}`;
    case 'NO_REPLY':
      return `Sent ${ago(item.sent_at)}, still silent`;
    case 'NEEDS_MANUAL':
      return item.call_attempts > 0
        ? `${item.call_attempts} call${item.call_attempts === 1 ? '' : 's'} unanswered`
        : `Went quiet ${ago(item.last_customer_message_at)}`;
    case 'NOT_SENT':
      return reasonText(item.cancel_reason || item.last_error);
  }
}

/** A cell from a customer could start with a character that spreadsheets run as a formula. */
function csvCell(value: string, trusted = false): string {
  const safe = !trusted && /^[=+\-@\t\r]/.test(value) ? `'${value}` : value;
  return `"${safe.replace(/"/g, '""')}"`;
}

function downloadCsv(items: FollowupItem[]): void {
  const header = ['Ref', 'Name', 'Phone', 'Company', 'City', 'Status', 'Reason', 'Still needed', 'WhatsApp window', 'Last customer message'];
  const rows = items.map((i) => [
    csvCell(i.ref_no, true),
    csvCell(i.name),
    csvCell(i.phone, true),
    csvCell(i.company),
    csvCell(i.city),
    csvCell(BUCKETS[i.bucket].label, true),
    csvCell(statusDetail(i)),
    csvCell(i.missing_fields.map(fieldLabel).join(', '), true),
    csvCell(windowLabel(i).text, true),
    csvCell(i.last_customer_message_at ?? '', true),
  ]);
  const csv = [header.map((h) => csvCell(h, true)).join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const url = URL.createObjectURL(new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `followups-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

// ---- The page ---------------------------------------------------------------------------------

export const FollowupsView: React.FC<FollowupsViewProps> = ({ onOpenLead, onCountsChange }) => {
  const { toast } = useToast();
  const [data, setData] = useState<FollowupList | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [tab, setTab] = useState<TabId>('ALL');
  const [kind, setKind] = useState<FollowupKind | ''>('');
  const [windowFilter, setWindowFilter] = useState<'open' | 'closed' | ''>('');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [logTargets, setLogTargets] = useState<FollowupItem[] | null>(null);

  // Debounce the search box so every keystroke is not a request.
  useEffect(() => {
    const t = setTimeout(() => {
      setSearch(searchInput.trim());
      setPage(1);
    }, 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Held in a ref so a parent that passes a new function every render cannot make `load` change
  // identity and re-fetch in a loop.
  const countsCallback = useRef(onCountsChange);
  useEffect(() => {
    countsCallback.current = onCountsChange;
  });

  const seq = useRef(0);
  const load = useCallback(
    async (silent = false) => {
      const mine = ++seq.current;
      if (!silent) setLoading(true);
      try {
        const result = await crmApi.getFollowups({
          bucket: tab === 'ALL' ? undefined : tab,
          kind: kind || undefined,
          window: windowFilter || undefined,
          q: search || undefined,
          page,
          limit: PAGE_SIZE,
        });
        if (mine !== seq.current) return; // a newer request superseded this one
        setData(result);
        setError(null);
        countsCallback.current?.(result.counts);
      } catch (err) {
        if (mine !== seq.current) return;
        setError(err instanceof Error ? err.message : 'Could not load follow-ups.');
      } finally {
        if (mine === seq.current) setLoading(false);
      }
    },
    [tab, kind, windowFilter, search, page]
  );

  useEffect(() => {
    void load();
  }, [load]);

  // Keep the list fresh while the page is open (the engine runs every 10 minutes).
  useEffect(() => {
    const id = setInterval(() => {
      if (!document.hidden && logTargets === null) void load(true);
    }, REFRESH_MS);
    return () => clearInterval(id);
  }, [load, logTargets]);

  const changeFilter = <T,>(setter: (v: T) => void) => (value: T) => {
    setter(value);
    setPage(1);
    setSelected(new Set());
  };

  const items = useMemo(() => data?.items ?? [], [data]);
  const selectedItems = useMemo(() => items.filter((i) => selected.has(i.lead_id)), [items, selected]);
  const allOnPageSelected = items.length > 0 && selectedItems.length === items.length;

  const toggleOne = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const toggleAll = () => setSelected(allOnPageSelected ? new Set() : new Set(items.map((i) => i.lead_id)));

  const counts = data?.counts;

  return (
    <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-surface border border-border-subtle rounded-card p-6 shadow-elevation-1"
      >
        <div>
          <div className="flex items-center space-x-2 text-brand-green font-bold text-xs uppercase tracking-wider mb-1 font-mono">
            <Repeat className="w-4 h-4" />
            <span>Automatic Follow-ups</span>
          </div>
          <AnimatedText text="Follow-up Worklist" as="h2" className="text-2xl font-black text-text-primary tracking-tight" />
          <p className="text-xs text-text-secondary mt-1 max-w-2xl">
            Customers who went quiet. The bot follows up on WhatsApp while the 24-hour window is open. Anyone it cannot reach
            lands here for sales to call.
          </p>
        </div>
        {counts && (
          <div className="flex items-center gap-6 text-sm">
            <div>
              <div className="text-2xl font-black text-text-primary leading-none">{counts.followed_up}</div>
              <div className="text-[11px] text-text-tertiary font-semibold mt-1">Followed up</div>
            </div>
            <div>
              <div className="text-2xl font-black text-brand-green leading-none">
                {counts.followed_up > 0 ? `${Math.round(counts.reply_rate * 100)}%` : '–'}
              </div>
              <div className="text-[11px] text-text-tertiary font-semibold mt-1">Wrote back</div>
            </div>
          </div>
        )}
      </motion.div>

      {/* TILES */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {TILE_ORDER.map((bucket) => {
          const meta = BUCKETS[bucket];
          const active = tab === bucket;
          return (
            <button
              key={bucket}
              type="button"
              onClick={() => changeFilter<TabId>(setTab)(active ? 'ALL' : bucket)}
              title={meta.hint}
              className={`text-left rounded-card border p-4 transition cursor-pointer ${
                active
                  ? 'border-brand-navy bg-brand-navy/10 shadow-elevation-2'
                  : 'border-border-subtle bg-surface hover:bg-surface-hover shadow-elevation-1'
              }`}
            >
              <div className="flex items-center justify-between text-text-tertiary">
                <span className="text-text-secondary">{meta.icon}</span>
              </div>
              <div className="text-3xl font-black text-text-primary mt-2 leading-none">
                {counts ? counts[TILE_FIELD[bucket]] : '–'}
              </div>
              <div className="text-xs font-semibold text-text-secondary mt-1.5">{meta.label}</div>
            </button>
          );
        })}
      </div>

      {/* LIST */}
      <Card elevation={1} className="overflow-hidden">
        {/* Tabs + filters */}
        <div className="p-4 sm:p-5 space-y-4 border-b border-border-subtle">
          <div className="flex flex-wrap gap-1.5">
            {TAB_ORDER.map((id) => {
              const active = tab === id;
              const label = id === 'ALL' ? 'All' : BUCKETS[id].label;
              const n = id === 'ALL' ? null : counts?.[TILE_FIELD[id]];
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => changeFilter<TabId>(setTab)(id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold transition cursor-pointer ${
                    active ? 'bg-brand-navy text-white' : 'bg-surface-subtle text-text-secondary hover:text-text-primary'
                  }`}
                >
                  {label}
                  {n !== null && n !== undefined ? ` (${n})` : ''}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-text-tertiary absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Search name, phone, company or reference..."
                className="w-full pl-10 pr-3 py-2.5 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy"
              />
            </div>
            <select
              value={kind}
              onChange={(e) => changeFilter<FollowupKind | ''>(setKind)(e.target.value as FollowupKind | '')}
              className="px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary"
              aria-label="Filter by type"
            >
              <option value="">All types</option>
              <option value="INCOMPLETE_INFO">Incomplete enquiry</option>
              <option value="QUALIFIED_INACTIVE">Qualified, unreachable</option>
            </select>
            <select
              value={windowFilter}
              onChange={(e) => changeFilter<'open' | 'closed' | ''>(setWindowFilter)(e.target.value as 'open' | 'closed' | '')}
              className="px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary"
              aria-label="Filter by WhatsApp window"
            >
              <option value="">Any WhatsApp window</option>
              <option value="open">Window open</option>
              <option value="closed">Window closed</option>
            </select>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => void load()}
              leftIcon={<RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />}
            >
              Refresh
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={items.length === 0}
              onClick={() => downloadCsv(selectedItems.length > 0 ? selectedItems : items)}
              leftIcon={<Download className="w-4 h-4" />}
            >
              {selectedItems.length > 0 ? `Export ${selectedItems.length}` : 'Export'}
            </Button>
          </div>
        </div>

        {/* Bulk bar */}
        {selectedItems.length > 0 && (
          <div className="px-4 sm:px-5 py-3 bg-brand-navy/10 border-b border-brand-navy/30 flex flex-wrap items-center gap-3">
            <span className="text-sm font-bold text-text-primary">{selectedItems.length} selected</span>
            <Button variant="brand" size="sm" onClick={() => setLogTargets(selectedItems)} leftIcon={<PhoneCall className="w-4 h-4" />}>
              Log call outcome
            </Button>
            <button
              type="button"
              onClick={() => setSelected(new Set())}
              className="text-xs font-semibold text-text-secondary hover:text-text-primary inline-flex items-center gap-1 cursor-pointer"
            >
              <X className="w-3.5 h-3.5" /> Clear
            </button>
          </div>
        )}

        {/* Rows */}
        {error ? (
          <div className="p-10 text-center space-y-3">
            <p className="text-sm text-text-secondary">{error}</p>
            <Button variant="secondary" size="sm" onClick={() => void load()}>
              Try again
            </Button>
          </div>
        ) : loading && !data ? (
          <div className="p-10 text-center text-sm text-text-tertiary">Loading follow-ups...</div>
        ) : items.length === 0 ? (
          <div className="p-12 text-center space-y-1">
            <p className="text-sm font-bold text-text-primary">Nobody to follow up here</p>
            <p className="text-xs text-text-secondary">
              {tab === 'ALL' && !search && !kind && !windowFilter
                ? 'Customers appear when they go quiet and the bot (or sales) needs to chase them.'
                : 'No leads match these filters.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-[11px] uppercase tracking-wider text-text-tertiary border-b border-border-subtle">
                  <th className="pl-4 sm:pl-5 py-3 w-10">
                    <input
                      type="checkbox"
                      checked={allOnPageSelected}
                      onChange={toggleAll}
                      aria-label="Select all on this page"
                      className="accent-[#0F3F8A] w-4 h-4 cursor-pointer"
                    />
                  </th>
                  <th className="py-3 pr-4 font-semibold">Customer</th>
                  <th className="py-3 pr-4 font-semibold">Status</th>
                  <th className="py-3 pr-4 font-semibold min-w-[260px]">What we need / sent</th>
                  <th className="py-3 pr-4 font-semibold">WhatsApp window</th>
                  <th className="py-3 pr-4 font-semibold">Sales</th>
                  <th className="py-3 pr-4 sm:pr-5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-subtle">
                {items.map((item) => {
                  const meta = BUCKETS[item.bucket];
                  const win = windowLabel(item);
                  return (
                    <tr key={item.lead_id} className="align-top hover:bg-surface-hover/60 transition-colors">
                      <td className="pl-4 sm:pl-5 py-3.5">
                        <input
                          type="checkbox"
                          checked={selected.has(item.lead_id)}
                          onChange={() => toggleOne(item.lead_id)}
                          aria-label={`Select ${item.name || item.ref_no}`}
                          className="accent-[#0F3F8A] w-4 h-4 cursor-pointer"
                        />
                      </td>
                      <td className="py-3.5 pr-4">
                        <div className="font-bold text-text-primary">{item.name || 'Unnamed lead'}</div>
                        <div className="text-xs text-text-secondary font-mono">{item.ref_no} · {item.phone}</div>
                        {(item.company || item.city) && (
                          <div className="text-xs text-text-tertiary">{[item.company, item.city].filter(Boolean).join(' · ')}</div>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <Badge variant={meta.variant} size="xs" icon={meta.icon}>{meta.label}</Badge>
                        <div className="text-xs text-text-secondary mt-1.5">{statusDetail(item)}</div>
                        <div className="text-[11px] text-text-tertiary">{KIND_LABEL[item.kind]}</div>
                      </td>
                      <td className="py-3.5 pr-4">
                        {item.message ? (
                          <p className="text-xs text-text-secondary leading-snug line-clamp-3 max-w-md" title={item.message}>
                            <MessageCircle className="w-3.5 h-3.5 inline mr-1 -mt-0.5 text-brand-green" />
                            {item.message}
                          </p>
                        ) : null}
                        {item.missing_fields.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {item.missing_fields.map((f) => (
                              <span key={f} className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-surface-subtle border border-border-base text-text-secondary">
                                {fieldLabel(f)}
                              </span>
                            ))}
                          </div>
                        )}
                        {!item.message && item.missing_fields.length === 0 && <span className="text-xs text-text-tertiary">–</span>}
                      </td>
                      <td className="py-3.5 pr-4 whitespace-nowrap">
                        <Badge variant={win.variant} size="xs">{win.text}</Badge>
                        {!item.window_open && !item.opted_out && (
                          <div className="text-[11px] text-text-tertiary mt-1">Call, or send a template</div>
                        )}
                      </td>
                      <td className="py-3.5 pr-4 text-xs text-text-secondary whitespace-nowrap">
                        {item.assigned_to_name || <span className="text-text-tertiary">Unassigned</span>}
                        {item.bot_status === 'HUMAN_TAKEOVER' && <div className="text-text-tertiary">Human active</div>}
                      </td>
                      <td className="py-3.5 pr-4 sm:pr-5">
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="secondary" size="xs" onClick={() => onOpenLead(item.lead_id)}>
                            Open chat
                          </Button>
                          <Button variant="ghost" size="xs" onClick={() => setLogTargets([item])} leftIcon={<PhoneCall className="w-3.5 h-3.5" />}>
                            Log call
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* Paging */}
        {data && data.pagination.total > 0 && (
          <div className="px-4 sm:px-5 py-3 border-t border-border-subtle flex items-center justify-between text-xs text-text-secondary">
            <span>
              {data.pagination.total} {data.pagination.total === 1 ? 'customer' : 'customers'} · page {data.pagination.page} of{' '}
              {Math.max(1, data.pagination.total_pages)}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="xs"
                disabled={page <= 1}
                onClick={() => {
                  setPage((p) => Math.max(1, p - 1));
                  setSelected(new Set());
                }}
                leftIcon={<ChevronLeft className="w-3.5 h-3.5" />}
              >
                Previous
              </Button>
              <Button
                variant="secondary"
                size="xs"
                disabled={page >= data.pagination.total_pages}
                onClick={() => {
                  setPage((p) => p + 1);
                  setSelected(new Set());
                }}
                rightIcon={<ChevronRight className="w-3.5 h-3.5" />}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>

      {/* Mounted only while open, so the form starts fresh every time. */}
      {logTargets && (
        <LogOutcomeModal
          targets={logTargets}
          onClose={() => setLogTargets(null)}
          onDone={(ok) => {
            if (ok) setSelected(new Set());
            void load(true);
          }}
          toast={toast}
        />
      )}
    </div>
  );
};

// ---- Log call outcome -------------------------------------------------------------------------

const LogOutcomeModal: React.FC<{
  targets: FollowupItem[];
  onClose: () => void;
  onDone: (allSucceeded: boolean) => void;
  toast: ReturnType<typeof useToast>['toast'];
}> = ({ targets, onClose, onDone, toast }) => {
  const [outcome, setOutcome] = useState<SalesActivityOutcome>('NO_ANSWER');
  const [type, setType] = useState<SalesActivityType>('CALL');
  const [note, setNote] = useState('');
  const [busy, setBusy] = useState(false);

  const hint = OUTCOMES.find((o) => o.value === outcome)?.hint;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const res = await crmApi.logFollowupActivity({
        lead_ids: targets.map((t) => t.lead_id),
        type,
        outcome,
        note: note.trim() || undefined,
      });
      if (res.failed === 0) {
        toast({
          title: 'Outcome recorded',
          message: `${res.succeeded} ${res.succeeded === 1 ? 'lead' : 'leads'} updated.`,
          type: 'success',
        });
      } else {
        const why = res.results.find((r) => !r.ok)?.message;
        toast({
          title: `${res.succeeded} updated, ${res.failed} could not be`,
          message: why ?? 'Some leads could not be updated.',
          type: 'warning',
          duration: 6000,
        });
      }
      onDone(res.failed === 0);
      onClose();
    } catch (err) {
      toast({
        title: 'Could not record the outcome',
        message: err instanceof Error ? err.message : 'Please try again.',
        type: 'error',
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      isOpen
      onClose={busy ? () => undefined : onClose}
      title="Log call outcome"
      subtitle={targets.length === 1 ? `${targets[0].name || targets[0].ref_no}` : `${targets.length} customers`}
      icon={<PhoneCall className="w-5 h-5" />}
      maxWidth="md"
    >
      <form onSubmit={submit} className="space-y-4">
        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-text-secondary">What happened</span>
          <select
            value={outcome}
            onChange={(e) => setOutcome(e.target.value as SalesActivityOutcome)}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary"
          >
            {OUTCOMES.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
          {hint && <span className="block text-[11px] text-text-tertiary">{hint}</span>}
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-text-secondary">How you reached out</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as SalesActivityType)}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary"
          >
            {ACTIVITY_TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
        </label>

        <label className="block space-y-1.5">
          <span className="text-xs font-bold text-text-secondary">Note (optional)</span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            maxLength={1000}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary resize-none"
            placeholder="e.g. Rang twice, phone switched off"
          />
        </label>

        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" size="sm" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button type="submit" variant="brand" size="sm" isLoading={busy}>
            Save outcome
          </Button>
        </div>
      </form>
    </Modal>
  );
};
