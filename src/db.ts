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

export function generateId(): string {
  return crypto.randomBytes(6).toString('base64url');
}

export function generateEditToken(): string {
  return crypto.randomBytes(24).toString('base64url');
}

export function createPage(id: string, tsxCode: string, passwordHash: string | null, editToken: string): void {
  db.prepare('INSERT INTO pages (id, tsx_code, password_hash, edit_token) VALUES (?, ?, ?, ?)').run(id, tsxCode, passwordHash, editToken);
}

export function updatePage(id: string, tsxCode: string, passwordHash: string | null): void {
  db.prepare("UPDATE pages SET tsx_code = ?, password_hash = ?, updated_at = datetime('now') WHERE id = ?").run(tsxCode, passwordHash, id);
}

export interface Page {
  id: string;
  tsx_code: string;
  password_hash: string | null;
  edit_token: string | null;
  created_at: string;
  updated_at: string | null;
}

export function getPage(id: string): Page | undefined {
  return db.prepare('SELECT * FROM pages WHERE id = ?').get(id) as Page | undefined;
}

export default db;
