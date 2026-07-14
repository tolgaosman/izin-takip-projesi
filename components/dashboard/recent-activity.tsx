import {
  CheckCheck,
  MoreHorizontal,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";

import { Avatar } from "@/components/dashboard/avatar";
import { cn } from "@/lib/utils";

type Activity = {
  id: number;
  /** Rich description; kept as JSX so we can emphasise names/leave types */
  content: ReactNode;
  time: string;
} & (
  | { variant: "avatar"; actor: string }
  | { variant: "icon"; icon: LucideIcon; tone: "success" | "error" }
);

const activities: Activity[] = [
  {
    id: 1,
    variant: "avatar",
    actor: "Ayşe Yılmaz",
    time: "2 hours ago",
    content: (
      <>
        <span className="font-bold">Ayşe Yılmaz</span> requested{" "}
        <span className="text-accent-cyan">Annual Leave</span>
      </>
    ),
  },
  {
    id: 2,
    variant: "icon",
    icon: CheckCheck,
    tone: "success",
    time: "4 hours ago",
    content: (
      <>
        System approved <span className="font-bold">3 requests</span>
      </>
    ),
  },
  {
    id: 3,
    variant: "avatar",
    actor: "Mehmet Demir",
    time: "Yesterday",
    content: (
      <>
        <span className="font-bold">Mehmet Demir</span> returned from leave
      </>
    ),
  },
  {
    id: 4,
    variant: "icon",
    icon: TriangleAlert,
    tone: "error",
    time: "Yesterday",
    content: (
      <>
        Missing documentation for <span className="font-bold">Ali Can</span>
      </>
    ),
  },
];

export function RecentActivity() {
  return (
    <div className="glass-panel flex h-[400px] flex-col rounded-xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-on-surface">Recent Activity</h3>
        <button
          type="button"
          aria-label="More options"
          className="text-on-surface-variant transition-colors hover:text-accent-cyan"
        >
          <MoreHorizontal className="size-5" />
        </button>
      </div>

      <ul className="custom-scrollbar flex-1 space-y-4 overflow-y-auto pr-2">
        {activities.map((activity) => (
          <li
            key={activity.id}
            className="flex gap-4 rounded-lg border border-transparent p-3 transition-colors hover:border-white/10 hover:bg-white/5"
          >
            {activity.variant === "avatar" ? (
              <Avatar
                name={activity.actor}
                className="size-10 shrink-0 border border-white/5"
              />
            ) : (
              <div
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-full border",
                  activity.tone === "success"
                    ? "border-accent-violet/20 bg-accent-violet/10 text-accent-violet"
                    : "border-destructive/20 bg-destructive/10 text-destructive"
                )}
              >
                <activity.icon className="size-4" />
              </div>
            )}
            <div>
              <p className="text-base leading-tight text-on-surface">
                {activity.content}
              </p>
              <p className="mt-1 font-label-mono text-xs text-on-surface-variant/70">
                {activity.time}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
