import createMiddleware from 'next-intl/middleware';
import {NextResponse} from 'next/server';

import {defaultLocale, locales} from './i18n/config';
import {routing} from './i18n/routing';
import {isPublicJournalSlug, isValidJournalIssueId} from './content/journalSlugs';

const intlMiddleware = createMiddleware(routing);

const rewriteToNotFound = (request, locale) => {
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}/__not-found`;
  url.search = '';
  return NextResponse.rewrite(url, {status: 404});
};

export default function middleware(request) {
  const segments = request.nextUrl.pathname.split('/').filter(Boolean);
  const [locale, section, slug, child, issueId] = segments;

  if (segments.length > 0 && !locales.includes(locale)) {
    return rewriteToNotFound(request, defaultLocale);
  }

  if (locales.includes(locale) && section === 'journals') {
    if (segments.length >= 3 && !isPublicJournalSlug(slug)) {
      return rewriteToNotFound(request, locale);
    }

    if (segments.length >= 5 && child === 'issues' && !isValidJournalIssueId(issueId)) {
      return rewriteToNotFound(request, locale);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next|favicon.ico|icon.ico|assets).*)'],
};
