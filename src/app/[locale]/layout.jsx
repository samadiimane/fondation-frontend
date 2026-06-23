import RouteScrollToTop from '@/helper/RouteScrollToTop';
import {locales} from '@/i18n/config';
import {getMessagesForLocale} from '@/messages';
import {AuthProvider} from '@/hooks/useAuth';
import PublicShell from '@/components/PublicShell';
import QueryProvider from '@/components/providers/QueryProvider';
import {NextIntlClientProvider} from 'next-intl';
import {setRequestLocale} from 'next-intl/server';
import {notFound} from 'next/navigation';

export function generateStaticParams() {
  return locales.map((locale) => ({locale}));
}

export default async function LocaleLayout({children, params}) {
  const resolvedParams = await params;
  const locale = resolvedParams?.locale;

  if (!locales.includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessagesForLocale(locale);

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <QueryProvider>
        <AuthProvider>
          <RouteScrollToTop />
          <PublicShell>{children}</PublicShell>
        </AuthProvider>
      </QueryProvider>
    </NextIntlClientProvider>
  );
}

