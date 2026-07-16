import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { LeaveDistributionChart } from "@/components/dashboard/leave-distribution-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";

export default function IzinTakipDashboard() {
  return (
    <>
      <div className="mb-12">
        <h2 className="mb-2 font-serif text-5xl font-bold tracking-tight text-primary md:text-6xl">
          Personel Genel Bakış
        </h2>
        <p className="max-w-2xl font-sans text-lg text-on-surface-variant">
          Ekibinizin dinlenme ve katılım durumlarına bütünsel bir bakış. İzin taleplerini hak ettikleri özenle yönetin.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-8">
        <DashboardStats />
      </div>

      {/* Chart + activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LeaveDistributionChart />
        </div>
        <RecentActivity />
      </div>
    </>
  );
}
