import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { DESKTOP_ROOT_PATH, LOCAL_FILLED_FORMS_PATH, getSubmissions } from '@/lib/excel';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    const file = searchParams.get('file');

    let targetFilePath = '';

    if (file) {
      const safeFile = path.basename(file);
      const candidates = [
        path.join(DESKTOP_ROOT_PATH, safeFile),
        path.join(LOCAL_FILLED_FORMS_PATH, safeFile),
      ];
      for (const cand of candidates) {
        if (fs.existsSync(cand)) {
          targetFilePath = cand;
          break;
        }
      }
    }

    if (!targetFilePath && id) {
      const subs = await getSubmissions();
      const match = subs.find((s) => s.id === id);
      if (match) {
        if (match.pdfPath && fs.existsSync(match.pdfPath)) {
          targetFilePath = match.pdfPath;
        } else if (match.pdfFileName) {
          const cand = path.join(DESKTOP_ROOT_PATH, match.pdfFileName);
          if (fs.existsSync(cand)) targetFilePath = cand;
        }

        if (!targetFilePath) {
          // Search DESKTOP_ROOT_PATH for any PDF matching ID or name
          const cleanName = (match.signatureFullName || match.fullName || 'User').replace(/[^a-zA-Z0-9_-]/g, '_');
          if (fs.existsSync(DESKTOP_ROOT_PATH)) {
            const files = fs.readdirSync(DESKTOP_ROOT_PATH);
            const found = files.find((f) => f.endsWith('.pdf') && (f.includes(cleanName) || f.includes(match.id)));
            if (found) targetFilePath = path.join(DESKTOP_ROOT_PATH, found);
          }
        }
      }
    }

    if (!targetFilePath || !fs.existsSync(targetFilePath)) {
      return NextResponse.json({ error: 'PDF file not found on server' }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(targetFilePath);
    const fileName = path.basename(targetFilePath);

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `inline; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Download PDF error:', error);
    return NextResponse.json({ error: 'Failed to retrieve PDF' }, { status: 500 });
  }
}
