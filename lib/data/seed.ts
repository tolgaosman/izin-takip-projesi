import type { LeaveRequest, Personnel } from "@/lib/data/types";

/* First-run sample data so the dashboard and tables aren't empty.
   Written to localStorage once; afterwards the user's own edits win. */

export const seedPersonnel: Personnel[] = [
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
  { id: "l-01", personnelId: "p-01", type: "annual", startDate: "2025-07-14", endDate: "2025-07-18", status: "pending", note: "Yaz tatili", createdAt: "2025-07-10T09:00:00.000Z" },
  { id: "l-02", personnelId: "p-02", type: "sick", startDate: "2025-07-07", endDate: "2025-07-09", status: "approved", createdAt: "2025-07-06T14:30:00.000Z" },
  { id: "l-03", personnelId: "p-03", type: "annual", startDate: "2025-06-02", endDate: "2025-06-06", status: "approved", note: "Aile ziyareti", createdAt: "2025-05-28T11:15:00.000Z" },
  { id: "l-04", personnelId: "p-05", type: "unpaid", startDate: "2025-07-21", endDate: "2025-07-25", status: "pending", createdAt: "2025-07-11T08:45:00.000Z" },
  { id: "l-05", personnelId: "p-04", type: "annual", startDate: "2025-05-12", endDate: "2025-05-16", status: "approved", createdAt: "2025-05-05T10:00:00.000Z" },
  { id: "l-06", personnelId: "p-06", type: "sick", startDate: "2025-04-03", endDate: "2025-04-04", status: "approved", createdAt: "2025-04-02T16:20:00.000Z" },
  { id: "l-07", personnelId: "p-08", type: "annual", startDate: "2025-08-04", endDate: "2025-08-15", status: "pending", note: "Uzun tatil", createdAt: "2025-07-12T13:00:00.000Z" },
  { id: "l-08", personnelId: "p-09", type: "annual", startDate: "2025-07-01", endDate: "2025-07-11", status: "approved", createdAt: "2025-06-20T09:30:00.000Z" },
  { id: "l-09", personnelId: "p-10", type: "unpaid", startDate: "2025-03-17", endDate: "2025-03-19", status: "rejected", note: "Yoğun dönem", createdAt: "2025-03-10T12:00:00.000Z" },
  { id: "l-10", personnelId: "p-03", type: "sick", startDate: "2025-02-10", endDate: "2025-02-12", status: "approved", createdAt: "2025-02-09T07:50:00.000Z" },
  { id: "l-11", personnelId: "p-01", type: "annual", startDate: "2025-01-06", endDate: "2025-01-10", status: "approved", createdAt: "2024-12-28T10:00:00.000Z" },
  { id: "l-12", personnelId: "p-05", type: "sick", startDate: "2025-06-23", endDate: "2025-06-24", status: "rejected", createdAt: "2025-06-22T15:10:00.000Z" },
];
