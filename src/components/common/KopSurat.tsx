import React from 'react';

export const KopSurat: React.FC<{ subTitle?: string }> = ({ subTitle }) => {
  return (
    <div className="w-full text-center pb-2 mb-6">
      <div className="flex items-center justify-between gap-2 sm:gap-3 px-1 sm:px-2">
        {/* Lambang Resmi Daerah Kabupaten Tegal */}
        <div className="w-18 h-22 shrink-0 flex items-center justify-center">
          <img 
            src="/logo-kab-tegal.png" 
            alt="Logo Pemerintah Kabupaten Tegal" 
            className="w-16 h-20 object-contain" 
          />
        </div>

        {/* Teks Kop Resmi Standar Dinas PUPR Kab. Tegal */}
        <div className="flex-1 text-center min-w-0">
          <h4 className="text-xs sm:text-sm tracking-wider font-semibold uppercase text-black font-serif whitespace-nowrap">
            PEMERINTAH KABUPATEN TEGAL
          </h4>
          <h2 
            className="text-[14px] sm:text-[16.5px] md:text-[18px] print:text-[15.5px] font-bold uppercase tracking-tight text-black font-serif whitespace-nowrap my-0.5"
            style={{ whiteSpace: 'nowrap' }}
          >
            DINAS PEKERJAAN UMUM DAN PENATAAN RUANG
          </h2>
          <p className="text-[10px] sm:text-[11px] text-slate-700 mt-0.5 leading-tight font-serif whitespace-nowrap">
            Jl. Cut Nyak Dhien No. 13 Ds. Kalisapu Kec. Slawi Kab. Tegal – Kode Pos 52416
          </p>
          <p className="text-[9.5px] sm:text-[10px] text-slate-600 font-serif whitespace-nowrap">
            Telepon: (0283) 6197673 | Email: dpupr@tegalkab.go.id
          </p>
          {subTitle && (
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-900 mt-1 italic whitespace-nowrap">
              {subTitle}
            </p>
          )}
        </div>

        {/* Dummy symmetry spacer agar teks kop surat simetris di tengah */}
        <div className="w-18 shrink-0 hidden md:block print:block" aria-hidden="true" />
      </div>

      {/* Garis Ganda Standar Tata Naskah Dinas Kabupaten Tegal */}
      <div className="w-full mt-2.5 space-y-[2px] kop-surat-lines">
        <div 
          className="kop-surat-line-thick border-t-[2.5px] border-black" 
          style={{ borderTop: '2.5px solid #000000', height: 0 }} 
        />
        <div 
          className="kop-surat-line-thin border-t border-black" 
          style={{ borderTop: '1px solid #000000', height: 0 }} 
        />
      </div>
    </div>
  );
};
