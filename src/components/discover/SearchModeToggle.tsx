'use client';

import React from 'react';
import { Music2, Cloud } from 'lucide-react';
import { clsx } from 'clsx';
import type { DiscoverSearchMode } from '@/lib/discoverSearch';
import { useLocale } from '@/context/LocaleContext';

export interface SearchModeToggleProps {
  mode: DiscoverSearchMode;
  onChange: (mode: DiscoverSearchMode) => void;
  className?: string;
}

export const SearchModeToggle = ({ mode, onChange, className }: SearchModeToggleProps) => {
  const { t } = useLocale();

  const options: { id: DiscoverSearchMode; label: string; icon: typeof Music2 }[] = [
    { id: 'song', label: t('discover_mode_song'), icon: Music2 },
    { id: 'mood', label: t('discover_mode_mood'), icon: Cloud },
  ];

  return (
    <div
      className={clsx(
        'inline-flex w-full max-w-md items-center justify-center bg-slate-100/80 p-1 rounded-full',
        className,
      )}
      role="tablist"
      aria-label={t('discover_mode_label')}
    >
      {options.map(({ id, label, icon: Icon }) => {
        const active = mode === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(id)}
            className={clsx(
              'flex items-center gap-1 sm:gap-1.5 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 whitespace-nowrap',
              active
                ? 'bg-white text-sky-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-900',
            )}
          >
            <Icon size={16} className={active ? 'text-sky-500' : 'text-slate-400'} />
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
};
