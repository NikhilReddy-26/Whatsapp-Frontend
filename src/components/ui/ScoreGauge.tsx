import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { AnimatedNumber } from './AnimatedNumber';
import type { FunnelCategory } from '../../types/crm';

export interface ScoreGaugeProps {
  score: number;
  funnel?: FunnelCategory;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const ScoreGauge: React.FC<ScoreGaugeProps> = ({
  score,
  funnel,
  size = 110,
  strokeWidth = 9,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const radius = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(score, 0), 100) / 100;
  const strokeDashoffset = circumference - progress * circumference;

  const getGaugeColor = () => {
    switch (funnel) {
      case 'HOT':
        return {
          stroke: 'var(--funnel-hot)',
          glow: 'rgba(239, 68, 68, 0.35)',
        };
      case 'WARM':
        return {
          stroke: 'var(--funnel-warm)',
          glow: 'rgba(245, 158, 11, 0.35)',
        };
      case 'NURTURE':
        return {
          stroke: 'var(--funnel-nurture)',
          glow: 'rgba(16, 185, 129, 0.35)',
        };
      case 'OUT_OF_SCOPE':
      default:
        return {
          stroke: 'var(--funnel-scope)',
          glow: 'rgba(100, 116, 139, 0.25)',
        };
    }
  };

  const { stroke, glow } = getGaugeColor();

  return (
    <div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-border-base/50"
        />

        {/* Animated Fill Arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={stroke}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: shouldReduceMotion ? strokeDashoffset : circumference }}
          animate={{ strokeDashoffset }}
          transition={{
            duration: shouldReduceMotion ? 0 : 1.2,
            ease: [0.16, 1, 0.3, 1],
          }}
          strokeLinecap="round"
          fill="transparent"
          style={{
            filter: `drop-shadow(0 0 6px ${glow})`,
          }}
        />
      </svg>

      {/* Center Score & Details */}
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <AnimatedNumber
          value={score}
          duration={1100}
          className="text-2xl font-black text-text-primary tracking-tight leading-none"
        />
        <span className="text-[10px] font-mono font-semibold text-text-tertiary mt-0.5">
          / 100
        </span>
      </div>
    </div>
  );
};
