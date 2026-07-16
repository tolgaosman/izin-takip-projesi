"use client";

import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { usePersonnel, useLeaveRequests } from "@/lib/data/store";
import { leaveTypeLabels, leaveDayCount } from "@/lib/data/types";
import { Avatar } from "@/components/dashboard/avatar";

export default function ActiveLeavesPage() {
  const allPersonnel = usePersonnel();
  const allRequests = useLeaveRequests();
  const [searchQuery, setSearchQuery] = useState("");

  const onLeavePersonnel = useMemo(() => {
    // 1. Durumu 'on-leave' olanları al
    const filtered = allPersonnel.filter((p) => p.status === "on-leave");

    // 2. İzin bilgilerini birleştir
    const withLeaveInfo = filtered.map((p) => {
      const reqs = allRequests
        .filter((r) => r.personnelId === p.id && r.status === "approved")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const req = reqs[0];
      return {
        ...p,
        leaveType: req ? leaveTypeLabels[req.type] : "Bilinmiyor",
        endDate: req ? new Date(req.endDate).toLocaleDateString("tr-TR") : "-",
        daysLeft: req ? leaveDayCount(new Date().toISOString().split("T")[0], req.endDate) : 0,
        rawEndDate: req ? req.endDate : "", // Arama veya sıralama için gerekebilir
      };
    });

    // 3. Arama sorgusuna göre filtrele
    const query = searchQuery.toLowerCase().trim();
    if (!query) return withLeaveInfo;

    return withLeaveInfo.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        p.department.toLowerCase().includes(query) ||
        p.leaveType.toLowerCase().includes(query)
    );
  }, [allPersonnel, allRequests, searchQuery]);

  return (
    <>
      <div className="space-y-8">
        {/* Sayfa Başlığı */}
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant/20 pb-6">
          <div>
            <h2 className="font-serif text-5xl font-bold text-primary">
              Aktif İzinler
            </h2>
            <p className="font-sans text-base text-on-surface-variant mt-2">
              Şu anda izinde olan tüm personellerin listesi, izin türleri ve kalan süreleri.
            </p>
          </div>
        </div>

        {onLeavePersonnel.length === 0 && !searchQuery ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-12 glass-panel rounded-xl my-6">
            <p className="font-sans text-lg text-on-surface-variant max-w-md">
              Şu anda izinde olan herhangi bir personel bulunmuyor.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Arama Çubuğu */}
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/50" />
              <input
                type="text"
                placeholder="Personel adı, departman veya izin türü ara..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-outline-variant/30 bg-surface-1 py-2 pl-9 pr-4 font-sans text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-accent-cyan"
              />
            </div>

            {onLeavePersonnel.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center p-8 glass-panel rounded-xl">
                <p className="font-sans text-base text-on-surface-variant">
                  Arama kriterlerinize uygun izinde olan personel bulunamadı.
                </p>
              </div>
            ) : (
              <div className="glass-panel overflow-hidden rounded-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/20 font-mono text-xs uppercase tracking-wider text-on-surface-variant/70">
                        <th className="px-6 py-4 font-bold">Personel</th>
                        <th className="px-6 py-4 font-bold">Departman</th>
                        <th className="px-6 py-4 font-bold">İzin Türü</th>
                        <th className="px-6 py-4 font-bold">Dönüş Tarihi</th>
                        <th className="px-6 py-4 text-right font-bold">Kalan Süre</th>
                      </tr>
                    </thead>
                    <tbody>
                      {onLeavePersonnel.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-outline-variant/10 transition-colors hover:bg-white/40 last:border-0"
                        >
                          {/* 1. Sütun: Profil Resmi ve İsim */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={p.name} className="size-9 shrink-0" />
                              <span className="font-bold text-primary">{p.name}</span>
                            </div>
                          </td>

                          {/* 2. Sütun: Departman */}
                          <td className="px-6 py-4 text-on-surface-variant font-sans text-sm">
                            {p.department}
                          </td>

                          {/* 3. Sütun: İzin Türü */}
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-full border border-outline-variant/30 px-3 py-1 font-mono text-[10px] font-semibold bg-surface-1 text-accent-cyan uppercase tracking-wider">
                              {p.leaveType}
                            </span>
                          </td>

                          {/* 4. Sütun: Dönüş Tarihi */}
                          <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">
                            {p.endDate}
                          </td>

                          {/* 5. Sütun: Kalan Süre */}
                          <td className="px-6 py-4 text-right">
                            <span className="font-bold text-secondary text-sm">
                              {p.daysLeft > 0 ? `${p.daysLeft} gün` : "Bugün dönüyor"}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
