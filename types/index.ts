// TypeScript interfaces for PalmTrack Application

export interface Garden {
  id: string;
  nama: string;
  slug: string; // URL-friendly version of nama (e.g., "kebun-sawit-a")
  lokasi: string;
  lokasiLengkap: string;
  luas: number; // in hectares
  jumlahPohon: number;
  tahunTanam: number;
  varietas: string;
  status: 'Baik' | 'Perlu Perhatian' | 'Bermasalah';
  imageUrl?: string; // Garden main image URL
  createdAt: Date;
  updatedAt: Date;
}

export interface Task {
  id: string;
  gardenId: string;
  judul: string;
  deskripsi?: string;
  kategori: 'Pemupukan' | 'Panen' | 'Perawatan' | 'Penyemprotan' | 'Lainnya';
  prioritas: 'High' | 'Normal' | 'Low';
  status: 'To Do' | 'In Progress' | 'Done';
  tanggalTarget: Date;
  assignedTo?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Harvest {
  id: string;
  gardenId: string;
  tanggal: Date;
  jumlahKg: number;
  hargaPerKg: number;
  totalNilai: number; // auto-calculated
  kualitas: 'Baik Sekali' | 'Baik' | 'Cukup' | 'Kurang';
  catatan?: string;
  createdAt: Date;
}

export interface Issue {
  id: string;
  gardenId: string;
  judul: string;
  deskripsi: string;
  areaTerdampak: string;
  tingkatKeparahan: 'Parah' | 'Sedang' | 'Ringan';
  status: 'Open' | 'Resolved';
  fotoUrls?: string[]; // array of image URLs
  solusi?: string;
  tanggalLapor: Date;
  tanggalSelesai?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Maintenance {
  id: string;
  gardenId: string;
  jenisPerawatan: 'Pemupukan' | 'Penyemprotan' | 'Pemangkasan' | 'Pembersihan' | 'Lainnya';
  judul: string;
  tanggalDijadwalkan: Date;
  status: 'Dijadwalkan' | 'Selesai' | 'Terlambat';
  detail?: string;
  penanggungJawab?: string;
  isRecurring: boolean;
  recurringInterval?: number; // in days
  tanggalSelesai?: Date;
  images?: string[]; // Before/after photos
  createdAt: Date;
  updatedAt: Date;
}

export interface Documentation {
  id: string;
  gardenId: string;
  tipe: 'foto' | 'dokumen' | 'catatan';
  judul: string;
  deskripsi?: string;
  fileUrl?: string; // for photos and documents
  content?: string; // for notes
  kategori?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Expense {
  id: string;
  gardenId: string;
  tanggal: Date;
  kategori: 'Pupuk' | 'Pestisida' | 'Peralatan' | 'Tenaga Kerja' | 'Transportasi' | 'Lainnya';
  deskripsi: string;
  jumlah: number; // amount in IDR
  catatan?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TodoItem {
  id: string;
  gardenId: string;
  gardenName: string;
  gardenSlug: string;
  type: 'maintenance' | 'issue';
  judul: string;
  tanggal: Date;
  kategori: string; // jenis_perawatan untuk maintenance, tingkat_keparahan untuk issue
  status: string;
  penanggungJawab?: string; // untuk maintenance
  areaTerdampak?: string; // untuk issue
  deskripsi?: string;
}
