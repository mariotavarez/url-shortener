'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import clsx from 'clsx';

interface CopyButtonProps {
  text: string;
  size?: 'sm' | 'md';
  className?: string;
}

export function CopyButton({ text, size = 'sm', className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.left = '-9999px';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      onClick={handleCopy}
      title={copied ? 'Copied!' : 'Copy to clipboard'}
      className={clsx(
        'inline-flex items-center gap-1.5 rounded-lg font-medium transition-all',
        size === 'sm' && 'px-2.5 py-1.5 text-xs',
        size === 'md' && 'px-3 py-2 text-sm',
        copied
          ? 'bg-green-500/15 text-green-400 border border-green-500/30'
          : 'bg-gray-800 text-gray-400 border border-gray-700 hover:bg-gray-700 hover:text-gray-200',
        className
      )}
    >
      {copied ? (
        <>
          <Check className={clsx(size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          Copied!
        </>
      ) : (
        <>
          <Copy className={clsx(size === 'sm' ? 'w-3 h-3' : 'w-4 h-4')} />
          Copy
        </>
      )}
    </button>
  );
}
