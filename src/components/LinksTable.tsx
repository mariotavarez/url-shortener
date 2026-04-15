'use client';

import { useState, useTransition } from 'react';
import { deleteLink } from '@/lib/actions';
import { CopyButton } from '@/components/CopyButton';
import { formatDate, truncate } from '@/lib/utils';
import {
  Trash2,
  ExternalLink,
  ChevronUp,
  ChevronDown,
  ChevronsUpDown,
  MousePointerClick,
  Loader2,
} from 'lucide-react';
import clsx from 'clsx';
import type { Link, SortField, SortOrder } from '@/types';
import { useRouter } from 'next/navigation';

interface LinksTableProps {
  links: Link[];
  currentSort: SortField;
  currentOrder: SortOrder;
}

export function LinksTable({ links, currentSort, currentOrder }: LinksTableProps) {
  const router = useRouter();
  const [deletingCode, setDeletingCode] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSort(field: SortField) {
    const newOrder =
      currentSort === field && currentOrder === 'desc' ? 'asc' : 'desc';
    router.push(`/dashboard?sort=${field}&order=${newOrder}`);
  }

  function handleDelete(code: string) {
    if (!confirm('Delete this link? This action cannot be undone.')) return;
    setDeletingCode(code);
    startTransition(async () => {
      try {
        await deleteLink(code);
      } finally {
        setDeletingCode(null);
      }
    });
  }

  function SortIcon({ field }: { field: SortField }) {
    if (currentSort !== field)
      return <ChevronsUpDown className="w-3.5 h-3.5 text-gray-600" />;
    return currentOrder === 'desc' ? (
      <ChevronDown className="w-3.5 h-3.5 text-violet-400" />
    ) : (
      <ChevronUp className="w-3.5 h-3.5 text-violet-400" />
    );
  }

  if (links.length === 0) {
    return (
      <div className="px-6 py-16 text-center">
        <div className="w-12 h-12 rounded-2xl bg-gray-800 border border-gray-700 flex items-center justify-center mx-auto mb-4">
          <MousePointerClick className="w-5 h-5 text-gray-600" />
        </div>
        <p className="text-gray-500 text-sm">No links yet.</p>
        <a
          href="/"
          className="text-violet-400 text-sm hover:text-violet-300 mt-1 inline-block"
        >
          Create your first short link →
        </a>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-800">
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Short URL
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Original URL
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('created_at')}
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                Created
                <SortIcon field="created_at" />
              </button>
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <button
                onClick={() => handleSort('clicks')}
                className="flex items-center gap-1 hover:text-gray-300 transition-colors"
              >
                Clicks
                <SortIcon field="clicks" />
              </button>
            </th>
            <th className="text-left px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-800/60">
          {links.map((link) => {
            const isDeleting = deletingCode === link.code && isPending;
            return (
              <tr
                key={link.code}
                className={clsx(
                  'hover:bg-gray-800/40 transition-colors group',
                  isDeleting && 'opacity-50'
                )}
              >
                {/* Short URL */}
                <td className="px-6 py-4">
                  <span className="font-mono text-violet-400 font-semibold">
                    /{link.code}
                  </span>
                </td>

                {/* Original URL */}
                <td className="px-6 py-4 max-w-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className="text-gray-400 truncate block"
                      title={link.original_url}
                    >
                      {truncate(link.original_url, 45)}
                    </span>
                    <a
                      href={link.original_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 text-gray-700 hover:text-gray-400 opacity-0 group-hover:opacity-100 transition-all"
                      title="Open original URL"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </div>
                </td>

                {/* Created */}
                <td className="px-6 py-4 text-gray-500">
                  {formatDate(link.created_at)}
                </td>

                {/* Clicks */}
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-1.5 text-gray-300 font-medium">
                    <MousePointerClick className="w-3.5 h-3.5 text-gray-600" />
                    {link.clicks.toLocaleString()}
                  </span>
                </td>

                {/* Actions */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <CopyButton
                      text={`${typeof window !== 'undefined' ? window.location.origin : ''}/${link.code}`}
                      size="sm"
                    />
                    <button
                      onClick={() => handleDelete(link.code)}
                      disabled={isDeleting}
                      title="Delete link"
                      className={clsx(
                        'inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg transition-all border',
                        isDeleting
                          ? 'bg-gray-800 text-gray-600 border-gray-700 cursor-not-allowed'
                          : 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20'
                      )}
                    >
                      {isDeleting ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <Trash2 className="w-3 h-3" />
                      )}
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
