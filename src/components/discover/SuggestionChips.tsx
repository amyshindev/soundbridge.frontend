'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useLocale } from '@/context/LocaleContext';
import {
  type DiscoverSearchMode,
  buildDiscoverHref,
  MOOD_SUGGESTION_CHIPS,
  SONG_SUGGESTION_CHIPS,
} from '@/lib/discoverSearch';

export interface SuggestionChipsProps {
  size?: 'default' | 'large';
  mode?: DiscoverSearchMode;
}

export const SuggestionChips = ({ size = 'default', mode = 'song' }: SuggestionChipsProps) => {
  const router = useRouter();
  const { t } = useLocale();
  const suggestions = mode === 'mood' ? MOOD_SUGGESTION_CHIPS : SONG_SUGGESTION_CHIPS;

  const handleClick = (value: string) => {
    router.push(buildDiscoverHref(value, mode));
  };

  const isLarge = size === 'large';

  return (
    <div
      className={`flex flex-wrap items-center justify-center font-sans select-none ${
        isLarge ? 'gap-2' : 'gap-1.5'
      }`}
    >
      <span className={`text-slate-400 mr-1 ${isLarge ? 'text-sm' : 'text-xs'}`}>
        {t('suggestion_label')}
      </span>
      {suggestions.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => handleClick(item)}
          className={`rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-sky-50 hover:border-sky-200 hover:text-sky-700 transition-colors font-medium ${
            isLarge ? 'py-1 px-3 text-sm' : 'py-0.5 px-2.5 text-xs'
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
};
