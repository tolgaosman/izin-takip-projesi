/* Excel (xlsx) ve CSV dışa aktarma yardımcıları.
   Tamamen tarayıcı tarafında çalışır (statik export'a uygun, sunucu yok). */

import * as XLSX from "xlsx";

/** Bir kolon tanımı: başlık + her satırdan hücre değerini üreten fonksiyon. */
export type CsvColumn<T> = {
  header: string;
  value: (row: T) => string | number | null | undefined;
};

/**
 * Satır dizisini gerçek bir .xlsx Excel dosyası olarak indirir.
 * SheetJS kullanır — tarayıcıda çalışır, sunucu gerektirmez.
 */
export function downloadXlsx<T>(filename: string, rows: T[], columns: CsvColumn<T>[]): void {
  if (typeof window === "undefined") return;

  // Başlık satırı + veri satırları
  const headers = columns.map((c) => c.header);
  const data = rows.map((row) =>
    columns.map((c) => {
      const v = c.value(row);
      return v == null ? "" : v;
    })
  );

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...data]);

  // Kolon genişliklerini otomatik hesapla
  const colWidths = columns.map((c, i) => {
    const maxLen = Math.max(
      c.header.length,
      ...rows.map((row) => {
        const v = c.value(row);
        return v == null ? 0 : String(v).length;
      })
    );
    return { wch: Math.min(maxLen + 4, 60) };
  });
  worksheet["!cols"] = colWidths;

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Veri");

  const name = filename.endsWith(".xlsx") ? filename : `${filename}.xlsx`;
  XLSX.writeFile(workbook, name);
}

// --- Geriye dönük uyumluluk: eski CSV fonksiyonları (kaldırılmadı) ---

function escapeCell(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCell(c.value(row))).join(","))
    .join("\r\n");
  return `\uFEFF${header}\r\n${body}`;
}

export function downloadCsv(filename: string, content: string): void {
  if (typeof window === "undefined") return;
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
