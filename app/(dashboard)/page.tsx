"use client";

import { useIsAdmin } from "@/components/auth/role-store";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { EmployeeDashboard } from "@/components/dashboard/employee-dashboard";
import { LeaveDistributionChart } from "@/components/dashboard/leave-distribution-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { OnLeaveTable } from "@/components/dashboard/on-leave-table";

export default function IzinTakipDashboard() {
  const isAdmin = useIsAdmin();

  // Çalışan rolü: şirket-geneli panel yerine kişisel (bireysel) panel.
  if (!isAdmin) return <EmployeeDashboard />;

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
