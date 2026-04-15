import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'URL Shortener — Shorten. Share. Track.',
    template: '%s | URL Shortener',
  },
  description:
    'Shorten URLs, share them instantly, and track every click with a built-in analytics dashboard. Self-hosted, no sign-up required.',
  keywords: ['url shortener', 'link shortener', 'click tracking', 'analytics'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-gray-950 text-gray-100 antialiased">
        <nav className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
            <a
              href="/"
              className="flex items-center gap-2 font-bold text-lg tracking-tight text-white hover:text-violet-400 transition-colors"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-violet-500"
                aria-hidden="true"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
              </svg>
              Shortify
            </a>
            <div className="flex items-center gap-1">
              <a
                href="/"
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                Home
              </a>
              <a
                href="/dashboard"
                className="px-3 py-1.5 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
              >
                Dashboard
              </a>
            </div>
          </div>
        </nav>
        <main>{children}</main>
        <footer className="border-t border-gray-800 mt-24 py-8">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 text-center text-sm text-gray-600">
            Built with Next.js 15 · SQLite · Tailwind v4 &mdash; No sign-up,
            no cloud, your data stays local.
          </div>
        </footer>
      </body>
    </html>
  );
}
