import React from "react";
import { AuthContext } from "./AuthContext";
import type { AuthState, User } from "./types";

const STORAGE_TOKEN_KEY = "token";
const STORAGE_USER_KEY = "user";

function loadUser(): User | null {
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => {
    const token = localStorage.getItem(STORAGE_TOKEN_KEY);
    const user = loadUser();
    return {
      token,
      user,
      isAuthenticated: Boolean(token && user),
    };
  });

  const login = React.useCallback((token: string, user: User) => {
    localStorage.setItem(STORAGE_TOKEN_KEY, token);
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    setState({ token, user, isAuthenticated: true });
  }, []);

  const logout = React.useCallback(() => {
    localStorage.removeItem(STORAGE_TOKEN_KEY);
    localStorage.removeItem(STORAGE_USER_KEY);
    setState({ token: null, user: null, isAuthenticated: false });
  }, []);

  const updateUser = React.useCallback((user: User) => {
    localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
    setState((s) => (s.user ? { ...s, user } : s));
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}


