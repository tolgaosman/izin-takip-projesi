"use client";

import { useMemo, useState } from "react";

import { useLeaveRequests } from "@/lib/data/store";
import type { LeaveType } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type ChartBar = {
  month: string;
  value: number;
  color: "cyan" | "violet";
};

type Dataset = "annual" | "sick";

const MONTH_LABELS = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

/** Last 6 months (ending this month) of counts for a leave type. */
function buildBars(
  requests: { type: LeaveType; startDate: string }[],
  type: LeaveType
): ChartBar[] {
  const now = new Date();
  const bars: ChartBar[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = requests.filter((r) => {
      if (r.type !== type) return false;
      const s = new Date(r.startDate);
      return (
        s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth()
      );
    }).length;
    bars.push({
      month: MONTH_LABELS[d.getMonth()],
      value,
      color: i % 2 === 0 ? "cyan" : "violet",
    });
  }
  return bars;
}

export function LeaveDistributionChart() {
  const requests = useLeaveRequests();
  const [active, setActive] = useState<Dataset>("annual");

  const bars = useMemo(() => buildBars(requests, active), [requests, active]);
  const axisMax = useMemo(
    () => Math.max(4, Math.ceil(Math.max(1, ...bars.map((b) => b.value)) / 4) * 4),
    [bars]
  );
  const axisTicks = useMemo(
    () => [axisMax, (axisMax * 3) / 4, axisMax / 2, axisMax / 4, 0].map(Math.round),
    [axisMax]
  );

  return (
    <div className="glass-panel flex h-[400px] flex-col rounded-xl p-10">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="font-serif text-2xl font-bold text-primary">
            İzin Dağılımı
          </h3>
          <p className="font-mono text-xs text-on-surface-variant/70 italic">
            Aylık izin kullanım dağılımı
          </p>
        </div>
        <div className="flex gap-2">
          {(["annual", "sick"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={active === key}
              onClick={() => setActive(key)}
              className={cn(
                "rounded-full border px-3 py-1 font-mono text-xs capitalize transition-colors cursor-pointer",
                active === key
                  ? "border-primary bg-primary text-white"
                  : "border-outline-variant bg-transparent text-on-surface-variant hover:text-primary"
              )}
            >
              {key === "annual" ? "Yıllık İzin" : "Raporlu"}
            </button>
          ))}
        </div>
      </div>

      {/* Plot area */}
      <div className="relative mt-auto flex flex-1 items-end justify-between border-b border-outline-variant/30 px-4 pb-4">
        {/* Y axis */}
        <div className="absolute bottom-4 left-0 top-0 flex w-8 flex-col justify-between font-mono text-[10px] text-on-surface-variant/50">
          {axisTicks.map((tick, i) => (
            <span key={i}>{tick}</span>
          ))}
        </div>

        {/* Grid lines */}
        <div className="pointer-events-none absolute bottom-4 left-8 right-0 top-0 flex flex-col justify-between">
          {axisTicks.slice(1).map((_, i) => (
            <div key={i} className="h-0 w-full border-b border-outline-variant/10" />
          ))}
        </div>

        {/* Bars */}
        <div className="relative z-10 ml-8 flex h-[90%] w-full items-end justify-around">
          {bars.map(({ month, value, color }, i) => (
            <div
              key={`${month}-${i}`}
              className={cn(
                "group relative w-8 rounded-t-sm transition-all duration-300 md:w-12",
                color === "cyan" ? "chart-bar-cyan" : "chart-bar-violet"
              )}
              style={{ height: `${(value / axisMax) * 100}%` }}
            >
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 rounded border border-outline-variant/30 bg-surface-1 p-1 font-mono text-[10px] text-on-surface opacity-0 transition-opacity group-hover:opacity-100 shadow-md">
                {value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* X axis */}
      <div className="ml-8 mt-2 flex items-center justify-around font-mono text-[10px] uppercase text-on-surface-variant/70">
        {bars.map(({ month }, i) => (
          <span key={`${month}-${i}`}>{month}</span>
        ))}
      </div>
    </div>
  );
}
