import fs from 'fs';
import path from 'path';
import { ReviewData, EMOJI_SENTIMENT_MAP, analyzeReviewSentiment } from './sentiment';

export const LOCAL_DB_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\client_designer.db";
export const LOCAL_EXCEL_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.xlsx";
export const LOCAL_CSV_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.csv";
export const LOCAL_REVIEWS_CSV_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer_Reviews.csv";

// GitHub persistent store — all Vercel instances read/write the same source
// Reads work on public repos without auth; writes require GITHUB_TOKEN
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const GITHUB_REPO = 'mono-xyxy/your-interior-desk';
const GITHUB_SUBS_PATH = 'data/submissions.json';
const GITHUB_REVIEWS_PATH = 'data/reviews.json';
const GITHUB_API_BASE = `https://api.github.com/repos/${GITHUB_REPO}/contents`;

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

export type { ReviewData };
export { EMOJI_SENTIMENT_MAP, analyzeReviewSentiment };

// In-memory cache — write-through buffer
declare global {
  var _yid_submissions_store: SubmissionData[] | undefined;
  var _yid_reviews_store: ReviewData[] | undefined;
  var _yid_subs_sha: string | undefined;
  var _yid_revs_sha: string | undefined;
}

if (!globalThis._yid_submissions_store) globalThis._yid_submissions_store = [];
if (!globalThis._yid_reviews_store) globalThis._yid_reviews_store = [];

// ─── GitHub Contents API helpers ───────────────────────────────────────────────

