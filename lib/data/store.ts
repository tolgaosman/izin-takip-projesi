"use client";

import { useMemo, useSyncExternalStore } from "react";

import { computeLeaveBalance } from "@/lib/data/balance";
import { seedLeaveRequests, seedPersonnel } from "@/lib/data/seed";
import type {
  LeaveBalance,
  LeaveRequest,
  LeaveStatus,
  Personnel,
  PersonnelStatus,
} from "@/lib/data/types";

const PERSONNEL_KEY = "izin-takip-personnel";
const LEAVES_KEY = "izin-takip-leaves";

let personnel: Personnel[] = seedPersonnel;
let leaves: LeaveRequest[] = seedLeaveRequests;
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

const STORE_VERSION_KEY = "izin-takip-version-v2";

function getLocalTodayIso(): string {
  const t = new Date();
  const m = String(t.getMonth() + 1).padStart(2, "0");
  const d = String(t.getDate()).padStart(2, "0");
  return `${t.getFullYear()}-${m}-${d}`;
}

function syncPersonnelStatuses(silent = false) {
  const todayStr = getLocalTodayIso();
  let changed = false;

  const nextPersonnel = personnel.map((p) => {
    if (p.status === "resigned") return p;
    const hasActiveLeave = leaves.some(
      (l) =>
        l.personnelId === p.id &&
        l.status === "approved" &&
        l.startDate <= todayStr &&
        l.endDate >= todayStr
    );
    const targetStatus: PersonnelStatus = hasActiveLeave ? "on-leave" : "active";
    
    if (p.status !== targetStatus) {
      changed = true;
      return { ...p, status: targetStatus };
    }
    return p;
  });

  if (changed) {
    personnel = nextPersonnel;
    try {
      window.localStorage.setItem(PERSONNEL_KEY, JSON.stringify(personnel));
    } catch {}
    if (!silent) emit();
  }
}

function ensureInit() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  try {
    const version = window.localStorage.getItem(STORE_VERSION_KEY);
    if (version !== "v2") {
      personnel = seedPersonnel;
      leaves = seedLeaveRequests;
      persist(PERSONNEL_KEY, personnel);
      persist(LEAVES_KEY, leaves);
      window.localStorage.setItem(STORE_VERSION_KEY, "v2");
    } else {
      personnel = readKey(PERSONNEL_KEY, seedPersonnel);
      leaves = readKey(LEAVES_KEY, seedLeaveRequests);
    }
  } catch {
    personnel = seedPersonnel;
    leaves = seedLeaveRequests;
  }

  // Ensure tolgaosmanfly@gmail.com is present in personnel list
  const userEmail = "tolgaosmanfly@gmail.com";
  if (!personnel.some((p) => p.email?.toLowerCase().trim() === userEmail)) {
    const defaultUser: Personnel = {
      id: "p-00",
      name: "Tolga Osman",
      department: "Yazılım",
      phone: "0532 000 00 00",
      status: "active",
      email: userEmail,
      startDate: "2023-01-01",
    };
    personnel = [defaultUser, ...personnel];
    persist(PERSONNEL_KEY, personnel);
  }

  syncPersonnelStatuses(true);
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

function getPersonnelSnapshot(): Personnel[] {
  ensureInit();
  return personnel;
}

function getLeavesSnapshot(): LeaveRequest[] {
  ensureInit();
  return leaves;
}

function getPersonnelServerSnapshot(): Personnel[] {
  return seedPersonnel;
}
function getLeavesServerSnapshot(): LeaveRequest[] {
  return seedLeaveRequests;
}

function setPersonnel(next: Personnel[]) {
  personnel = next;
  persist(PERSONNEL_KEY, next);
  emit();
}

function setLeaves(next: LeaveRequest[]) {
  leaves = next;
  persist(LEAVES_KEY, next);
  emit();
  syncPersonnelStatuses(); // Senkronizasyon (personel status update)
}

function newId(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ── React hooks ── */

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

export function usePersonnelBalance(id: string): LeaveBalance | undefined {
  usePersonnel();
  useLeaveRequests();
  return useMemo(() => getLeaveBalance(id), [id, personnel, leaves]);
}

/* ── Non-reactive readers ── */

export function getPersonnelById(id: string): Personnel | undefined {
  ensureInit();
  return personnel.find((p) => p.id === id);
}

export function getLeavesByPersonnel(personnelId: string): LeaveRequest[] {
  ensureInit();
  return leaves.filter((l) => l.personnelId === personnelId);
}

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
  // Bir karar (onay/red) her uygulandığında karar zamanını damgala; böylece
  // son aktiviteler ve bildirimler bu talebi "taze" olay olarak öne çıkarır.
  const patch =
    data.status === "approved" || data.status === "rejected"
      ? { ...data, decidedAt: new Date().toISOString() }
      : data;
  setLeaves(leaves.map((l) => (l.id === id ? { ...l, ...patch } : l)));
}

export function deleteLeaveRequest(id: string) {
  ensureInit();
  setLeaves(leaves.filter((l) => l.id !== id));
}

export function setLeaveStatus(id: string, status: LeaveStatus, rejectionReason?: string) {
  updateLeaveRequest(id, { status, rejectionReason });
}
