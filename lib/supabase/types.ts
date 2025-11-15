// Database types generated from Supabase schema
// This provides type safety for database operations

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      gardens: {
        Row: {
          id: string
          nama: string
          slug: string
          lokasi: string
          lokasi_lengkap: string
          luas: number
          jumlah_pohon: number
          tahun_tanam: number
          varietas: string
          status: 'Baik' | 'Perlu Perhatian' | 'Bermasalah'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          nama: string
          slug?: string
          lokasi: string
          lokasi_lengkap: string
          luas: number
          jumlah_pohon: number
          tahun_tanam: number
          varietas: string
          status: 'Baik' | 'Perlu Perhatian' | 'Bermasalah'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          nama?: string
          slug?: string
          lokasi?: string
          lokasi_lengkap?: string
          luas?: number
          jumlah_pohon?: number
          tahun_tanam?: number
          varietas?: string
          status?: 'Baik' | 'Perlu Perhatian' | 'Bermasalah'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          garden_id: string
          judul: string
          deskripsi: string | null
          kategori: 'Pemupukan' | 'Panen' | 'Perawatan' | 'Penyemprotan' | 'Lainnya'
          prioritas: 'High' | 'Normal' | 'Low'
          status: 'To Do' | 'In Progress' | 'Done'
          tanggal_target: string
          assigned_to: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          garden_id: string
          judul: string
          deskripsi?: string | null
          kategori: 'Pemupukan' | 'Panen' | 'Perawatan' | 'Penyemprotan' | 'Lainnya'
          prioritas: 'High' | 'Normal' | 'Low'
          status: 'To Do' | 'In Progress' | 'Done'
          tanggal_target: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          garden_id?: string
          judul?: string
          deskripsi?: string | null
          kategori?: 'Pemupukan' | 'Panen' | 'Perawatan' | 'Penyemprotan' | 'Lainnya'
          prioritas?: 'High' | 'Normal' | 'Low'
          status?: 'To Do' | 'In Progress' | 'Done'
          tanggal_target?: string
          assigned_to?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      harvests: {
        Row: {
          id: string
          garden_id: string
          tanggal: string
          jumlah_kg: number
          harga_per_kg: number
          total_nilai: number
          kualitas: 'Baik Sekali' | 'Baik' | 'Cukup' | 'Kurang'
          catatan: string | null
          created_at: string
        }
        Insert: {
          id?: string
          garden_id: string
          tanggal: string
          jumlah_kg: number
          harga_per_kg: number
          total_nilai?: number
          kualitas: 'Baik Sekali' | 'Baik' | 'Cukup' | 'Kurang'
          catatan?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          garden_id?: string
          tanggal?: string
          jumlah_kg?: number
          harga_per_kg?: number
          total_nilai?: number
          kualitas?: 'Baik Sekali' | 'Baik' | 'Cukup' | 'Kurang'
          catatan?: string | null
          created_at?: string
        }
      }
      issues: {
        Row: {
          id: string
          garden_id: string
          judul: string
          deskripsi: string
          area_terdampak: string
          tingkat_keparahan: 'Parah' | 'Sedang' | 'Ringan'
          status: 'Open' | 'Resolved'
          foto_urls: string[] | null
          solusi: string | null
          tanggal_lapor: string
          tanggal_selesai: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          garden_id: string
          judul: string
          deskripsi: string
          area_terdampak: string
          tingkat_keparahan: 'Parah' | 'Sedang' | 'Ringan'
          status: 'Open' | 'Resolved'
          foto_urls?: string[] | null
          solusi?: string | null
          tanggal_lapor: string
          tanggal_selesai?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          garden_id?: string
          judul?: string
          deskripsi?: string
          area_terdampak?: string
          tingkat_keparahan?: 'Parah' | 'Sedang' | 'Ringan'
          status?: 'Open' | 'Resolved'
          foto_urls?: string[] | null
          solusi?: string | null
          tanggal_lapor?: string
          tanggal_selesai?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      maintenances: {
        Row: {
          id: string
          garden_id: string
          jenis_perawatan: 'Pemupukan' | 'Penyemprotan' | 'Pemangkasan' | 'Pembersihan' | 'Lainnya'
          judul: string
          tanggal_dijadwalkan: string
          status: 'Dijadwalkan' | 'Selesai' | 'Terlambat'
          detail: string | null
          penanggung_jawab: string | null
          is_recurring: boolean
          recurring_interval: number | null
          tanggal_selesai: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          garden_id: string
          jenis_perawatan: 'Pemupukan' | 'Penyemprotan' | 'Pemangkasan' | 'Pembersihan' | 'Lainnya'
          judul: string
          tanggal_dijadwalkan: string
          status: 'Dijadwalkan' | 'Selesai' | 'Terlambat'
          detail?: string | null
          penanggung_jawab?: string | null
          is_recurring?: boolean
          recurring_interval?: number | null
          tanggal_selesai?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          garden_id?: string
          jenis_perawatan?: 'Pemupukan' | 'Penyemprotan' | 'Pemangkasan' | 'Pembersihan' | 'Lainnya'
          judul?: string
          tanggal_dijadwalkan?: string
          status?: 'Dijadwalkan' | 'Selesai' | 'Terlambat'
          detail?: string | null
          penanggung_jawab?: string | null
          is_recurring?: boolean
          recurring_interval?: number | null
          tanggal_selesai?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      documentation: {
        Row: {
          id: string
          garden_id: string
          tipe: 'foto' | 'dokumen' | 'catatan'
          judul: string
          deskripsi: string | null
          file_url: string | null
          content: string | null
          kategori: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          garden_id: string
          tipe: 'foto' | 'dokumen' | 'catatan'
          judul: string
          deskripsi?: string | null
          file_url?: string | null
          content?: string | null
          kategori?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          garden_id?: string
          tipe?: 'foto' | 'dokumen' | 'catatan'
          judul?: string
          deskripsi?: string | null
          file_url?: string | null
          content?: string | null
          kategori?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
