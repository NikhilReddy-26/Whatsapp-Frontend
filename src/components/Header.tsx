import React, { useState } from 'react';
import { Menu, X, Layers, Calendar, CheckSquare, MessageSquare, Settings as SettingsIcon } from 'lucide-react';
import type { ActivePageView } from '../types/crm';

interface HeaderProps {
  activePage: ActivePageView;
  setActivePage: (page: ActivePageView) => void;
  onAssignLeadClick: () => void;
  unrepliedCount?: number;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  onAssignLeadClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems: { id: ActivePageView; label: string; icon: React.ReactNode }[] = [
    { id: 'desk', label: 'Lead Desk (CRM)', icon: <Layers className="w-4.5 h-4.5 text-blue-400" /> },
    { id: 'appointments', label: 'Site Visits & Appointments', icon: <Calendar className="w-4.5 h-4.5 text-emerald-400" /> },
    { id: 'followups', label: 'Follow-ups & Tasks', icon: <CheckSquare className="w-4.5 h-4.5 text-amber-400" /> },
    { id: 'simulator', label: 'WhatsApp Simulator', icon: <MessageSquare className="w-4.5 h-4.5 text-purple-400" /> },
    { id: 'settings', label: 'CRM & AI Settings', icon: <SettingsIcon className="w-4.5 h-4.5 text-slate-400" /> },
  ];

  return (
    <header className="bg-[#e5e4e0] text-slate-900 border-b border-stone-300 sticky top-0 z-40 shadow-sm relative">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 h-18 sm:h-20 flex items-center justify-between">
        
        {/* LEFT: MENU Hamburger + Label */}
        <div className="flex items-center space-x-2 relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center space-x-2 py-1.5 px-2.5 rounded-lg hover:bg-stone-300/80 transition text-slate-900 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? (
              <X className="w-5 h-5 text-slate-900" />
            ) : (
              <Menu className="w-5 h-5 text-slate-900 stroke-[2.5]" />
            )}
            <span className="font-mono font-extrabold text-xs tracking-widest text-slate-900 uppercase">
              MENU
            </span>
          </button>

          {/* VERTICAL POP-OUT DROPDOWN MENU */}
          {menuOpen && (
            <div className="absolute top-12 left-0 z-50 w-64 sm:w-72 bg-[#101823] border border-[#1f2d3f] text-[#f2f4f7] p-2.5 rounded-2xl shadow-2xl transition-all">
              <div className="flex flex-col space-y-1">
                {navItems.map((item) => {
                  const isActive = activePage === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActivePage(item.id);
                        setMenuOpen(false);
                      }}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-xs sm:text-sm font-semibold transition text-left ${
                        isActive
                          ? 'bg-[#0f3f8a] text-white shadow-md font-bold'
                          : 'text-slate-300 hover:bg-[#162232] hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span className="truncate">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* CENTRE: ColourPlus Exact Official Logo */}
        <div 
          className="flex items-center space-x-3 cursor-pointer select-none py-1" 
          onClick={() => setActivePage('desk')}
        >
          {/* Official 3 Overlapping Squares SVG Logo Mark */}
          <svg className="w-10 h-10 flex-shrink-0" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* 1. Bottom-Left Square: Green */}
            <rect x="2" y="17" width="18" height="18" rx="1.5" fill="#2f9e5b" />
            
            {/* 2. Middle Square: Navy Blue */}
            <rect x="10" y="9.5" width="18" height="18" rx="1.5" fill="#0f3f8a" />
            
            {/* 3. Top-Right Square: Red */}
            <rect x="18" y="2" width="18" height="18" rx="1.5" fill="#e5373b" />
          </svg>
          
          <div className="flex flex-col text-left">
            <span className="font-bold text-2xl sm:text-3xl tracking-tight text-[#0f3f8a] leading-none">
              ColourPlus
            </span>
            <span className="text-[11px] sm:text-[12px] font-semibold text-[#0f3f8a] tracking-normal mt-1 leading-none">
              Polyurethanes Pvt. Ltd.
            </span>
          </div>
        </div>

        {/* RIGHT: Navy Pill Button */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onAssignLeadClick}
            className="flex items-center space-x-1.5 bg-[#0f3f8a] hover:bg-[#154fb0] text-white px-5 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold transition shadow-sm hover:shadow"
          >
            <span>Assign a lead</span>
            <span className="text-sm font-semibold">↗</span>
          </button>
        </div>

      </div>
    </header>
  );
};
