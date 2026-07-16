"use client";

import { Plus } from "lucide-react";
import { useState } from "react";

import { LeaveDialog } from "@/components/dashboard/leave-dialog";
import { Button } from "@/components/ui/button";

/* Sidebar "New Request" entry point — opens the shared LeaveDialog,
   which persists the request to the store. */

export function NewRequestDialog() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        className="h-auto w-full gap-2 bg-accent-cyan px-4 py-3 text-base font-bold text-white shadow-[0_0_20px_rgba(123,30,43,0.25)] hover:bg-accent-cyan/90"
      >
        <Plus className="size-5" />
        Yeni Talep
      </Button>

      <LeaveDialog open={open} onOpenChange={setOpen} />
    </>
  );
}
