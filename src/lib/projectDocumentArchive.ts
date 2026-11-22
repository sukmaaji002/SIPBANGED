import type { SpkType } from '../types';

export type DocumentGroup = 'kontrak' | 'berita-acara';
export type DocumentKind = DocumentGroup | 'addendum';

export interface DocumentScope {
  projectId: string;
  category: SpkType;
  group: DocumentGroup;
}

export interface ArchivedProjectDocument extends DocumentScope {
  id: string;
  kind: DocumentKind;
  name: string;
  uploadedAt: string;
  file: Blob;
  previewType?: string;
}

export const archiveFileFormats = '.pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.webp';
const databaseName = 'sipbanged-project-documents';
const storeName = 'documents';
const scopeIndex = 'by-project-category-group';

function openArchive(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(databaseName, 1);
    request.onupgradeneeded = () => {
      const documents = request.result.createObjectStore(storeName, { keyPath: 'id' });
      documents.createIndex(scopeIndex, ['projectId', 'category', 'group']);
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function archiveTransaction<T>(mode: IDBTransactionMode, run: (store: IDBObjectStore) => T): Promise<T> {
  const database = await openArchive();
  try {
    return await new Promise<T>((resolve, reject) => {
      const transaction = database.transaction(storeName, mode);
      const result = run(transaction.objectStore(storeName));
      transaction.oncomplete = () => resolve(result);
      transaction.onabort = () => reject(transaction.error);
    });
  } finally {
    database.close();
  }
}

export async function listProjectDocuments(scope: DocumentScope): Promise<ArchivedProjectDocument[]> {
  const request = await archiveTransaction('readonly', store =>
    store.index(scopeIndex).getAll([scope.projectId, scope.category, scope.group]),
  );
  return (request.result as ArchivedProjectDocument[]).sort((a, b) => b.uploadedAt.localeCompare(a.uploadedAt));
}

async function getPreviewType(file: File): Promise<string | undefined> {
  const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
  const header = new TextDecoder().decode(bytes);
  if (header.startsWith('%PDF-')) return 'application/pdf';
  if (bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff) return 'image/jpeg';
  if (bytes[0] === 0x89 && header.slice(1, 4) === 'PNG') return 'image/png';
  if (header.startsWith('RIFF') && header.slice(8, 12) === 'WEBP') return 'image/webp';
  return undefined;
}

export async function archiveProjectDocuments(scope: DocumentScope, kind: DocumentKind, files: File[]): Promise<void> {
  const validKind = scope.group === 'kontrak' ? kind === 'kontrak' || kind === 'addendum' : kind === 'berita-acara';
  if (!validKind || files.length === 0) throw new Error('Pilih jenis dokumen dan berkas terlebih dahulu.');

  const allowed = archiveFileFormats.split(',');
  const uploadedAt = new Date().toISOString();
  const documents = await Promise.all(files.map(async file => {
    const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
    if (!allowed.includes(extension) || !file.size) {
      throw new Error(`Berkas “${file.name}” kosong atau formatnya tidak didukung.`);
    }

    const previewType = await getPreviewType(file);
    return {
      ...scope,
      id: crypto.randomUUID(),
      kind,
      name: file.name,
      uploadedAt,
      file: file.slice(0, file.size, previewType ?? 'application/octet-stream'),
      previewType,
    } satisfies ArchivedProjectDocument;
  }));

  await archiveTransaction('readwrite', store => {
    for (const document of documents) store.add(document);
  });
}
