import { getSupabase, isSupabaseConnected } from './supabase';
import { 
  User, 
  Project, 
  PlanningDocument, 
  WeeklyProgress, 
  SupervisionLog, 
  MaintenanceIssue, 
  ProjectContract, 
  SpkContract, 
  BeritaAcara, 
  PaymentTerm, 
  ScheduleAddendum 
} from '../types';

export const supabaseSync = {
  // Check connection
  async testConnection(): Promise<{ success: boolean; message: string }> {
    const sb = getSupabase();
    if (!sb) {
      return { success: false, message: 'Supabase URL dan Anon Key belum diisi.' };
    }
    try {
      const { error } = await sb.from('sipbanged_users').select('id').limit(1);
      if (error) {
        if (error.code === '42P01') {
          return { success: false, message: 'Tabel database belum dibuat. Silakan salin & jalankan skrip SQL di Supabase SQL Editor.' };
        }
        if (error.code === '42501') {
          return { success: false, message: 'Izin akses tabel dibatasi (Error 42501). Silakan jalankan perintah GRANT di Supabase SQL Editor agar role anon memiliki izin baca/tulis.' };
        }
        return { success: false, message: `Koneksi gagal: ${error.message}` };
      }
      return { success: true, message: 'Koneksi ke Supabase Cloud Database berhasil!' };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Koneksi gagal: ${errMsg}` };
    }
  },

  // USERS
  async fetchUsers(): Promise<User[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_users').select('*');
      if (error || !data) return null;
      return data.map((row: any) => ({
        id: row.id,
        name: row.name,
        email: row.email,
        role: row.role,
        agency: row.agency || '',
        nip: row.nip || undefined,
        phone: row.phone || '',
        status: row.status || 'active'
      }));
    } catch {
      return null;
    }
  },

  async upsertUser(user: User): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_users').upsert({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        agency: user.agency,
        nip: user.nip || null,
        phone: user.phone,
        status: user.status,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase upsertUser failed:', err);
    }
  },

  async deleteUser(id: string): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_users').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteUser failed:', err);
    }
  },

  // PROJECTS
  async fetchProjects(): Promise<Project[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_projects').select('*').order('created_at', { ascending: false });
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data || row);
    } catch {
      return null;
    }
  },

  async upsertProject(project: Project): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_projects').upsert({
        id: project.id,
        kode_paket: project.kodePaket || '',
        nama: project.nama,
        tahun_anggaran: project.tahunAnggaran || 2026,
        sumber_dana: project.sumberDana || '',
        lokasi: project.lokasi || '',
        stage: project.stage,
        data: project,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase upsertProject failed:', err);
    }
  },

  async deleteProject(id: string): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_projects').delete().eq('id', id);
    } catch (err) {
      console.warn('Supabase deleteProject failed:', err);
    }
  },

  // PLANNING
  async fetchPlanningDocs(): Promise<PlanningDocument[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_planning_docs').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertPlanningDoc(doc: PlanningDocument): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_planning_docs').upsert({
        id: doc.id,
        project_id: doc.projectId,
        data: doc
      });
    } catch (err) {
      console.warn('Supabase upsertPlanningDoc failed:', err);
    }
  },

  // PROGRESS
  async fetchWeeklyProgress(): Promise<WeeklyProgress[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_weekly_progress').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertWeeklyProgress(prog: WeeklyProgress): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_weekly_progress').upsert({
        id: prog.id,
        project_id: prog.projectId,
        minggu_ke: prog.mingguKe,
        data: prog
      });
    } catch (err) {
      console.warn('Supabase upsertWeeklyProgress failed:', err);
    }
  },

  // SUPERVISION
  async fetchSupervisionLogs(): Promise<SupervisionLog[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_supervision').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertSupervisionLog(log: SupervisionLog): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_supervision').upsert({
        id: log.id,
        project_id: log.projectId,
        data: log
      });
    } catch (err) {
      console.warn('Supabase upsertSupervisionLog failed:', err);
    }
  },

  // MAINTENANCE
  async fetchMaintenanceIssues(): Promise<MaintenanceIssue[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_maintenance').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertMaintenanceIssue(issue: MaintenanceIssue): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_maintenance').upsert({
        id: issue.id,
        project_id: issue.projectId,
        data: issue
      });
    } catch (err) {
      console.warn('Supabase upsertMaintenanceIssue failed:', err);
    }
  },

  // CONTRACTS
  async fetchContracts(): Promise<ProjectContract[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_contracts').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertContract(contract: ProjectContract): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_contracts').upsert({
        id: contract.id,
        project_id: contract.projectId,
        data: contract,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase upsertContract failed:', err);
    }
  },

  // SPK CONTRACTS
  async fetchSpkContracts(): Promise<SpkContract[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_spk_contracts').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertSpkContract(spk: SpkContract): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_spk_contracts').upsert({
        id: spk.id,
        project_id: spk.projectId,
        spk_type: spk.spkType,
        data: spk,
        updated_at: new Date().toISOString()
      });
    } catch (err) {
      console.warn('Supabase upsertSpkContract failed:', err);
    }
  },

  // BERITA ACARA
  async fetchBeritaAcara(): Promise<BeritaAcara[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_berita_acara').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertBeritaAcara(ba: BeritaAcara): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      const { error } = await sb.from('sipbanged_berita_acara').upsert({
        id: ba.id,
        project_id: ba.projectId,
        data: ba
      });
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase upsertBeritaAcara failed:', err);
    }
  },

  async deleteBeritaAcara(ba: BeritaAcara): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      const { error } = await sb.from('sipbanged_berita_acara').delete().eq('id', ba.id).eq('project_id', ba.projectId);
      if (error) throw error;
    } catch (err) {
      console.warn('Supabase deleteBeritaAcara failed:', err);
    }
  },

  // PAYMENTS
  async fetchPayments(): Promise<PaymentTerm[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_payments').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertPayment(payment: PaymentTerm): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_payments').upsert({
        id: payment.id,
        project_id: payment.projectId,
        data: payment
      });
    } catch (err) {
      console.warn('Supabase upsertPayment failed:', err);
    }
  },

  // SCHEDULE ADDENDUMS
  async fetchScheduleAddendums(): Promise<ScheduleAddendum[] | null> {
    const sb = getSupabase();
    if (!sb) return null;
    try {
      const { data, error } = await sb.from('sipbanged_schedule_addendums').select('*');
      if (error || !data || data.length === 0) return null;
      return data.map((row: any) => row.data);
    } catch {
      return null;
    }
  },

  async upsertScheduleAddendum(addendum: ScheduleAddendum): Promise<void> {
    const sb = getSupabase();
    if (!sb) return;
    try {
      await sb.from('sipbanged_schedule_addendums').upsert({
        id: addendum.id,
        project_id: addendum.projectId,
        data: addendum
      });
    } catch (err) {
      console.warn('Supabase upsertScheduleAddendum failed:', err);
    }
  },

  // BULK SYNC FROM LOCAL TO CLOUD
  async syncAllLocalToCloud(localData: {
    users: User[];
    projects: Project[];
    planningDocs: PlanningDocument[];
    weeklyProgress: WeeklyProgress[];
    supervisionLogs: SupervisionLog[];
    maintenanceIssues: MaintenanceIssue[];
    contracts: ProjectContract[];
    spkContracts: SpkContract[];
    beritaAcara: BeritaAcara[];
    payments: PaymentTerm[];
    scheduleAddendums: ScheduleAddendum[];
  }): Promise<{ success: boolean; message: string }> {
    const sb = getSupabase();
    if (!sb) {
      return { success: false, message: 'Supabase belum terhubung.' };
    }

    try {
      // 1. Users
      if (localData.users?.length) {
        await sb.from('sipbanged_users').upsert(
          localData.users.map(u => ({
            id: u.id,
            name: u.name,
            email: u.email,
            role: u.role,
            agency: u.agency,
            nip: u.nip || null,
            phone: u.phone,
            status: u.status
          }))
        );
      }

      // 2. Projects
      if (localData.projects?.length) {
        await sb.from('sipbanged_projects').upsert(
          localData.projects.map(p => ({
            id: p.id,
            kode_paket: p.kodePaket || '',
            nama: p.nama,
            tahun_anggaran: p.tahunAnggaran || 2026,
            sumber_dana: p.sumberDana || '',
            lokasi: p.lokasi || '',
            stage: p.stage,
            data: p
          }))
        );
      }

      // 3. Contracts
      if (localData.contracts?.length) {
        await sb.from('sipbanged_contracts').upsert(
          localData.contracts.map(c => ({
            id: c.id,
            project_id: c.projectId,
            data: c
          }))
        );
      }

      // 4. SPK
      if (localData.spkContracts?.length) {
        await sb.from('sipbanged_spk_contracts').upsert(
          localData.spkContracts.map(s => ({
            id: s.id,
            project_id: s.projectId,
            spk_type: s.spkType,
            data: s
          }))
        );
      }

      // 5. Weekly Progress
      if (localData.weeklyProgress?.length) {
        await sb.from('sipbanged_weekly_progress').upsert(
          localData.weeklyProgress.map(wp => ({
            id: wp.id,
            project_id: wp.projectId,
            minggu_ke: wp.mingguKe,
            data: wp
          }))
        );
      }

      // 6. Supervision
      if (localData.supervisionLogs?.length) {
        await sb.from('sipbanged_supervision').upsert(
          localData.supervisionLogs.map(sl => ({
            id: sl.id,
            project_id: sl.projectId,
            data: sl
          }))
        );
      }

      // 7. Maintenance
      if (localData.maintenanceIssues?.length) {
        await sb.from('sipbanged_maintenance').upsert(
          localData.maintenanceIssues.map(mi => ({
            id: mi.id,
            project_id: mi.projectId,
            data: mi
          }))
        );
      }

      // 8. Berita Acara
      if (localData.beritaAcara?.length) {
        await sb.from('sipbanged_berita_acara').upsert(
          localData.beritaAcara.map(ba => ({
            id: ba.id,
            project_id: ba.projectId,
            data: ba
          }))
        );
      }

      // 9. Planning Docs
      if (localData.planningDocs?.length) {
        await sb.from('sipbanged_planning_docs').upsert(
          localData.planningDocs.map(pd => ({
            id: pd.id,
            project_id: pd.projectId,
            data: pd
          }))
        );
      }

      // 10. Payments
      if (localData.payments?.length) {
        await sb.from('sipbanged_payments').upsert(
          localData.payments.map(py => ({
            id: py.id,
            project_id: py.projectId,
            data: py
          }))
        );
      }

      // 11. Schedule Addendums
      if (localData.scheduleAddendums?.length) {
        await sb.from('sipbanged_schedule_addendums').upsert(
          localData.scheduleAddendums.map(sa => ({
            id: sa.id,
            project_id: sa.projectId,
            data: sa
          }))
        );
      }

      return { success: true, message: 'Seluruh data berhasil disinkronkan ke Supabase Cloud!' };
    } catch (err: unknown) {
      const errMsg = err instanceof Error ? err.message : String(err);
      return { success: false, message: `Sinkronisasi gagal: ${errMsg}` };
    }
  }
};
