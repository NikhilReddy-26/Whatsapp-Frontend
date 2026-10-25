import React, { useEffect, useState } from 'react';
import { useReducedMotion } from 'motion/react';

export interface AnimatedNumberProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export const AnimatedNumber: React.FC<AnimatedNumberProps> = ({
  value,
  duration = 1000,
  prefix = '',
  suffix = '',
  decimals = 0,
  className = '',
}) => {
  const shouldReduceMotion = useReducedMotion();
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (shouldReduceMotion) {
      return;
    }

    let start = 0;
    const startTime = performance.now();
    let frameId: number;

    const updateCount = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Ease-out Expo curve for premium mechanical feel
      const ease = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current = start + (value - start) * ease;

      setDisplayValue(current);

      if (progress < 1) {
        frameId = requestAnimationFrame(updateCount);
      } else {
        setDisplayValue(value);
      }
    };

    frameId = requestAnimationFrame(updateCount);

    return () => {
      cancelAnimationFrame(frameId);
    };
  }, [value, duration, shouldReduceMotion]);

  const currentVal = shouldReduceMotion ? value : displayValue;
  const formatted = decimals > 0 ? currentVal.toFixed(decimals) : Math.round(currentVal).toString();

  return (
    <span className={`tabular-nums font-mono select-none ${className}`}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};
