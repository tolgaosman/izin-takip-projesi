"use client";

import { createContext, useContext, useMemo, useSyncExternalStore } from "react";

const STORAGE_KEY = "izin-takip-auth";

export type User = {
  name: string;
  email: string;
  avatarUrl?: string;
  /* ── Kişisel profil alanları (tamamı isteğe bağlı, /profile'dan düzenlenir) ── */
  /** Ünvan / görev tanımı, ör. "Kıdemli Yazılım Geliştirici" */
  title?: string;
  phone?: string;
  /** ISO yyyy-mm-dd */
  birthDate?: string;
  /** Şehir / çalışma konumu */
  location?: string;
  /** Kısa "hakkımda" metni */
  bio?: string;
  emergencyName?: string;
  emergencyRelation?: string;
  emergencyPhone?: string;
};

/* ── Module-level store (hydration-safe via useSyncExternalStore) ── */

let currentUser: User | null = null;
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) currentUser = JSON.parse(stored) as User;
  } catch {
    // ignore malformed/unavailable storage
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): User | null {
  ensureInit();
  return currentUser;
}

function getServerSnapshot(): User | null {
  return null;
}

function setUser(next: User | null) {
  currentUser = next;
  initialized = true;
  try {
    if (next) window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
  listeners.forEach((l) => l());
}

function nameFromEmail(email: string): string {
  const local = email.split("@")[0] ?? email;
  return local
    .split(/[._-]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

/* ── Public API ── */

type AuthContextValue = {
  user: User | null;
  login: (email: string, password?: string, name?: string) => void;
  signup: (name: string, email: string, password?: string) => void;
  logout: () => void;
  updateUser: (patch: Partial<User>) => void;
};

const actions = {
  login: (email: string, _password?: string, name?: string) =>
    setUser({ name: name?.trim() || nameFromEmail(email), email }),
  signup: (name: string, email: string) =>
    setUser({ name: name.trim() || nameFromEmail(email), email }),
  logout: () => setUser(null),
  updateUser: (patch: Partial<User>) =>
    setUser(currentUser ? { ...currentUser, ...patch } : currentUser),
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo<AuthContextValue>(() => ({ user, ...actions }), [user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an <AuthProvider>");
  }
  return ctx;
}
