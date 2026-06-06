import { createContext, useState, type ReactNode } from 'react';
import type { AuthUser } from '../types';
import { authenticate } from '../services/auth.service';

export interface AuthContextValue {
  user: AuthUser | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  function login(username: string, password: string): boolean {
    const authUser = authenticate(username, password);
    if (!authUser) return false;
    setUser(authUser);
    return true;
  }

  function logout() {
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
