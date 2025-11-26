# 🌴 PalmTrack

**Aplikasi Manajemen Kebun Kelapa Sawit Modern**

PalmTrack adalah aplikasi web berbasis Next.js untuk mengelola kebun kelapa sawit secara efisien. Dilengkapi dengan fitur manajemen kebun, pencatatan panen, pelacakan masalah, jadwal perawatan, dan dokumentasi foto.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat-square&logo=typescript)
![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=flat-square&logo=supabase)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

---

## ✨ Fitur Utama

### 📊 Dashboard
- **Ringkasan Statistik** - Total kebun, pohon, produksi, dan pendapatan
- **Grafik Produksi** - Visualisasi tren panen bulanan
- **Todo List** - Daftar tugas dan perawatan yang perlu dilakukan
- **Quick Access** - Akses cepat ke semua kebun dengan thumbnail
- **Swipe Gestures** - Geser untuk menyelesaikan atau menghapus tugas

### 🌴 Manajemen Kebun
- **CRUD Kebun** - Tambah, edit, hapus kebun
- **Upload Foto Kebun** - Gambar utama untuk setiap kebun
- **Status Monitoring** - Baik, Perlu Perhatian, Bermasalah
- **Detail Lengkap** - Lokasi, luas, jumlah pohon, varietas, tahun tanam

### 📈 Pencatatan Panen
- **Input Panen** - Tanggal, jumlah (kg), harga per kg
- **Kalkulasi Otomatis** - Total nilai panen
- **Kualitas Panen** - Baik Sekali, Baik, Cukup, Kurang
- **Riwayat Panen** - Timeline semua panen per kebun

### 🐛 Pelacakan Masalah
- **Laporan Masalah** - Judul, deskripsi, area terdampak
- **Tingkat Keparahan** - Parah, Sedang, Ringan
- **Upload Foto** - Dokumentasi masalah dengan multiple foto (max 5)
- **Photo Gallery** - Lightbox untuk melihat foto detail
- **Status Tracking** - Open → Resolved

### 🔧 Jadwal Perawatan
- **Jenis Perawatan** - Pemupukan, Penyemprotan, Pemangkasan, Pembersihan
- **Penjadwalan** - Tanggal target dan penanggung jawab
- **Recurring Tasks** - Perawatan berulang dengan interval
- **Dokumentasi Foto** - Before/after photos (max 4)
- **Status** - Dijadwalkan, Selesai, Terlambat

### 💰 Pencatatan Pengeluaran
- **Kategori** - Pupuk, Pestisida, Peralatan, Tenaga Kerja, Transportasi
- **Input Detail** - Tanggal, deskripsi, jumlah (IDR)
- **Riwayat** - Timeline pengeluaran per kebun

### 📱 Mobile-First Design
- **Responsive** - Optimal di semua ukuran layar
- **PWA Support** - Install sebagai aplikasi native
- **Touch Gestures** - Swipe untuk aksi cepat
- **Offline Indicator** - Notifikasi saat offline
- **Camera Integration** - Upload foto langsung dari kamera

---

## 🛠️ Tech Stack

| Kategori | Teknologi |
|----------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **UI Library** | React 19 |
| **Language** | TypeScript 5.6 |
| **Styling** | Tailwind CSS 3.4 |
| **Database** | Supabase (PostgreSQL) |
| **Storage** | Supabase Storage |
| **State Management** | React Query (TanStack) |
| **Forms** | React Hook Form + Zod |
| **UI Components** | Radix UI + shadcn/ui |
| **Charts** | Recharts |
| **Animations** | Framer Motion |
| **Icons** | Lucide React |
| **Date Handling** | date-fns |
| **Notifications** | Sonner |

---

## 📁 Struktur Project

