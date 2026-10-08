import React from 'react';
import type { ActivePageView } from '../types/crm';

interface HeroSectionProps {
  onOpenSimulator: () => void;
  activePage: ActivePageView;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ activePage }) => {
  if (activePage !== 'desk') return null;

  return (
    <div className="bg-[#0a1018] pt-12 pb-10 px-6 sm:px-10 border-b border-[#1f2d3f]/40">
      <div className="max-w-[1600px] mx-auto space-y-4">
        {/* Eyebrow strip */}
        <div className="flex items-center justify-between text-[11px] font-mono font-bold tracking-widest text-[#5c6b7e] uppercase">
          <span>COLOURPLUS POLYURETHANES PVT. LTD.</span>
        </div>

        {/* Large headline matching reference image */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight leading-[1.04]">
          <span className="text-white block">Conversations engineered</span>
          <span className="text-[#64748b] block mt-1.5">into qualified leads.</span>
        </h1>

        {/* Subtitle text matching reference image */}
        <p className="pt-2 text-sm sm:text-base text-slate-400 max-w-2xl font-normal leading-relaxed">
          Every WhatsApp chat arrives scored, located and ready to work, with the full conversation attached.
        </p>
      </div>
    </div>
  );
};
