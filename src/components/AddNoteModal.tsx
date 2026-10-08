import React, { useState } from 'react';
import { X, StickyNote, Send } from 'lucide-react';
import { Lead } from '../types/crm';

interface AddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onAddNote: (leadId: string, noteText: string) => void;
}

export const AddNoteModal: React.FC<AddNoteModalProps> = ({
  isOpen,
  onClose,
  lead,
  onAddNote,
}) => {
  if (!isOpen || !lead) return null;

  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    onAddNote(lead.id, noteText.trim());
    setNoteText('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-panel border border-brand-border rounded-[24px] max-w-md w-full p-6 space-y-4 shadow-2xl text-brand-text">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div className="flex items-center space-x-2">
            <StickyNote className="w-5 h-5 text-amber-400" />
            <h3 className="text-base font-bold">Add Internal Sales Note</h3>
          </div>
          <button onClick={onClose} className="p-1 text-brand-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="text-xs bg-brand-body p-2.5 rounded-xl border border-brand-border">
          <span className="font-bold text-white">{lead.name} ({lead.company})</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="font-bold text-brand-muted block mb-1">Internal Note Details</label>
            <textarea
              rows={4}
              placeholder="e.g. Spoke to Director on phone. Requested 5% volume discount for 15k sq ft area."
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full bg-brand-body border border-brand-border rounded-xl p-3 text-brand-text placeholder-brand-muted focus:outline-none focus:border-cp-navy"
              required
            />
          </div>

          <div className="flex justify-end space-x-3 pt-2 border-t border-brand-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-full border border-brand-border text-xs font-semibold text-brand-muted hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-full bg-cp-navy hover:bg-cp-navyHover text-white text-xs font-semibold shadow-sm flex items-center gap-1"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Save Note</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
