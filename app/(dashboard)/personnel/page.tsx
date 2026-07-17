"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Pencil, Eye, Search, ShieldAlert } from "lucide-react";
import { usePersonnel } from "@/lib/data/store";
import { useIsAdmin } from "@/components/auth/role-store";
import { Personnel, personnelStatusLabels } from "@/lib/data/types";
import { Avatar } from "@/components/dashboard/avatar";
import { deletePersonnel } from "@/lib/data/store";
import { ConfirmDialog } from "@/components/dashboard/confirm-dialog";
import { PersonnelDialog } from "@/components/dashboard/personnel-dialog";
import { ExportButton } from "@/components/dashboard/export-button";
import Link from "next/link";


export default function PersonnelPage() {
  const personnel = usePersonnel();
  const isAdmin = useIsAdmin();
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [toDelete, setToDelete] = useState<Personnel | null>(null);
  const [editing, setEditing] = useState<Personnel | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Çalışan rolü personel listesini göremez → Genel Bakış'a yönlendir.
  useEffect(() => {
    if (!isAdmin) router.replace("/");
  }, [isAdmin, router]);

  const filteredPersonnel = useMemo(() => {
    return personnel.filter((p) => {
      const query = searchQuery.toLowerCase().trim();
      if (!query) return true;
      return (
        p.name.toLowerCase().includes(query) ||
        p.department.toLowerCase().includes(query) ||
        p.phone.includes(query)
      );
    });
  }, [personnel, searchQuery]);



  return (
    <>
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
          <div className="flex items-center gap-3">
            <ExportButton
              filename="personel-listesi"
              rows={filteredPersonnel}
              columns={[
                { header: "Ad Soyad", value: (p) => p.name },
                { header: "Departman", value: (p) => p.department },
                { header: "Telefon", value: (p) => p.phone },
                { header: "Durum", value: (p) => personnelStatusLabels[p.status] },
                { header: "E-posta", value: (p) => p.email ?? "" },
                { header: "Başlangıç", value: (p) => p.startDate ?? "" },
              ]}
            />
            {isAdmin && (
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
            )}
          </div>
        </div>

        {personnel.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center text-center p-12 glass-panel rounded-xl my-6">
            <p className="font-sans text-lg text-on-surface-variant max-w-md">
              Sistemde henüz personel kaydı bulunamadı. Listeyi oluşturmak için sağ üstteki &quot;Yeni Personel&quot; butonuna tıklayınız.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Arama Çubuğu*/}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-on-surface-variant/50" />
                <input
                  type="text"
                  placeholder="Personel adı, departman veya telefon ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-lg border border-outline-variant/30 bg-surface-1 py-2 pl-9 pr-4 font-sans text-sm text-on-surface outline-none placeholder:text-on-surface-variant/50 focus:border-accent-cyan"
                />
              </div>
            </div>

            {filteredPersonnel.length === 0 ? (
              <div className="flex min-h-[200px] flex-col items-center justify-center text-center p-8 glass-panel rounded-xl">
                <p className="font-sans text-base text-on-surface-variant">
                  Arama kriterlerinize uygun personel bulunamadı.
                </p>
              </div>
            ) : (
              <div className="glass-panel overflow-hidden rounded-xl">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px] text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant/20 font-mono text-xs uppercase tracking-wider text-on-surface-variant/70">
                        <th className="px-6 py-4 font-bold">Personel</th>
                        <th className="px-6 py-4 font-bold">Departman</th>
                        <th className="px-6 py-4 font-bold">Durum</th>
                        <th className="px-6 py-4 font-bold">Telefon</th>
                        <th className="px-6 py-4 font-bold">Başlangıç Tarihi</th>
                        <th className="px-6 py-4 text-right font-bold">İşlemler</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPersonnel.map((p) => (
                        <tr
                          key={p.id}
                          className="border-b border-outline-variant/10 transition-colors hover:bg-white/40 last:border-0"
                        >
                          {/* 1. Sütun: Profil Resmi ve İsim */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar name={p.name} url={p.avatarUrl} className="size-9 shrink-0" />
                              <span className="font-bold text-primary">{p.name}</span>
                            </div>
                          </td>

                          {/* 2. Sütun: Departman */}
                          <td className="px-6 py-4 text-on-surface-variant font-sans">
                            {p.department}
                          </td>

                          {/* 3. Sütun: Durum (Badge) */}
                          <td className="px-6 py-4">
                            <span className="inline-block rounded-full border border-outline-variant/30 px-3 py-1 font-mono text-xs font-semibold bg-white/50 text-secondary">
                              {personnelStatusLabels[p.status]}
                            </span>
                          </td>

                          {/* 4. Sütun: Telefon */}
                          <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">
                            {p.phone}
                          </td>

                          {/* 4.5. Sütun: Başlangıç Tarihi */}
                          <td className="px-6 py-4 text-on-surface-variant font-mono text-xs">
                            {p.startDate ? new Date(p.startDate).toLocaleDateString("tr-TR") : "-"}
                          </td>

                          {/* 5. Sütun: Aksiyon Butonları */}
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-2">
                              <Link
                                href={`/personnel/detail?id=${p.id}`}
                                className="flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-white hover:text-primary"
                                title="Detay"
                              >
                                <Eye className="size-4" />
                              </Link>

                              {isAdmin && (
                                <>
                                  <button
                                    onClick={() => {
                                      setEditing(p);
                                      setDialogOpen(true);
                                    }}
                                    className="flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 text-on-surface-variant transition-colors hover:bg-white hover:text-primary cursor-pointer"
                                    title="Düzenle"
                                  >
                                    <Pencil className="size-4" />
                                  </button>
                                  <button
                                    onClick={() => setToDelete(p)}
                                    className="flex size-8 items-center justify-center rounded-lg border border-outline-variant/30 text-destructive transition-colors hover:bg-destructive/10 cursor-pointer"
                                    title="Sil"
                                  >
                                    <Trash2 className="size-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Personel Ekleme / Düzenleme Formu */}
      <PersonnelDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        personnel={editing}
      />

      {/* Silme Onaylama Penceresi */}
      <ConfirmDialog
        open={toDelete !== null}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Personeli Sil"
        description="Bu personeli silmek istediğinize emin misiniz? Bu işlem geri alınamaz ve bu personele ait tüm izin talepleri de silinecektir."
        onConfirm={() => {
          if (toDelete) {
            deletePersonnel(toDelete.id);
            setToDelete(null);
          }
        }}
      />
    </>
  );
}
