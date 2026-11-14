import React, { useState } from 'react';
import { Megaphone } from 'lucide-react';
import { BroadcastTabs, type BroadcastTabId } from './broadcast/BroadcastTabs';
import { CampaignsTab } from './broadcast/CampaignsTab';
import { NewCampaignTab } from './broadcast/NewCampaignTab';
import { TemplatesTab } from './broadcast/TemplatesTab';
import { ContactsTab } from './broadcast/ContactsTab';
import { ImportTab } from './broadcast/ImportTab';
import type { AudienceSeed } from '../types/broadcast';

export const BroadcastView: React.FC = () => {
  const [tab, setTab] = useState<BroadcastTabId>('campaigns');
  const [seed, setSeed] = useState<AudienceSeed | null>(null);

  const startCampaignWith = (audience: AudienceSeed) => {
    setSeed(audience);
    setTab('new');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="p-2.5 rounded-xl bg-surface border border-border-base text-brand-navy shadow-elevation-1">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-text-primary tracking-tight">WhatsApp Broadcast</h2>
          <p className="text-xs text-text-secondary">Import contacts, pick an approved template and track delivery.</p>
        </div>
      </div>

      <BroadcastTabs active={tab} onChange={setTab} />

      {tab === 'campaigns' && <CampaignsTab />}
      {tab === 'new' && <NewCampaignTab seed={seed} onClearSeed={() => setSeed(null)} onCreated={() => setTab('campaigns')} />}
      {tab === 'templates' && <TemplatesTab />}
      {tab === 'contacts' && <ContactsTab onBroadcastToLeads={startCampaignWith} />}
      {tab === 'import' && <ImportTab onBroadcastToImport={startCampaignWith} />}
    </div>
  );
};
