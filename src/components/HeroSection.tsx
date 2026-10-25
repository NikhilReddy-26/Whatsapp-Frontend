import React, { useState, useRef, useEffect } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import type { ActivePageView } from '../types/crm';
import { fadeInUp, staggerContainer } from '../lib/motion';

interface HeroSectionProps {
  activePage: ActivePageView;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activePage }) => {
  const shouldReduceMotion = useReducedMotion();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.defaultMuted = true;
      videoRef.current.muted = true;
      videoRef.current.play().catch(() => {
        // Autoplay may be deferred by browser power-saving policies
      });
    }
  }, []);

  if (activePage !== 'desk') return null;

  return (
    <div className="relative overflow-hidden bg-canvas border-b border-border-subtle pt-10 pb-9 transition-colors duration-300">
      {/* Background Video Layer without sound (Camera gliding over epoxy floor) */}
      {!hasVideoError && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setHasVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover contrast-[1.08] saturate-[1.08] brightness-[1.05] transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-100 dark:opacity-95' : 'opacity-0'
            }`}
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/epoxy-floor-bg.mp4" type="video/mp4" />
            <source src="/Camera_gliding_over_epoxy_floor_20261023154013.mp4" type="video/mp4" />
          </video>

          {/* Left-to-Right Contrast Scrim: Protects text readability on left while keeping video 100% crisp & visible on right */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#f6f8fb]/95 via-[#f6f8fb]/55 to-transparent dark:from-[#070d18]/95 dark:via-[#070d18]/60 dark:to-transparent transition-colors duration-300" />

          {/* Subtle Top & Bottom Feather: Clean seamless blend with header and KPI cards */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#f6f8fb]/30 via-transparent to-[#f6f8fb]/35 dark:from-[#070d18]/30 dark:via-transparent dark:to-[#070d18]/40 transition-colors duration-300" />
        </div>
      )}

      {/* Fallback Mesh Gradient ONLY if video is loading or disabled */}
      {(!isVideoLoaded || hasVideoError) && (
        <div className="absolute inset-0 mesh-gradient opacity-60 pointer-events-none" />
      )}

      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Decorative Floating Squares echoing ColourPlus Tri-Square Logo */}
        {!shouldReduceMotion && (
          <div className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none opacity-25 dark:opacity-35 hidden md:block">
            <motion.div
              animate={{
                y: [-6, 6, -6],
                rotate: [0, 4, 0],
              }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
              className="relative w-48 h-48"
            >
              {/* Green Square */}
              <div className="absolute bottom-4 left-4 w-24 h-24 rounded-2xl bg-brand-green/40 blur-xl" />
              {/* Navy Square */}
              <div className="absolute inset-8 w-24 h-24 rounded-2xl bg-brand-navy/60 blur-xl" />
              {/* Red Square */}
              <div className="absolute top-4 right-4 w-24 h-24 rounded-2xl bg-brand-red/40 blur-xl" />
            </motion.div>
          </div>
        )}

        <motion.div
          variants={staggerContainer(0.08)}
          initial="initial"
          animate="animate"
          className="space-y-4 relative z-10"
        >
          {/* Large Headline with Rotating Word Entrance */}
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-[1.16] sm:leading-[1.14] text-text-primary drop-shadow-[0_1px_2px_rgba(0,0,0,0.06)] dark:drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">
            <div className="flex flex-wrap gap-x-3 gap-y-1">
              {['Transforming', 'Every', 'Lead'].map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 32, rotateX: -55, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 24,
                    delay: 0.18 + i * 0.12,
                  }}
                  className="inline-block origin-bottom transform-gpu py-0.5"
                >
                  {word}
                </motion.span>
              ))}
            </div>
            <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-1 sm:mt-2">
              {['Into', 'a', 'Valuable', 'Business', 'Deal.'].map((word, i) => (
                <motion.span
                  key={`${word}-${i}`}
                  initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 32, rotateX: -55, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
                  transition={{
                    type: 'spring',
                    stiffness: 380,
                    damping: 24,
                    delay: 0.44 + i * 0.08,
                  }}
                  className="inline-block origin-bottom transform-gpu pt-1 pb-3 -mb-3 bg-gradient-to-r from-brand-navy to-blue-500 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent"
                >
                  {word}
                </motion.span>
              ))}
            </div>
          </h1>

          {/* Subtitle */}
          <motion.p
            variants={fadeInUp}
            className="text-sm sm:text-base text-text-secondary max-w-2xl font-normal leading-relaxed pt-1 drop-shadow-sm dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
          >
            Discover high-potential prospects, unlock commercial opportunities, and manage every lead through one powerful, data-driven dashboard.
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};
