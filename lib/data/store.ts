"use client";

import { useMemo, useSyncExternalStore } from "react";

import { computeLeaveBalance } from "@/lib/data/balance";
import { seedLeaveRequests, seedPersonnel } from "@/lib/data/seed";
import type {
  LeaveBalance,
  LeaveRequest,
  LeaveStatus,
  Personnel,
} from "@/lib/data/types";

/* ── localStorage-backed reactive store ──────────────────────────────
   Same hydration-safe pattern as components/auth/auth-provider.tsx:
   a module-level snapshot synced through useSyncExternalStore.        */

const PERSONNEL_KEY = "izin-takip-personnel";
const LEAVES_KEY = "izin-takip-leaves";
const ROLE_KEY = "izin-takip-role";

let personnel: Personnel[] = seedPersonnel;
let leaves: LeaveRequest[] = seedLeaveRequests;
let activeRole = "Admin (Tümü)";
let initialized = false;

const listeners = new Set<() => void>();

function readKey<T>(key: string, fallback: T): T {
  try {
    const stored = window.localStorage.getItem(key);
    if (stored) return JSON.parse(stored) as T;
    window.localStorage.setItem(key, JSON.stringify(fallback));
  } catch {
    // ignore
  }
  return fallback;
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  personnel = readKey(PERSONNEL_KEY, seedPersonnel);
  leaves = readKey(LEAVES_KEY, seedLeaveRequests);
  activeRole = readKey(ROLE_KEY, "Admin (Tümü)");
}

function persist(key: string, value: unknown) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore storage errors
  }
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

let cachedFilteredPersonnel: Personnel[] | null = null;
let cachedFilteredLeaves: LeaveRequest[] | null = null;

function clearCache() {
  cachedFilteredPersonnel = null;
  cachedFilteredLeaves = null;
}

export const ROLE_DEPARTMENTS: Record<string, string[]> = {
  "Admin (Tümü)": [],
  "Teknoloji": ["Yazılım", "Donanım", "Destek"],
  "İnsan Kaynakları": ["İnsan Kaynakları"],
  "Satış ve Pazarlama": ["Satış", "Pazarlama"],
  "Muhasebe": ["Muhasebe"],
};

export const AVAILABLE_ROLES = Object.keys(ROLE_DEPARTMENTS);

function getPersonnelSnapshot(): Personnel[] {
  ensureInit();
  if (activeRole === "Admin (Tümü)") return personnel;
  
  if (!cachedFilteredPersonnel) {
    const allowed = ROLE_DEPARTMENTS[activeRole] || [];
    cachedFilteredPersonnel = personnel.filter((p) => allowed.includes(p.department));
  }
  return cachedFilteredPersonnel;
}

function getLeavesSnapshot(): LeaveRequest[] {
  ensureInit();
  if (activeRole === "Admin (Tümü)") return leaves;
  
  if (!cachedFilteredLeaves) {
    const allowed = ROLE_DEPARTMENTS[activeRole] || [];
    const allowedPersonnelIds = new Set(
      personnel.filter((p) => allowed.includes(p.department)).map((p) => p.id)
    );
    cachedFilteredLeaves = leaves.filter((l) => allowedPersonnelIds.has(l.personnelId));
  }
  return cachedFilteredLeaves;
}

// Server snapshots must be referentially stable across calls.
function getPersonnelServerSnapshot(): Personnel[] {
  return seedPersonnel;
}
function getLeavesServerSnapshot(): LeaveRequest[] {
  return seedLeaveRequests;
}

function setPersonnel(next: Personnel[]) {
  personnel = next;
  clearCache();
  persist(PERSONNEL_KEY, next);
  emit();
}

