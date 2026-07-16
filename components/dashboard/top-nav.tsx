"use client";

import { useState, useMemo } from "react";
import { Popover } from "@base-ui/react/popover";
import { Bell, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { UserMenu } from "@/components/dashboard/user-menu";
import { useLeaveRequests, usePersonnel, useRole, setRole, AVAILABLE_ROLES } from "@/lib/data/store";
import { leaveTypeLabels } from "@/lib/data/types";

function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const diff = Date.now() - then;
  if (Number.isNaN(diff)) return "";
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${Math.max(mins, 1)} dk önce`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours} saat önce`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Dün";
  if (days < 30) return `${days} gün önce`;
  return new Date(iso).toLocaleDateString("tr-TR");
}

const iconButtonClasses =
  "flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-black/5 hover:text-primary data-[popup-open]:bg-black/5 data-[popup-open]:text-primary";

const popupClasses =
  "glass-panel z-50 rounded-xl p-2 shadow-2xl outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0";

export function TopNav() {
  const { user } = useAuth();
  const requests = useLeaveRequests();
  const personnel = usePersonnel();
  const activeRole = useRole();

  const notifications = useMemo(() => {
    // ... rest of notifications memo ...
    const byId = new Map(personnel.map((p) => [p.id, p.name]));
    const items: { id: string; title: string; time: string; sortTime: number }[] = [];
    const todayStr = new Date().toISOString().split("T")[0];

    requests.forEach((r) => {
      const name = byId.get(r.personnelId) ?? "Bilinmeyen";

      if (r.status === "pending") {
        items.push({
          id: `${r.id}-pending`,
          title: `${name} ${leaveTypeLabels[r.type]} talep etti`,
          time: relativeTime(r.createdAt),
          sortTime: new Date(r.createdAt).getTime(),
        });
      } else if (r.status === "approved") {
        const start = new Date(r.startDate).getTime();
        const end = new Date(r.endDate).getTime();
        const today = new Date(todayStr).getTime();

        if (today >= start) {
          items.push({
            id: `${r.id}-on-leave`,
            title: `${name} izne çıktı`,
            time: relativeTime(r.startDate + "T09:00:00"),
            sortTime: start,
          });
        }

        if (today > end) {
          const nextDay = new Date(end + 86400000);
          const nextDayStr = nextDay.toISOString().split("T")[0];
          items.push({
            id: `${r.id}-returned`,
            title: `${name} izinden döndü`,
            time: relativeTime(nextDayStr + "T09:00:00"),
            sortTime: nextDay.getTime(),
          });
        }
      }
    });

    return items
      .sort((a, b) => b.sortTime - a.sortTime)
      .slice(0, 5);
  }, [requests, personnel]);

  return (
    <header className="absolute left-64 right-0 top-0 z-30 hidden h-20 items-center justify-between px-10 border-b border-outline-variant/20 bg-transparent md:flex">
      <div className="font-serif text-base font-bold text-primary">
        {user ? `Merhaba, ${user.name} 👋` : "Merhaba 👋"}
      </div>

      <div className="flex items-center gap-4">
        {/* Role Selector */}
        <Popover.Root>
          <Popover.Trigger aria-label="Rol Seçimi" className="flex items-center gap-2 rounded-lg border border-outline-variant/30 bg-surface-1 px-3 py-1.5 font-sans text-sm font-bold text-on-surface-variant transition-colors hover:bg-black/5 hover:text-primary data-[popup-open]:bg-black/5 cursor-pointer">
            <span>{activeRole}</span>
            <ChevronRight className="size-4 rotate-90" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={8} align="end" className="z-50">
              <Popover.Popup className={`${popupClasses} w-56`}>
                <div className="border-b border-outline-variant/30 px-3 py-2">
                  <Popover.Title className="text-xs font-bold uppercase tracking-wider text-on-surface-variant/70">
                    Görünüm Yetkisi
                  </Popover.Title>
                </div>
                <ul className="py-1">
                  {AVAILABLE_ROLES.map((role) => (
                    <li key={role}>
                      <button
                        onClick={() => setRole(role)}
                        className={`w-full text-left cursor-pointer rounded-lg px-3 py-2 text-sm transition-colors ${
                          activeRole === role
                            ? "bg-primary font-bold text-white shadow-sm"
                            : "hover:bg-black/5 text-on-surface"
                        }`}
                      >
                        {role}
                      </button>
                    </li>
                  ))}
                </ul>
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>
        {/* Takvim Dropdown */}
        <Popover.Root>
          <Popover.Trigger aria-label="Takvim" className={iconButtonClasses}>
            <Calendar className="size-5" />
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={12} align="end" className="z-50">
              <Popover.Popup className={`${popupClasses} w-72 p-4`}>
                <MiniCalendar />
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        {/* Notifications */}
        <Popover.Root>
          <Popover.Trigger aria-label="Notifications" className={iconButtonClasses}>
            <span className="relative">
              <Bell className="size-5" />
              {notifications.length > 0 && (
                <span className="absolute -right-0.5 -top-0.5 size-2 rounded-full bg-destructive" />
              )}
            </span>
          </Popover.Trigger>
          <Popover.Portal>
            <Popover.Positioner sideOffset={12} align="end" className="z-50">
              <Popover.Popup className={`${popupClasses} w-80`}>
                <div className="border-b border-outline-variant/30 px-3 py-2">
                  <Popover.Title className="text-base font-bold text-on-surface">
                    Bildirimler
                  </Popover.Title>
                </div>
                {notifications.length === 0 ? (
                  <p className="px-3 py-6 text-center text-sm text-on-surface-variant">
                    Bekleyen bildirim yok
                  </p>
                ) : (
                  <ul className="py-1">
                    {notifications.map((n) => (
                      <li key={n.id}>
                        <Link
                          href="/leave-requests"
                          className="block cursor-pointer rounded-lg px-3 py-2 transition-colors hover:bg-black/5"
                        >
                          <p className="text-sm leading-tight text-on-surface">
                            {n.title}
                          </p>
                          <p className="mt-0.5 font-mono text-xs text-on-surface-variant/70">
                            {n.time}
                          </p>
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </Popover.Popup>
            </Popover.Positioner>
          </Popover.Portal>
        </Popover.Root>

        <UserMenu />
      </div>
    </header>
  );
}

function MiniCalendar() {
  const today = new Date();
  const [date, setDate] = useState(new Date());

  const year = date.getFullYear();
  const month = date.getMonth();

  const monthNames = [
    "Ocak", "Şubat", "Mart", "Nisan", "Mayıs", "Haziran",
    "Temmuz", "Ağustos", "Eylül", "Ekim", "Kasım", "Aralık"
  ];

  const dayNames = ["Pt", "Sa", "Ça", "Pe", "Cu", "Ct", "Pz"];

  // Days of the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  
  // Day of the week for the first day of the month (0 = Sunday, 1 = Monday...)
  // We want Pt to be first, so: Pt=0, Sa=1, ..., Pz=6
  const rawFirstDay = new Date(year, month, 1).getDay();
  const firstDayIndex = rawFirstDay === 0 ? 6 : rawFirstDay - 1;

  const days = [];
  // Add empty slots for offset
  for (let i = 0; i < firstDayIndex; i++) {
    days.push(null);
  }
  // Add day numbers
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const prevMonth = () => {
    setDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setDate(new Date(year, month + 1, 1));
  };

  const isToday = (day: number | null) => {
    if (!day) return false;
    return (
      day === today.getDate() &&
      month === today.getMonth() &&
      year === today.getFullYear()
    );
  };

  return (
    <div className="font-sans text-on-surface">
      {/* Month Header */}
      <div className="flex items-center justify-between mb-3 pb-2 border-b border-outline-variant/20">
        <button
          onClick={prevMonth}
          className="p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
        >
          <ChevronLeft className="size-4" />
        </button>
        <span className="font-serif text-sm font-bold text-primary">
          {monthNames[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="p-1 rounded hover:bg-black/5 transition-colors cursor-pointer"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Week Day Labels */}
      <div className="grid grid-cols-7 gap-1 text-center mb-1 text-xs font-mono font-semibold text-on-surface-variant/70">
        {dayNames.map((name) => (
          <div key={name} className="py-1">
            {name}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1 text-center text-xs">
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="py-1.5" />;
          }

          const isTodayDate = isToday(day);

          return (
            <div
              key={`day-${day}`}
              className="relative flex items-center justify-center py-1.5"
            >
              {isTodayDate ? (
                <span className="flex size-7 items-center justify-center rounded-full bg-destructive text-white font-bold animate-pulse shadow-sm">
                  {day}
                </span>
              ) : (
                <span className="flex size-7 items-center justify-center rounded-full hover:bg-black/5 text-on-surface-variant font-medium">
                  {day}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
