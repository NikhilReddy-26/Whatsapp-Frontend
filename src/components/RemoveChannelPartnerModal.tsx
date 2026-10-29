import React, { useState } from 'react';
import { Trash2, AlertTriangle, User, MapPin } from 'lucide-react';
import type { ChannelPartner } from '../types/crm';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

interface RemoveChannelPartnerModalProps {
  isOpen: boolean;
  onClose: () => void;
  partners: ChannelPartner[];
  onRemovePartner: (partnerId: string) => Promise<void> | void;
}

export const RemoveChannelPartnerModal: React.FC<RemoveChannelPartnerModalProps> = ({
  isOpen,
  onClose,
  partners,
  onRemovePartner,
}) => {
  const { toast } = useToast();
  const [selectedPartnerId, setSelectedPartnerId] = useState(partners[0]?.id || '');

  const selectedPartner = partners.find((p) => p.id === selectedPartnerId);

  const handleRemove = async () => {
    if (!selectedPartnerId || !selectedPartner) return;

    try {
      await onRemovePartner(selectedPartnerId);
    } catch (err) {
      toast({
        title: 'Could Not Remove Partner',
        message: err instanceof Error ? err.message : 'Please try again.',
        type: 'error',
      });
      return;
    }

    toast({
      title: 'Partner Removed',
      message: `${selectedPartner.name} removed from active channel partner network.`,
      type: 'warning',
    });

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Remove Channel Partner"
      subtitle="Revoke distributor or sales representative authorization"
      icon={<Trash2 className="w-5 h-5 text-funnel-hot" />}
      maxWidth="md"
    >
      <div className="space-y-4 text-xs">
        {partners.length === 0 ? (
          <p className="text-text-secondary py-4 text-center">No channel partners to remove.</p>
        ) : (
          <>
            <div className="p-3 bg-funnel-hot/10 border border-funnel-hot/20 rounded-xl flex items-start gap-2.5 text-text-primary">
              <AlertTriangle className="w-4 h-4 text-funnel-hot flex-shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-funnel-hot">Confirm Partner Removal</p>
                <p className="text-[11px] text-text-secondary leading-relaxed">
                  Removing a channel partner unlinks them from active lead routing and territory assignments.
                </p>
              </div>
            </div>

            {/* Select Partner Dropdown */}
            <div className="space-y-1.5">
              <label className="font-bold text-text-secondary flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-brand-navy dark:text-blue-400" />
                <span>Select Partner to Remove</span>
              </label>
              <select
                aria-label="Select partner to remove"
                value={selectedPartnerId}
                onChange={(e) => setSelectedPartnerId(e.target.value)}
                className="w-full bg-surface-subtle border border-border-base text-text-primary rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-funnel-hot transition cursor-pointer shadow-2xs font-medium"
              >
                {partners.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.role} ({p.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Partner Details Preview */}
            {selectedPartner && (
              <div className="p-3 bg-surface-subtle border border-border-subtle rounded-xl space-y-1.5 text-text-secondary">
                <div className="flex items-center justify-between text-text-primary font-bold">
                  <span>{selectedPartner.name}</span>
                  <span className="text-[10px] font-mono text-text-tertiary flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-rose-400" />
                    {selectedPartner.state}
                  </span>
                </div>
                <p className="text-[11px]">{selectedPartner.role}</p>
                <p className="text-[11px] font-mono text-text-tertiary">{selectedPartner.whatsapp_number}</p>
              </div>
            )}

            {/* Actions */}
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
