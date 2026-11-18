import React from 'react';
import { ContractFooterParaf } from './ContractFooterParaf';

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
    <div className={`font-serif text-black text-xs leading-relaxed print-page bg-white p-6 sm:p-10 mb-8 border border-slate-200 relative ${className}`}>
      {/* 
        Native HTML Table Wrapper for Print:
        Ensures tfoot automatically repeats on every printed page as an invisible spacer.
        This reserves 20mm of blank space at the bottom of EVERY printed page so normal
        body content (clauses, paragraphs, tables) stops before the fixed paraf table.
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
                <div className="print-footer-space h-20 w-full pointer-events-none" />
              </td>
            </tr>
          </tfoot>
        )}
      </table>

      {/* Screen and Fixed Print Paraf Footer */}
      {showFooterParaf && (
        <>
          <ContractFooterParaf />
          <ContractFooterParaf isFixedPrint />
        </>
      )}
    </div>
  );
};

