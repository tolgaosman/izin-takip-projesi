"use client";

import { Menu } from "@base-ui/react/menu";
import { LogIn, LogOut, SlidersHorizontal, User, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/auth-provider";
import { Avatar } from "@/components/dashboard/avatar";

import Link from "next/link";
import { Button } from "@/components/ui/button";

const popupClasses =
  "glass-panel z-50 rounded-xl p-2 shadow-2xl outline-none transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0";

const itemClasses =
  "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-base text-on-surface outline-none transition-colors data-[highlighted]:bg-white/5 data-[highlighted]:text-accent-cyan";

export function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          className="rounded-full border-white/20 text-on-surface hover:bg-white/10"
          render={<Link href="/login" />}
        >
          Giriş Yap
        </Button>
        <Button
          variant="default"
          size="sm"
          className="rounded-full bg-accent-cyan font-bold text-[#003739] hover:bg-accent-cyan/90"
          render={<Link href="/signup" />}
        >
          Hesap Oluştur
        </Button>
      </div>
    );
  }

  return (
    <Menu.Root>
      <Menu.Trigger
        aria-label="User menu"
        className="rounded-full outline-none transition-transform active:scale-95 data-[popup-open]:ring-2 data-[popup-open]:ring-accent-cyan/50"
      >
        <Avatar name={user.name} className="size-10 border border-accent-cyan/30" />
      </Menu.Trigger>

      <Menu.Portal>
        <Menu.Positioner sideOffset={12} align="end">
          <Menu.Popup className={`${popupClasses} w-60`}>
            {user ? (
              <>
                <div className="border-b border-white/10 px-3 py-2">
                  <p className="truncate text-base font-bold text-on-surface">
                    {user.name}
                  </p>
                  <p className="truncate font-label-mono text-xs text-on-surface-variant/70">
                    {user.email}
                  </p>
                </div>
                <div className="py-1">
                  <Menu.Item className={itemClasses}>
                    <User className="size-4" />
                    Profil
                  </Menu.Item>
                  <Menu.Item className={itemClasses}>
                    <SlidersHorizontal className="size-4" />
                    Ayarlar
                  </Menu.Item>
                </div>
                <Menu.Separator className="my-1 h-px bg-white/10" />
                <Menu.Item
                  onClick={logout}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-base text-destructive outline-none transition-colors data-[highlighted]:bg-destructive/10"
                >
                  <LogOut className="size-4" />
                  Çıkış Yap
                </Menu.Item>
              </>
            ) : (
              <div className="py-1">
                <Menu.Item
                  onClick={() => router.push("/login")}
                  className={itemClasses}
                >
                  <LogIn className="size-4" />
                  Giriş Yap
                </Menu.Item>
                <Menu.Item
                  onClick={() => router.push("/signup")}
                  className={itemClasses}
                >
                  <UserPlus className="size-4" />
                  Hesap Oluştur
                </Menu.Item>
              </div>
            )}
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
  );
}
