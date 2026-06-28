'use client';

import React from 'react';
import { useLocale } from '@/context/LocaleContext';
import { clsx } from 'clsx';

export interface LoopUnitFilterProps {
  value: number | null;
  onChange: (value: number | null) => void;
}

export const LoopUnitFilter = ({ value, onChange }: LoopUnitFilterProps) => {
  const { t } = useLocale();

  const options = [
    { label: t('create_loop_12'), value: 12 as number },
    { label: t('create_loop_6'), value: 6 as number },
    { label: t('create_loop_4'), value: 4 as number },
    { label: t('create_loop_all'), value: null },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => (
        <button
          key={opt.label}
          type="button"
          onClick={() => onChange(opt.value)}
          className={clsx(
            'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            value === opt.value
              ? 'bg-slate-900 text-white'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
};
