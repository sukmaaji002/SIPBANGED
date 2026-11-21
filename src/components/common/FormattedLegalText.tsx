import React from 'react';
import { RichSpan } from '../../utils/richText';

interface FormattedLegalTextProps {
  text: string;
  className?: string;
  itemSpacing?: string;
}

export const FormattedLegalText: React.FC<FormattedLegalTextProps> = ({ 
  text, 
  className = '',
  itemSpacing = 'space-y-1.5'
}) => {
  if (!text) return null;

  const rawLines = text.split('\n');

  return (
    <div className={`${itemSpacing} ${className} font-serif text-justify leading-relaxed`}>
      {rawLines.map((rawLine, idx) => {
        const trimmed = rawLine.trim();
        if (!trimmed) {
          return <div key={idx} className="h-1" />;
        }

        // Measure leading whitespace indentation to preserve nesting hierarchy
        const leadingSpaces = rawLine.match(/^(\s*)/)?.[1].length || 0;

        // 1. Roman numerals: i., ii., iii., iv., v. (gambar 2)
        // Must align with the first letter of parent number 1) / 2) -> pl-12
        const romanMatch = trimmed.match(/^(i{1,3}|iv|v|vi{0,3}|ix|x)\.\s+(.*)$/i);
        if (romanMatch) {
          return (
            <div key={idx} className="flex items-start text-justify pl-12" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-6 font-serif font-medium text-left">{romanMatch[1].toLowerCase()}.</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={romanMatch[2]} />
              </div>
            </div>
          );
        }

        // 2. Bullet points: •, -, * (gambar 1)
        // Must align with the first letter of parent letter a., b., c. -> pl-6
        const bulletMatch = trimmed.match(/^([•\-\*])\s+(.*)$/);
        if (bulletMatch) {
          return (
            <div key={idx} className="flex items-start text-justify pl-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-5 font-serif text-left font-bold">{bulletMatch[1]}</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={bulletMatch[2]} />
              </div>
            </div>
          );
        }

        // 3. Sub-items with parenthesis: 1), 2), 3) or a), b)
        const subParenMatch = trimmed.match(/^(\d+|[a-zA-Z])\)\s+(.*)$/);
        if (subParenMatch) {
          const paddingClass = leadingSpaces >= 6 ? 'pl-12' : 'pl-6';
          return (
            <div key={idx} className={`flex items-start text-justify ${paddingClass}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-6 font-serif font-medium text-left">{subParenMatch[1]})</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={subParenMatch[2]} />
              </div>
            </div>
          );
        }

        // 4. Parenthesized letter/number like (a), (b), (c), (1), (2)
        const parenLetterMatch = trimmed.match(/^\(([a-zA-Z0-9]+)\)\s+(.*)$/);
        if (parenLetterMatch) {
          const paddingClass = leadingSpaces >= 6 ? 'pl-12' : 'pl-6';
          return (
            <div key={idx} className={`flex items-start text-justify ${paddingClass}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-7 font-serif font-medium text-left">({parenLetterMatch[1]})</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={parenLetterMatch[2]} />
              </div>
            </div>
          );
        }

        // 5. Letter with dot like a., b., c.
        const letterDotMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)$/);
        if (letterDotMatch) {
          // If it has leading spaces (e.g. child under 1., 2. as in Pasal 15 or under e. in Pasal 10), use pl-6!
          const paddingClass = leadingSpaces >= 2 ? 'pl-6' : '';
          return (
            <div key={idx} className={`flex items-start text-justify ${paddingClass}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-6 font-serif font-medium text-left">{letterDotMatch[1]}.</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={letterDotMatch[2]} />
              </div>
            </div>
          );
        }

        // 6. Numbered list with dot like 1., 2., 3.
        const numDotMatch = trimmed.match(/^(\d+(?:\.\d+)*)\.\s+(.*)$/);
        if (numDotMatch) {
          // If leadingSpaces >= 2 (nested under a letter), use pl-6.
          // If leadingSpaces === 0 (top-level numbers like 1. and 2. in Pasal 15), NO extra pl-6! (gambar 3)
          const paddingClass = leadingSpaces >= 2 ? 'pl-6' : '';
          return (
            <div key={idx} className={`flex items-start text-justify ${paddingClass}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-6 font-serif font-medium text-left">{numDotMatch[1]}.</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={numDotMatch[2]} />
              </div>
            </div>
          );
        }

        // 7. Standard paragraph / continuation text
        // If it has leading spaces in source (like "Laporan Akhir..." under 1. in Pasal 15 or quote), indent it with pl-6!
        const paddingClass = leadingSpaces >= 2 ? 'pl-6' : '';
        return (
          <p key={idx} className={`text-justify leading-relaxed ${paddingClass}`} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <RichSpan text={trimmed} />
          </p>
        );
      })}
    </div>
  );
};

