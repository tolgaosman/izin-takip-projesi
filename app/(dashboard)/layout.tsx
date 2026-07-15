import { AuthGuard } from "@/components/auth/auth-guard";
import { TopNav } from "@/components/dashboard/top-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthGuard>
      <div className="min-h-screen overflow-x-hidden bg-background text-on-surface">
        {/* Ambient background lighting */}
        <div className="pointer-events-none fixed inset-0 z-0 opacity-30">
          <div className="absolute left-[-10%] top-[-10%] h-[50%] w-[50%] rounded-full bg-accent-violet/20 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] h-[40%] w-[40%] rounded-full bg-accent-cyan/20 blur-[100px]" />
        </div>

        <TopNav />

        <main className="relative z-10 min-h-screen px-6 pb-24 pt-32 mx-auto max-w-[1200px]">
          <div className="space-y-4">{children}</div>
        </main>
      </div>
    </AuthGuard>
  );
}
