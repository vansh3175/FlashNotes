import { NextResponse } from 'next/server';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function GET() {
  const content = `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml

# If you have staging or private paths, disallow them here
# Disallow: /staging
`;

  return new NextResponse(content, {
    headers: {
      'Content-Type': 'text/plain',
    },
  });
}
