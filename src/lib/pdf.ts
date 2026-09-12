import fs from 'fs';
import path from 'path';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

// Patch UPNG in pdf-lib to use pako.inflateRaw directly, preventing infinite loop on canvas PNG chunks
try {
  const pako = require('pako');
  const upngMod = require('@pdf-lib/upng');
  const targets = [
    upngMod,
    upngMod?.default,
    upngMod?.default?.default,
  ].filter(Boolean);

  for (const t of targets) {
    if (t && t.decode) {
      t.inflateRaw = function (data: any) {
        return pako.inflateRaw(data);
      };
    }
  }
} catch {}

export const DESKTOP_ROOT_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk";
export const LOCAL_SUBMISSIONS_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Submissions";
export const LOCAL_FILLED_FORMS_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Filled_Forms";
export const LOCAL_SUBMISSIONS_ARCHIVE_PATH = "C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk\\Submitted_Forms";

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
  signatureData?: string;
  termsAccepted: boolean;
  signedStatus: string;
}

export interface PdfGenerationResult {
  primaryPdfPath: string;
  pdfBase64: string;
  fileName: string;
}

function cleanPdfText(str: string): string {
  if (!str) return '';
  return str
    .replace(/[\u2713\u2714\u221A]/g, '[OK]')
    .replace(/\u20B9/g, 'INR ')
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\u2022\u00B7]/g, '*')
    .replace(/[^\x20-\x7E\r\n\t]/g, ' ');
}

function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
  const clean = cleanPdfText(text);
  const words = clean.split(/\s+/);
  const lines: string[] = [];
  let currentLine = '';

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word;
    const width = font.widthOfTextAtSize(testLine, fontSize);
    if (width <= maxWidth) {
      currentLine = testLine;
    } else {
      if (currentLine) lines.push(currentLine);
      currentLine = word;
    }
  }
  if (currentLine) lines.push(currentLine);
  return lines;
}

/**
 * Generates an executive, professional PDF document of the completed and signed form,
 * saving directly into C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk with user entered name and date.
 */
