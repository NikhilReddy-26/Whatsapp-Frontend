import React, { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface AnimatedLogoProps {
  className?: string;
  onClick?: () => void;
  layout?: 'horizontal' | 'stacked';
}

export const AnimatedLogo: React.FC<AnimatedLogoProps> = ({
  className = '',
  onClick,
  layout = 'horizontal',
}) => {
  const [replayKey, setReplayKey] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleLogoClick = () => {
    // Replay intro animation on click
    setReplayKey((prev) => prev + 1);
    if (onClick) onClick();
  };

  const isStacked = layout === 'stacked';

  // Letters configuration matching ColourPlus brand:
  // 'C' is Red, 'olour' is Navy (White in dark), 'P' is Red, 'lus' is Navy (White in dark)
  const letters = [
    { char: 'C', isRed: true },
    { char: 'o', isRed: false },
    { char: 'l', isRed: false },
    { char: 'o', isRed: false },
    { char: 'u', isRed: false },
    { char: 'r', isRed: false },
    { char: 'P', isRed: true },
    { char: 'l', isRed: false },
    { char: 'u', isRed: false },
    { char: 's', isRed: false },
  ];

  return (
    <motion.div
      key={replayKey}
      onClick={handleLogoClick}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`relative inline-flex ${
        isStacked ? 'flex-col items-center justify-center text-center' : 'items-center'
      } select-none cursor-pointer group ${className}`}
      title="ColourPlus Polyurethanes | Click to replay animation"
    >
      {/* 1. TRI-SQUARE BRAND MARK (Interactive 3D rotating & stacking squares) */}
      <div
        className={`relative ${
          isStacked
            ? 'w-14 h-14 sm:w-16 sm:h-16 mb-2.5 mx-auto'
            : 'w-11 h-12 sm:w-13 sm:h-14 lg:w-15 lg:h-16 mr-2 sm:mr-2.5'
        } flex-shrink-0 flex items-center justify-center`}
      >
        <svg
          viewBox="0 0 56 62"
          className="w-full h-full overflow-visible drop-shadow-sm"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Bottom-Left Navy Blue Square */}
          <motion.g
            initial={shouldReduceMotion ? { opacity: 1, rotate: -14.5 } : { opacity: 0, x: -35, y: 35, rotate: -90, scale: 0.2 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -14.5, scale: 1 }}
            whileHover={{ rotate: -18, scale: 1.04 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 22,
              delay: 0.05,
            }}
            style={{ transformOrigin: '20px 42px' }}
          >
            <rect
              x="7"
              y="29"
              width="26"
              height="26"
              rx="2.5"
              className="fill-[#0b2b6e] dark:fill-[#1e4eb8] transition-colors duration-200"
            />
          </motion.g>

          {/* Middle Emerald Green Square */}
          <motion.g
            initial={shouldReduceMotion ? { opacity: 1, rotate: -14.5 } : { opacity: 0, x: -20, y: 20, rotate: -65, scale: 0.2 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -14.5, scale: 1 }}
            whileHover={{ rotate: -14, scale: 1.05 }}
            transition={{
              type: 'spring',
              stiffness: 340,
              damping: 22,
              delay: 0.14,
            }}
            style={{ transformOrigin: '28px 31px' }}
          >
            <rect
              x="15"
              y="18"
              width="26"
              height="26"
              rx="2.5"
              className="fill-[#248a4d] dark:fill-[#2ecc71] transition-colors duration-200"
            />
          </motion.g>

          {/* Top-Right Vibrant Red Square */}
          <motion.g
            initial={shouldReduceMotion ? { opacity: 1, rotate: -14.5 } : { opacity: 0, x: 25, y: -30, rotate: 45, scale: 0.2 }}
            animate={{ opacity: 1, x: 0, y: 0, rotate: -14.5, scale: 1 }}
            whileHover={{ rotate: -9, scale: 1.06 }}
            transition={{
              type: 'spring',
              stiffness: 360,
              damping: 20,
              delay: 0.22,
            }}
            style={{ transformOrigin: '36px 20px' }}
          >
            <rect
              x="23"
              y="7"
              width="26"
              height="26"
              rx="2.5"
              className="fill-[#e5292f] transition-colors duration-200"
            />
          </motion.g>
        </svg>
      </div>

      {/* 2. BRAND TYPOGRAPHY + GREEN SWOOSH */}
      <div className={`relative flex flex-col ${isStacked ? 'items-center justify-center text-center' : 'items-start justify-center text-left'}`}>
        {/* Animated Green Swoosh Arc arching over ColourPlus */}
        <div className={`absolute -top-1.5 sm:-top-2 ${isStacked ? 'left-0 right-0 flex justify-center' : '-left-0.5 right-0'} h-4 pointer-events-none`}>
          <svg
            viewBox="0 0 190 20"
            className={`w-full ${isStacked ? 'max-w-[210px]' : ''} h-full overflow-visible`}
            fill="none"
            preserveAspectRatio="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <motion.path
              d="M 2 16 Q 85 -2 188 12"
              stroke="#248a4d"
              strokeWidth="3.2"
              strokeLinecap="round"
              className="dark:stroke-[#2ecc71]"
              initial={shouldReduceMotion ? { pathLength: 1, opacity: 1 } : { pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{
                duration: 0.75,
                ease: [0.16, 1, 0.3, 1],
                delay: 0.35,
              }}
            />
          </svg>
        </div>

        {/* Staggered Rotating Letters for "ColourPlus" */}
        <div className={`flex items-baseline ${isStacked ? 'justify-center' : 'justify-start'} font-extrabold text-2xl sm:text-[30px] lg:text-[34px] tracking-tight leading-none pt-0.5`}>
          {letters.map((item, index) => {
            // Alternating entrance tilt angles (-45deg vs +45deg) for lively dynamic arrival
            const initialRotation = index % 2 === 0 ? -48 : 48;

            return (
              <motion.span
                key={`${replayKey}-${index}`}
                initial={
                  shouldReduceMotion
                    ? { opacity: 1, y: 0, rotate: 0 }
                    : {
                        opacity: 0,
                        y: -30,
                        rotate: initialRotation,
                        scale: 0.2,
                        filter: 'blur(5px)',
                      }
                }
                animate={{
                  opacity: 1,
                  y: 0,
                  rotate: 0,
                  scale: 1,
                  filter: 'blur(0px)',
                }}
                whileHover={{
                  y: -3,
                  rotate: index % 2 === 0 ? -6 : 6,
                  transition: { type: 'spring', stiffness: 500, damping: 15 },
                }}
                transition={{
                  type: 'spring',
                  stiffness: 440,
                  damping: 22,
                  delay: shouldReduceMotion ? 0 : 0.28 + index * 0.042,
                }}
                className={`inline-block origin-bottom font-sans transition-colors duration-200 ${
                  item.isRed
                    ? 'text-[#e5292f] font-black'
                    : 'text-[#0b2b6e] dark:text-white font-extrabold'
                }`}
              >
                {item.char}
              </motion.span>
            );
          })}
        </div>

        {/* Company Subtitle: "Polyurethanes Pvt. Ltd." */}
        <motion.div
          initial={
            shouldReduceMotion
              ? { opacity: 1, y: 0 }
              : {
                  opacity: 0,
                  y: 10,
                  filter: 'blur(3px)',
                }
          }
          animate={{
            opacity: 1,
            y: 0,
            filter: 'blur(0px)',
          }}
          transition={{
            duration: 0.55,
            ease: [0.16, 1, 0.3, 1],
            delay: shouldReduceMotion ? 0 : 0.72,
          }}
          className={`text-[10px] sm:text-[11.5px] lg:text-[12.5px] font-bold tracking-tight text-[#111827] dark:text-[#f1f5f9] mt-1 leading-none transition-colors duration-200 font-sans ${
            isStacked ? 'text-center' : 'text-left'
          }`}
        >
          Polyurethanes Pvt. Ltd.
        </motion.div>
      </div>
    </motion.div>
  );
};
