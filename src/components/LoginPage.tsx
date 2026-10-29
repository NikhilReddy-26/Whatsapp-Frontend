import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ThemeToggle } from './ui/ThemeToggle';
import { AnimatedLogo } from './AnimatedLogo';
import { Button } from './ui/Button';
import { EASINGS } from '../lib/motion';

export const LoginPage: React.FC = () => {
  const { login, resetPassword, isLoading } = useAuth();
  const { toast } = useToast();
  const shouldReduceMotion = useReducedMotion();

  // Mode: 'login' | 'forgot_password'
  const [viewMode, setViewMode] = useState<'login' | 'forgot_password'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Forgot password states
  const [resetEmail, setResetEmail] = useState('');
  const [resetDispatched, setResetDispatched] = useState(false);

  // Video background
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [hasVideoError, setHasVideoError] = useState(false);

  useEffect(() => {
    if (shouldReduceMotion && videoRef.current) {
      videoRef.current.pause();
    }
  }, [shouldReduceMotion]);

  // Handle standard login submit
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password) {
      toast({
        title: 'Credentials Required',
        message: 'Please enter your corporate email and password.',
        type: 'warning',
      });
      return;
    }

    const res = await login({ email, password, rememberMe });
    if (res.success) {
      toast({
        title: 'Sign In Successful',
        message: 'Welcome back to ColourPlus Lead Desk.',
        type: 'success',
      });
    } else {
      toast({
        title: 'Sign In Failed',
        message: res.error || 'Invalid credentials. Please verify and try again.',
        type: 'error',
      });
    }
  };

  // Handle forgot password submit
  const handleResetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resetEmail.trim()) {
      toast({
        title: 'Email Required',
        message: 'Please enter your registered work email.',
        type: 'warning',
      });
      return;
    }

    const res = await resetPassword(resetEmail);
    if (res.success) {
      setResetDispatched(true);
      toast({
        title: 'Reset Link Dispatched',
        message: res.message,
        type: 'success',
      });
    } else {
      toast({
        title: 'Reset Unavailable',
        message: res.message,
        type: 'warning',
      });
    }
  };



  return (
    <div className="relative min-h-screen w-full bg-canvas text-text-primary flex items-center justify-center p-4 selection:bg-brand-navy selection:text-white transition-colors duration-200">
      
      {/* HIGH DEFINITION VIDEO BACKGROUND */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
        {/* Background Video Element: Full clarity, no blur */}
        {!hasVideoError && (
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            onLoadedData={() => setIsVideoLoaded(true)}
            onError={() => setHasVideoError(true)}
            className={`absolute inset-0 w-full h-full object-cover contrast-[1.06] brightness-105 transition-opacity duration-700 ${
              isVideoLoaded ? 'opacity-95 dark:opacity-90' : 'opacity-0'
            }`}
            aria-hidden="true"
          >
            <source src="/login-bg.mp4" type="video/mp4" />
          </video>
        )}

        {/* Clean, Subtle Dark Tint: Preserves 1080p Crisp Video Details */}
        <div className="absolute inset-0 bg-black/25 dark:bg-black/40 transition-colors duration-300" />
      </div>

      {/* CENTERED LOGIN CARD */}
      <main className="relative z-10 w-full max-w-[500px] mx-auto py-6">
        <motion.div
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: EASINGS.easeOutExpo }}
          className="relative rounded-3xl bg-surface-elevated border border-border-base shadow-elevation-3 overflow-hidden transition-all duration-200"
        >
          {/* Subtle Top Tricolor Brand Accent Line */}
          <div className="h-1.5 w-full bg-gradient-to-r from-brand-navy via-brand-green to-brand-red" />

          {/* Theme Toggle Button inside the form card */}
          <div className="absolute top-4 right-4 sm:top-5 sm:right-5 z-20">
            <ThemeToggle />
          </div>

          <div className="p-8 sm:p-10">
            {/* BRAND HEADER & LOGO (Centered) */}
            <div className="flex flex-col items-center text-center mb-8">
              <div className="mb-4 flex items-center justify-center w-full">
                <AnimatedLogo layout="horizontal" />
              </div>
              <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight text-text-primary mt-1">
                Lead Desk Sign In
              </h1>
              <p className="text-xs sm:text-sm text-text-secondary mt-1.5">
                Enter your corporate credentials to access the console
              </p>
            </div>

            {/* FORM CONTAINER WITH SMOOTH VIEW TRANSITION */}
            <AnimatePresence mode="wait">
              {viewMode === 'login' ? (
                /* LOGIN FORM */
                <motion.form
                  key="login-form"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleLoginSubmit}
                  className="space-y-4.5"
                >
                  {/* Email Field */}
                  <div>
                    <label className="block text-xs font-bold text-text-secondary mb-1.5">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                        <Mail className="w-4.5 h-4.5" />
                      </div>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@colourplus.in"
                        autoComplete="email"
                        required
                        className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-subtle border border-border-base hover:border-border-strong focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-sm sm:text-base text-text-primary placeholder:text-text-muted transition focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-bold text-text-secondary">
                        Password
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setResetEmail(email);
                          setResetDispatched(false);
                          setViewMode('forgot_password');
                        }}
                        className="text-xs font-semibold text-brand-navy dark:text-blue-400 hover:underline cursor-pointer"
                      >
                        Forgot password?
                      </button>
                    </div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                        <Lock className="w-4.5 h-4.5" />
                      </div>
                      <input
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        autoComplete="current-password"
                        required
                        className="w-full pl-11 pr-11 py-3 rounded-xl bg-surface-subtle border border-border-base hover:border-border-strong focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-sm sm:text-base text-text-primary placeholder:text-text-muted transition focus:outline-none font-mono"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-tertiary hover:text-text-primary transition cursor-pointer"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                      >
                        {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                      </button>
                    </div>
                  </div>

                  {/* Remember Me */}
                  <div className="flex items-center justify-between py-1">
                    <label className="flex items-center space-x-2 text-xs text-text-secondary select-none cursor-pointer">
                      <input
                        type="checkbox"
                        checked={rememberMe}
                        onChange={(e) => setRememberMe(e.target.checked)}
                        className="rounded border-border-base text-brand-navy focus:ring-brand-navy/30 bg-surface-subtle"
                      />
                      <span>Remember this device</span>
                    </label>
                    <span className="text-[11px] font-mono text-text-tertiary flex items-center space-x-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-brand-green" />
                      <span>Encrypted</span>
                    </span>
                  </div>

                  {/* Sign In CTA */}
                  <Button
                    type="submit"
                    variant="brand"
                    size="md"
                    isLoading={isLoading}
                    rightIcon={<ArrowRight className="w-4.5 h-4.5" />}
                    className="w-full rounded-xl text-sm sm:text-base font-bold shadow-elevation-1 py-3 sm:py-3.5 mt-2.5"
                  >
                    Sign In
                  </Button>
                </motion.form>
              ) : (
                /* FORGOT PASSWORD FORM */
                <motion.form
                  key="reset-form"
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleResetSubmit}
                  className="space-y-4.5"
                >
                  <div className="flex items-center space-x-2 text-brand-navy dark:text-blue-400 mb-1">
                    <KeyRound className="w-4 h-4" />
                    <span className="text-xs font-bold uppercase tracking-wider">Password Recovery</span>
                  </div>

                  {resetDispatched ? (
                    <div className="p-4 rounded-xl bg-brand-green/10 border border-brand-green/30 text-center space-y-2.5">
                      <CheckCircle2 className="w-6 h-6 text-brand-green mx-auto" />
                      <div className="text-xs font-bold text-brand-green">Recovery Link Sent</div>
                      <p className="text-xs text-text-secondary leading-relaxed">
                        Instructions have been dispatched to <strong className="text-text-primary">{resetEmail}</strong>.
                      </p>
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        onClick={() => setViewMode('login')}
                        className="mt-2 w-full rounded-xl text-xs py-2.5"
                      >
                        Return to Sign In
                      </Button>
                    </div>
                  ) : (
                    <>
                      <div>
                        <label className="block text-xs font-bold text-text-secondary mb-1.5">
                          Work Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-tertiary">
                            <Mail className="w-4.5 h-4.5" />
                          </div>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            placeholder="employee@colourplus.in"
                            required
                            className="w-full pl-11 pr-4 py-3 rounded-xl bg-surface-subtle border border-border-base hover:border-border-strong focus:border-brand-navy focus:ring-2 focus:ring-brand-navy/20 text-sm sm:text-base text-text-primary placeholder:text-text-muted transition focus:outline-none"
                          />
                        </div>
                      </div>

                      <Button
                        type="submit"
                        variant="brand"
                        size="md"
                        isLoading={isLoading}
                        className="w-full rounded-xl text-sm sm:text-base font-bold shadow-elevation-1 py-3 sm:py-3.5"
                      >
                        Send Reset Link
                      </Button>

                      <button
                        type="button"
                        onClick={() => setViewMode('login')}
                        className="w-full text-center text-xs text-text-tertiary hover:text-text-primary transition cursor-pointer flex items-center justify-center space-x-1 pt-1 font-semibold"
                      >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span>Back to Sign In</span>
                      </button>
                    </>
                  )}
                </motion.form>
              )}
            </AnimatePresence>

          </div>
        </motion.div>
      </main>

    </div>
  );
};
