import {defaultLocale, isRtlLocale} from '@/i18n/config';
import {getLocale} from 'next-intl/server';
import {Caveat, Nunito} from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  display: 'swap',
  variable: '--font-nunito'
});

const caveat = Caveat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  variable: '--font-caveat'
});

export const metadata = {
  title: 'AKT research foundation',
  description: 'Abdelaziz khallouk temsamani research foundation'
};

export default async function RootLayout({children}) {
  let locale;
  try {
    locale = await getLocale();
  } catch (error) {
    locale = defaultLocale;
  }

  const resolvedLocale = locale || defaultLocale;
  const isRtl = isRtlLocale(resolvedLocale);

  return (
    <html
      lang={resolvedLocale}
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`${nunito.variable} ${caveat.variable}`}
      suppressHydrationWarning
    >
      <head>
        <link rel='stylesheet' href='/assets/fonts/css/all.min.css' />
        <link rel='stylesheet' href='/assets/fonts/css/flag-icons.min.css' />
        <link rel='stylesheet' href='/assets/fonts/css/charifund.css' />
        <link rel='stylesheet' href='/assets/css/aos.css' />
        <link rel='stylesheet' href='/assets/css/nice-select.css' />
      </head>
      <body className={isRtl ? 'rtl' : undefined} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

