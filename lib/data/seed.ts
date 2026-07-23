import type { LeaveRequest, Personnel } from "@/lib/data/types";

/* Tarihleri bugüne kıyasla dinamik üretmek için yardımcı fonksiyon */
function relIso(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function relTimestamp(daysOffset: number): string {
  return new Date(Date.now() + daysOffset * 86400000).toISOString();
}

export const seedPersonnel: Personnel[] = [
  { id: "p-00", name: "Tolga Osman", department: "Yazılım", phone: "0532 000 00 00", status: "active", email: "tolgaosmanfly@gmail.com", startDate: "2022-01-15" },
  { id: "p-01", name: "Ayşe Yılmaz", department: "Yazılım", phone: "0532 111 22 33", status: "active", email: "ayse.yilmaz@sirket.com", startDate: "2021-03-01" },
  { id: "p-02", name: "Mehmet Demir", department: "Yazılım", phone: "0533 222 33 44", status: "on-leave", email: "mehmet.demir@sirket.com", startDate: "2020-06-15" },
  { id: "p-03", name: "Ali Can", department: "Destek", phone: "0534 333 44 55", status: "active", email: "ali.can@sirket.com", startDate: "2022-01-10" },
  { id: "p-04", name: "Zeynep Kaya", department: "İnsan Kaynakları", phone: "0535 444 55 66", status: "active", email: "zeynep.kaya@sirket.com", startDate: "2019-09-01" },
  { id: "p-05", name: "Emre Şahin", department: "Satış", phone: "0536 555 66 77", status: "active", email: "emre.sahin@sirket.com", startDate: "2023-02-20" },
  { id: "p-06", name: "Fatma Aydın", department: "Muhasebe", phone: "0537 666 77 88", status: "active", email: "fatma.aydin@sirket.com", startDate: "2018-11-05" },
  { id: "p-07", name: "Burak Öztürk", department: "Yazılım", phone: "0538 777 88 99", status: "inactive", email: "burak.ozturk@sirket.com", startDate: "2021-07-12" },
  { id: "p-08", name: "Elif Arslan", department: "Destek", phone: "0539 888 99 00", status: "active", email: "elif.arslan@sirket.com", startDate: "2022-10-03" },
  { id: "p-09", name: "Can Yıldız", department: "Satış", phone: "0530 999 00 11", status: "on-leave", email: "can.yildiz@sirket.com", startDate: "2020-04-18" },
  { id: "p-10", name: "Selin Doğan", department: "Pazarlama", phone: "0531 000 11 22", status: "active", email: "selin.dogan@sirket.com", startDate: "2023-05-30" },
  { id: "p-11", name: "Ahmet Kılıç", department: "Ürün Yönetimi", phone: "0532 123 45 67", status: "active", email: "ahmet.kilic@sirket.com", startDate: "2019-04-12" },
  { id: "p-12", name: "Gamze Aksoy", department: "Tasarım", phone: "0533 234 56 78", status: "active", email: "gamze.aksoy@sirket.com", startDate: "2021-11-01" },
  { id: "p-13", name: "Hakan Çelik", department: "Yazılım", phone: "0534 345 67 89", status: "active", email: "hakan.celik@sirket.com", startDate: "2020-02-14" },
  { id: "p-14", name: "Merve Yurt", department: "Pazarlama", phone: "0535 456 78 90", status: "active", email: "merve.yurt@sirket.com", startDate: "2022-06-01" },
  { id: "p-15", name: "Serkan Özcan", department: "Operasyon", phone: "0536 567 89 01", status: "on-leave", email: "serkan.ozcan@sirket.com", startDate: "2018-08-20" },
  { id: "p-16", name: "Deniz Erdem", department: "Hukuk", phone: "0537 678 90 12", status: "active", email: "deniz.erdem@sirket.com", startDate: "2017-05-10" },
  { id: "p-17", name: "Büşra Tekin", department: "İnsan Kaynakları", phone: "0538 789 01 23", status: "active", email: "busra.tekin@sirket.com", startDate: "2023-01-09" },
  { id: "p-18", name: "Onur Yalçın", department: "Yazılım", phone: "0539 890 12 34", status: "active", email: "onur.yalcin@sirket.com", startDate: "2021-09-15" },
  { id: "p-19", name: "Ezgi Güneş", department: "Tasarım", phone: "0530 901 23 45", status: "active", email: "ezgi.gunes@sirket.com", startDate: "2022-03-22" },
  { id: "p-20", name: "Kerem Polat", department: "Satış", phone: "0531 012 34 56", status: "active", email: "kerem.polat@sirket.com", startDate: "2020-10-05" },
  { id: "p-21", name: "Aslı Şen", department: "Destek", phone: "0532 123 45 88", status: "active", email: "asli.sen@sirket.com", startDate: "2023-04-17" },
  { id: "p-22", name: "Volkan Avcı", department: "Operasyon", phone: "0533 234 56 99", status: "resigned", email: "volkan.avci@sirket.com", startDate: "2019-01-15" },
  { id: "p-23", name: "Sinem Bulut", department: "Muhasebe", phone: "0534 345 67 00", status: "on-leave", email: "sinem.bulut@sirket.com", startDate: "2021-05-18" },
  { id: "p-24", name: "Barış Solmaz", department: "Ürün Yönetimi", phone: "0535 456 78 11", status: "active", email: "baris.solmaz@sirket.com", startDate: "2022-08-30" },
  { id: "p-25", name: "İrem Keskin", department: "Yazılım", phone: "0536 567 89 22", status: "active", email: "irem.keskin@sirket.com", startDate: "2023-07-01" },
  { id: "p-26", name: "Ogün Kara", department: "Yazılım", phone: "0537 678 90 33", status: "active", email: "ogun.kara@sirket.com", startDate: "2020-12-10" },
  { id: "p-27", name: "Hande Sezer", department: "Pazarlama", phone: "0538 789 01 44", status: "active", email: "hande.sezer@sirket.com", startDate: "2021-04-05" },
  { id: "p-28", name: "Tolga Vural", department: "Satış", phone: "0539 890 12 55", status: "active", email: "tolga.vural@sirket.com", startDate: "2019-11-20" },
  { id: "p-29", name: "Yasemin Taş", department: "İnsan Kaynakları", phone: "0530 901 23 66", status: "active", email: "yasemin.tas@sirket.com", startDate: "2022-02-14" },
  { id: "p-30", name: "Ozan Uçar", department: "Destek", phone: "0531 012 34 77", status: "active", email: "ozan.ucar@sirket.com", startDate: "2020-07-08" },
  { id: "p-31", name: "Melisa Eren", department: "Tasarım", phone: "0532 123 45 99", status: "on-leave", email: "melisa.eren@sirket.com", startDate: "2023-03-01" },
  { id: "p-32", name: "Cengiz Han", department: "Operasyon", phone: "0533 234 56 10", status: "active", email: "cengiz.han@sirket.com", startDate: "2018-03-15" },
  { id: "p-33", name: "Didem Soylu", department: "Hukuk", phone: "0534 345 67 21", status: "active", email: "didem.soylu@sirket.com", startDate: "2021-09-01" },
  { id: "p-34", name: "Erdem Bilgin", department: "Yazılım", phone: "0535 456 78 32", status: "active", email: "erdem.bilgin@sirket.com", startDate: "2022-11-15" },
  { id: "p-35", name: "Sibel Çakır", department: "Muhasebe", phone: "0536 567 89 43", status: "active", email: "sibel.cakir@sirket.com", startDate: "2020-01-20" },
  { id: "p-36", name: "Kaan Coşkun", department: "Satış", phone: "0537 678 90 54", status: "active", email: "kaan.coskun@sirket.com", startDate: "2023-06-12" },
  { id: "p-37", name: "Gizem Yaman", department: "Pazarlama", phone: "0538 789 01 65", status: "active", email: "gizem.yaman@sirket.com", startDate: "2019-10-10" },
  { id: "p-38", name: "Murat Korkmaz", department: "Destek", phone: "0539 890 12 76", status: "active", email: "murat.korkmaz@sirket.com", startDate: "2021-12-01" },
  { id: "p-39", name: "Tuğba Şimşek", department: "İnsan Kaynakları", phone: "0530 901 23 87", status: "active", email: "tugba.simsek@sirket.com", startDate: "2022-05-04" },
  { id: "p-40", name: "Alperen Demirci", department: "Yazılım", phone: "0531 012 34 98", status: "active", email: "alperen.demirci@sirket.com", startDate: "2020-05-25" },
  { id: "p-41", name: "Berna Duman", department: "Tasarım", phone: "0532 234 56 09", status: "active", email: "berna.duman@sirket.com", startDate: "2023-08-14" },
  { id: "p-42", name: "Tayfun Tunç", department: "Operasyon", phone: "0533 345 67 20", status: "active", email: "tayfun.tunc@sirket.com", startDate: "2019-06-30" },
  { id: "p-43", name: "Ceyda Sarı", department: "Satış", phone: "0534 456 78 31", status: "active", email: "ceyda.sari@sirket.com", startDate: "2022-04-11" },
  { id: "p-44", name: "Harun Koç", department: "Yazılım", phone: "0535 567 89 42", status: "on-leave", email: "harun.koc@sirket.com", startDate: "2021-08-01" },
  { id: "p-45", name: "Nihal Güven", department: "Muhasebe", phone: "0536 678 90 53", status: "active", email: "nihal.guven@sirket.com", startDate: "2020-09-14" },
  { id: "p-46", name: "Sedat Kurt", department: "Destek", phone: "0537 789 01 64", status: "active", email: "sedat.kurt@sirket.com", startDate: "2023-02-01" },
  { id: "p-47", name: "Ece Ünal", department: "Pazarlama", phone: "0538 890 12 75", status: "active", email: "ece.unal@sirket.com", startDate: "2021-10-18" },
  { id: "p-48", name: "Koray Aktaş", department: "Ürün Yönetimi", phone: "0539 901 23 86", status: "active", email: "koray.aktas@sirket.com", startDate: "2018-12-03" },
  { id: "p-49", name: "Damla Pekcan", department: "Hukuk", phone: "0530 012 34 97", status: "active", email: "damla.pekcan@sirket.com", startDate: "2022-09-20" },
];

export const seedLeaveRequests: LeaveRequest[] = [
  /* ── 1. Aktif İzindekiler (Şu an izinde) ── */
  { id: "l-01", personnelId: "p-02", type: "annual", startDate: relIso(-3), endDate: relIso(4), status: "approved", note: "Deniz tatili", createdAt: relTimestamp(-7), decidedAt: relTimestamp(-6) },
  { id: "l-02", personnelId: "p-09", type: "sick", startDate: relIso(-2), endDate: relIso(3), status: "approved", note: "Grip istirahati ve evde dinlenme", createdAt: relTimestamp(-3), decidedAt: relTimestamp(-2) },
  { id: "l-03", personnelId: "p-15", type: "annual", startDate: relIso(-4), endDate: relIso(5), status: "approved", note: "Yıllık izin kullanımı", createdAt: relTimestamp(-10), decidedAt: relTimestamp(-9) },
  { id: "l-04", personnelId: "p-23", type: "excuse", startDate: relIso(-1), endDate: relIso(2), status: "approved", note: "Ailevi mazeret izni", createdAt: relTimestamp(-2), decidedAt: relTimestamp(-1) },
  { id: "l-05", personnelId: "p-31", type: "annual", startDate: relIso(-2), endDate: relIso(6), status: "approved", note: "Şehir dışı seyahat", createdAt: relTimestamp(-8), decidedAt: relTimestamp(-7) },
  { id: "l-06", personnelId: "p-44", type: "sick", startDate: relIso(-1), endDate: relIso(3), status: "approved", note: "Ameliyat sonrası doktor raporu", createdAt: relTimestamp(-2), decidedAt: relTimestamp(-1) },

  /* ── 2. Yaklaşan İzinler (Onaylanmış, birkaç gün sonra başlayacak) ── */
  { id: "l-07", personnelId: "p-01", type: "annual", startDate: relIso(5), endDate: relIso(12), status: "approved", note: "Yaz tatili ve dinlenme", createdAt: relTimestamp(-5), decidedAt: relTimestamp(-4) },
  { id: "l-08", personnelId: "p-08", type: "annual", startDate: relIso(8), endDate: relIso(15), status: "approved", note: "Ege turu", createdAt: relTimestamp(-6), decidedAt: relTimestamp(-5) },
  { id: "l-09", personnelId: "p-12", type: "excuse", startDate: relIso(4), endDate: relIso(6), status: "approved", note: "Resmi işlemler", createdAt: relTimestamp(-3), decidedAt: relTimestamp(-2) },
  { id: "l-10", personnelId: "p-20", type: "annual", startDate: relIso(10), endDate: relIso(18), status: "approved", note: "Yıllık izin", createdAt: relTimestamp(-4), decidedAt: relTimestamp(-3) },
  { id: "l-11", personnelId: "p-27", type: "unpaid", startDate: relIso(7), endDate: relIso(14), status: "approved", note: "Eğitim programı katılımı", createdAt: relTimestamp(-9), decidedAt: relTimestamp(-8) },
  { id: "l-12", personnelId: "p-38", type: "annual", startDate: relIso(6), endDate: relIso(10), status: "approved", note: "Memleket ziyareti", createdAt: relTimestamp(-5), decidedAt: relTimestamp(-4) },

  /* ── 3. Bekleyen İzin Talepleri (Pending - Yöneticiden onay bekliyor) ── */
  { id: "l-13", personnelId: "p-00", type: "annual", startDate: relIso(12), endDate: relIso(19), status: "pending", note: "Yaz tatili planı", createdAt: relTimestamp(-1) },
  { id: "l-14", personnelId: "p-05", type: "unpaid", startDate: relIso(15), endDate: relIso(20), status: "pending", note: "Kişisel gelişim kursu", createdAt: relTimestamp(-2) },
  { id: "l-15", personnelId: "p-11", type: "annual", startDate: relIso(14), endDate: relIso(22), status: "pending", note: "Yıllık izin izni", createdAt: relTimestamp(-1) },
  { id: "l-16", personnelId: "p-18", type: "sick", startDate: relIso(2), endDate: relIso(4), status: "pending", note: "Diş tedavisi istirahati", createdAt: relTimestamp(0) },
  { id: "l-17", personnelId: "p-24", type: "annual", startDate: relIso(20), endDate: relIso(27), status: "pending", note: "Sonbahar tatili", createdAt: relTimestamp(-2) },
  { id: "l-18", personnelId: "p-30", type: "excuse", startDate: relIso(3), endDate: relIso(4), status: "pending", note: "Ev taşıma mazereti", createdAt: relTimestamp(0) },
  { id: "l-19", personnelId: "p-36", type: "annual", startDate: relIso(18), endDate: relIso(25), status: "pending", note: "Yıl ortası dinlenme", createdAt: relTimestamp(-1) },
  { id: "l-20", personnelId: "p-41", type: "annual", startDate: relIso(22), endDate: relIso(29), status: "pending", note: "Yıllık izin", createdAt: relTimestamp(-3) },
  { id: "l-21", personnelId: "p-47", type: "unpaid", startDate: relIso(30), endDate: relIso(40), status: "pending", note: "Yurt dışı vize süreci", createdAt: relTimestamp(-2) },

  /* ── 4. Geçmişte Onaylanan İzinler (Son 6 aya yayılan veriler) ── */
  { id: "l-22", personnelId: "p-00", type: "annual", startDate: relIso(-25), endDate: relIso(-20), status: "approved", note: "Şehir dışı dinlenme", createdAt: relTimestamp(-30), decidedAt: relTimestamp(-29) },
  { id: "l-23", personnelId: "p-03", type: "annual", startDate: relIso(-45), endDate: relIso(-40), status: "approved", note: "Bahar tatili", createdAt: relTimestamp(-50), decidedAt: relTimestamp(-48) },
  { id: "l-24", personnelId: "p-04", type: "sick", startDate: relIso(-15), endDate: relIso(-13), status: "approved", note: "Kural ihlali olmaksızın doktor izni", createdAt: relTimestamp(-18), decidedAt: relTimestamp(-17) },
  { id: "l-25", personnelId: "p-06", type: "annual", startDate: relIso(-60), endDate: relIso(-55), status: "approved", note: "Yıllık izin kullanımı", createdAt: relTimestamp(-65), decidedAt: relTimestamp(-63) },
  { id: "l-26", personnelId: "p-07", type: "unpaid", startDate: relIso(-90), endDate: relIso(-80), status: "approved", note: "Özel proje çalışması", createdAt: relTimestamp(-95), decidedAt: relTimestamp(-92) },
  { id: "l-27", personnelId: "p-10", type: "annual", startDate: relIso(-35), endDate: relIso(-30), status: "approved", note: "Aile ziyareti", createdAt: relTimestamp(-40), decidedAt: relTimestamp(-38) },
  { id: "l-28", personnelId: "p-13", type: "annual", startDate: relIso(-50), endDate: relIso(-44), status: "approved", note: "Erken yaz dinlenmesi", createdAt: relTimestamp(-55), decidedAt: relTimestamp(-52) },
  { id: "l-29", personnelId: "p-14", type: "sick", startDate: relIso(-22), endDate: relIso(-20), status: "approved", note: "Grip salgını istirahati", createdAt: relTimestamp(-25), decidedAt: relTimestamp(-24) },
  { id: "l-30", personnelId: "p-16", type: "annual", startDate: relIso(-80), endDate: relIso(-73), status: "approved", note: "Kış tatili", createdAt: relTimestamp(-85), decidedAt: relTimestamp(-82) },
  { id: "l-31", personnelId: "p-17", type: "excuse", startDate: relIso(-18), endDate: relIso(-17), status: "approved", note: "Resmi daire işlemleri", createdAt: relTimestamp(-20), decidedAt: relTimestamp(-19) },
  { id: "l-32", personnelId: "p-19", type: "annual", startDate: relIso(-110), endDate: relIso(-102), status: "approved", note: "Yıl başı izni", createdAt: relTimestamp(-115), decidedAt: relTimestamp(-112) },
  { id: "l-33", personnelId: "p-21", type: "sick", startDate: relIso(-75), endDate: relIso(-73), status: "approved", note: "Hastanede kontrol", createdAt: relTimestamp(-78), decidedAt: relTimestamp(-76) },
  { id: "l-34", personnelId: "p-22", type: "annual", startDate: relIso(-140), endDate: relIso(-130), status: "approved", note: "Kıdem izni kullanımı", createdAt: relTimestamp(-145), decidedAt: relTimestamp(-142) },
  { id: "l-35", personnelId: "p-25", type: "annual", startDate: relIso(-30), endDate: relIso(-24), status: "approved", note: "Yaz tatili", createdAt: relTimestamp(-35), decidedAt: relTimestamp(-33) },
  { id: "l-36", personnelId: "p-26", type: "excuse", startDate: relIso(-42), endDate: relIso(-41), status: "approved", note: "Nikah merasimi", createdAt: relTimestamp(-46), decidedAt: relTimestamp(-44) },
  { id: "l-37", personnelId: "p-28", type: "annual", startDate: relIso(-65), endDate: relIso(-58), status: "approved", note: "Akdeniz seyahati", createdAt: relTimestamp(-70), decidedAt: relTimestamp(-67) },
  { id: "l-38", personnelId: "p-29", type: "sick", startDate: relIso(-95), endDate: relIso(-93), status: "approved", note: "Soğuk algınlığı", createdAt: relTimestamp(-98), decidedAt: relTimestamp(-96) },
  { id: "l-39", personnelId: "p-32", type: "annual", startDate: relIso(-125), endDate: relIso(-118), status: "approved", note: "Yıllık izin hakkı", createdAt: relTimestamp(-130), decidedAt: relTimestamp(-127) },
  { id: "l-40", personnelId: "p-33", type: "excuse", startDate: relIso(-12), endDate: relIso(-10), status: "approved", note: "Duruşma ve hukuki mazeret", createdAt: relTimestamp(-15), decidedAt: relTimestamp(-14) },
  { id: "l-41", personnelId: "p-34", type: "annual", startDate: relIso(-85), endDate: relIso(-78), status: "approved", note: "Kültür turu", createdAt: relTimestamp(-90), decidedAt: relTimestamp(-87) },
  { id: "l-42", personnelId: "p-35", type: "sick", startDate: relIso(-38), endDate: relIso(-36), status: "approved", note: "Fizik tedavi süreci", createdAt: relTimestamp(-41), decidedAt: relTimestamp(-39) },
  { id: "l-43", personnelId: "p-37", type: "annual", startDate: relIso(-105), endDate: relIso(-99), status: "approved", note: "Şehir dışı akraba ziyareti", createdAt: relTimestamp(-110), decidedAt: relTimestamp(-107) },
  { id: "l-44", personnelId: "p-39", type: "annual", startDate: relIso(-55), endDate: relIso(-48), status: "approved", note: "Yaz izni", createdAt: relTimestamp(-60), decidedAt: relTimestamp(-57) },
  { id: "l-45", personnelId: "p-40", type: "unpaid", startDate: relIso(-135), endDate: relIso(-125), status: "approved", note: "Lisansüstü tez hazırlığı", createdAt: relTimestamp(-140), decidedAt: relTimestamp(-137) },
  { id: "l-46", personnelId: "p-42", type: "annual", startDate: relIso(-48), endDate: relIso(-42), status: "approved", note: "Yıllık dinlenme", createdAt: relTimestamp(-52), decidedAt: relTimestamp(-50) },
  { id: "l-47", personnelId: "p-43", type: "sick", startDate: relIso(-68), endDate: relIso(-66), status: "approved", note: "Göz muayenesi ve dinlenme", createdAt: relTimestamp(-71), decidedAt: relTimestamp(-69) },
  { id: "l-48", personnelId: "p-45", type: "annual", startDate: relIso(-92), endDate: relIso(-86), status: "approved", note: "Doğa tatili", createdAt: relTimestamp(-96), decidedAt: relTimestamp(-94) },
  { id: "l-49", personnelId: "p-46", type: "excuse", startDate: relIso(-28), endDate: relIso(-26), status: "approved", note: "Tesisat mazereti", createdAt: relTimestamp(-31), decidedAt: relTimestamp(-29) },
  { id: "l-50", personnelId: "p-48", type: "annual", startDate: relIso(-150), endDate: relIso(-142), status: "approved", note: "Kış tatili", createdAt: relTimestamp(-155), decidedAt: relTimestamp(-152) },
  { id: "l-51", personnelId: "p-49", type: "annual", startDate: relIso(-72), endDate: relIso(-66), status: "approved", note: "Yaz tatili", createdAt: relTimestamp(-77), decidedAt: relTimestamp(-74) },

  /* ── 5. Reddedilen İzin Talepleri (Rejected) ── */
  { id: "l-52", personnelId: "p-10", type: "unpaid", startDate: relIso(-10), endDate: relIso(-5), status: "rejected", rejectionReason: "Proje canlıya alım sürecinde kadro eksikliği.", createdAt: relTimestamp(-14), decidedAt: relTimestamp(-12) },
  { id: "l-53", personnelId: "p-05", type: "sick", startDate: relIso(-32), endDate: relIso(-30), status: "rejected", rejectionReason: "Doktor raporu teslim edilmedi.", createdAt: relTimestamp(-35), decidedAt: relTimestamp(-33) },
  { id: "l-54", personnelId: "p-18", type: "annual", startDate: relIso(-58), endDate: relIso(-50), status: "rejected", rejectionReason: "Aynı tarihte ekipten 3 kişinin izinde olması.", createdAt: relTimestamp(-62), decidedAt: relTimestamp(-60) },
  { id: "l-55", personnelId: "p-27", type: "annual", startDate: relIso(-82), endDate: relIso(-75), status: "rejected", rejectionReason: "Kampanya lansman haftası nedeniyle ertelendi.", createdAt: relTimestamp(-86), decidedAt: relTimestamp(-84) },
  { id: "l-56", personnelId: "p-34", type: "unpaid", startDate: relIso(-115), endDate: relIso(-105), status: "rejected", rejectionReason: "Yeterli süre öncesinde bildirim yapılmadı.", createdAt: relTimestamp(-120), decidedAt: relTimestamp(-117) },
  { id: "l-57", personnelId: "p-43", type: "annual", startDate: relIso(-15), endDate: relIso(-8), status: "rejected", rejectionReason: "Çeyrek sonu hedef kapatma dönemi.", createdAt: relTimestamp(-19), decidedAt: relTimestamp(-17) },
];
