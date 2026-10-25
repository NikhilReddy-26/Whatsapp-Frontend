import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AnimatedTextProps {
  text: string;
  className?: string;
  wordClassName?: string;
  delay?: number;
  stagger?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'span' | 'div' | 'p';
  splitBy?: 'words' | 'characters';
  rotationAngle?: number;
  blur?: boolean;
}

export const AnimatedText: React.FC<AnimatedTextProps> = ({
  text,
  className = '',
  wordClassName = '',
  delay = 0.1,
  stagger = 0.06,
  as = 'div',
  splitBy = 'words',
  rotationAngle = -55,
  blur = true,
}) => {
  const shouldReduceMotion = useReducedMotion();

  if (splitBy === 'characters') {
    const chars = text.split('');
    const Tag = motion[as] as any;

    return (
      <Tag className={`inline-flex flex-wrap ${className}`}>
        {chars.map((char, index) => {
          const isSpace = char === ' ';
          const initialRotation = index % 2 === 0 ? rotationAngle : -rotationAngle;

          return (
            <motion.span
              key={`${char}-${index}`}
              initial={
                shouldReduceMotion
                  ? { opacity: 1 }
                  : {
                    opacity: 0,
                    y: 20,
                    rotate: initialRotation,
                    scale: 0.3,
                    filter: blur ? 'blur(4px)' : 'none',
                  }
              }
              animate={{
                opacity: 1,
                y: 0,
                rotate: 0,
                scale: 1,
                filter: 'blur(0px)',
              }}
              transition={{
                type: 'spring',
                stiffness: 420,
                damping: 24,
                delay: shouldReduceMotion ? 0 : delay + index * stagger,
              }}
              className={`inline-block origin-bottom transform-gpu ${isSpace ? 'w-1.5' : ''} ${wordClassName}`}
            >
              {char}
            </motion.span>
          );
        })}
      </Tag>
    );
  }

  // Split by words
  const words = text.split(' ');
  const Tag = as as any;

  return (
    <Tag className={`flex flex-wrap gap-x-2 gap-y-1 ${className}`}>
      {words.map((word, index) => (
        <motion.span
          key={`${word}-${index}`}
          initial={
            shouldReduceMotion
              ? { opacity: 1 }
              : {
                opacity: 0,
                y: 28,
                rotateX: rotationAngle,
                scale: 0.9,
                filter: blur ? 'blur(4px)' : 'none',
              }
          }
          animate={{
            opacity: 1,
            y: 0,
            rotateX: 0,
            scale: 1,
            filter: 'blur(0px)',
          }}
          transition={{
            type: 'spring',
            stiffness: 380,
            damping: 24,
            delay: shouldReduceMotion ? 0 : delay + index * stagger,
          }}
          className={`inline-block origin-bottom transform-gpu ${wordClassName}`}
        >
          {word}
        </motion.span>
      ))}
    </Tag>
  );
};
