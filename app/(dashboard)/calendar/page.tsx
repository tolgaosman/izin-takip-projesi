"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLeaveRequests, usePersonnel } from "@/lib/data/store";
import { useIsAdmin } from "@/components/auth/role-store";
import type { Personnel } from "@/lib/data/types";
import {
  CalendarDayDialog,
  type CalendarDayEntry,
} from "@/components/dashboard/calendar-day-dialog";

export default function CalendarPage() {
  const requests = useLeaveRequests();
  const personnel = usePersonnel();
  const isAdmin = useIsAdmin();
  const router = useRouter();

  // Çalışan rolü bu sayfayı göremez → Genel Bakış'a yönlendir.
  useEffect(() => {
    if (!isAdmin) router.replace("/");
  }, [isAdmin, router]);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [selected, setSelected] = useState<{
    iso: string;
    entries: CalendarDayEntry[];
  } | null>(null);

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
  // Adjust so Monday is 0, Sunday is 6
  const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const personnelMap = useMemo(() => {
    const map = new Map<string, Personnel>();
    personnel.forEach((p) => map.set(p.id, p));
    return map;
  }, [personnel]);

  // Takvimde gösterilecek izinler: onaylı + bekleyen (reddedilenler hariç).
  // Bekleyenler farklı stille gösterilir, böylece yeni talep anında görünür.
  const visibleLeaves = useMemo(
    () => requests.filter((r) => r.status === "approved" || r.status === "pending"),
    [requests]
  );

  const renderCells = () => {
    const cells = [];
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, "0");

    // Boş günler
    for (let i = 0; i < startOffset; i++) {
      cells.push(<div key={`empty-${i}`} className="min-h-[120px] rounded-xl bg-surface-1/50 border border-outline-variant/10"></div>);
    }

    // Ayın günleri
    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = String(day).padStart(2, "0");
      const currentIso = `${year}-${month}-${dayStr}`;

      // O gün izinde olanları bul (personeli çözümlenmiş olarak); onaylılar
      // önce gelsin ki çipler tutarlı sıralansın.
      const entries: CalendarDayEntry[] = visibleLeaves
        .filter((r) => currentIso >= r.startDate && currentIso <= r.endDate)
        .map((leave) => {
          const person = personnelMap.get(leave.personnelId);
          return person ? { leave, person } : null;
        })
        .filter((e): e is CalendarDayEntry => e !== null)
        .sort((a, b) => (a.leave.status === b.leave.status ? 0 : a.leave.status === "approved" ? -1 : 1));

      const hasLeave = entries.length > 0;

      // Haftasonu kontrolü
      const dateObj = new Date(year, currentDate.getMonth(), day);
      const isWeekend = dateObj.getDay() === 0 || dateObj.getDay() === 6;

      const cellContent = (
        <>
          <div className={`font-mono text-sm font-bold ${isWeekend ? "text-on-surface-variant/50" : "text-primary"}`}>
            {day}
          </div>
          <div className="mt-2 flex flex-col gap-1">
            {entries.map(({ leave, person }, idx) => (
              <div
                key={`${leave.id}-${idx}`}
                className={`truncate rounded px-2 py-1 text-xs font-semibold ${
                  leave.status === "approved"
                    ? "bg-accent/50 text-accent-foreground shadow-sm"
                    : "border border-dashed border-accent-violet/50 bg-accent-violet/10 text-accent-violet"
                }`}
                title={`${person.name} (${person.department}) — ${
                  leave.status === "approved" ? "Onaylandı" : "Bekliyor"
                }`}
              >
                {person.name.split(" ")[0]}
              </div>
            ))}
          </div>
        </>
      );

      const baseCell = "min-h-[120px] rounded-xl border p-2 text-left transition-colors";

      cells.push(
        hasLeave ? (
          <button
            key={day}
            type="button"
            onClick={() => setSelected({ iso: currentIso, entries })}
            aria-label={`${day} — ${entries.length} izinli personel, detayları gör`}
            className={`${baseCell} border-accent-cyan/40 bg-surface-1 cursor-pointer hover:border-accent-cyan hover:shadow-md active:scale-[0.99]`}
          >
            {cellContent}
          </button>
        ) : (
          <div
            key={day}
            className={`${baseCell} border-outline-variant/20 ${isWeekend ? "bg-surface-2" : "bg-surface-1"}`}
          >
            {cellContent}
          </div>
        )
      );
    }

    return cells;
  };

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  if (!isAdmin) return null;

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <h2 className="font-serif text-5xl font-bold text-primary">
            İzin Takvimi
          </h2>
          <p className="font-sans text-base text-on-surface-variant mt-2">
            Personel izinlerinin aylık görünümü.
          </p>
          <div className="mt-3 flex items-center gap-4 font-label-mono text-xs uppercase tracking-wider text-on-surface-variant">
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm bg-accent/50" />
              Onaylı
            </span>
            <span className="flex items-center gap-1.5">
              <span className="size-3 rounded-sm border border-dashed border-accent-violet/60 bg-accent-violet/10" />
              Bekleyen
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 bg-surface-1 rounded-full px-4 py-2 border border-outline-variant/30 shadow-sm">
          <button onClick={prevMonth} className="p-2 hover:bg-black/5 rounded-full cursor-pointer transition-colors text-on-surface-variant">
            <ChevronLeft className="size-5" />
          </button>
          <div className="font-serif text-lg font-bold w-40 text-center text-primary">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </div>
          <button onClick={nextMonth} className="p-2 hover:bg-black/5 rounded-full cursor-pointer transition-colors text-on-surface-variant">
            <ChevronRight className="size-5" />
          </button>
        </div>
      </div>

      <div className="glass-panel p-6 rounded-2xl overflow-x-auto custom-scrollbar">
        <div className="min-w-[800px]">
          <div className="grid grid-cols-7 gap-4 mb-4">
            {["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((day, idx) => (
              <div key={day} className={`text-center font-bold text-sm ${idx >= 5 ? "text-on-surface-variant/50" : "text-on-surface-variant"}`}>
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-4">
            {renderCells()}
          </div>
        </div>
      </div>

      <CalendarDayDialog
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
        dateIso={selected?.iso ?? null}
        entries={selected?.entries ?? []}
      />
    </div>
  );
}
