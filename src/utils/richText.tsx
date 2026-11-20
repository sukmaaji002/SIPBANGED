import React from 'react';

/**
 * Parses markdown and HTML formatting tags for legal contract clauses:
 * Supports:
 * - Bold: <b>...</b> or **...**
 * - Italic: <i>...</i> or *...*
 * - Underline: <u>...</u> or __...__
 * - Strikethrough: <s>...</s> or ~~...~~
 */
export function parseRichTextToHtml(rawText: string): string {
  if (!rawText) return '';

  let html = rawText;

  // Convert markdown bold **...** to <b>...</b>
  html = html.replace(/\*\*(.+?)\*\*/g, '<b>$1</b>');

  // Convert markdown italic *...* to <i>...</i>
  html = html.replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, '<i>$1</i>');

  // Convert markdown underline __...__ to <u>...</u>
  html = html.replace(/__(.+?)__/g, '<u>$1</u>');

  // Convert markdown strikethrough ~~...~~ to <s>...</s>
  html = html.replace(/~~(.+?)~~/g, '<s>$1</s>');

  return html;
}

interface RichSpanProps {
  text: string;
  className?: string;
}

export const RichSpan: React.FC<RichSpanProps> = ({ text, className = '' }) => {
  if (!text) return null;
  const html = parseRichTextToHtml(text);
  return <span className={className} dangerouslySetInnerHTML={{ __html: html }} />;
};
