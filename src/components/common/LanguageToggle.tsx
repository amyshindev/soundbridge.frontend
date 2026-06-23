'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useLocale } from '@/context/LocaleContext';
import type { Locale } from '@/types/locale';

export const LanguageToggle = () => {
  const { locale, setLocale } = useLocale();

  const renderOption = (code: Locale, label: string) => (
    <button
      type="button"
      onClick={() => setLocale(code)}
      className={clsx(
        'px-0.5 py-0 text-[11px] font-medium transition-colors',
        locale === code ? 'text-sb-primary' : 'text-sb-muted hover:text-sb-primary'
      )}
      aria-pressed={locale === code}
      aria-label={code === 'ko' ? '한국어' : 'English'}
    >
      {label}
    </button>
  );

  return (
    <div
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg hover:bg-sb-surface transition-colors select-none"
      role="group"
      aria-label="Language"
    >
      {renderOption('ko', 'KO')}
      <span className="text-[11px] text-sb-border" aria-hidden>
        |
      </span>
      {renderOption('en', 'EN')}
    </div>
  );
};
