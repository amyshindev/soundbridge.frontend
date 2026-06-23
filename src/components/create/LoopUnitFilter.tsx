'use client';

import React from 'react';
import { Chip } from '../common/Chip';
import { useLocale } from '@/context/LocaleContext';

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
    <div className="flex flex-wrap gap-1.5 font-sans">
      {options.map((opt) => (
        <Chip
          key={opt.label}
          label={opt.label}
          variant="gold"
          active={value === opt.value}
          onClick={() => onChange(opt.value)}
          className="py-1 px-2.5 text-[11px]"
        />
      ))}
    </div>
  );
};
