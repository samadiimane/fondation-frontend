import InitializeAOS from '@/helper/InitializeAOS';
import RouteScrollToTop from '@/helper/RouteScrollToTop';
import {defaultLocale, locales} from '@/i18n/config';
import {AuthProvider} from '@/hooks/useAuth';
import {NextIntlClientProvider} from 'next-intl';
import {getMessages, setRequestLocale} from 'next-intl/server';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale ?? defaultLocale;
  setRequestLocale(locale);
  const messages = await getMessages({locale});

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AuthProvider>
        <InitializeAOS />
        <RouteScrollToTop />
        {children}
      </AuthProvider>
    </NextIntlClientProvider>
  );
}

