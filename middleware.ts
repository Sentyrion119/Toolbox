import { NextRequest, NextResponse } from 'next/server';
import { locales, defaultLocale } from '@/lib/i18n';

function detectLocale(req: NextRequest): string {
  const acceptLang = req.headers.get('accept-language') ?? '';
  return acceptLang.toLowerCase().startsWith('fr') ? 'fr' : defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const hasLocale = locales.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );

  const response = hasLocale
    ? NextResponse.next()
    : NextResponse.redirect(
        new URL(`/${detectLocale(request)}${pathname === '/' ? '' : pathname}`, request.url)
      );

  // Expose the pathname so the root layout can read the active locale for <html lang>
  response.headers.set('x-pathname', request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon\\.ico|robots\\.txt|sitemap\\.xml|pdf\\.worker\\.min\\.mjs|.*\\.(?:png|jpg|jpeg|svg|ico|webp)$).*)',
  ],
};
