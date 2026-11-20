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

        // 1. Sub-sub-items with parenthesis: 1), 2), 3) or a), b)
        const subParenMatch = trimmed.match(/^(\d+|[a-zA-Z])\)\s+(.*)$/);
        if (subParenMatch) {
          return (
            <div key={idx} className="flex items-start text-justify pl-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-6 font-serif font-medium text-left">{subParenMatch[1]})</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={subParenMatch[2]} />
              </div>
            </div>
          );
        }

        // 2. Parenthesized letter/number like (a), (b), (c), (1), (2)
        const parenLetterMatch = trimmed.match(/^\(([a-zA-Z0-9]+)\)\s+(.*)$/);
        if (parenLetterMatch) {
          return (
            <div key={idx} className="flex items-start text-justify pl-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-7 font-serif font-medium text-left">({parenLetterMatch[1]})</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={parenLetterMatch[2]} />
              </div>
            </div>
          );
        }

        // 3. Numbered list with dot like 1., 2., 3. or 14.1.
        const numDotMatch = trimmed.match(/^(\d+(?:\.\d+)*)\.\s+(.*)$/);
        if (numDotMatch) {
          return (
            <div key={idx} className="flex items-start text-justify pl-6" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-6 font-serif font-medium text-left">{numDotMatch[1]}.</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={numDotMatch[2]} />
              </div>
            </div>
          );
        }

        // 4. Letter with dot like a., b., c.
        const letterDotMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)$/);
        if (letterDotMatch) {
          return (
            <div key={idx} className="flex items-start text-justify" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
              <span className="shrink-0 w-6 font-serif font-medium text-left">{letterDotMatch[1]}.</span>
              <div className="flex-1 text-justify leading-relaxed">
                <RichSpan text={letterDotMatch[2]} />
              </div>
            </div>
          );
        }

        // 5. Standard paragraph (aligns flush with the container)
        return (
          <p key={idx} className="text-justify leading-relaxed" style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
            <RichSpan text={trimmed} />
          </p>
        );
      })}
    </div>
  );
};

