import React, { useState } from 'react';
import { X, UserCheck, Shield } from 'lucide-react';
import { Lead } from '../types/crm';

interface AssignLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onAssign: (leadId: string, assignee: string) => void;
}

const SALES_REPS = [
  { name: 'Vikram Mehta', role: 'Senior Sales Manager', region: 'Bengaluru / Hosur' },
  { name: 'Ananya Roy', role: 'Key Accounts Lead', region: 'Pharma & Cleanroom' },
  { name: 'Suresh Patil', role: 'Field Technical Executive', region: 'Commercial Waterproofing' },
  { name: 'Kiran Gowda', role: 'Industrial Flooring Specialist', region: 'Mysuru / Hassan' },
  { name: 'AI Automated System', role: 'WhatsApp Auto Engine', region: 'Pan-India' }
];

export const AssignLeadModal: React.FC<AssignLeadModalProps> = ({
  isOpen,
  onClose,
  lead,
  onAssign,
}) => {
  if (!isOpen || !lead) return null;

  const [selectedRep, setSelectedRep] = useState(lead.assigned_to);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAssign(lead.id, selectedRep);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-panel border border-brand-border rounded-[24px] max-w-md w-full p-6 space-y-5 shadow-2xl text-brand-text">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div className="flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-cp-navy" />
            <h3 className="text-base font-bold">Assign Lead to Sales Rep</h3>
          </div>
          <button onClick={onClose} className="p-1 text-brand-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs bg-brand-body p-3 rounded-xl border border-brand-border space-y-1">
          <span className="font-bold block text-sm text-white">{lead.name} ({lead.company})</span>
          <span className="text-brand-muted block">Score: {lead.score}/100 • Funnel: {lead.funnel}</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-brand-muted block">
              Select Representative
            </label>
            <div className="space-y-2">
              {SALES_REPS.map((rep) => {
                const isSelected = selectedRep.includes(rep.name);
                return (
                  <div
                    key={rep.name}
                    onClick={() => setSelectedRep(`${rep.name} (${rep.role})`)}
                    className={`p-3 rounded-xl border text-xs cursor-pointer transition flex items-center justify-between ${
                      isSelected
                        ? 'bg-cp-navy/20 border-cp-navy text-white font-bold'
                        : 'bg-brand-body border-brand-border text-brand-muted hover:border-brand-borderLight'
                    }`}
                  >
                    <div>
                      <span className="font-bold block text-brand-text">{rep.name}</span>
                      <span className="text-[11px] text-brand-muted">{rep.role} • {rep.region}</span>
                    </div>
                    {isSelected && <UserCheck className="w-4 h-4 text-blue-400" />}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-3 border-t border-brand-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-brand-border text-xs font-semibold text-brand-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-cp-navy hover:bg-cp-navyHover text-white text-xs font-semibold shadow-sm"
            >
              Confirm Assignment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
