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
};

export const navItems: NavItem[] = [
  { label: "Genel Bakış", icon: LayoutDashboard, href: "/" },
  { label: "Personel Listesi", icon: Users, href: "/personnel" },
  { label: "İzin Talepleri", icon: CalendarDays, href: "/leave-requests" },
  { label: "Aktif İzinler", icon: Plane, href: "/active-leaves" },
];
