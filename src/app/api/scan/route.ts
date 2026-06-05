import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    
    if (!url) {
      return NextResponse.json({ error: 'URL is required' }, { status: 400 });
    }
    
    let targetUrl = url;
    if (!targetUrl.startsWith('http')) {
      targetUrl = 'https://' + targetUrl;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    
    const response = await fetch(targetUrl, { 
      method: 'GET',
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);

    const headers = Object.fromEntries(response.headers.entries());
    
    // Header analysis
    const securityHeaders = [
      { key: 'strict-transport-security', name: 'Strict-Transport-Security' },
      { key: 'content-security-policy', name: 'Content-Security-Policy' },
      { key: 'x-frame-options', name: 'X-Frame-Options' },
      { key: 'x-content-type-options', name: 'X-Content-Type-Options' },
      { key: 'referrer-policy', name: 'Referrer-Policy' },
    ];

    const results: Record<string, any> = {};
    
    securityHeaders.forEach(sh => {
      if (headers[sh.key]) {
        results[sh.name] = { status: 'Present', value: headers[sh.key] };
      } else {
        results[sh.name] = { status: 'Missing', message: `Missing ${sh.name} header.` };
      }
    });

    // Tech Stack Fingerprinting
    const techStack = [];
    if (headers['server']) techStack.push(`Server: ${headers['server']}`);
    if (headers['x-powered-by']) techStack.push(`X-Powered-By: ${headers['x-powered-by']}`);
    if (headers['via']) techStack.push(`Via: ${headers['via']}`);

    // Cookie Security
    const setCookie = headers['set-cookie'];
    const cookieIssues = [];
    if (setCookie) {
      if (!setCookie.toLowerCase().includes('secure')) cookieIssues.push('Missing Secure flag');
      if (!setCookie.toLowerCase().includes('httponly')) cookieIssues.push('Missing HttpOnly flag');
      if (!setCookie.toLowerCase().includes('samesite')) cookieIssues.push('Missing SameSite flag');
    }

    return NextResponse.json({
      success: true,
      url: targetUrl,
      results,
      techStack: techStack.length > 0 ? techStack : ['No technology headers found'],
      cookieIssues: setCookie ? cookieIssues : ['No cookies set in response']
    });

  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
