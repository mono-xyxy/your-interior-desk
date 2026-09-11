import { NextRequest, NextResponse } from 'next/server';
import { saveSubmission, SubmissionData } from '@/lib/excel';

function countWords(str: string): number {
  if (!str) return 0;
  return str.trim().split(/\s+/).filter(w => w.length > 0).length;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Required basic fields
    const requiredFields = ['fullName', 'email', 'phone', 'location', 'budget', 'description', 'role'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `Please fill out all required fields (${field}).` },
          { status: 400 }
        );
      }
    }

    const descriptionText = body.description.trim();
    const wordCount = countWords(descriptionText);

    // Minimum 80 words constraint validation
    if (wordCount < 80) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Description must contain at least 80 words. Current count: ${wordCount} words.` 
        },
        { status: 400 }
      );
    }

    const newSubmission: SubmissionData = {
      id: 'YID-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      role: body.role === 'designer' ? 'designer' : 'client',
      fullName: body.fullName.trim(),
      email: body.email.trim(),
      phone: body.phone.trim(),
      location: body.location.trim(),
      budget: body.budget.trim(),
      description: descriptionText,
      wordCount: wordCount,
    };

    saveSubmission(newSubmission);

    return NextResponse.json({
      success: true,
      message: 'Submission recorded successfully! Spreadsheet updated.',
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
