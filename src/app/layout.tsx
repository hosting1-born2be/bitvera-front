import { Roboto_Mono, Space_Mono } from 'next/font/google';
import localFont from 'next/font/local';

import type { Metadata } from 'next';
import { getLocale } from 'next-intl/server';

import { cn } from '@/shared/lib/helpers/styles';

import 'react-toastify/dist/ReactToastify.css';
import '@/shared/lib/styles/null.scss';
import '@/shared/lib/styles/base.scss';

const spaceMono = Space_Mono({
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
  weight: ['400', '700'],
});

const robotoMono = Roboto_Mono({
  subsets: ['latin'],
  variable: '--font-roboto-mono',
  display: 'swap',
  weight: ['400'],
});

const clashGrotesk = localFont({
  src: './fonts/ClashGrotesk-Variable.ttf',
  variable: '--font-clash-grotesk',
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
      <body className={cn(spaceMono.variable, robotoMono.variable, clashGrotesk.variable)}>
        {children}
      </body>
    </html>
  );
}
