import { NextRequest, NextResponse } from 'next/server';
import { saveSubmission, SubmissionData } from '@/lib/excel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requiredFields = ['fullName', 'email', 'phone', 'location', 'budget', 'role'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
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
      experience: body.experience || '',
      specializations: body.specializations || '',
      portfolioLink: body.portfolioLink || '',
      additionalNotes: body.additionalNotes || '',
      propertyType: body.propertyType || '',
      scopeOfWork: body.scopeOfWork || '',
      preferredStyle: body.preferredStyle || '',
      timeline: body.timeline || '',
    };

    const saved = saveSubmission(newSubmission);

    if (saved) {
      return NextResponse.json({
        success: true,
        message: 'Submission recorded and Excel updated successfully!',
        data: newSubmission,
      });
    } else {
      return NextResponse.json(
        { success: false, error: 'Failed to record submission' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Submit API error:', error);
    return NextResponse.json(
      { success: false, error: 'Server error processing submission' },
      { status: 500 }
    );
  }
}
