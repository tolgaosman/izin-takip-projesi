import { type LucideIcon } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export type StatAccent = "cyan" | "violet" | "neutral";

export type Stat = {
  label: string;
  value: string;
  icon: LucideIcon;
  accent: StatAccent;
  /** e.g. "+12%" shown with a trending-up glyph */
  trend?: string;
  /** small caption after the trend or on its own */
  caption?: string;
  /** label for the pill CTA (renders instead of trend/caption) */
  action?: string;
  /** when set with `action`, the pill navigates here */
  actionHref?: string;
  /** applies the glowing highlighted treatment (the "Pending" card) */
  highlight?: boolean;
  /** override the color of the value text (e.g. 'text-destructive') */
  valueColor?: string;
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  caption,
  action,
  actionHref,
  highlight,
  valueColor,
}: Stat) {
  return (
    <div
      className={cn(
        "glass-panel group relative flex flex-col justify-between overflow-hidden rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 sm:p-5 md:p-6",
        highlight && "bg-surface-2"
      )}
    >
      {/* Decorative sketchy background element for Global Force card */}
      {accent === "cyan" && !highlight && (
        <svg className="absolute bottom-0 right-0 hidden opacity-10 pointer-events-none sm:block" height="120" viewBox="0 0 100 100" width="120">
          <circle className="text-primary" cx="80" cy="80" fill="none" r="40" stroke="currentColor" strokeWidth="0.5"></circle>
          <circle className="text-primary" cx="80" cy="80" fill="none" r="30" stroke="currentColor" strokeWidth="0.5"></circle>
        </svg>
      )}

      <div>
        <div className="mb-2 flex items-start gap-2 text-secondary">
          <Icon className="mt-0.5 size-4 shrink-0 opacity-75" />
          <span className="font-mono text-[11px] uppercase leading-tight tracking-widest sm:text-xs">
            {label}
          </span>
        </div>
        <div
          className={cn(
            "font-serif text-3xl font-bold tracking-tight mt-2 md:text-4xl",
            valueColor ? valueColor : highlight ? "text-destructive" : (accent === "cyan" ? "text-primary" : "text-secondary-container")
          )}
        >
          {value.padStart(2, "0")}
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
        <div className="font-sans text-xs text-on-surface-variant md:text-sm">
          {highlight ? "Onay Bekleyenler" : (caption || "Toplam Personel")}
        </div>

        {action && actionHref && (
          <Link href={actionHref} className="group/btn flex flex-col items-center font-mono text-xs text-primary font-bold">
            <span>{action}</span>
            <div className="h-[2px] w-0 bg-primary transition-all duration-300 group-hover/btn:w-full" />
          </Link>
        )}
      </div>
    </div>
  );
}
