'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';

export interface LoopBadgeProps {
  beats: number;
}

export const LoopBadge = ({ beats }: LoopBadgeProps) => {
  const { t } = useLocale();

  return (
    <span className="inline-flex items-center bg-sb-bridge-bg text-sb-bridge-text border border-sb-accent rounded-full px-2 py-0.5 text-[10px] font-medium font-sans select-none shrink-0">
      {t('create_loop_beats', { count: beats })}
    </span>
  );
};
