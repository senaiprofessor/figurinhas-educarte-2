import type { AuthUser, UserRole } from '../types';

interface UserRecord {
  password: string;
  role: UserRole;
  displayName: string;
}

const USERS: Record<string, UserRecord> = {
  usuario1: { password: '123456', role: 'usuario', displayName: 'Jogador 1' },
  usuario2: { password: '123456', role: 'usuario', displayName: 'Jogador 2' },
  admin:    { password: '123456', role: 'admin',   displayName: 'Administrador' },
};

export function getNonAdminLogins(): string[] {
  return Object.entries(USERS)
    .filter(([, v]) => v.role !== 'admin')
    .map(([login]) => login);
}

export function authenticate(login: string, password: string): AuthUser | null {
  const user = USERS[login];
  if (!user || user.password !== password) return null;
  return { login, role: user.role, displayName: user.displayName };
}
