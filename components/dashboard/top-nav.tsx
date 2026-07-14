import { Bell, Search, Settings } from "lucide-react";

import { Avatar } from "@/components/dashboard/avatar";

export function TopNav() {
  return (
    <header className="fixed left-[calc(16rem+24px)] right-6 top-0 z-50 mt-4 hidden items-center justify-between rounded-full border border-white/10 bg-surface-1/10 px-6 py-3 shadow-lg backdrop-blur-md md:flex">
      <label className="flex w-64 items-center rounded-full border border-white/5 bg-surface-2/50 px-4 py-2 transition-colors focus-within:border-accent-cyan/50">
        <Search className="mr-2 size-5 text-on-surface-variant" />
        <input
          type="text"
          placeholder="Search..."
          aria-label="Search"
          className="w-full border-none bg-transparent text-base text-on-surface placeholder-on-surface-variant/50 focus:outline-none focus:ring-0"
        />
      </label>

      <div className="flex items-center gap-4">
        <button
          type="button"
          aria-label="Notifications"
          className="flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/5 hover:text-accent-cyan"
        >
          <Bell className="size-5" />
        </button>
        <button
          type="button"
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/5 hover:text-accent-cyan"
        >
          <Settings className="size-5" />
        </button>
        <Avatar
          name="Admin User"
          className="size-10 border border-accent-cyan/30"
        />
      </div>
    </header>
  );
}
