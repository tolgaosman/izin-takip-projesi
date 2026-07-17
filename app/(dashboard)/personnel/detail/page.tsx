"use client";

import { ArrowLeft, Briefcase, CalendarDays, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo } from "react";

import { useIsAdmin } from "@/components/auth/role-store";
import { Avatar } from "@/components/dashboard/avatar";
import {
  LeaveStatusBadge,
  PersonnelStatusBadge,
} from "@/components/dashboard/badges";
import { usePersonnel, useLeaveRequests, usePersonnelBalance } from "@/lib/data/store";
import { leaveTypeLabels } from "@/lib/data/types";
import { workingDayCount } from "@/lib/date/business-days";

function formatDate(iso: string) {
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? iso : d.toLocaleDateString("tr-TR");
}

function PersonnelDetail() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const personnel = usePersonnel();
  const leaves = useLeaveRequests();
  const balance = usePersonnelBalance(id);
  const isAdmin = useIsAdmin();
  const router = useRouter();

  // Çalışan rolü başka personelin detayını göremez → Genel Bakış'a yönlendir.
  useEffect(() => {
    if (!isAdmin) router.replace("/");
  }, [isAdmin, router]);

  const person = useMemo(
    () => personnel.find((p) => p.id === id),
    [personnel, id]
  );
  const personLeaves = useMemo(
    () =>
      leaves
        .filter((l) => l.personnelId === id)
        .sort((a, b) => (a.startDate < b.startDate ? 1 : -1)),
    [leaves, id]
  );

  if (!isAdmin) return null;

  if (!person) {
    return (
      <div className="glass-panel flex flex-col items-center justify-center gap-4 rounded-xl p-16 text-center">
        <p className="text-base text-on-surface-variant">
          Personel bulunamadı.
        </p>
        <Link
          href="/personnel"
          className="font-label-mono text-sm text-accent-cyan hover:underline"
        >
          ← Personel listesine dön
        </Link>
      </div>
    );
  }

  const infoRows = [
    { icon: Briefcase, label: "Departman", value: person.department },
    { icon: Phone, label: "Telefon", value: person.phone },
    { icon: Mail, label: "E-posta", value: person.email ?? "—" },
    {
      icon: CalendarDays,
      label: "Başlangıç",
      value: person.startDate ? formatDate(person.startDate) : "—",
    },
  ];

  return (
    <>
      <Link
        href="/personnel"
        className="mb-6 inline-flex items-center gap-2 font-label-mono text-sm text-on-surface-variant transition-colors hover:text-accent-cyan"
      >
        <ArrowLeft className="size-4" />
        Personel Listesi
      </Link>

      {/* Header / info card */}
      <div className="glass-panel mb-6 rounded-xl p-8">
        <div className="flex flex-wrap items-center gap-5">
          <Avatar
            name={person.name}
            url={person.avatarUrl}
            className="size-20 border border-white/10 text-lg"
          />
          <div>
            <h2 className="text-4xl font-bold tracking-tight text-on-surface">
              {person.name}
            </h2>
            <div className="mt-2">
              <PersonnelStatusBadge status={person.status} />
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {infoRows.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="rounded-lg border border-white/10 bg-surface-2/40 p-4"
            >
              <div className="mb-1 flex items-center gap-2 font-label-mono text-xs uppercase tracking-wider text-on-surface-variant">
                <Icon className="size-4" />
                {label}
              </div>
              <p className="text-base text-on-surface">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Yıllık izin bakiyesi kartları (kıdemden türetilir) */}
      {balance && (
        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              label: "Hak Edilen",
              value: balance.entitled,
              accent: "text-accent-cyan",
              hint: "Kıdeme göre yıllık",
            },
            {
              label: "Kullanılan",
              value: balance.used,
              accent: "text-primary",
              hint: `${balance.pending} gün onay bekliyor`,
            },
            {
              label: "Kalan",
              value: balance.remaining,
              accent: "text-green-600",
              hint: "Kullanılabilir bakiye",
            },
          ].map((card) => (
            <div key={card.label} className="glass-panel rounded-xl p-6">
              <p className="font-label-mono text-xs uppercase tracking-wider text-on-surface-variant">
                {card.label}
              </p>
              <p className={`mt-1 font-serif text-4xl font-bold ${card.accent}`}>
                {card.value}
                <span className="ml-1 text-base font-normal text-on-surface-variant">
                  gün
                </span>
              </p>
              <p className="mt-1 text-xs text-on-surface-variant/70">{card.hint}</p>
            </div>
          ))}
        </div>
      )}

      {/* Leave history */}
      <div className="glass-panel overflow-hidden rounded-xl">
        <div className="border-b border-white/10 px-6 py-5">
          <h3 className="text-2xl font-bold text-on-surface">
            Kullandığı İzinler
          </h3>
          <p className="font-label-mono text-xs text-on-surface-variant/70">
            {personLeaves.length} kayıt
          </p>
        </div>

        {personLeaves.length === 0 ? (
          <p className="p-10 text-center text-base text-on-surface-variant">
            Bu personelin izin kaydı yok.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-left">
              <thead>
                <tr className="border-b border-white/10 font-label-mono text-xs uppercase tracking-wider text-on-surface-variant">
                  <th className="px-6 py-4 font-medium">İzin Türü</th>
                  <th className="px-6 py-4 font-medium">Başlangıç</th>
                  <th className="px-6 py-4 font-medium">Bitiş</th>
                  <th className="px-6 py-4 font-medium">Gün</th>
                  <th className="px-6 py-4 font-medium">Durum</th>
                </tr>
              </thead>
              <tbody>
                {personLeaves.map((l) => (
                  <tr
                    key={l.id}
                    className="border-b border-white/5 last:border-0 hover:bg-white/5"
                  >
                    <td className="px-6 py-4 text-on-surface">
                      {leaveTypeLabels[l.type]}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {formatDate(l.startDate)}
                    </td>
                    <td className="px-6 py-4 text-on-surface-variant">
                      {formatDate(l.endDate)}
                    </td>
                    <td className="px-6 py-4 font-label-mono text-on-surface-variant">
                      {workingDayCount(l.startDate, l.endDate)}
                    </td>
                    <td className="px-6 py-4">
                      <LeaveStatusBadge status={l.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default function PersonnelDetailPage() {
  return (
    <Suspense fallback={null}>
      <PersonnelDetail />
    </Suspense>
  );
}
