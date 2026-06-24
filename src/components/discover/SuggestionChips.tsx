'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Chip } from '../common/Chip';
import { useLocale } from '@/context/LocaleContext';

export interface SuggestionChipsProps {
  size?: 'default' | 'large';
}

export const SuggestionChips = ({ size = 'default' }: SuggestionChipsProps) => {
  const router = useRouter();
  const { t } = useLocale();
  const suggestions = ['Coldplay', '아이유', 'Billie Eilish', '재즈', '클래식'];

  const handleClick = (value: string) => {
    router.push(`/discover?q=${encodeURIComponent(value)}`);
  };

  const isLarge = size === 'large';

  return (
    <div className={`flex flex-wrap items-center justify-center font-sans select-none ${isLarge ? 'gap-2' : 'gap-1.5'}`}>
      <span className={`text-sb-muted mr-1 ${isLarge ? 'text-[13px] md:text-[14px]' : 'text-[11px]'}`}>
        {t('suggestion_label')}
      </span>
      {suggestions.map((item) => (
        <Chip
          key={item}
          label={item}
          variant="default"
          active={false}
          onClick={() => handleClick(item)}
          className={`border-sb-border text-sb-muted hover:border-sb-muted ${
            isLarge ? 'py-1 px-3 text-[13px] md:text-[14px]' : 'py-[3px] px-2.5 text-[11px]'
          }`}
        />
      ))}
    </div>
  );
};