```
palmtrack/
├── app/                          # Next.js App Router
│   ├── kebun/                    # Halaman kebun
│   │   ├── [id]/                 # Detail kebun (dynamic route)
│   │   └── page.tsx              # Daftar kebun
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Dashboard
│
├── components/
│   ├── dashboard/                # Komponen dashboard
│   │   ├── GardenQuickAccess.tsx # Quick access cards
│   │   ├── ProductionChart.tsx   # Grafik produksi
│   │   ├── SummaryCards.tsx      # Kartu statistik
│   │   ├── SwipeableTodoItem.tsx # Todo dengan swipe
│   │   └── TodoListNew.tsx       # Todo list
│   │
│   ├── kebun/                    # Komponen kebun
│   │   ├── AddGardenModal.tsx    # Modal tambah kebun
│   │   ├── EditGardenModal.tsx   # Modal edit kebun
│   │   └── GardenCard.tsx        # Kartu kebun
│   │
│   ├── kebun-detail/             # Komponen detail kebun
│   │   ├── modals/               # Modal forms
│   │   │   ├── AddHarvestModal.tsx
│   │   │   ├── AddIssueModal.tsx
│   │   │   ├── AddMaintenanceModal.tsx
│   │   │   └── ...
│   │   ├── tabs/                 # Tab content
│   │   │   ├── TabPanen.tsx
│   │   │   ├── TabMasalah.tsx
│   │   │   ├── TabPerawatan.tsx
│   │   │   └── ...
│   │   ├── GardenHeader.tsx
│   │   └── QuickStats.tsx
│   │
│   ├── layout/                   # Layout components
│   │   ├── MobileNav.tsx         # Bottom navigation
│   │   └── Navbar.tsx            # Top navbar
│   │
│   └── ui/                       # UI primitives
│       ├── button.tsx
│       ├── card.tsx
│       ├── dialog.tsx
│       ├── garden-image.tsx      # Garden image display
│       ├── image-upload.tsx      # Single image upload
│       ├── multi-image-upload.tsx # Multiple images
│       ├── photo-gallery.tsx     # Photo gallery + lightbox
│       └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── api/                  # API functions
│   │   │   ├── gardens.ts
│   │   │   ├── harvests.ts
│   │   │   ├── issues.ts
│   │   │   ├── maintenances.ts
│   │   │   └── ...
│   │   ├── client.ts             # Supabase client
│   │   ├── storage.ts            # Storage utilities
│   │   └── types.ts              # Database types
│   ├── context/                  # React contexts
│   ├── hooks/                    # Custom hooks
│   └── utils.ts                  # Utility functions
│
├── public/                       # Static assets
│   ├── manifest.json             # PWA manifest
│   └── icons/                    # App icons
│
├── supabase/
│   ├── COMPLETE_SETUP.sql        # Database schema
│   └── STORAGE_SETUP.sql         # Storage setup
│
├── types/
│   └── index.ts                  # TypeScript interfaces
│
└── package.json
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm atau yarn
- Akun Supabase (gratis)

### 1. Clone Repository

```bash
git clone https://github.com/yourusername/palmtrack.git
cd palmtrack
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Setup Supabase

