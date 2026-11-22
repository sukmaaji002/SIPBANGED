import type { Project, SpkType } from '../types';

export const projectPackageLabels: Record<SpkType, string> = {
  perencana: 'Perencanaan',
  fisik: 'Fisik',
  pengawas: 'Pengawasan',
};

export function getProjectPackage(project: Project, type: SpkType) {
  const packages = {
    perencana: {
      detail: project.paketPerencana,
      enabled: project.hasPerencana,
      provider: project.perencanaNama,
      director: project.perencanaDirektur,
      value: project.nilaiKontrakPerencana,
      number: project.nomorKontrakPerencana,
    },
    fisik: {
      detail: project.paketFisik,
      enabled: project.hasFisik,
      provider: project.kontraktorNama,
      director: project.kontraktorDirektur,
      value: project.nilaiKontrakFisik ?? project.nilaiKontrak,
      number: project.nomorKontrakFisik,
    },
    pengawas: {
      detail: project.paketPengawas,
      enabled: project.hasPengawas,
      provider: project.pengawasNama,
      director: project.pengawasDirektur,
      value: project.nilaiKontrakPengawas,
      number: project.nomorKontrakPengawas,
    },
  };
  const { detail, enabled, provider, director, value, number } = packages[type];
  const name = detail?.namaPerusahaan?.trim() || provider?.trim();
  const company = name === '-' ? undefined : name;
  const active = enabled !== false && detail?.isActive !== false && Boolean(enabled || detail?.isActive || company);

  const customPpk = detail?.usePpkAcuan === false && detail.ppkNama;

  return {
    active,
    company,
    director: detail?.namaDirektur || director,
    value: detail?.nilaiKontrak ?? value,
    number: detail?.nomorKontrak || number,
    start: detail?.tanggalMulai || (type === 'fisik' ? project.tanggalMulai : undefined),
    end: detail?.tanggalSelesai || (type === 'fisik' ? project.tanggalSelesai : undefined),
    ppk: customPpk || project.ppkNama,
    ppkNip: customPpk ? detail.ppkNip : project.ppkNip,
  };
}
