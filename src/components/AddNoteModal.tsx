import React, { useState } from 'react';
import { StickyNote, Send } from 'lucide-react';
import { Lead } from '../types/crm';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

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
  const { toast } = useToast();
  const [noteText, setNoteText] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead || !noteText.trim()) return;
    onAddNote(lead.id, noteText.trim());
    toast({
      title: 'Internal Note Logged',
      message: 'Note attached to lead history and WhatsApp timeline.',
      type: 'info',
    });
    setNoteText('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen && !!lead}
      onClose={onClose}
      title="Add Internal Sales Note"
      subtitle="Log technical audit findings or call notes to lead timeline"
      icon={<StickyNote className="w-5 h-5 text-amber-500" />}
      maxWidth="md"
    >
      {!lead ? null : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-surface-subtle p-3 rounded-xl border border-border-base">
          <span className="font-bold text-text-primary text-sm block">{lead.name}</span>
          <span className="text-text-secondary">{lead.company}</span>
        </div>

        <div>
          <label className="font-bold text-text-secondary block mb-1">Internal Note Details</label>
          <textarea
            rows={4}
            placeholder="e.g. Spoke to Plant Manager on phone. Requested high-build epoxy mortar specification for heavy forklift vibration zone."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            className="w-full bg-surface-subtle border border-border-base rounded-xl p-3 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-brand-navy"
            required
          />
        </div>

        <div className="flex justify-end space-x-3 pt-2 border-t border-border-subtle">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="sm"
            leftIcon={<Send className="w-3.5 h-3.5" />}
            className="rounded-xl px-5"
          >
            Save Note
          </Button>
        </div>
      </form>
      )}
    </Modal>
  );
};
