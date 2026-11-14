import React from 'react';

export type BroadcastTabId = 'campaigns' | 'new' | 'templates' | 'contacts' | 'import';

const TABS: { id: BroadcastTabId; label: string }[] = [
  { id: 'campaigns', label: 'Campaigns' },
  { id: 'new', label: 'New campaign' },
  { id: 'templates', label: 'Templates' },
  { id: 'contacts', label: 'Contacts' },
  { id: 'import', label: 'Import leads' },
];

interface BroadcastTabsProps {
  active: BroadcastTabId;
  onChange: (tab: BroadcastTabId) => void;
}

export const BroadcastTabs: React.FC<BroadcastTabsProps> = ({ active, onChange }) => (
  <div role="tablist" className="flex flex-wrap gap-1 p-1 rounded-2xl bg-surface-subtle border border-border-base w-fit">
    {TABS.map((tab) => {
      const isActive = tab.id === active;
      return (
        <button
          key={tab.id}
          role="tab"
          aria-selected={isActive}
          onClick={() => onChange(tab.id)}
          className={`px-4 py-2 text-sm font-semibold rounded-xl transition cursor-pointer ${
            isActive
              ? 'bg-surface text-text-primary shadow-elevation-1 border border-border-base'
              : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
          }`}
        >
          {tab.label}
        </button>
      );
    })}
  </div>
);
