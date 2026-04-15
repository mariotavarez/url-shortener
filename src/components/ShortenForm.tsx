'use client';

import { useState, useTransition } from 'react';
import { shortenUrl } from '@/lib/actions';
import { CopyButton } from '@/components/CopyButton';
import { Link2, Loader2, Sparkles } from 'lucide-react';
import clsx from 'clsx';

export function ShortenForm() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<{ code: string; shortUrl: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setResult(null);

    if (!url.trim()) {
      setError('Please enter a URL.');
      return;
    }

    startTransition(async () => {
      try {
        const data = await shortenUrl(url.trim());
        setResult(data);
        setUrl('');
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Something went wrong.');
      }
    });
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <form onSubmit={handleSubmit}>
        <div className="flex gap-2 p-1.5 bg-gray-900 border border-gray-700 rounded-2xl focus-within:border-violet-500/60 focus-within:ring-1 focus-within:ring-violet-500/30 transition-all">
          <div className="flex items-center pl-3 text-gray-500 shrink-0">
            <Link2 className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              if (error) setError(null);
              if (result) setResult(null);
            }}
            placeholder="Paste your long URL here… e.g. https://example.com/very/long/path"
            className="flex-1 bg-transparent text-sm text-gray-100 placeholder-gray-600 outline-none px-2 py-2.5 min-w-0"
            disabled={isPending}
            autoFocus
          />
          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className={clsx(
              'flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shrink-0',
              isPending || !url.trim()
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30'
            )}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Shortening…</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Shorten</span>
              </>
            )}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="mt-3 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-xl text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Result */}
      {result && (
        <div className="mt-4 p-4 bg-gray-900 border border-violet-500/30 rounded-2xl animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400" />
            <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
              Link created
            </span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <a
              href={result.shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 font-mono text-violet-400 text-base font-semibold hover:text-violet-300 transition-colors truncate"
            >
              {result.shortUrl}
            </a>
            <CopyButton text={result.shortUrl} size="md" />
          </div>
        </div>
      )}
    </div>
  );
}
