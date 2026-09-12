import fs from 'fs';
import path from 'path';
import { generateSubmissionPdf } from './src/lib/pdf.ts';

async function main() {
  const arg = process.argv[2];
  if (!arg) process.exit(0);

  let subs = [];
  try {
    if (fs.existsSync(arg)) {
      subs = JSON.parse(fs.readFileSync(arg, 'utf8'));
    } else {
      subs = JSON.parse(arg);
    }
  } catch (e) {
    console.error('JSON parse error:', e.message);
    process.exit(1);
  }

  if (!Array.isArray(subs)) subs = [subs];

  for (const sub of subs) {
    try {
      const res = await generateSubmissionPdf(sub);
      console.log('Generated PDF:', res ? res.primaryPdfPath : 'none');
    } catch (err) {
      console.error('Failed to generate PDF for', sub.id, err);
    }
  }
}

main().catch(console.error);
