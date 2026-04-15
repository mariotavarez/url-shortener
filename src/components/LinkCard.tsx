import { CopyButton } from '@/components/CopyButton';
import { MousePointerClick, ExternalLink } from 'lucide-react';
import { formatDate, truncate } from '@/lib/utils';
import type { Link } from '@/types';

interface LinkCardProps {
  link: Link;
  baseUrl?: string;
}

export function LinkCard({ link, baseUrl = '' }: LinkCardProps) {
  const shortUrl = baseUrl
    ? `${baseUrl}/${link.code}`
    : `/${link.code}`;

  const displayShortUrl = baseUrl
    ? `${baseUrl.replace(/^https?:\/\//, '')}/${link.code}`
    : link.code;

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-gray-700 transition-colors group">
      {/* Short URL */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <a
            href={shortUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-violet-400 text-sm font-semibold hover:text-violet-300 transition-colors truncate"
          >
            {displayShortUrl}
          </a>
          <a
            href={link.original_url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
            title="Open original URL"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
        <p className="text-xs text-gray-600 truncate" title={link.original_url}>
          {truncate(link.original_url, 60)}
        </p>
      </div>

      {/* Meta */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <MousePointerClick className="w-3.5 h-3.5" />
          <span>{link.clicks}</span>
        </div>
        <span className="text-xs text-gray-600 hidden sm:block">
          {formatDate(link.created_at)}
        </span>
        <CopyButton text={shortUrl} size="sm" />
      </div>
    </div>
  );
}
