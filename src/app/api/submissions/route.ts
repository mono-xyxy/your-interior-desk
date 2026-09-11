import { NextResponse } from 'next/server';
import { getSubmissions } from '@/lib/excel';

export async function GET() {
  const data = getSubmissions();
  
  return NextResponse.json(
    {
      success: true,
      total: data.length,
      designersCount: data.filter(d => d.role === 'designer').length,
      clientsCount: data.filter(d => d.role === 'client').length,
      submissions: data,
    },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Cache-Control': 'no-store, max-age=0',
      },
    }
  );
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

