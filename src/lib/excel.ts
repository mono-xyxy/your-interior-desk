import fs from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';

export const LOCAL_EXCEL_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Client_Designer_DB\\Client_Designer.xlsx";

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
  description: string; // Detailed 80+ words free text
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

export function saveSubmission(submission: SubmissionData): boolean {
  // 1. Always record in JSON database (never fails)
  try {
    const current = getSubmissions();
    current.unshift(submission);
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(current, null, 2));
  } catch (err) {
    console.error('Error writing to JSON store:', err);
  }

  // 2. Safely attempt local Excel file auto-update
  try {
    appendToLocalExcel(submission);
  } catch (err) {
    console.warn('Excel write deferred:', err);
  }

  return true;
}

export function autoFitColumns(ws: XLSX.WorkSheet, data: any[]) {
  if (!data || data.length === 0) return;
  const colNames = Object.keys(data[0]);
  const colWidths = colNames.map(col => {
    let maxLen = col.length;
    data.forEach(row => {
      const val = row[col] ? String(row[col]) : '';
      if (val.length > maxLen) {
        maxLen = val.length;
      }
    });
    return { wch: Math.min(Math.max(maxLen + 4, 15), 60) }; // min 15, max 60 char width
  });
  ws['!cols'] = colWidths;
}

export function appendToLocalExcel(sub: SubmissionData) {
  const primaryPath = LOCAL_EXCEL_PATH;
  const dir = path.dirname(primaryPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  let targetFile = primaryPath;
  let wb: XLSX.WorkBook;

  try {
    if (fs.existsSync(primaryPath)) {
      wb = XLSX.readFile(primaryPath);
    } else {
      wb = XLSX.utils.book_new();
    }
  } catch (e) {
    targetFile = path.join(dir, "Client_Designer_Sync.xlsx");
    if (fs.existsSync(targetFile)) {
      wb = XLSX.readFile(targetFile);
    } else {
      wb = XLSX.utils.book_new();
    }
  }

  if (sub.role === 'designer') {
    const designerRow = {
      'Submission ID': sub.id,
      'Timestamp': sub.timestamp,
      'Full Name': sub.fullName,
      'Email Address': sub.email,
      'Phone / WhatsApp': sub.phone,
      'Working Location in India': sub.location,
      'Working Budget Fee (₹)': sub.budget,
      'Word Count': sub.wordCount,
      'Professional Description & Portfolio': sub.description
    };
    
    let ws = wb.Sheets['Designers'];
    let existing: any[] = ws ? XLSX.utils.sheet_to_json(ws) : [];
    existing.push(designerRow);
    const newWs = XLSX.utils.json_to_sheet(existing);
    autoFitColumns(newWs, existing);
    
    wb.Sheets['Designers'] = newWs;
    if (!wb.SheetNames.includes('Designers')) {
      XLSX.utils.book_append_sheet(wb, newWs, 'Designers');
    }
  } else {
    const clientRow = {
      'Submission ID': sub.id,
      'Timestamp': sub.timestamp,
      'Full Name': sub.fullName,
      'Email Address': sub.email,
      'Phone / WhatsApp': sub.phone,
      'Property Location in India': sub.location,
      'Offered Budget (₹)': sub.budget,
      'Word Count': sub.wordCount,
      'Detailed Scope of Work & Requirements': sub.description
    };

    let ws = wb.Sheets['Clients'];
    let existing: any[] = ws ? XLSX.utils.sheet_to_json(ws) : [];
    existing.push(clientRow);
    const newWs = XLSX.utils.json_to_sheet(existing);
    autoFitColumns(newWs, existing);

    wb.Sheets['Clients'] = newWs;
    if (!wb.SheetNames.includes('Clients')) {
      XLSX.utils.book_append_sheet(wb, newWs, 'Clients');
    }
  }

  // Master Log
  const masterRow = {
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
  };

  let wsMaster = wb.Sheets['All_Submissions'];
  let existingMaster: any[] = wsMaster ? XLSX.utils.sheet_to_json(wsMaster) : [];
  existingMaster.push(masterRow);
  const newMasterWs = XLSX.utils.json_to_sheet(existingMaster);
  autoFitColumns(newMasterWs, existingMaster);

  wb.Sheets['All_Submissions'] = newMasterWs;
  if (!wb.SheetNames.includes('All_Submissions')) {
    XLSX.utils.book_append_sheet(wb, newMasterWs, 'All_Submissions');
  }

  XLSX.writeFile(wb, targetFile);
}
