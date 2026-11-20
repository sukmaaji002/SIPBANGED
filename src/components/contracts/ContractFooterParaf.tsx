import React from 'react';

interface Props {
  className?: string;
  isFixedPrint?: boolean;
}

export const ParafTable: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div style={{ backgroundColor: '#ffffff', display: 'inline-block' }} className={className}>
    <table 
      style={{ 
        width: '235px', 
        borderCollapse: 'collapse', 
        border: '1px solid #000000', 
        backgroundColor: '#ffffff' 
      }}
    >
      <tbody>
        <tr>
          <td 
            style={{ 
              border: '1px solid #000000', 
              padding: '3px 8px', 
              fontWeight: 700, 
              color: '#000000', 
              fontSize: '11px', 
              lineHeight: '1.2', 
              textAlign: 'left', 
              verticalAlign: 'middle', 
              whiteSpace: 'nowrap',
              backgroundColor: '#ffffff',
              fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
            }}
          >
            Pejabat Penandatangan Kontrak
          </td>
          <td 
            style={{ 
              border: '1px solid #000000', 
              width: '55px', 
              height: '22px', 
              backgroundColor: '#ffffff' 
            }} 
          />
        </tr>
        <tr>
          <td 
            style={{ 
              border: '1px solid #000000', 
              padding: '3px 8px', 
              fontWeight: 700, 
              color: '#000000', 
              fontSize: '11px', 
              lineHeight: '1.2', 
              textAlign: 'left', 
              verticalAlign: 'middle', 
              whiteSpace: 'nowrap',
              backgroundColor: '#ffffff',
              fontFamily: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
            }}
          >
            Penyedia
          </td>
          <td 
            style={{ 
              border: '1px solid #000000', 
              width: '55px', 
              height: '22px', 
              backgroundColor: '#ffffff' 
            }} 
          />
        </tr>
      </tbody>
    </table>
  </div>
);

export const ContractFooterParaf: React.FC<Props> = ({ className = '', isFixedPrint = false }) => {
  if (isFixedPrint) {
    return (
      <div 
        className={`contract-footer-paraf-print hidden print:block fixed bottom-2 right-4 z-50 pointer-events-none ${className}`}
      >
        <ParafTable />
      </div>
    );
  }

  return (
    <div 
      className={`contract-footer-paraf-screen mt-6 pt-2 flex justify-end print:hidden ${className}`}
    >
      <ParafTable />
    </div>
  );
};
