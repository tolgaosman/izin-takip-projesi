"use client";

import { useMemo } from "react";

import { Avatar } from "@/components/dashboard/avatar";
import { CardMenu } from "@/components/dashboard/card-menu";
import { usePersonnel, useLeaveRequests } from "@/lib/data/store";
import { leaveTypeLabels } from "@/lib/data/types";

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  if (Number.isNaN(diff)) return "";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Dün";
  if (days < 30) return `${days} gün önce`;
  return new Date(iso).toLocaleDateString("tr-TR");
}

const statusVerb = {
  pending: "talep etti",
  approved: "onaylandı",
  rejected: "reddedildi",
} as const;

export function RecentActivity() {
  const requests = useLeaveRequests();
  const personnel = usePersonnel();

  const activities = useMemo(() => {
    const byId = new Map(personnel.map((p) => [p.id, p.name]));
    return [...requests]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 8)
      .map((r) => ({
        id: r.id,
        actor: byId.get(r.personnelId) ?? "Bilinmeyen",
        type: r.type,
        status: r.status,
        time: relativeTime(r.createdAt),
      }));
  }, [requests, personnel]);

  return (
    <div className="glass-panel flex h-[400px] flex-col rounded-xl p-10">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-serif text-2xl font-bold text-primary">Son Aktiviteler</h3>
        <CardMenu />
      </div>

      {activities.length === 0 ? (
        <div className="flex flex-1 items-center justify-center">
          <p className="font-mono text-xs uppercase text-on-surface-variant/70">
            Henüz etkinlik yok
          </p>
        </div>
      ) : (
        <ul className="custom-scrollbar flex-1 space-y-2 overflow-y-auto pr-2">
          {activities.map((activity) => (
            <li
              key={activity.id}
              className="flex gap-4 border-b border-outline-variant/20 py-4 px-2 transition-colors hover:bg-surface-2 rounded-lg last:border-0"
            >
              <Avatar
                name={activity.actor}
                className="size-10 shrink-0 border border-outline-variant/30"
              />
              <div>
                <p className="font-sans text-base leading-tight text-primary">
                  <span className="font-bold">{activity.actor}</span>{" "}
                  <span className="text-accent-cyan">
                    {leaveTypeLabels[activity.type]}
                  </span>{" "}
                  {statusVerb[activity.status]}
                </p>
                <p className="mt-1 font-mono text-xs text-on-surface-variant/70 uppercase">
                  {activity.time}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
