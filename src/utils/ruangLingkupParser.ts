export interface RuangLingkupParsedItem {
  id?: string;
  nama: string;
  subItems: string[];
}

/**
 * Parses a string, multi-line string, or array of strings into a structured
 * hierarchy of main items (numbered 1, 2, 3...) and sub-items (lettered a, b, c...).
 */
export function parseRuangLingkup(input: string[] | string | undefined | null): RuangLingkupParsedItem[] {
  if (!input) return [];

  const rawLines: string[] = Array.isArray(input)
    ? input
    : input.split('\n');

  const result: RuangLingkupParsedItem[] = [];

  for (let rawLine of rawLines) {
    if (!rawLine) continue;
    const trimmed = rawLine.trim();
    if (!trimmed) continue;

    // Skip intro line if inadvertently included
    if (/^ruang\s+lingkup\s+pekerjaan\s+(utama\s+)?terdiri\s+dari:?$/i.test(trimmed)) {
      continue;
    }

    // Check if line is indented by 2 or more spaces or a tab
    const hasIndent = /^\s{2,}|\t/.test(rawLine);

    // Matches 'a.', 'b.', 'a)', 'b)', '(a)', '(b)'
    const letterBulletMatch = trimmed.match(/^(\([a-z]\)|[a-z][\.\)])\s*(.*)$/i);

    // Matches '- ', '* ', '• '
    const symbolBulletMatch = trimmed.match(/^[-*•]\s*(.*)$/);

    // Matches '1.', '2)', '(1)'
    const numberBulletMatch = trimmed.match(/^(\(\d+\)|\d+[\.\)\-]?)\s*(.*)$/);

    const isSubItem = (hasIndent && !numberBulletMatch) || Boolean(letterBulletMatch) || (Boolean(symbolBulletMatch) && result.length > 0);

    if (isSubItem && result.length > 0) {
      let subText = trimmed;
      if (letterBulletMatch) {
        subText = letterBulletMatch[2].trim();
      } else if (symbolBulletMatch) {
        subText = symbolBulletMatch[1].trim();
      }
      if (subText) {
        result[result.length - 1].subItems.push(subText);
      }
    } else {
      let mainText = trimmed;
      if (numberBulletMatch) {
        mainText = numberBulletMatch[2].trim();
      }
      if (mainText) {
        result.push({
          nama: mainText,
          subItems: []
        });
      }
    }
  }

  return result;
}

/**
 * Formats structured RuangLingkupParsedItem array back into an array of formatted strings
 * with 1., 2., 3. and indented a., b., c...
 */
export function formatRuangLingkupToLines(items: RuangLingkupParsedItem[]): string[] {
  const lines: string[] = [];
  items.forEach((item, idx) => {
    lines.push(`${idx + 1}. ${item.nama}`);
    if (item.subItems && item.subItems.length > 0) {
      item.subItems.forEach((sub, sIdx) => {
        const letter = String.fromCharCode(97 + (sIdx % 26));
        lines.push(`   ${letter}. ${sub}`);
      });
    }
  });
  return lines;
}

/**
 * Formats structured items into multi-line string for textarea
 */
export function formatRuangLingkupToText(items: RuangLingkupParsedItem[]): string {
  return formatRuangLingkupToLines(items).join('\n');
}

