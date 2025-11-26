# 🚀 Setup Guide - PalmTrack

Panduan lengkap untuk setup PalmTrack dari awal.

---

## 📋 Prerequisites

- Node.js 18+
- npm atau yarn
- Akun Supabase (gratis)

---

## ⚡ Quick Setup (15 menit)

### 1. Clone & Install

```bash
git clone https://github.com/yourusername/palmtrack.git
cd palmtrack
npm install
```

### 2. Buat Supabase Project

1. Buka https://supabase.com/dashboard
2. Klik "New Project"
3. Isi nama project dan password database
4. Pilih region (Singapore recommended)
5. Tunggu ~2 menit

### 3. Setup Database

1. Buka **SQL Editor** di Supabase Dashboard
2. Copy isi file `supabase/COMPLETE_SETUP.sql`
3. Paste dan klik **Run**
4. Tunggu hingga selesai (~10 detik)

### 4. Setup Storage (untuk gambar)

1. Buka **SQL Editor**
2. Copy isi file `supabase/STORAGE_SETUP.sql`
3. Paste dan klik **Run**
4. Buka **Storage** di sidebar
5. Pastikan bucket `palmtrack-images` sudah ada

### 5. Get API Credentials

1. Buka **Settings** → **API**
2. Copy **Project URL**
3. Copy **anon public** key

### 6. Setup Environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 7. Run Application

```bash
npm run dev
```

Buka http://localhost:3000

---

## ✅ Verification

### Database
- ✅ 7 tables: gardens, tasks, harvests, issues, maintenances, documentation, expenses
- ✅ 30+ indexes untuk performance

### Storage
- ✅ Bucket `palmtrack-images` exists
- ✅ Public access enabled

### Application
- ✅ `npm run dev` works
- ✅ Bisa create garden
- ✅ Bisa upload gambar

---

## 📱 Test di Smartphone

```bash
# Cari IP komputer
ifconfig | grep "inet "

# Buka di smartphone (pastikan satu WiFi)
http://[IP-KAMU]:3000
```

---

## 🔧 Troubleshooting

### "Supabase is not configured"
- Cek `.env.local` sudah ada dan benar
- Restart dev server

### "relation already exists"
- Database sudah ada tables, skip atau drop dulu

### "Failed to upload image"
- Pastikan bucket `palmtrack-images` sudah dibuat
- Jalankan `STORAGE_SETUP.sql`

### "permission denied"
- Cek anon key benar
- Cek storage policies sudah dibuat

---

## 🚀 Deployment

### Vercel (Recommended)

```bash
npm i -g vercel
vercel
vercel --prod
```

Set environment variables di Vercel Dashboard.

---

## 📚 More Info

Lihat **README.md** untuk dokumentasi lengkap.
