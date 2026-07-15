"use client";

import { Hourglass } from "lucide-react";

export default function LeaveRequestsPage() {
  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center text-center p-12 glass-panel rounded-xl my-12">
      <Hourglass className="size-16 text-secondary animate-pulse mb-6 opacity-75" />
      <h2 className="font-serif text-4xl font-bold text-primary mb-3">
        Coming Soon
      </h2>
      <p className="font-sans text-lg text-on-surface-variant max-w-md">
        İzin talepleri modülü şu anda yapım aşamasındadır. Çok yakında hizmetinizde olacaktır.
      </p>
    </div>
  );
}
