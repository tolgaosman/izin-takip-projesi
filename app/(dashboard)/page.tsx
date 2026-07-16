"use client";

import { CalendarCheck } from "lucide-react";

import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { LeaveDistributionChart } from "@/components/dashboard/leave-distribution-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { OnLeaveTable } from "@/components/dashboard/on-leave-table";
import {
  useActingPersonnel,
  usePersonnelBalance,
  useViewRole,
} from "@/lib/data/store";

/** Çalışan modunda kişiye özel "Kalan İznim" özet kartı. */
function MyLeaveSummary() {
  const actingId = useActingPersonnel();
  const balance = usePersonnelBalance(actingId ?? "");

  if (!balance) return null;

  return (
    <div className="glass-panel mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl p-6">
      <div className="flex items-center gap-4">
        <div className="flex size-12 items-center justify-center rounded-xl bg-accent-cyan/15 text-accent-cyan">
          <CalendarCheck className="size-6" />
        </div>
        <div>
          <p className="font-label-mono text-xs uppercase tracking-wider text-on-surface-variant">
            Kalan Yıllık İznim
          </p>
          <p className="font-serif text-4xl font-bold text-primary">
            {balance.remaining}{" "}
            <span className="text-lg font-normal text-on-surface-variant">
              / {balance.entitled} gün
            </span>
          </p>
        </div>
      </div>
      <div className="flex gap-6 font-label-mono text-xs uppercase tracking-wider text-on-surface-variant">
        <span>
          Kullanılan:{" "}
          <span className="font-bold text-on-surface">{balance.used} gün</span>
        </span>
        <span>
          Bekleyen:{" "}
          <span className="font-bold text-on-surface">{balance.pending} gün</span>
        </span>
      </div>
    </div>
  );
}

export default function IzinTakipDashboard() {
  const viewRole = useViewRole();

  return (
    <>
      <div className="mb-12">
        <h2 className="font-serif text-5xl font-bold text-primary">
          Personel Genel Bakış
        </h2>
        <p className="font-sans text-base text-on-surface-variant mt-2">
          Ekibinizin dinlenme ve katılım durumlarına bütünsel bir bakış. İzin taleplerini hak ettikleri özenle yönetin.
        </p>
      </div>

      {/* Çalışan modunda kişisel bakiye özeti */}
      {viewRole === "employee" && <MyLeaveSummary />}

      {/* Stat cards */}
      <div className="mb-8">
        <DashboardStats />
      </div>

      {/* Chart + activity */}
      <div className="mb-8 grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeaveDistributionChart />
        </div>
        <RecentActivity />
      </div>

      {/* On Leave Table */}
      <div className="mb-8">
        <OnLeaveTable />
      </div>
    </>
  );
}
