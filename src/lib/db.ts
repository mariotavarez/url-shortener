import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import type { Link } from '@/types';

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_PATH = path.join(DATA_DIR, 'data.db');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Singleton pattern to reuse connection across hot-reloads in dev
declare global {
  // eslint-disable-next-line no-var
  var __db: Database.Database | undefined;
}

function getDb(): Database.Database {
  if (global.__db) return global.__db;

  const db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent performance
  db.pragma('journal_mode = WAL');
  db.pragma('foreign_keys = ON');

  // Create tables
  db.exec(`
    CREATE TABLE IF NOT EXISTS links (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code TEXT UNIQUE NOT NULL,
      original_url TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      clicks INTEGER DEFAULT 0
    );
  `);

  global.__db = db;
  return db;
}

export const db = {
  getLinkByCode(code: string): Link | undefined {
    const stmt = getDb().prepare<[string], Link>(
      'SELECT * FROM links WHERE code = ?'
    );
    return stmt.get(code);
  },

  getLinkById(id: number): Link | undefined {
    const stmt = getDb().prepare<[number], Link>(
      'SELECT * FROM links WHERE id = ?'
    );
    return stmt.get(id);
  },

  getAllLinks(sortBy: 'clicks' | 'created_at' = 'created_at', order: 'asc' | 'desc' = 'desc'): Link[] {
    const col = sortBy === 'clicks' ? 'clicks' : 'created_at';
    const dir = order === 'asc' ? 'ASC' : 'DESC';
    const stmt = getDb().prepare<[], Link>(
      `SELECT * FROM links ORDER BY ${col} ${dir}`
    );
    return stmt.all();
  },

  getRecentLinks(limit = 5): Link[] {
    const stmt = getDb().prepare<[number], Link>(
      'SELECT * FROM links ORDER BY created_at DESC LIMIT ?'
    );
    return stmt.all(limit);
  },

  createLink(code: string, originalUrl: string): Link {
    const stmt = getDb().prepare<[string, string]>(
      'INSERT INTO links (code, original_url) VALUES (?, ?)'
    );
    const result = stmt.run(code, originalUrl);
    return this.getLinkById(result.lastInsertRowid as number)!;
  },

  incrementClicks(code: string): void {
    const stmt = getDb().prepare<[string]>(
      'UPDATE links SET clicks = clicks + 1 WHERE code = ?'
    );
    stmt.run(code);
  },

  deleteLink(code: string): void {
    const stmt = getDb().prepare<[string]>(
      'DELETE FROM links WHERE code = ?'
    );
    stmt.run(code);
  },

  getTotalLinks(): number {
    const stmt = getDb().prepare<[], { count: number }>(
      'SELECT COUNT(*) as count FROM links'
    );
    return stmt.get()!.count;
  },

  getTotalClicks(): number {
    const stmt = getDb().prepare<[], { total: number }>(
      'SELECT COALESCE(SUM(clicks), 0) as total FROM links'
    );
    return stmt.get()!.total;
  },

  getLinksToday(): number {
    const stmt = getDb().prepare<[], { count: number }>(
      "SELECT COUNT(*) as count FROM links WHERE date(created_at) = date('now')"
    );
    return stmt.get()!.count;
  },
};
