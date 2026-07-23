"use client";

import { Dialog } from "@base-ui/react/dialog";
import { X } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import {
  addLeaveRequest,
  getLeaveBalance,
  updateLeaveRequest,
  usePersonnel,
} from "@/lib/data/store";
import {
  attachmentConfig,
  leaveStatusLabels,
  leaveTypeLabels,
  type LeaveRequest,
  type LeaveStatus,
  type LeaveType,
} from "@/lib/data/types";
import { workingDayCount } from "@/lib/date/business-days";
import { readFile } from "@/lib/image";
import { cn } from "@/lib/utils";

const fieldClasses =
  "w-full rounded-lg border border-white/10 bg-surface-2/60 px-3 py-2 text-base text-on-surface outline-none transition-colors focus:border-accent-cyan/50 placeholder-on-surface-variant/40";

const labelClasses =
  "font-label-mono text-xs uppercase tracking-wider text-on-surface-variant";

const typeOptions = Object.entries(leaveTypeLabels) as [LeaveType, string][];
const statusOptions = Object.entries(leaveStatusLabels) as [
  LeaveStatus,
  string
][];

/* Inner form remounts (via key) each time the dialog opens, so useState
   initializers seed the fields — no reset effect required. */
function LeaveForm({
  leave,
  defaultPersonnelId,
  lockPersonnel,
  onClose,
}: {
  leave: LeaveRequest | null;
  defaultPersonnelId?: string;
  lockPersonnel?: boolean;
  onClose: () => void;
}) {
  const personnel = usePersonnel();
  const toast = useToast();
  const isEdit = Boolean(leave);

  const [personnelId, setPersonnelId] = useState(
    () =>
      leave?.personnelId ??
      defaultPersonnelId ??
      personnel[0]?.id ??
      ""
  );
  const [type, setType] = useState<LeaveType>(leave?.type ?? "annual");
  const [status, setStatus] = useState<LeaveStatus>(leave?.status ?? "pending");
  const [start, setStart] = useState(leave?.startDate ?? "");
  const [end, setEnd] = useState(leave?.endDate ?? "");
  const [note, setNote] = useState(leave?.note ?? "");
  const [attachmentName, setAttachmentName] = useState(leave?.attachmentName ?? "");
  const [attachmentUrl, setAttachmentUrl] = useState(leave?.attachmentUrl ?? "");

  // Seçili aralığın İŞ GÜNÜ maliyeti + yıllık izinde kişinin kalan bakiyesi.
  // (Canlı bilgi + submit kontrolü için; getLeaveBalance daima tam veriyle çalışır.)
  const requestedDays = start && end ? workingDayCount(start, end) : 0;
  const balance =
    type === "annual" && personnelId ? getLeaveBalance(personnelId) : undefined;

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setAttachmentName(file.name);
      setAttachmentUrl(await readFile(file));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!personnelId) return;

    // Bakiye kontrolü: yeni bir YILLIK talep bakiyeyi aşamaz.
    if (!leave && type === "annual") {
      const days = workingDayCount(start, end);
      const bal = getLeaveBalance(personnelId);
      if (bal && days > bal.remaining) {
        toast.error(
          "Yetersiz izin bakiyesi",
          `Kalan ${bal.remaining} iş günü, bu talep ${days} iş günü. Talep kaydedilmedi.`
        );
        return; // form gönderimi engellenir
      }
    }

    const data = {
      personnelId,
      type,
      startDate: start,
      endDate: end,
      note: note.trim() || undefined,
      attachmentName: attachmentName || undefined,
      attachmentUrl: attachmentUrl || undefined,
    };
    if (leave) {
      updateLeaveRequest(leave.id, { ...data, status });
    } else {
      addLeaveRequest({ ...data, status });
    }
    toast.success(
      isEdit ? "İzin talebi güncellendi" : "İzin talebi oluşturuldu"
    );
    onClose();
  }

  return (
    <>
      <div className="mb-6 flex items-start justify-between">
        <div>
          <Dialog.Title className="text-2xl font-bold text-on-surface">
            {isEdit ? "İzin Talebini Düzenle" : "Yeni İzin Talebi"}
          </Dialog.Title>
          <Dialog.Description className="mt-1 text-base text-on-surface-variant">
            İzin talebi için formu doldurun.
          </Dialog.Description>
        </div>
        <Dialog.Close
          aria-label="Kapat"
          className="flex size-8 items-center justify-center rounded-full text-on-surface-variant transition-colors hover:bg-white/10 hover:text-on-surface"
        >
          <X className="size-5" />
        </Dialog.Close>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {!lockPersonnel && (
          <div className="space-y-1.5">
            <label htmlFor="l-personnel" className={labelClasses}>
              Personel
            </label>
            <select
              id="l-personnel"
              required
              value={personnelId}
              onChange={(e) => setPersonnelId(e.target.value)}
              className={fieldClasses}
            >
              {personnel.length === 0 && <option value="">Personel yok</option>}
              {personnel.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} — {p.department}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="l-type" className={labelClasses}>
            İzin Türü
          </label>
          <select
            id="l-type"
            value={type}
            onChange={(e) => setType(e.target.value as LeaveType)}
            className={fieldClasses}
          >
            {typeOptions.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <label htmlFor="l-start" className={labelClasses}>
              Başlangıç
            </label>
            <input
              id="l-start"
              type="date"
              required
              value={start}
              onChange={(e) => setStart(e.target.value)}
              className={fieldClasses}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="l-end" className={labelClasses}>
              Bitiş
            </label>
            <input
              id="l-end"
              type="date"
              required
              min={start || undefined}
              value={end}
              onChange={(e) => setEnd(e.target.value)}
              className={fieldClasses}
            />
          </div>
        </div>

        {/* Canlı bakiye bilgisi — yalnız yıllık izinde ve tarihler seçiliyken */}
        {type === "annual" && requestedDays > 0 && (
          <div
            className={cn(
              "rounded-lg border px-3 py-2 font-label-mono text-xs",
              balance && requestedDays > balance.remaining
                ? "border-destructive/40 bg-destructive/5 text-destructive"
                : "border-white/10 bg-surface-2/40 text-on-surface-variant"
            )}
          >
            Bu talep: <span className="font-bold">{requestedDays} iş günü</span>
            {balance && (
              <>
                {" · "}Kalan bakiye:{" "}
                <span className="font-bold">{balance.remaining} gün</span>
              </>
            )}
          </div>
        )}

        {isEdit && (
          <div className="space-y-1.5">
            <label htmlFor="l-status" className={labelClasses}>
              Durum
            </label>
            <select
              id="l-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as LeaveStatus)}
              className={fieldClasses}
            >
              {statusOptions.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
        {attachmentConfig[type] && (
          <div className="space-y-1.5">
            <label htmlFor="l-file" className={labelClasses}>
              {attachmentConfig[type]!.label}{" "}
              <span className="text-destructive">*</span>
            </label>
            <input
              id="l-file"
              type="file"
              required={!attachmentName}
              accept=".pdf,image/*"
              onChange={handleFileChange}
              className={cn(
                fieldClasses,
                "file:mr-4 file:cursor-pointer file:rounded-md file:border-0 file:bg-accent-cyan/10 file:px-4 file:py-1 file:text-sm file:font-bold file:text-accent-cyan hover:file:bg-accent-cyan/20 p-1"
              )}
            />
            {attachmentName && (
              <p className="text-xs text-on-surface-variant">
                Yüklü Dosya: {attachmentName}
              </p>
            )}
          </div>
        )}

        <div className="space-y-1.5">
          <label htmlFor="l-note" className={labelClasses}>
            Not (opsiyonel)
          </label>
          <textarea
            id="l-note"
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="İzin sebebini kısaca açıklayın..."
            className={cn(fieldClasses, "resize-none")}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Dialog.Close render={<Button variant="outline" />}>İptal</Dialog.Close>
          <Button
            type="submit"
            disabled={personnel.length === 0}
            className="bg-accent-cyan text-white hover:bg-accent-cyan/90"
          >
            {isEdit ? "Kaydet" : "Talebi Gönder"}
          </Button>
        </div>
      </form>
    </>
  );
}

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** When set, edits this request; otherwise creates a new one. */
  leave?: LeaveRequest | null;
  /** Pre-select a person (used when adding from a personnel context). */
  defaultPersonnelId?: string;
  /** Personel seçiciyi gizle ve defaultPersonnelId'ye sabitle (çalışan kendine talep). */
  lockPersonnel?: boolean;
};

export function LeaveDialog({
  open,
  onOpenChange,
  leave,
  defaultPersonnelId,
  lockPersonnel,
}: Props) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity data-[ending-style]:opacity-0 data-[starting-style]:opacity-0" />
        <Dialog.Popup className="glass-panel custom-scrollbar fixed left-1/2 top-1/2 z-50 max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-xl p-6 shadow-2xl transition-all data-[ending-style]:scale-95 data-[ending-style]:opacity-0 data-[starting-style]:scale-95 data-[starting-style]:opacity-0">
          <LeaveForm
            key={leave?.id ?? "new"}
            leave={leave ?? null}
            defaultPersonnelId={defaultPersonnelId}
            lockPersonnel={lockPersonnel}
            onClose={() => onOpenChange(false)}
          />
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
