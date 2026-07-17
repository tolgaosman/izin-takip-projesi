"use client";

import { useMemo } from "react";
import { Popover } from "@base-ui/react/popover";
import { Bell } from "lucide-react";
import Link from "next/link";

import { useAuth } from "@/components/auth/auth-provider";
import { useIsAdmin } from "@/components/auth/role-store";
import { useCurrentEmployee } from "@/components/auth/use-current-employee";
import { UserMenu } from "@/components/dashboard/user-menu";
import { RoleSwitcher } from "@/components/dashboard/role-switcher";
import { ThemeToggle } from "@/components/dashboard/theme-toggle";
import {
  useLeaveRequests,
  usePersonnel,
} from "@/lib/data/store";
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
  const isAdmin = useIsAdmin();
  const me = useCurrentEmployee();

  const notifications = useMemo(() => {
    // Talep başına tek olay: bekleyen → talep, onay/red → karar. Onay/red
    // karar zamanına göre sıralanır ki en son işlem en üstte "taze" görünsün.
    const byId = new Map(personnel.map((p) => [p.id, p.name]));

    // Çalışan yalnız kendi taleplerine ait bildirimleri görür (eşleşme yoksa hiç).
    const scoped = isAdmin
      ? requests
      : me
      ? requests.filter((r) => r.personnelId === me.id)
      : [];

    return scoped
      .map((r) => {
        const name = byId.get(r.personnelId) ?? "Bilinmeyen";
        const type = leaveTypeLabels[r.type];
        const eventIso =
          r.status === "pending" ? r.createdAt : r.decidedAt ?? r.createdAt;
        const title =
          r.status === "approved"
            ? `${name} için ${type} onaylandı`
            : r.status === "rejected"
            ? `${name} için ${type} reddedildi`
            : `${name} ${type} talep etti`;
        return {
          id: `${r.id}-${r.status}`,
          title,
          time: relativeTime(eventIso),
          sortTime: new Date(eventIso).getTime(),
        };
      })
      .sort((a, b) => b.sortTime - a.sortTime)
      .slice(0, 5);
  }, [requests, personnel, isAdmin, me]);

  return (
    <header
      className={`absolute ${
        isAdmin ? "left-64" : "left-0"
      } right-0 top-0 z-30 hidden h-20 items-center justify-between px-10 border-b border-outline-variant/20 bg-transparent md:flex`}
    >
      {isAdmin ? (
        <div className="font-serif text-base font-bold text-primary">
          {user ? `Merhaba, ${user.name} 👋` : "Merhaba 👋"}
        </div>
      ) : (
        <Link href="/" className="flex items-center gap-3 pl-4 transition-opacity hover:opacity-80">
          <img
            src={`${process.env.NEXT_PUBLIC_BASE_PATH ?? ""}/assets/browserLogo.png`}
            alt="İzin Takip Sistemi Logo"
            className="h-9 w-9 object-contain"
          />
          <div>
            <h1 className="font-serif text-lg font-bold leading-tight text-primary">
              İzin Takip
            </h1>
            <p className="font-mono text-[10px] tracking-wider text-on-surface-variant">
              SİSTEMİ
            </p>
          </div>
        </Link>
      )}

      <div className="flex items-center gap-4">

        <RoleSwitcher />


        <ThemeToggle />

        {/* Notifications */}
        {isAdmin && (
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
        )}

        <UserMenu />
      </div>
    </header>
  );
}

