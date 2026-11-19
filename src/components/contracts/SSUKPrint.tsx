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
                          const subMatch = cp.match(/^((?:\d+|[a-z])\))\s+(.*)$/is);
                          const letMatch = cp.match(/^([a-z]\.)\s+(.*)$/is);
                          const numMatch = cp.match(/^(\d+(?:\.\d+)*)\s+(.*)$/s);
                          if (subMatch) return { prefix: subMatch[1], text: subMatch[2], level: 3 };
                          if (letMatch) return { prefix: letMatch[1], text: letMatch[2], level: 2 };
                          if (numMatch) return { prefix: numMatch[1], text: numMatch[2], level: 1 };
                          return { prefix: '', text: cp, level: 0 };
                        })
                      : (clause.paragraphs || []).map(p => {
                          const pfx = (p.prefix || '').trim();
                          let level = 0;
                          if (/^[a-z]\.$/i.test(pfx)) {
                            level = 2; // Huruf: a., b., c. (rata dengan huruf pertama indent angka)
                          } else if (/^(\d+|[a-z])\)$/i.test(pfx)) {
                            level = 3; // Sub-item: 1), 2), a), b)
                          } else if (/^\d+(\.\d+)*$/.test(pfx)) {
                            level = 1; // Angka: 1.1, 14.3, 22.2
                          } else if (pfx) {
                            level = 2;
                          }
                          return {
                            prefix: pfx,
                            text: p.text || '',
                            level
                          };
                        });

                    if (paras.length === 0) {
                      return (
                        <tr 
                          key={clause.id} 
                          className="align-top"
                          style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}
                        >
                          <td className={`w-[26%] pr-3 ${cIdx > 0 ? 'pt-3' : 'pt-1'} pb-1 font-bold text-slate-900 border-none select-none align-top`}>
                            {clause.nomorDanJudul}
                          </td>
                          <td className={`w-[74%] ${cIdx > 0 ? 'pt-3' : 'pt-1'} pb-1 text-justify border-none align-top`} />
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
                          <td className={`w-[26%] pr-3 ${cIdx > 0 && isFirst ? 'pt-3' : 'py-1'} font-bold text-slate-900 border-none select-none align-top`}>
                            {isFirst ? (
                              <div>
                                {clause.subBab && (
                                  <div className="font-bold text-[11px] font-serif mb-1 leading-snug text-slate-900">
                                    {clause.subBab}
                                  </div>
                                )}
                                <div className={clause.subBab ? "pl-3 text-[11px] font-serif leading-snug" : "text-[11px] font-serif leading-snug"}>
                                  {clause.nomorDanJudul}
                                </div>
                              </div>
                            ) : ''}
                          </td>

                          {/* Kolom 2: Uraian Isi Paragraf Sub-Pasal dengan Indent Numbering Rapi */}
                          <td className={`w-[74%] ${cIdx > 0 && isFirst ? 'pt-3' : 'py-1'} text-justify border-none align-top`}>
                            {p.level === 1 ? (
                              // Level 1: Indent Angka (1.1, 14.3, 22.2)
                              <div 
                                className="flex items-start"
                                style={{ display: 'flex', alignItems: 'flex-start' }}
                              >
                                <span 
                                  className="shrink-0 select-none font-serif font-bold text-left"
                                  style={{
                                    flexShrink: 0,
                                    width: '36px',
                                    textAlign: 'left'
                                  }}
                                >
                                  {p.prefix}
                                </span>
                                <div 
                                  className="flex-1 text-justify leading-relaxed text-[11px] font-serif"
                                  style={{ flex: 1, textAlign: 'justify' }}
                                >
                                  <span className={isCustom ? 'whitespace-pre-line' : ''}>{p.text}</span>
                                </div>
                              </div>
                            ) : p.level === 2 ? (
                              // Level 2: Indent Huruf (a., b., c.) - Rata dengan huruf pertama pada indent angka (pl 36px)
                              <div 
                                className="flex items-start"
                                style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '36px' }}
                              >
                                <span 
                                  className="shrink-0 select-none font-serif font-semibold text-left"
                                  style={{
                                    flexShrink: 0,
                                    width: '22px',
                                    textAlign: 'left'
                                  }}
                                >
                                  {p.prefix}
                                </span>
                                <div 
                                  className="flex-1 text-justify leading-relaxed text-[11px] font-serif"
                                  style={{ flex: 1, textAlign: 'justify' }}
                                >
                                  <span className={isCustom ? 'whitespace-pre-line' : ''}>{p.text}</span>
                                </div>
                              </div>
                            ) : p.level === 3 ? (
                              // Level 3: Sub-item kurung (1), 2), a), b)) - Rata dengan teks indent huruf (pl 58px)
                              <div 
                                className="flex items-start"
                                style={{ display: 'flex', alignItems: 'flex-start', paddingLeft: '58px' }}
                              >
                                <span 
                                  className="shrink-0 select-none font-serif font-semibold text-left"
                                  style={{
                                    flexShrink: 0,
                                    width: '22px',
                                    textAlign: 'left'
                                  }}
                                >
                                  {p.prefix}
                                </span>
                                <div 
                                  className="flex-1 text-justify leading-relaxed text-[11px] font-serif"
                                  style={{ flex: 1, textAlign: 'justify' }}
                                >
                                  <span className={isCustom ? 'whitespace-pre-line' : ''}>{p.text}</span>
                                </div>
                              </div>
                            ) : (
                              // Level 0: Paragraf teks biasa tanpa prefix
                              <div 
                                className="leading-relaxed text-[11px] text-justify font-serif"
                                style={{ textAlign: 'justify' }}
                              >
                                <span className={isCustom ? 'whitespace-pre-line' : ''}>{p.text}</span>
                              </div>
                            )}
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
