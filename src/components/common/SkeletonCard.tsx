import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard = ({ className = '' }: SkeletonCardProps) => {
  return (
    <div
      className={twMerge(
        clsx(
          'w-full rounded-3xl bg-white border border-sky-50/50 p-5 overflow-hidden font-sans',
          className,
        ),
      )}
    >
      <div className="flex gap-4 items-start">
        <div className="w-24 h-24 rounded-2xl bg-slate-100 animate-pulse shrink-0" />
        <div className="flex-1 flex flex-col gap-2 pt-1">
          <div className="h-3 w-16 bg-slate-100 rounded animate-pulse" />
          <div className="h-5 w-3/4 bg-slate-100 rounded animate-pulse" />
          <div className="h-3 w-1/2 bg-slate-100 rounded animate-pulse" />
          <div className="flex gap-2 mt-2">
            <div className="h-6 w-14 bg-slate-100 rounded-full animate-pulse" />
            <div className="h-6 w-14 bg-slate-100 rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  );
};
