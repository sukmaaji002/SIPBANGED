import React from 'react';
import { ParafTable } from './ContractFooterParaf';

interface Props {
  children: React.ReactNode;
  className?: string;
  showFooterParaf?: boolean;
}

export const PrintDocWrapper: React.FC<Props> = ({ 
  children, 
  className = '', 
  showFooterParaf = true 
}) => {
  return (
    <div className={`font-serif text-black text-xs leading-relaxed print-page bg-white p-4 sm:p-8 md:p-10 mb-8 border-0 shadow-none rounded-none max-w-[215mm] mx-auto ${className}`}>
      {/* 
        Native HTML Table Wrapper for Print:
        tfoot acts as a bottom spacer (24mm) on every printed page so tbody content
        never collides with or overlaps the fixed bottom paraf footer.
      */}
      <table className="print-doc-table w-full border-none border-collapse">
        <tbody>
          <tr>
            <td className="p-0 border-none align-top">
              {children}
            </td>
          </tr>
        </tbody>
        {showFooterParaf && (
          <tfoot className="hidden print:table-footer-group">
            <tr>
              <td className="p-0 border-none" style={{ height: '24mm' }}>
                <div style={{ height: '24mm', visibility: 'hidden' }}>&nbsp;</div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* 
        Print Footer: Posisi FIXED di halaman paling bawah saat dicetak.
        Muncul di setiap halaman cetak tepat di bottom margin (halaman paling bawah),
        dan tersembunyi sepenuhnya di layar pratinjau agar tidak melayang di viewport (print:block hidden).
      */}
      {showFooterParaf && (
        <div className="hidden print:block fixed-print-paraf">
          <ParafTable />
        </div>
      )}
    </div>
  );
};

