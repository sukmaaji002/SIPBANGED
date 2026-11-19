-- ==============================================================================
-- SKEMA DATABASE RESMI SIPBANGED - DPUPR KABUPATEN TEGAL
-- Jalankan seluruh skrip ini di SQL Editor Supabase:
-- (Supabase Dashboard -> Pilih Proyek -> SQL Editor -> New Query -> Paste & Run)
-- ==============================================================================

-- 1. TABEL PENGGUNA & AKUN
CREATE TABLE IF NOT EXISTS public.sipbanged_users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,
  agency TEXT,
  nip TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TABEL PROYEK BANGUNAN GEDUNG (MULTI-PAKET)
CREATE TABLE IF NOT EXISTS public.sipbanged_projects (
  id TEXT PRIMARY KEY,
  kode_paket TEXT,
  nama TEXT NOT NULL,
  tahun_anggaran INT DEFAULT 2026,
  sumber_dana TEXT,
  lokasi TEXT,
  stage TEXT DEFAULT 'perencanaan',
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. TABEL DOKUMEN PERENCANAAN (DED/RAB)
CREATE TABLE IF NOT EXISTS public.sipbanged_planning_docs (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABEL PROGRES MINGGUAN (KURVA S & FOTO)
CREATE TABLE IF NOT EXISTS public.sipbanged_weekly_progress (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  minggu_ke INT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TABEL CATATAN PENGAWASAN
CREATE TABLE IF NOT EXISTS public.sipbanged_supervision (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. TABEL PEMELIHARAAN (FHO & CACAT MUTU)
CREATE TABLE IF NOT EXISTS public.sipbanged_maintenance (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABEL KONTRAK SURAT PERJANJIAN LKPP
CREATE TABLE IF NOT EXISTS public.sipbanged_contracts (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABEL SPK MODULAR (FISIK, PENGAWAS, PERENCANA)
CREATE TABLE IF NOT EXISTS public.sipbanged_spk_contracts (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  spk_type TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABEL BERITA ACARA (BA)
CREATE TABLE IF NOT EXISTS public.sipbanged_berita_acara (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABEL KEUANGAN & PEMBAYARAN
CREATE TABLE IF NOT EXISTS public.sipbanged_payments (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. TABEL ADENDUM JADWAL
CREATE TABLE IF NOT EXISTS public.sipbanged_schedule_addendums (
  id TEXT PRIMARY KEY,
  project_id TEXT,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- NONAKTIFKAN RLS (ROW LEVEL SECURITY) AGAR WEB CLIENT ANON DAPAT MENYIMPAN DATA SECARA LANGSUNG
ALTER TABLE public.sipbanged_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_planning_docs DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_weekly_progress DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_supervision DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_maintenance DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_spk_contracts DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_berita_acara DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.sipbanged_schedule_addendums DISABLE ROW LEVEL SECURITY;

-- BERIKAN HAK AKSES PENUH (GRANT) KEPADA ROLE ANON DAN AUTHENTICATED
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- KEBIJAKAN AKSES PENUH (POLICIES) UNTUK SEMUA TABEL
DROP POLICY IF EXISTS "Akses Penuh Anon Users" ON public.sipbanged_users;
CREATE POLICY "Akses Penuh Anon Users" ON public.sipbanged_users FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Projects" ON public.sipbanged_projects;
CREATE POLICY "Akses Penuh Anon Projects" ON public.sipbanged_projects FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Contracts" ON public.sipbanged_contracts;
CREATE POLICY "Akses Penuh Anon Contracts" ON public.sipbanged_contracts FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon SPK" ON public.sipbanged_spk_contracts;
CREATE POLICY "Akses Penuh Anon SPK" ON public.sipbanged_spk_contracts FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Planning" ON public.sipbanged_planning_docs;
CREATE POLICY "Akses Penuh Anon Planning" ON public.sipbanged_planning_docs FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Progress" ON public.sipbanged_weekly_progress;
CREATE POLICY "Akses Penuh Anon Progress" ON public.sipbanged_weekly_progress FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Supervision" ON public.sipbanged_supervision;
CREATE POLICY "Akses Penuh Anon Supervision" ON public.sipbanged_supervision FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Maintenance" ON public.sipbanged_maintenance;
CREATE POLICY "Akses Penuh Anon Maintenance" ON public.sipbanged_maintenance FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon BA" ON public.sipbanged_berita_acara;
CREATE POLICY "Akses Penuh Anon BA" ON public.sipbanged_berita_acara FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Payments" ON public.sipbanged_payments;
CREATE POLICY "Akses Penuh Anon Payments" ON public.sipbanged_payments FOR ALL TO public USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Akses Penuh Anon Addendums" ON public.sipbanged_schedule_addendums;
CREATE POLICY "Akses Penuh Anon Addendums" ON public.sipbanged_schedule_addendums FOR ALL TO public USING (true) WITH CHECK (true);

