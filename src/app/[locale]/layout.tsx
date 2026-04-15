import { notFound } from "next/navigation";

import { NextIntlClientProvider } from "next-intl";
import { setRequestLocale } from "next-intl/server";

import { FormsPopupRenderer } from "@/features/forms";

import { CookiePopup, Footer, Header } from "@/shared/ui/components";

import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as typeof routing.locales[number])) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <NextIntlClientProvider>
      <Header />
      {children}
      <Footer />
      <CookiePopup />
      <FormsPopupRenderer />
    </NextIntlClientProvider>
  );
}
