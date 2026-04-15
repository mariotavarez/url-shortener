import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { trackClick } from '@/lib/actions';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ code: string }> }
) {
  const { code } = await params;

  const link = db.getLinkByCode(code);

  if (!link) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Track the click (synchronous, embedded SQLite — fast)
  trackClick(code);

  return NextResponse.redirect(link.original_url, { status: 302 });
}
