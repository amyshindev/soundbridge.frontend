'use client';

import React from 'react';

export interface LoopBadgeProps {
  beats: number;
}

export const LoopBadge = ({ beats }: LoopBadgeProps) => {
  return (
    <span className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold shrink-0">
      {beats} BEATS
    </span>
  );
};
