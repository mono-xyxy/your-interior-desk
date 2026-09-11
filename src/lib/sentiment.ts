export interface ReviewData {
  id: string;
  timestamp: string;
  name: string;
  email: string;
  role: string;
  ratingScore: number;
  ratingKeyword: 'Worst' | 'Bad' | 'Neutral' | 'Good' | 'Excellent';
  emoji: string;
  reviewText: string;
  matchedKeywords: string;
  wordCount: number;
}

export const EMOJI_SENTIMENT_MAP = [
  {
    keyword: 'Worst',
    emoji: '😡',
    score: 1,
    matches: ['worst', 'terrible', 'horrible', 'awful', 'scam', 'waste', 'disaster', 'unprofessional', 'hate', 'whorst']
  },
  {
    keyword: 'Bad',
    emoji: '🙁',
    score: 2,
    matches: ['bad', 'poor', 'issue', 'delay', 'disappointed', 'problem', 'lack', 'rough', 'slow']
  },
  {
    keyword: 'Neutral',
    emoji: '😐',
    score: 3,
    matches: ['neutral', 'average', 'okay', 'ok', 'moderate', 'fair', 'standard', 'basic', 'satisfactory']
  },
  {
    keyword: 'Good',
    emoji: '😊',
    score: 4,
    matches: ['good', 'satisfied', 'nice', 'decent', 'well', 'fine', 'helpful', 'quality', 'clean', 'like']
  },
  {
    keyword: 'Excellent',
    emoji: '🤩',
    score: 5,
    matches: ['excellent', 'amazing', 'outstanding', 'luxury', 'perfect', 'great', 'best', 'top', 'perfection', 'stunning', 'wonderful', 'love']
  }
];

export function analyzeReviewSentiment(text: string): {
  ratingKeyword: 'Worst' | 'Bad' | 'Neutral' | 'Good' | 'Excellent';
  emoji: string;
  score: number;
  matchedKeywords: string[];
} {
  const lower = (text || '').toLowerCase();
  let bestCategory = EMOJI_SENTIMENT_MAP[3]; // Default: Good 😊
  let maxMatchCount = 0;
  const matched: string[] = [];

  for (const cat of EMOJI_SENTIMENT_MAP) {
    let catMatches = 0;
    for (const kw of cat.matches) {
      if (lower.includes(kw)) {
        catMatches++;
        matched.push(kw);
      }
    }
    if (catMatches > maxMatchCount) {
      maxMatchCount = catMatches;
      bestCategory = cat;
    }
  }

  return {
    ratingKeyword: bestCategory.keyword as any,
    emoji: bestCategory.emoji,
    score: bestCategory.score,
    matchedKeywords: [...new Set(matched)],
  };
}
