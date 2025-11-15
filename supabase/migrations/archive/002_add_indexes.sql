-- Add additional indexes for better query performance
-- These indexes complement the existing ones in schema.sql
-- Note: Using IF NOT EXISTS to avoid conflicts with existing indexes

-- ============================================
-- COMPOSITE INDEXES for common query patterns
-- ============================================

-- Harvests table - composite indexes for better performance
CREATE INDEX IF NOT EXISTS idx_harvests_garden_tanggal ON harvests(garden_id, tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_harvests_tanggal_desc ON harvests(tanggal DESC);

-- Issues table - composite indexes
CREATE INDEX IF NOT EXISTS idx_issues_garden_status ON issues(garden_id, status);
CREATE INDEX IF NOT EXISTS idx_issues_tanggal_lapor_desc ON issues(tanggal_lapor DESC);

-- Maintenances table - composite indexes
CREATE INDEX IF NOT EXISTS idx_maintenances_garden_status ON maintenances(garden_id, status);
CREATE INDEX IF NOT EXISTS idx_maintenances_status_tanggal ON maintenances(status, tanggal_dijadwalkan);

-- Documentation table - composite indexes
CREATE INDEX IF NOT EXISTS idx_documentation_garden_tipe ON documentation(garden_id, tipe);
CREATE INDEX IF NOT EXISTS idx_documentation_created_at_desc ON documentation(created_at DESC);

-- Expenses table - composite indexes
CREATE INDEX IF NOT EXISTS idx_expenses_garden_tanggal ON expenses(garden_id, tanggal DESC);
CREATE INDEX IF NOT EXISTS idx_expenses_kategori_tanggal ON expenses(kategori, tanggal DESC);

-- Tasks table - composite indexes
CREATE INDEX IF NOT EXISTS idx_tasks_garden_status ON tasks(garden_id, status);
CREATE INDEX IF NOT EXISTS idx_tasks_prioritas ON tasks(prioritas);
CREATE INDEX IF NOT EXISTS idx_tasks_status_tanggal ON tasks(status, tanggal_target);

-- Gardens table - additional indexes
CREATE INDEX IF NOT EXISTS idx_gardens_created_at_desc ON gardens(created_at DESC);

-- ============================================
-- PARTIAL INDEXES for specific queries
-- ============================================

-- Index for open issues only (faster queries for active issues)
CREATE INDEX IF NOT EXISTS idx_issues_open ON issues(garden_id, tanggal_lapor DESC) 
  WHERE status = 'Open';

-- Index for scheduled maintenances only
CREATE INDEX IF NOT EXISTS idx_maintenances_scheduled ON maintenances(garden_id, tanggal_dijadwalkan) 
  WHERE status IN ('Dijadwalkan', 'Terlambat');

-- Index for pending tasks only
CREATE INDEX IF NOT EXISTS idx_tasks_pending ON tasks(garden_id, tanggal_target) 
  WHERE status IN ('To Do', 'In Progress');

-- ============================================
-- NOTES
-- ============================================
-- These indexes are designed to optimize:
-- 1. Garden detail page queries (fetching all related data)
-- 2. Date-based filtering and sorting
-- 3. Status-based filtering
-- 4. Common composite queries
--
-- Partial indexes reduce index size and improve write performance
-- while still providing fast reads for common queries.
