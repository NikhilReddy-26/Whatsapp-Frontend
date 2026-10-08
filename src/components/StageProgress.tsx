import React from 'react';
import { PipelineStage } from '../types/crm';
import { Check } from 'lucide-react';

interface StageProgressProps {
  currentStage: PipelineStage;
  onSelectStage: (stage: PipelineStage) => void;
}

const STAGES: PipelineStage[] = ['Lead', 'Qualified', 'Visit', 'Quote', 'Follow-up', 'Won'];

export const StageProgress: React.FC<StageProgressProps> = ({ currentStage, onSelectStage }) => {
  const currentIndex = STAGES.indexOf(currentStage);

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold uppercase tracking-wider text-brand-muted">
          Pipeline Stage Progression
        </h4>
        <span className="text-xs font-bold text-emerald-400">
          {currentStage}
        </span>
      </div>

      <div className="grid grid-cols-6 gap-1">
        {STAGES.map((stage, idx) => {
          const isDone = idx < currentIndex;
          const isCurrent = idx === currentIndex;

          return (
            <button
              key={stage}
              onClick={() => onSelectStage(stage)}
              title={`Click to set stage to ${stage}`}
              className={`flex flex-col items-center py-2 px-1 rounded-lg border text-center transition ${
                isCurrent
                  ? 'bg-cp-navy text-white border-blue-400 font-bold shadow-md'
                  : isDone
                  ? 'bg-emerald-950/40 text-emerald-400 border-emerald-500/40 font-medium'
                  : 'bg-brand-body text-brand-muted border-brand-border hover:bg-brand-panelHover'
              }`}
            >
              <div className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] mb-1">
                {isDone ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <span>{idx + 1}</span>
                )}
              </div>
              <span className="text-[10px] truncate w-full">{stage}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
