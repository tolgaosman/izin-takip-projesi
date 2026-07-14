import { cn } from "@/lib/utils";

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

export function Avatar({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center justify-center rounded-full bg-surface-2 text-on-surface font-label-mono text-xs tracking-wider select-none",
        className
      )}
      aria-label={name}
      title={name}
    >
      {initials(name)}
    </div>
  );
}
