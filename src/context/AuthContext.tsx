import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { AuthUser, LoginCredentials, DemoPersona } from '../types/auth';

export const DEMO_PERSONAS: DemoPersona[] = [
  {
    id: 'persona-admin',
    name: 'Siddharth Malhotra',
    role: 'admin',
    roleTitle: 'Chief Dispatch Commander',
    department: 'National Operations & AI Dispatch',
    email: 'siddharth.m@colourplus.in',
    passwordHint: 'Admin@2026',
    territory: 'National HQ (Mumbai)',
    initials: 'SM',
    badgeColor: 'navy',
    clearance: 'Level 3 - Root Command',
  },
  {
    id: 'persona-tech',
    name: 'Dr. Priya Sharma',
    role: 'technical_specialist',
    roleTitle: 'Sr. Flooring Specification Lead',
    department: 'Technical Advisory & Moisture Lab',
    email: 'priya.sharma@colourplus.in',
    passwordHint: 'TechSpec#42',
    territory: 'Maharashtra & Pune Hub',
    initials: 'PS',
    badgeColor: 'green',
    clearance: 'Level 2',
  },
  {
    id: 'persona-partner',
    name: 'Rajesh Verma',
    role: 'channel_partner',
    roleTitle: 'Regional Channel Director',
    department: 'Authorized Applicator Network',
    email: 'rajesh.verma@colourplus.in',
    passwordHint: 'Partner2026!',
    territory: 'Gujarat & Western Zone',
    initials: 'RV',
    badgeColor: 'warm',
    clearance: 'Level 2',
  },
  {
    id: 'persona-field',
    name: 'Vikramaditya Rao',
    role: 'dispatcher',
    roleTitle: 'Field Survey & SLA Dispatcher',
    department: 'Rapid Response Site Visits',
    email: 'vikram.rao@colourplus.in',
    passwordHint: 'FieldOps99',
    territory: 'Karnataka & Southern Region',
    initials: 'VR',
    badgeColor: 'hot',
    clearance: 'Level 1',
  },
];

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tempUserPending2FA: AuthUser | null;
  demoPersonas: DemoPersona[];
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; error?: string }>;
  verify2FA: (code: string) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (personaId: string) => Promise<void>;
  biometricLogin: () => Promise<boolean>;
  resetPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  cancel2FA: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEY = 'colourplus_lead_desk_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        return JSON.parse(stored) as AuthUser;
      }
    } catch (e) {
      console.warn('Failed to parse cached auth state:', e);
    }
    return null;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [tempUserPending2FA, setTempUserPending2FA] = useState<AuthUser | null>(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user]);

  // Regular login simulation with credentials
  const login = useCallback(
    async (
      credentials: LoginCredentials
    ): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);

      // Brief realistic handshake delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      const trimmedEmail = credentials.email.trim().toLowerCase();
      if (!trimmedEmail || !credentials.password) {
        setIsLoading(false);
        return { success: false, error: 'Please enter both your corporate email and password.' };
      }

      // Find matching demo persona or generate realistic user
      const matchedPersona = DEMO_PERSONAS.find(
        (p) => p.email.toLowerCase() === trimmedEmail
      );

      const resolvedUser: AuthUser = matchedPersona
        ? {
            id: matchedPersona.id,
            name: matchedPersona.name,
            email: matchedPersona.email,
            employeeId: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
            role: matchedPersona.role,
            roleTitle: matchedPersona.roleTitle,
            department: matchedPersona.department,
            territory: matchedPersona.territory,
            initials: matchedPersona.initials,
            lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            securityClearance: matchedPersona.clearance,
          }
        : {
            id: `usr-${Date.now()}`,
            name: trimmedEmail.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            email: trimmedEmail,
            employeeId: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
            role: 'dispatcher',
            roleTitle: 'Command Dispatch Officer',
            department: 'Flooring Operations',
            territory: 'National Network',
            initials: trimmedEmail.substring(0, 2).toUpperCase(),
            lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            securityClearance: 'Level 2',
          };

      setUser(resolvedUser);
      setIsLoading(false);
      return { success: true };
    },
    []
  );

  // 2FA verification code
  const verify2FA = useCallback(
    async (code: string): Promise<{ success: boolean; error?: string }> => {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 700));

      // Any 6-digit code or "123456" accepted for smooth demo experience
      if (code.length === 6) {
        if (tempUserPending2FA) {
          setUser(tempUserPending2FA);
          setTempUserPending2FA(null);
          setIsLoading(false);
          return { success: true };
        }
      }

      setIsLoading(false);
      return { success: false, error: 'Invalid security code. Please try again or resend.' };
    },
    [tempUserPending2FA]
  );

  // Instant demo persona login
  const demoLogin = useCallback(async (personaId: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));

    const persona = DEMO_PERSONAS.find((p) => p.id === personaId) || DEMO_PERSONAS[0];
    const resolvedUser: AuthUser = {
      id: persona.id,
      name: persona.name,
      email: persona.email,
      employeeId: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
      role: persona.role,
      roleTitle: persona.roleTitle,
      department: persona.department,
      territory: persona.territory,
      initials: persona.initials,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      securityClearance: persona.clearance,
    };

    setUser(resolvedUser);
    setTempUserPending2FA(null);
    setIsLoading(false);
  }, []);

  // Biometric / WebAuthn passkey simulation
  const biometricLogin = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1100));

    const defaultAdmin = DEMO_PERSONAS[0];
    const resolvedUser: AuthUser = {
      id: defaultAdmin.id,
      name: defaultAdmin.name,
      email: defaultAdmin.email,
      employeeId: 'CP-EXEC-01',
      role: defaultAdmin.role,
      roleTitle: defaultAdmin.roleTitle,
      department: defaultAdmin.department,
      territory: defaultAdmin.territory,
      initials: defaultAdmin.initials,
      lastLogin: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      securityClearance: defaultAdmin.clearance,
    };

    setUser(resolvedUser);
    setTempUserPending2FA(null);
    setIsLoading(false);
    return true;
  }, []);

  // Password reset simulation
  const resetPassword = useCallback(async (email: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsLoading(false);

    return {
      success: true,
      message: `A cryptographic recovery link has been dispatched to ${email}. Check your corporate inbox.`,
    };
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setTempUserPending2FA(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const cancel2FA = useCallback(() => {
    setTempUserPending2FA(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        tempUserPending2FA,
        demoPersonas: DEMO_PERSONAS,
        login,
        verify2FA,
        demoLogin,
        biometricLogin,
        resetPassword,
        logout,
        cancel2FA,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
