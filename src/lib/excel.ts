import fs from 'fs';
import path from 'path';
import Database from 'better-sqlite3';

export const LOCAL_DB_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\client_designer.db";
export const LOCAL_EXCEL_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.xlsx";
export const LOCAL_CSV_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.csv";

const DATA_DIR = path.join(process.cwd(), 'data');
const JSON_FILE_PATH = path.join(DATA_DIR, 'submissions.json');

export interface SubmissionData {
  id: string;
  timestamp: string;
  role: 'designer' | 'client';
  fullName: string;
  email: string;
  phone: string;
  location: string;
  budget: string;
  description: string;
  wordCount: number;
}

// 1. Initialize SQLite Database
function getDb() {
  const dir = path.dirname(LOCAL_DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const db = new Database(LOCAL_DB_PATH);
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
      wordCount INTEGER,
      description TEXT,
      synced_to_excel INTEGER DEFAULT 0
    )
  `);
  return db;
}

function ensureJsonStore() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(JSON_FILE_PATH)) {
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify([], null, 2));
  }
}

export function getSubmissions(): SubmissionData[] {
  ensureJsonStore();
  try {
    const db = getDb();
    const rows = db.prepare(`SELECT * FROM submissions ORDER BY timestamp DESC`).all() as any[];
    db.close();

    if (rows && rows.length > 0) {
      return rows.map(r => ({
        id: r.id,
        timestamp: r.timestamp,
        role: r.role as 'designer' | 'client',
        fullName: r.fullName,
        email: r.email,
        phone: r.phone,
        location: r.location,
        budget: r.budget,
        description: r.description,
        wordCount: r.wordCount
      }));
    }
  } catch (err) {
    console.warn('SQLite read fallback to JSON:', err);
  }

  try {
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function saveSubmission(submission: SubmissionData): boolean {
  // 1. Save into SQL Table (client_designer.db)
  try {
    const db = getDb();
    const stmt = db.prepare(`
      INSERT OR REPLACE INTO submissions 
      (id, timestamp, role, fullName, email, phone, location, budget, wordCount, description, synced_to_excel)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
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
      submission.wordCount,
      submission.description
    );
    db.close();
    console.log(`[SQL Database] Recorded submission ${submission.id} into SQL Table (client_designer.db)`);
  } catch (err) {
    console.error('Error inserting into SQL Table:', err);
  }

  // 2. Also save to local JSON backup
  try {
    ensureJsonStore();
    const current = getSubmissions();
    const exists = current.some(s => s.id === submission.id);
    if (!exists) {
      current.unshift(submission);
      fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(current, null, 2));
    }
  } catch (err) {
    console.error('Error recording to JSON store:', err);
  }

  // 3. Immediately write to CSV
  appendToCsv(submission);

  return true;
}

export function appendToCsv(sub: SubmissionData) {
  try {
    const csvPath = LOCAL_CSV_PATH;
    const dir = path.dirname(csvPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const fileExists = fs.existsSync(csvPath);
    const headers = 'ID,Timestamp,Role,Full Name,Email Address,Phone,Location,Budget (INR),Word Count,Description\n';
    
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
      sub.wordCount,
      cleanStr(sub.description)
    ].join(',') + '\n';

    if (!fileExists) {
      fs.writeFileSync(csvPath, headers + row, 'utf8');
    } else {
      fs.appendFileSync(csvPath, row, 'utf8');
    }
  } catch (err) {
    console.warn('CSV write warning:', err);
  }
}
