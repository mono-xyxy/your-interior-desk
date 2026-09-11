import { NextResponse } from 'next/server';

export async function GET() {
  const token = process.env.GITHUB_TOKEN ? 'SET (' + process.env.GITHUB_TOKEN.substring(0, 8) + '...)' : 'NOT SET';
  
  // Try a direct fetch to GitHub API
  let githubResult = 'not tried';
  let githubCount = 0;
  try {
    const headers: Record<string, string> = {
      Accept: 'application/vnd.github.v3+json',
    };
    if (process.env.GITHUB_TOKEN) {
      headers['Authorization'] = 'token ' + process.env.GITHUB_TOKEN;
    }
    const res = await fetch(
      'https://api.github.com/repos/mono-xyxy/your-interior-desk/contents/data/submissions.json',
      { headers, cache: 'no-store' }
    );
    githubResult = 'status=' + res.status;
    if (res.ok) {
      const data = await res.json();
      const decoded = Buffer.from(data.content, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      githubCount = Array.isArray(parsed) ? parsed.length : -1;
      githubResult = 'OK count=' + githubCount;
    }
  } catch (e: any) {
    githubResult = 'error: ' + e.message;
  }

  return NextResponse.json({
    token,
    githubResult,
    githubCount,
    nodeVersion: process.version,
    env: process.env.NODE_ENV,
  }, {
    headers: { 'Cache-Control': 'no-store', 'Access-Control-Allow-Origin': '*' }
  });
}
