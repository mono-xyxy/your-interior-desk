import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

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
    const data = fs.readFileSync(JSON_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch {
    return [];
  }
}

// CONCURRENCY SAFE QUEUE
let writeQueue: SubmissionData[] = [];
let isProcessingQueue = false;

export function saveSubmission(submission: SubmissionData): boolean {
  try {
    // 1. Atomically record submission in JSON
    ensureJsonStore();
    const current = getSubmissions();
    current.unshift(submission);
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(current, null, 2));

    // 2. Write to CSV immediately (CSV files never get locked by Windows/Excel)
    appendToCsv(submission);

    // 3. Queue for Excel update
    writeQueue.push(submission);
    processWriteQueue();

    return true;
  } catch (error) {
    console.error('Error saving submission:', error);
    return false;
  }
}

async function processWriteQueue() {
  if (isProcessingQueue || writeQueue.length === 0) return;
  isProcessingQueue = true;

  while (writeQueue.length > 0) {
    writeQueue.shift();
    try {
      syncAllSubmissionsToExcel();
    } catch (err) {
      console.warn('Excel queue update deferred:', err);
    }
  }

  isProcessingQueue = false;
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
    
    // Clean text fields for CSV safety
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
    console.warn('CSV append warning:', err);
  }
}

export function autoFitColumns(ws: XLSX.WorkSheet, data: any[]) {
  if (!data || data.length === 0) return;
  const colNames = Object.keys(data[0]);
  const colWidths = colNames.map(col => {
    let maxLen = col.length;
    data.forEach(row => {
      const val = row[col] !== undefined && row[col] !== null ? String(row[col]) : '';
      if (val.length > maxLen) {
        maxLen = val.length;
      }
    });
    return { wch: Math.min(Math.max(maxLen + 4, 16), 65) };
  });
  ws['!cols'] = colWidths;
}

export function syncAllSubmissionsToExcel() {
  const primaryPath = LOCAL_EXCEL_PATH;
  const dir = path.dirname(primaryPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  const allSubmissions = getSubmissions();
  if (allSubmissions.length === 0) return;

  let wb: XLSX.WorkBook = XLSX.utils.book_new();

  // 1. Designers Sheet
  const designers = allSubmissions.filter(s => s.role === 'designer');
  const designerRows = designers.map(sub => ({
    'Submission ID': sub.id,
    'Timestamp': sub.timestamp,
    'Full Name': sub.fullName,
    'Email Address': sub.email,
    'Phone / WhatsApp': sub.phone,
    'Working Location in India': sub.location,
    'Working Budget Fee (₹)': sub.budget,
    'Word Count': sub.wordCount,
    'Professional Overview & Experience': sub.description
  }));

  const wsDesigners = XLSX.utils.json_to_sheet(designerRows.length > 0 ? designerRows : [
    { 'Submission ID': '', 'Timestamp': '', 'Full Name': '', 'Email Address': '', 'Phone / WhatsApp': '', 'Working Location in India': '', 'Working Budget Fee (₹)': '', 'Word Count': '', 'Professional Overview & Experience': '' }
  ]);
  if (designerRows.length > 0) autoFitColumns(wsDesigners, designerRows);
  XLSX.utils.book_append_sheet(wb, wsDesigners, 'Designers');

  // 2. Clients Sheet
  const clients = allSubmissions.filter(s => s.role === 'client');
  const clientRows = clients.map(sub => ({
    'Submission ID': sub.id,
    'Timestamp': sub.timestamp,
    'Full Name': sub.fullName,
    'Email Address': sub.email,
    'Phone / WhatsApp': sub.phone,
    'Property Location in India': sub.location,
    'Offered Budget (₹)': sub.budget,
    'Word Count': sub.wordCount,
    'Detailed Scope of Work & Requirements': sub.description
  }));

  const wsClients = XLSX.utils.json_to_sheet(clientRows.length > 0 ? clientRows : [
    { 'Submission ID': '', 'Timestamp': '', 'Full Name': '', 'Email Address': '', 'Phone / WhatsApp': '', 'Property Location in India': '', 'Offered Budget (₹)': '', 'Word Count': '', 'Detailed Scope of Work & Requirements': '' }
  ]);
  if (clientRows.length > 0) autoFitColumns(wsClients, clientRows);
  XLSX.utils.book_append_sheet(wb, wsClients, 'Clients');

  // 3. Master Log Sheet
  const masterRows = allSubmissions.map(sub => ({
    'ID': sub.id,
    'Timestamp': sub.timestamp,
    'Role': sub.role.toUpperCase(),
    'Name': sub.fullName,
    'Email': sub.email,
    'Phone': sub.phone,
    'Location': sub.location,
    'Budget (₹)': sub.budget,
    'Word Count': sub.wordCount,
    'Description': sub.description
  }));

  const wsMaster = XLSX.utils.json_to_sheet(masterRows);
  autoFitColumns(wsMaster, masterRows);
  XLSX.utils.book_append_sheet(wb, wsMaster, 'All_Submissions');

  // Attempt writing to main file
  try {
    XLSX.writeFile(wb, primaryPath);
  } catch (err) {
    // Backup Excel if MS Excel holds a lock
    const fallbackPath = path.join(dir, "Client_Designer_Backup.xlsx");
    XLSX.writeFile(wb, fallbackPath);
  }
}
