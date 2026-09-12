import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { saveSubmission, SubmissionData, countWords } from '@/lib/excel';

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
      'signatureFullName',
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

    if (body.termsAccepted !== true) {
      return NextResponse.json(
        { success: false, error: 'You must accept the terms and conditions to proceed.' },
        { status: 400 }
      );
    }

    if (
      typeof body.signatureData !== 'string' ||
      !body.signatureData.startsWith('data:image/') ||
      !body.signatureData.includes(';base64,')
    ) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid signature (upload image or draw signature).' },
        { status: 400 }
      );
    }

    const [, encodedSignature] = body.signatureData.split(';base64,', 2);
    const signatureBuffer = Buffer.from(encodedSignature, 'base64');
    if (signatureBuffer.byteLength > 2.5 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'Signature file size must be 2 MB or smaller.' },
        { status: 400 }
      );
    }

    if (wordCount < 80) {
      return NextResponse.json(
        {
          success: false,
          error: `Minimum 80 words required. You currently provided ${wordCount} words (${80 - wordCount} more words needed).`,
        },
        { status: 400 }
      );
    }

    const id = 'YID-' + Math.random().toString(36).substring(2, 9).toUpperCase();

    // Determine extension
    let extension = 'png';
    if (body.signatureData.startsWith('data:image/jpeg') || body.signatureData.startsWith('data:image/jpg')) {
      extension = 'jpg';
    } else if (body.signatureData.startsWith('data:image/webp')) {
      extension = 'webp';
    } else if (body.signatureData.startsWith('data:image/svg')) {
      extension = 'svg';
    }

    // Save physical signature file locally
    const desktopFolder = 'C:\\Users\\rohan\\OneDrive\\Desktop\\YourInteriorDesk';
    const archiveDir = path.join(desktopFolder, 'Submitted_Forms', id);
    const filledFormsDir = path.join(desktopFolder, 'Filled_Forms');
    const signatureFilePath = path.join(archiveDir, `signature.${extension}`);
    const filledSignatureFilePath = path.join(filledFormsDir, `${id}_signature.${extension}`);

    try {
      if (!fs.existsSync(archiveDir)) fs.mkdirSync(archiveDir, { recursive: true });
      if (!fs.existsSync(filledFormsDir)) fs.mkdirSync(filledFormsDir, { recursive: true });
      fs.writeFileSync(signatureFilePath, signatureBuffer);
      fs.writeFileSync(filledSignatureFilePath, signatureBuffer);
    } catch (fsErr) {
      console.error('Local disk write error (continuing with in-memory signature):', fsErr);
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
      signatureFullName: body.signatureFullName.trim(),
      signatureFileName: body.signatureFileName || `signature.${extension}`,
      signatureFilePath,
      signatureData: body.signatureData,
      termsAccepted: true,
      signedStatus: 'signed',
    };

    await saveSubmission(newSubmission);

    return NextResponse.json({
      success: true,
      message: 'Submission recorded, signed, and archived successfully!',
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
