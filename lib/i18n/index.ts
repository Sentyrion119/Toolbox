import { en } from './en';
import { fr } from './fr';
import type { Dictionary } from './en';

export type Locale = 'en' | 'fr';
export type { Dictionary };

export const locales: Locale[] = ['en', 'fr'];
export const defaultLocale: Locale = 'en';

const dictionaries: Record<Locale, Dictionary> = { en, fr };

export function getDictionary(locale: string): Dictionary {
  return dictionaries[(locale as Locale) in dictionaries ? (locale as Locale) : defaultLocale];
}

export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}
