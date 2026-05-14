import {defaultLocale, isRtlLocale} from '@/i18n/config';
import {getLocale} from 'next-intl/server';

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
    <html lang={resolvedLocale} dir={isRtl ? 'rtl' : 'ltr'} suppressHydrationWarning>
      <head>
        <link rel='preconnect' href='https://fonts.googleapis.com' />
        <link rel='preconnect' href='https://fonts.gstatic.com' crossOrigin='true' />
        <link
          href='https://fonts.googleapis.com/css2?family=Caveat:wght@400..700&family=Nunito+Sans:ital,opsz,wght@0,6..12,200..1000;1,6..12,200..1000&family=Nunito:ital,wght@0,200..1000;1,200..1000&family=Outfit:wght@100..900&display=swap'
          rel='stylesheet'
        />
        <link
          href='https://fonts.googleapis.com/css2?family=Edu+VIC+WA+NT+Beginner:wght@400..700&family=Hubot+Sans:ital,wght@0,200..900;1,200..900&family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap'
          rel='stylesheet'
        />

        <link rel='stylesheet' href='/assets/fonts/css/all.min.css' />
        <link rel='stylesheet' href='/assets/fonts/css/flag-icons.min.css' />
        <link rel='stylesheet' href='/assets/fonts/css/charifund.css' />
        <link rel='stylesheet' href='/assets/css/aos.css' />
        <link rel='stylesheet' href='/assets/css/nice-select.css' />

        <link rel='stylesheet' href='/assets/css/default-theme.css' id='switch-color' />
        <link rel='stylesheet' href='/assets/css/sticky-header.css' />
        <link rel='stylesheet' href='/assets/css/box-layout.css' />
        <link rel='stylesheet' href='/assets/css/dark-mode.css' />
      </head>
      <body className={isRtl ? 'rtl' : undefined} suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}

