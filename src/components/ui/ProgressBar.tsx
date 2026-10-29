import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValues?: boolean;
  color?: string;
  delay?: number;
  height?: number;
  className?: string;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showValues = true,
  color = 'var(--brand-navy)',
  delay = 0,
  height = 6,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const safeMax = max > 0 ? max : 1;
  const percentage = Math.min(Math.max((value / safeMax) * 100, 0), 100);

  return (
    <div className={`space-y-1.5 ${className}`}>
      {(label || showValues) && (
        <div className="flex items-center justify-between text-xs font-medium">
          {label && <span className="text-text-secondary truncate">{label}</span>}
          {showValues && (
            <span className="font-mono text-text-tertiary tabular-nums ml-2 flex-shrink-0">
              <span className="font-bold text-text-primary">{value}</span> / {max}
            </span>
          )}
        </div>
      )}

      <div
        className="w-full bg-border-base/40 rounded-full overflow-hidden"
        style={{ height }}
      >
        <motion.div
          initial={{ width: shouldReduceMotion ? `${percentage}%` : '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: shouldReduceMotion ? 0 : 0.8,
            delay: shouldReduceMotion ? 0 : delay,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="h-full rounded-full transition-colors"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
};
