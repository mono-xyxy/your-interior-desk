import fs from 'fs';
import path from 'path';
import { ReviewData, EMOJI_SENTIMENT_MAP, analyzeReviewSentiment } from './sentiment';
import { generateSubmissionPdf } from './pdf';

export const DESKTOP_ROOT_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk";
export const LOCAL_DB_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\client_designer.db";
export const LOCAL_EXCEL_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.xlsx";
export const LOCAL_CSV_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.csv";
export const LOCAL_REVIEWS_CSV_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer_Reviews.csv";
export const LOCAL_SUBMISSIONS_ARCHIVE_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Submitted_Forms";
export const LOCAL_FILLED_FORMS_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Filled_Forms";

// GitHub persistent store — all Vercel instances read/write the same source
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
  signatureFullName: string;
  signatureFileName: string;
  signatureFilePath?: string;
  signatureData?: string; // base64 data url for direct embedding
  termsAccepted: boolean;
  signedStatus: string;
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
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
      'Cache-Control': 'no-cache',
    };
    if (GITHUB_TOKEN) headers['Authorization'] = `token ${GITHUB_TOKEN}`;

    const res = await fetch(`${GITHUB_API_BASE}/${filePath}`, {
      headers,
      cache: 'no-store',
      signal: AbortSignal.timeout(3000),
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
      signal: AbortSignal.timeout(3000),
    });

    if (!res.ok) {
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

  // Local persistence & filled form copy export
  saveToLocalDb(submission, null);
  archiveSubmission(submission);
  try {
    await generateSubmissionPdf(submission);
  } catch (pdfErr) {
    console.error('Error generating submission PDF:', pdfErr);
  }
  try { appendToCsv(submission); } catch {}

  return true;
}

/**
 * Generates an executive, beautifully styled HTML document representing the completed
 * and digitally signed intake form, saving directly into C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk
 */
