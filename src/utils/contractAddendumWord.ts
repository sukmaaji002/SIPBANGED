import {
  AlignmentType, BorderStyle, Document, Footer, ImageRun, Packer, Paragraph, Tab, Table, TableCell, TableRow,
  TextRun, VerticalAlign, WidthType, type IParagraphOptions, type IRunOptions,
} from 'docx';
import type { ContractAddendumDocument } from '../types';

const page = { width: 12240, height: 18720 };
const margin = { top: 1338, right: 851, bottom: 1701, left: 1418, footer: 720 };
const contentWidth = page.width - margin.left - margin.right;
const noBorder = { style: BorderStyle.NONE };

const paragraphStyles: Record<string, IParagraphOptions> = {
  government: { spacing: { line: 340, lineRule: 'exact' } },
  department: { spacing: { line: 430, lineRule: 'exact' } },
  contact: { spacing: { line: 240, lineRule: 'exact' } },
  title: { spacing: { after: 0, line: 410, lineRule: 'exact' }, keepNext: true },
  'document-number': { spacing: { before: 280 }, keepNext: true },
  'main-heading': { keepNext: true },
  'package-title': { spacing: { before: 200 }, keepNext: true },
  'clause-heading': { spacing: { before: 100, after: 60 }, keepNext: true },
  'clause-label': { indent: { left: 420 }, spacing: { before: 140 }, keepNext: true },
  'clause-content': { indent: { left: 420 }, spacing: { before: 40 }, alignment: AlignmentType.LEFT },
};

const textStyles: Record<string, IRunOptions> = {
  government: { size: 30 },
  department: { size: 40, bold: true },
  contact: { size: 21 },
  title: { size: 36, bold: true },
  'document-number': { size: 24 },
  'document-date': { size: 24 },
  'project-summary': { size: 24, bold: true },
  'provider-name': { size: 36, bold: true },
  'main-heading': { bold: true },
  'clause-label': { bold: true },
};

function runs(node: Node, style: IRunOptions): (TextRun | ImageRun)[] {
  if (node.nodeType === Node.TEXT_NODE) {
    const text = node.textContent ?? '';
    return text.includes('\n') ? text.split(/\r?\n/).map((line, index) =>
      new TextRun({ ...style, text: line, break: index ? 1 : undefined })) : [new TextRun({ ...style, text })];
  }
  if (!(node instanceof HTMLElement)) return [];
  if (node instanceof HTMLImageElement) {
    return [new ImageRun({
      type: 'jpg', data: Uint8Array.from(atob(node.src.split(',')[1]), value => value.charCodeAt(0)),
      transformation: { width: node.width, height: node.height },
    })];
  }
  if (node.tagName === 'BR') return [new TextRun({ break: 1 })];
  const inherited = {
    ...style, ...textStyles[node.className],
    ...(['B', 'STRONG'].includes(node.tagName) && { bold: true }),
    ...(['I', 'EM'].includes(node.tagName) && { italics: true }),
    ...(node.tagName === 'U' && { underline: {} }),
    ...(node.tagName === 'S' && { strike: true }),
    ...(node.style.fontFamily && { font: node.style.fontFamily.replaceAll('"', '') }),
    ...(node.style.fontSize && { size: parseFloat(node.style.fontSize) * 2 }),
  };
  return Array.from(node.childNodes).flatMap(child => runs(child, inherited));
}

