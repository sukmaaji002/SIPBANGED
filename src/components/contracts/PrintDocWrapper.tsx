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
    <div className={`font-serif text-black text-xs leading-relaxed print-page bg-white p-4 sm:p-8 md:p-10 mb-8 border-0 shadow-none rounded-none max-w-[215mm] mx-auto relative ${className}`}>
      {/* 
        Native HTML Table Wrapper for Print:
        Ensures tfoot automatically repeats on every printed page as an official footer.
        tfoot only prints on pages where this table exists, preventing leaks to previous pages (like Cover).
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
              <td className="p-0 border-none">
                <div className="flex justify-end pt-2 pb-1 pr-2 bg-white">
                  <ParafTable />
                </div>
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Screen Paraf Footer - posisi absolut di pojok kanan bawah halaman */}
      {showFooterParaf && (
        <div className="absolute bottom-3 right-4 print:hidden z-10">
          <ParafTable />
        </div>
      )}
    </div>
  );
};