#### a. Buat Project Supabase
1. Buka [supabase.com](https://supabase.com) dan login
2. Klik "New Project"
3. Isi nama project dan password database
4. Pilih region terdekat (Singapore recommended)
5. Tunggu project selesai dibuat

#### b. Setup Database
1. Buka SQL Editor di Supabase Dashboard
2. Copy isi file `supabase/COMPLETE_SETUP.sql`
3. Paste dan jalankan di SQL Editor
4. Tunggu hingga selesai (5-10 detik)

#### c. Setup Storage (untuk upload gambar)
1. Buka SQL Editor
2. Copy isi file `supabase/STORAGE_SETUP.sql`
3. Paste dan jalankan
4. Buka Storage di sidebar
5. Pastikan bucket `palmtrack-images` sudah ada

#### d. Dapatkan API Keys
1. Buka Settings → API
2. Copy `Project URL` dan `anon public` key

### 4. Environment Variables

```bash
# Copy example file
cp .env.local.example .env.local

# Edit .env.local
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 5. Run Development Server

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📱 PWA Installation

PalmTrack dapat diinstall sebagai aplikasi native di device kamu:

### Android (Chrome)
1. Buka PalmTrack di Chrome
2. Tap menu (⋮) → "Add to Home screen"
3. Tap "Install"

### iOS (Safari)
1. Buka PalmTrack di Safari
2. Tap Share button (□↑)
3. Scroll dan tap "Add to Home Screen"
4. Tap "Add"

### Desktop (Chrome/Edge)
1. Buka PalmTrack
2. Klik icon install di address bar
3. Klik "Install"

---

## 🗄️ Database Schema

### Tables

| Table | Deskripsi |
|-------|-----------|
| `gardens` | Data kebun (nama, lokasi, luas, dll) |
| `harvests` | Catatan panen |
| `issues` | Laporan masalah |
| `maintenances` | Jadwal perawatan |
| `tasks` | Tugas/todo |
| `expenses` | Pengeluaran |
| `documentation` | Dokumentasi |

### Entity Relationship

```
gardens (1) ─────┬───── (*) harvests
                 ├───── (*) issues
                 ├───── (*) maintenances
                 ├───── (*) tasks
                 ├───── (*) expenses
                 └───── (*) documentation
```

---

## 📸 Image System

### Storage Structure

```
palmtrack-images/
├── gardens/{garden_id}/{timestamp}.jpg
├── issues/{garden_id}/{timestamp}/{photo}.jpg
└── maintenances/{garden_id}/{timestamp}/{photo}.jpg
```

### Features
- **Auto Compression** - Gambar dikompresi otomatis (max 1920px, 80% quality)
- **Drag & Drop** - Upload dengan drag and drop
- **Camera Capture** - Ambil foto langsung dari kamera
- **Multiple Upload** - Upload beberapa foto sekaligus
- **Photo Gallery** - Lightbox untuk view foto
- **Lazy Loading** - Optimasi performa loading

---

## 🔧 Available Scripts

```bash
# Development
npm run dev          # Start development server

# Production
npm run build        # Build for production
npm run start        # Start production server

# Utilities
npm run lint         # Run ESLint
npm run seed         # Seed database with sample data
```

---

## 📖 API Reference

### Gardens API

```typescript
import { 
  getGardens, 
  getGardenBySlug, 
  createGarden, 
  updateGarden, 
  deleteGarden 
} from '@/lib/supabase/api/gardens';

// Get all gardens
const gardens = await getGardens();

// Get garden by slug
const garden = await getGardenBySlug('kebun-sawit-a');

// Create garden
const newGarden = await createGarden({
  nama: 'Kebun Baru',
  lokasi: 'Riau',
  luas: 10,
  jumlahPohon: 1500,
  tahunTanam: 2020,
  varietas: 'Tenera',
  status: 'Baik'
});

// Update garden
await updateGarden(gardenId, { nama: 'Nama Baru' });

// Delete garden
await deleteGarden(gardenId);
```

### Harvests API

```typescript
import { 
  getHarvestsByGarden, 
  createHarvest, 
  deleteHarvest 
} from '@/lib/supabase/api/harvests';

// Get harvests
const harvests = await getHarvestsByGarden(gardenId);

// Create harvest
await createHarvest({
  gardenId,
  tanggal: new Date(),
  jumlahKg: 500,
  hargaPerKg: 2500,
  kualitas: 'Baik'
});
```

### Storage API

```typescript
import { 
  uploadImage, 
  uploadMultipleImages, 
  deleteImage,
  compressImage 
} from '@/lib/supabase/storage';

// Upload single image
const { url, error } = await uploadImage(file, 'gardens/123');

// Upload multiple images
const { urls, errors } = await uploadMultipleImages(files, 'issues/456');

// Delete image
await deleteImage('path/to/image.jpg');
```

---

## 🎨 UI Components

### Image Upload

```tsx
import { ImageUpload } from '@/components/ui/image-upload';

<ImageUpload
  value={imageUrl}
  onChange={setImageUrl}
  folder="gardens/123"
  aspectRatio="video"
/>
```

### Multi Image Upload

```tsx
import { MultiImageUpload } from '@/components/ui/multi-image-upload';

<MultiImageUpload
  value={photos}
  onChange={setPhotos}
  folder="issues/456"
  maxImages={5}
/>
```

### Photo Gallery

```tsx
import { PhotoGallery } from '@/components/ui/photo-gallery';

<PhotoGallery
  photos={issue.fotoUrls}
  maxVisible={3}
/>
```

### Garden Image

```tsx
import { GardenImage, GardenThumbnail } from '@/components/ui/garden-image';

<GardenImage
  src={garden.imageUrl}
  alt={garden.nama}
  aspectRatio="video"
/>

<GardenThumbnail
  src={garden.imageUrl}
  alt={garden.nama}
  size="md"
/>
```

---

## 🔒 Security

- **Row Level Security (RLS)** - Dapat diaktifkan di Supabase
- **Public Storage** - Gambar dapat diakses publik
- **File Validation** - Validasi tipe dan ukuran file
- **Input Sanitization** - Validasi input dengan Zod

---

## 📊 Performance

- **Image Compression** - Otomatis compress gambar sebelum upload
- **Lazy Loading** - Gambar dimuat saat diperlukan
- **React Query** - Caching dan background refetching
- **Optimized Indexes** - Database indexes untuk query cepat
- **Code Splitting** - Next.js automatic code splitting

---

## 🐛 Troubleshooting

### Supabase Connection Error
```
Error: Supabase is not configured
```
**Solusi:** Pastikan `.env.local` sudah diisi dengan benar

### Image Upload Failed
```
Error: Failed to upload image
```
**Solusi:** 
1. Pastikan bucket `palmtrack-images` sudah dibuat
2. Jalankan `STORAGE_SETUP.sql`
3. Check file size (max 5MB)

### Database Error
```
Error: relation "gardens" does not exist
```
**Solusi:** Jalankan `COMPLETE_SETUP.sql` di SQL Editor

---

## 🤝 Contributing

1. Fork repository
2. Buat branch baru (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push ke branch (`git push origin feature/amazing-feature`)
5. Buat Pull Request

---

## 📄 License

MIT License - lihat [LICENSE](LICENSE) untuk detail.

---

## 👨‍💻 Author

Dibuat dengan ❤️ untuk petani kelapa sawit Indonesia.

---

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Radix UI](https://www.radix-ui.com/)
