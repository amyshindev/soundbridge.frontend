'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { usePlayer } from '@/hooks/usePlayer';
import { Music, SlidersHorizontal, Heart } from 'lucide-react';
import { clsx } from 'clsx';
import { useLocale } from '@/context/LocaleContext';

export const BottomTabBar = () => {
  const pathname = usePathname();
  const { t } = useLocale();
  const { currentTrack } = usePlayer();

  if (currentTrack) return null;

  const isDiscover = pathname.startsWith('/discover');
  const isCreate = pathname.startsWith('/create');
  const isSaved = pathname.startsWith('/saved');

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full h-14 bg-white/90 backdrop-blur-md border-t border-sky-100 flex items-center justify-around z-40 font-sans select-none">
      <Link
        href="/discover"
        className="flex flex-col items-center justify-center w-full h-full gap-0.5"
      >
        <Music
          className={clsx(
            'w-5 h-5 transition-colors',
            isDiscover ? 'text-sky-500' : 'text-slate-400',
          )}
        />
        {isDiscover && (
          <span className="text-[10px] font-semibold text-sky-600">Discover</span>
        )}
      </Link>

      <Link
        href="/create"
        className="flex flex-col items-center justify-center w-full h-full gap-0.5"
      >
        <SlidersHorizontal
          className={clsx(
            'w-5 h-5 transition-colors',
            isCreate ? 'text-sky-500' : 'text-slate-400',
          )}
        />
        {isCreate && (
          <span className="text-[10px] font-semibold text-sky-600">Create</span>
        )}
      </Link>

      <Link
        href="/auth/login"
        className="flex flex-col items-center justify-center w-full h-full gap-0.5"
      >
        <Heart
          className={clsx(
            'w-5 h-5 transition-colors',
            isSaved ? 'text-sky-500' : 'text-slate-400',
          )}
        />
        {isSaved && (
          <span className="text-[10px] font-semibold text-sky-600">{t('tab_saved')}</span>
        )}
      </Link>
    </div>
  );
};
