import { notFound } from 'next/navigation';
import DictionaryProvider from '@/components/DictionaryProvider';
import { getDictionary, isValidLocale, locales } from '@/lib/i18n';
import type { Locale } from '@/lib/i18n';

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export default function LangLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { lang: string };
}) {
  if (!isValidLocale(params.lang)) notFound();

  const dict = getDictionary(params.lang as Locale);

  return <DictionaryProvider dictionary={dict}>{children}</DictionaryProvider>;
}
