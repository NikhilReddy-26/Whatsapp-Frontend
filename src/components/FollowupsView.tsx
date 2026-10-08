import React, { useState } from 'react';
import { CheckSquare, Clock, AlertCircle, Plus, CheckCircle, User } from 'lucide-react';
import { Followup } from '../types/crm';

interface FollowupsViewProps {
  followups: Followup[];
  onToggleStatus: (id: string) => void;
  onCreateFollowup: (fol: { lead_id: string; lead_name: string; title: string; due_date: string; priority: 'high' | 'medium' | 'low'; assigned_to: string }) => void;
}

export const FollowupsView: React.FC<FollowupsViewProps> = ({
  followups,
  onToggleStatus,
  onCreateFollowup,
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('pending');

  const filtered = followups.filter((f) => {
    if (filter === 'pending') return f.status === 'pending';
    if (filter === 'completed') return f.status === 'completed';
    return true;
  });

  return (
    <div className="max-w-[1600px] mx-auto p-4 sm:p-6 space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-brand-panel border border-brand-border rounded-[18px] p-5">
        <div>
          <div className="flex items-center space-x-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
            <CheckSquare className="w-4 h-4" />
            <span>Task Management & Follow-ups</span>
          </div>
          <h2 className="text-2xl font-black text-brand-text">Sales Follow-up Action List</h2>
          <p className="text-xs text-brand-muted mt-1">
            Track commercial quote deliveries, technical document follow-ups, and budget reviews with exact due dates.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-2 bg-brand-body p-1 rounded-full border border-brand-border text-xs">
          <button
            onClick={() => setFilter('pending')}
            className={`px-3 py-1.5 rounded-full transition font-semibold ${
              filter === 'pending' ? 'bg-cp-navy text-white' : 'text-brand-muted hover:text-white'
            }`}
          >
            Pending ({followups.filter((f) => f.status === 'pending').length})
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-full transition font-semibold ${
              filter === 'completed' ? 'bg-cp-navy text-white' : 'text-brand-muted hover:text-white'
            }`}
          >
            Completed ({followups.filter((f) => f.status === 'completed').length})
          </button>
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-full transition font-semibold ${
              filter === 'all' ? 'bg-cp-navy text-white' : 'text-brand-muted hover:text-white'
            }`}
          >
            All
          </button>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="bg-brand-panel border border-brand-border rounded-[18px] overflow-hidden divide-y divide-brand-border">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-brand-muted text-sm">
            No follow-up tasks match current view.
          </div>
        ) : (
          filtered.map((fol) => {
            const isCompleted = fol.status === 'completed';
            const isHighPriority = fol.priority === 'high';

            return (
              <div
                key={fol.id}
                className={`p-4 flex items-center justify-between gap-4 transition ${
                  isCompleted ? 'bg-brand-body/50 opacity-70' : 'hover:bg-brand-panelHover'
                }`}
              >
                <div className="flex items-center space-x-3.5 flex-1 min-w-0">
                  <button
                    onClick={() => onToggleStatus(fol.id)}
                    className={`w-6 h-6 rounded-lg border flex items-center justify-center transition flex-shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500 border-emerald-400 text-white'
                        : 'border-brand-borderLight bg-brand-body hover:border-cp-navy'
                    }`}
                  >
                    {isCompleted && <CheckCircle className="w-4 h-4" />}
                  </button>

                  <div className="truncate space-y-0.5">
                    <h3
                      className={`text-sm font-bold text-brand-text truncate ${
                        isCompleted ? 'line-through text-brand-muted' : ''
                      }`}
                    >
                      {fol.title}
                    </h3>
                    <p className="text-xs text-brand-muted truncate">
                      Lead: <strong className="text-brand-text">{fol.lead_name}</strong> • Assigned: {fol.assigned_to}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0 text-xs">
                  <span
                    className={`px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] border ${
                      isHighPriority
                        ? 'bg-funnel-hotBg text-cp-red border-funnel-hotBorder'
                        : 'bg-brand-body text-brand-muted border-brand-border'
                    }`}
                  >
                    {fol.priority}
                  </span>

                  <span className="text-brand-muted font-medium flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    {fol.due_date}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
