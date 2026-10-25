import React, { useState } from 'react';
import { Calendar, CheckCircle2 } from 'lucide-react';
import { Lead } from '../types/crm';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

interface ConfirmVisitModalProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onConfirmVisit: (appointment: {
    lead_id: string;
    lead_name: string;
    company: string;
    date: string;
    time: string;
    location: string;
    engineer: string;
    notes?: string;
  }) => void;
}

export const ConfirmVisitModal: React.FC<ConfirmVisitModalProps> = ({
  isOpen,
  onClose,
  lead,
  onConfirmVisit,
}) => {
  const { toast } = useToast();
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('11:00 AM');
  const [engineer, setEngineer] = useState(lead?.assigned_to || 'Vikram Mehta (Senior Sales Manager)');
  const [location, setLocation] = useState(lead?.location.address || lead?.location.city || '');
  const [notes, setNotes] = useState('Inspect concrete substrate moisture %, surface hardness, and coving junctions.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lead) return;
    onConfirmVisit({
      lead_id: lead.id,
      lead_name: lead.name,
      company: lead.company,
      date,
      time,
      location,
      engineer,
      notes,
    });
    toast({
      title: 'Site Visit Confirmed',
      message: `Technical audit booked for ${lead.name} on ${date} at ${time}.`,
      type: 'success',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen && !!lead}
      onClose={onClose}
      title="Schedule & Confirm Site Visit"
      subtitle="Book technical application engineer audit and concrete substrate inspection"
      icon={<Calendar className="w-5 h-5 text-brand-green" />}
      maxWidth="lg"
    >
      {!lead ? null : (
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="bg-surface-subtle p-3.5 rounded-xl border border-border-base space-y-1">
          <span className="font-bold block text-sm text-text-primary">{lead.name} ({lead.company})</span>
          <span className="text-text-secondary block">
            Area: {lead.location.area_sqft ? `${lead.location.area_sqft.toLocaleString()} sq ft` : 'N/A'} • City: {lead.location.city}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="font-bold text-text-secondary block mb-1">Visit Date</label>
            <input
              type="date"
              aria-label="Visit date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-surface-subtle border border-border-base rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-navy"
              required
            />
          </div>
          <div>
            <label className="font-bold text-text-secondary block mb-1">Time Slot</label>
            <select
              aria-label="Visit time slot"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full bg-surface-subtle border border-border-base rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-navy cursor-pointer"
            >
              <option value="10:00 AM">10:00 AM</option>
              <option value="11:30 AM">11:30 AM</option>
              <option value="02:30 PM">02:30 PM</option>
              <option value="04:00 PM">04:00 PM</option>
            </select>
          </div>
        </div>

        <div>
          <label className="font-bold text-text-secondary block mb-1">Field Engineer Assigned</label>
          <input
            type="text"
            value={engineer}
            onChange={(e) => setEngineer(e.target.value)}
            className="w-full bg-surface-subtle border border-border-base rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-navy"
            required
          />
        </div>

        <div>
          <label className="font-bold text-text-secondary block mb-1">Site Address</label>
          <textarea
            rows={2}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full bg-surface-subtle border border-border-base rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-navy"
            required
          />
        </div>

        <div>
          <label className="font-bold text-text-secondary block mb-1">Inspection Objectives & Substrate Testing</label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full bg-surface-subtle border border-border-base rounded-xl px-3 py-2 text-text-primary focus:outline-none focus:border-brand-navy"
          />
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-border-subtle">
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="success"
            size="sm"
            leftIcon={<CheckCircle2 className="w-4 h-4" />}
            className="rounded-xl px-5"
          >
            Confirm Site Inspection
          </Button>
        </div>
      </form>
      )}
    </Modal>
  );
};
