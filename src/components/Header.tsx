import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, Layers, Calendar, BarChart3, Users, Paintbrush, Settings as SettingsIcon, ArrowUpRight, LogOut, ChevronDown } from 'lucide-react';
import type { ActivePageView } from '../types/crm';
import { ThemeToggle } from './ui/ThemeToggle';
import { Button } from './ui/Button';
import { AnimatedLogo } from './AnimatedLogo';
import { useAuth } from '../context/AuthContext';

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
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);

  const { user, logout } = useAuth();

  // Close menus on click outside or escape key
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        setUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const navItems: { id: ActivePageView; label: string; icon: React.ReactNode }[] = [
    { id: 'desk', label: 'Lead Desk', icon: <Layers className="w-4 h-4" /> },
    { id: 'analytics', label: 'Analytics', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'appointments', label: 'Site Visits', icon: <Calendar className="w-4 h-4" /> },
    { id: 'channel_partners', label: 'Channel Partners', icon: <Users className="w-4 h-4" /> },
    { id: 'applicators', label: 'Applicators', icon: <Paintbrush className="w-4 h-4" /> },
    { id: 'settings', label: 'Settings', icon: <SettingsIcon className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-40 bg-surface/85 backdrop-blur-md border-b border-border-subtle shadow-elevation-1 transition-colors duration-200">
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-18 sm:h-20 lg:h-[86px] flex items-center justify-between gap-4">
        
        {/* LEFT: Logo + Mobile Hamburger */}
        <div className="flex items-center space-x-3 sm:space-x-4">
          {/* Mobile Hamburger Button */}
          <div ref={menuRef} className="lg:hidden relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-xl bg-surface-subtle hover:bg-surface-hover text-text-primary border border-border-base transition cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[2.2]" />}
            </button>

            {/* Mobile Pop-out Dropdown */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 8 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 4 }}
                  transition={{ duration: 0.2 }}
                  className="absolute top-12 left-0 z-50 w-64 bg-surface-elevated border border-border-strong text-text-primary p-2 rounded-2xl shadow-elevation-3"
                >
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
                          className={`flex items-center space-x-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition text-left cursor-pointer ${
                            isActive
                              ? 'bg-brand-navy text-white shadow-elevation-1 font-bold'
                              : 'text-text-secondary hover:bg-surface-hover hover:text-text-primary'
                          }`}
                        >
                          <span className={isActive ? 'text-white' : 'text-text-tertiary'}>{item.icon}</span>
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Official Animated ColourPlus Logo with rotating entrance and spring physics */}
          <AnimatedLogo onClick={() => setActivePage('desk')} />
        </div>

        {/* CENTER: Desktop Navigation Tabs with Sliding Pill */}
        <nav className="hidden lg:flex items-center p-1.5 rounded-2xl bg-surface-subtle/80 border border-border-subtle shadow-2xs">
          {navItems.map((item) => {
            const isActive = activePage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActivePage(item.id)}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-colors select-none flex items-center space-x-2 cursor-pointer ${
                  isActive ? 'text-white' : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="header-active-pill"
                    transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                    className="absolute inset-0 bg-brand-navy rounded-xl shadow-elevation-1"
                  />
                )}
                <span className="relative z-10">{item.icon}</span>
                <span className="relative z-10">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* RIGHT: Theme Toggle & Quick Action & User Profile */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          <ThemeToggle />

          <Button
            variant="brand"
            size="sm"
            onClick={onAssignLeadClick}
            rightIcon={<ArrowUpRight className="w-4 h-4 text-blue-200" />}
            className="rounded-full shadow-elevation-1"
            title="Assign selected or filtered leads"
          >
            <span className="hidden sm:inline">Assign Leads</span>
            <span className="sm:hidden">Assign</span>
          </Button>

          {/* User Profile Pill & Lock Terminal Dropdown */}
          {user && (
            <div ref={userMenuRef} className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center space-x-2 p-1.5 sm:px-2.5 sm:py-1.5 rounded-full bg-surface-subtle hover:bg-surface-hover border border-border-base transition cursor-pointer select-none"
                aria-label="User profile menu"
              >
                <div className="w-7 h-7 rounded-full bg-brand-navy text-white text-xs font-bold font-mono flex items-center justify-center shadow-xs">
                  {user.initials}
                </div>
                <div className="hidden xl:block text-left pr-1">
                  <div className="text-xs font-bold text-text-primary truncate max-w-[120px] leading-tight">
                    {user.name}
                  </div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-text-tertiary" />
              </button>

              <AnimatePresence>
                {userMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 8 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 mt-2 w-64 bg-surface-elevated border border-border-strong rounded-2xl shadow-elevation-3 p-3 z-50 text-text-primary"
                  >
                    <div className="p-2.5 rounded-xl bg-surface-subtle border border-border-subtle mb-2">
                      <div className="flex items-center space-x-2.5">
                        <div className="w-8 h-8 rounded-lg bg-brand-navy text-white text-xs font-bold font-mono flex items-center justify-center shadow-xs">
                          {user.initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="text-sm font-bold truncate text-text-primary">{user.name}</div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          setActivePage('settings');
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-semibold text-text-secondary hover:text-text-primary hover:bg-surface-hover transition cursor-pointer text-left"
                      >
                        <SettingsIcon className="w-4 h-4" />
                        <span>System Settings</span>
                      </button>

                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center space-x-2 px-3 py-2 rounded-xl text-xs font-bold text-funnel-hot hover:bg-funnel-hotBg transition cursor-pointer text-left"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Lock Console / Sign Out</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

      </div>
    </header>
  );
};

