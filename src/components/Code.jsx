import { useState } from 'react';

export default function Code({ children, language = '' }) {
  const [copied, setCopied] = useState(false);

  function copy() {
    navigator.clipboard.writeText(children.trim()).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="relative my-5 rounded-xl overflow-hidden border border-border bg-[#0A0F0B]">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border">
        <span className="text-[10px] font-mono text-muted uppercase tracking-widest">
          {language || 'code'}
        </span>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] text-muted hover:text-accent transition-colors"
        >
          {copied ? (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      {/* Code */}
      <pre className="px-5 py-4 text-[0.8rem] leading-relaxed overflow-x-auto"
        style={{ color: '#7FDED2' }}>
        <code>{children.trim()}</code>
      </pre>
    </div>
  );
}
