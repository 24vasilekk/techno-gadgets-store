export const ADMIN_SESSION_STORAGE_KEY = 'techno-agents-admin-session';

export const MOCK_ADMIN_CREDENTIALS = {
  login: 'admin@technoagents.store',
  password: 'admin12345'
} as const;

export type AdminSession = {
  role: 'admin';
  login: string;
  authenticatedAt: string;
};

export function createMockAdminSession(login: string): AdminSession {
  return {
    role: 'admin',
    login,
    authenticatedAt: new Date().toISOString()
  };
}

export function parseAdminSession(raw: string | null): AdminSession | null {
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<AdminSession>;
    if (parsed.role !== 'admin' || typeof parsed.login !== 'string' || typeof parsed.authenticatedAt !== 'string') {
      return null;
    }
    return {
      role: 'admin',
      login: parsed.login,
      authenticatedAt: parsed.authenticatedAt
    };
  } catch {
    return null;
  }
}
