import type { Variants } from 'motion/react';

// Custom Easing Curves
export const EASINGS = {
  easeOutExpo: [0.16, 1, 0.3, 1] as const,
  easeInOutExpo: [0.87, 0, 0.13, 1] as const,
  easeOutQuart: [0.25, 1, 0.5, 1] as const,
};

// Common Spring Configurations
export const SPRINGS = {
  tight: { type: 'spring', stiffness: 400, damping: 32 } as const,
  bouncy: { type: 'spring', stiffness: 340, damping: 22 } as const,
  gentle: { type: 'spring', stiffness: 220, damping: 28 } as const,
  snappy: { type: 'spring', stiffness: 500, damping: 35 } as const,
};

// Global Page Transition (mode="wait")
export const pageVariants: Variants = {
  initial: {
    opacity: 0,
    y: 10,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: EASINGS.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.2,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// Stagger Container
export const staggerContainer = (staggerDelay = 0.05, delayChildren = 0): Variants => ({
  initial: {},
  animate: {
    transition: {
      staggerChildren: staggerDelay,
      delayChildren,
    },
  },
});

// Fade In Up item
export const fadeInUp: Variants = {
  initial: { opacity: 0, y: 14 },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: EASINGS.easeOutExpo,
    },
  },
};

// 3D Perspective Card Entrance with Spring Physics
export const perspectiveCardIn: Variants = {
  initial: { opacity: 0, y: 28, rotateX: -16, scale: 0.95, filter: 'blur(3px)' },
  animate: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 350,
      damping: 25,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

// Rotating Badge Pop-in
export const rotateBadgeIn: Variants = {
  initial: { opacity: 0, scale: 0.6, rotate: -22 },
  animate: {
    opacity: 1,
    scale: 1,
    rotate: 0,
    transition: {
      type: 'spring',
      stiffness: 440,
      damping: 20,
    },
  },
};

// Fade In Scale (cards, badges)
export const scaleIn: Variants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.25,
      ease: EASINGS.easeOutExpo,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: { duration: 0.15 },
  },
};

// Modal Backdrop
export const modalBackdropVariants: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

// Modal Panel
export const modalPanelVariants: Variants = {
  initial: { opacity: 0, scale: 0.94, y: 18 },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 12,
    transition: {
      duration: 0.18,
      ease: [0.4, 0, 1, 1],
    },
  },
};

// Sticky Bulk Bar spring up
export const stickyBarVariants: Variants = {
  initial: { opacity: 0, y: 60, scale: 0.96 },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      stiffness: 360,
      damping: 26,
    },
  },
  exit: {
    opacity: 0,
    y: 40,
    scale: 0.96,
    transition: { duration: 0.2 },
  },
};

// Chat message entrance variants with 3D perspective rotation
export const messageInCustomer: Variants = {
  initial: { opacity: 0, x: -16, y: 12, rotateX: -14, filter: 'blur(2px)' },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 28,
    },
  },
};

export const messageInAgent: Variants = {
  initial: { opacity: 0, x: 16, y: 12, rotateX: -14, filter: 'blur(2px)' },
  animate: {
    opacity: 1,
    x: 0,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 380,
      damping: 28,
    },
  },
};

export const messageInSystem: Variants = {
  initial: { opacity: 0, scale: 0.94, y: 10, rotateX: -12, filter: 'blur(2px)' },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 28,
    },
  },
};