async function githubGet(filePath: string): Promise<{ content: any; sha: string } | null> {
  try {
    // Public repo — reads work without auth (60 req/hr unauthenticated, 5000/hr with token)
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache',
    };
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

    const res = await fetch(`${GITHUB_API_BASE}/${filePath}`, {
      headers,
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    const decoded = Buffer.from(data.content, 'base64').toString('utf8');
    return { content: JSON.parse(decoded), sha: data.sha };
  } catch {
    return null;
  }
}

async function githubPut(filePath: string, content: any, sha: string | undefined): Promise<string | null> {
  if (!GITHUB_TOKEN) return null;
  try {
    const encoded = Buffer.from(JSON.stringify(content, null, 2)).toString('base64');
    const body: any = {
      message: `[auto] update ${filePath}`,
      content: encoded,
      committer: { name: 'YourInteriorDesk', email: 'bot@yourinteriordesk.in' },
    };
    if (sha) body.sha = sha;

    const res = await fetch(`${GITHUB_API_BASE}/${filePath}`, {
      method: 'PUT',
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github.v3+json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      // Conflict / sha mismatch — refetch sha and retry once
      if (res.status === 409 || res.status === 422) {
        const current = await githubGet(filePath);
        if (current) {
          const retryBody = { ...body, sha: current.sha };
          const retry = await fetch(`${GITHUB_API_BASE}/${filePath}`, {
            method: 'PUT',
            headers: {
              Authorization: `token ${GITHUB_TOKEN}`,
              Accept: 'application/vnd.github.v3+json',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(retryBody),
          });
          if (retry.ok) {
            const retryData = await retry.json();
            return retryData.content?.sha || null;
          }
        }
      }
      return null;
    }

    const data = await res.json();
    return data.content?.sha || null;
  } catch {
    return null;
  }
}

// ─── Public read functions ──────────────────────────────────────────────────────

export async function getSubmissions(): Promise<SubmissionData[]> {
  const mem = globalThis._yid_submissions_store || [];

  const result = await githubGet(GITHUB_SUBS_PATH);
  if (result) {
    globalThis._yid_subs_sha = result.sha;
    const parsed: SubmissionData[] = Array.isArray(result.content) ? result.content : [];
    const map = new Map<string, SubmissionData>();
    for (const item of parsed) map.set(item.id, item);
    for (const item of mem) {
      if (!map.has(item.id)) map.set(item.id, item);
    }
    const merged = Array.from(map.values());
    globalThis._yid_submissions_store = merged;
    return merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  return mem.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export async function getReviews(): Promise<ReviewData[]> {
  const mem = globalThis._yid_reviews_store || [];

  const result = await githubGet(GITHUB_REVIEWS_PATH);
  if (result) {
    globalThis._yid_revs_sha = result.sha;
    const parsed: ReviewData[] = Array.isArray(result.content) ? result.content : [];
    const map = new Map<string, ReviewData>();
    for (const item of parsed) map.set(item.id, item);
    for (const item of mem) {
      if (!map.has(item.id)) map.set(item.id, item);
    }
    const merged = Array.from(map.values());
    globalThis._yid_reviews_store = merged;
    return merged.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  }

  return mem.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
}

export function countWords(str: string): number {
  if (!str || !str.trim()) return 0;
  return str.trim().split(/\s+/).filter(w => w.length > 0).length;
}

// ─── Save functions ─────────────────────────────────────────────────────────────

export async function saveSubmission(submission: SubmissionData): Promise<boolean> {
  if (!globalThis._yid_submissions_store) globalThis._yid_submissions_store = [];

  // Fetch latest from GitHub first to avoid overwriting concurrent submissions
  const current = await githubGet(GITHUB_SUBS_PATH);
  let all: SubmissionData[] = [];
  let sha = globalThis._yid_subs_sha;

  if (current) {
    sha = current.sha;
    all = Array.isArray(current.content) ? current.content : [];
  } else {
    all = [...(globalThis._yid_submissions_store || [])];
  }

  const existingIdx = all.findIndex(s => s.id === submission.id);
  if (existingIdx >= 0) {
    all[existingIdx] = submission;
  } else {
    all.unshift(submission);
  }

  const newSha = await githubPut(GITHUB_SUBS_PATH, all, sha);
  if (newSha) globalThis._yid_subs_sha = newSha;

  globalThis._yid_submissions_store = all;

  saveToLocalDb(submission, null);
  try { appendToCsv(submission); } catch {}

  return true;
}

export async function saveReview(review: ReviewData): Promise<boolean> {
  if (!globalThis._yid_reviews_store) globalThis._yid_reviews_store = [];

  const current = await githubGet(GITHUB_REVIEWS_PATH);
  let all: ReviewData[] = [];
  let sha = globalThis._yid_revs_sha;

  if (current) {
    sha = current.sha;
    all = Array.isArray(current.content) ? current.content : [];
  } else {
    all = [...(globalThis._yid_reviews_store || [])];
  }

  const existingIdx = all.findIndex(r => r.id === review.id);
  if (existingIdx >= 0) {
    all[existingIdx] = review;
  } else {
    all.unshift(review);
  }

  const newSha = await githubPut(GITHUB_REVIEWS_PATH, all, sha);
  if (newSha) globalThis._yid_revs_sha = newSha;

  globalThis._yid_reviews_store = all;

  saveToLocalDb(null, review);
  try { appendReviewToCsv(review); } catch {}

  return true;
}

// ─── Local SQLite (dev-only, silently skipped on Vercel) ───────────────────────

function saveToLocalDb(submission: SubmissionData | null, review: ReviewData | null) {
  for (const targetDbPath of [LOCAL_DB_PATH, TMP_DB_PATH]) {
    try {
      const sqlite3 = require('better-sqlite3');
      const dir = path.dirname(targetDbPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

      const db = sqlite3(targetDbPath, { timeout: 5000 });
      db.exec(`
        CREATE TABLE IF NOT EXISTS submissions (
          id TEXT PRIMARY KEY, timestamp TEXT, role TEXT,
          fullName TEXT, email TEXT, phone TEXT, location TEXT,
          budget TEXT, socialHandles TEXT, description TEXT,
          wordCount INTEGER, synced_to_excel INTEGER DEFAULT 0
        )
      `);
      db.exec(`
        CREATE TABLE IF NOT EXISTS reviews (
          id TEXT PRIMARY KEY, timestamp TEXT, name TEXT,
          email TEXT, role TEXT, ratingScore INTEGER,
          ratingKeyword TEXT, emoji TEXT, reviewText TEXT,
          matchedKeywords TEXT, wordCount INTEGER
        )
      `);
      try { db.exec('ALTER TABLE submissions ADD COLUMN socialHandles TEXT;'); } catch {}

      if (submission) {
        db.prepare(`
          INSERT OR REPLACE INTO submissions
          (id, timestamp, role, fullName, email, phone, location, budget, socialHandles, description, wordCount, synced_to_excel)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `).run(
          submission.id, submission.timestamp, submission.role,
          submission.fullName, submission.email, submission.phone,
          submission.location, submission.budget,
          submission.socialHandles || '', submission.description, submission.wordCount
        );
      }

      if (review) {
        db.prepare(`
          INSERT OR REPLACE INTO reviews
          (id, timestamp, name, email, role, ratingScore, ratingKeyword, emoji, reviewText, matchedKeywords, wordCount)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          review.id, review.timestamp, review.name, review.email,
          review.role, review.ratingScore, review.ratingKeyword,
          review.emoji, review.reviewText, review.matchedKeywords, review.wordCount
        );
      }

      db.close();
    } catch {}
  }
}

// ─── CSV helpers ────────────────────────────────────────────────────────────────

export function appendToCsv(sub: SubmissionData) {
  for (const csvPath of [LOCAL_CSV_PATH, '/tmp/Client_Designer.csv']) {
    try {
      const dir = path.dirname(csvPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const fileExists = fs.existsSync(csvPath);
      const headers = 'ID,Timestamp,Role,Full Name,Email Address,Phone,Location,Budget (INR),Social Handles,Word Count,Description\n';
      const cleanStr = (s: string) => `"${(s || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const row = [
        cleanStr(sub.id), cleanStr(sub.timestamp),
        cleanStr(sub.role === 'designer' ? 'Designer' : 'Client'),
        cleanStr(sub.fullName), cleanStr(sub.email), cleanStr(sub.phone),
        cleanStr(sub.location), cleanStr(sub.budget),
        cleanStr(sub.socialHandles || ''), sub.wordCount, cleanStr(sub.description),
      ].join(',') + '\n';
      if (!fileExists) {
        fs.writeFileSync(csvPath, headers + row, 'utf8');
      } else {
        fs.appendFileSync(csvPath, row, 'utf8');
      }
    } catch {}
  }
}

export function appendReviewToCsv(review: ReviewData) {
  for (const csvPath of [LOCAL_REVIEWS_CSV_PATH, '/tmp/Client_Designer_Reviews.csv']) {
    try {
      const dir = path.dirname(csvPath);
      if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
      const fileExists = fs.existsSync(csvPath);
      const headers = 'Review ID,Timestamp,Author Name,Email Address,Role,Sentiment Keyword,Emoji,Rating Score,Matched Keywords,Word Count,Review Text\n';
      const cleanStr = (s: string) => `"${(s || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const row = [
        cleanStr(review.id), cleanStr(review.timestamp),
        cleanStr(review.name), cleanStr(review.email), cleanStr(review.role),
        cleanStr(review.ratingKeyword), cleanStr(review.emoji),
        review.ratingScore, cleanStr(review.matchedKeywords),
        review.wordCount, cleanStr(review.reviewText),
      ].join(',') + '\n';
      if (!fileExists) {
        fs.writeFileSync(csvPath, headers + row, 'utf8');
      } else {
        fs.appendFileSync(csvPath, row, 'utf8');
      }
    } catch {}
  }
}
