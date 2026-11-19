import React from 'react';

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

        // 1. Sub/nested items like 1), 2), 3), 4) or a), b)
        const subParenMatch = trimmed.match(/^(\d+|[a-zA-Z])\)\s+(.*)$/);
        if (subParenMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-6 sm:pl-8 text-justify">
              <span className="shrink-0 w-5 sm:w-6 font-serif font-medium text-left">{subParenMatch[1]})</span>
              <span className="flex-1 text-justify leading-relaxed">{subParenMatch[2]}</span>
            </div>
          );
        }

        // 2. Parenthesized letter/number like (a), (b), (c), (1), (2)
        const parenLetterMatch = trimmed.match(/^\(([a-zA-Z0-9]+)\)\s+(.*)$/);
        if (parenLetterMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5 sm:pl-1 text-justify">
              <span className="shrink-0 w-7 sm:w-8 font-serif font-medium text-left">({parenLetterMatch[1]})</span>
              <span className="flex-1 text-justify leading-relaxed">{parenLetterMatch[2]}</span>
            </div>
          );
        }

        // 3. Numbered list with dot like 1., 2., 3.
        const numDotMatch = trimmed.match(/^(\d+)\.\s+(.*)$/);
        if (numDotMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-0.5 sm:pl-1 text-justify">
              <span className="shrink-0 w-6 sm:w-7 font-serif font-medium text-left">{numDotMatch[1]}.</span>
              <span className="flex-1 text-justify leading-relaxed">{numDotMatch[2]}</span>
            </div>
          );
        }

        // 4. Letter with dot like a., b., c.
        const letterDotMatch = trimmed.match(/^([a-zA-Z])\.\s+(.*)$/);
        if (letterDotMatch) {
          return (
            <div key={idx} className="flex items-start gap-1.5 pl-4 sm:pl-6 text-justify">
              <span className="shrink-0 w-5 sm:w-6 font-serif font-medium text-left">{letterDotMatch[1]}.</span>
              <span className="flex-1 text-justify leading-relaxed">{letterDotMatch[2]}</span>
            </div>
          );
        }

        // 5. Standard paragraph
        return (
          <p key={idx} className="text-justify leading-relaxed">
            {trimmed}
          </p>
        );
      })}
    </div>
  );
};

