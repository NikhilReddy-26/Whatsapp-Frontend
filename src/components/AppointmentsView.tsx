import React from 'react';
import { Calendar, MapPin, User, Clock, CheckCircle2, Plus } from 'lucide-react';
import { Appointment } from '../types/crm';

interface AppointmentsViewProps {
  appointments: Appointment[];
  onOpenConfirmVisit: () => void;
}

export const AppointmentsView: React.FC<AppointmentsViewProps> = ({
  appointments,
  onOpenConfirmVisit,
}) => {
  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-panel border border-brand-border rounded-[18px] p-5">
        <div>
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-xs uppercase tracking-wider mb-1">
            <Calendar className="w-4 h-4" />
            <span>Field Inspections & Schedule</span>
          </div>
          <h2 className="text-2xl font-black text-brand-text">Site Visit Appointments</h2>
          <p className="text-xs text-brand-muted mt-1">
            Confirmed application engineer site inspections, concrete substrate moisture testing, and technical audits.
          </p>
        </div>

        <button
          onClick={onOpenConfirmVisit}
          className="bg-cp-navy hover:bg-cp-navyHover text-white text-xs font-semibold px-5 py-2.5 rounded-full transition shadow-sm flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Site Visit</span>
        </button>
      </div>

      {/* APPOINTMENTS CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.map((app) => (
          <div
            key={app.id}
            className="bg-brand-panel border border-brand-border hover:border-brand-borderLight rounded-[18px] p-5 space-y-3.5 shadow-sm transition flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  {app.status.toUpperCase()}
                </span>
                <span className="text-xs font-mono text-brand-muted flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" /> {app.time}
                </span>
              </div>

              <div>
                <h3 className="text-base font-bold text-brand-text">{app.lead_name}</h3>
                <p className="text-xs text-brand-muted font-medium">{app.company}</p>
              </div>
            </div>

            <div className="space-y-2 text-xs pt-2 border-t border-brand-border">
              <div className="flex items-start space-x-2 text-brand-text">
                <MapPin className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                <span className="leading-snug">{app.location}</span>
              </div>

              <div className="flex items-center space-x-2 text-brand-muted">
                <User className="w-4 h-4 text-blue-400 flex-shrink-0" />
                <span>Engineer: <strong className="text-brand-text">{app.engineer}</strong></span>
              </div>

              {app.notes && (
                <div className="bg-brand-body p-2.5 rounded-xl border border-brand-border text-brand-muted text-[11px] leading-relaxed">
                  "{app.notes}"
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-between text-xs text-brand-subtle font-semibold">
              <span>Date: {app.date}</span>
              <button className="text-cp-navy hover:underline">View Lead Details →</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
