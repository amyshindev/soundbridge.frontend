'use client';

import React from 'react';
import { Music2 } from 'lucide-react';
import { clsx } from 'clsx';
import { getCoverStyle } from '@/lib/genreTheme';

interface TrackCoverProps {
  instrument?: string;
  genre?: string;
  title?: string;
  className?: string;
  iconClassName?: string;
}

export function TrackCover({ instrument, genre, title, className, iconClassName }: TrackCoverProps) {
  return (
    <div
      className={clsx(
        'relative flex items-center justify-center text-white shadow-sm',
        className,
      )}
      style={getCoverStyle(genre, instrument)}
      aria-hidden={!title}
      title={title}
    >
      <Music2 className={clsx('opacity-90', iconClassName ?? 'w-6 h-6')} />
    </div>
  );
}
