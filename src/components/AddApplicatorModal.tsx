import React, { useState } from 'react';
import { Plus, User, Building2, MapPin, Phone, Star, Award, Paintbrush } from 'lucide-react';
import type { Applicator } from '../types/crm';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { useToast } from '../context/ToastContext';

interface AddApplicatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddApplicator: (applicator: Omit<Applicator, 'id'>) => void;
  availableStates?: string[];
}

export const AddApplicatorModal: React.FC<AddApplicatorModalProps> = ({
  isOpen,
  onClose,
  onAddApplicator,
  availableStates: availableStatesProp,
}) => {
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [agency, setAgency] = useState('');
  const [specialization, setSpecialization] = useState('PU Concrete & Heavy Duty Epoxy');
  const [city, setCity] = useState('');
  const [state, setState] = useState('Karnataka');
  const [phone, setPhone] = useState('');
  const [experienceYears, setExperienceYears] = useState(5);

  const defaultStates = [
    'Karnataka',
    'Tamil Nadu',
    'Maharashtra',
    'Telangana',
    'Kerala',
    'Gujarat',
    'Andhra Pradesh',
    'Delhi NCR',
  ];

  const statesList = availableStatesProp && availableStatesProp.length > 0 ? availableStatesProp : defaultStates;

  const specializations = [
    'PU Concrete & Heavy Duty Epoxy',
    'Pharma Cleanroom & Anti-Static ESD',
    'PU Waterproofing & Concrete Repairs',
    'Automobile Assembly & Warehousing Flooring',
    'Polyurea Liquid Membrane & Terrace Screed',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !city.trim()) return;

    onAddApplicator({
      name: name.trim(),
      agency: agency.trim() || `${name.trim()} Coatings`,
      specialization,
      city: city.trim(),
      state,
      phone: phone.trim(),
      experienceYears: Number(experienceYears) || 5,
      rating: 4.8,
      verified: true,
    });

    toast({
      title: 'Applicator Certified',
      message: `${name.trim()} added to Certified Applicators (${city}).`,
      type: 'success',
    });

    setName('');
    setAgency('');
    setCity('');
    setPhone('');
    setExperienceYears(5);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Certified Applicator"
      subtitle="Register an authorized flooring contractor or waterproofing application crew"
      icon={<Paintbrush className="w-5 h-5 text-amber-500" />}
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="space-y-1.5">
          <label className="font-bold text-text-secondary flex items-center gap-1.5">
            <User className="w-3.5 h-3.5 text-amber-500" />
            <span>Contractor / Applicator Name</span>
            <span className="text-funnel-hot">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Precision Flooring Tech"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 transition shadow-2xs"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-text-secondary flex items-center gap-1.5">
            <Building2 className="w-3.5 h-3.5 text-blue-500" />
            <span>Agency / Enterprise Name</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Precision Industrial Applicators LLP"
            value={agency}
            onChange={(e) => setAgency(e.target.value)}
            className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 transition shadow-2xs"
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-bold text-text-secondary flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span>Primary Specialization</span>
          </label>
          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="w-full bg-surface-subtle border border-border-base text-text-primary rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500 transition cursor-pointer shadow-2xs"
          >
            {specializations.map((sp) => (
              <option key={sp} value={sp}>
                {sp}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-bold text-text-secondary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>City</span>
              <span className="text-funnel-hot">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Bengaluru"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 transition shadow-2xs"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-secondary flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span>State</span>
            </label>
            <select
              aria-label="State"
              value={state}
              onChange={(e) => setState(e.target.value)}
              className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary focus:outline-none focus:border-amber-500 transition cursor-pointer shadow-2xs font-medium"
            >
              {statesList.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label className="font-bold text-text-secondary flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-brand-green" />
              <span>WhatsApp / Phone</span>
              <span className="text-funnel-hot">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. +91 98450 11223"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 transition shadow-2xs font-mono"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="font-bold text-text-secondary flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-500" />
              <span>Experience (Years)</span>
            </label>
            <input
              type="number"
              min={1}
              max={40}
              value={experienceYears}
              onChange={(e) => setExperienceYears(Number(e.target.value))}
              className="w-full bg-surface-subtle border border-border-base rounded-xl px-3.5 py-2.5 text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-amber-500 transition shadow-2xs"
            />
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-3 border-t border-border-subtle">
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="brand"
            size="sm"
            leftIcon={<Plus className="w-3.5 h-3.5" />}
            className="rounded-xl px-5"
          >
            Add Applicator
          </Button>
        </div>
      </form>
    </Modal>
  );
};
