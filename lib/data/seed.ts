import type { LeaveRequest, Personnel } from "@/lib/data/types";

/* First-run sample data so the dashboard and tables aren't empty.
   Written to localStorage once; afterwards the user's own edits win. */

function relIso(daysOffset: number): string {
  const d = new Date();
  d.setDate(d.getDate() + daysOffset);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export const seedPersonnel: Personnel[] = [
  { id: "p-00", name: "Tolga Osman", department: "Yazılım", phone: "0532 000 00 00", status: "active", email: "tolgaosmanfly@gmail.com", startDate: "2023-01-01" },
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
];

export const seedLeaveRequests: LeaveRequest[] = [
  { id: "l-01", personnelId: "p-00", type: "annual", startDate: relIso(-15), endDate: relIso(-11), status: "approved", note: "Yıllık izin", createdAt: new Date(Date.now() - 20 * 86400000).toISOString() },
  { id: "l-02", personnelId: "p-02", type: "sick", startDate: relIso(-2), endDate: relIso(2), status: "approved", note: "Grip istirahati", createdAt: new Date(Date.now() - 3 * 86400000).toISOString() },
  { id: "l-03", personnelId: "p-01", type: "annual", startDate: relIso(5), endDate: relIso(9), status: "approved", note: "Yaz tatili", createdAt: new Date(Date.now() - 5 * 86400000).toISOString() },
  { id: "l-04", personnelId: "p-00", type: "annual", startDate: relIso(10), endDate: relIso(15), status: "pending", note: "Tatil talebi", createdAt: new Date(Date.now() - 1 * 86400000).toISOString() },
  { id: "l-05", personnelId: "p-05", type: "unpaid", startDate: relIso(3), endDate: relIso(7), status: "pending", createdAt: new Date(Date.now() - 2 * 86400000).toISOString() },
  { id: "l-06", personnelId: "p-03", type: "annual", startDate: relIso(-40), endDate: relIso(-35), status: "approved", note: "Aile ziyareti", createdAt: new Date(Date.now() - 45 * 86400000).toISOString() },
  { id: "l-07", personnelId: "p-04", type: "annual", startDate: relIso(-70), endDate: relIso(-65), status: "approved", createdAt: new Date(Date.now() - 75 * 86400000).toISOString() },
  { id: "l-08", personnelId: "p-06", type: "sick", startDate: relIso(-100), endDate: relIso(-98), status: "approved", createdAt: new Date(Date.now() - 102 * 86400000).toISOString() },
  { id: "l-09", personnelId: "p-08", type: "annual", startDate: relIso(12), endDate: relIso(20), status: "pending", note: "Uzun tatil", createdAt: new Date(Date.now() - 4 * 86400000).toISOString() },
  { id: "l-10", personnelId: "p-09", type: "annual", startDate: relIso(-1), endDate: relIso(5), status: "approved", createdAt: new Date(Date.now() - 7 * 86400000).toISOString() },
  { id: "l-11", personnelId: "p-10", type: "unpaid", startDate: relIso(-120), endDate: relIso(-118), status: "rejected", note: "Yoğun dönem", createdAt: new Date(Date.now() - 125 * 86400000).toISOString() },
  { id: "l-12", personnelId: "p-03", type: "sick", startDate: relIso(-150), endDate: relIso(-148), status: "approved", createdAt: new Date(Date.now() - 152 * 86400000).toISOString() },
];
