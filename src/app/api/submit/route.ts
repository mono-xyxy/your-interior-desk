import { NextRequest, NextResponse } from 'next/server';
import { saveSubmission, SubmissionData } from '@/lib/excel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Required fields check
    const requiredFields = ['fullName', 'email', 'phone', 'location', 'budget', 'description', 'role'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `Please complete all required fields (${field}).` },
          { status: 400 }
        );
      }
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
      socialHandles: body.socialHandles ? body.socialHandles.trim() : '',
      description: body.description.trim(),
    };

    saveSubmission(newSubmission);

    return NextResponse.json({
      success: true,
      message: 'Submission recorded successfully!',
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
