import { getLinks, getStats } from '@/lib/actions';
import { StatsCard } from '@/components/StatsCard';
import { LinksTable } from '@/components/LinksTable';
import { BarChart3, Link2, MousePointerClick, CalendarDays } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Analytics Dashboard',
};

interface DashboardPageProps {
  searchParams: Promise<{ sort?: string; order?: string }>;
}

export default async function DashboardPage({ searchParams }: DashboardPageProps) {
  const sp = await searchParams;
  const sort = sp.sort === 'clicks' ? 'clicks' : 'created_at';
  const order = sp.order === 'asc' ? 'asc' : 'desc';

  const [stats, links] = await Promise.all([
    getStats(),
    getLinks(sort, order),
  ]);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-9 h-9 rounded-xl bg-violet-500/15 flex items-center justify-center">
            <BarChart3 className="w-5 h-5 text-violet-400" />
          </div>
          <h1 className="text-2xl font-bold text-white">Analytics Dashboard</h1>
        </div>
        <p className="text-gray-500 text-sm ml-12">
          All your shortened links and their performance at a glance.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        <StatsCard
          label="Total Links"
          value={stats.totalLinks}
          icon={<Link2 className="w-5 h-5" />}
          color="violet"
        />
        <StatsCard
          label="Total Clicks"
          value={stats.totalClicks}
          icon={<MousePointerClick className="w-5 h-5" />}
          color="purple"
        />
        <StatsCard
          label="Links Today"
          value={stats.linksToday}
          icon={<CalendarDays className="w-5 h-5" />}
          color="fuchsia"
        />
      </div>

      {/* Links Table */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="font-semibold text-gray-100">All Links</h2>
          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-full">
            {links.length} {links.length === 1 ? 'link' : 'links'}
          </span>
        </div>
        <LinksTable links={links} currentSort={sort} currentOrder={order} />
      </div>
    </div>
  );
}
