import React, { useEffect, useMemo, useState } from 'react';
import { Rocket } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { useToast } from '../../context/ToastContext';
import { broadcastApi } from '../../services/broadcastApi';
import { countPlaceholders, defaultMappings, LEAD_FIELD_CHOICES, renderSample } from '../../utils/broadcastTemplates';
import { errorMessage } from '../../utils/errorMessage';
import type { AudienceSeed, CampaignCreatePayload, WhatsAppTemplate } from '../../types/broadcast';

type AudienceMode = 'all' | 'industry' | 'city' | 'seed';

interface NewCampaignTabProps {
  seed: AudienceSeed | null;
  onClearSeed: () => void;
  onCreated: () => void;
}

export const NewCampaignTab: React.FC<NewCampaignTabProps> = ({ seed, onClearSeed, onCreated }) => {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<WhatsAppTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [templateId, setTemplateId] = useState('');
  const [name, setName] = useState('');
  const [mappings, setMappings] = useState<string[]>([]);
  const [mode, setMode] = useState<AudienceMode>(seed ? 'seed' : 'all');
  const [keyword, setKeyword] = useState('');
  const [launching, setLaunching] = useState(false);

  useEffect(() => {
    broadcastApi
      .listTemplates()
      .then((data) => {
        setTemplates(data);
        if (data[0]) pickTemplate(data[0]);
      })
      .catch((e) => toast({ title: 'Could not load templates', message: errorMessage(e), type: 'error' }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setMode((prev) => (seed ? 'seed' : prev === 'seed' ? 'all' : prev));
  }, [seed]);

  const template = templates.find((t) => t.id === templateId) ?? null;
  const placeholderCount = template ? countPlaceholders(template) : 0;

  function pickTemplate(t: WhatsAppTemplate) {
    setTemplateId(t.id);
    setName(`Broadcast - ${t.name}`);
    setMappings(defaultMappings(countPlaceholders(t)));
  }

  const preview = useMemo(() => (template ? renderSample(template.body_text, mappings) : ''), [template, mappings]);

  const needsKeyword = mode === 'industry' || mode === 'city';
  const canLaunch = !!template && name.trim().length > 0 && (!needsKeyword || keyword.trim().length > 0);

  const launch = async () => {
    if (!template) return;
    const payload: CampaignCreatePayload = {
      name: name.trim(),
      template_name: template.name,
      language_code: template.language,
      variable_mappings: mappings,
    };
    if (mode === 'industry') payload.industry_filter = keyword.trim();
    if (mode === 'city') payload.city_filter = keyword.trim();
    if (mode === 'seed' && seed) {
      if (seed.kind === 'import') payload.import_id = seed.importId;
      else payload.lead_ids = seed.leadIds;
    }

    setLaunching(true);
    try {
      const created = await broadcastApi.createCampaign(payload);
      toast({
        title: 'Campaign queued',
        message: `“${created.name}” is queued for ${created.total_recipients} recipient(s).`,
        type: 'success',
      });
      onClearSeed();
      onCreated();
    } catch (e) {
      toast({ title: 'Could not create campaign', message: errorMessage(e), type: 'error', duration: 6000 });
    } finally {
      setLaunching(false);
    }
  };

  if (loading) return <p className="text-sm text-text-secondary">Loading templates…</p>;
  if (templates.length === 0) {
    return <p className="text-sm text-text-secondary">No approved templates yet. Go to the Templates tab and sync from Meta first.</p>;
  }

  const inputClass =
    'w-full px-3 py-2 rounded-xl bg-surface-subtle border border-border-base text-sm text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-navy/50';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-text-primary">1. Template</h3>
        <select className={inputClass} value={templateId} onChange={(e) => pickTemplate(templates.find((t) => t.id === e.target.value)!)}>
          {templates.map((t) => (
            <option key={t.id} value={t.id}>{t.name} ({t.language})</option>
          ))}
        </select>

        {placeholderCount > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-text-secondary">This template needs {placeholderCount} value(s). Choose the lead field for each placeholder.</p>
            {mappings.map((fieldKey, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="font-mono text-xs w-12 text-text-tertiary">{`{{${i + 1}}}`}</span>
                <select
                  className={inputClass}
                  value={fieldKey}
                  onChange={(e) => setMappings((prev) => prev.map((v, j) => (j === i ? e.target.value : v)))}
                >
                  {LEAD_FIELD_CHOICES.map((f) => (
                    <option key={f.key} value={f.key}>{f.label} (e.g. {f.sample})</option>
                  ))}
                </select>
              </div>
            ))}
          </div>
        )}

        <div>
          <p className="text-xs font-semibold text-text-primary mb-1.5">Preview (sample lead)</p>
          <div className="rounded-2xl border-l-4 border-brand-green bg-brand-green/10 p-4 text-sm whitespace-pre-wrap text-text-primary">{preview}</div>
        </div>
      </Card>

      <Card className="p-5 space-y-4">
        <h3 className="text-sm font-bold text-text-primary">2. Audience and launch</h3>
        <div>
          <label className="text-xs text-text-secondary">Campaign name</label>
          <input className={`${inputClass} mt-1`} value={name} onChange={(e) => setName(e.target.value)} />
        </div>

        <fieldset className="space-y-2">
          {seed && (
            <label className="flex items-center gap-2 text-sm text-text-primary">
              <input type="radio" checked={mode === 'seed'} onChange={() => setMode('seed')} />
              <span>{seed.label}</span>
              <button type="button" className="text-xs text-text-tertiary underline cursor-pointer" onClick={onClearSeed}>clear</button>
            </label>
          )}
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="radio" checked={mode === 'all'} onChange={() => setMode('all')} /> All contacts in the database
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="radio" checked={mode === 'industry'} onChange={() => setMode('industry')} /> Filter by industry
          </label>
          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input type="radio" checked={mode === 'city'} onChange={() => setMode('city')} /> Filter by city
          </label>
          {needsKeyword && (
            <input
              className={inputClass}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={mode === 'industry' ? 'e.g. automotive, pharma' : 'e.g. Bengaluru'}
            />
          )}
        </fieldset>

        <Button variant="brand" className="w-full" isLoading={launching} disabled={!canLaunch} leftIcon={<Rocket className="w-4 h-4" />} onClick={launch}>
          Queue broadcast
        </Button>
        <p className="text-xs text-text-tertiary">Messages are queued and sent in the background at Meta’s allowed pace. Track them in the Campaigns tab.</p>
      </Card>
    </div>
  );
};
