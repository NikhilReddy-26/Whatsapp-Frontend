import React, { useCallback, useEffect, useState } from 'react';
import { Trash2, Megaphone, Search } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { useToast } from '../../context/ToastContext';
import { broadcastApi } from '../../services/broadcastApi';
import { errorMessage } from '../../utils/errorMessage';
import type { AudienceSeed, BroadcastLead } from '../../types/broadcast';

const PAGE_SIZE = 25;
const PURGE_PHRASE = 'DELETE ALL';

type Pending =
  | { kind: 'single'; lead: BroadcastLead }
  | { kind: 'batch'; ids: string[] }
  | { kind: 'purge' };

interface ContactsTabProps {
  onBroadcastToLeads: (seed: AudienceSeed) => void;
}

export const ContactsTab: React.FC<ContactsTabProps> = ({ onBroadcastToLeads }) => {
  const { toast } = useToast();
  const [filters, setFilters] = useState({ phone: '', city: '', industry: '' });
  const [applied, setApplied] = useState(filters);
  const [offset, setOffset] = useState(0);
  const [items, setItems] = useState<BroadcastLead[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [pending, setPending] = useState<Pending | null>(null);
  const [clearImports, setClearImports] = useState(false);
  const [phrase, setPhrase] = useState('');
  const [deleting, setDeleting] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await broadcastApi.listLeads({
        phone: applied.phone,
        city: applied.city,
        industry: applied.industry,
        limit: PAGE_SIZE,
        offset,
      });
      setItems(res.items);
      setTotal(res.total);
    } catch (e) {
      toast({ title: 'Could not load contacts', message: errorMessage(e), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [applied, offset, toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const toggle = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allOnPageSelected = items.length > 0 && items.every((l) => selected.has(l.id));
  const togglePage = () =>
    setSelected((prev) => {
      const next = new Set(prev);
      items.forEach((l) => (allOnPageSelected ? next.delete(l.id) : next.add(l.id)));
      return next;
    });

  const closeModal = () => {
    setPending(null);
    setClearImports(false);
    setPhrase('');
  };

  const runDelete = async () => {
    if (!pending) return;
    setDeleting(true);
    try {
      const res =
        pending.kind === 'single'
          ? await broadcastApi.deleteLead(pending.lead.id)
          : pending.kind === 'batch'
          ? await broadcastApi.batchDeleteLeads(pending.ids, clearImports)
          : await broadcastApi.purgeLeads(clearImports);
      toast({ title: 'Deleted', message: res.message, type: 'success' });
      setSelected(new Set());
      closeModal();
      setOffset(0);
      await load();
    } catch (e) {
      toast({ title: 'Delete failed', message: errorMessage(e), type: 'error', duration: 6000 });
    } finally {
      setDeleting(false);
    }
  };

  const confirmDisabled = pending?.kind === 'purge' && phrase !== PURGE_PHRASE;
  const modalTitle =
    pending?.kind === 'single' ? 'Delete this contact?' : pending?.kind === 'batch' ? `Delete ${pending.ids.length} contacts?` : 'Delete ALL contacts?';

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <form
          className="grid grid-cols-1 sm:grid-cols-4 gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            setOffset(0);
            setApplied(filters);
          }}
        >
          {(['phone', 'city', 'industry'] as const).map((key) => (
            <input
              key={key}
              value={filters[key]}
              onChange={(e) => setFilters((f) => ({ ...f, [key]: e.target.value }))}
              placeholder={`Filter by ${key}`}
              className="px-3 py-2 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-navy/50"
            />
          ))}
          <Button type="submit" variant="secondary" leftIcon={<Search className="w-4 h-4" />}>Search</Button>
        </form>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm text-text-secondary">{total} contact(s){selected.size > 0 && ` · ${selected.size} selected`}</span>
        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="success"
            disabled={selected.size === 0}
            leftIcon={<Megaphone className="w-4 h-4" />}
            onClick={() =>
              onBroadcastToLeads({ kind: 'leads', leadIds: Array.from(selected), label: `${selected.size} selected contact(s)` })
            }
          >
            Broadcast to selected
          </Button>
          <Button size="sm" variant="danger" disabled={selected.size === 0} leftIcon={<Trash2 className="w-4 h-4" />} onClick={() => setPending({ kind: 'batch', ids: Array.from(selected) })}>
            Delete selected
          </Button>
          <Button size="sm" variant="ghost" disabled={total === 0} onClick={() => setPending({ kind: 'purge' })}>
            Purge all…
          </Button>
        </div>
      </div>

      <Card className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-surface-subtle text-text-secondary text-xs">
            <tr>
              <th className="p-3 w-8"><input type="checkbox" checked={allOnPageSelected} onChange={togglePage} aria-label="Select all on this page" /></th>
              <th className="text-left p-3">Name</th>
              <th className="text-left p-3">Phone</th>
              <th className="text-left p-3">City</th>
              <th className="text-left p-3">Industry</th>
              <th className="text-left p-3">Project type</th>
              <th className="p-3 w-10" />
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="p-6 text-center text-text-secondary">Loading…</td></tr>
            ) : items.length === 0 ? (
              <tr><td colSpan={7} className="p-6 text-center text-text-secondary">No contacts match. Import a lead file to get started.</td></tr>
            ) : (
              items.map((lead) => (
                <tr key={lead.id} className="border-t border-border-subtle hover:bg-surface-hover">
                  <td className="p-3"><input type="checkbox" checked={selected.has(lead.id)} onChange={() => toggle(lead.id)} aria-label={`Select ${lead.full_name ?? lead.phone_e164}`} /></td>
                  <td className="p-3 font-medium text-text-primary">{lead.full_name ?? '—'}</td>
                  <td className="p-3 font-mono text-xs">{lead.phone_e164}</td>
                  <td className="p-3">{lead.project_city ?? '—'}</td>
                  <td className="p-3">{lead.industry ?? '—'}</td>
                  <td className="p-3">{lead.project_type ?? '—'}</td>
                  <td className="p-3">
                    <button className="p-1.5 rounded-lg text-text-tertiary hover:text-brand-red hover:bg-surface-hover cursor-pointer" aria-label="Delete contact" onClick={() => setPending({ kind: 'single', lead })}>
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <div className="flex items-center justify-between">
        <Button size="sm" variant="secondary" disabled={offset === 0 || loading} onClick={() => setOffset(Math.max(0, offset - PAGE_SIZE))}>Previous</Button>
        <span className="text-xs text-text-tertiary">
          {total === 0 ? 0 : offset + 1}–{Math.min(offset + PAGE_SIZE, total)} of {total}
        </span>
        <Button size="sm" variant="secondary" disabled={offset + PAGE_SIZE >= total || loading} onClick={() => setOffset(offset + PAGE_SIZE)}>Next</Button>
      </div>

      <Modal isOpen={pending !== null} onClose={closeModal} title={modalTitle} maxWidth="md">
        <div className="space-y-4">
          <p className="text-sm text-text-secondary">
            {pending?.kind === 'single' && `${pending.lead.full_name ?? pending.lead.phone_e164} will be removed. Past campaign messages keep their logs.`}
            {pending?.kind === 'batch' && 'The selected contacts will be removed. Past campaign messages keep their logs.'}
            {pending?.kind === 'purge' && 'Every contact in the broadcast database will be removed. This cannot be undone.'}
          </p>
          {pending && pending.kind !== 'single' && (
            <label className="flex items-start gap-2 text-sm text-text-primary">
              <input type="checkbox" className="mt-1" checked={clearImports} onChange={(e) => setClearImports(e.target.checked)} />
              <span>Also clear import history (lets you re-upload the same file)</span>
            </label>
          )}
          {pending?.kind === 'purge' && (
            <div>
              <label className="text-xs text-text-secondary">Type <span className="font-mono font-bold">{PURGE_PHRASE}</span> to confirm</label>
              <input value={phrase} onChange={(e) => setPhrase(e.target.value)} className="mt-1 w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-base text-sm" />
            </div>
          )}
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={closeModal}>Cancel</Button>
            <Button variant="danger" isLoading={deleting} disabled={confirmDisabled} onClick={runDelete}>Delete</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
