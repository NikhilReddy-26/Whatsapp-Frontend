import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'brand';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  className = '',
  disabled,
  onClick,
  type = 'button',
  ...rest
}) => {
  const shouldReduceMotion = useReducedMotion();

  const variantStyles = {
    primary:
      'bg-brand-navy hover:bg-brand-navyHover text-white shadow-elevation-1 hover:shadow-glow-navy border border-white/10',
    secondary:
      'bg-surface hover:bg-surface-hover text-text-primary border border-border-base hover:border-border-strong shadow-elevation-1',
    ghost:
      'bg-transparent hover:bg-surface-hover text-text-secondary hover:text-text-primary',
    danger:
      'bg-brand-red hover:bg-red-600 text-white shadow-elevation-1 hover:shadow-glow-hot border border-white/10',
    success:
      'bg-brand-green hover:bg-emerald-600 text-white shadow-elevation-1 hover:shadow-glow-green border border-white/10',
    brand:
      'bg-gradient-to-r from-brand-navy to-brand-navyHover text-white shadow-elevation-2 hover:shadow-glow-navy border border-white/15',
  };

  const sizeStyles = {
    xs: 'px-2.5 py-1 text-xs rounded-lg gap-1.5',
    sm: 'px-3.5 py-1.5 text-xs font-semibold rounded-xl gap-1.5',
    md: 'px-4 py-2 text-sm font-semibold rounded-xl gap-2',
    lg: 'px-6 py-2.5 text-base font-bold rounded-2xl gap-2.5',
  };

  return (
    <motion.button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      whileHover={shouldReduceMotion || disabled ? undefined : { scale: 1.015 }}
      whileTap={shouldReduceMotion || disabled ? undefined : { scale: 0.97 }}
      className={`relative inline-flex items-center justify-center font-sans tracking-tight transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed select-none focus:outline-none focus:ring-2 focus:ring-brand-navy/60 focus:ring-offset-1 focus:ring-offset-canvas ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
      {...(rest as any)}
    >
      {isLoading ? (
        <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin flex-shrink-0" />
      ) : (
        leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
      )}
      <span>{children}</span>
      {!isLoading && rightIcon && <span className="flex-shrink-0">{rightIcon}</span>}
    </motion.button>
  );
};
