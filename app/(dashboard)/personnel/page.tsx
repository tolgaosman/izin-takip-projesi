"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import { usePersonnel } from "@/lib/data/store";
import { Personnel } from "@/lib/data/types";

export default function PersonnelPage() {
  const personnel = usePersonnel();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Personnel | null>(null);


  return (
    <div className="space-y-8">
      {/* Sayfa Başlığı ve Ekleme Butonu */}
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-outline-variant/20 pb-6">
        <div>
          <h2 className="font-serif text-5xl font-bold text-primary">
            Personel Listesi
          </h2>
          <p className="font-sans text-base text-on-surface-variant mt-2">
            Tüm şirket personelinin detayları, departmanları ve güncel çalışma durumları.
          </p>
        </div>
        <button
          onClick={() => {
            setEditing(null);
            setDialogOpen(true);
          }}
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-base font-bold text-white shadow transition-all hover:opacity-90 active:scale-95 cursor-pointer"
        >
          <Plus className="size-5" />
          <span>Yeni Personel</span>
        </button>
      </div>

      {/* TODO 5: Personel verilerini listelemek için el çizimi kağıt stili bir tablo oluştur. */}
      <div className="flex min-h-[200px] items-center justify-center border border-dashed border-outline-variant/30 rounded-xl bg-white/40">
        <p className="font-mono text-sm text-on-surface-variant/70">
          [ Tablo boş, sağ üstteki buton yardımıyla yeni personel ekleyiniz. ]
        </p>
      </div>
    </div>
  );
}
