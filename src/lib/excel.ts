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
  experience?: string;
  specializations?: string;
  portfolioLink?: string;
  additionalNotes?: string;
  propertyType?: string;
  scopeOfWork?: string;
  preferredStyle?: string;
  timeline?: string;
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
  try {
    const current = getSubmissions();
    current.unshift(submission);
    fs.writeFileSync(JSON_FILE_PATH, JSON.stringify(current, null, 2));
    appendToLocalExcel(submission);
    return true;
  } catch (error) {
    console.error('Error saving submission:', error);
    return false;
  }
}

export function appendToLocalExcel(sub: SubmissionData) {
  const excelPath = LOCAL_EXCEL_PATH;
  try {
    const dir = path.dirname(excelPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    // Try updating primary file, or fallback to pending file if MS Excel app has the file locked
    let targetFile = excelPath;
    let wb: XLSX.WorkBook;

    try {
      if (fs.existsSync(excelPath)) {
        wb = XLSX.readFile(excelPath);
      } else {
        wb = XLSX.utils.book_new();
      }
    } catch (lockError) {
      console.warn("Primary Excel file is currently open in Microsoft Excel. Writing to sync backup file.");
      targetFile = path.join(dir, "Client_Designer_Backup.xlsx");
      if (fs.existsSync(targetFile)) {
        wb = XLSX.readFile(targetFile);
      } else {
        wb = XLSX.utils.book_new();
      }
    }

    if (sub.role === 'designer') {
      const designerRow = {
        'ID': sub.id,
        'Timestamp': sub.timestamp,
        'Full Name': sub.fullName,
        'Email': sub.email,
        'Phone / WhatsApp': sub.phone,
        'City / Location in India': sub.location,
        'Min Working Budget (₹)': sub.budget,
        'Experience Level': sub.experience || '',
        'Specializations': sub.specializations || '',
        'Portfolio / Instagram Link': sub.portfolioLink || '',
        'Additional Notes': sub.additionalNotes || ''
      };
      
      let ws = wb.Sheets['Designers'];
      let existing: any[] = ws ? XLSX.utils.sheet_to_json(ws) : [];
      existing.push(designerRow);
      const newWs = XLSX.utils.json_to_sheet(existing);
      wb.Sheets['Designers'] = newWs;
      if (!wb.SheetNames.includes('Designers')) {
        XLSX.utils.book_append_sheet(wb, newWs, 'Designers');
      }
    } else {
      const clientRow = {
        'ID': sub.id,
        'Timestamp': sub.timestamp,
        'Full Name': sub.fullName,
        'Email': sub.email,
        'Phone / WhatsApp': sub.phone,
        'Property Location in India': sub.location,
        'Offered Budget (₹)': sub.budget,
        'Property Type': sub.propertyType || '',
        'Scope of Work': sub.scopeOfWork || '',
        'Preferred Design Style': sub.preferredStyle || '',
        'Desired Timeline': sub.timeline || ''
      };

      let ws = wb.Sheets['Clients'];
      let existing: any[] = ws ? XLSX.utils.sheet_to_json(ws) : [];
      existing.push(clientRow);
      const newWs = XLSX.utils.json_to_sheet(existing);
      wb.Sheets['Clients'] = newWs;
      if (!wb.SheetNames.includes('Clients')) {
        XLSX.utils.book_append_sheet(wb, newWs, 'Clients');
      }
    }

    // Update Master Sheet
    const masterRow = {
      'ID': sub.id,
      'Timestamp': sub.timestamp,
      'Role Type': sub.role.toUpperCase(),
      'Name': sub.fullName,
      'Email': sub.email,
      'Phone': sub.phone,
      'Location': sub.location,
      'Budget (₹)': sub.budget,
      'Details Summary': sub.role === 'designer' 
        ? `${sub.experience || ''} | ${sub.specializations || ''}`
        : `${sub.propertyType || ''} | ${sub.scopeOfWork || ''} | ${sub.preferredStyle || ''}`
    };

    let wsMaster = wb.Sheets['All_Submissions'];
    let existingMaster: any[] = wsMaster ? XLSX.utils.sheet_to_json(wsMaster) : [];
    existingMaster.push(masterRow);
    const newMasterWs = XLSX.utils.json_to_sheet(existingMaster);
    wb.Sheets['All_Submissions'] = newMasterWs;
    if (!wb.SheetNames.includes('All_Submissions')) {
      XLSX.utils.book_append_sheet(wb, newMasterWs, 'All_Submissions');
    }

    XLSX.writeFile(wb, targetFile);
    console.log(`Successfully updated Excel at ${targetFile}`);
  } catch (err) {
    console.warn(`Excel file write warning: ${err}`);
  }
}
