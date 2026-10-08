import React, { useState } from 'react';
import { X, Calendar, MapPin, User, CheckCircle2 } from 'lucide-react';
import { Lead } from '../types/crm';

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
  if (!isOpen || !lead) return null;

  const [date, setDate] = useState('2026-10-09');
  const [time, setTime] = useState('11:00 AM');
  const [engineer, setEngineer] = useState(lead.assigned_to || 'Vikram Mehta (Senior Sales Manager)');
  const [location, setLocation] = useState(lead.location.address || lead.location.city);
  const [notes, setNotes] = useState('Inspect concrete substrate moisture %, surface hardness, and coving junctions.');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirmVisit({
      lead_id: lead.id,
      lead_name: lead.name,
      company: lead.company,
      date,
      time,
      location,
      engineer,
      notes
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-brand-panel border border-brand-border rounded-[24px] max-w-lg w-full p-6 space-y-5 shadow-2xl text-brand-text">
        <div className="flex items-center justify-between border-b border-brand-border pb-3">
          <div className="flex items-center space-x-2">
            <Calendar className="w-5 h-5 text-emerald-400" />
            <h3 className="text-base font-bold">Schedule & Confirm Site Visit</h3>
          </div>
          <button onClick={onClose} className="p-1 text-brand-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="bg-brand-body p-3 rounded-xl border border-brand-border space-y-1">
            <span className="font-bold block text-sm text-white">{lead.name} ({lead.company})</span>
            <span className="text-brand-muted block">Area: {lead.location.area_sqft ? `${lead.location.area_sqft} sq ft` : 'N/A'} • City: {lead.location.city}</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-brand-muted block mb-1">Visit Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-brand-body border border-brand-border rounded-xl px-3 py-2 text-brand-text focus:outline-none focus:border-cp-navy"
                required
              />
            </div>
            <div>
              <label className="font-bold text-brand-muted block mb-1">Time Slot</label>
              <select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-brand-body border border-brand-border rounded-xl px-3 py-2 text-brand-text focus:outline-none focus:border-cp-navy"
              >
                <option value="10:00 AM">10:00 AM</option>
                <option value="11:30 AM">11:30 AM</option>
                <option value="02:30 PM">02:30 PM</option>
                <option value="04:00 PM">04:00 PM</option>
              </select>
            </div>
          </div>

          <div>
            <label className="font-bold text-brand-muted block mb-1">Field Engineer Assigned</label>
            <input
              type="text"
              value={engineer}
              onChange={(e) => setEngineer(e.target.value)}
              className="w-full bg-brand-body border border-brand-border rounded-xl px-3 py-2 text-brand-text focus:outline-none focus:border-cp-navy"
              required
            />
          </div>

          <div>
            <label className="font-bold text-brand-muted block mb-1">Site Address</label>
            <textarea
              rows={2}
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-brand-body border border-brand-border rounded-xl px-3 py-2 text-brand-text focus:outline-none focus:border-cp-navy"
              required
            />
          </div>

          <div>
            <label className="font-bold text-brand-muted block mb-1">Inspection Objectives & Notes</label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full bg-brand-body border border-brand-border rounded-xl px-3 py-2 text-brand-text focus:outline-none focus:border-cp-navy"
            />
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
              className="px-5 py-2 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirm Site Inspection</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
