"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Check, X, Trash2, CalendarClock, Search } from "lucide-react";

import {
  useLeaveRequests,
  usePersonnel,
  deleteLeaveRequest,
  setLeaveStatus,
} from "@/lib/data/store";
import {
  LeaveRequest,
  LeaveType,
  leaveTypeLabels,
  leaveStatusLabels,
  leaveDayCount,
} from "@/lib/data/types";
import { workingDayCount } from "@/lib/date/business-days";
import { useIsAdmin } from "@/components/auth/role-store";

import { Avatar } from "@/components/dashboard/avatar";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { RejectDialog } from "@/components/dashboard/reject-dialog";
import { LeaveDialog } from "@/components/dashboard/leave-dialog";
import { LeaveStatusBadge } from "@/components/dashboard/badges";
import { ExportButton } from "@/components/dashboard/export-button";


const filterSelectClasses =
  "rounded-lg border border-outline-variant/30 bg-surface-1 px-3 py-2 font-sans text-sm text-on-surface outline-none transition-colors focus:border-accent-cyan cursor-pointer";

export default function LeaveRequestsPage() {
  const requests = useLeaveRequests();
  const personnel = usePersonnel();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  // Çalışan rolü bu sayfayı göremez → Genel Bakış'a yönlendir.
  useEffect(() => {
    if (!isAdmin) router.replace("/");
  }, [isAdmin, router]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<LeaveRequest | null>(null);
  const [toDelete, setToDelete] = useState<LeaveRequest | null>(null);
  const [toReject, setToReject] = useState<LeaveRequest | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  // Çoklu filtre: her alan bağımsız; "all" o kriteri baypas eder.
  const [filters, setFilters] = useState<{
    period: "all" | "this-month" | "last-month";
    department: string;
    type: "all" | LeaveType;
  }>({ period: "all", department: "all", type: "all" });

  const personnelMap = useMemo(() => {
    return new Map(personnel.map((p) => [p.id, p]));
  }, [personnel]);

  // Filtre açılır menüsü için benzersiz departman listesi (mevcut personelden).
  const departments = useMemo(
    () => Array.from(new Set(personnel.map((p) => p.department))).sort(),
    [personnel]
  );

  const sortedRequests = useMemo(() => {
    return [...requests].sort(
      (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }, [requests]);

  const filteredRequests = useMemo(() => {
    // İçinde bulunduğumuz ve bir önceki ayın (yıl, ay) anahtarları.
    const now = new Date();
    const thisKey = `${now.getFullYear()}-${now.getMonth()}`;
    const lastRef = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const lastKey = `${lastRef.getFullYear()}-${lastRef.getMonth()}`;

    const query = searchQuery.toLowerCase().trim();

    return sortedRequests.filter((r) => {
      const person = personnelMap.get(r.personnelId);
      if (!person) return false;

      // 1) Serbest metin arama
      if (query) {
        const matches =
          person.name.toLowerCase().includes(query) ||
          person.department.toLowerCase().includes(query) ||
          leaveTypeLabels[r.type].toLowerCase().includes(query);
        if (!matches) return false;
      }

      // 2) Departman
      if (filters.department !== "all" && person.department !== filters.department) {
        return false;
      }

      // 3) İzin türü
      if (filters.type !== "all" && r.type !== filters.type) {
        return false;
      }

      // 4) Dönem (izin başlangıç tarihine göre)
      if (filters.period !== "all") {
        const [y, m] = r.startDate.split("-").map(Number);
        const key = `${y}-${m - 1}`; // ay 0-index'e çevrildi
        if (filters.period === "this-month" && key !== thisKey) return false;
        if (filters.period === "last-month" && key !== lastKey) return false;
      }

      return true;
    });
  }, [sortedRequests, personnelMap, searchQuery, filters]);

  if (!isAdmin) return null;

  return (
    <>
      <div className="space-y-8">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant/20 pb-6">
          <div>
            <h2 className="font-serif text-5xl font-bold text-primary">
              İzin Talepleri
            </h2>
            <p className="font-sans text-base text-on-surface-variant mt-2">
              Tüm personel izin talepleri, onay durumları ve izin süreleri.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <ExportButton
              filename="izin-talepleri"
              rows={filteredRequests}
              columns={[
                {
                  header: "Personel",
                  value: (r) => personnelMap.get(r.personnelId)?.name ?? "",
                },
                {
                  header: "Departman",
                  value: (r) => personnelMap.get(r.personnelId)?.department ?? "",
                },
                { header: "İzin Türü", value: (r) => leaveTypeLabels[r.type] },
                { header: "Başlangıç", value: (r) => r.startDate },
                { header: "Bitiş", value: (r) => r.endDate },
                {
                  header: "İş Günü",
                  value: (r) => workingDayCount(r.startDate, r.endDate),
                },
                { header: "Durum", value: (r) => leaveStatusLabels[r.status] },
              ]}
            />
            <button
              onClick={() => {
                setEditing(null);
                setDialogOpen(true);
              }}
              className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-base font-bold text-white shadow transition-all hover:opacity-90 active:scale-95 cursor-pointer"
            >
              <Plus className="size-5" />
              <span>Yeni İzin Talebi</span>
            </button>
          </div>
        </div>

        {requests.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-12 glass-panel rounded-xl my-6">
            <p className="font-sans text-lg text-on-surface-variant max-w-md">
              Sistemde henüz izin talebi bulunamadı. Listeyi oluşturmak için sağ üstteki &quot;Yeni İzin Talebi&quot; butonuna tıklayınız.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Arama + Çoklu Filtreler */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px] flex-1 md:max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/50" />
                <input
                  type="text"
                  placeholder="Personel adı, departman veya izin türü ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-1 py-2 pl-9 pr-4 font-sans text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-accent-cyan"
                />
              </div>

              <select
                aria-label="Dönem"
                value={filters.period}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    period: e.target.value as typeof f.period,
                  }))
                }
                className={filterSelectClasses}
              >
                <option value="all">Tüm Dönemler</option>
                <option value="this-month">Bu Ay</option>
                <option value="last-month">Geçen Ay</option>
              </select>

              <select
                aria-label="Departman"
                value={filters.department}
                onChange={(e) =>
                  setFilters((f) => ({ ...f, department: e.target.value }))
                }
                className={filterSelectClasses}
              >
                <option value="all">Tüm Departmanlar</option>
                {departments.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>

              <select
                aria-label="İzin Türü"
                value={filters.type}
                onChange={(e) =>
                  setFilters((f) => ({
                    ...f,
                    type: e.target.value as typeof f.type,
                  }))
                }
                className={filterSelectClasses}
              >
                <option value="all">Tüm Türler</option>
                {(Object.entries(leaveTypeLabels) as [LeaveType, string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>

            {filteredRequests.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center p-8 glass-panel rounded-xl">
                <p className="font-sans text-base text-on-surface-variant">
                  Arama kriterlerinize uygun izin talebi bulunamadı.
                </p>
              </div>
            ) : (
              <div className="glass-panel overflow-hidden rounded-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/20 font-mono text-xs uppercase tracking-wider text-on-surface-variant/70">
                        <th className="px-6 py-4 font-bold">Personel</th>
                        <th className="px-6 py-4 font-bold">İzin Türü</th>
                        <th className="px-6 py-4 font-bold">Tarih Aralığı</th>
                        <th className="px-6 py-4 font-bold">Süre</th>
                        <th className="px-6 py-4 font-bold">Durum</th>
                        {isAdmin && (
                          <th className="px-6 py-4 text-right font-bold">İşlemler</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredRequests.map((r) => {
                        const person = personnelMap.get(r.personnelId);
                        const days = leaveDayCount(r.startDate, r.endDate);

                        return (
                          <tr
                            key={r.id}
                            className="border-b border-outline-variant/15 font-sans text-sm text-on-surface hover:bg-black/[0.02]"
                          >
                            {/* Personel Avatarlı Kolon */}
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <Avatar name={person?.name || "Bilinmeyen"} url={person?.avatarUrl} className="size-8" />
                                <div>
                                  <div className="font-bold text-base text-primary">
                                    {person?.name || "Bilinmeyen Personel"}
                                  </div>
                                  <div className="text-xs text-on-surface-variant/70">
                                    {person?.department || "-"}
                                  </div>
                                </div>
                              </div>
                            </td>

                            {/* İzin Türü */}
                            <td className="px-6 py-4 font-medium text-primary">
                              {leaveTypeLabels[r.type]}
                            </td>

                            {/* Tarih Aralığı */}
                            <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                              {new Date(r.startDate).toLocaleDateString("tr-TR")} - {new Date(r.endDate).toLocaleDateString("tr-TR")}
                            </td>

                            {/* İzin Süresi */}
                            <td className="px-6 py-4 font-mono text-xs font-bold text-primary">
                              {days} Gün
                            </td>

                            {/* Durum Rozeti */}
                            <td className="px-6 py-4">
                              <LeaveStatusBadge status={r.status} />
                            </td>

                            {/* İşlemler (Onay/Red/Düzenle/Sil) — yalnız admin */}
                            {isAdmin && (
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                {r.status === "pending" && (
                                  <>
                                    <button
                                      onClick={() => setLeaveStatus(r.id, "approved")}
                                      title="Onayla"
                                      className="flex size-8 items-center justify-center rounded-md border border-green-600/30 bg-green-500/10 text-green-700 hover:bg-green-500/20 active:scale-95 cursor-pointer"
                                    >
                                      <Check className="size-4" />
                                    </button>
                                    <button
                                      onClick={() => setToReject(r)}
                                      title="Reddet"
                                      className="flex size-8 items-center justify-center rounded-md border border-red-600/30 bg-red-500/10 text-red-700 hover:bg-red-500/20 active:scale-95 cursor-pointer"
                                    >
                                      <X className="size-4" />
                                    </button>
                                  </>
                                )}
                                <button
                                  onClick={() => {
                                    setEditing(r);
                                    setDialogOpen(true);
                                  }}
                                  title="Düzenle"
                                  className="flex size-8 items-center justify-center rounded-md border border-outline-variant/30 text-on-surface-variant hover:bg-black/5 active:scale-95 cursor-pointer"
                                >
                                  <CalendarClock className="size-4" />
                                </button>
                                <button
                                  onClick={() => setToDelete(r)}
                                  title="Sil"
                                  className="flex size-8 items-center justify-center rounded-md border border-destructive/30 bg-destructive/5 text-destructive hover:bg-destructive/10 active:scale-95 cursor-pointer"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                            </td>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <LeaveDialog
        open={dialogOpen}
        onOpenChange={(o) => {
          setDialogOpen(o);
          if (!o) setEditing(null);
        }}
        leave={editing || undefined}
      />

      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Talebi Sil"
        description="Bu izin talebini silmek istediğinize emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Sil"
        cancelLabel="Vazgeç"
        onConfirm={() => {
          if (toDelete) {
            deleteLeaveRequest(toDelete.id);
            setToDelete(null);
          }
        }}
      />

      <RejectDialog
        open={toReject !== null}
        onOpenChange={(o) => !o && setToReject(null)}
        onConfirm={(reason) => {
          if (toReject) {
            setLeaveStatus(toReject.id, "rejected", reason);
            setToReject(null);
          }
        }}
      />
    </>
  );
}
