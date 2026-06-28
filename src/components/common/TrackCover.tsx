'use client';

import React from 'react';
import { Music2 } from 'lucide-react';
import { clsx } from 'clsx';

const INSTRUMENT_GRADIENT: Record<string, string> = {
  가야금: 'from-sky-400 to-cyan-500',
  거문고: 'from-indigo-400 to-violet-500',
  대금: 'from-teal-400 to-emerald-500',
  해금: 'from-rose-400 to-pink-500',
  피리: 'from-amber-400 to-orange-400',
  아쟁: 'from-fuchsia-400 to-purple-500',
  장구: 'from-slate-500 to-slate-700',
  소고: 'from-lime-400 to-green-500',
  가창: 'from-sky-500 to-blue-600',
  판소리: 'from-violet-500 to-indigo-600',
};

interface TrackCoverProps {
  instrument?: string;
  title?: string;
  className?: string;
  iconClassName?: string;
}

export function TrackCover({ instrument, title, className, iconClassName }: TrackCoverProps) {
  const gradient = (instrument && INSTRUMENT_GRADIENT[instrument]) || 'from-sky-400 to-cyan-500';

  return (
    <div
      className={clsx(
        'relative flex items-center justify-center bg-gradient-to-br text-white shadow-sm',
        gradient,
        className,
      )}
      aria-hidden={!title}
      title={title}
    >
      <Music2 className={clsx('opacity-90', iconClassName ?? 'w-6 h-6')} />
    </div>
  );
}
