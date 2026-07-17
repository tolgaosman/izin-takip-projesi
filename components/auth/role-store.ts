"use client";

import { useSyncExternalStore } from "react";

/* Rol bazlı görünüm kontrolü. Modül düzeyli, useSyncExternalStore ile senkron
   (hidrasyon güvenli) — lib/data/store.ts ile aynı desen. Kimlik doğrulama
   yapmaz; yalnız hangi aksiyonların gösterileceğini belirler. */

export type Role = "admin" | "employee";

const STORAGE_KEY = "izin-takip-role";

let role: Role = "admin";
let initialized = false;
const listeners = new Set<() => void>();

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "admin" || stored === "employee") role = stored;
  } catch {
    // ignore
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Role {
  ensureInit();
  return role;
}

/** SSR/ilk boyama için sabit değer → hidrasyon uyumsuzluğu olmaz. */
function getServerSnapshot(): Role {
  return "admin";
}

export function setRole(next: Role) {
  role = next;
  initialized = true;
  try {
    window.localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore
  }
  listeners.forEach((l) => l());
}

export function useRole(): Role {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function useIsAdmin(): boolean {
  return useRole() === "admin";
}
