import React from 'react';
import { Calendar, PhoneCall, FileText, ArrowRight, Clock } from 'lucide-react';
import { NextAction as NextActionType } from '../types/crm';

interface NextActionProps {
  action: NextActionType;
  onExecuteAction: () => void;
}

export const NextAction: React.FC<NextActionProps> = ({ action, onExecuteAction }) => {
  const getIcon = () => {
    switch (action.type) {
      case 'visit':
        return <Calendar className="w-4 h-4 text-emerald-400" />;
      case 'call':
        return <PhoneCall className="w-4 h-4 text-blue-400" />;
      case 'quote':
        return <FileText className="w-4 h-4 text-amber-400" />;
      default:
        return <Clock className="w-4 h-4 text-brand-muted" />;
    }
  };

  return (
    <div className="bg-brand-body border border-cp-navy/40 rounded-xl p-3.5 space-y-2.5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-bold uppercase tracking-wider text-cp-navy bg-cp-navy/10 px-2 py-0.5 rounded border border-cp-navy/30 flex items-center gap-1">
          {getIcon()}
          AI Recommended Action
        </span>
        {action.due_date && (
          <span className="text-[11px] font-medium text-amber-400">
            Due: {action.due_date}
          </span>
        )}
      </div>

      <div>
        <h4 className="text-sm font-bold text-brand-text">{action.title}</h4>
        <p className="text-xs text-brand-muted mt-0.5">{action.description}</p>
      </div>

      <button
        onClick={onExecuteAction}
        className="w-full bg-cp-navy hover:bg-cp-navyHover text-white text-xs font-semibold py-2 rounded-lg transition flex items-center justify-center gap-1.5 shadow-sm"
      >
        <span>Execute Recommended Action</span>
        <ArrowRight className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
