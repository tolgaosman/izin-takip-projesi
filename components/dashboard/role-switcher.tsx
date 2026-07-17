"use client";

import { Menu } from "@base-ui/react/menu";
import { Check, ChevronDown, ShieldCheck, User } from "lucide-react";

import { setRole, useRole, type Role } from "@/components/auth/role-store";

const popupClasses =
  "glass-panel z-50 rounded-xl p-2 shadow-2xl outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0";

const itemClasses =
  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-1.5 text-base text-on-surface outline-none transition-colors data-[highlighted]:bg-black/5 data-[highlighted]:text-accent-cyan";

const options: { value: Role; label: string; icon: typeof ShieldCheck }[] = [
  { value: "admin", label: "Admin", icon: ShieldCheck },
  { value: "employee", label: "Çalışan", icon: User },
];

export function RoleSwitcher() {
  const role = useRole();
  const active = options.find((o) => o.value === role) ?? options[0];
  const ActiveIcon = active.icon;

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="Rol seç"
        className="flex items-center gap-2 rounded-full border border-outline-variant/30 bg-surface-1 px-3 py-1.5 text-sm font-medium text-on-surface-variant outline-none transition-colors hover:text-primary data-[popup-open]:border-accent-cyan/40 data-[popup-open]:text-primary cursor-pointer"
      >
        <ActiveIcon className="size-4" />
        <span>{active.label}</span>
        <ChevronDown className="size-3.5 opacity-60" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={12} align="end" className="z-50">
          <Menu.Popup className={`${popupClasses} w-48`}>
            <div className="px-3 pb-2 pt-1 font-label-mono text-xs uppercase tracking-wider text-on-surface-variant/70">
              Görünüm rolü
            </div>
            {options.map((o) => {
              const Icon = o.icon;
              return (
                <Menu.Item
                  key={o.value}
                  onClick={() => setRole(o.value)}
                  className={itemClasses}
                >
                  <Icon className="size-4" />
                  <span className="flex-1">{o.label}</span>
                  {role === o.value && <Check className="size-4 text-accent-cyan" />}
                </Menu.Item>
              );
            })}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
