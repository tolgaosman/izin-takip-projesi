"use client";

import { useMemo } from "react";
import { Plane } from "lucide-react";

import { useLeaveRequests, usePersonnel } from "@/lib/data/store";
import { leaveDayCount, leaveTypeLabels } from "@/lib/data/types";
import { Avatar } from "@/components/dashboard/avatar";

export default function ActiveLeavesPage() {
  const requests = useLeaveRequests();
  const personnel = usePersonnel();

  const personnelMap = useMemo(
    () => new Map(personnel.map((p) => [p.id, p])),
    [personnel]
  );

  // Bugün YYYY-MM-DD (ISO string karşılaştırması yeterli).
  const today = new Date().toISOString().slice(0, 10);

  // Aktif izin = onaylı VE bugün [start, end] aralığında.
  const activeLeaves = useMemo(() => {
    return requests
      .filter(
        (r) =>
          r.status === "approved" &&
          r.startDate <= today &&
          today <= r.endDate
      )
      .sort((a, b) => (a.endDate < b.endDate ? -1 : 1)); // en yakında bitecek üstte
  }, [requests, today]);

  return (
    <div className="space-y-8">
      <div className="border-b border-outline-variant/20 pb-6">
        <h2 className="font-serif text-5xl font-bold text-primary">
          Aktif İzinler
        </h2>
        <p className="font-sans text-base text-on-surface-variant mt-2">
          Şu anda izinde olan personel ve izinlerinin kalan süreleri.
        </p>
      </div>

      {activeLeaves.length === 0 ? (
        <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-12 glass-panel rounded-xl my-6">
          <Plane className="size-10 text-on-surface-variant/40 mb-4" />
          <p className="font-sans text-lg text-on-surface-variant max-w-md">
            Şu anda izinde olan personel bulunmuyor.
          </p>
        </div>
      ) : (
        <div className="glass-panel overflow-hidden rounded-xl">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/20 font-mono text-xs uppercase tracking-wider text-on-surface-variant/70">
                  <th className="px-6 py-4 font-bold">İsim</th>
                  <th className="px-6 py-4 font-bold">İzin Türü</th>
                  <th className="px-6 py-4 font-bold">Başlangıç - Bitiş</th>
                  <th className="px-6 py-4 font-bold">Kalan Gün</th>
                  <th className="px-6 py-4 font-bold">Açıklama</th>
                </tr>
              </thead>
              <tbody>
                {activeLeaves.map((r) => {
                  const person = personnelMap.get(r.personnelId);
                  const remaining = leaveDayCount(today, r.endDate);

                  return (
                    <tr
                      key={r.id}
                      className="border-b border-outline-variant/15 font-sans text-sm text-on-surface hover:bg-black/[0.02]"
                    >
                      {/* İsim */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={person?.name || "Bilinmeyen"}
                            className="size-8"
                          />
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

                      {/* Başlangıç - Bitiş */}
                      <td className="px-6 py-4 font-mono text-xs text-on-surface-variant">
                        {new Date(r.startDate).toLocaleDateString("tr-TR")} -{" "}
                        {new Date(r.endDate).toLocaleDateString("tr-TR")}
                      </td>

                      {/* Kalan Gün (hesaplanır) */}
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-accent-cyan/30 bg-accent-cyan/10 px-3 py-1 font-mono text-xs font-bold text-accent-cyan">
                          {remaining} gün
                        </span>
                      </td>

                      {/* Açıklama */}
                      <td className="px-6 py-4 text-on-surface-variant max-w-xs">
                        {r.note?.trim() ? r.note : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
