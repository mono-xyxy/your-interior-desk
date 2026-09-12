import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveSubmission, SubmissionData, countWords } from '@/lib/excel';
import { generateSubmissionPdf } from '@/lib/pdf';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requiredFields = [
      'fullName',
      'email',
      'phone',
      'location',
      'budget',
      'description',
      'role',
    ];

    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `Please complete all required fields (${field}).` },
          { status: 400 }
        );
      }
    }

    const descriptionText = body.description.trim();
    const wordCount = countWords(descriptionText);

    const minWords = body.role === 'designer' ? 80 : 15;
    if (wordCount < minWords) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum ${minWords} words required for project details. You currently provided ${wordCount} words (${minWords - wordCount} more words needed).`,
        },
        { status: 400 }
      );
    }

    const id = 'YID-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Optional signature handling if provided
    let extension = 'png';
    let signatureBuffer: Buffer | null = null;
    let signatureFilePath = '';

    if (body.signatureData && typeof body.signatureData === 'string' && body.signatureData.startsWith('data:image/')) {
      if (body.signatureData.startsWith('data:image/jpeg') || body.signatureData.startsWith('data:image/jpg')) {
        extension = 'jpg';
      } else if (body.signatureData.startsWith('data:image/webp')) {
        extension = 'webp';
      } else if (body.signatureData.startsWith('data:image/svg')) {
        extension = 'svg';
      }
      try {
        const [, encodedSignature] = body.signatureData.split(';base64,', 2);
        if (encodedSignature) {
          signatureBuffer = Buffer.from(encodedSignature, 'base64');
        }
      } catch {}
    }

    // Save physical signature file locally if present
    const desktopFolder = 'C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk';
    const archiveDir = path.join(desktopFolder, 'Submitted_Forms', id);
    const filledFormsDir = path.join(desktopFolder, 'Filled_Forms');

    if (signatureBuffer) {
      signatureFilePath = path.join(archiveDir, `signature.${extension}`);
      const filledSignatureFilePath = path.join(filledFormsDir, `${id}_signature.${extension}`);
      try {
        if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
        if (!fs.existsSync(filledFormsDir)) fs.mkdirSync(filledFormsDir, { recursive: true });
        fs.writeFileSync(signatureFilePath, signatureBuffer);
        fs.writeFileSync(filledSignatureFilePath, signatureBuffer);
      } catch (fsErr) {
        console.error('Local disk write error (continuing with in-memory signature):', fsErr);
      }
    }

    const newSubmission: SubmissionData = {
      id,
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      role: body.role === 'designer' ? 'designer' : 'client',
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      location: body.location.trim(),
      budget: body.budget.trim(),
      socialHandles: body.socialHandles ? body.socialHandles.trim() : '',
      description: descriptionText,
      wordCount: wordCount,
      signatureFullName: body.signatureFullName ? body.signatureFullName.trim() : body.fullName.trim(),
      signatureFileName: body.signatureFileName || (signatureBuffer ? `signature.${extension}` : ''),
      signatureFilePath: signatureFilePath || undefined,
      signatureData: body.signatureData || undefined,
      termsAccepted: true,
      signedStatus: 'submitted',
    };

    await saveSubmission(newSubmission);

    let pdfResult = null;
    try {
      pdfResult = await generateSubmissionPdf(newSubmission);
    } catch (pdfErr) {
      console.error('Submit route PDF error:', pdfErr);
    }

    return NextResponse.json({
      success: true,
      message: 'Submission recorded and saved successfully!',
      pdfBase64: pdfResult?.pdfBase64 || null,
      pdfFileName: pdfResult?.fileName || `${newSubmission.fullName}_${new Date().toISOString().slice(0, 10)}.pdf`,
      pdfPath: pdfResult?.primaryPdfPath || null,
      data: newSubmission,
    });
  } catch (error: any) {
    console.error('Submit API error:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing submission: ' + (error?.message || 'Server error') },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
