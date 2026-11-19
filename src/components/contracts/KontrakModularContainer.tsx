import React from 'react';
import { useApp } from '../../context/AppContext';
import { ContractBuilder } from './ContractBuilder';
import { SpkBuilder } from './SpkBuilder';
import { FileText, FileCheck2, Info } from 'lucide-react';

export const KontrakModularContainer: React.FC = () => {
  const { contractDocType, setContractDocType, spkDocType, setSpkDocType } = useApp();

  return (
    <div className="space-y-6">
      
      {/* Top Document Type Switcher (Surat Perjanjian vs SPK) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-2 sm:p-2.5 shadow-2xs no-print">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5">
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Tab 1: Surat Perjanjian */}
            <button
              onClick={() => setContractDocType('perjanjian')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                contractDocType === 'perjanjian'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileText className={`w-4 h-4 ${contractDocType === 'perjanjian' ? 'text-white' : 'text-slate-500'}`} />
              <span>Surat Perjanjian</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                contractDocType === 'perjanjian' ? 'bg-emerald-700/60 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                Perlem 12/21
              </span>
            </button>

            {/* Tab 2: Surat Perintah Kerja (SPK) */}
            <button
              onClick={() => setContractDocType('spk')}
              className={`flex-1 sm:flex-none px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                contractDocType === 'spk'
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <FileCheck2 className={`w-4 h-4 ${contractDocType === 'spk' ? 'text-white' : 'text-slate-500'}`} />
              <span>Surat Perintah Kerja (SPK)</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-md font-mono ${
                contractDocType === 'spk' ? 'bg-blue-700/60 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3 Jenis
              </span>
            </button>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-xs text-slate-400 font-medium">
            <Info className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {contractDocType === 'perjanjian' 
                ? 'Naskah Kontrak Standar Konstruksi & SSKK (> Rp 200 Juta)' 
                : 'Surat Perintah Kerja: Fisik, Konsultan Pengawas & Konsultan Perencana'}
            </span>
          </div>

        </div>
      </div>

      {/* Main Content Render */}
      {contractDocType === 'perjanjian' ? (
        <ContractBuilder />
      ) : (
        <SpkBuilder 
          currentSpkType={spkDocType} 
          onSpkTypeChange={setSpkDocType} 
        />
      )}

    </div>
  );
};

