import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { PaymentTerm } from '../../types';
import { formatRupiah, formatTanggalIndo } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';
import { 
  Coins, 
  TrendingUp, 
  Plus, 
  CheckCircle2, 
  FileCheck, 
  Clock, 
  FileSpreadsheet, 
  PieChart, 
  ShieldCheck, 
  Layers,
  ArrowDownRight,
  ArrowUpRight,
  Landmark,
  Trash2,
  Calendar
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  Legend 
} from 'recharts';

export const FinanceOverview: React.FC = () => {
  const { selectedProject, payments, addPayment, updatePayment, deletePayment, currentUser } = useApp();
  
  const [showModal, setShowModal] = useState(false);
  
  // Modal Form State
  const [tahapPembayaran, setTahapPembayaran] = useState<PaymentTerm['tahapPembayaran']>('Termin 1');
  const [terminKe, setTerminKe] = useState<number>(1);
  const [syaratFisik, setSyaratFisik] = useState<number>(30);
  const [progresAktual, setProgresAktual] = useState<number>(35);
  const [nilaiTagihanKotor, setNilaiTagihanKotor] = useState<number>(0);
  const [potonganUM, setPotonganUM] = useState<number>(0);
  const [potonganRetensi, setPotonganRetensi] = useState<number>(0);
  const [potonganPPh, setPotonganPPh] = useState<number>(0);
  const [potonganPPN, setPotonganPPN] = useState<number>(0);
  const [nomorSPP, setNomorSPP] = useState('');
  const [tanggalSPP, setTanggalSPP] = useState(new Date().toISOString().split('T')[0]);
  const [nomorSPM, setNomorSPM] = useState('');
  const [nomorSP2D, setNomorSP2D] = useState('');
  const [status, setStatus] = useState<PaymentTerm['status']>('SP2D Cair');
  const [keterangan, setKeterangan] = useState('');

  if (!selectedProject) {
    return <div className="p-8 text-center text-slate-500">Pilih proyek terlebih dahulu.</div>;
  }

  const projectPayments = payments.filter(p => p.projectId === selectedProject.id);

  const canManageFinance = hasPermission(currentUser?.role, 'manage_finance');

  // Keuangan Calculations
  const pagu = selectedProject.paguAnggaran;
  const kontrak = selectedProject.nilaiKontrak;
  const efisiensiTender = pagu - kontrak; // Sisa Tender / Sisa Pagu Anggaran

  // Total kas yang sudah cair (SP2D Cair)
  const totalCair = projectPayments
    .filter(p => p.status === 'SP2D Cair')
    .reduce((acc, p) => acc + p.nilaiBersihDibayar, 0);

  // Total kas dalam proses (SPM Terbit / Verifikasi)
  const totalProses = projectPayments
    .filter(p => p.status !== 'SP2D Cair')
    .reduce((acc, p) => acc + p.nilaiBersihDibayar, 0);

  // Sisa Nilai Kontrak yang belum dibayar
  const sisaKontrak = Math.max(0, kontrak - totalCair);
  const persenSerapan = kontrak > 0 ? ((totalCair / kontrak) * 100).toFixed(1) : '0';

  // Total Retensi 5% yang tertahan
  const totalRetensiTertahan = projectPayments.reduce((acc, p) => acc + p.potonganRetensi, 0);

  // Open Add Payment Modal with auto-calculated suggested values
  const handleOpenAddModal = (presetTahap?: PaymentTerm['tahapPembayaran']) => {
    const defaultTahap = presetTahap || 'Termin 2';
    setTahapPembayaran(defaultTahap);

    let kotor = 0;
    let um = 0;
    let ret = 0;
    let pph = 0;

    if (defaultTahap === 'Uang Muka') {
      kotor = kontrak * 0.20;
      um = 0;
      ret = 0;
      pph = kotor * 0.0265;
      setSyaratFisik(0);
      setProgresAktual(0);
    } else if (defaultTahap === 'Retensi 5%') {
      kotor = kontrak * 0.05;
      um = 0;
      ret = 0;
      pph = kotor * 0.0265;
      setSyaratFisik(100);
      setProgresAktual(100);
    } else {
      kotor = kontrak * 0.30;
      um = kotor * 0.20; // 20% pengembalian uang muka
      ret = kotor * 0.05; // 5% retensi
      pph = kotor * 0.0265; // PPh Konstruksi
      setSyaratFisik(65);
      setProgresAktual(selectedProject.progresFisikRealisasi);
    }

    setNilaiTagihanKotor(kotor);
    setPotonganUM(um);
    setPotonganRetensi(ret);
    setPotonganPPh(pph);
    setPotonganPPN(0);

    const rand = Math.floor(Math.random() * 80) + 10;
    setNomorSPP(`900/0${rand}/SPP-LS/DPUPR/2026`);
    setNomorSPM(`900/0${rand + 2}/SPM-LS/DPUPR/2026`);
    setNomorSP2D(`0${rand * 15}/SP2D-LS/BPKAD/2026`);
    setKeterangan(`Pencairan tahap ${defaultTahap} didukung Berita Acara Opname fisik dan verifikasi inspektorat/tim teknis.`);
    setShowModal(true);
  };

  const handleSavePayment = (e: React.FormEvent) => {
    e.preventDefault();

    const bersih = nilaiTagihanKotor - potonganUM - potonganRetensi - potonganPPh - potonganPPN;

    const newPayment: PaymentTerm = {
      id: `pay-${Date.now()}`,
      projectId: selectedProject.id,
      tahapPembayaran,
      terminKe: tahapPembayaran.includes('Termin') ? terminKe : undefined,
      syaratProgresFisik: Number(syaratFisik),
      progresFisikAktual: Number(progresAktual),
      nilaiTagihanKotor: Number(nilaiTagihanKotor),
      potonganUangMuka: Number(potonganUM),
      potonganRetensi: Number(potonganRetensi),
      potonganPPN: Number(potonganPPN),
      potonganPPh: Number(potonganPPh),
      nilaiBersihDibayar: Math.max(0, bersih),
      nomorSPP,
      tanggalSPP,
      nomorSPM,
      tanggalSPM: '2026-07-25',
      nomorSP2D: status === 'SP2D Cair' ? nomorSP2D : undefined,
      tanggalSP2D: status === 'SP2D Cair' ? '2026-07-28' : undefined,
      status,
      keterangan
    };

    addPayment(newPayment);
    setShowModal(false);
  };

  // Chart data: Budget Breakdown Comparison
  const financialChartData = [
    { name: 'Pagu DPA', jumlah: pagu / 1000000 },
    { name: 'Nilai Kontrak', jumlah: kontrak / 1000000 },
    { name: 'Kas Terserap', jumlah: totalCair / 1000000 },
    { name: 'Sisa Kontrak', jumlah: sisaKontrak / 1000000 },
    { name: 'Efisiensi Lelang', jumlah: efisiensiTender / 1000000 }
  ];

  return (
    <div className="space-y-6">
      
      {/* Header Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 uppercase font-mono">
              Pengelolaan Keuangan & SP2D
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Subbagian Keuangan DPUPR & BPKAD Kab. Tegal
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 mt-1">
            Pengelolaan Anggaran, Kas & Termin Proyek
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Paket: <strong className="text-slate-800">{selectedProject.nama}</strong> • Sumber Dana: <strong className="text-slate-800">{selectedProject.sumberDana}</strong>
          </p>
        </div>

        <div>
          {canManageFinance ? (
            <button
              onClick={() => handleOpenAddModal('Termin 2')}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              <Plus className="w-4 h-4" />
              Input Pencairan Termin / Kas
            </button>
          ) : (
            <div 
              className="px-3 py-1.5 bg-slate-100 text-slate-400 text-xs font-medium rounded-xl border border-slate-200 cursor-not-allowed flex items-center gap-1.5"
              title="Akses terbatas"
            >
              <Coins className="w-3.5 h-3.5" />
              Kelola Kas (Khusus Staf Keuangan/PPK)
            </div>
          )}
        </div>
      </div>

      {/* 4 Financial Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Pagu vs Nilai Kontrak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Pagu vs Nilai Kontrak
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Landmark className="w-4 h-4" />
            </div>
          </div>
          <div className="text-base font-extrabold text-slate-900 mt-2">
            {formatRupiah(kontrak)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Pagu DPA: <strong className="text-slate-700">{formatRupiah(pagu)}</strong>
          </div>
          <div className="mt-2 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md inline-block">
            Efisiensi Tender: {formatRupiah(efisiensiTender)}
          </div>
        </div>

        {/* Card 2: Uang Kas Terserap (SP2D) */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Uang Kas Dicairkan (SP2D)
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-emerald-600 mt-2">
            {formatRupiah(totalCair)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1 flex items-center gap-1">
            <span>Rasio Serapan:</span>
            <strong className="text-slate-800">{persenSerapan}%</strong>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className="bg-emerald-500 h-full rounded-full"
              style={{ width: `${Math.min(100, Number(persenSerapan))}%` }}
            ></div>
          </div>
        </div>

        {/* Card 3: Sisa Kas Kontrak */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Sisa Nilai Kontrak
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-amber-600 mt-2">
            {formatRupiah(sisaKontrak)}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Sisa anggaran yang belum dicairkan ke rekanan
          </div>
          <div className="mt-2 text-[10px] text-slate-400">
            {projectPayments.filter(p => p.status !== 'SP2D Cair').length} berkas dalam proses SPM
          </div>
        </div>

        {/* Card 4: Retensi Ditahan */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Retensi 5% Tertahan
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl font-black text-purple-700 mt-2">
            {formatRupiah(totalRetensiTertahan || (kontrak * 0.05))}
          </div>
          <div className="text-[11px] text-slate-500 mt-1">
            Jaminan Masa Pemeliharaan (180 Hari)
          </div>
          <div className="mt-2 text-[10px] font-semibold text-purple-700 bg-purple-50 px-2 py-0.5 rounded-md inline-block">
            Dilepas saat Berita Acara FHO
          </div>
        </div>

      </div>

      {/* Visual Chart: Realisasi Kas vs Pagu (Juta Rupiah) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-extrabold text-sm sm:text-base text-slate-900">
              Analisis Komparasi Anggaran & Kas (Dalam Juta Rupiah)
            </h3>
            <p className="text-xs text-slate-400">
              Perbandingan Pagu DPA, Kontrak, Realisasi Kas SP2D, Sisa Kontrak, dan Efisiensi Belanja
            </p>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={financialChartData} margin={{ top: 10, right: 20, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} />
              <YAxis unit=" Jt" tick={{ fontSize: 11 }} />
              <Tooltip 
                formatter={(val: any) => [`Rp ${Number(val).toLocaleString('id-ID')} Juta`]}
                contentStyle={{ borderRadius: '12px', fontSize: '12px' }}
              />
              <Bar dataKey="jumlah" name="Nominal (Juta Rp)" fill="#059669" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Riwayat Pembayaran & SP2D */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-sm text-slate-800">
              Riwayat Pencairan Uang Kas, Termin & Penerbitan SP2D BPKAD
            </h3>
          </div>
          <span className="text-xs text-slate-400 font-semibold">
            {projectPayments.length} Tahap Pencairan
          </span>
        </div>

        {projectPayments.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            <Coins className="w-12 h-12 mx-auto mb-2 opacity-30" />
            <p className="text-xs font-medium">Belum ada pencairan kas atau termin untuk paket ini.</p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {projectPayments.map((pay) => (
              <div key={pay.id} className="p-5 hover:bg-slate-50/50 transition-colors space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-xs font-black bg-emerald-100 text-emerald-900 px-2.5 py-1 rounded-lg">
                      {pay.tahapPembayaran}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      pay.status === 'SP2D Cair' ? 'bg-emerald-100 text-emerald-800' :
                      pay.status === 'SPM Terbit' ? 'bg-blue-100 text-blue-800' :
                      'bg-amber-100 text-amber-800'
                    }`}>
                      {pay.status}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs text-slate-400 mr-2">Nilai Bersih Cair:</span>
                    <span className="text-base font-black text-emerald-700">
                      {formatRupiah(pay.nilaiBersihDibayar)}
                    </span>
                  </div>
                </div>

                {/* Potongan Breakdown */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Tagihan Bruto</span>
                    <strong className="text-slate-800">{formatRupiah(pay.nilaiTagihanKotor)}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Potongan Uang Muka</span>
                    <span className="text-slate-700 font-semibold">{formatRupiah(pay.potonganUangMuka)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Potongan Retensi (5%)</span>
                    <span className="text-purple-700 font-semibold">{formatRupiah(pay.potonganRetensi)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">PPh Konstruksi (2.65%)</span>
                    <span className="text-rose-700 font-semibold">{formatRupiah(pay.potonganPPh)}</span>
                  </div>
                </div>

                {/* SP2D Reference */}
                <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500 pt-1">
                  <div className="space-y-0.5">
                    {pay.nomorSP2D && (
                      <div className="flex items-center gap-1.5 font-mono text-emerald-800 font-semibold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>SP2D: {pay.nomorSP2D} ({pay.tanggalSP2D})</span>
                      </div>
                    )}
                    {pay.nomorSPM && (
                      <div className="text-[11px] text-slate-500 font-mono">
                        SPM: {pay.nomorSPM} • SPP: {pay.nomorSPP}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {currentUser?.role === 'admin' && (
                      <button
                        onClick={() => deletePayment(pay.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-rose-50"
                        title="Hapus Transaksi"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal Input Pencairan Termin / Kas */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 mb-1">
              Input Pencairan Termin / Arus Kas Proyek
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              Kalkulasi otomatis potongan uang muka, retensi 5%, pajak PPh, dan penatausahaan SP2D
            </p>

            <form onSubmit={handleSavePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tahap Pembayaran</label>
                  <select
                    value={tahapPembayaran}
                    onChange={e => setTahapPembayaran(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold"
                  >
                    <option value="Uang Muka">Uang Muka (20%)</option>
                    <option value="Termin 1">Termin 1 (Fisik 30%)</option>
                    <option value="Termin 2">Termin 2 (Fisik 65%)</option>
                    <option value="Termin 3">Termin 3 (Fisik 90%)</option>
                    <option value="Pelunasan 100%">Pelunasan 100% Fisik</option>
                    <option value="Retensi 5%">Pencairan Retensi 5% (Pasca FHO)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Status Pencairan</label>
                  <select
                    value={status}
                    onChange={e => setStatus(e.target.value as any)}
                    className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white font-semibold text-emerald-800"
                  >
                    <option value="Pengajuan">Pengajuan Baru</option>
                    <option value="Verifikasi Dokumen">Verifikasi Subbag Keuangan</option>
                    <option value="SPM Terbit">SPM Terbit</option>
                    <option value="SP2D Cair">SP2D Telah Cair (BPKAD)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nilai Tagihan Bruto (Rp) *</label>
                <input
                  type="number"
                  required
                  value={nilaiTagihanKotor}
                  onChange={e => setNilaiTagihanKotor(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg font-bold text-slate-900"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Rincian Potongan Wajib:</span>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500">Angsuran Uang Muka (Rp)</label>
                    <input
                      type="number"
                      value={potonganUM}
                      onChange={e => setPotonganUM(Number(e.target.value))}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">Retensi Pemeliharaan 5% (Rp)</label>
                    <input
                      type="number"
                      value={potonganRetensi}
                      onChange={e => setPotonganRetensi(Number(e.target.value))}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="block text-[10px] text-slate-500">PPh Konstruksi (2.65%) (Rp)</label>
                    <input
                      type="number"
                      value={potonganPPh}
                      onChange={e => setPotonganPPh(Number(e.target.value))}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-slate-500">PPN 11% (Jika ada) (Rp)</label>
                    <input
                      type="number"
                      value={potonganPPN}
                      onChange={e => setPotonganPPN(Number(e.target.value))}
                      className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                  <span className="font-bold text-slate-700">Estimasi Bersih Diterima:</span>
                  <span className="font-black text-emerald-700 text-sm">
                    {formatRupiah(Math.max(0, nilaiTagihanKotor - potonganUM - potonganRetensi - potonganPPh - potonganPPN))}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Nomor SPP</label>
                  <input
                    type="text"
                    value={nomorSPP}
                    onChange={e => setNomorSPP(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Nomor SPM</label>
                  <input
                    type="text"
                    value={nomorSPM}
                    onChange={e => setNomorSPM(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-semibold text-slate-600 mb-1">Nomor SP2D BPKAD</label>
                  <input
                    type="text"
                    value={nomorSP2D}
                    onChange={e => setNomorSP2D(e.target.value)}
                    className="w-full px-2 py-1 text-xs border border-slate-300 rounded font-bold text-emerald-800"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Keterangan Tambahan</label>
                <textarea
                  rows={2}
                  value={keterangan}
                  onChange={e => setKeterangan(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg"
                >
                  Simpan Pencairan Kas
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