function setLeaves(next: LeaveRequest[]) {
  leaves = next;
  clearCache();
  persist(LEAVES_KEY, next);
  emit();
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ── React hooks ── */

export function useRole(): string {
  return useSyncExternalStore(
    subscribe,
    () => {
      ensureInit();
      return activeRole;
    },
    () => "Admin (Tümü)"
  );
}

export function setRole(role: string) {
  activeRole = role;
  clearCache();
  persist(ROLE_KEY, role);
  emit();
}

export function usePersonnel(): Personnel[] {
  return useSyncExternalStore(
    subscribe,
    getPersonnelSnapshot,
    getPersonnelServerSnapshot
  );
}

export function useLeaveRequests(): LeaveRequest[] {
  return useSyncExternalStore(
    subscribe,
    getLeavesSnapshot,
    getLeavesServerSnapshot
  );
}

export type DashboardStats = {
  totalPersonnel: number;
  pending: number;
  approved: number;
  rejected: number;
};

export function useDashboardStats(): DashboardStats {
  const people = usePersonnel();
  const requests = useLeaveRequests();

  return {
    totalPersonnel: people.length,
    pending: requests.filter((r) => r.status === "pending").length,
    approved: requests.filter((r) => r.status === "approved").length,
    rejected: requests.filter((r) => r.status === "rejected").length,
  };
}

/* ── Leave balance (derived) ──
   Reactive hook for UI (re-renders when personnel/leaves change). Always
   computes from the FULL data set (unfiltered by view role) so a person's
   real remaining balance is correct regardless of who is looking. */
export function usePersonnelBalance(id: string): LeaveBalance | undefined {
  // Subscribe to both slices so the memo re-runs on any relevant change.
  usePersonnel();
  useLeaveRequests();
  return useMemo(() => getLeaveBalance(id), [id, personnel, leaves]);
}

/* ── Non-reactive readers (safe to call in event handlers) ── */

export function getPersonnelById(id: string): Personnel | undefined {
  ensureInit();
  return personnel.find((p) => p.id === id);
}

export function getLeavesByPersonnel(personnelId: string): LeaveRequest[] {
  ensureInit();
  return leaves.filter((l) => l.personnelId === personnelId);
}

/** Non-reactive balance read — for use inside event handlers (e.g. the
    leave form's submit guard). Uses the full, unfiltered data. */
export function getLeaveBalance(id: string): LeaveBalance | undefined {
  ensureInit();
  const person = personnel.find((p) => p.id === id);
  if (!person) return undefined;
  return computeLeaveBalance(person, leaves);
}

/* ── Personnel mutations ── */

export function addPersonnel(data: Omit<Personnel, "id">): Personnel {
  ensureInit();
  const created: Personnel = { ...data, id: newId() };
  setPersonnel([created, ...personnel]);
  return created;
}

export function updatePersonnel(id: string, data: Partial<Omit<Personnel, "id">>) {
  ensureInit();
  setPersonnel(personnel.map((p) => (p.id === id ? { ...p, ...data } : p)));
}

export function deletePersonnel(id: string) {
  ensureInit();
  setPersonnel(personnel.filter((p) => p.id !== id));
  // Cascade: drop that person's leave requests too.
  setLeaves(leaves.filter((l) => l.personnelId !== id));
}

/* ── Leave-request mutations ── */

export function addLeaveRequest(
  data: Omit<LeaveRequest, "id" | "createdAt" | "status"> &
    Partial<Pick<LeaveRequest, "status">>
): LeaveRequest {
  ensureInit();
  const created: LeaveRequest = {
    status: "pending",
    ...data,
    id: newId(),
    createdAt: new Date().toISOString(),
  };
  setLeaves([created, ...leaves]);
  return created;
}

export function updateLeaveRequest(
  id: string,
  data: Partial<Omit<LeaveRequest, "id" | "createdAt">>
) {
  ensureInit();
  setLeaves(leaves.map((l) => (l.id === id ? { ...l, ...data } : l)));
}

export function deleteLeaveRequest(id: string) {
  ensureInit();
  setLeaves(leaves.filter((l) => l.id !== id));
}

export function setLeaveStatus(id: string, status: LeaveStatus) {
  updateLeaveRequest(id, { status });
}
