"use client";

import { useMemo } from "react";
import { Avatar } from "@/components/dashboard/avatar";
import { usePersonnel, useLeaveRequests } from "@/lib/data/store";
import { leaveTypeLabels, leaveDayCount } from "@/lib/data/types";

export function OnLeaveTable() {
  const allPersonnel = usePersonnel();
  const allRequests = useLeaveRequests();

  const onLeavePersonnel = useMemo(() => {
    let filtered = allPersonnel.filter((p) => p.status === "on-leave");

    return filtered.map((p) => {
      // Find their active leave request (the most recent approved one)
      const reqs = allRequests
        .filter((r) => r.personnelId === p.id && r.status === "approved")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      const req = reqs[0];
      return {
        ...p,
        leaveType: req ? leaveTypeLabels[req.type] : "Bilinmiyor",
        endDate: req ? new Date(req.endDate).toLocaleDateString("tr-TR") : "-",
        daysLeft: req ? leaveDayCount(new Date().toISOString().split("T")[0], req.endDate) : 0,
      };
    });
  }, [allPersonnel, allRequests]);

  if (onLeavePersonnel.length === 0) {
    return (
      <div className="glass-panel flex min-h-[250px] flex-col items-center justify-center rounded-xl p-10 text-center">
        <p className="font-sans text-base text-on-surface-variant">
          Şu anda izinde olan personel bulunmuyor.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-panel overflow-hidden rounded-xl">
      <div className="border-b border-outline-variant/30 p-6">
        <h3 className="font-serif text-2xl font-bold text-primary">İzindeki Personeller</h3>
        <p className="font-mono text-xs text-on-surface-variant/70 italic mt-1">Şu anda aktif olarak izinde olan çalışanlar</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] text-left border-collapse">
          <thead>
            <tr className="border-b border-outline-variant/20 font-mono text-xs uppercase tracking-wider text-on-surface-variant/70">
              <th className="px-6 py-4 font-bold">Personel</th>
              <th className="px-6 py-4 font-bold">Departman</th>
              <th className="px-6 py-4 font-bold">İzin Türü</th>
              <th className="px-6 py-4 font-bold">Dönüş Tarihi</th>
              <th className="px-6 py-4 font-bold text-right">Kalan Süre</th>
            </tr>
          </thead>
          <tbody>
            {onLeavePersonnel.map((p) => (
              <tr
                key={p.id}
                className="border-b border-outline-variant/10 transition-colors hover:bg-white/40 last:border-0"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Avatar name={p.name} className="size-9 shrink-0" />
                    <span className="font-bold text-primary">{p.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-on-surface-variant font-sans text-sm">
                  {p.department}
                </td>
                <td className="px-6 py-4">
                  <span className="inline-block rounded-full border border-outline-variant/30 px-3 py-1 font-mono text-[10px] font-semibold bg-surface-1 text-accent-cyan uppercase tracking-wider">
                    {p.leaveType}
                  </span>
                </td>
                <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">
                  {p.endDate}
                </td>
                <td className="px-6 py-4 text-right">
                  <span className="font-bold text-secondary">
                    {p.daysLeft > 0 ? `${p.daysLeft} gün` : "Bugün dönüyor"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
