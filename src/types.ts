export interface Link {
  id: number;
  code: string;
  original_url: string;
  created_at: string;
  clicks: number;
}

export interface Stats {
  totalLinks: number;
  totalClicks: number;
  linksToday: number;
}

export type SortField = 'clicks' | 'created_at';
export type SortOrder = 'asc' | 'desc';
