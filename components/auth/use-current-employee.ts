"use client";

import { useMemo } from "react";

import { useAuth } from "@/components/auth/auth-provider";
import { usePersonnel } from "@/lib/data/store";
import type { Personnel } from "@/lib/data/types";

/** Giriş yapan kullanıcıyı (auth) bir personel kaydıyla e-posta üzerinden
    eşleştirir. Çalışan (bireysel) görünümde "ben" kimliğini belirler.
    Eşleşme yoksa undefined döner. */
export function useCurrentEmployee(): Personnel | undefined {
  const { user } = useAuth();
  const personnel = usePersonnel();

  return useMemo(() => {
    const email = user?.email?.toLowerCase().trim();
    if (!email) return undefined;
    return personnel.find((p) => p.email?.toLowerCase().trim() === email);
  }, [user?.email, personnel]);
}
