import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { WeeklyProgress, ScheduleAddendum, ScheduleAddendumPoint, ProgressAttachment } from '../../types';
import { hasPermission } from '../../utils/permissions';
import { 
  HardHat, 
  TrendingUp, 
  Camera, 
  Plus, 
  Calendar, 
  CloudSun, 
  Users, 
  Wrench, 
  AlertCircle,
  ShieldCheck,
  ChevronRight,
  Layers,
  Edit3,
  Trash2,
  SlidersHorizontal,
  X,
  Clock,
  Sparkles,
  Info,
  CheckCircle2,
  CalendarDays,
  GitBranch,
  Eye,
  EyeOff,
  Copy,
  FileCheck2,
  FileText,
  Check,
  Paperclip,
  Download,
  FileSpreadsheet,
  Image as ImageIcon,
  File,
  UploadCloud,
  ExternalLink
} from 'lucide-react';
import { formatTanggalIndo, formatTanggalSingkat, formatRupiah } from '../../utils/formatters';
import { getProjectPackage } from '../../utils/projectPackages';
import { reportingWeekNumber } from '../../utils/reportingSchedule';
import { buildVersionPeriods, isOriginalSchedule, isReportInVersion, reportedScheduleId, scheduleEffectiveDate, scheduleForDate, scheduleTimeline, targetForPeriod, parseScheduleTransition, transitionDraft, type VersionPeriod } from '../../utils/scheduleVersions';
import { ScheduleReconciliationSummary, ScheduleVersionChart } from './ScheduleVersionChart';
import { ScheduleTransitionFields } from './ScheduleTransitionFields';

const addDays = (dateStr: string, days: number): string => {
  try {
    const d = new Date(dateStr);
    d.setUTCDate(d.getUTCDate() + days);
    return d.toISOString().split('T')[0];
  } catch {
    return dateStr;
  }
};

const getDurasiHari = (start: string, end: string): number => {
  try {
    const s = new Date(start).getTime();
    const e = new Date(end).getTime();
    const diff = Math.round((e - s) / (1000 * 60 * 60 * 24)) + 1;
    return diff > 0 ? diff : 0;
  } catch {
    return 0;
  }
};

const getWeekOrder = (weekStr: string | number): number => {
  const str = String(weekStr);
  const match = str.match(/\d+(\.\d+)?/);
  return match ? parseFloat(match[0]) : 999;
};

const formatBytes = (bytes?: number): string => {
  if (!bytes) return '0 B';
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
};

const PRESET_COLORS = [
  { label: 'Biru', value: '#3b82f6' },
  { label: 'Oranye', value: '#f59e0b' },
  { label: 'Ungu', value: '#8b5cf6' },
  { label: 'Cyan', value: '#06b6d4' },
  { label: 'Merah Muda', value: '#ec4899' },
  { label: 'Abu-abu (Baseline)', value: '#94a3b8' }
];

