import { TrendingUp, type LucideIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  /** applies the glowing highlighted treatment (the "Pending" card) */
  highlight?: boolean;
};

const accentText: Record<StatAccent, string> = {
  cyan: "text-accent-cyan",
  violet: "text-accent-violet",
  neutral: "text-on-surface-variant",
};

const accentGlow: Record<StatAccent, string> = {
  cyan: "bg-accent-cyan/10",
  violet: "bg-accent-violet/10",
  neutral: "bg-white/5",
};

export function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  trend,
  caption,
  action,
  highlight,
}: Stat) {
  return (
    <div
      className={cn(
        "glass-panel group relative flex h-48 flex-col justify-between overflow-hidden rounded-xl p-6",
        highlight && "glow-cyan border-accent-cyan/30"
      )}
    >
      {highlight ? (
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-accent-cyan/5 to-transparent" />
      ) : (
        <div
          className={cn(
            "pointer-events-none absolute -mr-10 -mt-10 right-0 top-0 h-32 w-32 rounded-full blur-[40px] transition-transform duration-700 group-hover:scale-150",
            accentGlow[accent]
          )}
        />
      )}

      <div>
        <div
          className={cn(
            "mb-2 flex items-center gap-2",
            highlight ? "text-accent-cyan" : accentText[accent]
          )}
        >
          <Icon className="size-4" />
          <span className="font-label-mono text-xs uppercase tracking-wider">
            {label}
          </span>
        </div>
        <div
          className={cn(
            "text-6xl font-bold tracking-tight",
            highlight ? "text-accent-cyan text-glow-cyan" : "text-on-surface"
          )}
        >
          {value}
        </div>
      </div>

      <div className="mt-auto">
        {action ? (
          <Button
            variant="outline"
            size="sm"
            className="rounded-full border-white/20 bg-transparent font-label-mono text-xs text-on-surface hover:bg-white/10"
          >
            {action}
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            {trend && (
              <span
                className={cn(
                  "flex items-center gap-1 font-label-mono text-xs",
                  accentText[accent]
                )}
              >
                <TrendingUp className="size-4" />
                {trend}
              </span>
            )}
            {caption && (
              <span
                className={cn(
                  "font-label-mono text-xs",
                  trend ? "text-on-surface-variant/50" : accentText[accent]
                )}
              >
                {caption}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