export async function generateSubmissionPdf(submission: SubmissionData): Promise<PdfGenerationResult | null> {
  try {
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]); // Standard A4 points
    const { width, height } = page.getSize();

    const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const fontOblique = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);

    const margin = 40;
    const contentWidth = width - margin * 2;
    let y = height - 40;

    // 1. Top Header Banner
    page.drawRectangle({
      x: margin,
      y: y - 55,
      width: contentWidth,
      height: 65,
      color: rgb(0.04, 0.07, 0.13), // Deep luxury navy #0B1320
      borderColor: rgb(0.88, 0.91, 0.94),
      borderWidth: 0.5,
    });

    page.drawText('YOUR INTERIOR DESK', {
      x: margin + 16,
      y: y - 24,
      size: 17,
      font: fontBold,
      color: rgb(0.97, 0.98, 0.99),
    });

    page.drawText('Official Client & Designer Intake Document - Signed Agreement', {
      x: margin + 16,
      y: y - 42,
      size: 9.5,
      font: fontRegular,
      color: rgb(0.58, 0.64, 0.72),
    });

    // Badge on top right of header
    page.drawRectangle({
      x: margin + contentWidth - 145,
      y: y - 36,
      width: 130,
      height: 22,
      color: rgb(0.05, 0.16, 0.09), // Emerald dark green
      borderColor: rgb(0.18, 0.42, 0.31),
      borderWidth: 1,
    });

    page.drawText('SIGNED & VERIFIED', {
      x: margin + contentWidth - 130,
      y: y - 28,
      size: 8.5,
      font: fontBold,
      color: rgb(0.32, 0.72, 0.53),
    });

    y -= 75;

    // 2. Metadata Grid (Key Facts Box)
    const gridY = y;
    const gridHeight = submission.socialHandles ? 130 : 110;

    page.drawRectangle({
      x: margin,
      y: gridY - gridHeight,
      width: contentWidth,
      height: gridHeight,
      color: rgb(0.06, 0.11, 0.18),
      borderColor: rgb(0.2, 0.25, 0.35),
      borderWidth: 0.75,
    });

    const col1X = margin + 14;
    const col2X = margin + contentWidth / 2 + 10;
    let rowY = gridY - 20;

    const drawField = (x: number, yPos: number, label: string, val: string, isHighlight = false) => {
      const sanitizedVal = cleanPdfText(val || '-');
      page.drawText(label.toUpperCase(), {
        x,
        y: yPos,
        size: 7.5,
        font: fontBold,
        color: isHighlight ? rgb(0.38, 0.65, 0.98) : rgb(0.58, 0.64, 0.72),
      });
      page.drawText(sanitizedVal, {
        x,
        y: yPos - 11,
        size: 9.5,
        font: isHighlight ? fontBold : fontRegular,
        color: isHighlight ? rgb(0.58, 0.77, 0.99) : rgb(0.97, 0.98, 0.99),
      });
    };

    drawField(col1X, rowY, 'Applicant Full Name', submission.fullName, true);
    drawField(col2X, rowY, 'Role / Category', submission.role === 'designer' ? 'Interior Designer' : 'Hiring Client', true);

    rowY -= 26;
    drawField(col1X, rowY, 'Certified Date & Time (IST)', submission.timestamp, true);
    drawField(col2X, rowY, 'Submission Record ID', submission.id);

    rowY -= 26;
    drawField(col1X, rowY, 'Contact Email Address', submission.email);
    drawField(col2X, rowY, 'Phone / WhatsApp', submission.phone);

    rowY -= 26;
    drawField(col1X, rowY, 'Location / City in India', submission.location);
    drawField(col2X, rowY, 'Budget Range (INR)', submission.budget);

    if (submission.socialHandles) {
      rowY -= 24;
      drawField(col1X, rowY, 'Social / Portfolio Handles', submission.socialHandles);
    }

    y = gridY - gridHeight - 18;

    // 3. Project Description / Scope Section
    page.drawText('SCOPE OF WORK / PROFESSIONAL OVERVIEW', {
      x: margin,
      y,
      size: 9,
      font: fontBold,
      color: rgb(0.88, 0.91, 0.94),
    });
    y -= 6;

    page.drawLine({
      start: { x: margin, y },
      end: { x: margin + contentWidth, y },
      color: rgb(0.2, 0.25, 0.35),
      thickness: 0.5,
    });
    y -= 12;

    const descLines = wrapText(submission.description, contentWidth - 20, fontRegular, 8.5);
    const descBoxHeight = Math.max(descLines.length * 12 + 16, 50);

    page.drawRectangle({
      x: margin,
      y: y - descBoxHeight,
      width: contentWidth,
      height: descBoxHeight,
      color: rgb(0.04, 0.07, 0.11),
      borderColor: rgb(0.18, 0.22, 0.3),
      borderWidth: 0.5,
    });

    let textY = y - 14;
    for (const line of descLines) {
      if (textY < 60) {
        page = pdfDoc.addPage([595.28, 841.89]);
        textY = height - 50;
      }
      page.drawText(cleanPdfText(line), {
        x: margin + 10,
        y: textY,
        size: 8.5,
        font: fontRegular,
        color: rgb(0.8, 0.85, 0.9),
      });
      textY -= 12;
    }

    y = y - descBoxHeight - 16;

    // 4. Terms & Conditions Agreement Box
    page.drawText('TERMS & CONDITIONS (INTERMEDIARY MATCHMAKING SCOPE)', {
      x: margin,
      y,
      size: 9,
      font: fontBold,
      color: rgb(0.88, 0.91, 0.94),
    });
    y -= 6;

    page.drawLine({
      start: { x: margin, y },
      end: { x: margin + contentWidth, y },
      color: rgb(0.2, 0.25, 0.35),
      thickness: 0.5,
    });
    y -= 12;

    const termsText =
      'YourInteriorDesk helps clients and interior designers find each other. Once the client and the designer match is accepted from both the parties and payment is done to YourInteriorDesk, our role is complete. YourInteriorDesk does not take any responsibility for future communication, negotiations, project delivery, payments, disputes, or future interactions between the client and designer. The platform role is strictly to help clients and designers discover and connect with each other.';

    const termsLines = wrapText(termsText, contentWidth - 20, fontRegular, 8);
    const termsBoxHeight = termsLines.length * 11 + 28;

    page.drawRectangle({
      x: margin,
      y: y - termsBoxHeight,
      width: contentWidth,
      height: termsBoxHeight,
      color: rgb(0.04, 0.09, 0.15),
      borderColor: rgb(0.12, 0.23, 0.37),
      borderWidth: 0.75,
    });

    let termsY = y - 13;
    for (const line of termsLines) {
      page.drawText(cleanPdfText(line), {
        x: margin + 10,
        y: termsY,
        size: 8,
        font: fontRegular,
        color: rgb(0.8, 0.85, 0.9),
      });
      termsY -= 11;
    }

    page.drawText(
      cleanPdfText(`[ACCEPTED] Terms acknowledged by ${submission.signatureFullName || submission.fullName} on ${submission.timestamp}`),
      {
        x: margin + 10,
        y: termsY - 2,
        size: 8,
        font: fontBold,
        color: rgb(0.32, 0.72, 0.53),
      }
    );

    y = y - termsBoxHeight - 16;

    // 5. Authorized Verification Box
    page.drawText('AUTHORIZED INTAKE & SUBMISSION CONFIRMATION', {
      x: margin,
      y,
      size: 9,
      font: fontBold,
      color: rgb(0.88, 0.91, 0.94),
    });
    y -= 6;

    page.drawLine({
      start: { x: margin, y },
      end: { x: margin + contentWidth, y },
      color: rgb(0.2, 0.25, 0.35),
      thickness: 0.5,
    });
    y -= 12;

    const sigBoxHeight = 85;
    page.drawRectangle({
      x: margin,
      y: y - sigBoxHeight,
      width: contentWidth,
      height: sigBoxHeight,
      color: rgb(0.04, 0.07, 0.11),
      borderColor: rgb(0.18, 0.22, 0.3),
      borderWidth: 0.75,
    });

    // Left info
    page.drawText('Intake Verification Record', {
      x: margin + 14,
      y: y - 20,
      size: 9.5,
      font: fontBold,
      color: rgb(0.97, 0.98, 0.99),
    });

    page.drawText(cleanPdfText(`Applicant Name: ${submission.fullName || submission.signatureFullName}`), {
      x: margin + 14,
      y: y - 35,
      size: 9,
      font: fontRegular,
      color: rgb(0.88, 0.91, 0.94),
    });

    page.drawText(cleanPdfText(`Status: Verified Submission | ID: ${submission.id}`), {
      x: margin + 14,
      y: y - 49,
      size: 8,
      font: fontRegular,
      color: rgb(0.32, 0.72, 0.53),
    });

    page.drawText(cleanPdfText(`Timestamp: ${submission.timestamp}`), {
      x: margin + 14,
      y: y - 62,
      size: 8,
      font: fontOblique,
      color: rgb(0.58, 0.64, 0.72),
    });

    // Right side: embed actual signature image if available
    let embeddedImage = false;
    let extractedSigBuffer: Buffer | null = null;
    let extractedSigExt = 'png';
    const sigAreaX = margin + contentWidth - 170;
    const sigAreaY = y - 72;
    const sigAreaWidth = 150;
    const sigAreaHeight = 60;

    page.drawRectangle({
      x: sigAreaX,
      y: sigAreaY,
      width: sigAreaWidth,
      height: sigAreaHeight,
      color: rgb(0.02, 0.05, 0.09),
      borderColor: rgb(0.2, 0.25, 0.35),
      borderWidth: 0.5,
    });

    try {
      let imageBytes: Buffer | null = null;
      let isJpg = false;

      if (submission.signatureData && submission.signatureData.startsWith('data:image/')) {
        const [, b64] = submission.signatureData.split(';base64,', 2);
        if (b64) {
          imageBytes = Buffer.from(b64, 'base64');
          isJpg = submission.signatureData.startsWith('data:image/jpeg') || submission.signatureData.startsWith('data:image/jpg');
        }
      } else if (submission.signatureFilePath && fs.existsSync(submission.signatureFilePath)) {
        imageBytes = fs.readFileSync(submission.signatureFilePath);
        isJpg = submission.signatureFilePath.toLowerCase().endsWith('.jpg') || submission.signatureFilePath.toLowerCase().endsWith('.jpeg');
      }

      if (imageBytes) {
        extractedSigBuffer = imageBytes;
        extractedSigExt = isJpg ? 'jpg' : 'png';
      }

      if (imageBytes && imageBytes.length > 0) {
        let imageEmbed: any = null;
        try {
          if (isJpg) {
            imageEmbed = await pdfDoc.embedJpg(imageBytes);
          } else {
            try {
              imageEmbed = await pdfDoc.embedPng(imageBytes);
            } catch {
              imageEmbed = await pdfDoc.embedJpg(imageBytes);
            }
          }
        } catch (embedFail) {
          console.warn('Direct image embed failed, will use vector/text fallback:', embedFail);
        }

        if (imageEmbed) {
          const imgDims = imageEmbed.scaleToFit(sigAreaWidth - 10, sigAreaHeight - 16);

          page.drawImage(imageEmbed, {
            x: sigAreaX + (sigAreaWidth - imgDims.width) / 2,
            y: sigAreaY + 12 + (sigAreaHeight - 16 - imgDims.height) / 2,
            width: imgDims.width,
            height: imgDims.height,
          });

          page.drawText(cleanPdfText(submission.signatureFullName || submission.fullName), {
            x: sigAreaX + 6,
            y: sigAreaY + 3,
            size: 7,
            font: fontBold,
            color: rgb(0.88, 0.91, 0.94),
          });

          embeddedImage = true;
        }
      }
    } catch (imgErr) {
      console.error('PDF image embed error (falling back to text signature):', imgErr);
    }

    if (!embeddedImage) {
      page.drawText(cleanPdfText(submission.fullName || submission.signatureFullName), {
        x: sigAreaX + 12,
        y: sigAreaY + 28,
        size: 11,
        font: fontBold,
        color: rgb(0.97, 0.98, 0.99),
      });
      page.drawText('Verified Intake Submission', {
        x: sigAreaX + 12,
        y: sigAreaY + 14,
        size: 7.5,
        font: fontOblique,
        color: rgb(0.32, 0.72, 0.53),
      });
    }

    // Footer
    page.drawText(cleanPdfText(`Generated automatically by YourInteriorDesk Intake Engine - ID: ${submission.id} - Certified PDF Copy`), {
      x: margin,
      y: 22,
      size: 7.5,
      font: fontRegular,
      color: rgb(0.4, 0.45, 0.55),
    });

    const pdfBytes = await pdfDoc.save();
    const pdfBase64 = Buffer.from(pdfBytes).toString('base64');

    // ─── Format User Entered Name and Date for File Saving ──────────────────────
    const now = new Date();
    const pad = (n: number) => n.toString().padStart(2, '0');
    const yyyy = now.getFullYear();
    const mm = pad(now.getMonth() + 1);
    const dd = pad(now.getDate());

    const dateISO = `${yyyy}-${mm}-${dd}`; // 2026-09-12
    const dateIN = `${dd}-${mm}-${yyyy}`;  // 12-09-2026
    const dateFileTime = `${dateISO}_${pad(now.getHours())}-${pad(now.getMinutes())}-${pad(now.getSeconds())}`;

    // Use exact entered name (e.g. "Jia" or typed signature name)
    const rawName = (submission.signatureFullName || submission.fullName || 'User').trim();
    const safeName = rawName.replace(/[\\/:*?"<>|]/g, '_');
    const underScoreName = safeName.replace(/\s+/g, '_');
    const cleanId = (submission.id || 'FORM').replace(/[^a-zA-Z0-9-_]/g, '');

    const primaryFileName = `${underScoreName}_${dateISO}.pdf`;
    let primaryPdfPath = primaryFileName;

    // Save to local filesystem if directory is writable (Localhost environment)
    try {
      if (!fs.existsSync(DESKTOP_ROOT_PATH)) {
        fs.mkdirSync(DESKTOP_ROOT_PATH, { recursive: true });
      }
      // 0. Save into C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk\Submissions
      if (!fs.existsSync(LOCAL_SUBMISSIONS_PATH)) {
        fs.mkdirSync(LOCAL_SUBMISSIONS_PATH, { recursive: true });
      }
      const submissionsSigDir = path.join(LOCAL_SUBMISSIONS_PATH, 'Signatures');
      if (!fs.existsSync(submissionsSigDir)) {
        fs.mkdirSync(submissionsSigDir, { recursive: true });
      }

      // Primary requested PDF in Submissions directory: e.g. "Jia_2026-09-12.pdf"
      const submissionsPdfPath = path.join(LOCAL_SUBMISSIONS_PATH, primaryFileName);
      fs.writeFileSync(submissionsPdfPath, pdfBytes);
      primaryPdfPath = submissionsPdfPath;

      // Also Indian date format in Submissions
      const submissionsInDatePdf = path.join(LOCAL_SUBMISSIONS_PATH, `${underScoreName}_${dateIN}.pdf`);
      fs.writeFileSync(submissionsInDatePdf, pdfBytes);

      // Exact signature saved in Submissions\Signatures
      if (extractedSigBuffer) {
        try {
          fs.writeFileSync(path.join(submissionsSigDir, `${cleanId}_${underScoreName}_signature.${extractedSigExt}`), extractedSigBuffer);
          fs.writeFileSync(path.join(submissionsSigDir, `Signature_${cleanId}.${extractedSigExt}`), extractedSigBuffer);
          fs.writeFileSync(path.join(submissionsSigDir, `Signature_${underScoreName}.${extractedSigExt}`), extractedSigBuffer);
        } catch {}
      }

      // 1. Also mirror to Desktop Root Path: C:\Users\rohan\OneDrive\Desktop\YourInteriorDesk
      const desktopPdfPath = path.join(DESKTOP_ROOT_PATH, primaryFileName);
      fs.writeFileSync(desktopPdfPath, pdfBytes);

      // 2. Also save Indian date format e.g. "Jia_12-09-2026.pdf"
      const inDatePdfPath = path.join(DESKTOP_ROOT_PATH, `${underScoreName}_${dateIN}.pdf`);
      fs.writeFileSync(inDatePdfPath, pdfBytes);

      // 3. If there are spaces, also save space-separated version e.g. "Jia 2026-09-12.pdf"
      if (safeName !== underScoreName) {
        const spacePdfPath = path.join(DESKTOP_ROOT_PATH, `${safeName}_${dateISO}.pdf`);
        fs.writeFileSync(spacePdfPath, pdfBytes);
      }

      // 4. Also save lowercase version if user typed lowercase e.g. "jia_2026-09-12.pdf"
      const lowerPdfPath = path.join(DESKTOP_ROOT_PATH, `${underScoreName.toLowerCase()}_${dateISO}.pdf`);
      try { fs.writeFileSync(lowerPdfPath, pdfBytes); } catch {}

      // 5. Additional timestamped PDF in root
      const timestampedPdfPath = path.join(DESKTOP_ROOT_PATH, `Filled_Form_${underScoreName}_${dateFileTime}.pdf`);
      fs.writeFileSync(timestampedPdfPath, pdfBytes);

      // 6. In Filled_Forms directory
      const filledDirPdfPath = path.join(LOCAL_FILLED_FORMS_PATH, `${underScoreName}_${dateFileTime}_${cleanId}.pdf`);
      fs.writeFileSync(filledDirPdfPath, pdfBytes);

      // 7. In Submitted_Forms archive directory
      const archiveDir = path.join(LOCAL_SUBMISSIONS_ARCHIVE_PATH, submission.id);
      if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
      fs.writeFileSync(path.join(archiveDir, `${underScoreName}_${dateISO}.pdf`), pdfBytes);

      console.log(`[PDF Success] Generated and saved PDF copies to:
- Submissions PDF: ${submissionsPdfPath}
- Desktop Root PDF: ${desktopPdfPath}
- Archive PDF: ${filledDirPdfPath}`);
    } catch (fsErr) {
      console.log('[PDF Notice] Local filesystem write bypassed (e.g. running on cloud server):', fsErr);
    }

    return {
      primaryPdfPath,
      pdfBase64,
      fileName: primaryFileName,
    };
  } catch (error) {
    console.error('generateSubmissionPdf error:', error);
    return null;
  }
}
