import { getRecentLinks } from '@/lib/actions';
import { ShortenForm } from '@/components/ShortenForm';
import { LinkCard } from '@/components/LinkCard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shorten. Share. Track.',
};

export default async function HomePage() {
  const recentLinks = await getRecentLinks();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16">
      {/* Hero */}
      <section className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Self-hosted · Zero setup · Instant analytics
        </div>
        <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight mb-4 leading-tight">
          <span className="bg-gradient-to-r from-violet-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
            Shorten.
          </span>{' '}
          <span className="bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 bg-clip-text text-transparent">
            Share.
          </span>{' '}
          <span className="bg-gradient-to-r from-rose-400 via-orange-400 to-amber-400 bg-clip-text text-transparent">
            Track.
          </span>
        </h1>
        <p className="text-gray-400 text-lg max-w-xl mx-auto leading-relaxed">
          Paste any long URL and get a clean short link in seconds. Every click
          is tracked — no sign-up, no cloud, no nonsense.
        </p>
      </section>

      {/* Shorten Form */}
      <section className="mb-20">
        <ShortenForm />
      </section>

      {/* Recent Links */}
      {recentLinks.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-200">
              Recent links
            </h2>
            <a
              href="/dashboard"
              className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
            >
              View all →
            </a>
          </div>
          <div className="space-y-3">
            {recentLinks.map((link) => (
              <LinkCard key={link.code} link={link} />
            ))}
          </div>
        </section>
      )}

      {recentLinks.length === 0 && (
        <section className="text-center py-12">
          <div className="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-gray-600"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <p className="text-gray-500 text-sm">
            No links yet. Paste a URL above to get started.
          </p>
        </section>
      )}
    </div>
  );
}
