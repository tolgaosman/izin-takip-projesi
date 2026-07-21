"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useState } from "react";

function FileViewer({
  url,
  name,
  label,
}: {
  url: string;
  name?: string;
  label: string;
}) {
  const lower = (name ?? url).toLowerCase();
  const isPdf = lower.endsWith(".pdf");

  if (isPdf) {
    return (
      <iframe
        src={url}
        className="h-full w-full rounded-lg border-none bg-white"
        title={`${label} Görüntüleyici`}
      />
    );
  }

  // Images (jpg, png, gif, webp, etc.)
  return (
    <img
      src={url}
      alt={label}
      className="mx-auto max-h-full max-w-full rounded-lg object-contain"
    />
  );
}

export function AttachmentDialog({
  url,
  name,
  label = "Doktor Raporu",
  children,
}: {
  url: string;
  name?: string;
  label?: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <span onClick={() => setOpen(true)} className="cursor-pointer">
        {children}
      </span>
      <Dialog.Root open={open} onOpenChange={setOpen}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm" />
          <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 flex h-[90vh] w-[90vw] max-w-5xl -translate-x-1/2 -translate-y-1/2 flex-col rounded-xl border border-white/10 bg-surface-1 shadow-2xl outline-none">
            <div className="flex items-center justify-between border-b border-outline-variant/20 p-4">
              <Dialog.Title className="truncate text-xl font-bold text-on-surface">
                {label}
              </Dialog.Title>
              <Dialog.Close
                aria-label="Kapat"
                className="flex size-8 shrink-0 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
              >
                <X className="size-5" />
              </Dialog.Close>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <FileViewer url={url} name={name} label={label} />
            </div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}
