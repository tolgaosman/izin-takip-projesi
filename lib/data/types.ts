/* Domain model for the leave-tracking app.
   Centralised here so pages/components share one source of truth. */

export type PersonnelStatus = "active" | "on-leave" | "inactive" | "resigned";

/** RBAC simulation role. An "employee" only ever sees their own data;
    an "admin" (İK) sees everything and can approve/reject requests. */
export type UserRole = "employee" | "admin";

export type Personnel = {
  id: string;
  name: string;
  department: string;
  phone: string;
  status: PersonnelStatus;
  email?: string;
  /** Employment start date, ISO (yyyy-mm-dd). Also the seniority source
      used to derive each person's annual leave entitlement. */
  startDate?: string;
  /** Access level for the RBAC simulation. Defaults to "employee" when absent. */
  role?: UserRole;
};

export type LeaveType = "annual" | "excuse" | "sick" | "unpaid";
export type LeaveStatus = "pending" | "approved" | "rejected";

export type LeaveRequest = {
  id: string;
  personnelId: string;
  type: LeaveType;
  /** ISO yyyy-mm-dd */
  startDate: string;
  /** ISO yyyy-mm-dd */
  endDate: string;
  status: LeaveStatus;
  note?: string;
  /** ISO timestamp of creation, used for activity/sorting */
  createdAt: string;
};

/* ── Turkish display labels (single source for the UI) ── */

export const leaveTypeLabels: Record<LeaveType, string> = {
  annual: "Yıllık İzin",
  excuse: "Mazeret İzni",
  sick: "Hastalık İzni",
  unpaid: "Ücretsiz İzin",
};

export const leaveStatusLabels: Record<LeaveStatus, string> = {
  pending: "Bekliyor",
  approved: "Onaylandı",
  rejected: "Reddedildi",
};

export const personnelStatusLabels: Record<PersonnelStatus, string> = {
  active: "Aktif",
  "on-leave": "İzinde",
  inactive: "Pasif",
  resigned: "Ayrıldı",
};

/** Whole calendar days between two ISO dates, inclusive of both ends.
    NOTE: counts weekends/holidays too. For the number of days that actually
    come out of someone's balance, use workingDayCount() in lib/date. */
export function leaveDayCount(startDate: string, endDate: string): number {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const ms = end.getTime() - start.getTime();
  if (Number.isNaN(ms) || ms < 0) return 0;
  return Math.floor(ms / 86_400_000) + 1;
}

/* ── Leave balance ─────────────────────────────────────────────────────
   A *derived* view object — it is never stored. It is recomputed on demand
   from a person + their approved annual leaves, so it can never drift out of
   sync with the underlying data (single source of truth). */
export type LeaveBalance = {
  personnelId: string;
  /** Yearly annual-leave entitlement, derived from seniority (startDate). */
  entitled: number;
  /** Working days already consumed by APPROVED annual leaves. */
  used: number;
  /** Working days locked up in PENDING annual requests (not yet deducted). */
  pending: number;
  /** entitled - used. Can be shown to the user as "kalan izin". */
  remaining: number;
};
