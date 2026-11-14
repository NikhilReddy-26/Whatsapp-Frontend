import React, { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { useToast } from '../../context/ToastContext';
import { broadcastApi } from '../../services/broadcastApi';
import { countPlaceholders } from '../../utils/broadcastTemplates';
import { errorMessage } from '../../utils/errorMessage';
import type { WhatsAppTemplate } from '../../types/broadcast';

export const TemplatesTab: React.FC = () => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [syncing, setSyncing] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await broadcastApi.listTemplates();
      setTemplates(data);
      setSelectedId((prev) => prev ?? data[0]?.id ?? null);
    } catch (e) {
      toast({ title: 'Could not load templates', message: errorMessage(e), type: 'error' });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    void load();
  }, [load]);

  const sync = async () => {
    setSyncing(true);
    try {
      const data = await broadcastApi.syncTemplates();
      setTemplates(data);
      setSelectedId((prev) => (data.some((t) => t.id === prev) ? prev : data[0]?.id ?? null));
      toast({ title: 'Templates synced', message: `${data.length} template(s) from Meta.`, type: 'success' });
    } catch (e) {
      toast({ title: 'Sync failed', message: errorMessage(e), type: 'error' });
    } finally {
      setSyncing(false);
    }
  };

  const selected = templates.find((t) => t.id === selectedId) ?? null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <Card className="lg:col-span-2 p-4 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-text-primary">Approved templates</h3>
          <Button size="sm" variant="secondary" isLoading={syncing} leftIcon={<RefreshCw className="w-3.5 h-3.5" />} onClick={sync}>
            Sync from Meta
          </Button>
        </div>
        {loading ? (
          <p className="text-sm text-text-secondary">Loading…</p>
        ) : templates.length === 0 ? (
          <p className="text-sm text-text-secondary">No templates yet. Use “Sync from Meta” to pull your approved templates.</p>
        ) : (
          <ul className="space-y-1.5">
            {templates.map((t) => (
              <li key={t.id}>
                <button
                  onClick={() => setSelectedId(t.id)}
                  className={`w-full text-left px-3 py-2.5 rounded-xl border transition cursor-pointer ${
                    t.id === selectedId ? 'border-brand-navy/40 bg-brand-navy/10' : 'border-border-subtle hover:bg-surface-hover'
                  }`}
                >
                  <div className="text-sm font-semibold text-text-primary truncate">{t.name}</div>
                  <div className="text-xs text-text-tertiary">
                    {t.language} · {t.category} · {countPlaceholders(t)} placeholder(s)
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card className="lg:col-span-3 p-5">
        {selected ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-base font-bold text-text-primary">{selected.name}</h3>
              <Badge variant={selected.status === 'APPROVED' ? 'green' : 'neutral'}>{selected.status}</Badge>
              <Badge variant="navy">{selected.category}</Badge>
            </div>
            <div className="rounded-2xl border-l-4 border-brand-green bg-brand-green/10 p-4 text-sm leading-relaxed text-text-primary whitespace-pre-wrap">
              {selected.body_text}
            </div>
            <dl className="grid grid-cols-2 gap-3 text-xs text-text-secondary">
              <div><dt className="font-semibold text-text-primary">Language</dt><dd>{selected.language}</dd></div>
              <div><dt className="font-semibold text-text-primary">Placeholders</dt><dd>{countPlaceholders(selected)}</dd></div>
            </dl>
          </div>
        ) : (
          <p className="text-sm text-text-secondary">Select a template to preview its message body.</p>
        )}
      </Card>
    </div>
  );
};
