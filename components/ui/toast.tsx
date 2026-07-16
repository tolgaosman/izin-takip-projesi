"use client";

import { Toast } from "@base-ui/react/toast";

import { cn } from "@/lib/utils";

/* Uygulama geneli toast (bildirim) altyapısı — @base-ui/react/toast üzerine.
   Kullanım:
     1) layout'ta <AppToastProvider> ile sarmala.
     2) herhangi bir client bileşeninde: const toast = useToast();
        toast.error("Başlık", "açıklama");                              */

/** Toast yöneticisini sarmalayan pratik API. `add` bir "manager" üzerinden
    çalışır; biz tür (success/error/info) + başlık + açıklamayı sabitliyoruz. */
export function useToast() {
  const manager = Toast.useToastManager();

  return {
    success: (title: string, description?: string) =>
      manager.add({ title, description, type: "success" }),
    error: (title: string, description?: string) =>
      manager.add({ title, description, type: "error", priority: "high" }),
    info: (title: string, description?: string) =>
      manager.add({ title, description, type: "info" }),
  };
}

/* Türüne göre sol kenar vurgusu — tema token'larıyla. */
const accentByType: Record<string, string> = {
  success: "border-l-green-500",
  error: "border-l-destructive",
  info: "border-l-accent-cyan",
};

/** Viewport içindeki aktif toast'ları render eden liste. `useToastManager`
    yalnızca Provider içinde çalışır, o yüzden bu bileşen Provider'ın altında. */
function ToastList() {
  const { toasts } = Toast.useToastManager();

  return (
    <>
      {toasts.map((toast) => (
        <Toast.Root
          key={toast.id}
          toast={toast}
          className={cn(
            "glass-panel pointer-events-auto relative w-full rounded-xl border-l-4 p-4 pr-8 shadow-2xl",
            "transition-all data-[ending-style]:opacity-0 data-[starting-style]:opacity-0",
            accentByType[toast.type ?? "info"] ?? accentByType.info
          )}
        >
          <Toast.Title className="font-sans text-sm font-bold text-on-surface" />
          <Toast.Description className="mt-1 font-sans text-xs text-on-surface-variant" />
          <Toast.Close
            aria-label="Kapat"
            className="absolute right-2 top-2 flex size-6 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-black/10 hover:text-on-surface"
          >
            ✕
          </Toast.Close>
        </Toast.Root>
      ))}
    </>
  );
}

/** Uygulamayı saran sağlayıcı. Viewport ekranın sağ-altına sabitlenir ve
    toast'lar dikey olarak istiflenir (flex kolon + gap). */
export function AppToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <Toast.Provider timeout={5000} limit={3}>
      {children}
      <Toast.Viewport className="fixed bottom-4 right-4 z-[100] flex w-80 max-w-[calc(100vw-2rem)] flex-col gap-3">
        <ToastList />
      </Toast.Viewport>
    </Toast.Provider>
  );
}
