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
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { formatTanggalIndo, formatTanggalSingkat, formatRentangTanggal, formatRupiah } from '../../utils/formatters';

const addDays = (dateStr: string, days: number): string => {
  try {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
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

export const ExecutionPhase: React.FC = () => {
  const { 
    selectedProject, 
    weeklyProgressList, 
    addWeeklyProgress, 
    updateWeeklyProgress, 
    deleteWeeklyProgress,
    scheduleAddendums,
    addScheduleAddendum,
    updateScheduleAddendum,
    deleteScheduleAddendum,
    setActiveScheduleAddendum,
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
  const [showAddendumEditModal, setShowAddendumEditModal] = useState(false);
  const [editingAddendumId, setEditingAddendumId] = useState<string | null>(null);

  // Form State for Weekly Progress
  const [mingguKe, setMingguKe] = useState<string>('21');
  const [periodeMulai, setPeriodeMulai] = useState('2026-07-22');
  const [periodeSelesai, setPeriodeSelesai] = useState('2026-07-28');
  const [bobotRencana, setBobotRencana] = useState<number>(3.5);
  const [bobotRealisasi, setBobotRealisasi] = useState<number>(3.8);
  const [kumulatifRencana, setKumulatifRencana] = useState<number>(69.7);
  const [kumulatifRealisasi, setKumulatifRealisasi] = useState<number>(72.3);
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

  // Toggles for visible curves in chart: [curveId: boolean]
  const [visibleCurves, setVisibleCurves] = useState<Record<string, boolean>>({
    realisasi: true
  });

  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  // Filter addendums for current project
  const projectAddendums = useMemo(() => {
    const list = scheduleAddendums.filter(a => a.projectId === selectedProject.id);
    if (list.length > 0) return list;

    // Fallback baseline if empty
    return [
      {
        id: `add-orig-${selectedProject.id}`,
        projectId: selectedProject.id,
        nomorAddendum: 'Kontrak Awal',
        judul: 'Kurva S Rencana Pelaksanaan Original (Baseline Master)',
        tanggal: selectedProject.tanggalMulai,
        jenisPerubahan: 'Kontrak Awal' as const,
        nomorSurat: selectedProject.kodePaket,
        alasan: 'Jadwal rencana pelaksanaan kontrak awal sesuai surat perjanjian lelang.',
        warnaGaris: '#94a3b8',
        isAktif: true,
        isKontrakAwal: true,
        targetMingguan: [
          { mingguKe: 'M-1', targetKumulatif: 2.0, bobotTarget: 2.0 },
          { mingguKe: 'M-4', targetKumulatif: 10.0, bobotTarget: 8.0 },
          { mingguKe: 'M-8', targetKumulatif: 25.0, bobotTarget: 15.0 },
          { mingguKe: 'M-12', targetKumulatif: 42.0, bobotTarget: 17.0 },
          { mingguKe: 'M-16', targetKumulatif: 56.0, bobotTarget: 14.0 },
          { mingguKe: 'M-20', targetKumulatif: 68.0, bobotTarget: 12.0 },
          { mingguKe: 'M-24', targetKumulatif: 82.0, bobotTarget: 14.0 },
          { mingguKe: 'M-28', targetKumulatif: 94.0, bobotTarget: 12.0 },
          { mingguKe: 'M-30', targetKumulatif: 100.0, bobotTarget: 6.0 },
        ]
      }
    ];
  }, [scheduleAddendums, selectedProject]);

  const activeAddendum = projectAddendums.find(a => a.isAktif) || projectAddendums[0];
  const kontrakAwalAddendum = projectAddendums.find(a => a.isKontrakAwal) || projectAddendums[0];

  // Helper check curve visibility
  const isCurveVisible = (id: string): boolean => {
    if (visibleCurves[id] === undefined) return true;
    return visibleCurves[id];
  };

  const toggleCurve = (id: string) => {
    setVisibleCurves(prev => ({
      ...prev,
      [id]: !isCurveVisible(id)
    }));
  };

  // Filter and sort reports for the selected project
  const projectReports = weeklyProgressList
    .filter(w => w.projectId === selectedProject.id)
    .sort((a, b) => {
      const numA = typeof a.mingguKe === 'number' ? a.mingguKe : (parseFloat(String(a.mingguKe).replace(/[^\d.-]/g, '')) || 0);
      const numB = typeof b.mingguKe === 'number' ? b.mingguKe : (parseFloat(String(b.mingguKe).replace(/[^\d.-]/g, '')) || 0);
      if (numB !== numA) return numB - numA;
      return new Date(b.periodeMulai).getTime() - new Date(a.periodeMulai).getTime();
    });

  const canSubmit = hasPermission(currentUser?.role, 'submit_progress');

  // Baseline previous cumulative progress for new entry
  const lastReport = projectReports[0];
  const baselineKumRencana = lastReport ? lastReport.kumulatifRencana : selectedProject.progresFisikRencana;
  const baselineKumRealisasi = lastReport ? lastReport.kumulatifRealisasi : selectedProject.progresFisikRealisasi;

  // Open Modal for adding new progress
  const handleOpenAdd = () => {
    setEditingReportId(null);
    setUploadedAttachments([]);
    let nextWeekStr = '1';
    let nextStart = selectedProject.tanggalMulai || '2026-07-22';
    let nextEnd = '2026-07-28';
    let prevKumR = selectedProject.progresFisikRencana || 0;
    let prevKumReal = selectedProject.progresFisikRealisasi || 0;

    if (lastReport) {
      prevKumR = lastReport.kumulatifRencana;
      prevKumReal = lastReport.kumulatifRealisasi;
      const parsedNum = parseFloat(String(lastReport.mingguKe).replace(/[^\d.-]/g, ''));
      if (!isNaN(parsedNum)) {
        nextWeekStr = String(Math.floor(parsedNum) + 1);
      } else {
        nextWeekStr = `${lastReport.mingguKe} +1`;
      }
      if (lastReport.periodeSelesai) {
        nextStart = addDays(lastReport.periodeSelesai, 1);
        nextEnd = addDays(nextStart, 6);
      }
    } else {
      nextWeekStr = '1';
      nextEnd = addDays(nextStart, 6);
    }

    const defaultBobotR = 3.5;
    const defaultBobotReal = 3.8;

    setMingguKe(nextWeekStr);
    setPeriodeMulai(nextStart);
    setPeriodeSelesai(nextEnd);
    setBobotRencana(defaultBobotR);
    setBobotRealisasi(defaultBobotReal);
    setKumulatifRencana(Number((prevKumR + defaultBobotR).toFixed(2)));
    setKumulatifRealisasi(Number((prevKumReal + defaultBobotReal).toFixed(2)));
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
    setMingguKe(String(report.mingguKe));
    setPeriodeMulai(report.periodeMulai);
    setPeriodeSelesai(report.periodeSelesai);
    setBobotRencana(report.bobotRencana);
    setBobotRealisasi(report.bobotRealisasi);
    setKumulatifRencana(report.kumulatifRencana);
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
    if (window.confirm(`Hapus catatan progres Minggu ${weekLabel}? Data kurva S dan status proyek akan disesuaikan.`)) {
      deleteWeeklyProgress(id);
    }
  };

  // Interactive Target / Realization Handlers
  const handleBobotRencanaChange = (val: number) => {
    setBobotRencana(val);
    const prev = editingReportId ? (kumulatifRencana - bobotRencana) : baselineKumRencana;
    setKumulatifRencana(Number((prev + val).toFixed(2)));
  };

  const handleKumulatifRencanaChange = (val: number) => {
    setKumulatifRencana(val);
    const prev = editingReportId ? (kumulatifRencana - bobotRencana) : baselineKumRencana;
    setBobotRencana(Number((val - prev).toFixed(2)));
  };

  const handleBobotRealisasiChange = (val: number) => {
    setBobotRealisasi(val);
    const prev = editingReportId ? (kumulatifRealisasi - bobotRealisasi) : baselineKumRealisasi;
    setKumulatifRealisasi(Number((prev + val).toFixed(2)));
  };

  const handleKumulatifRealisasiChange = (val: number) => {
    setKumulatifRealisasi(val);
    const prev = editingReportId ? (kumulatifRealisasi - bobotRealisasi) : baselineKumRealisasi;
    setBobotRealisasi(Number((val - prev).toFixed(2)));
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

    const deviasiVal = Number((kumulatifRealisasi - kumulatifRencana).toFixed(2));

    const reportData: WeeklyProgress = {
      id: editingReportId || `prog-${Date.now()}`,
      projectId: selectedProject.id,
      mingguKe: mingguKe.trim(),
      periodeMulai,
      periodeSelesai,
      bobotRencana: Number(bobotRencana),
      bobotRealisasi: Number(bobotRealisasi),
      kumulatifRencana: Number(kumulatifRencana),
      kumulatifRealisasi: Number(kumulatifRealisasi),
      deviasi: deviasiVal,
      addendumId: activeAddendum?.id,
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
        url: 'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f7?auto=format&fit=crop&w=600&q=80',
        tanggal: periodeSelesai
      }] : []
    };

    if (editingReportId) {
      updateWeeklyProgress(reportData);
    } else {
      addWeeklyProgress(reportData);
    }

    if (updateMasterProject) {
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

  // --- ADDENDUM HANDLERS ---
  const handleOpenAddAddendum = () => {
    setEditingAddendumId(null);
    const addCount = projectAddendums.filter(a => !a.isKontrakAwal).length;
    setAddNomor(`Addendum 0${addCount + 1}`);
    setAddJudul('');
    setAddTanggal(new Date().toISOString().split('T')[0]);
    setAddJenis('Perpanjangan Waktu');
    setAddNomorSurat(`600.2/ADD-0${addCount + 1}/${selectedProject.kodePaket}/2026`);
    setAddDurasiBaru(selectedProject.durasiHari + 14);
    setAddTanggalSelesaiBaru(addDays(selectedProject.tanggalSelesai, 14));
    setAddNilaiKontrakBaru(selectedProject.nilaiKontrak);
    setAddAlasan('');
    setAddWarnaGaris(PRESET_COLORS[addCount % PRESET_COLORS.length].value);
    setAddIsAktif(true);

    const sourceAdd = activeAddendum || kontrakAwalAddendum;
    if (sourceAdd && sourceAdd.targetMingguan.length > 0) {
      setAddTargetMingguan([...sourceAdd.targetMingguan]);
    } else {
      setAddTargetMingguan([
        { mingguKe: 'M-1', targetKumulatif: 2.0, bobotTarget: 2.0 },
        { mingguKe: 'M-4', targetKumulatif: 10.0, bobotTarget: 8.0 },
        { mingguKe: 'M-8', targetKumulatif: 25.0, bobotTarget: 15.0 },
        { mingguKe: 'M-12', targetKumulatif: 40.0, bobotTarget: 15.0 },
        { mingguKe: 'M-16', targetKumulatif: 55.0, bobotTarget: 15.0 },
        { mingguKe: 'M-20', targetKumulatif: 68.0, bobotTarget: 13.0 },
        { mingguKe: 'M-24', targetKumulatif: 80.0, bobotTarget: 12.0 },
        { mingguKe: 'M-28', targetKumulatif: 92.0, bobotTarget: 12.0 },
        { mingguKe: 'M-32', targetKumulatif: 100.0, bobotTarget: 8.0 },
      ]);
    }

    setShowAddendumEditModal(true);
  };

  const handleOpenEditAddendum = (add: ScheduleAddendum) => {
    setEditingAddendumId(add.id);
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
    setAddIsAktif(add.isAktif);
    setAddTargetMingguan([...add.targetMingguan]);
    setShowAddendumEditModal(true);
  };

  const handleSaveAddendum = (e: React.FormEvent) => {
    e.preventDefault();

    const isOriginal = editingAddendumId ? projectAddendums.find(a => a.id === editingAddendumId)?.isKontrakAwal : false;

    const newAddendumData: ScheduleAddendum = {
      id: editingAddendumId || `add-${Date.now()}`,
      projectId: selectedProject.id,
      nomorAddendum: addNomor,
      judul: addJudul || (isOriginal ? 'Kurva S Kontrak Awal' : `Perubahan Jadwal Pelaksanaan (${addNomor})`),
      tanggal: addTanggal,
      jenisPerubahan: addJenis,
      nomorSurat: addNomorSurat,
      durasiHariBaru: addDurasiBaru,
      tanggalSelesaiBaru: addTanggalSelesaiBaru,
      nilaiKontrakBaru: addNilaiKontrakBaru,
      alasan: addAlasan,
      warnaGaris: addWarnaGaris,
      isAktif: addIsAktif,
      isKontrakAwal: Boolean(isOriginal),
      targetMingguan: addTargetMingguan.sort((a, b) => getWeekOrder(a.mingguKe) - getWeekOrder(b.mingguKe))
    };

    if (editingAddendumId) {
      updateScheduleAddendum(newAddendumData);
    } else {
      addScheduleAddendum(newAddendumData);
    }

    setVisibleCurves(prev => ({
      ...prev,
      [newAddendumData.id]: true
    }));

    setShowAddendumEditModal(false);
  };

  const handleDeleteAddendum = (id: string, nomor: string) => {
    if (window.confirm(`Hapus ${nomor}? Seluruh kurva S addendum ini akan dihapus dari grafik.`)) {
      deleteScheduleAddendum(id);
    }
  };

  const handleDuplicateTarget = (sourceAddendumId: string) => {
    const src = projectAddendums.find(a => a.id === sourceAddendumId);
    if (src) {
      setAddTargetMingguan([...src.targetMingguan]);
    }
  };

  const handleAddTargetPoint = () => {
    const lastPoint = addTargetMingguan[addTargetMingguan.length - 1];
    const lastNum = lastPoint ? getWeekOrder(lastPoint.mingguKe) : 0;
    const nextNum = Math.floor(lastNum) + 1;
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

  // --- UNIFIED KURVA S MULTI-LINE DATA BUILDER ---
  const chartData = useMemo(() => {
    const weekMap = new Map<string, {
      minggu: string;
      order: number;
      tanggal?: string;
      realisasi: number | null;
      [key: string]: any;
    }>();

    // From weekly progress reports (actual)
    projectReports.forEach(r => {
      const key = typeof r.mingguKe === 'number' || !isNaN(Number(r.mingguKe))
        ? `M-${r.mingguKe}`
        : String(r.mingguKe);
      const order = getWeekOrder(key);
      const dateRange = formatRentangTanggal(r.periodeMulai, r.periodeSelesai);

      weekMap.set(key, {
        minggu: key,
        order,
        tanggal: dateRange,
        realisasi: r.kumulatifRealisasi
      });
    });

    // From all project addendums (Kontrak Awal, Addendum 1, Addendum 2, etc.)
    projectAddendums.forEach(add => {
      add.targetMingguan.forEach(pt => {
        const key = String(pt.mingguKe);
        const order = getWeekOrder(key);
        if (!weekMap.has(key)) {
          weekMap.set(key, {
            minggu: key,
            order,
            tanggal: pt.tanggalMulai ? formatRentangTanggal(pt.tanggalMulai, pt.tanggalSelesai || '') : undefined,
            realisasi: null
          });
        }
      });
    });

    // Sort weeks by numeric order
    const sortedWeeks = Array.from(weekMap.values()).sort((a, b) => a.order - b.order);

    // Populate target values for each addendum
    return sortedWeeks.map(row => {
      const result: any = {
        minggu: row.minggu,
        order: row.order,
        tanggal: row.tanggal || 'Sesuai Jadwal',
        realisasi: row.realisasi
      };

      projectAddendums.forEach(add => {
        const pt = add.targetMingguan.find(p => 
          String(p.mingguKe).toLowerCase() === row.minggu.toLowerCase() ||
          getWeekOrder(p.mingguKe) === row.order
        );
        result[`target_${add.id}`] = pt !== undefined ? pt.targetKumulatif : null;
      });

      return result;
    });
  }, [projectReports, projectAddendums]);

  // Collect all photos from reports
  const allPhotos = projectReports.flatMap(r => r.fotoDokumentasi || []);
  const filteredPhotos = activePhotoTab === 'all' 
    ? allPhotos 
    : allPhotos.filter(p => p.stage === activePhotoTab);

  const currentDeviasi = Number((selectedProject.progresFisikRealisasi - selectedProject.progresFisikRencana).toFixed(2));
  const modalDeviasi = Number((kumulatifRealisasi - kumulatifRencana).toFixed(2));
  const durasiMingguIni = getDurasiHari(periodeMulai, periodeSelesai);

  return (
    <div className="space-y-6">
      
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

      {/* Kurva S (S-Curve) Multi-Line Chart with Addendums */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        
        {/* Top Header of Chart */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-600" />
              <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
                Kurva S (Kontrak Awal, Addendum Perubahan, & Realisasi Riil)
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              Menampilkan kurva S lama (kontrak awal) dan kurva addendum-addendum perubahan secara simultan
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-500">Jadwal Acuan Aktif:</span>
            <span className="px-2.5 py-1 text-xs font-bold bg-blue-100 text-blue-800 rounded-lg border border-blue-200 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
              {activeAddendum ? activeAddendum.nomorAddendum : 'Kontrak Awal'}
            </span>
          </div>
        </div>

        {/* Kurva S Filter Bar / Toggle Pills */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 flex flex-wrap items-center justify-between gap-2 mb-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-slate-600 flex items-center gap-1 mr-1">
              <Eye className="w-3.5 h-3.5 text-slate-500" />
              Filter Garis:
            </span>

            {/* Toggle Realisasi Fisik Lapangan */}
            <button
              onClick={() => toggleCurve('realisasi')}
              className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border ${
                isCurveVisible('realisasi')
                  ? 'bg-emerald-600 text-white border-emerald-700 shadow-2xs'
                  : 'bg-white text-slate-400 border-slate-300 hover:text-slate-700'
              }`}
            >
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-300"></span>
              <span>Realisasi Fisik Riil</span>
              {isCurveVisible('realisasi') ? <Check className="w-3 h-3 ml-0.5" /> : <EyeOff className="w-3 h-3 ml-0.5 text-slate-400" />}
            </button>

            {/* Toggle Each Addendum / Kontrak Awal */}
            {projectAddendums.map(add => {
              const activeVisible = isCurveVisible(add.id);
              return (
                <button
                  key={add.id}
                  onClick={() => toggleCurve(add.id)}
                  style={{
                    borderColor: activeVisible ? add.warnaGaris : undefined,
                    backgroundColor: activeVisible ? `${add.warnaGaris}15` : '#ffffff',
                    color: activeVisible ? add.warnaGaris : '#94a3b8'
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all border shadow-2xs`}
                >
                  <span 
                    className="w-2.5 h-2.5 rounded-full" 
                    style={{ backgroundColor: add.warnaGaris }}
                  ></span>
                  <span>{add.nomorAddendum} {add.isKontrakAwal ? '(Baseline)' : add.isAktif ? '(Aktif)' : ''}</span>
                  {activeVisible ? <Check className="w-3 h-3 ml-0.5" /> : <EyeOff className="w-3 h-3 ml-0.5" />}
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const allOn: Record<string, boolean> = { realisasi: true };
                projectAddendums.forEach(a => { allOn[a.id] = true; });
                setVisibleCurves(allOn);
              }}
              className="text-[11px] font-semibold text-slate-600 hover:text-slate-900 px-2 py-0.5 rounded hover:bg-slate-200/60 transition-colors"
            >
              Tampilkan Semua
            </button>
            <button
              onClick={() => setShowAddendumListModal(true)}
              className="text-[11px] font-bold text-blue-700 hover:text-blue-800 bg-blue-100/60 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
            >
              <Plus className="w-3 h-3" /> Tambah Addendum
            </button>
          </div>
        </div>

        {/* Recharts Multi-Line View */}
        <div className="h-80 w-full pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="minggu" tick={{ fontSize: 11 }} />
              <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 11 }} />
              
              <Tooltip 
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3.5 rounded-xl shadow-xl border border-slate-200 text-xs space-y-2 min-w-[220px]">
                        <div className="border-b border-slate-100 pb-1">
                          <p className="font-extrabold text-slate-800 text-sm">{data.minggu}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Calendar className="w-3 h-3 text-amber-600" />
                            <span>Periode: <strong>{data.tanggal}</strong></span>
                          </p>
                        </div>

                        {/* Curves list */}
                        <div className="space-y-1">
                          {projectAddendums.map(add => {
                            const val = data[`target_${add.id}`];
                            if (val === undefined || val === null) return null;
                            return (
                              <div key={add.id} className="flex items-center justify-between gap-3 text-slate-600">
                                <span className="flex items-center gap-1.5 truncate">
                                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: add.warnaGaris }}></span>
                                  <span>{add.nomorAddendum}{add.isAktif ? ' (Aktif)' : ''}:</span>
                                </span>
                                <strong className="font-mono text-slate-800">{val}%</strong>
                              </div>
                            );
                          })}

                          {/* Realisasi Lapangan */}
                          <div className="flex items-center justify-between gap-3 text-emerald-700 pt-1 border-t border-slate-100">
                            <span className="flex items-center gap-1.5 font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                              <span>Realisasi Fisik:</span>
                            </span>
                            <strong className="font-mono text-emerald-700 font-black">
                              {data.realisasi !== null ? `${data.realisasi}%` : '-'}
                            </strong>
                          </div>

                          {/* Deviasi against Active Addendum */}
                          {data.realisasi !== null && activeAddendum && data[`target_${activeAddendum.id}`] !== null && (
                            <div className="pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] font-bold">
                              <span className="text-slate-500">Deviasi thd {activeAddendum.nomorAddendum}:</span>
                              <span className={(data.realisasi - data[`target_${activeAddendum.id}`]) >= 0 ? 'text-emerald-600' : 'text-rose-600'}>
                                {(data.realisasi - data[`target_${activeAddendum.id}`]) >= 0 ? '+' : ''}
                                {(data.realisasi - data[`target_${activeAddendum.id}`]).toFixed(2)}%
                              </span>
                            </div>
                          )}

                          {/* Deviasi against Kontrak Awal (if active differs from original) */}
                          {data.realisasi !== null && kontrakAwalAddendum && kontrakAwalAddendum.id !== activeAddendum?.id && data[`target_${kontrakAwalAddendum.id}`] !== null && (
                            <div className="flex items-center justify-between text-[10px] text-slate-400">
                              <span>Deviasi thd Kontrak Awal:</span>
                              <span className={(data.realisasi - data[`target_${kontrakAwalAddendum.id}`]) >= 0 ? 'text-slate-600 font-semibold' : 'text-rose-500 font-semibold'}>
                                {(data.realisasi - data[`target_${kontrakAwalAddendum.id}`]) >= 0 ? '+' : ''}
                                {(data.realisasi - data[`target_${kontrakAwalAddendum.id}`]).toFixed(2)}%
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />

              {/* Render Lines for each visible addendum */}
              {projectAddendums.map(add => {
                if (!isCurveVisible(add.id)) return null;
                return (
                  <Line 
                    key={add.id}
                    type="monotone" 
                    dataKey={`target_${add.id}`} 
                    name={`${add.nomorAddendum}${add.isAktif ? ' (Aktif)' : add.isKontrakAwal ? ' (Baseline)' : ''} (%)`} 
                    stroke={add.warnaGaris} 
                    strokeDasharray={add.isKontrakAwal ? "5 5" : add.isAktif ? undefined : "3 3"} 
                    strokeWidth={add.isAktif ? 2.5 : 1.5} 
                    dot={{ r: add.isAktif ? 3.5 : 2.5 }} 
                  />
                );
              })}

              {/* Realisasi Fisik Line */}
              {isCurveVisible('realisasi') && (
                <Line 
                  type="monotone" 
                  dataKey="realisasi" 
                  name="Realisasi Fisik Riil (%)" 
                  stroke="#10b981" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#10b981' }} 
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Status Metrics Bar */}
        <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-50 p-2.5 rounded-xl text-center">
            <span className="text-[10px] text-slate-500 font-bold uppercase">Target Proyek ({activeAddendum?.nomorAddendum})</span>
            <div className="text-base font-extrabold text-slate-700">
              {selectedProject.progresFisikRencana}%
            </div>
            <span className="text-[10px] text-slate-400">Jadwal Acuan Aktif</span>
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
                        <span>{formatTanggalIndo(report.periodeMulai)} s/d {formatTanggalIndo(report.periodeSelesai)}</span>
                      </span>
                      <span className="text-[11px] text-slate-400 font-medium">
                        ({durasi} Hari Kalender)
                      </span>
                      {report.addendumId && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                          {projectAddendums.find(a => a.id === report.addendumId)?.nomorAddendum || 'Addendum'}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {canSubmit && (
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
              
              {/* SECTION: Minggu & Ketentuan Tanggal */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <Calendar className="w-4 h-4 text-amber-600" />
                    <span>Pengaturan Minggu & Ketentuan Tanggal (Diatur Operator)</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (periodeMulai) {
                        setPeriodeSelesai(addDays(periodeMulai, 6));
                      }
                    }}
                    className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 transition-colors"
                    title="Isi tanggal selesai otomatis 7 hari dari tanggal mulai"
                  >
                    +7 Hari Otomatis
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Minggu (Bisa Diisi Manual) *
                    </label>
                    <input
                      type="text"
                      required
                      value={mingguKe}
                      onChange={e => setMingguKe(e.target.value)}
                      placeholder="Contoh: 21 atau Minggu 21"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      Bebas teks / angka (misal: 21, M-21)
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Mulai Periode *
                    </label>
                    <input
                      type="date"
                      required
                      value={periodeMulai}
                      onChange={e => setPeriodeMulai(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatTanggalSingkat(periodeMulai)}
                    </span>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Selesai Periode *
                    </label>
                    <input
                      type="date"
                      required
                      value={periodeSelesai}
                      onChange={e => setPeriodeSelesai(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white focus:ring-2 focus:ring-amber-500 focus:outline-hidden"
                    />
                    <span className="text-[10px] text-slate-400 block mt-0.5">
                      {formatTanggalSingkat(periodeSelesai)} ({durasiMingguIni} hari)
                    </span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-600 bg-white p-2 rounded-lg border border-slate-200/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Info className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                    <span>
                      Periode: <strong>{formatTanggalIndo(periodeMulai)}</strong> s/d <strong>{formatTanggalIndo(periodeSelesai)}</strong>
                    </span>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-700">
                    Acuan: {activeAddendum?.nomorAddendum}
                  </span>
                </div>
              </div>

              {/* SECTION: Input Target & Realisasi Proyek */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200/80 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
                    <TrendingUp className="w-4 h-4 text-amber-600" />
                    <span>Input Target & Realisasi Progres Proyek</span>
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Baseline Sebelumnya: Rencana <strong>{baselineKumRencana}%</strong> • Realisasi <strong>{baselineKumRealisasi}%</strong>
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
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Target Kumulatif Proyek (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={kumulatifRencana}
                        onChange={e => handleKumulatifRencanaChange(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold text-slate-800 bg-slate-50/50"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Total target s/d minggu ini
                      </span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Bobot Target Minggu Ini (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={bobotRencana}
                        onChange={e => handleBobotRencanaChange(Number(e.target.value))}
                        className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                      />
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        Porsi rencana khusus minggu ini
                      </span>
                    </div>
                  </div>

                  {/* Realisasi Column */}
                  <div className="bg-white p-3 rounded-xl border border-emerald-200 space-y-2">
                    <div className="flex items-center justify-between border-b border-emerald-100 pb-1.5">
                      <span className="text-xs font-bold text-emerald-800">REALISASI FISIK PROYEK</span>
                      <span className="text-[10px] font-semibold text-emerald-600">Hasil Lapangan</span>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                        Realisasi Kumulatif Proyek (%)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        required
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
                <div className={`p-3 rounded-xl border flex items-center justify-between ${
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
                </div>

                <label className="flex items-center gap-2 pt-1 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={updateMasterProject}
                    onChange={e => setUpdateMasterProject(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-slate-300 focus:ring-amber-500"
                  />
                  <span className="text-xs font-semibold text-slate-700">
                    Perbarui langsung progres master proyek dengan nilai kumulatif ini (Rencana: {kumulatifRencana}%, Realisasi: {kumulatifRealisasi}%)
                  </span>
                </label>
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
                  className="px-5 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
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
              <div className="flex items-center justify-between bg-blue-50/70 p-3 rounded-xl border border-blue-200/80">
                <div className="text-xs text-blue-900">
                  <p className="font-bold">Kurva S Multi-Addendum</p>
                  <p className="text-blue-700 mt-0.5">
                    Anda dapat menyimpan kurva S awal (baseline) dan kurva hasil addendum. Seluruh kurva dapat ditampilkan di grafik untuk pemantauan deviasi pergeseran jadwal.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleOpenAddAddendum}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow-2xs flex-shrink-0 transition-colors ml-3"
                >
                  <Plus className="w-4 h-4" />
                  Tambah Addendum Baru
                </button>
              </div>

              {/* List of Addendums */}
              <div className="space-y-3">
                {projectAddendums.map((add) => {
                  return (
                    <div 
                      key={add.id}
                      className={`p-4 rounded-xl border transition-all ${
                        add.isAktif 
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
                            {add.isAktif ? (
                              <span className="text-[10px] font-black px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-md flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Jadwal Acuan Aktif
                              </span>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setActiveScheduleAddendum(selectedProject.id, add.id)}
                                className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 hover:bg-blue-50 text-slate-600 hover:text-blue-700 rounded-md border border-slate-200 transition-colors"
                              >
                                Jadikan Acuan Aktif
                              </button>
                            )}
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

                          {add.alasan && (
                            <p className="text-[11px] text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100 mt-1">
                              <strong>Latar Belakang:</strong> {add.alasan}
                            </p>
                          )}
                        </div>

                        {/* Actions for this Addendum */}
                        <div className="flex items-center gap-1.5 flex-shrink-0 self-end sm:self-start">
                          <button
                            type="button"
                            onClick={() => handleOpenEditAddendum(add)}
                            className="px-2.5 py-1 text-xs font-semibold bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-lg flex items-center gap-1 shadow-2xs transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-600" />
                            <span>Edit Target</span>
                          </button>
                          
                          {!add.isKontrakAwal && (
                            <button
                              type="button"
                              onClick={() => handleDeleteAddendum(add.id, add.nomorAddendum)}
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
      {showAddendumEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full p-6 border border-slate-100 max-h-[92vh] flex flex-col">
            
            <div className="flex items-start justify-between pb-3 border-b border-slate-100 flex-shrink-0">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">
                  {editingAddendumId ? 'Edit Addendum & Jadwal Kurva S' : 'Buat Addendum Baru (Perubahan Kurva S)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Tentukan nomor addendum, ketentuan surat, dan sebaran bobot target mingguan untuk kurva S baru
                </p>
              </div>
              <button
                type="button"
                onClick={() => setShowAddendumEditModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAddendum} className="py-4 space-y-4 overflow-y-auto flex-1">
              
              {/* Addendum Metadata */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Addendum *
                    </label>
                    <input
                      type="text"
                      required
                      value={addNomor}
                      onChange={e => setAddNomor(e.target.value)}
                      placeholder="Misal: Addendum 01"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Jenis Perubahan *
                    </label>
                    <select
                      value={addJenis}
                      onChange={e => setAddJenis(e.target.value as any)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-medium"
                    >
                      <option value="Perpanjangan Waktu">Perpanjangan Waktu</option>
                      <option value="Pekerjaan Tambah Kurang (CCO)">Pekerjaan Tambah Kurang (CCO)</option>
                      <option value="Waktu dan Biaya">Waktu dan Biaya</option>
                      <option value="Perubahan Desain">Perubahan Desain</option>
                      <option value="Kontrak Awal">Kontrak Awal</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Penetapan *
                    </label>
                    <input
                      type="date"
                      required
                      value={addTanggal}
                      onChange={e => setAddTanggal(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Judul / Uraian Perubahan *
                  </label>
                  <input
                    type="text"
                    required
                    value={addJudul}
                    onChange={e => setAddJudul(e.target.value)}
                    placeholder="Contoh: Perpanjangan Waktu 14 Hari Kalender Akibat Penyesuaian Muka Air Tanah"
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Nomor Surat Addendum
                    </label>
                    <input
                      type="text"
                      value={addNomorSurat}
                      onChange={e => setAddNomorSurat(e.target.value)}
                      placeholder="600.2/ADD-01/RSUD/2026"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-mono text-[11px]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Durasi Hari Baru
                    </label>
                    <input
                      type="number"
                      value={addDurasiBaru || ''}
                      onChange={e => setAddDurasiBaru(e.target.value ? Number(e.target.value) : undefined)}
                      placeholder="Contoh: 228"
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">
                      Tanggal Selesai Baru
                    </label>
                    <input
                      type="date"
                      value={addTanggalSelesaiBaru}
                      onChange={e => setAddTanggalSelesaiBaru(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Latar Belakang / Dasar Perubahan
                  </label>
                  <textarea
                    rows={2}
                    value={addAlasan}
                    onChange={e => setAddAlasan(e.target.value)}
                    placeholder="Sebutkan Berita Acara, hasil rapat lapangan bersama, atau kondisi kompensasi..."
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                  />
                </div>

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
                          title={c.label}
                        />
                      ))}
                    </div>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-2xs">
                    <input
                      type="checkbox"
                      checked={addIsAktif}
                      onChange={e => setAddIsAktif(e.target.checked)}
                      className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                    />
                    <span className="text-xs font-bold text-slate-700">
                      Jadikan sebagai Acuan Jadwal Aktif
                    </span>
                  </label>
                </div>
              </div>

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
                      defaultValue=""
                      className="text-xs bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1 text-slate-700 font-semibold"
                    >
                      <option value="" disabled>Salin dari Kurva Lain...</option>
                      {projectAddendums.map(a => (
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
                <div className="border border-slate-200 rounded-xl overflow-hidden max-h-60 overflow-y-auto">
                  <table className="w-full text-left text-xs divide-y divide-slate-200">
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
                              value={pt.bobotTarget || ''}
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

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddendumEditModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm transition-colors flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  {editingAddendumId ? 'Simpan Perubahan Addendum' : 'Simpan & Aktifkan Addendum'}
                </button>
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
