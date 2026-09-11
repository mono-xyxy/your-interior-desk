import fs from 'fs';
import path from 'path';

export const LOCAL_DB_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\client_designer.db";
export const LOCAL_EXCEL_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.xlsx";
export const LOCAL_CSV_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.csv";

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE_PATH = path.join(DATA_DIR, 'submissions.json');
const TMP_JSON_PATH = '/tmp/submissions.json';
const TMP_DB_PATH = '/tmp/client_designer.db';

export interface SubmissionData {
  id: string;
  timestamp: string;
  role: 'designer' | 'client';
  fullName: string;
  email: string;
  phone: string;
  location: string;
  budget: string;
  socialHandles?: string;
  description: string;
  wordCount: number;
}

// Global in-memory cache to preserve state across Vercel serverless invocations
declare global {
  var _yid_submissions_store: SubmissionData[] | undefined;
}

if (!globalThis._yid_submissions_store) {
  globalThis._yid_submissions_store = [];
}

function ensureJsonStore() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // Ignore read-only filesystem errors on Vercel
  }
}

export function getSubmissions(): SubmissionData[] {
  const store = globalThis._yid_submissions_store || [];
  
  // Try reading from data/submissions.json
  try {
    if (fs.existsSync(JSON_FILE_PATH)) {
      const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
      const parsed: SubmissionData[] = JSON.parse(data);
      for (const item of parsed) {
        if (!store.some(s => s.id === item.id)) {
          store.push(item);
        }
      }
    }
  } catch (err) {
    // ignore
  }

  // Try reading from /tmp/submissions.json on Vercel
  try {
    if (fs.existsSync(TMP_JSON_PATH)) {
      const data = fs.readFileSync(TMP_JSON_PATH, 'utf8');
      const parsed: SubmissionData[] = JSON.parse(data);
      for (const item of parsed) {
        if (!store.some(s => s.id === item.id)) {
          store.push(item);
        }
      }
    }
  } catch (err) {
    // ignore
  }

  // Sort newest first
  return store.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function countWords(str: string): number {
  if (!str || !str.trim()) return 0;
  return str.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export function saveSubmission(submission: SubmissionData): boolean {
  // 1. Save into global memory cache immediately
  if (!globalThis._yid_submissions_store) {
    globalThis._yid_submissions_store = [];
  }
  const existingIdx = globalThis._yid_submissions_store.findIndex(s => s.id === submission.id);
  if (existingIdx >= 0) {
    globalThis._yid_submissions_store[existingIdx] = submission;
  } else {
    globalThis._yid_submissions_store.unshift(submission);
  }

  const allSubs = getSubmissions();

  // 2. Save to data/submissions.json (if directory writable)
  try {
    ensureJsonStore();
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(allSubs, null, 2));
  } catch (err) {
    // On Vercel read-only FS, write to /tmp/submissions.json
    try {
      fs.writeFileSync(TMP_JSON_PATH, JSON.stringify(allSubs, null, 2));
    } catch (e) {
      console.warn('Unable to write to /tmp json store:', e);
    }
  }

  // 3. Save into SQLite Database (Local desktop path & Vercel /tmp DB)
  for (const targetDbPath of [LOCAL_DB_PATH, TMP_DB_PATH]) {
    try {
      const sqlite3 = require('better-sqlite3');
      const dir = path.dirname(targetDbPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const db = sqlite3(targetDbPath);
      db.exec(`
        CREATE TABLE IF NOT EXISTS submissions (
          id TEXT PRIMARY KEY,
          timestamp TEXT,
          role TEXT,
          fullName TEXT,
          email TEXT,
          phone TEXT,
          location TEXT,
          budget TEXT,
          socialHandles TEXT,
          description TEXT,
          wordCount INTEGER,
          synced_to_excel INTEGER DEFAULT 0
        )
      `);

      const stmt = db.prepare(`
        INSERT OR REPLACE INTO submissions 
        (id, timestamp, role, fullName, email, phone, location, budget, socialHandles, description, wordCount, synced_to_excel)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
      `);

      stmt.run(
        submission.id,
        submission.timestamp,
        submission.role,
        submission.fullName,
        submission.email,
        submission.phone,
        submission.location,
        submission.budget,
        submission.socialHandles || '',
        submission.description,
        submission.wordCount
      );

      db.close();
    } catch (err) {
      // Expected notice when running in serverless edge without native C++ sqlite bindings
    }
  }

  // 4. Immediately write to CSV (lock-free)
  try {
    appendToCsv(submission);
  } catch (err) {
    console.warn('CSV append notice:', err);
  }

  return true;
}

export function appendToCsv(sub: SubmissionData) {
  for (const csvPath of [LOCAL_CSV_PATH, '/tmp/Client_Designer.csv']) {
    try {
      const dir = path.dirname(csvPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      const fileExists = fs.existsSync(csvPath);
      const headers = 'ID,Timestamp,Role,Full Name,Email Address,Phone,Location,Budget (INR),Social Handles,Word Count,Description\n';
      
      const cleanStr = (s: string) => `"${(s || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      
      const row = [
        cleanStr(sub.id),
        cleanStr(sub.timestamp),
        cleanStr(sub.role.toUpperCase()),
        cleanStr(sub.fullName),
        cleanStr(sub.email),
        cleanStr(sub.phone),
        cleanStr(sub.location),
        cleanStr(sub.budget),
        cleanStr(sub.socialHandles || ''),
        sub.wordCount,
        cleanStr(sub.description)
      ].join(',') + '\n';

      if (!fileExists) {
        fs.writeFileSync(csvPath, headers + row, 'utf8');
      } else {
        fs.appendFileSync(csvPath, row, 'utf8');
      }
    } catch (err) {
      // ignore
    }
  }
}

