"use client";

import toast, { Toaster } from "react-hot-toast";

/* Uygulama geneli toast (bildirim) altyapısı — react-hot-toast üzerine.
   Kullanım:
     1) layout'ta <AppToastProvider> ile sarmala (Toaster'ı mount eder).
     2) herhangi bir client bileşeninde: const toast = useToast();
        toast.success("Başlık", "açıklama");                            */

/** Başlık (+ opsiyonel açıklama) için ortak içerik. Açıklama varsa başlık
    kalın, açıklama küçük ve soluk gösterilir. */
function content(title: string, description?: string) {
  if (!description) {
    return <span className="font-sans text-sm font-bold">{title}</span>;
  }
  return (
    <span className="flex flex-col">
      <span className="font-sans text-sm font-bold">{title}</span>
      <span className="mt-0.5 font-sans text-xs opacity-80">{description}</span>
    </span>
  );
}

/** Pratik API — tür (success/error/info) + başlık + açıklama. Motor
    react-hot-toast; hook olması şart değil ama mevcut kullanımla uyum için
    korunuyor. */
export function useToast() {
  return {
    success: (title: string, description?: string) =>
      toast.success(content(title, description)),
    error: (title: string, description?: string) =>
      toast.error(content(title, description)),
    info: (title: string, description?: string) =>
      toast(content(title, description)),
  };
}

/** Uygulamayı saran sağlayıcı. Toaster'ı ekranın üstüne (top-center) sabitler.
    Tema (açık/koyu) CSS değişkenleriyle uyumlu; portal document köküne bastığı
    için `.dark` altındaki değişkenler otomatik uygulanır. */
export function AppToastProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--surface-1)",
            color: "var(--on-surface)",
            border: "1px solid var(--outline-variant, rgba(120,120,120,0.25))",
            borderRadius: "0.75rem",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            maxWidth: "24rem",
          },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "var(--destructive)", secondary: "#fff" } },
        }}
      />
    </>
  );
}
