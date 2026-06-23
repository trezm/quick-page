import Database from 'better-sqlite3';
import path from 'path';
import crypto from 'crypto';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = process.env.DB_PATH || path.join(__dirname, '..', 'data', 'quick-page.db');
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS pages (
    id TEXT PRIMARY KEY,
    tsx_code TEXT NOT NULL,
    password_hash TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )
`);

const cols = db.prepare("PRAGMA table_info(pages)").all() as { name: string }[];
if (!cols.some(c => c.name === 'edit_token')) {
  db.exec('ALTER TABLE pages ADD COLUMN edit_token TEXT');
}
if (!cols.some(c => c.name === 'updated_at')) {
  db.exec("ALTER TABLE pages ADD COLUMN updated_at TEXT");
}
if (!cols.some(c => c.name === 'views')) {
  db.exec("ALTER TABLE pages ADD COLUMN views INTEGER NOT NULL DEFAULT 0");
}

export function generateId(): string {
  return crypto.randomBytes(6).toString('base64url');
}

export function generateEditToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

export function createPage(id: string, tsxCode: string, passwordHash: string | null, editToken: string): void {
  db.prepare('INSERT INTO pages (id, tsx_code, password_hash, edit_token) VALUES (?, ?, ?, ?)').run(id, tsxCode, passwordHash, editToken);
}

// Updates a page and rotates its edit token. Returns the new token; the
// previous one is invalidated.
export function updatePage(id: string, tsxCode: string, passwordHash: string | null): string {
  const editToken = generateEditToken();
  db.prepare("UPDATE pages SET tsx_code = ?, password_hash = ?, edit_token = ?, updated_at = datetime('now') WHERE id = ?")
    .run(tsxCode, passwordHash, editToken, id);
  return editToken;
}

export interface Page {
  id: string;
  tsx_code: string;
  password_hash: string | null;
  edit_token: string | null;
  created_at: string;
  updated_at: string | null;
  views: number;
}

export function getPage(id: string): Page | undefined {
  return db.prepare('SELECT * FROM pages WHERE id = ?').get(id) as Page | undefined;
}

export function incrementViews(id: string): void {
  db.prepare('UPDATE pages SET views = views + 1 WHERE id = ?').run(id);
}

export interface PageStat {
  id: string;
  views: number;
  created_at: string;
  protected: number;
}

export function getStats(): PageStat[] {
  return db
    .prepare('SELECT id, views, created_at, (password_hash IS NOT NULL) AS protected FROM pages ORDER BY views DESC, created_at DESC')
    .all() as PageStat[];
}

export default db;
