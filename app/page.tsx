import { CalendarClock, CircleCheckBig, Users } from "lucide-react";

import { LeaveDistributionChart } from "@/components/dashboard/leave-distribution-chart";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Sidebar } from "@/components/dashboard/sidebar";
import { StatCard, type Stat } from "@/components/dashboard/stat-card";
import { TopNav } from "@/components/dashboard/top-nav";

const stats: Stat[] = [
  {
    label: "Total Personnel",
    value: "124",
    icon: Users,
    accent: "cyan",
    trend: "+12%",
    caption: "vs last month",
  },
  {
    label: "Pending",
    value: "8",
    icon: CalendarClock,
    accent: "cyan",
    action: "Action Required",
    highlight: true,
  },
  {
    label: "Approved",
    value: "45",
    icon: CircleCheckBig,
    accent: "violet",
    caption: "This Week",
  },
];

export default function IzinTakipDashboard() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
      {/* Ambient background lighting */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
        <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-accent-violet/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent-cyan/20 blur-[100px]" />
      </div>

      <Sidebar />
      <TopNav />

      <main className="relative z-10 min-h-screen px-4 pb-10 pt-24 md:ml-64 md:px-10 md:pt-32">
        <div className="mx-auto max-w-7xl space-y-4">
          {/* Page header */}
          <div className="mb-8">
            <h2 className="mb-2 text-5xl font-bold tracking-tight text-on-surface md:text-6xl">
              Genel Bakış
            </h2>
            <p className="max-w-2xl text-base text-on-surface-variant">
              Personel metrikleri ve bekleyen işlemlerin gerçek zamanlı
              görünümü.
            </p>
          </div>

          {/* Stat cards */}
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
            {stats.map((stat) => (
              <StatCard key={stat.label} {...stat} />
            ))}
          </div>

          {/* Chart + activity */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <LeaveDistributionChart />
            </div>
            <RecentActivity />
          </div>
        </div>
      </main>
    </div>
  );
}
