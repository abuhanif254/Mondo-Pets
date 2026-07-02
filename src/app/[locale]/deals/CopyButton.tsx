'use client';

import * as React from 'react';
import { Copy, CheckCircle2 } from 'lucide-react';

export function CopyButton({ code }: { code: string }) {
  const [copied, setCopied] = React.useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button 
      onClick={handleCopy}
      className="flex flex-col items-center justify-center gap-1 bg-secondary text-secondary-foreground py-2 px-4 rounded-xl border border-transparent hover:border-border transition-all group"
      title="Copy to clipboard"
    >
      <div className="flex items-center gap-1.5 font-mono font-bold tracking-wider text-sm">
        {code}
      </div>
      <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest text-muted-foreground group-hover:text-foreground transition-colors">
        {copied ? (
          <><CheckCircle2 className="w-3 h-3 text-green-500" /> Copied!</>
        ) : (
          <><Copy className="w-3 h-3" /> Copy Code</>
        )}
      </div>
    </button>
  );
}
