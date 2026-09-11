import { NextRequest, NextResponse } from 'next/server';
import { saveReview, ReviewData, analyzeReviewSentiment, countWords } from '@/lib/excel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const requiredFields = ['name', 'email', 'reviewText'];
    for (const field of requiredFields) {
      if (!body[field] || body[field].toString().trim() === '') {
        return NextResponse.json(
          { success: false, error: `Please complete all required fields (${field}).` },
          { status: 400 }
        );
      }
    }

    const reviewText = body.reviewText.trim();
    const wordCount = countWords(reviewText);

    // Auto Sentiment & Emoji Keyword Analysis
    const sentiment = analyzeReviewSentiment(reviewText);

    // Override with user selected emoji/keyword if provided
    const ratingKeyword = body.ratingKeyword || sentiment.ratingKeyword;
    const emoji = body.emoji || sentiment.emoji;
    const ratingScore = body.ratingScore || sentiment.score;

    const newReview: ReviewData = {
      id: 'REV-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: body.name.trim(),
      email: body.email.trim(),
      role: body.role || 'Client',
      ratingScore: Number(ratingScore),
      ratingKeyword: ratingKeyword,
      emoji: emoji,
      reviewText: reviewText,
      matchedKeywords: sentiment.matchedKeywords.join(', '),
      wordCount: wordCount,
    };

    saveReview(newReview);

    return NextResponse.json({
      success: true,
      message: 'Review submitted successfully!',
      data: newReview,
    });
  } catch (error: any) {
    console.error('Review API Error:', error);
    return NextResponse.json(
      { success: false, error: 'Error processing review: ' + (error?.message || 'Server error') },
      { status: 500 }
    );
  }
}