export const ExecutionPhase: React.FC<{ mode?: 'progress' | 'addendum' }> = ({ mode = 'progress' }) => {
  const { 
    selectedProject, 
    weeklyProgressList, 
    addWeeklyProgress, 
    updateWeeklyProgress, 
    deleteWeeklyProgress,
    scheduleAddendums,
    saveScheduleAddendum,
    deleteScheduleAddendum,
    updateProject,
    currentUser 
  } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  const [editingReportId, setEditingReportId] = useState<string | null>(null);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [activePhotoTab, setActivePhotoTab] = useState<'all' | '0%' | '25%' | '50%' | '75%' | '100%'>('all');

  // Preview Document Modal State
  const [previewFile, setPreviewFile] = useState<ProgressAttachment | null>(null);

  // Addendum Management Modal States
  const [showAddendumListModal, setShowAddendumListModal] = useState(false);
  const [addendumEditor, setAddendumEditor] = useState<'metadata' | 'curve' | 'baseline' | null>(null);
  const [editingAddendumId, setEditingAddendumId] = useState<string | null>(null);

  // Form State for Weekly Progress
  const [weekSelection, setWeekSelection] = useState('');
  const [manualTarget, setManualTarget] = useState({ cumulative: '', weight: '' });
  const [reportError, setReportError] = useState('');
  const [bobotRealisasi, setBobotRealisasi] = useState(0);
  const [kumulatifRealisasi, setKumulatifRealisasi] = useState(0);
  const [kondisiCuaca, setKondisiCuaca] = useState<WeeklyProgress['kondisiCuaca']>('Cerah Mayoritas');
  const [jumlahTenagaKerja, setJumlahTenagaKerja] = useState<number>(50);
  const [materialMasuk, setMaterialMasuk] = useState('');
  const [alatBeratDigunakan, setAlatBeratDigunakan] = useState('');
  const [kendalaLapangan, setKendalaLapangan] = useState('Nihil kendala berarti');
  const [solusiTindakan, setSolusiTindakan] = useState('Pekerjaan berlanjut sesuai target');
  const [fotoCaption, setFotoCaption] = useState('');
  const [fotoStage, setFotoStage] = useState<'0%' | '25%' | '50%' | '75%' | '100%'>('75%');
  const [updateMasterProject, setUpdateMasterProject] = useState(true);

  // State for Attachments in Form
  const [uploadedAttachments, setUploadedAttachments] = useState<ProgressAttachment[]>([]);

  // Form State for Direct Project Target & Realization Adjustment
  const [projTargetRencana, setProjTargetRencana] = useState<number>(selectedProject?.progresFisikRencana || 0);
  const [projRealisasi, setProjRealisasi] = useState<number>(selectedProject?.progresFisikRealisasi || 0);

  // Form State for Addendum Editor
  const [addNomor, setAddNomor] = useState('Addendum 02');
  const [addJudul, setAddJudul] = useState('');
  const [addTanggal, setAddTanggal] = useState(new Date().toISOString().split('T')[0]);
  const [addJenis, setAddJenis] = useState<ScheduleAddendum['jenisPerubahan']>('Perpanjangan Waktu');
  const [addNomorSurat, setAddNomorSurat] = useState('');
  const [addDurasiBaru, setAddDurasiBaru] = useState<number | undefined>(undefined);
  const [addTanggalSelesaiBaru, setAddTanggalSelesaiBaru] = useState('');
  const [addNilaiKontrakBaru, setAddNilaiKontrakBaru] = useState<number | undefined>(undefined);
  const [addAlasan, setAddAlasan] = useState('');
  const [addWarnaGaris, setAddWarnaGaris] = useState('#f59e0b');
  const [addIsAktif, setAddIsAktif] = useState(false);
  const [addTargetMingguan, setAddTargetMingguan] = useState<ScheduleAddendumPoint[]>([]);

  const [transition, setTransition] = useState(() => transitionDraft());
  const [addendumError, setAddendumError] = useState('');
  const [savingAddendum, setSavingAddendum] = useState(false);

  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  // Filter addendums for current project
  const projectAddendums = useMemo<ScheduleAddendum[]>(() => {
    const list = scheduleAddendums.filter(a => a.projectId === selectedProject.id);
    if (list.some(isOriginalSchedule)) return list;

    // Show a placeholder until the original plan is recorded.
    return [...list,
      {
        id: `add-orig-${selectedProject.id}`,
        projectId: selectedProject.id,
        nomorAddendum: 'Kontrak Awal',
        judul: 'Kurva S Kontrak Awal',
        tanggal: selectedProject.tanggalMulai,
        jenisPerubahan: 'Kontrak Awal' as const,
        nomorSurat: selectedProject.kodePaket,
        alasan: '',
        warnaGaris: '#94a3b8',
        isAktif: true,
        isKontrakAwal: true,
        targetMingguan: []
      }
    ];
  }, [scheduleAddendums, selectedProject]);

  const today = new Date().toLocaleDateString('sv-SE', { timeZone: 'Asia/Jakarta' });
  const activeAddendum = scheduleForDate(projectAddendums, today);
  const timeline = scheduleTimeline(projectAddendums);

  const projectReports = weeklyProgressList
    .filter(report => report.projectId === selectedProject.id)
    .sort((a, b) => (b.periodeSelesai || b.periodeMulai || '').localeCompare(a.periodeSelesai || a.periodeMulai || ''));

  const canSubmit = hasPermission(currentUser?.role, 'submit_progress');
  const canApprove = hasPermission(currentUser?.role, 'edit_contract');
  const physicalPackage = getProjectPackage(selectedProject, 'fisik');
  const reportingWeeks = physicalPackage.active
    ? buildVersionPeriods(projectAddendums, physicalPackage.start, physicalPackage.end)
    : [];
  const isHistoricalReport = (report: WeeklyProgress) =>
    timeline.some(entry => entry.date <= today && entry.date > (report.periodeMulai || report.periodeSelesai));
  const editingReport = projectReports.find(report => report.id === editingReportId);
  const savedPeriod = weekSelection === 'saved' ? editingReport : undefined;
  const selectedWeek = reportingWeeks.find(week => week.key === weekSelection);
  const mingguKe = savedPeriod?.mingguKe ?? selectedWeek?.number;
  const periodeMulai = savedPeriod?.periodeMulai ?? selectedWeek?.start ?? '';
  const periodeSelesai = savedPeriod?.periodeSelesai ?? selectedWeek?.end ?? '';
  const otherReports = projectReports.filter(report => report.id !== editingReportId);
  const isReported = (period: VersionPeriod, reports = otherReports) => reports.some(report =>
    report.periodeMulai && report.periodeSelesai
      ? report.periodeMulai <= period.end && period.start <= report.periodeSelesai
      : reportingWeekNumber(report.mingguKe) === period.number,
  );
  const scheduledTarget = targetForPeriod(selectedWeek);
  const lockedCumulative = savedPeriod?.kumulatifRencana ?? scheduledTarget.cumulative;
  const lockedWeight = savedPeriod?.bobotRencana ?? scheduledTarget.weight;
  const kumulatifRencana = lockedCumulative ?? manualTarget.cumulative;
  const bobotRencana = lockedWeight ?? manualTarget.weight;
  const reportReference = savedPeriod
    ? scheduleAddendums.find(addendum => addendum.id === reportedScheduleId(savedPeriod))
    : selectedWeek?.version;
  const reportReferenceName = savedPeriod?.acuanLaporan?.nama || reportReference?.nomorAddendum;

  const previousReportFor = (period: VersionPeriod, reports: WeeklyProgress[]) => reports.find(report =>
    report.periodeSelesai < period.start &&
    (period.version ? isReportInVersion(report, period.version, projectAddendums) : !reportedScheduleId(report)),
  );
  const previousActualFor = (period: VersionPeriod, reports: WeeklyProgress[]) =>
    previousReportFor(period, reports)?.kumulatifRealisasi ?? period.version?.rekonsiliasi?.realisasiSesudah ?? 0;
  const previousReport = selectedWeek ? previousReportFor(selectedWeek, otherReports) : undefined;
  const baselineKumRencana = savedPeriod
    ? Number((savedPeriod.kumulatifRencana - savedPeriod.bobotRencana).toFixed(2))
    : previousReport?.kumulatifRencana ?? selectedWeek?.version?.rekonsiliasi?.targetPeralihan ?? 0;
  const baselineKumRealisasi = savedPeriod
    ? Number((savedPeriod.kumulatifRealisasi - savedPeriod.bobotRealisasi).toFixed(2))
    : selectedWeek ? previousActualFor(selectedWeek, otherReports) : 0;
  const hasLaterReport = otherReports.some(report => report.periodeSelesai > periodeSelesai);
  const earlierReports = transition.date ? projectReports.filter(report => report.periodeSelesai && report.periodeSelesai < transition.date) : [];
  const transitionSource = earlierReports[0];

  const selectReportingWeek = (selection: string, reports: WeeklyProgress[], existing?: WeeklyProgress) => {
    setWeekSelection(selection);
    setReportError('');
    setManualTarget({ cumulative: '', weight: '' });
    const period = reportingWeeks.find(week => week.key === selection);
    if (existing && selection === 'saved') {
      setBobotRealisasi(existing.bobotRealisasi);
      setKumulatifRealisasi(existing.kumulatifRealisasi);
    } else if (period) {
      const prior = previousActualFor(period, reports);
      const samePeriod = existing && period.start === existing.periodeMulai && period.end === existing.periodeSelesai &&
        (period.version?.id ?? '') === (reportedScheduleId(existing) ?? '');
      setKumulatifRealisasi(samePeriod ? existing.kumulatifRealisasi : prior);
      setBobotRealisasi(samePeriod ? Number((existing.kumulatifRealisasi - prior).toFixed(2)) : 0);
    } else {
      setKumulatifRealisasi(0);
      setBobotRealisasi(0);
    }
  };

  const handleOpenAdd = () => {
    setEditingReportId(null);
    setUploadedAttachments([]);
    const available = reportingWeeks.filter(week => !isReported(week, projectReports));
    const next = available.find(week => week.start > (projectReports[0]?.periodeSelesai ?? '')) ?? available[0];
    selectReportingWeek(next?.key ?? '', projectReports);
    setKondisiCuaca('Cerah Mayoritas');
    setJumlahTenagaKerja(50);
    setMaterialMasuk('');
    setAlatBeratDigunakan('');
    setKendalaLapangan('Nihil kendala berarti');
    setSolusiTindakan('Pekerjaan berlanjut sesuai target master schedule');
    setFotoCaption('');
    setFotoStage('75%');
    setUpdateMasterProject(true);
    setShowModal(true);
  };

  // Open Modal for editing existing progress
  const handleOpenEdit = (report: WeeklyProgress) => {
    setEditingReportId(report.id);
    setWeekSelection('saved');
    setReportError('');
    setManualTarget({ cumulative: '', weight: '' });
    setBobotRealisasi(report.bobotRealisasi);
    setKumulatifRealisasi(report.kumulatifRealisasi);
    setKondisiCuaca(report.kondisiCuaca);
    setJumlahTenagaKerja(report.jumlahTenagaKerja);
    setMaterialMasuk(report.materialMasuk);
    setAlatBeratDigunakan(report.alatBeratDigunakan);
    setKendalaLapangan(report.kendalaLapangan);
    setSolusiTindakan(report.solusiTindakan);
    setFotoCaption(report.fotoDokumentasi?.[0]?.caption || '');
    setFotoStage(report.fotoDokumentasi?.[0]?.stage || '75%');
    setUploadedAttachments(report.lampiranDokumen ? [...report.lampiranDokumen] : []);
    setUpdateMasterProject(true);
    setShowModal(true);
  };

  // Delete handler
  const handleDelete = (id: string, weekLabel: number | string) => {
    if (!canSubmit || projectReports.some(report => report.id === id && isHistoricalReport(report))) return;
    if (window.confirm(`Hapus catatan progres Minggu ${weekLabel}? Data kurva S dan status proyek akan disesuaikan.`)) {
      deleteWeeklyProgress(id);
    }
  };

  const handleBobotRealisasiChange = (value: number) => {
    setBobotRealisasi(value);
    setKumulatifRealisasi(Number((baselineKumRealisasi + value).toFixed(2)));
  };

  const handleKumulatifRealisasiChange = (value: number) => {
    setKumulatifRealisasi(value);
    setBobotRealisasi(Number((value - baselineKumRealisasi).toFixed(2)));
  };

  // File Upload Handler (Excel, PDF, Images)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    Array.from(files).forEach((file) => {
      let tipe: ProgressAttachment['tipe'] = 'lainnya';
      let kategori: ProgressAttachment['kategori'] = 'Lainnya';

      const ext = file.name.split('.').pop()?.toLowerCase();
      if (['xlsx', 'xls', 'csv'].includes(ext || '')) {
        tipe = 'excel';
        kategori = 'Kurva S & Jadwal (Excel)';
      } else if (ext === 'pdf') {
        tipe = 'pdf';
        kategori = 'Laporan Fisik Mingguan (PDF)';
      } else if (['jpg', 'jpeg', 'png', 'webp', 'gif', 'bmp'].includes(ext || '')) {
        tipe = 'gambar';
        kategori = 'Dokumentasi Lapangan';
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const dataUrl = event.target?.result as string;

        const newAtt: ProgressAttachment = {
          id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          namaFile: file.name,
          tipe,
          ukuranBytes: file.size,
          ukuranFormatted: formatBytes(file.size),
          fileData: dataUrl,
          kategori,
          uploadDate: new Date().toISOString().split('T')[0],
          keterangan: ''
        };

        setUploadedAttachments(prev => [...prev, newAtt]);
      };

      reader.readAsDataURL(file);
    });

    e.target.value = '';
  };

  const handleRemoveAttachment = (id: string) => {
    setUploadedAttachments(prev => prev.filter(a => a.id !== id));
  };

  const handleUpdateAttachmentKategori = (id: string, kategori: ProgressAttachment['kategori']) => {
    setUploadedAttachments(prev => prev.map(a => a.id === id ? { ...a, kategori } : a));
  };

  // Download Handler for Attachments
  const handleDownloadFile = (att: ProgressAttachment) => {
    if (att.fileData) {
      const link = document.createElement('a');
      link.href = att.fileData;
      link.download = att.namaFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else if (att.fileUrl) {
      const link = document.createElement('a');
      link.href = att.fileUrl;
      link.download = att.namaFile;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      let mime = 'text/plain';
      let content = `SIPBANGED DPUPR Kabupaten Tegal\nNama Dokumen: ${att.namaFile}\nKategori: ${att.kategori}\nTanggal Upload: ${att.uploadDate}\nPaket Proyek: ${selectedProject.nama}`;
      if (att.tipe === 'excel') {
        mime = 'application/vnd.ms-excel';
        content = `Minggu,Tanggal Mulai,Tanggal Selesai,Target Kumulatif (%),Realisasi Kumulatif (%)\nM-19,2026-07-08,2026-07-14,63.0,65.0\nM-20,2026-07-15,2026-07-21,66.2,68.5`;
      }
      const blob = new Blob([content], { type: mime });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = att.namaFile;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  // Form submit handler for Weekly Progress
  const handleSaveReport = (e: React.FormEvent) => {
    e.preventDefault();

    if (!canSubmit || (editingReport && isHistoricalReport(editingReport))) return;
    if (mingguKe === undefined || !periodeMulai || !periodeSelesai) {
      setReportError('Pilih minggu dengan periode kontrak yang tersedia.');
      return;
    }
    if (selectedWeek && isReported(selectedWeek)) {
      setReportError('Laporan untuk minggu ini sudah ada. Edit laporan yang tersimpan.');
      return;
    }
    if (kumulatifRencana === '' || bobotRencana === '' ||
        !Number.isFinite(Number(kumulatifRencana)) || !Number.isFinite(Number(bobotRencana))) {
      setReportError('Lengkapi target kumulatif dan bobot minggu ini sesuai Kurva S.');
      return;
    }
    const deviasiVal = Number((kumulatifRealisasi - Number(kumulatifRencana)).toFixed(2));

    const [existingPhoto, ...otherPhotos] = editingReport?.fotoDokumentasi ?? [];
    const reportData: WeeklyProgress = {
      ...editingReport,
      id: editingReportId || `prog-${Date.now()}`,
      projectId: selectedProject.id,
      mingguKe,
      labelMinggu: savedPeriod?.labelMinggu,
      periodeMulai,
      periodeSelesai,
      bobotRencana: Number(bobotRencana),
      bobotRealisasi: Number(bobotRealisasi),
      kumulatifRencana: Number(kumulatifRencana),
      kumulatifRealisasi: Number(kumulatifRealisasi),
      deviasi: deviasiVal,
      addendumId: savedPeriod ? savedPeriod.addendumId : reportReference?.id,
      acuanLaporan: savedPeriod ? savedPeriod.acuanLaporan : reportReference && {
        id: reportReference.id, nama: reportReference.nomorAddendum, tanggalBerlaku: scheduleEffectiveDate(reportReference),
      },
      kondisiCuaca,
      jumlahTenagaKerja: Number(jumlahTenagaKerja),
      materialMasuk: materialMasuk || 'Material pasir, semen, baja tulangan sesuai spesifikasi',
      alatBeratDigunakan: alatBeratDigunakan || 'Alat standar operasional lapangan',
      kendalaLapangan,
      solusiTindakan,
      lampiranDokumen: uploadedAttachments,
      fotoDokumentasi: fotoCaption ? [{
        caption: fotoCaption,
        stage: fotoStage,
        url: existingPhoto?.url || 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        tanggal: existingPhoto?.tanggal || periodeSelesai
      }, ...otherPhotos] : otherPhotos
    };

    if (editingReportId) {
      updateWeeklyProgress(reportData);
    } else {
      addWeeklyProgress(reportData);
    }

    if (updateMasterProject && !hasLaterReport) {
      updateProject({
        ...selectedProject,
        progresFisikRencana: Number(kumulatifRencana),
        progresFisikRealisasi: Number(kumulatifRealisasi)
      });
    }

    setShowModal(false);
  };

  // Direct Project Target/Realization adjustment submit handler
  const handleSaveProjectProgress = (e: React.FormEvent) => {
    e.preventDefault();
    updateProject({
      ...selectedProject,
      progresFisikRencana: Number(projTargetRencana),
      progresFisikRealisasi: Number(projRealisasi)
    });
    setShowProjectModal(false);
  };

  const contractAddendums = projectAddendums.filter(item => !isOriginalSchedule(item));

  const loadAddendum = (add: ScheduleAddendum) => {
    setEditingAddendumId(add.id);
    setAddendumError('');
    const date = add.tanggalBerlaku || scheduleEffectiveDate(add) || '';
    setTransition({ ...(add.drafPeralihan ?? transitionDraft(date, add.rekonsiliasi)), date });
    setAddNomor(add.nomorAddendum);
    setAddJudul(add.judul);
    setAddTanggal(add.tanggal);
    setAddJenis(add.jenisPerubahan);
    setAddNomorSurat(add.nomorSurat || '');
    setAddDurasiBaru(add.durasiHariBaru);
    setAddTanggalSelesaiBaru(add.tanggalSelesaiBaru || '');
    setAddNilaiKontrakBaru(add.nilaiKontrakBaru);
    setAddAlasan(add.alasan || '');
    setAddWarnaGaris(add.warnaGaris || '#3b82f6');
    setAddIsAktif(false);
    setAddTargetMingguan(add.targetMingguan.map(point => ({ ...point })));
  };

  const handleOpenAddAddendum = () => {
    if (!canSubmit) return;
    const lastNumber = Math.max(0, ...contractAddendums.map(version => Number(version.nomorAddendum.trim().match(/^addendum\s+(\d+)$/i)?.[1] ?? 0)));
    const nextNumber = lastNumber + 1;
    loadAddendum({
      id: '', projectId: selectedProject.id, nomorAddendum: 'Addendum ' + String(nextNumber).padStart(2, '0'),
      judul: '', tanggal: today, jenisPerubahan: 'Perpanjangan Waktu', nomorSurat: '', alasan: '',
      warnaGaris: PRESET_COLORS[lastNumber % PRESET_COLORS.length].value, isAktif: false, targetMingguan: [],
    });
    setAddendumEditor('metadata');
  };

  const handleOpenMetadata = (add: ScheduleAddendum) => {
    if (!canSubmit || add.disahkanPada || scheduleEffectiveDate(add)) return;
    loadAddendum(add);
    setAddendumEditor('metadata');
  };

  const handleOpenCurve = (add?: ScheduleAddendum) => {
    if (!canSubmit) return;
    if (add) loadAddendum(add);
    else {
      setEditingAddendumId(null);
      setAddendumError('');
    }
    setAddendumEditor(add && isOriginalSchedule(add) ? 'baseline' : 'curve');
  };

  const editedAddendum = projectAddendums.find(version => version.id === editingAddendumId);
  const isOriginalEditor = addendumEditor === 'baseline';
  const isMetadataEditor = addendumEditor === 'metadata';
  const showScheduleFields = isOriginalEditor || Boolean(editedAddendum && addendumEditor === 'curve');
  const curveReadOnly = Boolean(addendumEditor === 'curve' && editedAddendum?.disahkanPada);
  const handleSaveAddendum = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || savingAddendum || editedAddendum?.disahkanPada || (addendumEditor === 'curve' && !editedAddendum)) return;
    if (isMetadataEditor) {
      const number = addNomor.trim();
      const title = addJudul.trim();
      if (!number || !title) {
        setAddendumError('Lengkapi nomor dan judul addendum.');
        return;
      }
      if (editedAddendum?.nomorAddendum.trim().toLowerCase() !== number.toLowerCase() &&
          contractAddendums.some(version => version.id !== editedAddendum?.id && version.nomorAddendum.trim().toLowerCase() === number.toLowerCase())) {
        setAddendumError('Nomor addendum sudah dipakai pada proyek ini.');
        return;
      }
      const record: ScheduleAddendum = {
        ...editedAddendum,
        id: editedAddendum?.id || crypto.randomUUID(),
        projectId: selectedProject.id,
        nomorAddendum: number,
        judul: title,
        tanggal: addTanggal,
        tanggalBerlaku: transition.date || undefined,
        jenisPerubahan: addJenis,
        nomorSurat: addNomorSurat.trim(),
        durasiHariBaru: addDurasiBaru,
        tanggalSelesaiBaru: addTanggalSelesaiBaru || undefined,
        nilaiKontrakBaru: addNilaiKontrakBaru,
        alasan: addAlasan.trim(),
        warnaGaris: addWarnaGaris,
        isAktif: false,
        targetMingguan: editedAddendum?.targetMingguan ?? [],
        drafPeralihan: transition,
        rekonsiliasi: editedAddendum?.tanggalBerlaku === transition.date ? editedAddendum?.rekonsiliasi : undefined,
      };
      await persistAddendum(record);
      return;
    }
    if (!editedAddendum || (addIsAktif && !canApprove)) return;
    setAddendumError('');
    if (editedAddendum && scheduleEffectiveDate(editedAddendum) && !addIsAktif) {
      setAddendumError('Acuan lama yang berlaku memerlukan pengesahan ulang untuk pembaruan versi.');
      return;
    }
    const reconciliation = isOriginalEditor ? undefined : parseScheduleTransition(transition, transitionSource?.kumulatifRealisasi, earlierReports);
    const positions = addTargetMingguan.map(point => reportingWeekNumber(point.mingguKe));
    if (addIsAktif && (!positions.length || positions.includes(undefined) || new Set(positions).size !== positions.length ||
        addTargetMingguan.some(point => !Number.isFinite(point.targetKumulatif) || point.targetKumulatif < 0 || point.targetKumulatif > 100))) {
      setAddendumError('Lengkapi target Kurva S dengan nomor minggu yang unik dan target antara 0% dan 100%.');
      return;
    }
    if (addIsAktif && !isOriginalEditor) {
      if (!transition.date) {
        setAddendumError('Isi tanggal mulai berlaku pada data addendum sebelum mengesahkan Kurva S.');
        return;
      }
      const latestApproved = timeline.filter(entry => entry.version.id !== editedAddendum?.id && entry.version.disahkanPada).at(-1);
      const inheritedEnd = timeline.filter(entry => entry.date <= transition.date && entry.version.id !== editedAddendum?.id && entry.version.tanggalSelesaiBaru).at(-1)?.version.tanggalSelesaiBaru || physicalPackage.end;
      if (!transition.date || !physicalPackage.start || transition.date < physicalPackage.start ||
          !(addTanggalSelesaiBaru || inheritedEnd) || transition.date > (addTanggalSelesaiBaru || inheritedEnd || '')) {
        setAddendumError('Tanggal mulai berlaku harus berada dalam masa kontrak pada versi ini.');
        return;
      }
      if (timeline.some(entry => entry.date === transition.date && entry.version.id !== editedAddendum?.id) ||
          (latestApproved && transition.date <= latestApproved.date)) {
        setAddendumError('Tanggal berlaku harus lebih baru dari versi yang sudah disahkan dan belum dipakai versi lain.');
        return;
      }
      if (!reconciliation) {
        setAddendumError('Lengkapi realisasi sebelum dan sesudah peralihan serta dasar rekonsiliasi yang disetujui.');
        return;
      }
      const startDay = new Date(transition.date + 'T00:00:00Z').getUTCDay();
      if (startDay !== 1 && transition.date !== physicalPackage.start && reconciliation.targetPeralihan === undefined) {
        setAddendumError('Isi target pada saat peralihan karena addendum berlaku di tengah minggu pelaporan.');
        return;
      }
    }

    const approvedAt = addIsAktif ? new Date().toISOString() : undefined;
    const newAddendumData: ScheduleAddendum = {
      ...editedAddendum,
      id: editedAddendum.id,
      projectId: selectedProject.id,
      nomorAddendum: isOriginalEditor ? addNomor : editedAddendum.nomorAddendum,
      judul: isOriginalEditor ? addJudul : editedAddendum.judul,
      tanggal: isOriginalEditor ? addTanggal : editedAddendum.tanggal,
      tanggalBerlaku: isOriginalEditor ? undefined : transition.date || undefined,
      disahkanPada: approvedAt,
      rekonsiliasi: reconciliation && { ...reconciliation, laporanSebelumnyaId: transitionSource?.id },
      drafPeralihan: approvedAt || isOriginalEditor ? undefined : transition,
      jenisPerubahan: isOriginalEditor ? 'Kontrak Awal' : editedAddendum.jenisPerubahan,
      nomorSurat: isOriginalEditor ? addNomorSurat : editedAddendum.nomorSurat,
      durasiHariBaru: isOriginalEditor ? addDurasiBaru : editedAddendum.durasiHariBaru,
      tanggalSelesaiBaru: isOriginalEditor ? addTanggalSelesaiBaru : editedAddendum.tanggalSelesaiBaru,
      nilaiKontrakBaru: isOriginalEditor ? addNilaiKontrakBaru : editedAddendum.nilaiKontrakBaru,
      alasan: isOriginalEditor ? addAlasan : editedAddendum.alasan,
      warnaGaris: addWarnaGaris,
      isAktif: false,
      isKontrakAwal: isOriginalEditor,
      targetMingguan: [...addTargetMingguan].sort((a, b) => getWeekOrder(a.mingguKe) - getWeekOrder(b.mingguKe)),
    };
    await persistAddendum(newAddendumData);
  };

  async function persistAddendum(version: ScheduleAddendum) {
    setSavingAddendum(true);
    try {
      if (!await saveScheduleAddendum(version)) {
        setAddendumError('Versi gagal tersimpan ke Supabase. Coba simpan kembali.');
        return;
      }
      setAddendumEditor(null);
    } finally {
      setSavingAddendum(false);
    }
  }

  const handleDeleteAddendum = async (version: ScheduleAddendum) => {
    if (!canSubmit || isOriginalSchedule(version) || scheduleEffectiveDate(version) ||
        projectReports.some(report => reportedScheduleId(report) === version.id)) return;
    if (!window.confirm('Hapus draf ' + version.nomorAddendum + '?')) return;
    if (!await deleteScheduleAddendum(version.id)) setAddendumError('Draf gagal dihapus dari Supabase.');
  };

  const handleDuplicateTarget = (sourceAddendumId: string) => {
    const src = projectAddendums.find(a => a.id === sourceAddendumId);
    if (src) {
      setAddTargetMingguan(src.targetMingguan.map(({ mingguKe, targetKumulatif, bobotTarget }) => ({ mingguKe, targetKumulatif, bobotTarget })));
    }
  };

  const handleAddTargetPoint = () => {
    const lastPoint = addTargetMingguan[addTargetMingguan.length - 1];
    const nextNum = Math.max(0, ...addTargetMingguan.map(point => reportingWeekNumber(point.mingguKe) ?? 0)) + 1;
    const lastTarget = lastPoint ? lastPoint.targetKumulatif : 0;
    const newTarget = Math.min(100, Number((lastTarget + 5).toFixed(1)));
    
    setAddTargetMingguan(prev => [
      ...prev,
      {
        mingguKe: `M-${nextNum}`,
        targetKumulatif: newTarget,
        bobotTarget: Number((newTarget - lastTarget).toFixed(1))
      }
    ]);
  };

  const handleUpdateTargetPoint = (index: number, field: keyof ScheduleAddendumPoint, value: any) => {
    setAddTargetMingguan(prev => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const handleRemoveTargetPoint = (index: number) => {
    setAddTargetMingguan(prev => prev.filter((_, idx) => idx !== index));
  };

  // Collect all photos from reports
  const allPhotos = projectReports.flatMap(r => r.fotoDokumentasi || []);
  const filteredPhotos = activePhotoTab === 'all' 
    ? allPhotos 
    : allPhotos.filter(p => p.stage === activePhotoTab);

  const currentDeviasi = Number((selectedProject.progresFisikRealisasi - selectedProject.progresFisikRencana).toFixed(2));
  const modalDeviasi = kumulatifRencana === '' ? null : Number((kumulatifRealisasi - Number(kumulatifRencana)).toFixed(2));
  const durasiMingguIni = getDurasiHari(periodeMulai, periodeSelesai);
  const reportDateLabel = (date: string) => formatTanggalIndo(/^\d{4}-\d{2}-\d{2}$/.test(date) ? date + 'T00:00:00' : date);

  return (
    <div className="space-y-6">
      
      {mode === 'addendum' ? (
        <section className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="font-semibold text-slate-900">Addendum kontrak fisik</h3>
            {canSubmit && (
              <div className="flex flex-wrap gap-2">
                <button type="button" onClick={handleOpenAddAddendum} className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
                  <Plus aria-hidden="true" className="size-4" /> Tambah addendum
                </button>
                <button type="button" onClick={() => handleOpenCurve()} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Atur Kurva S Addendum
                </button>
                <button type="button" onClick={() => setShowAddendumListModal(true)} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">
                  Kelola jadwal dan addendum
                </button>
              </div>
            )}
          </div>
          {!canSubmit && <p className="text-sm text-slate-600">Peran Anda tidak memiliki izin membuat addendum fisik.</p>}
          {contractAddendums.length === 0 ? (
            <p className="text-sm text-slate-600">Belum ada addendum fisik.</p>
          ) : (
            <ul className="divide-y divide-slate-100 text-sm">
              {contractAddendums.map(item => (
                <li key={item.id} className="space-y-1 py-2">
                  <p className="font-semibold text-slate-900">{item.nomorAddendum} · {item.judul}</p>
                  <p className="text-slate-600">{formatTanggalIndo(item.tanggal)} · {item.jenisPerubahan}{item.id === activeAddendum?.id && ' · Jadwal aktif'}</p>
                  {scheduleEffectiveDate(item) && <p className="text-slate-600">Berlaku mulai {reportDateLabel(scheduleEffectiveDate(item)!)}</p>}
                  <ScheduleReconciliationSummary version={item} />
                  {canSubmit && !item.disahkanPada && !scheduleEffectiveDate(item) && (
                    <button type="button" onClick={() => handleOpenMetadata(item)} className="text-xs font-semibold text-blue-800 hover:underline">
                      Ubah data {item.nomorAddendum}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : <>
      {/* Phase Header */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 uppercase">
              Tahap 2: Konstruksi Fisik
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Pengendalian Target, Realisasi & Addendum Kurva S
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Laporan Pelaksanaan & Kurva S Multi-Addendum
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paket: <strong className="text-slate-800">{selectedProject.nama}</strong> • Penyedia: <strong className="text-slate-800">{selectedProject.kontraktorNama}</strong>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canSubmit && (
            <button
              onClick={() => setShowAddendumListModal(true)}
              className="px-3.5 py-2 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold rounded-xl border border-blue-200 flex items-center gap-1.5 transition-all shadow-2xs"
              title="Kelola jadwal kontrak awal dan addendum perubahan kurva S"
            >
              <GitBranch className="w-4 h-4 text-blue-600" />
              Kelola Addendum ({projectAddendums.length})
            </button>
          )}

          {canSubmit && (
            <button
              onClick={() => {
                setProjTargetRencana(selectedProject.progresFisikRencana);
                setProjRealisasi(selectedProject.progresFisikRealisasi);
                setShowProjectModal(true);
              }}
              className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-300 flex items-center gap-1.5 transition-all"
              title="Atur target & realisasi fisik utama proyek secara langsung"
            >
              <SlidersHorizontal className="w-4 h-4 text-slate-600" />
              Sesuaikan Target Proyek
            </button>
          )}

          {canSubmit ? (
            <button
              onClick={handleOpenAdd}
              className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Input Progres Proyek
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
              title="Hanya Kontraktor Pelaksana / PPK yang dapat menginput laporan progres"
            >
              <HardHat className="w-3.5 h-3.5" />
              Input Progres (Khusus Kontraktor/PPK)
            </div>
          )}
        </div>
      </div>

      <ScheduleVersionChart versions={projectAddendums} active={activeAddendum} reports={projectReports} start={physicalPackage.start} end={physicalPackage.end} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        {/* Status Metrics Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Target ringkasan proyek</span>
            <div className="text-base font-extrabold text-slate-700">
              {selectedProject.progresFisikRencana}%
            </div>
            <span className="text-[10px] text-slate-400">Nilai terakhir disimpan</span>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-emerald-700 font-bold uppercase">Realisasi Fisik Proyek</span>
            <div className="text-base font-black text-emerald-700">
              {selectedProject.progresFisikRealisasi}%
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">Realisasi riil</span>
          </div>
          <div className={`p-2.5 rounded-xl text-center ${currentDeviasi >= 0 ? 'bg-teal-50' : currentDeviasi >= -5 ? 'bg-amber-50' : 'bg-rose-50'}`}>
            <span className={`text-[10px] font-bold uppercase ${currentDeviasi >= 0 ? 'text-teal-700' : currentDeviasi >= -5 ? 'text-amber-700' : 'text-rose-700'}`}>
              Deviasi Fisik
            </span>
            <div className={`text-base font-black ${currentDeviasi >= 0 ? 'text-teal-700' : currentDeviasi >= -5 ? 'text-amber-700' : 'text-rose-700'}`}>
              {currentDeviasi >= 0 ? `+${currentDeviasi}%` : `${currentDeviasi}%`}
            </div>
            <span className="text-[10px] text-slate-500">
              {currentDeviasi >= 0 ? 'Surplus progres' : 'Defisit jadwal'}
            </span>
          </div>
          <div className="bg-blue-50 p-2.5 rounded-xl text-center flex flex-col justify-center">
            <span className="text-[10px] text-blue-600 font-bold uppercase">Status Evaluasi</span>
            <div className="text-xs font-extrabold text-blue-900 mt-0.5">
              {currentDeviasi >= 0 ? 'Sesuai Jadwal (Aman)' : currentDeviasi >= -5 ? 'Perhatian (Deviasi Ringan)' : 'Kritis (Perlu SCM)'}
            </div>
            <span className="text-[10px] text-blue-600/70">DPUPR Kab. Tegal</span>
          </div>
        </div>
      </div>

      {/* Catatan Laporan Progres Mingguan (Weekly Site Reports) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4 text-amber-600" />
              <h3 className="font-bold text-sm text-slate-800">
                Catatan Laporan Progres Mingguan & Dokumen Lampiran
              </h3>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Laporan kemajuan mingguan beserta dokumen pendukung (Excel, PDF, Gambar) yang dapat dilihat dan diunduh
            </p>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-semibold bg-slate-100 px-2.5 py-1 rounded-lg">
              Total {projectReports.length} Laporan Terdaftar
            </span>
            {canSubmit && (
              <button
                onClick={handleOpenAdd}
                className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
              >
                <Plus className="w-3.5 h-3.5" />
                Tambah Minggu Baru
              </button>
            )}
          </div>
        </div>

        {projectReports.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 text-slate-400 text-xs">
            Belum ada laporan progres mingguan. Klik tombol <strong>"Input Progres Proyek"</strong> untuk mulai menambahkan laporan.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projectReports.map((report) => {
              const weekLabel = typeof report.mingguKe === 'number' || !isNaN(Number(report.mingguKe))
                ? `Minggu ke-${report.mingguKe}`
                : String(report.mingguKe);
              const durasi = getDurasiHari(report.periodeMulai, report.periodeSelesai);
              const deviasiIsPos = report.deviasi >= 0;

              return (
                <div key={report.id} className="p-4 hover:bg-slate-50/70 transition-colors space-y-3">
                  
                  {/* Top Bar of Card: Week Label, Dates, and Action Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-black bg-amber-100 text-amber-900 px-2.5 py-1 rounded-lg font-mono">
                        {weekLabel}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-semibold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200">
                        <Calendar className="w-3.5 h-3.5 text-amber-600" />
                        <span>{reportDateLabel(report.periodeMulai)} s/d {reportDateLabel(report.periodeSelesai)}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({durasi} Hari Kalender)
                      </span>
                      {(report.acuanLaporan || report.addendumId) && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {report.acuanLaporan?.nama || projectAddendums.find(a => a.id === report.addendumId)?.nomorAddendum || 'Acuan tersimpan'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {canSubmit && !isHistoricalReport(report) && (
                        <>
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(report)}
                            className="px-2.5 py-1 bg-white hover:bg-amber-50 hover:text-amber-700 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 shadow-2xs transition-colors"
                            title="Edit data laporan, tanggal, dan target/realisasi minggu ini"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-amber-600" />
                            <span>Edit Laporan & Dokumen</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(report.id, report.mingguKe)}
                            className="px-2.5 py-1 bg-white hover:bg-rose-50 hover:text-rose-700 text-slate-600 rounded-lg text-xs font-semibold flex items-center gap-1 border border-slate-200 shadow-2xs transition-colors"
                            title="Hapus laporan ini"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            <span>Hapus</span>
                          </button>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Target & Realization Summary Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60 text-xs">
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Target Rencana</span>
                      <div className="text-sm font-extrabold text-slate-800">
                        {report.kumulatifRencana}%
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        Bobot Minggu: +{report.bobotRencana}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-emerald-700 font-bold uppercase block">Realisasi Fisik</span>
                      <div className="text-sm font-black text-emerald-700">
                        {report.kumulatifRealisasi}%
                      </div>
                      <span className="text-[10px] text-emerald-600 block">
                        Bobot Minggu: +{report.bobotRealisasi}%
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Deviasi Capaian</span>
                      <div className={`text-sm font-black ${deviasiIsPos ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {deviasiIsPos ? `+${report.deviasi}%` : `${report.deviasi}%`}
                      </div>
                      <span className="text-[10px] text-slate-400 block">
                        {deviasiIsPos ? 'Sesuai / Maju' : 'Tertinggal'}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 font-bold uppercase block">Ketentuan Tanggal</span>
                      <div className="text-xs font-bold text-slate-700 truncate" title={`${report.periodeMulai} s/d ${report.periodeSelesai}`}>
                        {formatTanggalSingkat(report.periodeMulai)} - {formatTanggalSingkat(report.periodeSelesai)}
                      </div>
                      <span className="text-[10px] text-emerald-600 font-medium block">
                        Diatur Mandiri
                      </span>
                    </div>
                  </div>

                  {/* Resource Data */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 bg-white p-2 rounded-lg text-xs text-slate-600 border border-slate-100">
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                      <span>Tenaga Kerja: <strong>{report.jumlahTenagaKerja} Orang</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CloudSun className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
                      <span>Cuaca: <strong>{report.kondisiCuaca}</strong></span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Wrench className="w-3.5 h-3.5 text-teal-500 flex-shrink-0" />
                      <span className="truncate">Alat: {report.alatBeratDigunakan}</span>
                    </div>
                  </div>

                  {/* Kendala & Solusi */}
                  <div className="text-xs space-y-1 bg-slate-50/50 p-2 rounded-lg border border-slate-100">
                    <p className="text-slate-700">
                      <strong className="text-slate-900">Kendala Lapangan:</strong> {report.kendalaLapangan || 'Nihil kendala'}
                    </p>
                    <p className="text-emerald-700">
                      <strong className="text-emerald-900">Tindakan Penyedia:</strong> {report.solusiTindakan || 'Pekerjaan berjalan sesuai rencana'}
                    </p>
                  </div>

                  {/* LAMPIRAN DOKUMEN PROGRES (EXCEL, PDF, GAMBAR) */}
                  <div className="pt-2 border-t border-slate-100">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                        <Paperclip className="w-3.5 h-3.5 text-amber-600" />
                        <span>Lampiran Dokumen Progres Minggu Ini:</span>
                        <span className="text-[10px] font-semibold text-slate-400">
                          ({report.lampiranDokumen?.length || 0} File Terlampir)
                        </span>
                      </div>

                      {canSubmit && (
                        <button
                          type="button"
                          onClick={() => handleOpenEdit(report)}
                          className="text-[11px] font-bold text-amber-700 hover:text-amber-800 hover:underline flex items-center gap-0.5"
                        >
                          <Plus className="w-3 h-3" /> Upload / Tambah Dokumen
                        </button>
                      )}
                    </div>

                    {report.lampiranDokumen && report.lampiranDokumen.length > 0 ? (
                      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                        {report.lampiranDokumen.map((att) => {
                          return (
                            <div 
                              key={att.id}
                              className="p-2.5 bg-slate-50 hover:bg-white rounded-xl border border-slate-200/80 hover:border-slate-300 shadow-2xs transition-all flex items-center justify-between gap-2 group"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                                  att.tipe === 'excel' ? 'bg-emerald-100 text-emerald-800' :
                                  att.tipe === 'pdf' ? 'bg-rose-100 text-rose-800' :
                                  att.tipe === 'gambar' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
                                }`}>
                                  {att.tipe === 'excel' && <FileSpreadsheet className="w-4 h-4" />}
                                  {att.tipe === 'pdf' && <FileText className="w-4 h-4" />}
                                  {att.tipe === 'gambar' && <ImageIcon className="w-4 h-4" />}
                                  {att.tipe === 'lainnya' && <File className="w-4 h-4" />}
                                </div>
                                <div className="min-w-0">
                                  <p className="text-xs font-bold text-slate-800 truncate" title={att.namaFile}>
                                    {att.namaFile}
                                  </p>
                                  <p className="text-[10px] text-slate-400 truncate">
                                    {att.ukuranFormatted || 'Dokumen'} • {att.kategori}
                                  </p>
                                </div>
                              </div>

                              <div className="flex items-center gap-1 flex-shrink-0">
                                <button
                                  type="button"
                                  onClick={() => setPreviewFile(att)}
                                  className="px-2 py-1 bg-white hover:bg-blue-50 text-blue-700 text-[11px] font-bold rounded-lg border border-slate-200 shadow-2xs flex items-center gap-1 transition-colors"
                                  title="Lihat Dokumen"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                  <span>Lihat</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(att)}
                                  className="p-1.5 bg-white hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 rounded-lg border border-slate-200 shadow-2xs transition-colors"
                                  title="Download Dokumen"
                                >
                                  <Download className="w-3.5 h-3.5 text-emerald-600" />
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="p-3 rounded-xl bg-slate-50/60 border border-dashed border-slate-200 text-center text-xs text-slate-400">
                        Belum ada dokumen excel, pdf, atau gambar yang diunggah untuk minggu ini. Klik "Upload / Tambah Dokumen" untuk melampirkan berkas.
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Foto Dokumentasi Bertahap (0%, 25%, 50%, 75%, 100%) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Galeri Dokumentasi Foto Lapangan (0%, 25%, 50%, 75%, 100%)
              </h3>
              <p className="text-xs text-slate-400">
                Dokumentasi sudut pandang tetap untuk verifikasi pencairan termin & opname
              </p>
            </div>
          </div>

          {/* Filter Stage Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
            {(['all', '0%', '25%', '50%', '75%', '100%'] as const).map((stage) => (
              <button
                key={stage}
                onClick={() => setActivePhotoTab(stage)}
                className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                  activePhotoTab === stage
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {stage === 'all' ? 'Semua' : stage}
              </button>
            ))}
          </div>
        </div>

        {filteredPhotos.length === 0 ? (
          <div className="p-8 text-center bg-slate-50 rounded-xl text-slate-400 text-xs">
            Belum ada foto dokumentasi untuk tahapan ini.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredPhotos.map((photo, idx) => (
              <div key={idx} className="group relative rounded-xl overflow-hidden border border-slate-200 bg-slate-900 shadow-2xs">
                <img 
                  src={photo.url} 
                  alt={photo.caption}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300 opacity-90 group-hover:opacity-100"
                />
                <div className="absolute top-2 left-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/60 text-emerald-400 backdrop-blur-xs font-mono">
                    Tahap {photo.stage}
                  </span>
                </div>
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-3 text-white">
                  <p className="text-xs font-semibold leading-tight line-clamp-2">
                    {photo.caption}
                  </p>
                  <p className="text-[10px] text-slate-300 mt-1">
                    Tanggal: {photo.tanggal} • DPUPR Kab. Tegal
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      </>}

      {/* MODAL 1: Input / Edit Laporan Progres Mingguan */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-100 max-h-[92vh] overflow-y-auto">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingReportId ? 'Edit Laporan Progres Proyek & Dokumen' : 'Input Laporan Progres Proyek & Dokumen'}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Input target rencana, realisasi fisik proyek, dan upload dokumen lampiran (Excel, PDF, Gambar).
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveReport} className="space-y-4 pt-4">
              
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                  <Calendar className="size-4 text-amber-600" />
                  <span>Periode laporan mingguan</span>
                </div>

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                  <div>
                    <label htmlFor="report-week" className="mb-1 block text-xs font-semibold text-slate-700">Minggu ke</label>
                    <select
                      id="report-week"
                      required
                      value={weekSelection}
                      onChange={event => selectReportingWeek(event.target.value, otherReports, editingReport)}
                      className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold"
                    >
                      <option value="" disabled>Pilih minggu</option>
                      {editingReport && <option value="saved">Periode tersimpan ({editingReport.mingguKe})</option>}
                      {reportingWeeks.map(week => (
                        <option key={week.key} value={week.key} disabled={isReported(week)}>
                          Minggu ke-{week.number} · {reportDateLabel(week.start)}–{reportDateLabel(week.end)}{isReported(week) ? ' (sudah dilaporkan)' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label htmlFor="report-period-start" className="mb-1 block text-xs font-semibold text-slate-700">Tanggal mulai periode</label>
                    <input id="report-period-start" type="date" readOnly value={periodeMulai} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs" />
                  </div>
                  <div>
                    <label htmlFor="report-period-end" className="mb-1 block text-xs font-semibold text-slate-700">Tanggal selesai periode</label>
                    <input id="report-period-end" type="date" readOnly value={periodeSelesai} className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs" />
                  </div>
                </div>

                {reportingWeeks.length === 0 && !savedPeriod && (
                  <p className="text-xs text-rose-700">Periksa tanggal awal dan akhir kontrak fisik untuk membuat periode laporan.</p>
                )}
                {periodeMulai && periodeSelesai && (
                  <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white p-2 text-[11px] text-slate-600">
                    <span>{reportDateLabel(periodeMulai)} s/d {reportDateLabel(periodeSelesai)} ({durasiMingguIni} hari)</span>
                    {reportReferenceName && <span className="font-semibold text-blue-700">Acuan {reportReferenceName}</span>}
                  </div>
                )}
                {savedPeriod && <p className="text-xs text-slate-600">Periode dan target laporan lama dipertahankan. Pilih periode untuk memakai acuan yang berlaku pada periode itu.</p>}
                {!weekSelection && reportingWeeks.length > 0 && reportingWeeks.every(week => isReported(week)) && (
                  <p className="text-xs text-slate-600">Semua minggu kontrak sudah dilaporkan.</p>
                )}
              </div>

              {/* SECTION: Input Target & Realisasi Proyek */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>Input Target & Realisasi Progres Proyek</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Laporan sebelumnya · Rencana <strong>{baselineKumRencana}%</strong> • Realisasi <strong>{baselineKumRealisasi}%</strong>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Target Column */}
                  <div className="bg-white p-3 rounded-xl border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-1.5">
                      <span className="text-xs font-bold text-slate-700">TARGET / RENCANA PROYEK</span>
                      <span className="text-[10px] font-semibold text-slate-400">Jadwal S-Curve</span>
                    </div>

                    <div>
                      <label htmlFor="report-cumulative-target" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Target Kumulatif Proyek (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="report-cumulative-target"
                        required
                        readOnly={lockedCumulative !== undefined || !selectedWeek}
                        value={kumulatifRencana}
                        onChange={event => setManualTarget(previous => ({ ...previous, cumulative: event.target.value }))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold text-slate-800 bg-slate-50/50"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Total target s/d minggu ini
                      </span>
                    </div>

                    <div>
                      <label htmlFor="report-weekly-target" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Bobot Target Minggu Ini (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        id="report-weekly-target"
                        required
                        readOnly={lockedWeight !== undefined || !selectedWeek}
                        value={bobotRencana}
                        onChange={event => setManualTarget(previous => ({ ...previous, weight: event.target.value }))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Porsi rencana khusus minggu ini
                      </span>
                    </div>
                    {selectedWeek && (lockedCumulative === undefined || lockedWeight === undefined) && (
                      <p className="text-xs text-amber-800">Target minggu ini belum lengkap di Kurva S. Isi bagian yang kosong sesuai jadwal yang disahkan.</p>
                    )}
                  </div>

                  {/* Realisasi Column */}
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                      <span className="text-xs font-bold text-emerald-800">REALISASI FISIK PROYEK</span>
                      <span className="text-[10px] font-semibold text-emerald-600">Hasil Lapangan</span>
                    </div>

                    <div>
                      <label htmlFor="report-cumulative-actual" className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Realisasi Kumulatif Proyek (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        id="report-cumulative-actual"
                        value={kumulatifRealisasi}
                        onChange={e => handleKumulatifRealisasiChange(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg font-black text-emerald-700 bg-emerald-50/30"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Total realisasi fisik s/d minggu ini
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Bobot Realisasi Minggu Ini (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={bobotRealisasi}
                        onChange={e => handleBobotRealisasiChange(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-emerald-300 rounded-lg bg-white font-bold text-emerald-700"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Capaian fisik khusus minggu ini
                      </span>
                    </div>
                  </div>
                </div>

                {/* Deviasi Indicator Bar */}
                {modalDeviasi !== null && <div className={`p-3 rounded-xl border flex items-center justify-between ${
                  modalDeviasi >= 0 
                    ? 'bg-emerald-100/70 border-emerald-300 text-emerald-900' 
                    : modalDeviasi >= -5 
                    ? 'bg-amber-100/70 border-amber-300 text-amber-900' 
                    : 'bg-rose-100/70 border-rose-300 text-rose-900'
                }`}>
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider block">
                      Deviasi Kumulatif ({kumulatifRealisasi}% - {kumulatifRencana}%)
                    </span>
                    <span className="text-base font-black">
                      {modalDeviasi >= 0 ? `+${modalDeviasi}%` : `${modalDeviasi}%`}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] font-bold block uppercase">Kinerja Jadwal</span>
                    <span className="text-xs font-extrabold">
                      {modalDeviasi >= 0 ? '✓ Sesuai / Surplus Waktu' : modalDeviasi >= -5 ? '⚠ Deviasi Ringan (Waspada)' : '🚨 Kritis (Rekomendasi SCM)'}
                    </span>
                  </div>
                </div>}

                {hasLaterReport ? (
                  <p className="text-xs text-slate-600">Ringkasan proyek tetap memakai minggu yang lebih baru.</p>
                ) : (
                  <label className="flex cursor-pointer items-center gap-2 pt-1">
                    <input type="checkbox" checked={updateMasterProject} onChange={event => setUpdateMasterProject(event.target.checked)} className="size-4 rounded border-slate-300 text-amber-600" />
                    <span className="text-xs font-semibold text-slate-700">Perbarui ringkasan progres proyek dari laporan ini.</span>
                  </label>
                )}
              </div>

              {/* SECTION: Upload Lampiran Dokumen Progres (Excel, PDF, Gambar) */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Paperclip className="w-4 h-4 text-amber-600" />
                    <span>Upload Lampiran Dokumen Progres (Excel, PDF, Gambar)</span>
                  </div>
                  <span className="text-[11px] text-slate-500 font-semibold">
                    {uploadedAttachments.length} Dokumen Terlampir
                  </span>
                </div>

                {/* Dropzone area */}
                <label className="border-2 border-dashed border-slate-300 hover:border-amber-500 bg-white hover:bg-amber-50/20 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center group">
                  <UploadCloud className="w-8 h-8 text-slate-400 group-hover:text-amber-600 mb-1 transition-colors" />
                  <span className="text-xs font-bold text-slate-700 group-hover:text-amber-700">
                    Klik di sini untuk upload atau seret file ke area ini
                  </span>
                  <span className="text-[11px] text-slate-400 mt-0.5">
                    Mendukung file Excel (.xlsx, .xls, .csv), Dokumen PDF (.pdf), dan Foto (.jpg, .png, .webp)
                  </span>
                  <input
                    type="file"
                    multiple
                    accept=".xlsx,.xls,.csv,.pdf,.jpg,.jpeg,.png,.webp"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>

                {/* List of Uploaded Attachments */}
                {uploadedAttachments.length > 0 && (
                  <div className="space-y-2 pt-1">
                    <span className="text-[11px] font-bold text-slate-600 block">
                      Daftar Dokumen Siap Disimpan ({uploadedAttachments.length}):
                    </span>
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {uploadedAttachments.map((att) => (
                        <div key={att.id} className="p-2.5 bg-white rounded-lg border border-slate-200 flex items-center justify-between gap-2 shadow-2xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 ${
                              att.tipe === 'excel' ? 'bg-emerald-100 text-emerald-800' :
                              att.tipe === 'pdf' ? 'bg-rose-100 text-rose-800' :
                              att.tipe === 'gambar' ? 'bg-sky-100 text-sky-800' : 'bg-slate-200 text-slate-700'
                            }`}>
                              {att.tipe === 'excel' && <FileSpreadsheet className="w-3.5 h-3.5" />}
                              {att.tipe === 'pdf' && <FileText className="w-3.5 h-3.5" />}
                              {att.tipe === 'gambar' && <ImageIcon className="w-3.5 h-3.5" />}
                              {att.tipe === 'lainnya' && <File className="w-3.5 h-3.5" />}
                            </div>
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-slate-800 truncate" title={att.namaFile}>
                                {att.namaFile}
                              </p>
                              <p className="text-[10px] text-slate-400">
                                {att.ukuranFormatted} • Diupload hari ini
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <select
                              value={att.kategori}
                              onChange={e => handleUpdateAttachmentKategori(att.id, e.target.value as any)}
                              className="text-[11px] bg-slate-50 border border-slate-200 rounded-md px-2 py-1 text-slate-700 font-medium"
                            >
                              <option value="Kurva S & Jadwal (Excel)">Kurva S (Excel)</option>
                              <option value="Laporan Fisik Mingguan (PDF)">Laporan Fisik (PDF)</option>
                              <option value="Opname Bersama & BAP">Opname Bersama</option>
                              <option value="Dokumentasi Lapangan">Dokumentasi</option>
                              <option value="Hasil Uji Lab & Mutu">Uji Mutu Lab</option>
                              <option value="Lainnya">Lainnya</option>
                            </select>

                            <button
                              type="button"
                              onClick={() => setPreviewFile(att)}
                              className="p-1 text-slate-400 hover:text-blue-600 rounded transition-colors"
                              title="Lihat / Preview Dokumen"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDownloadFile(att)}
                              className="p-1 text-slate-400 hover:text-emerald-600 rounded transition-colors"
                              title="Download Dokumen"
                            >
                              <Download className="w-3.5 h-3.5" />
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveAttachment(att.id)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Hapus file lampiran"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* SECTION: Kondisi Lapangan & Sumber Daya */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kondisi Cuaca Dominan</label>
                  <select
                    value={kondisiCuaca}
                    onChange={e => setKondisiCuaca(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    <option value="Cerah Mayoritas">Cerah Mayoritas</option>
                    <option value="Hujan Ringan">Hujan Ringan</option>
                    <option value="Hujan Lebat / Banjir">Hujan Lebat / Banjir</option>
                    <option value="Bervariasi">Bervariasi</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah Tenaga Kerja (Orang)</label>
                  <input
                    type="number"
                    value={jumlahTenagaKerja}
                    onChange={e => setJumlahTenagaKerja(Number(e.target.value))}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Material Masuk & Peralatan Digunakan</label>
                <input
                  type="text"
                  value={materialMasuk}
                  onChange={e => setMaterialMasuk(e.target.value)}
                  placeholder="Misal: Ready Mix fc 25 MPa 40m3, Baja Tulangan 8 ton, Tower Crane"
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kendala Lapangan & Solusi</label>
                <textarea
                  rows={2}
                  value={kendalaLapangan}
                  onChange={e => setKendalaLapangan(e.target.value)}
                  placeholder="Kendala pelaksanaan minggu ini..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg mb-2"
                />
                <input
                  type="text"
                  value={solusiTindakan}
                  onChange={e => setSolusiTindakan(e.target.value)}
                  placeholder="Solusi / percepatan yang dilakukan..."
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              {/* SECTION: Dokumentasi Foto Opname */}
              <div className="pt-2 border-t border-slate-200">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Foto Opname Lapangan (Tahapan 0-100%)</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div className="sm:col-span-2">
                    <input
                      type="text"
                      placeholder="Keterangan foto (misal: Pengecoran Plat Lantai 3)"
                      value={fotoCaption}
                      onChange={e => setFotoCaption(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <select
                      value={fotoStage}
                      onChange={e => setFotoStage(e.target.value as any)}
                      className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                    >
                      <option value="0%">Tahap 0%</option>
                      <option value="25%">Tahap 25%</option>
                      <option value="50%">Tahap 50%</option>
                      <option value="75%">Tahap 75%</option>
                      <option value="100%">Tahap 100%</option>
                    </select>
                  </div>
                </div>
              </div>

              {reportError && <p role="alert" className="text-xs text-rose-700">{reportError}</p>}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={!mingguKe || !periodeMulai || !periodeSelesai}
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingReportId ? 'Simpan Perubahan Laporan' : 'Simpan Laporan Progres'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: Sesuaikan Target & Realisasi Proyek Langsung */}
      {showProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  Sesuaikan Target & Realisasi Proyek
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Paket: {selectedProject.nama}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowProjectModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProjectProgress} className="space-y-4 pt-4">
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-800">
                Gunakan pengaturan ini jika terdapat adendum kontrak, revisi jadwal kurva S resmi, atau penyesuaian baseline fisik oleh PPK DPUPR.
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Progres Rencana Proyek (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={projTargetRencana}
                  onChange={e => setProjTargetRencana(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Realisasi Fisik Proyek (%) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={projRealisasi}
                  onChange={e => setProjRealisasi(Number(e.target.value))}
                  className="w-full px-3 py-2 text-xs border border-emerald-300 rounded-lg font-black text-emerald-700 bg-emerald-50/20"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-600">Deviasi Baru:</span>
                <span className={`font-black text-sm ${(projRealisasi - projTargetRencana) >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {(projRealisasi - projTargetRencana) >= 0 ? `+${(projRealisasi - projTargetRencana).toFixed(2)}%` : `${(projRealisasi - projTargetRencana).toFixed(2)}%`}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowProjectModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: Kelola Daftar Addendum & Kurva S */}
      {showAddendumListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-slate-100 max-h-[92vh] flex flex-col">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 flex-shrink-0">
              <div>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900">
                      Kelola Perubahan Jadwal & Addendum Kurva S
                    </h3>
                    <p className="text-xs text-slate-500">
                      Paket: {selectedProject.nama}
                    </p>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddendumListModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="py-4 space-y-4 overflow-y-auto flex-1">
              {addendumError && !addendumEditor && <p role="alert" className="text-xs text-rose-700">{addendumError}</p>}
              <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-200/80">
                <div className="text-xs text-blue-900">
                  <p className="font-bold">Kurva S Multi-Addendum</p>
                  <p className="text-blue-700 mt-0.5">
                    Simpan Kurva S kontrak awal dan satu versi untuk setiap addendum. Versi yang sudah disahkan tersimpan di riwayat.
                  </p>
                </div>
                {canSubmit && <button
                  type="button"
                  onClick={() => handleOpenCurve()}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs flex-shrink-0 transition-colors ml-3"
                >
                  <Plus className="w-4 h-4" />
                  Pilih Addendum untuk Kurva S
                </button>}
              </div>

              {/* List of Addendums */}
              <div className="space-y-3">
                {projectAddendums.map((add) => {
                  return (
                    <div 
                      key={add.id}
                      className={`p-4 rounded-xl border transition-all ${
                        add.id === activeAddendum?.id
                          ? 'border-blue-400 bg-blue-50/20 ring-2 ring-blue-500/20' 
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span 
                              className="w-3 h-3 rounded-full flex-shrink-0" 
                              style={{ backgroundColor: add.warnaGaris }}
                              title="Warna garis pada kurva S"
                            ></span>
                            <span className="font-extrabold text-slate-900 text-sm">
                              {add.nomorAddendum}
                            </span>
                            {add.isKontrakAwal && (
                              <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md">
                                Baseline Original
                              </span>
                            )}
                            <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-700">
                              {add.id === activeAddendum?.id ? 'Acuan berlaku' : add.disahkanPada ? 'Disahkan' : scheduleEffectiveDate(add) ? 'Acuan lama' : isOriginalSchedule(add) ? 'Kontrak awal' : 'Draf atau riwayat lama'}
                            </span>
                          </div>

                          <h4 className="text-xs font-bold text-slate-800">
                            {add.judul}
                          </h4>

                          <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                            <span>Jenis: <strong>{add.jenisPerubahan}</strong></span>
                            <span>•</span>
                            <span>Tanggal: <strong>{formatTanggalIndo(add.tanggal)}</strong></span>
                            {add.nomorSurat && (
                              <>
                                <span>•</span>
                                <span>Surat: <code className="bg-slate-100 px-1 py-0.5 rounded text-[10px] font-mono">{add.nomorSurat}</code></span>
                              </>
                            )}
                            {add.durasiHariBaru && (
                              <>
                                <span>•</span>
                                <span>Durasi Baru: <strong>{add.durasiHariBaru} Hari</strong></span>
                              </>
                            )}
                          </div>

                          {scheduleEffectiveDate(add) && <p className="text-xs text-slate-600">Mulai berlaku {reportDateLabel(scheduleEffectiveDate(add)!)}</p>}
                          <ScheduleReconciliationSummary version={add} />
                          {add.alasan && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                              <strong>Latar Belakang:</strong> {add.alasan}
                            </p>
                          )}
                        </div>

                        {/* Actions for this Addendum */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-start">
                          {canSubmit && !add.disahkanPada && (canApprove || !scheduleEffectiveDate(add)) && <button
                            type="button"
                            onClick={() => handleOpenCurve(add)}
                            className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>{isOriginalSchedule(add) ? 'Isi Kurva S Awal' : 'Atur Kurva S'}</span>
                          </button>}
                          
                          {canSubmit && !isOriginalSchedule(add) && !scheduleEffectiveDate(add) && !projectReports.some(report => reportedScheduleId(report) === add.id) && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAddendum(add)}
                              className="px-2 py-1 text-xs font-semibold bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-700 border border-slate-200 rounded-lg transition-colors"
                              title="Hapus Addendum"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Target Milestones Preview */}
                      <div className="mt-3 pt-2 border-t border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                          Sampel Titik Target Mingguan ({add.targetMingguan.length} Titik):
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {add.targetMingguan.map((pt, i) => (
                            <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200/60 font-mono">
                              {pt.mingguKe}: <strong>{pt.targetKumulatif}%</strong>
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end">
              <button
                type="button"
                onClick={() => setShowAddendumListModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: Tambah / Edit Target Addendum Kurva S */}
      {addendumEditor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-slate-100 max-h-[92vh] flex flex-col">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {isMetadataEditor ? (editingAddendumId ? 'Ubah Data Addendum Fisik' : 'Buat Addendum Fisik') : isOriginalEditor ? 'Kurva S Kontrak Awal' : 'Atur Kurva S Addendum'}
                </h3>
                <p className="text-xs text-slate-500">
                  {isMetadataEditor ? 'Isi data surat dan perubahan kontrak sebagai acuan Kurva S.' : isOriginalEditor ? 'Isi target mingguan dari kontrak awal.' : 'Pilih addendum yang sudah tersimpan, lalu isi target mingguan.'}
                </p>
              </div>
              <button
                type="button"
                disabled={savingAddendum} onClick={() => setAddendumEditor(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddendum} className="py-4 space-y-4 overflow-y-auto flex-1">
              
              {addendumEditor === 'curve' && (
                <label className="grid max-w-lg gap-1 text-sm font-semibold text-slate-800">
                  Pilih nomor addendum
                  <select aria-label="Pilih nomor addendum" value={editingAddendumId ?? ''} disabled={savingAddendum}
                    onChange={event => {
                      const selected = contractAddendums.find(version => version.id === event.target.value);
                      if (selected) loadAddendum(selected);
                    }}
                    className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm">
                    <option value="" disabled>Pilih addendum</option>
                    {contractAddendums.map(version => <option key={version.id} value={version.id}>{version.nomorAddendum} · {version.judul}</option>)}
                  </select>
                  {contractAddendums.length === 0 && <span className="text-xs font-normal text-slate-600">Buat dan simpan data addendum di Kontrak dan Addendum terlebih dahulu.</span>}
                </label>
              )}

              {(isMetadataEditor || showScheduleFields) && (
              <fieldset disabled={savingAddendum || addendumEditor === 'curve'} className="min-w-0 space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <legend className="px-1 text-xs font-semibold text-slate-700">{addendumEditor === 'curve' ? 'Data dari addendum terpilih' : isOriginalEditor ? 'Data kontrak awal' : 'Data addendum'}</legend>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="addendum-nomor" className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Addendum *
                    </label>
                    <input
                      type="text"
                      required
                      id="addendum-nomor" value={addNomor}
                      onChange={e => setAddNomor(e.target.value)}
                      placeholder="Misal: Addendum 01"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="addendum-jenis" className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenis Perubahan *
                    </label>
                    <select
                      id="addendum-jenis" value={addJenis}
                      disabled={isOriginalEditor}
                      onChange={event => {
                        const kind = event.target.value as ScheduleAddendum['jenisPerubahan'];
                        setAddJenis(kind);
                        setTransition(previous => ({ ...previous, mode: kind === 'Perpanjangan Waktu' ? 'tetap' : 'hitung-ulang' }));
                      }}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
                    >
                      <option value="Perpanjangan Waktu">Perpanjangan Waktu</option>
                      <option value="Pekerjaan Tambah Kurang (CCO)">Pekerjaan Tambah Kurang (CCO)</option>
                      <option value="Waktu dan Biaya">Waktu dan Biaya</option>
                      <option value="Perubahan Desain">Perubahan Desain</option>
                      {isOriginalEditor && <option value="Kontrak Awal">Kontrak Awal</option>}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="addendum-tanggal" className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Penetapan *
                    </label>
                    <input
                      type="date"
                      required
                      id="addendum-tanggal" value={addTanggal}
                      onChange={e => setAddTanggal(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="addendum-judul" className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul / Uraian Perubahan *
                  </label>
                  <input
                    type="text"
                    required
                    id="addendum-judul" value={addJudul}
                    onChange={e => setAddJudul(e.target.value)}
                    placeholder="Contoh: Perpanjangan Waktu 14 Hari Kalender Akibat Penyesuaian Muka Air Tanah"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label htmlFor="addendum-surat" className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Surat Addendum
                    </label>
                    <input
                      type="text"
                      id="addendum-surat" value={addNomorSurat}
                      onChange={e => setAddNomorSurat(e.target.value)}
                      placeholder="600.2/ADD-01/RSUD/2026"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label htmlFor="addendum-durasi" className="block text-xs font-semibold text-slate-700 mb-1">
                      Durasi Hari Baru
                    </label>
                    <input
                      type="number"
                      id="addendum-durasi" value={addDurasiBaru || ''}
                      onChange={e => setAddDurasiBaru(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Contoh: 228"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label htmlFor="addendum-akhir" className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Selesai Baru
                    </label>
                    <input
                      type="date"
                      id="addendum-akhir" value={addTanggalSelesaiBaru}
                      onChange={e => setAddTanggalSelesaiBaru(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="addendum-alasan" className="block text-xs font-semibold text-slate-700 mb-1">
                    Latar Belakang / Dasar Perubahan
                  </label>
                  <textarea
                    rows={2}
                    id="addendum-alasan" value={addAlasan}
                    onChange={e => setAddAlasan(e.target.value)}
                    placeholder="Sebutkan Berita Acara, hasil rapat lapangan bersama, atau kondisi kompensasi..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                {!isOriginalEditor && (
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">Tanggal mulai berlaku
                      <input aria-label="Tanggal mulai berlaku addendum" type="date" value={transition.date}
                        onChange={event => setTransition(previous => ({ ...previous, date: event.target.value }))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs" />
                    </label>
                    <label className="grid gap-1 text-xs font-semibold text-slate-700">Nilai kontrak baru (Rp)
                      <input type="number" min="0" value={addNilaiKontrakBaru ?? ''}
                        onChange={event => setAddNilaiKontrakBaru(event.target.value === '' ? undefined : Number(event.target.value))}
                        className="w-full rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs" />
                    </label>
                  </div>
                )}
              </fieldset>
              )}

              {showScheduleFields && (
              <fieldset disabled={savingAddendum || curveReadOnly} className="min-w-0 space-y-4">
                {/* Color and Active Toggles */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-slate-700">Warna Garis Kurva S:</span>
                    <div className="flex items-center gap-1.5">
                      {PRESET_COLORS.map(c => (
                        <button
                          key={c.value}
                          type="button"
                          onClick={() => setAddWarnaGaris(c.value)}
                          style={{ backgroundColor: c.value }}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            addWarnaGaris === c.value ? 'scale-110 border-slate-900 shadow-xs' : 'border-white hover:scale-105'
                          }`}
                          title={c.label} aria-pressed={addWarnaGaris === c.value}
                        />
                      ))}
                    </div>
                  </div>

                  {canApprove && (
                    <label className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <input type="checkbox" checked={addIsAktif} onChange={event => setAddIsAktif(event.target.checked)} />
                      Sahkan versi Kurva S
                    </label>
                  )}
                </div>
              {!isOriginalEditor && curveReadOnly && editedAddendum && <ScheduleReconciliationSummary version={editedAddendum} />}
              {!isOriginalEditor && !curveReadOnly && (
                <ScheduleTransitionFields draft={transition} onChange={setTransition} suggested={transitionSource?.kumulatifRealisasi} earlierReports={earlierReports}
                  previousLabel={transitionSource && ('laporan sampai ' + reportDateLabel(transitionSource.periodeSelesai))} />
              )}
              {/* Target Points Editor */}
              <div className="bg-white p-4 rounded-xl border border-slate-200 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider">
                      Titik Sebaran Target Mingguan (%)
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Atur target kumulatif tiap minggu untuk membentuk garis kurva S addendum ini
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      onChange={(e) => {
                        if (e.target.value) {
                          handleDuplicateTarget(e.target.value);
                          e.target.value = '';
                        }
                      }}
                      aria-label="Salin target dari kurva lain"
                      defaultValue=""
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold"
                    >
                      <option value="" disabled>Salin dari Kurva Lain...</option>
                      {projectAddendums.filter(version => version.id !== editingAddendumId && version.targetMingguan.length > 0).map(a => (
                        <option key={a.id} value={a.id}>
                          Salin dari {a.nomorAddendum}
                        </option>
                      ))}
                    </select>

                    <button
                      type="button"
                      onClick={handleAddTargetPoint}
                      className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      Tambah Minggu
                    </button>
                  </div>
                </div>

                {/* Table of Points */}
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto overflow-x-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-200 min-w-[320px]">
                    <thead className="bg-slate-50 text-slate-600 font-bold">
                      <tr>
                        <th className="px-3 py-2">Minggu</th>
                        <th className="px-3 py-2">Target Kumulatif (%)</th>
                        <th className="px-3 py-2">Bobot (%)</th>
                        <th className="px-3 py-2 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 bg-white">
                      {addTargetMingguan.map((pt, index) => (
                        <tr key={index} className="hover:bg-slate-50/60">
                          <td className="px-3 py-1.5 font-bold">
                            <input
                              type="text"
                              value={pt.mingguKe}
                              onChange={e => handleUpdateTargetPoint(index, 'mingguKe', e.target.value)}
                              className="w-24 px-2 py-1 text-xs border border-slate-200 rounded font-bold font-mono"
                            />
                          </td>
                          <td className="px-3 py-1.5">
                            <div className="flex items-center gap-1">
                              <input
                                type="number"
                                step="0.1"
                                value={pt.targetKumulatif}
                                onChange={e => handleUpdateTargetPoint(index, 'targetKumulatif', Number(e.target.value))}
                                className="w-24 px-2 py-1 text-xs border border-slate-200 rounded font-bold text-blue-700 bg-blue-50/20"
                              />
                              <span className="text-slate-400 font-semibold">%</span>
                            </div>
                          </td>
                          <td className="px-3 py-1.5">
                            <input
                              type="number"
                              step="0.1"
                              value={pt.bobotTarget ?? ''}
                              onChange={e => handleUpdateTargetPoint(index, 'bobotTarget', e.target.value ? Number(e.target.value) : undefined)}
                              placeholder="Otomatis"
                              className="w-20 px-2 py-1 text-xs border border-slate-200 rounded text-slate-600"
                            />
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            <button
                              type="button"
                              onClick={() => handleRemoveTargetPoint(index)}
                              className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                              title="Hapus baris"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              </fieldset>
              )}
              {addendumError && <p role="alert" className="text-sm text-rose-700">{addendumError}</p>}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  disabled={savingAddendum} onClick={() => setAddendumEditor(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  {curveReadOnly ? 'Tutup' : 'Batal'}
                </button>
                {!curveReadOnly && <button
                  type="submit"
                  disabled={savingAddendum || (addendumEditor === 'curve' && !editedAddendum)}
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {savingAddendum ? 'Menyimpan...' : isMetadataEditor ? 'Simpan data addendum' : addIsAktif ? 'Simpan dan sahkan versi' : 'Simpan draf Kurva S'}
                </button>}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 5: Preview & Download Dokumen Lampiran */}
      {previewFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden border border-slate-200">
            
            {/* Modal Header */}
            <div className="px-6 py-3.5 bg-slate-900 text-white flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                  previewFile.tipe === 'excel' ? 'bg-emerald-600' :
                  previewFile.tipe === 'pdf' ? 'bg-rose-600' :
                  previewFile.tipe === 'gambar' ? 'bg-sky-600' : 'bg-slate-700'
                }`}>
                  {previewFile.tipe === 'excel' && <FileSpreadsheet className="w-4 h-4 text-white" />}
                  {previewFile.tipe === 'pdf' && <FileText className="w-4 h-4 text-white" />}
                  {previewFile.tipe === 'gambar' && <ImageIcon className="w-4 h-4 text-white" />}
                  {previewFile.tipe === 'lainnya' && <File className="w-4 h-4 text-white" />}
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-sm text-white truncate max-w-md">
                    {previewFile.namaFile}
                  </h4>
                  <p className="text-[11px] text-slate-300">
                    {previewFile.kategori} • {previewFile.ukuranFormatted} • Upload: {previewFile.uploadDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDownloadFile(previewFile)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Dokumen</span>
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto flex-1 bg-slate-50 flex items-center justify-center">
              {previewFile.tipe === 'gambar' && (
                <div className="text-center space-y-2 max-w-full">
                  <img 
                    src={previewFile.fileData || previewFile.fileUrl} 
                    alt={previewFile.namaFile} 
                    className="max-h-[68vh] w-auto mx-auto rounded-xl shadow-md border border-slate-200 object-contain"
                  />
                  {previewFile.keterangan && (
                    <p className="text-xs text-slate-600 font-medium">{previewFile.keterangan}</p>
                  )}
                </div>
              )}

              {previewFile.tipe === 'pdf' && (
                previewFile.fileData ? (
                  <iframe 
                    src={previewFile.fileData} 
                    title={previewFile.namaFile}
                    className="w-full h-[68vh] rounded-xl border border-slate-200 bg-white"
                  />
                ) : (
                  <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 max-w-md w-full space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-600 mx-auto flex items-center justify-center">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h5 className="font-extrabold text-base text-slate-800">{previewFile.namaFile}</h5>
                      <p className="text-xs text-slate-500 mt-1">Dokumen Laporan Fisik Mingguan (PDF Resmi)</p>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1 text-left border border-slate-100">
                      <p><strong>Ukuran File:</strong> {previewFile.ukuranFormatted}</p>
                      <p><strong>Kategori:</strong> {previewFile.kategori}</p>
                      <p><strong>Tanggal Upload:</strong> {formatTanggalIndo(previewFile.uploadDate)}</p>
                      {previewFile.keterangan && <p><strong>Keterangan:</strong> {previewFile.keterangan}</p>}
                    </div>
                    <button
                      onClick={() => handleDownloadFile(previewFile)}
                      className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Unduh / Buka Dokumen PDF
                    </button>
                  </div>
                )
              )}

              {previewFile.tipe === 'excel' && (
                <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 max-w-lg w-full space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                    <FileSpreadsheet className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-base text-slate-800">{previewFile.namaFile}</h5>
                    <p className="text-xs text-slate-500 mt-1">Spreadsheet Excel Backup Data & Kurva S Lapangan</p>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1.5 text-left border border-slate-100">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Tipe Dokumen:</span>
                      <span className="font-bold text-emerald-700">Microsoft Excel (.xlsx / .xls)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Ukuran:</span>
                      <span className="font-bold text-slate-700">{previewFile.ukuranFormatted}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Kategori:</span>
                      <span className="font-bold text-slate-700">{previewFile.kategori}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Waktu Upload:</span>
                      <span className="font-bold text-slate-700">{formatTanggalIndo(previewFile.uploadDate)}</span>
                    </div>
                    {previewFile.keterangan && (
                      <div className="pt-1 border-t border-slate-200">
                        <span className="text-slate-400 block mb-0.5">Catatan:</span>
                        <span className="font-medium text-slate-800">{previewFile.keterangan}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleDownloadFile(previewFile)}
                    className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download & Buka File Excel
                  </button>
                </div>
              )}

              {previewFile.tipe === 'lainnya' && (
                <div className="text-center p-8 bg-white rounded-2xl border border-slate-200 max-w-md w-full space-y-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-100 text-slate-600 mx-auto flex items-center justify-center">
                    <File className="w-8 h-8" />
                  </div>
                  <div>
                    <h5 className="font-extrabold text-base text-slate-800">{previewFile.namaFile}</h5>
                    <p className="text-xs text-slate-500 mt-1">{previewFile.kategori}</p>
                  </div>
                  <button
                    onClick={() => handleDownloadFile(previewFile)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-sm transition-colors"
                  >
                    <Download className="w-4 h-4" />
                    Download Dokumen
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
