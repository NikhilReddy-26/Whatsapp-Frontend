import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  elevation?: 1 | 2 | 3;
  interactive?: boolean;
  gloss?: boolean;
  glow?: 'none' | 'hot' | 'navy' | 'green';
}

export const Card: React.FC<CardProps> = ({
  children,
  elevation = 1,
  interactive = false,
  gloss = false,
  glow = 'none',
  className = '',
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  const elevationClasses = {
    1: 'bg-surface border border-border-subtle shadow-elevation-1',
    2: 'bg-surface-elevated border border-border-base shadow-elevation-2',
    3: 'bg-surface-elevated border border-border-strong shadow-elevation-3',
  };

  const glowClasses = {
    none: '',
    hot: 'shadow-glow-hot border-funnel-hotBorder',
    navy: 'shadow-glow-navy border-brand-navy/30',
    green: 'shadow-glow-green border-brand-green/30',
  };

  return (
    <motion.div
      whileHover={
        interactive && !shouldReduceMotion
          ? { y: -2, transition: { duration: 0.2 } }
          : undefined
      }
      className={`rounded-card transition-colors duration-200 ${elevationClasses[elevation]} ${glowClasses[glow]} ${gloss ? 'epoxy-gloss' : ''} ${className}`}
      {...(rest as any)}
    >
      {children}
    </motion.div>
  );
};
