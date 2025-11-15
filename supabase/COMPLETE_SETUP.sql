-- ============================================
-- PALMTRACK - COMPLETE DATABASE SETUP
-- ============================================
-- Run this in your Supabase SQL Editor
-- Estimated execution time: 5-10 seconds
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLES
-- ============================================

CREATE TABLE gardens (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  nama VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  lokasi VARCHAR(255) NOT NULL,
  lokasi_lengkap TEXT NOT NULL,
  luas DECIMAL(10, 2) NOT NULL CHECK (luas > 0),
  jumlah_pohon INTEGER NOT NULL CHECK (jumlah_pohon > 0),
  tahun_tanam INTEGER NOT NULL CHECK (tahun_tanam >= 1980 AND tahun_tanam <= EXTRACT(YEAR FROM CURRENT_DATE)),
  varietas VARCHAR(50) NOT NULL CHECK (varietas IN ('Tenera', 'Dura', 'Pisifera')),
  status VARCHAR(50) NOT NULL CHECK (status IN ('Baik', 'Perlu Perhatian', 'Bermasalah')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Pemupukan', 'Panen', 'Perawatan', 'Penyemprotan', 'Lainnya')),
  prioritas VARCHAR(20) NOT NULL CHECK (prioritas IN ('High', 'Normal', 'Low')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('To Do', 'In Progress', 'Done')),
  tanggal_target DATE NOT NULL,
  assigned_to VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE harvests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  jumlah_kg DECIMAL(10, 2) NOT NULL CHECK (jumlah_kg > 0),
  harga_per_kg DECIMAL(10, 2) NOT NULL CHECK (harga_per_kg > 0),
  total_nilai DECIMAL(15, 2) NOT NULL,
  kualitas VARCHAR(50) NOT NULL CHECK (kualitas IN ('Baik Sekali', 'Baik', 'Cukup', 'Kurang')),
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT NOT NULL,
  area_terdampak VARCHAR(255) NOT NULL,
  tingkat_keparahan VARCHAR(20) NOT NULL CHECK (tingkat_keparahan IN ('Parah', 'Sedang', 'Ringan')),
  status VARCHAR(20) NOT NULL CHECK (status IN ('Open', 'Resolved')),
  foto_urls TEXT[],
  solusi TEXT,
  tanggal_lapor DATE NOT NULL,
  tanggal_selesai DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE maintenances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  jenis_perawatan VARCHAR(50) NOT NULL CHECK (jenis_perawatan IN ('Pemupukan', 'Penyemprotan', 'Pemangkasan', 'Pembersihan', 'Lainnya')),
  judul VARCHAR(255) NOT NULL,
  tanggal_dijadwalkan DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('Dijadwalkan', 'Selesai', 'Terlambat')),
  detail TEXT,
  penanggung_jawab VARCHAR(255),
  is_recurring BOOLEAN DEFAULT FALSE,
  recurring_interval INTEGER,
  tanggal_selesai DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE documentation (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  tipe VARCHAR(20) NOT NULL CHECK (tipe IN ('foto', 'dokumen', 'catatan')),
  judul VARCHAR(255) NOT NULL,
  deskripsi TEXT,
  file_url TEXT,
  content TEXT,
  kategori VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

CREATE TABLE expenses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
  tanggal DATE NOT NULL,
  kategori VARCHAR(50) NOT NULL CHECK (kategori IN ('Pupuk', 'Pestisida', 'Peralatan', 'Tenaga Kerja', 'Transportasi', 'Lainnya')),
  deskripsi VARCHAR(255) NOT NULL,
  jumlah DECIMAL(15, 2) NOT NULL CHECK (jumlah > 0),
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- ============================================
-- BASIC INDEXES
-- ============================================

CREATE INDEX idx_gardens_slug ON gardens(slug);
CREATE INDEX idx_gardens_status ON gardens(status);
CREATE INDEX idx_gardens_created_at ON gardens(created_at);
CREATE INDEX idx_tasks_garden_id ON tasks(garden_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_tanggal_target ON tasks(tanggal_target);
CREATE INDEX idx_harvests_garden_id ON harvests(garden_id);
CREATE INDEX idx_harvests_tanggal ON harvests(tanggal);
CREATE INDEX idx_issues_garden_id ON issues(garden_id);
CREATE INDEX idx_issues_status ON issues(status);
CREATE INDEX idx_maintenances_garden_id ON maintenances(garden_id);
CREATE INDEX idx_maintenances_status ON maintenances(status);
CREATE INDEX idx_maintenances_tanggal_dijadwalkan ON maintenances(tanggal_dijadwalkan);
CREATE INDEX idx_documentation_garden_id ON documentation(garden_id);
CREATE INDEX idx_documentation_tipe ON documentation(tipe);
CREATE INDEX idx_expenses_garden_id ON expenses(garden_id);
CREATE INDEX idx_expenses_tanggal ON expenses(tanggal);
CREATE INDEX idx_expenses_kategori ON expenses(kategori);

-- ============================================
-- OPTIMIZED COMPOSITE INDEXES
-- ============================================

CREATE INDEX idx_harvests_garden_tanggal ON harvests(garden_id, tanggal DESC);
CREATE INDEX idx_harvests_tanggal_desc ON harvests(tanggal DESC);
CREATE INDEX idx_issues_garden_status ON issues(garden_id, status);
CREATE INDEX idx_issues_tanggal_lapor_desc ON issues(tanggal_lapor DESC);
CREATE INDEX idx_maintenances_garden_status ON maintenances(garden_id, status);
CREATE INDEX idx_maintenances_status_tanggal ON maintenances(status, tanggal_dijadwalkan);
CREATE INDEX idx_documentation_garden_tipe ON documentation(garden_id, tipe);
CREATE INDEX idx_documentation_created_at_desc ON documentation(created_at DESC);
CREATE INDEX idx_expenses_garden_tanggal ON expenses(garden_id, tanggal DESC);
CREATE INDEX idx_expenses_kategori_tanggal ON expenses(kategori, tanggal DESC);
CREATE INDEX idx_tasks_garden_status ON tasks(garden_id, status);
CREATE INDEX idx_tasks_prioritas ON tasks(prioritas);
CREATE INDEX idx_tasks_status_tanggal ON tasks(status, tanggal_target);
CREATE INDEX idx_gardens_created_at_desc ON gardens(created_at DESC);

-- ============================================
-- PARTIAL INDEXES
-- ============================================

CREATE INDEX idx_issues_open ON issues(garden_id, tanggal_lapor DESC) WHERE status = 'Open';
CREATE INDEX idx_maintenances_scheduled ON maintenances(garden_id, tanggal_dijadwalkan) WHERE status IN ('Dijadwalkan', 'Terlambat');
CREATE INDEX idx_tasks_pending ON tasks(garden_id, tanggal_target) WHERE status IN ('To Do', 'In Progress');

-- ============================================
-- FUNCTIONS
-- ============================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION calculate_harvest_total()
RETURNS TRIGGER AS $$
BEGIN
  NEW.total_nilai = NEW.jumlah_kg * NEW.harga_per_kg;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION generate_slug(text_input TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(
        regexp_replace(
          trim(text_input),
          '\s+', '-', 'g'
        ),
        '[^a-z0-9\-]', '', 'gi'
      ),
      '\-+', '-', 'g'
    )
  );
END;
$$ LANGUAGE plpgsql IMMUTABLE;

CREATE OR REPLACE FUNCTION gardens_auto_slug()
RETURNS TRIGGER AS $$
DECLARE
  counter INTEGER := 1;
  temp_slug TEXT;
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug := generate_slug(NEW.nama);
    temp_slug := NEW.slug;
    
    WHILE EXISTS (SELECT 1 FROM gardens WHERE slug = temp_slug AND id != NEW.id) LOOP
      temp_slug := NEW.slug || '-' || counter;
      counter := counter + 1;
    END LOOP;
    
    NEW.slug := temp_slug;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================
-- TRIGGERS
-- ============================================

CREATE TRIGGER update_gardens_updated_at BEFORE UPDATE ON gardens
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_issues_updated_at BEFORE UPDATE ON issues
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_maintenances_updated_at BEFORE UPDATE ON maintenances
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documentation_updated_at BEFORE UPDATE ON documentation
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER calculate_harvest_total_trigger BEFORE INSERT OR UPDATE ON harvests
  FOR EACH ROW EXECUTE FUNCTION calculate_harvest_total();

CREATE TRIGGER gardens_auto_slug_trigger BEFORE INSERT OR UPDATE ON gardens
  FOR EACH ROW EXECUTE FUNCTION gardens_auto_slug();

-- ============================================
-- SETUP COMPLETE!
-- ============================================
-- Your database is now ready with:
-- - 7 tables
-- - 30+ indexes (basic + composite + partial)
-- - 4 functions
-- - 8 triggers
-- ============================================