function paragraphs(element: HTMLElement, layout: IParagraphOptions = {}, style: IRunOptions = {}): Paragraph[] {
  const options = { ...layout, ...paragraphStyles[element.className] };
  const font = { ...style, ...textStyles[element.className] };
  const alignment = { left: AlignmentType.LEFT, center: AlignmentType.CENTER, right: AlignmentType.RIGHT, justify: AlignmentType.JUSTIFIED };
  const align = alignment[element.style.textAlign as keyof typeof alignment] ?? options.alignment;
  if (element instanceof HTMLOListElement || element instanceof HTMLUListElement) {
    return Array.from(element.children).flatMap((item, index) => {
      const li = item as HTMLElement;
      const prefix = new TextRun({ children: [element instanceof HTMLOListElement ? index + 1 + '.' : '•', new Tab()] });
      const indent = Number(options.indent?.left ?? 0) + 420;
      const body = Array.from(li.childNodes).filter(child => !(child instanceof HTMLOListElement || child instanceof HTMLUListElement));
      const lists = Array.from(li.children).filter(child => child instanceof HTMLOListElement || child instanceof HTMLUListElement);
      return [
        new Paragraph({ ...options, alignment: align, indent: { left: indent, hanging: 400 },
          children: [prefix, ...body.flatMap(node => runs(node, font))] }),
        ...lists.flatMap(list => paragraphs(list as HTMLElement, { indent: { left: indent }, alignment: align }, font)),
      ];
    });
  }
  const result: Paragraph[] = [];
  let inline: (TextRun | ImageRun)[] = [];
  const flush = () => {
    if (inline.length) result.push(new Paragraph({ ...options, alignment: align, children: inline }));
    inline = [];
  };
  for (const child of element.childNodes) {
    if (child instanceof HTMLElement && /^(P|DIV|UL|OL|BLOCKQUOTE)$/.test(child.tagName)) {
      flush();
      result.push(...paragraphs(child, { ...options, alignment: align }, font));
    } else if (child.nodeType !== Node.TEXT_NODE || child.textContent?.trim() || inline.length) {
      if (child.nodeType !== Node.TEXT_NODE || child.textContent?.trim() || !child.textContent?.includes('\n')) inline.push(...runs(child, font));
    }
  }
  flush();
  return result.length ? result : [new Paragraph(options)];
}

function table(element: HTMLTableElement): Table {
  const kind = element.className;
  const widths = kind === 'letterhead' ? [1659, contentWidth - 1659] :
    kind === 'cover-data' ? [2727, 297, contentWidth - 3024] :
    kind === 'paraf' ? [3320, 780] : [Math.floor(contentWidth / 2), Math.ceil(contentWidth / 2)];
  const border = { style: BorderStyle.SINGLE, size: 18 };
  const visible = { style: BorderStyle.SINGLE, size: 4 };
  return new Table({
    width: { size: widths.reduce((sum, width) => sum + width, 0), type: WidthType.DXA },
    columnWidths: widths,
    margins: { left: 55, right: 55, top: 15, bottom: kind === 'letterhead' ? 130 : 15 },
    borders: kind === 'paraf' ? {
      top: visible, bottom: visible, left: visible, right: visible, insideHorizontal: visible, insideVertical: visible,
    } : {
      top: noBorder, bottom: kind === 'letterhead' ? border : noBorder, left: noBorder, right: noBorder,
      insideHorizontal: noBorder, insideVertical: noBorder,
    },
    rows: Array.from(element.rows).map((row, index) => new TableRow({
      cantSplit: true,
      children: Array.from(row.cells).map((cell, column) => new TableCell({
        width: { size: widths[column], type: WidthType.DXA },
        verticalAlign: kind === 'letterhead' ? VerticalAlign.CENTER : VerticalAlign.TOP,
        ...(kind === 'signatures' && index === 1 && { margins: { top: 1100 } }),
        ...(kind === 'paraf' && { margins: { top: 110, bottom: 110, left: 120 } }),
        children: paragraphs(cell, {
          alignment: kind === 'cover-data' || kind === 'paraf' || cell.className === 'crest' ? AlignmentType.LEFT : AlignmentType.CENTER,
          keepNext: kind === 'signatures' && index === 0,
          spacing: kind === 'letterhead' ? { after: 0 } : { after: 0, line: kind === 'paraf' ? 210 : 250, lineRule: 'exact' },
        }, kind === 'paraf' ? { size: 14 } : {}),
      })),
    })),
  });
}

