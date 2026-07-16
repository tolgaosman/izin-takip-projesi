import {
  CalendarDays,
  LayoutDashboard,
  Plane,
  Users,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  /** Yalnız admin (İK) görsün — çalışan modunda gizlenir. */
  adminOnly?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Genel Bakış", icon: LayoutDashboard, href: "/" },
  { label: "Personel Listesi", icon: Users, href: "/personnel", adminOnly: true },
  { label: "İzin Talepleri", icon: CalendarDays, href: "/leave-requests" },
  { label: "Aktif İzinler", icon: Plane, href: "/active-leaves" },
];