export function archiveSubmission(submission: SubmissionData) {
  try {
    const cleanId = (submission.id || 'FORM').replace(/[^a-zA-Z0-9-_]/g, '');
    const cleanName = (submission.fullName || 'User').replace(/[^a-zA-Z0-9]/g, '_');
    const roleTitle = submission.role === 'designer' ? 'Designer Registration' : 'Client Project Requirement';

    // Signature presentation
    let signatureHtml = '';
    if (submission.signatureData && submission.signatureData.startsWith('data:image/')) {
      signatureHtml = `<div class="sig-box"><img src="${submission.signatureData}" alt="Signature" class="sig-img" /><p class="sig-name">${escapeHtml(submission.signatureFullName)}</p><p class="sig-tag">Digitally Signed &amp; Timestamped</p></div>`;
    } else if (submission.signatureFilePath && fs.existsSync(submission.signatureFilePath)) {
      try {
        const ext = path.extname(submission.signatureFilePath).slice(1) || 'png';
        const fileBase64 = fs.readFileSync(submission.signatureFilePath).toString('base64');
        signatureHtml = `<div class="sig-box"><img src="data:image/${ext};base64,${fileBase64}" alt="Signature" class="sig-img" /><p class="sig-name">${escapeHtml(submission.signatureFullName)}</p><p class="sig-tag">Digitally Signed &amp; Timestamped</p></div>`;
      } catch {
        signatureHtml = `<div class="sig-box"><p class="sig-name">${escapeHtml(submission.signatureFullName)}</p><p class="sig-tag">Digitally Signed (File on Record: ${escapeHtml(submission.signatureFileName)})</p></div>`;
      }
    } else {
      signatureHtml = `<div class="sig-box"><p class="sig-name">${escapeHtml(submission.signatureFullName)}</p><p class="sig-tag">Digitally Signed &amp; Verified</p></div>`;
    }

    const htmlDoc = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>YourInteriorDesk — ${escapeHtml(submission.id)} — ${escapeHtml(submission.fullName)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif; background: #0B1320; color: #F8FAFC; line-height: 1.6; padding: 32px 16px; }
    .container { max-width: 820px; margin: 0 auto; background: #101B2E; border: 1px solid rgba(226, 232, 240, 0.2); border-radius: 16px; overflow: hidden; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5); }
    .header { padding: 32px; background: linear-gradient(135deg, #0B1320 0%, #16243C 100%); border-bottom: 1px solid rgba(226, 232, 240, 0.15); position: relative; }
    .header-top { display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 16px; }
    .logo-title { font-size: 24px; font-weight: 800; letter-spacing: -0.5px; color: #F8FAFC; text-transform: uppercase; }
    .logo-sub { font-size: 13px; color: #94A3B8; margin-top: 4px; }
    .badge { display: inline-flex; align-items: center; gap: 6px; padding: 6px 14px; border-radius: 9999px; font-size: 11px; font-weight: 700; letter-spacing: 0.5px; text-transform: uppercase; }
    .badge-signed { background: #0D2818; color: #52B788; border: 1px solid #2D6A4F; }
    .badge-role { background: #1E293B; color: #CBD5E1; border: 1px solid #334155; margin-right: 8px; }
    .body { padding: 32px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px; margin-bottom: 28px; }
    .field-card { background: #0A111C; border: 1px solid rgba(226, 232, 240, 0.1); border-radius: 12px; padding: 14px 18px; }
    .field-label { font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; color: #94A3B8; margin-bottom: 4px; }
    .field-value { font-size: 14px; font-weight: 600; color: #F8FAFC; word-break: break-word; }
    .section-title { font-size: 15px; font-weight: 700; color: #E2E8F0; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 12px; border-bottom: 1px solid rgba(226, 232, 240, 0.15); padding-bottom: 8px; }
    .desc-box { background: #0A111C; border: 1px solid rgba(226, 232, 240, 0.1); border-radius: 12px; padding: 20px; font-size: 13px; color: #CBD5E1; white-space: pre-wrap; line-height: 1.7; margin-bottom: 28px; }
    .terms-box { background: #0B1626; border: 1px solid #1E3A5F; border-radius: 12px; padding: 20px; margin-bottom: 28px; }
    .terms-text { font-size: 12px; color: #CBD5E1; line-height: 1.6; }
    .terms-accepted-note { display: flex; align-items: center; gap: 8px; font-size: 12px; font-weight: 600; color: #52B788; margin-top: 12px; }
    .sig-section { display: flex; flex-wrap: wrap; justify-content: space-between; align-items: flex-end; gap: 24px; padding: 24px; background: #0A111C; border: 1px solid rgba(226, 232, 240, 0.15); border-radius: 12px; }
    .sig-box { background: #060D17; border: 1px solid #334155; border-radius: 10px; padding: 16px 24px; text-align: center; min-width: 240px; }
    .sig-img { max-height: 70px; max-width: 220px; object-fit: contain; margin-bottom: 8px; display: block; margin-left: auto; margin-right: auto; }
    .sig-name { font-size: 15px; font-weight: 700; color: #F8FAFC; border-top: 1px solid #334155; padding-top: 6px; }
    .sig-tag { font-size: 10px; color: #52B788; text-transform: uppercase; font-weight: 600; letter-spacing: 0.5px; margin-top: 2px; }
    .footer { padding: 20px 32px; background: #0B1320; border-top: 1px solid rgba(226, 232, 240, 0.1); font-size: 11px; color: #64748B; text-align: center; }
    @media print {
      body { background: #fff; color: #000; padding: 0; }
      .container { border: none; box-shadow: none; max-width: 100%; background: #fff; color: #000; }
      .header { background: #f8fafc; border-bottom: 2px solid #000; color: #000; }
      .field-card, .desc-box, .terms-box, .sig-section { background: #fff; border: 1px solid #ccc; color: #000; }
      .field-value, .desc-box, .terms-text, .sig-name, .logo-title { color: #000; }
      .field-label, .logo-sub { color: #555; }
      .sig-box { border: 1px solid #999; background: #fff; }
      .sig-img { filter: invert(1); }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="header-top">
        <div>
          <div class="logo-title">Your Interior Desk</div>
          <div class="logo-sub">Official Intake Record &amp; Matching Agreement</div>
        </div>
        <div>
          <span class="badge badge-role">${escapeHtml(submission.role.toUpperCase())}</span>
          <span class="badge badge-signed">✓ ${escapeHtml(submission.signedStatus || 'SIGNED')}</span>
        </div>
      </div>
    </div>

    <div class="body">
      <div class="grid">
        <div class="field-card">
          <div class="field-label">Submission ID</div>
          <div class="field-value">${escapeHtml(submission.id)}</div>
        </div>
        <div class="field-card">
          <div class="field-label">Date &amp; Time (IST)</div>
          <div class="field-value">${escapeHtml(submission.timestamp)}</div>
        </div>
        <div class="field-card">
          <div class="field-label">Full Name</div>
          <div class="field-value">${escapeHtml(submission.fullName)}</div>
        </div>
        <div class="field-card">
          <div class="field-label">Email Address</div>
          <div class="field-value">${escapeHtml(submission.email)}</div>
        </div>
        <div class="field-card">
          <div class="field-label">Phone / WhatsApp</div>
          <div class="field-value">${escapeHtml(submission.phone)}</div>
        </div>
        <div class="field-card">
          <div class="field-label">Property / Working Location</div>
          <div class="field-value">${escapeHtml(submission.location)}</div>
        </div>
        <div class="field-card">
          <div class="field-label">Budget Range (₹)</div>
          <div class="field-value">${escapeHtml(submission.budget)}</div>
        </div>
        <div class="field-card">
          <div class="field-label">Word Count</div>
          <div class="field-value">${submission.wordCount} words</div>
        </div>
        ${submission.socialHandles ? `
        <div class="field-card" style="grid-column: 1 / -1;">
          <div class="field-label">Social Handles &amp; Portfolio</div>
          <div class="field-value">${escapeHtml(submission.socialHandles)}</div>
        </div>` : ''}
      </div>

      <div class="section-title">${roleTitle} Details</div>
      <div class="desc-box">${escapeHtml(submission.description)}</div>

      <div class="section-title">Terms &amp; Conditions Agreement</div>
      <div class="terms-box">
        <p class="terms-text">
          <strong>Intermediary Platform Scope:</strong> YourInteriorDesk helps clients and interior designers find each other. Once the client and the designer match is accepted from both the parties and payment is done to YourInteriorDesk, our role is complete. YourInteriorDesk does not take any responsibility for future communication, negotiations, project delivery, payments, disputes, or future interactions between the client and designer. The platform’s job is solely to help clients and designers discover and connect with each other.
        </p>
        <div class="terms-accepted-note">
          ✓ Terms Accepted and digitally acknowledged by ${escapeHtml(submission.signatureFullName)} on ${escapeHtml(submission.timestamp)}
        </div>
      </div>

      <div class="section-title">Authorized Digital Signature</div>
      <div class="sig-section">
        <div>
          <p style="font-size: 13px; font-weight: 600; color: #F8FAFC;">Digitally Executed Signature Confirmation</p>
          <p style="font-size: 11px; color: #94A3B8; margin-top: 4px; max-width: 380px;">
            This signature was provided directly by the applicant and serves as binding confirmation of the information and terms submitted.
          </p>
          <p style="font-size: 11px; color: #52B788; margin-top: 8px;">
            Status: <strong>${escapeHtml(submission.signedStatus || 'signed')}</strong> | File: ${escapeHtml(submission.signatureFileName || 'signature.png')}
          </p>
        </div>
        ${signatureHtml}
      </div>
    </div>

    <div class="footer">
      Generated automatically by YourInteriorDesk Intake Engine • ${escapeHtml(submission.id)} • Secured Local Copy
    </div>
  </div>
</body>
</html>`;

    // Extract exact signature file bytes and extension
    let sigExt = 'png';
    let sigBuffer: Buffer | null = null;
    if (submission.signatureData && submission.signatureData.startsWith('data:image/')) {
      const match = submission.signatureData.match(/^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/);
      if (match) {
        sigExt = match[1] === 'jpeg' ? 'jpg' : (match[1].includes('svg') ? 'svg' : match[1]);
        try {
          sigBuffer = Buffer.from(match[2], 'base64');
        } catch {}
      }
    } else if (submission.signatureFilePath && fs.existsSync(submission.signatureFilePath)) {
      try {
        sigBuffer = fs.readFileSync(submission.signatureFilePath);
        sigExt = path.extname(submission.signatureFilePath).slice(1) || 'png';
      } catch {}
    }

    // 1. Save directly into C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk
    if (!fs.existsSync(DESKTOP_ROOT_PATH)) {
      fs.mkdirSync(DESKTOP_ROOT_PATH, { recursive: true });
    }

    // Generate accurate date and time stamp for filesystem filenames
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const dateFileStr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    // Direct timestamped form copy right in C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk
    const datedCopyPath = path.join(DESKTOP_ROOT_PATH, `Filled_Form_${dateFileStr}_${cleanId}.html`);
    fs.writeFileSync(datedCopyPath, htmlDoc, 'utf8');

    const directCopyPath = path.join(DESKTOP_ROOT_PATH, `Filled_Form_${cleanId}.html`);
    fs.writeFileSync(directCopyPath, htmlDoc, 'utf8');

    // Save the exact uploaded/drawn signature image directly into C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk
    let desktopDatedSigPath = '';
    if (sigBuffer) {
      const userSigName = (submission.signatureFullName || submission.fullName || 'User').trim().replace(/[\\/:*?"<>|]/g, '_').replace(/\s+/g, '_');
      const dateStrYMD = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;

      desktopDatedSigPath = path.join(DESKTOP_ROOT_PATH, `Signature_${dateFileStr}_${cleanId}.${sigExt}`);
      const desktopSimpleSig = path.join(DESKTOP_ROOT_PATH, `Signature_${cleanId}.${sigExt}`);
      const desktopUserSig = path.join(DESKTOP_ROOT_PATH, `Signature_${userSigName}_${dateStrYMD}.${sigExt}`);
      const desktopUserSimpleSig = path.join(DESKTOP_ROOT_PATH, `Signature_${userSigName}.${sigExt}`);

      fs.writeFileSync(desktopDatedSigPath, sigBuffer);
      fs.writeFileSync(desktopSimpleSig, sigBuffer);
      fs.writeFileSync(desktopUserSig, sigBuffer);
      fs.writeFileSync(desktopUserSimpleSig, sigBuffer);
    }

    // 2. Save into C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Filled_Forms
    if (!fs.existsSync(LOCAL_FILLED_FORMS_PATH)) {
      fs.mkdirSync(LOCAL_FILLED_FORMS_PATH, { recursive: true });
    }
    const filledNamedCopy = path.join(LOCAL_FILLED_FORMS_PATH, `Filled_Form_${dateFileStr}_${cleanId}_${cleanName}.html`);
    fs.writeFileSync(filledNamedCopy, htmlDoc, 'utf8');

    // Save signature file in Filled_Forms
    if (sigBuffer) {
      const filledDatedSig = path.join(LOCAL_FILLED_FORMS_PATH, `Signature_${dateFileStr}_${cleanId}_${cleanName}.${sigExt}`);
      const filledSimpleSig = path.join(LOCAL_FILLED_FORMS_PATH, `${cleanId}_signature.${sigExt}`);
      fs.writeFileSync(filledDatedSig, sigBuffer);
      fs.writeFileSync(filledSimpleSig, sigBuffer);
    }

    // JSON representation
    const jsonCopy = path.join(LOCAL_FILLED_FORMS_PATH, `Filled_Form_${cleanId}.json`);
    fs.writeFileSync(jsonCopy, JSON.stringify(submission, null, 2), 'utf8');

    // 3. Save into Submitted_Forms archive directory
    const archiveDir = path.join(LOCAL_SUBMISSIONS_ARCHIVE_PATH, submission.id);
    fs.mkdirSync(archiveDir, { recursive: true });
    fs.writeFileSync(path.join(archiveDir, 'submission.json'), JSON.stringify(submission, null, 2), 'utf8');
    fs.writeFileSync(path.join(archiveDir, 'filled-form.html'), htmlDoc, 'utf8');
    if (sigBuffer) {
      fs.writeFileSync(path.join(archiveDir, `signature.${sigExt}`), sigBuffer);
    }

    console.log(`[Archive Success] Saved filled form with exact signature and Date & Time Fact to:
- Form: ${datedCopyPath}
- Form: ${directCopyPath}
- Exact Signature: ${desktopDatedSigPath}`);
  } catch (error) {
    console.error('Submission archive error:', error);
  }
}

function escapeHtml(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
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

// ─── Local SQLite ──────────────────────────────────────────────────────────────

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
          wordCount INTEGER, signatureFullName TEXT, signatureFileName TEXT,
          signatureFilePath TEXT, termsAccepted INTEGER DEFAULT 1,
          signed_status TEXT DEFAULT 'signed', synced_to_excel INTEGER DEFAULT 0
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

      // Ensure columns exist on older tables
      try { db.exec('ALTER TABLE submissions ADD COLUMN socialHandles TEXT;'); } catch {}
      try { db.exec('ALTER TABLE submissions ADD COLUMN signatureFullName TEXT;'); } catch {}
      try { db.exec('ALTER TABLE submissions ADD COLUMN signatureFileName TEXT;'); } catch {}
      try { db.exec('ALTER TABLE submissions ADD COLUMN signatureFilePath TEXT;'); } catch {}
      try { db.exec('ALTER TABLE submissions ADD COLUMN termsAccepted INTEGER DEFAULT 1;'); } catch {}
      try { db.exec("ALTER TABLE submissions ADD COLUMN signed_status TEXT DEFAULT 'signed';"); } catch {}

      if (submission) {
        db.prepare(`
          INSERT OR REPLACE INTO submissions
          (id, timestamp, role, fullName, email, phone, location, budget, socialHandles, description, wordCount, signatureFullName, signatureFileName, signatureFilePath, termsAccepted, signed_status, synced_to_excel)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0)
        `).run(
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
          submission.wordCount,
          submission.signatureFullName,
          submission.signatureFileName,
          submission.signatureFilePath || '',
          submission.termsAccepted ? 1 : 0,
          submission.signedStatus || 'signed'
        );
      }

      if (review) {
        db.prepare(`
          INSERT OR REPLACE INTO reviews
          (id, timestamp, name, email, role, ratingScore, ratingKeyword, emoji, reviewText, matchedKeywords, wordCount)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).run(
          review.id,
          review.timestamp,
          review.name,
          review.email,
          review.role,
          review.ratingScore,
          review.ratingKeyword,
          review.emoji,
          review.reviewText,
          review.matchedKeywords,
          review.wordCount
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
      const headers = 'ID,Timestamp,Role,Full Name,Email Address,Phone,Location,Budget (INR),Social Handles,Signed Status,Signature Full Name,Word Count,Description\n';
      const cleanStr = (s: string) => `"${(s || '').replace(/"/g, '""').replace(/\n/g, ' ')}"`;
      const row = [
        cleanStr(sub.id),
        cleanStr(sub.timestamp),
        cleanStr(sub.role === 'designer' ? 'Designer' : 'Client'),
        cleanStr(sub.fullName),
        cleanStr(sub.email),
        cleanStr(sub.phone),
        cleanStr(sub.location),
        cleanStr(sub.budget),
        cleanStr(sub.socialHandles || ''),
        cleanStr(sub.signedStatus || 'signed'),
        cleanStr(sub.signatureFullName || ''),
        sub.wordCount,
        cleanStr(sub.description),
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
