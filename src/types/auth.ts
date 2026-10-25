export type UserRole = 'admin' | 'dispatcher' | 'technical_specialist' | 'channel_partner';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  territory: string;
  avatarUrl?: string;
  initials: string;
  lastLogin: string;
  securityClearance: 'Level 1' | 'Level 2' | 'Level 3 - Root Command';
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  workspace?: string;
}

export type AuthScreenMode = 'login' | '2fa' | 'forgot_password' | 'biometric';

export interface DemoPersona {
  id: string;
  name: string;
  role: UserRole;
  roleTitle: string;
  department: string;
  email: string;
  passwordHint: string;
  territory: string;
  initials: string;
  badgeColor: 'navy' | 'green' | 'hot' | 'warm';
  clearance: 'Level 1' | 'Level 2' | 'Level 3 - Root Command';
}
