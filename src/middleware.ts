import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const locales = ['es', 'en'];
const defaultLocale = 'es';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Exclude internal files and assets (this is also handled by matcher, but keep as double check)
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // 2. If pathname is exactly /es or starts with /es/, redirect to non-prefixed path (Spanish as default)
  if (pathname === '/es') {
    return NextResponse.redirect(new URL('/', request.url), 301);
  }
  if (pathname.startsWith('/es/')) {
    const newPathname = pathname.replace(/^\/es/, '');
    return NextResponse.redirect(new URL(newPathname, request.url), 301);
  }

  // 3. If it starts with a supported locale (currently only /en is left), let it pass
  const hasLocale = pathname.startsWith('/en/') || pathname === '/en';
  if (hasLocale) {
    return NextResponse.next();
  }

  // 4. For default language (Spanish), internally rewrite it to /es/...
  // This keeps the URL in the browser as /... but serves the content from /[lang]/...
  return NextResponse.rewrite(new URL(`/es${pathname}`, request.url));
}

export const config = {
  matcher: [
    // Match all request paths except api routes, next static files, next images, favicon.ico, and files with extensions (like images)
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
