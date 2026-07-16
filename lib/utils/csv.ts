/* CSV dışa aktarma yardımcıları.
   Tamamen tarayıcı tarafında çalışır (statik export'a uygun, sunucu yok). */

/** Bir CSV kolonu: başlık + her satırdan hücre değerini üreten fonksiyon. */
export type CsvColumn<T> = {
  header: string;
  /** Satırdan bu kolonun hücre değerini çıkarır (string'e çevrilecek). */
  value: (row: T) => string | number | null | undefined;
};

/**
 * Tek bir hücreyi CSV kurallarına göre kaçışlar (RFC 4180):
 * içinde virgül, çift tırnak veya satır sonu varsa hücreyi çift tırnağa alır
 * ve içteki tırnakları ikile ("" ). Böylece "Yazılım, Destek" gibi değerler
 * kolonları kaydırmaz.
 */
function escapeCell(value: string | number | null | undefined): string {
  const s = value == null ? "" : String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

/**
 * Satır dizisini CSV metnine çevirir.
 * Başında BOM (﻿) vardır: Excel'in dosyayı UTF-8 olarak açmasını sağlar,
 * yoksa Türkçe karakterler (ç, ş, ğ, ı) bozuk görünür.
 */
export function toCsv<T>(rows: T[], columns: CsvColumn<T>[]): string {
  const header = columns.map((c) => escapeCell(c.header)).join(",");
  const body = rows
    .map((row) => columns.map((c) => escapeCell(c.value(row))).join(","))
    .join("\r\n");
  return `﻿${header}\r\n${body}`;
}

/**
 * Verilen CSV metnini bir dosya olarak indirir.
 * Blob + geçici object URL + görünmez <a> tıklaması: kullanıcı etkileşimi
 * (buton) içinde çağrıldığında tarayıcı indirmeyi başlatır.
 */
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
  URL.revokeObjectURL(url); // bellek sızıntısını önle
}