export async function downloadContractAddendum(document: ContractAddendumDocument, html: string) {
  const pageDom = new DOMParser().parseFromString(html, 'text/html');
  const cover = pageDom.querySelector<HTMLElement>('.cover')!;
  const body = pageDom.querySelector<HTMLElement>('.main-document')!;
  const footer = pageDom.querySelector<HTMLElement>('.footer')!;
  const footerTable = footer.querySelector('table')!;
  footerTable.className = 'paraf';
  const center = { alignment: AlignmentType.CENTER };
  const afterLetterhead = () => new Paragraph({ spacing: { after: 180, line: 80, lineRule: 'exact' } });
  const summary = Array.from(cover.querySelectorAll<HTMLElement>('.project-summary > p'));
  const summaryParagraphs = summary.flatMap((element, index) => paragraphs(element, {
    ...center, spacing: { before: index === 0 ? 480 : 20, after: index === summary.length - 1 ? 200 : 0, line: 265 },
    indent: { left: 120, right: 120 }, keepNext: true,
  }, textStyles['project-summary']));
  const footerContent = new Footer({
    children: [new Table({
      width: { size: contentWidth, type: WidthType.DXA }, columnWidths: [contentWidth - 4100, 4100],
      borders: { top: { style: BorderStyle.SINGLE, size: 6 }, bottom: noBorder, left: noBorder, right: noBorder, insideHorizontal: noBorder, insideVertical: noBorder },
      rows: [new TableRow({ children: [
        new TableCell({ margins: { top: 85 }, children: [
          new Paragraph({ children: [new TextRun({ size: 16, italics: true, text: footer.querySelector('span')?.textContent ?? '' })] }),
        ] }),
        new TableCell({ children: [table(footerTable), new Paragraph({ spacing: { line: 20, lineRule: 'exact' } })] }),
      ] })],
    })],
  });
  const word = new Document({
    styles: { default: { document: { run: { font: 'Trebuchet MS', size: 22 }, paragraph: { spacing: { after: 0, line: 276 } } } } },
    sections: [{
      properties: { page: { size: page, margin } },
      footers: { default: footerContent },
      children: [
        table(cover.querySelector('table')!), afterLetterhead(),
        ...Array.from(cover.querySelectorAll<HTMLElement>(':scope > p')).flatMap(element => paragraphs(element, center)),
        ...summaryParagraphs,
        table(cover.querySelector<HTMLTableElement>('.cover-data')!),
        new Paragraph({ spacing: { before: 100, after: 250, line: 100, lineRule: 'exact' }, border: { bottom: { style: BorderStyle.SINGLE, size: 18, space: 3 } } }),
        ...paragraphs(cover.querySelector<HTMLElement>('.provider')!, center),
        new Paragraph({ pageBreakBefore: true, spacing: { line: 20, lineRule: 'exact' } }),
        table(body.querySelector('table')!), afterLetterhead(),
        ...paragraphs(body.querySelector<HTMLElement>('.main-heading')!, center),
        new Paragraph({ spacing: { after: 220 } }),
        ...Array.from(body.querySelector<HTMLElement>('.narrative')!.children).flatMap(element => {
          const layout = { alignment: AlignmentType.JUSTIFIED, spacing: { after: 170 } };
          return element.tagName === 'SECTION'
            ? Array.from(element.children).flatMap(article => paragraphs(article as HTMLElement))
            : paragraphs(element as HTMLElement, layout);
        }),
        table(body.querySelector<HTMLTableElement>('.signatures')!),
      ],
    }],
  });
  const url = URL.createObjectURL(await Packer.toBlob(word));
  const link = window.document.createElement('a');
  link.href = url;
  link.download = 'Addendum-' + document.nomor.replace(/[^a-z0-9.-]+/gi, '-') + '.docx';
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
