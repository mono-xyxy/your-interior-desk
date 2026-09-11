import { NextRequest, NextResponse } from 'next/server';
import { saveReview, ReviewData, analyzeReviewSentiment, countWords } from '@/lib/excel';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.reviewText || body.reviewText.toString().trim() === '') {
      return NextResponse.json(
        { success: false, error: 'Please enter your review experience description.' },
        { status: 400 }
      );
    }

    const reviewText = body.reviewText.trim();
    const wordCount = countWords(reviewText);

    const sentiment = analyzeReviewSentiment(reviewText);

    const ratingKeyword = body.ratingKeyword || sentiment.ratingKeyword;
    const emoji = body.emoji || sentiment.emoji;
    const ratingScore = body.ratingScore || sentiment.score;

    const newReview: ReviewData = {
      id: 'REV-' + Math.random().toString(36).substring(2, 9).toUpperCase(),
      timestamp: new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      name: body.name ? body.name.trim() : 'Anonymous',
      email: body.email ? body.email.trim() : 'N/A',
      role: body.role || 'Client',
      ratingScore: Number(ratingScore),
      ratingKeyword: ratingKeyword,
      emoji: emoji,
      reviewText: reviewText,
      matchedKeywords: sentiment.matchedKeywords.join(', '),
      wordCount: wordCount,
    };

    await saveReview(newReview);

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
