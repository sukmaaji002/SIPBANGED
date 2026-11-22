import { useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react';
import { Download, ExternalLink, FileText, Upload } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import {
  archiveFileFormats,
  archiveProjectDocuments,
  listProjectDocuments,
  type ArchivedProjectDocument,
  type DocumentKind,
  type DocumentScope,
} from '../../lib/projectDocumentArchive';
import { formatTanggalIndo } from '../../utils/formatters';
import { hasPermission } from '../../utils/permissions';

const panelClass = 'space-y-4 rounded-xl border border-slate-200 bg-white p-4 sm:p-5';
const storageNote = 'Berkas tersimpan di browser ini dan tidak tersinkron antarperangkat.';
const kindLabels: Record<DocumentKind, string> = {
  kontrak: 'Kontrak',
  addendum: 'Addendum',
  'berita-acara': 'Berita acara',
};

function fileSize(bytes: number): string {
  const value = bytes < 1024 * 1024 ? bytes / 1024 : bytes / (1024 * 1024);
  const unit = bytes < 1024 * 1024 ? 'KB' : 'MB';
  return `${value.toLocaleString('id-ID', { maximumFractionDigits: 1 })} ${unit}`;
}

function DocumentActions({ document, url }: { document: ArchivedProjectDocument; url: string }) {
  return (
    <div className="flex flex-wrap gap-3">
      {document.previewType && (
        <a href={url} target="_blank" rel="noopener noreferrer" aria-label={`Buka ${document.name}`} className="inline-flex items-center gap-1.5 font-medium text-emerald-800 hover:underline">
          <ExternalLink aria-hidden="true" className="size-4" /> Buka
        </a>
      )}
      <a href={url} download={document.name} aria-label={`Unduh ${document.name}`} className="inline-flex items-center gap-1.5 font-medium text-emerald-800 hover:underline">
        <Download aria-hidden="true" className="size-4" /> Unduh
      </a>
    </div>
  );
}

function ArchivedDocuments({ scope }: { scope: DocumentScope }) {
  const [documents, setDocuments] = useState<{ document: ArchivedProjectDocument; url: string }[] | null>(null);
  const [loadFailed, setLoadFailed] = useState(false);
  const { projectId, category, group } = scope;

  useEffect(() => {
    let active = true;
    const urls: string[] = [];
    listProjectDocuments({ projectId, category, group }).then(
      records => {
        if (!active) return;
        setDocuments(records.map(document => {
          const url = URL.createObjectURL(document.file);
          urls.push(url);
          return { document, url };
        }));
      },
      () => { if (active) setLoadFailed(true); },
    );
    return () => {
      active = false;
      urls.forEach(url => URL.revokeObjectURL(url));
    };
  }, [projectId, category, group]);

  return (
    <section className={panelClass + ' no-print'}>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">Dokumen yang diunggah</h3>
        <p className="text-sm text-slate-600">{storageNote}</p>
      </div>
      {loadFailed ? (
        <p role="alert" className="text-sm text-rose-700">Penyimpanan dokumen tidak dapat dibuka. Muat ulang halaman untuk mencoba lagi.</p>
      ) : !documents ? (
        <p role="status" className="text-sm text-slate-600">Memuat dokumen…</p>
      ) : documents.length === 0 ? (
        <p className="text-sm text-slate-600">Belum ada dokumen yang diunggah.</p>
      ) : (
        <ul className="divide-y divide-slate-100 border-t border-slate-100">
          {documents.map(({ document, url }) => (
            <li key={document.id} className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-3 text-sm">
              <div className="flex min-w-0 items-start gap-2.5">
                <FileText aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-slate-500" />
                <div className="min-w-0">
                  <p className="break-words font-semibold text-slate-900">{document.name}</p>
                  <p className="text-slate-600">{kindLabels[document.kind]} · {formatTanggalIndo(document.uploadedAt)} · {fileSize(document.file.size)}</p>
                </div>
              </div>
              <DocumentActions document={document} url={url} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

function UploadDocuments({ scope, onUploaded }: { scope: DocumentScope; onUploaded: () => void }) {
  const { currentUser } = useApp();
  const canUpload = hasPermission(currentUser?.role, scope.group === 'kontrak' ? 'edit_contract' : 'create_berita_acara');
  const pending = useRef(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');

  const upload = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (pending.current || !canUpload) return;
    const data = new FormData(event.currentTarget);
    const files = data.getAll('files').filter((entry): entry is File => entry instanceof File);
    const kind = scope.group === 'berita-acara' ? scope.group : data.get('kind') === 'addendum' ? 'addendum' : 'kontrak';

    pending.current = true;
    setIsUploading(true);
    setError('');
    try {
      await archiveProjectDocuments(scope, kind, files);
    } catch (cause) {
      const message = cause instanceof DOMException
        ? (cause.name === 'QuotaExceededError' ? 'Penyimpanan browser penuh.' : 'Penyimpanan browser tidak dapat digunakan.')
        : cause instanceof Error ? cause.message : 'Berkas gagal diunggah.';
      setError(message);
      return;
    } finally {
      pending.current = false;
      setIsUploading(false);
    }
    onUploaded();
  };

  return (
    <section className={panelClass + ' no-print'}>
      <div className="space-y-1">
        <h3 className="text-base font-semibold text-slate-900">Upload dokumen</h3>
        <p className="text-sm text-slate-600">{storageNote}</p>
      </div>
      {canUpload ? (
        <form onSubmit={upload} className="space-y-4">
          <fieldset disabled={isUploading} className="space-y-4">
            {scope.group === 'kontrak' && (
              <label className="grid max-w-xs gap-1 text-sm font-medium text-slate-700">
                Jenis dokumen
                <select name="kind" className="rounded-lg border border-slate-300 bg-white px-3 py-2">
                  <option value="kontrak">Kontrak</option>
                  <option value="addendum">Addendum</option>
                </select>
              </label>
            )}
            <label className="grid gap-1 text-sm font-medium text-slate-700">
              Pilih berkas
              <input name="files" type="file" accept={archiveFileFormats} required multiple className="w-full rounded-lg border border-slate-300 p-2 text-sm text-slate-700 file:mr-3 file:rounded-md file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:font-semibold file:text-slate-800" />
            </label>
            <p className="text-xs text-slate-600">PDF, Word, Excel, JPG, PNG, dan WebP.</p>
            {error && <p role="alert" className="text-sm text-rose-700">{error}</p>}
            <button type="submit" className="inline-flex items-center gap-2 rounded-lg bg-emerald-700 px-3 py-2 text-sm font-semibold text-white hover:bg-emerald-800 disabled:opacity-50">
              <Upload aria-hidden="true" className="size-4" /> {isUploading ? 'Mengunggah…' : 'Upload berkas'}
            </button>
          </fieldset>
        </form>
      ) : <p className="text-sm text-slate-600">Peran Anda tidak memiliki izin untuk mengunggah dokumen ini.</p>}
    </section>
  );
}

interface ProjectDocumentTabsProps {
  scope: DocumentScope;
  renderCreateDocument: (onCreated: () => void) => ReactNode;
  createAddendum?: ReactNode;
  savedDocuments?: ReactNode;
}

export function ProjectDocumentTabs({ scope, renderCreateDocument, createAddendum, savedDocuments }: ProjectDocumentTabsProps) {
  const [tab, setTab] = useState<'create' | 'addendum' | 'upload' | 'view'>('create');
  const [notice, setNotice] = useState('');
  const tabs = [
    { id: 'create', label: scope.group === 'kontrak' ? 'Buat kontrak' : 'Buat berita acara' },
    ...(createAddendum ? [{ id: 'addendum', label: 'Buat addendum' } as const] : []),
    { id: 'upload', label: 'Upload dokumen' },
    { id: 'view', label: 'Lihat dokumen' },
  ] as const;

  return (
    <div className="space-y-4">
      <nav aria-label={scope.group === 'kontrak' ? 'Dokumen kontrak dan addendum' : 'Dokumen berita acara'} className="flex flex-wrap gap-1.5 rounded-xl border border-slate-200 bg-white p-2 no-print">
        {tabs.map(({ id, label }) => (
          <button key={id} type="button" aria-current={tab === id ? 'page' : undefined} onClick={() => { setTab(id); setNotice(''); }}
            className={`rounded-lg px-3 py-2 text-sm font-semibold ${tab === id ? 'bg-emerald-100 text-emerald-900' : 'text-slate-600 hover:bg-slate-100'}`}>
            {label}
          </button>
        ))}
      </nav>
      {notice && <p role="status" className="text-sm font-medium text-emerald-800 no-print">{notice}</p>}
      {tab === 'create' && renderCreateDocument(() => { setTab('view'); setNotice('Berita acara berhasil dibuat.'); })}
      {tab === 'addendum' && createAddendum}
      {tab === 'upload' && <UploadDocuments scope={scope} onUploaded={() => { setTab('view'); setNotice('Berkas berhasil diunggah.'); }} />}
      {tab === 'view' && (
        <>
          <ArchivedDocuments scope={scope} />
          {savedDocuments}
        </>
      )}
    </div>
  );
}
