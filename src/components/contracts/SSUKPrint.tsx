import React from 'react';
import { OFFICIAL_SSUK_SECTIONS } from '../../data/ssukData';
import { ContractClause } from '../../types';
import { PrintDocWrapper } from './PrintDocWrapper';

interface SSUKPrintProps {
  clauses?: ContractClause[];
}

export const SSUKPrint: React.FC<SSUKPrintProps> = ({ clauses }) => {
  const clauseMap = new Map((clauses || []).map(c => [c.id, c]));

  return (
    <PrintDocWrapper>
      {/* Judul Utama SSUK Sesuai Naskah Asli Word */}
      <div className="text-center my-6 pb-2">
        <h2 className="text-base sm:text-lg font-bold uppercase tracking-wide">
          I. SYARAT-SYARAT UMUM KONTRAK (SSUK)
        </h2>
        <p className="text-xs font-semibold text-slate-700 mt-1 uppercase">
          Pengadaan Pekerjaan Konstruksi Dinas Pekerjaan Umum dan Penataan Ruang Kabupaten Tegal
        </p>
      </div>

      {/* Daftar Bagian A sampai H (Total 79 Pasal) */}
      <div className="space-y-8">
        {OFFICIAL_SSUK_SECTIONS.map((section) => {
          // Filter clauses to only active ones if clauses prop is provided
          const visibleClauses = section.clauses.filter((clause) => {
            const state = clauseMap.get(clause.id);
            return state ? state.isActive : true;
          });

          if (visibleClauses.length === 0) return null;

          return (
            <div key={section.id} className="space-y-3">
              {/* Judul Bagian: A. KETENTUAN UMUM, B. PELAKSANAAN..., dst. */}
              <h3 className="font-bold text-xs uppercase text-slate-900 pt-4 border-t border-slate-300">
                {section.nomorDanJudul}
              </h3>

              {/* Layout 2 Kolom Tanpa Garis (Borderless Table) Sesuai File Word */}
              <table className="w-full text-xs border-collapse font-serif">
                <tbody>
                  {visibleClauses.map((clause) => {
                    const clauseState = clauseMap.get(clause.id);
                    const isCustom = clauseState && clauseState.kontenCustom !== undefined;
                    const customParas = isCustom ? (clauseState?.kontenCustom || '').split('\n\n').filter(Boolean) : [];

                    return (
                      <tr key={clause.id} className="align-top">
                        {/* Kolom 1: Nomor dan Judul Pasal (misal: 1. Definisi, 2. Penerapan) */}
                        <td className="w-[28%] pr-4 py-2 font-bold text-slate-900 border-none select-none">
                          {clause.nomorDanJudul}
                        </td>

                        {/* Kolom 2: Uraian Isi Pasal & Sub-Pasal Hierarkis (1.1, 1.2, 3.1, a., b., dst.) */}
                        <td className="w-[72%] py-2 text-justify border-none space-y-2">
                          {isCustom ? (
                            customParas.map((pText, pIdx) => (
                              <div key={pIdx} className="leading-relaxed text-[11px] whitespace-pre-line">
                                {pText}
                              </div>
                            ))
                          ) : (
                            clause.paragraphs.map((p, pIdx) => {
                              const isLetter = p.prefix && /^[a-z]\.$/.test(p.prefix);
                              return (
                                <div
                                  key={pIdx}
                                  className={`leading-relaxed text-[11px] ${
                                    isLetter ? 'pl-6 -indent-4' : ''
                                  }`}
                                >
                                  {p.prefix && !isLetter && (
                                    <strong className="font-bold mr-1.5">{p.prefix}</strong>
                                  )}
                                  {isLetter && (
                                    <span className="font-semibold mr-1.5">{p.prefix}</span>
                                  )}
                                  <span>{p.text}</span>
                                </div>
                              );
                            })
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          );
        })}
      </div>
    </PrintDocWrapper>
  );
};
