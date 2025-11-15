-- Migration: Add Expenses Table
-- Description: Creates the expenses table for tracking garden expenses
-- Date: 2025-11-12

-- ============================================
-- EXPENSES TABLE
-- ============================================
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
-- INDEXES for better query performance
-- ============================================
CREATE INDEX idx_expenses_garden_id ON expenses(garden_id);
CREATE INDEX idx_expenses_tanggal ON expenses(tanggal);
CREATE INDEX idx_expenses_kategori ON expenses(kategori);

-- ============================================
-- TRIGGER for updated_at
-- ============================================
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- COMMENTS for documentation
-- ============================================
COMMENT ON TABLE expenses IS 'Stores expense records for each garden including fertilizer, pesticides, equipment, labor, and other costs';
COMMENT ON COLUMN expenses.kategori IS 'Category of expense: Pupuk, Pestisida, Peralatan, Tenaga Kerja, Transportasi, Lainnya';
COMMENT ON COLUMN expenses.jumlah IS 'Amount of expense in Indonesian Rupiah (IDR)';
