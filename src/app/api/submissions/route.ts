import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/excel';

export async function GET() {
  const data = getSubmissions();
  return NextResponse.json({
    success: true,
    total: data.length,
    designersCount: data.filter(d => d.role === 'designer').length,
    clientsCount: data.filter(d => d.role === 'client').length,
    submissions: data,
  });
}
