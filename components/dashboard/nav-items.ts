import {
  CalendarDays,
  LayoutDashboard,
  Users,
  Calendar,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  label: string;
  icon: LucideIcon;
  href: string;
  /** Yalnız admin görebilir; çalışan rolünde menüde ve rotada gizlenir. */
  adminOnly?: boolean;
};

export const navItems: NavItem[] = [
  { label: "Genel Bakış", icon: LayoutDashboard, href: "/" },
  { label: "Personel Listesi", icon: Users, href: "/personnel", adminOnly: true },
  { label: "İzin Talepleri", icon: CalendarDays, href: "/leave-requests", adminOnly: true },
  { label: "İzin Takvimi", icon: Calendar, href: "/calendar", adminOnly: true },
];
