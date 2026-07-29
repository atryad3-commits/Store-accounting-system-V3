const fs = require('fs');
const file = 'src/types.ts';
let content = fs.readFileSync(file, 'utf8');

const userProfileTypes = `
// --- Advanced Profile & Security Models ---
export type UserPrivacyLevel = 'public' | 'private' | 'contacts_only';

export type UserPreferences = {
  theme: 'light' | 'dark' | 'system';
  language: string;
  timezone: string;
  notifications: {
    email: boolean;
    sms: boolean;
    inApp: boolean;
  };
  accessibility: {
    highContrast: boolean;
    fontSize: 'small' | 'medium' | 'large';
  };
};

export type UserSecurity = {
  twoFactorEnabled: boolean;
  recoveryEmail?: string;
  lastPasswordChange?: string;
  activeSessions?: {
    id: string;
    device: string;
    ip: string;
    lastActive: string;
  }[];
};

export type UserProfileExtended = {
  bio?: string;
  headline?: string;
  location?: string;
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  skills?: string[];
  experience?: {
    id: string;
    title: string;
    company: string;
    startDate: string;
    endDate?: string;
    current: boolean;
    description?: string;
  }[];
  education?: {
    id: string;
    institution: string;
    degree: string;
    field: string;
    graduationYear: number;
  }[];
  privacySettings?: Record<string, UserPrivacyLevel>; // e.g., { phone: 'private', email: 'public' }
  completionPercentage?: number;
};

// Update to User
`;

content = content.replace('export type User = {', userProfileTypes + 'export type User = {\n  preferences?: UserPreferences;\n  security?: UserSecurity;\n  profile?: UserProfileExtended;\n  lastActive?: string;\n  joinDate?: string;\n  email?: string;');

fs.writeFileSync(file, content);
