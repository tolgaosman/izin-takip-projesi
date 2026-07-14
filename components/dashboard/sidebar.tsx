import {
  Briefcase,
  CalendarDays,
  LayoutDashboard,
  Plus,
  Users,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  active?: boolean;
};

const navItems: NavItem[] = [
  { label: "Dashboard", icon: LayoutDashboard, href: "#", active: true },
  { label: "Personnel List", icon: Users, href: "#" },
  { label: "Leave Requests", icon: CalendarDays, href: "#" },
];

export function Sidebar() {
  return (
    <nav className="fixed left-0 top-0 z-40 hidden h-screen w-64 flex-col border-r border-white/10 bg-surface-1/10 p-6 shadow-[0_0_40px_rgba(0,220,229,0.1)] backdrop-blur-xl md:flex">
      <div className="mb-10 mt-4 flex items-center gap-3 px-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-full border border-accent-cyan/30 bg-accent-cyan/20">
          <Briefcase className="size-5 text-accent-cyan" />
        </div>
        <div>
          <h1 className="text-2xl font-bold leading-tight text-on-surface">
            Personnel Pro
          </h1>
          <p className="font-label-mono text-xs uppercase tracking-wider text-accent-cyan/70">
            Admin Console
          </p>
        </div>
      </div>

      <div className="flex-1 space-y-2">
        {navItems.map(({ label, icon: Icon, href, active }) => (
          <a
            key={label}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex items-center gap-3 rounded-lg px-4 py-3 transition-all active:scale-95",
              active
                ? "border border-accent-cyan/30 bg-accent-cyan/15 text-accent-cyan shadow-[0_0_15px_rgba(0,220,229,0.2)]"
                : "text-on-surface-variant hover:bg-white/5 hover:text-on-surface"
            )}
          >
            <Icon className="size-5" />
            <span className={cn("text-base", active && "font-bold")}>
              {label}
            </span>
          </a>
        ))}
      </div>

      <div className="mt-auto pt-6">
        <Button className="h-auto w-full gap-2 bg-accent-cyan px-4 py-3 text-base font-bold text-[#003739] shadow-[0_0_20px_rgba(0,220,229,0.3)] hover:bg-accent-cyan/90">
          <Plus className="size-5" />
          New Request
        </Button>
      </div>
    </nav>
  );
}
