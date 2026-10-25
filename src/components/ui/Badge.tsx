import React from 'react';

export type BadgeVariant = 'hot' | 'warm' | 'nurture' | 'scope' | 'navy' | 'green' | 'neutral';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  pulse?: boolean;
  size?: 'xs' | 'sm' | 'md';
  icon?: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'neutral',
  pulse = false,
  size = 'sm',
  icon,
  className = '',
  ...rest
}) => {
  const variantStyles: Record<BadgeVariant, string> = {
    hot: 'bg-funnel-hotBg text-funnel-hot border-funnel-hotBorder shadow-2xs font-bold',
    warm: 'bg-funnel-warmBg text-funnel-warm border-funnel-warmBorder shadow-2xs font-bold',
    nurture: 'bg-funnel-nurtureBg text-funnel-nurture border-funnel-nurtureBorder shadow-2xs font-bold',
    scope: 'bg-funnel-scopeBg text-funnel-scope border-funnel-scopeBorder font-medium',
    navy: 'bg-brand-navy/15 text-brand-navy dark:text-blue-300 border-brand-navy/30 font-bold',
    green: 'bg-brand-green/15 text-brand-green dark:text-emerald-300 border-brand-green/30 font-bold',
    neutral: 'bg-surface-subtle text-text-secondary border-border-base font-medium',
  };

  const dotColor: Record<BadgeVariant, string> = {
    hot: 'bg-funnel-hot',
    warm: 'bg-funnel-warm',
    nurture: 'bg-funnel-nurture',
    scope: 'bg-funnel-scope',
    navy: 'bg-brand-navy dark:bg-blue-400',
    green: 'bg-brand-green dark:bg-emerald-400',
    neutral: 'bg-text-tertiary',
  };

  const sizeStyles = {
    xs: 'text-[10px] px-2 py-0.5 rounded-md gap-1',
    sm: 'text-xs px-2.5 py-0.5 rounded-full gap-1.5',
    md: 'text-sm px-3 py-1 rounded-full gap-2',
  };

  return (
    <span
      className={`inline-flex items-center border tracking-tight select-none ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...rest}
    >
      {pulse && (
        <span className="relative flex h-2 w-2 flex-shrink-0">
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${dotColor[variant]}`} />
          <span className={`relative inline-flex rounded-full h-2 w-2 ${dotColor[variant]}`} />
        </span>
      )}
      {icon && <span className="flex-shrink-0">{icon}</span>}
      <span className="truncate">{children}</span>
    </span>
  );
};
