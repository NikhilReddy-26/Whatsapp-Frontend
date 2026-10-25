import React, { useState } from 'react';
import { Trash2, AlertTriangle, User, MapPin } from 'lucide-react';
import type { Applicator } from '../types/crm';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

interface RemoveApplicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicators: Applicator[];
  onRemoveApplicator: (applicatorId: string) => void;
}

export const RemoveApplicatorModal: React.FC<RemoveApplicatorModalProps> = ({
  isOpen,
  onClose,
  applicators,
  onRemoveApplicator,
}) => {
  const { toast } = useToast();
  const [selectedApplicatorId, setSelectedApplicatorId] = useState(applicators[0]?.id || '');

  const selectedApplicator = applicators.find((a) => a.id === selectedApplicatorId);

  const handleRemove = () => {
    if (!selectedApplicatorId || !selectedApplicator) return;

    onRemoveApplicator(selectedApplicatorId);

    toast({
      title: 'Applicator Removed',
      message: `${selectedApplicator.name} removed from certified applicators directory.`,
      type: 'warning',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Certified Applicator"
      subtitle="Revoke contractor certification or directory listing"
      icon={<Trash2 className="w-5 h-5 text-funnel-hot" />}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {applicators.length === 0 ? (
          <p className="text-text-secondary py-4 text-center">No applicators available to remove.</p>
        ) : (
          <>
            <div className="p-3 bg-funnel-hot/10 border border-funnel-hot/20 rounded-xl flex items-start gap-2.5 text-text-primary">
              <AlertTriangle className="w-4 h-4 text-funnel-hot flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-funnel-hot">Confirm Applicator Removal</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Removing an applicator revokes their authorized contractor certification in the system.
                </p>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-text-secondary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-amber-500" />
                <span>Select Applicator to Remove</span>
              </label>
              <select
                aria-label="Select applicator to remove"
                value={selectedApplicatorId}
                onChange={(e) => setSelectedApplicatorId(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-funnel-hot transition cursor-pointer shadow-2xs font-medium"
              >
                {applicators.map((app) => (
                  <option key={app.id} value={app.id}>
                    {app.name} — {app.city} ({app.specialization})
                  </option>
                ))}
              </select>
            </div>

            {selectedApplicator && (
              <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl space-y-1.5 text-text-secondary">
                <div className="flex items-center justify-between text-text-primary font-bold">
                  <span>{selectedApplicator.name}</span>
                  <span className="text-[10px] font-mono text-text-tertiary flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {selectedApplicator.city}, {selectedApplicator.state}
                  </span>
                </div>
                <p className="text-[11px] text-text-secondary">{selectedApplicator.agency}</p>
                <p className="text-[11px] font-mono text-text-tertiary">{selectedApplicator.phone}</p>
              </div>
            )}

            <div className="flex justify-end space-x-3 pt-3 border-t border-border-subtle">
              <Button variant="ghost" size="sm" onClick={onClose}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={handleRemove}
                leftIcon={<Trash2 className="w-3.5 h-3.5" />}
                className="rounded-xl px-5"
              >
                Confirm Removal
              </Button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
