"use client";

import { CalendarClock, CircleCheckBig, CircleX, Users } from "lucide-react";

import { StatCard, type Stat } from "@/components/dashboard/stat-card";
import { useDashboardStats } from "@/lib/data/store";

export function DashboardStats() {
  const { totalPersonnel, pending, approved, rejected } = useDashboardStats();

  const stats: Stat[] = [
    {
      label: "TOPLAM PERSONEL",
      value: String(totalPersonnel),
      icon: Users,
      accent: "cyan",
      caption: "Kayıtlı Çalışan Sayısı",
      valueColor: "dark:text-white",
    },
    {
      label: "BEKLEYEN TALEPLER",
      value: String(pending),
      icon: CalendarClock,
      accent: "cyan",
      action: "Şimdi İncele",
      actionHref: "/leave-requests",
      highlight: true,
    },
    {
      label: "ONAYLANAN İZİNLER",
      value: String(approved),
      icon: CircleCheckBig,
      accent: "violet",
      caption: "Güncel İzinli Sayısı",
    },
    {
      label: "REDDEDİLEN TALEPLER",
      value: String(rejected),
      icon: CircleX,
      accent: "neutral",
      caption: "Reddedilen İzin Talepleri",
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4 lg:gap-6">
      {stats.map((stat) => (
        <StatCard key={stat.label} {...stat} />
      ))}
    </div>
  );
}
