'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Locale } from '@/lib/i18n';

const labels: Record<Locale, string> = { en: 'EN', fr: 'FR' };

export default function LanguageSwitcher({ currentLang }: { currentLang: Locale }) {
  const pathname = usePathname();

  const pathFor = (lang: Locale) => pathname.replace(`/${currentLang}`, `/${lang}`);

  return (
    <div className="flex items-center gap-1">
      {(['en', 'fr'] as Locale[]).map((lang) => (
        <Link
          key={lang}
          href={pathFor(lang)}
          className={`text-xs font-mono px-2 py-1 transition-colors ${
            lang === currentLang
              ? 'text-white border border-neutral-600'
              : 'text-neutral-500 hover:text-white border border-transparent'
          }`}
        >
          {labels[lang]}
        </Link>
      ))}
    </div>
  );
}
