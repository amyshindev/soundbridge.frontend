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

  const isDiscover = pathname.startsWith('/discover') || pathname === '/';
  const isCreate = pathname.startsWith('/create');
  const isSaved = pathname.startsWith('/saved');

  const tabClass = (active: boolean) =>
    clsx(
      'flex flex-col items-center justify-center w-full h-full gap-0.5 py-1',
      active ? 'text-sky-600' : 'text-slate-400',
    );

  return (
    <div className="md:hidden fixed bottom-0 left-0 w-full bg-white/90 backdrop-blur-md border-t border-sky-100 z-40 font-sans select-none sb-safe-bottom">
      <div className="flex items-stretch justify-around h-14">
        <Link href="/discover" className={tabClass(isDiscover)}>
          <Music className={clsx('w-5 h-5', isDiscover && 'text-sky-500')} />
          <span className="text-[10px] font-semibold">Discover</span>
        </Link>

        <Link href="/create" className={tabClass(isCreate)}>
          <SlidersHorizontal className={clsx('w-5 h-5', isCreate && 'text-sky-500')} />
          <span className="text-[10px] font-semibold">Create</span>
        </Link>

        <Link href="/auth/login" className={tabClass(isSaved)}>
          <Heart className={clsx('w-5 h-5', isSaved && 'text-sky-500')} />
          <span className="text-[10px] font-semibold">{t('tab_saved')}</span>
        </Link>
      </div>
    </div>
  );
};
