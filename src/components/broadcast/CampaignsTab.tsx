import React, { useCallback, useEffect, useState } from 'react';
import { Pause, Play, Ban, RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge, type BadgeVariant } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { broadcastApi } from '../../services/broadcastApi';
import { errorMessage } from '../../utils/errorMessage';
import type { BroadcastCampaign, CampaignMessage } from '../../types/broadcast';

const POLL_MS = 5000;
const ACTIVE_STATUSES = new Set(['queued', 'sending']);

const statusVariant = (status: string): BadgeVariant =>
  status === 'completed' ? 'green' : status === 'sending' || status === 'queued' ? 'navy' : status === 'paused' ? 'warm' : status === 'cancelled' ? 'hot' : 'neutral';

const messageVariant = (state: string): BadgeVariant =>
  state === 'READ' || state === 'DELIVERED' ? 'green' : state === 'FAILED' ? 'hot' : state === 'ACCEPTED' ? 'navy' : 'neutral';

const MESSAGE_STATES = ['', 'PENDING', 'ACCEPTED', 'DELIVERED', 'READ', 'FAILED'];

export const CampaignsTab: React.FC = () => {
  const { toast } = useToast();
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<CampaignMessage[]>([]);
  const [stateFilter, setStateFilter] = useState('');
  const [acting, setActing] = useState(false);

  const loadCampaigns = useCallback(async (quiet = false) => {
    try {
      const data = await broadcastApi.listCampaigns();
      setCampaigns(data);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
    } catch (e) {
      if (!quiet) toast({ title: 'Could not load campaigns', message: errorMessage(e), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const loadMessages = useCallback(async (campaignId: string, state: string, quiet = false) => {
    try {
      setMessages(await broadcastApi.getCampaignMessages(campaignId, { state: state || undefined, limit: 200 }));
    } catch (e) {
      if (!quiet) toast({ title: 'Could not load message log', message: errorMessage(e), type: 'error' });
    }
  }, [toast]);

  useEffect(() => {
    void loadCampaigns();
  }, [loadCampaigns]);

  useEffect(() => {
    if (selectedId) void loadMessages(selectedId, stateFilter);
    else setMessages([]);
  }, [selectedId, stateFilter, loadMessages]);

  const anyActive = campaigns.some((c) => ACTIVE_STATUSES.has(c.status));

  // Poll while something is running; skip ticks while the browser tab is hidden
  useEffect(() => {
    if (!anyActive) return;
    const timer = setInterval(() => {
      if (document.hidden) return;
      void loadCampaigns(true);
      if (selectedId) void loadMessages(selectedId, stateFilter, true);
    }, POLL_MS);
    return () => clearInterval(timer);
  }, [anyActive, selectedId, stateFilter, loadCampaigns, loadMessages]);

  const selected = campaigns.find((c) => c.id === selectedId) ?? null;

  const act = async (kind: 'pause' | 'resume' | 'cancel') => {
    if (!selected) return;
    if (kind === 'cancel' && !window.confirm(`Cancel “${selected.name}”? Messages not yet sent will not be sent.`)) return;
    setActing(true);
    try {
      const fn = kind === 'pause' ? broadcastApi.pauseCampaign : kind === 'resume' ? broadcastApi.resumeCampaign : broadcastApi.cancelCampaign;
      const updated = await fn(selected.id);
      setCampaigns((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
      toast({ title: `Campaign ${updated.status}`, message: updated.name, type: 'success' });
    } catch (e) {
      toast({ title: `Could not ${kind} campaign`, message: errorMessage(e), type: 'error' });
    } finally {
      setActing(false);
    }
  };

  const pct = (n: number, total: number) => (total > 0 ? Math.round((n / total) * 100) : 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-2 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">Campaigns</h3>
          <Button size="sm" variant="ghost" leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={() => void loadCampaigns()}>Refresh</Button>
        </div>
        {loading ? (
          <p className="text-sm text-text-secondary">Loading…</p>
        ) : campaigns.length === 0 ? (
          <p className="text-sm text-text-secondary">No campaigns yet. Create one in “New campaign”.</p>
        ) : (
          <ul className="space-y-1.5">
            {campaigns.map((c) => (
              <li key={c.id}>
                <button
                  onClick={() => setSelectedId(c.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border transition cursor-pointer ${c.id === selectedId ? 'border-brand-navy/40 bg-brand-navy/10' : 'border-border-subtle hover:bg-surface-hover'}`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-text-primary truncate">{c.name}</span>
                    <Badge size="xs" variant={statusVariant(c.status)} pulse={ACTIVE_STATUSES.has(c.status)}>{c.status}</Badge>
                  </div>
                  <div className="text-xs text-text-tertiary mt-0.5">
                    {c.sent_count}/{c.total_recipients} sent · {new Date(c.created_at).toLocaleString()}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="lg:col-span-3 p-5 space-y-4">
        {!selected ? (
          <p className="text-sm text-text-secondary">Select a campaign to see delivery metrics.</p>
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h3 className="text-base font-bold text-text-primary">{selected.name}</h3>
                <p className="text-xs text-text-tertiary">Template {selected.template_name} · {selected.language_code}</p>
              </div>
              <div className="flex gap-2">
                {selected.status === 'paused' ? (
                  <Button size="sm" variant="success" isLoading={acting} leftIcon={<Play className="w-4 h-4" />} onClick={() => act('resume')}>Resume</Button>
                ) : (
                  <Button size="sm" variant="secondary" isLoading={acting} disabled={!ACTIVE_STATUSES.has(selected.status)} leftIcon={<Pause className="w-4 h-4" />} onClick={() => act('pause')}>Pause</Button>
                )}
                <Button size="sm" variant="danger" isLoading={acting} disabled={['completed', 'cancelled'].includes(selected.status)} leftIcon={<Ban className="w-4 h-4" />} onClick={() => act('cancel')}>Cancel</Button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {[
                ['Recipients', selected.total_recipients, null],
                ['Sent', selected.sent_count, pct(selected.sent_count, selected.total_recipients)],
                ['Delivered', selected.delivered_count, pct(selected.delivered_count, selected.total_recipients)],
                ['Read', selected.read_count, pct(selected.read_count, selected.total_recipients)],
                ['Failed', selected.failed_count, pct(selected.failed_count, selected.total_recipients)],
              ].map(([label, value, percent]) => (
                <div key={label as string} className="rounded-xl border border-border-subtle bg-surface-subtle p-3">
                  <div className="text-xs text-text-tertiary">{label}</div>
                  <div className="text-xl font-bold text-text-primary">{value}</div>
                  {percent !== null && <div className="text-xs text-text-secondary">{percent}%</div>}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-text-primary">Message log</h4>
                <select
                  value={stateFilter}
                  onChange={(e) => setStateFilter(e.target.value)}
                  className="px-2 py-1 rounded-lg bg-surface-subtle border border-border-base text-xs"
                  aria-label="Filter messages by state"
                >
                  {MESSAGE_STATES.map((s) => (
                    <option key={s} value={s}>{s || 'All states'}</option>
                  ))}
                </select>
              </div>
              <div className="overflow-x-auto rounded-xl border border-border-subtle max-h-96">
                <table className="w-full text-xs">
                  <thead className="bg-surface-subtle text-text-secondary sticky top-0">
                    <tr>
                      <th className="text-left p-2">Phone</th>
                      <th className="text-left p-2">State</th>
                      <th className="text-left p-2">Attempts</th>
                      <th className="text-left p-2">Sent</th>
                      <th className="text-left p-2">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    {messages.length === 0 ? (
                      <tr><td colSpan={5} className="p-4 text-center text-text-secondary">No messages.</td></tr>
                    ) : (
                      messages.map((m) => (
                        <tr key={m.id} className="border-t border-border-subtle">
                          <td className="p-2 font-mono">{m.phone_e164}</td>
                          <td className="p-2"><Badge size="xs" variant={messageVariant(m.state)}>{m.state}</Badge></td>
                          <td className="p-2">{m.attempts}</td>
                          <td className="p-2">{m.sent_at ? new Date(m.sent_at).toLocaleTimeString() : '—'}</td>
                          <td className="p-2 text-brand-red">{m.error_message ?? ''}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </Card>
    </div>
  );
};
