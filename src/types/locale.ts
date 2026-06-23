export type Locale = 'ko' | 'en';

export const LOCALES: Locale[] = ['ko', 'en'];

export const LOCALE_STORAGE_KEY = 'sb-locale';

export function isLocale(value: string | null | undefined): value is Locale {
  return value === 'ko' || value === 'en';
}
