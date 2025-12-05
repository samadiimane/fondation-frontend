import 'slick-carousel/slick/slick.css';
import '@/styles/vendor/slick-theme.css';
import 'react-modal-video/scss/modal-video.scss';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@/app/globals.scss';

import InitializeAOS from '@/helper/InitializeAOS';
import RouteScrollToTop from '@/helper/RouteScrollToTop';
import {defaultLocale, locales} from '@/i18n/config';
import {getMessagesForLocale} from '@/messages';
import {AuthProvider} from '@/hooks/useAuth';
import QueryProvider from '@/components/providers/QueryProvider';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? defaultLocale;
  setRequestLocale(locale);
  const messages = getMessagesForLocale(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <AuthProvider>
          <InitializeAOS />
          <RouteScrollToTop />
          {children}
        </AuthProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}

