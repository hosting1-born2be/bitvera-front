import localFont from 'next/font/local';

import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import 'react-toastify/dist/ReactToastify.css';
import '@/shared/lib/styles/null.scss';
import '@/shared/lib/styles/base.scss';

const satoshi = localFont({
  src: [
    {
      path: './fonts/satoshi-webfont/Satoshi-Light.woff',
      weight: '300',
      style: 'normal',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-Regular.woff',
      weight: '400',
      style: 'normal',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-Italic.woff',
      weight: '400',
      style: 'italic',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-Medium.woff',
      weight: '500',
      style: 'normal',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-MediumItalic.woff',
      weight: '500',
      style: 'italic',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-Bold.woff',
      weight: '700',
      style: 'normal',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-BoldItalic.woff',
      weight: '700',
      style: 'italic',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-Black.woff',
      weight: '900',
      style: 'normal',
    },
    {
      path: './fonts/satoshi-webfont/Satoshi-BlackItalic.woff',
      weight: '900',
      style: 'italic',
    },
  ],
  variable: '--font-satoshi',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Crypto Exchange Platform for BTC & ETH | Bitvera',
  description: 'Sign up and exchange BTC & ETH with Bitvera. Explore a secure, fast, and transparent crypto exchange platform with simple verification and reliable transactions.',
  openGraph: {
    title: 'Crypto Exchange Platform for BTC & ETH | Bitvera',
    description: 'Sign up and exchange BTC & ETH with Bitvera. Explore a secure, fast, and transparent crypto exchange platform with simple verification and reliable transactions.',
    //images: 'https://bitvera.com/images/meta.png',
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  return (
    <html lang={locale}>
      <body className={`${satoshi.variable} ${satoshi.className}`}>
        {children}
      </body>
    </html>
  );
}
