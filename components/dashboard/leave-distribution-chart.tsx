"use client";

import { useMemo, useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

import { useLeaveRequests } from "@/lib/data/store";
import type { LeaveType } from "@/lib/data/types";
import { cn } from "@/lib/utils";

type Dataset = "annual" | "sick";

const MONTH_LABELS = [
  "Oca", "Şub", "Mar", "Nis", "May", "Haz",
  "Tem", "Ağu", "Eyl", "Eki", "Kas", "Ara",
];

/** Last 6 months (ending this month) of counts for a leave type. */
function buildData(
  requests: { type: LeaveType; startDate: string }[],
  type: LeaveType
) {
  const now = new Date();
  const result: { month: string; value: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = requests.filter((r) => {
      if (r.type !== type) return false;
      const s = new Date(r.startDate);
      return (
        s.getFullYear() === d.getFullYear() && s.getMonth() === d.getMonth()
      );
    }).length;
    result.push({ month: MONTH_LABELS[d.getMonth()], value });
  }
  return result;
}

/* ── Theme-aware colors ── */
const LIGHT = {
  gradStart: "#7b1e2b",
  gradEnd: "#b84456",
  gradStartAlt: "#9e5561",
  gradEndAlt: "#c87a85",
  grid: "rgba(123, 30, 43, 0.06)",
  axisText: "#8a6a70",
  tooltipBg: "rgba(255,255,255,0.95)",
  tooltipBorder: "rgba(123, 30, 43, 0.12)",
  tooltipText: "#2a1216",
  tooltipAccent: "#7b1e2b",
  cursorFill: "rgba(123,30,43,0.04)",
};

const DARK = {
  gradStart: "#ff99a8",
  gradEnd: "#ff6b81",
  gradStartAlt: "#ff7088",
  gradEndAlt: "#e84666",
  grid: "rgba(255, 255, 255, 0.04)",
  axisText: "#71717a",
  tooltipBg: "rgba(39,39,42,0.96)",
  tooltipBorder: "rgba(255,153,168,0.2)",
  tooltipText: "#f8f8f2",
  tooltipAccent: "#ff99a8",
  cursorFill: "rgba(255,255,255,0.03)",
};

function useIsDark() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const check = () =>
      setDark(document.documentElement.classList.contains("dark"));
    check();
    const obs = new MutationObserver(check);
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function CustomTooltip({ active, payload, label, colors }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 backdrop-blur-sm"
      style={{
        background: colors.tooltipBg,
        border: `1px solid ${colors.tooltipBorder}`,
        boxShadow: "0 8px 32px rgba(0,0,0,0.12)",
      }}
    >
      <p
        className="font-sans text-[11px] font-medium uppercase tracking-wider mb-1"
        style={{ color: colors.axisText }}
      >
        {label}
      </p>
      <p
        className="font-mono text-xl font-bold"
        style={{ color: colors.tooltipAccent }}
      >
        {payload[0].value}
        <span
          className="ml-1.5 text-[11px] font-normal"
          style={{ color: colors.axisText }}
        >
          talep
        </span>
      </p>
    </div>
  );
}

export function LeaveDistributionChart() {
  const requests = useLeaveRequests();
  const [active, setActive] = useState<Dataset>("annual");
  const isDark = useIsDark();
  const c = isDark ? DARK : LIGHT;

  const data = useMemo(() => buildData(requests, active), [requests, active]);

  /* Total for the subtle summary badge */
  const total = useMemo(() => data.reduce((s, d) => s + d.value, 0), [data]);

  return (
    <div className="glass-panel flex h-[400px] flex-col rounded-xl p-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-2xl font-bold text-primary">
              İzin Dağılımı
            </h3>
            <span className="inline-flex items-center rounded-full border border-primary/15 bg-primary/5 px-2.5 py-0.5 font-mono text-[11px] font-bold text-primary">
              {total} toplam
            </span>
          </div>
          <p className="mt-1 font-mono text-xs text-on-surface-variant/60 italic">
            Son 6 aylık izin kullanım dağılımı
          </p>
        </div>
        <div className="flex gap-1.5 rounded-lg border border-outline-variant/20 bg-surface-2/50 p-1">
          {(["annual", "sick"] as const).map((key) => (
            <button
              key={key}
              type="button"
              aria-pressed={active === key}
              onClick={() => setActive(key)}
              className={cn(
                "rounded-md px-3.5 py-1.5 font-sans text-xs font-semibold transition-all duration-200 cursor-pointer",
                active === key
                  ? "bg-primary text-white shadow-sm"
                  : "text-on-surface-variant/70 hover:text-primary hover:bg-primary/5"
              )}
            >
              {key === "annual" ? "Yıllık İzin" : "Raporlu"}
            </button>
          ))}
        </div>
      </div>

      {/* Recharts bar chart */}
      <div className="flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, left: -20, bottom: 0 }}
            barCategoryGap="25%"
          >
            <defs>
              <linearGradient id="barGradPrimary" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.gradStart} stopOpacity={0.95} />
                <stop offset="100%" stopColor={c.gradEnd} stopOpacity={0.7} />
              </linearGradient>
              <linearGradient id="barGradAlt" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={c.gradStartAlt} stopOpacity={0.85} />
                <stop offset="100%" stopColor={c.gradEndAlt} stopOpacity={0.55} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="4 4"
              stroke={c.grid}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: c.axisText,
                fontSize: 11,
                fontFamily: "Ubuntu, sans-serif",
                fontWeight: 500,
              }}
              dy={10}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              allowDecimals={false}
              tick={{
                fill: c.axisText,
                fontSize: 11,
                fontFamily: "Ubuntu, sans-serif",
              }}
              dx={-4}
              width={32}
            />
            <Tooltip
              content={<CustomTooltip colors={c} />}
              cursor={{ fill: c.cursorFill, radius: 6 }}
            />
            <Bar
              dataKey="value"
              radius={[8, 8, 2, 2]}
              maxBarSize={44}
              animationDuration={700}
              animationEasing="ease-out"
            >
              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={index % 2 === 0 ? "url(#barGradPrimary)" : "url(#barGradAlt)"}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
