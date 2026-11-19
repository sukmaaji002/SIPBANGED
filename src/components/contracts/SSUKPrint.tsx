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
      <div className="space-y-6">
        {OFFICIAL_SSUK_SECTIONS.map((section) => {
          // Filter clauses to only active ones if clauses prop is provided
          const visibleClauses = section.clauses.filter((clause) => {
            const state = clauseMap.get(clause.id);
            return state ? state.isActive : true;
          });

          if (visibleClauses.length === 0) return null;

          return (
            <div key={section.id} className="space-y-2">
              {/* Judul Bagian: A. KETENTUAN UMUM, B. PELAKSANAAN..., dst. */}
              <h3 
                className="ssuk-section-title font-bold text-xs uppercase text-slate-900 pt-3 mb-2 border-t border-slate-300"
                style={{ breakAfter: 'avoid', pageBreakAfter: 'avoid' }}
              >
                {section.nomorDanJudul}
              </h3>

              {/* Layout 2 Kolom Tanpa Garis (Borderless Table) Sesuai File Word */}
              <table className="w-full text-xs border-collapse font-serif ssuk-table">
                <tbody>
                  {visibleClauses.map((clause, cIdx) => {
                    const clauseState = clauseMap.get(clause.id);
                    const isCustom = clauseState && clauseState.kontenCustom !== undefined;
                    const customParas = isCustom 
                      ? (clauseState?.kontenCustom || '').split(/\r?\n+/).map(s => s.trim()).filter(Boolean)
                      : [];

                    const paras = isCustom
                      ? customParas.map(cp => {
                          const numMatch = cp.match(/^(\d+(?:\.\d+)*)\s+(.*)$/s);
                          const letMatch = cp.match(/^([a-z]\.)\s+(.*)$/is);
                          if (numMatch) return { prefix: numMatch[1], text: numMatch[2], isLetter: false };
                          if (letMatch) return { prefix: letMatch[1], text: letMatch[2], isLetter: true };
                          return { prefix: '', text: cp, isLetter: false };
                        })
                      : (clause.paragraphs || []).map(p => ({
                          prefix: p.prefix || '',
                          text: p.text || '',
                          isLetter: !!(p.prefix && /^[a-z]\.$/.test(p.prefix))
                        }));

                    if (paras.length === 0) {
                      return (
                        <tr 
                          key={clause.id} 
                          className="align-top"
                          style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                        >
                          <td className={`w-[28%] pr-4 ${cIdx > 0 ? 'pt-3' : 'pt-1'} pb-1 font-bold text-slate-900 border-none select-none align-top`}>
                            {clause.nomorDanJudul}
                          </td>
                          <td className={`w-[72%] ${cIdx > 0 ? 'pt-3' : 'pt-1'} pb-1 text-justify border-none align-top`} />
                        </tr>
                      );
                    }

                    return paras.map((p, pIdx) => {
                      const isFirst = pIdx === 0;
                      return (
                        <tr 
                          key={`${clause.id}-${pIdx}`} 
                          className="align-top"
                          style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                        >
                          {/* Kolom 1: Nomor dan Judul Pasal hanya pada baris pertama pasal */}
                          <td className={`w-[28%] pr-4 ${cIdx > 0 && isFirst ? 'pt-3' : 'py-1'} font-bold text-slate-900 border-none select-none align-top`}>
                            {isFirst ? clause.nomorDanJudul : ''}
                          </td>

                          {/* Kolom 2: Uraian Isi Paragraf Sub-Pasal */}
                          <td className={`w-[72%] ${cIdx > 0 && isFirst ? 'pt-3' : 'py-1'} text-justify border-none align-top`}>
                            <div
                              className={`leading-relaxed text-[11px] ${
                                p.isLetter ? 'pl-6 -indent-4' : ''
                              }`}
                            >
                              {p.prefix && !p.isLetter && (
                                <strong className="font-bold mr-1.5">{p.prefix}</strong>
                              )}
                              {p.isLetter && (
                                <span className="font-semibold mr-1.5">{p.prefix}</span>
                              )}
                              <span>{p.text}</span>
                            </div>
                          </td>
                        </tr>
                      );
                    });
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
