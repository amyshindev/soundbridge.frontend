'use client';

import React from 'react';
import { clsx } from 'clsx';
import { useLocale } from '@/context/LocaleContext';

export interface LicenseBadgeProps {
  licenseType: 'KOGL_1' | 'KOGL_2';
}

export const LicenseBadge = ({ licenseType }: LicenseBadgeProps) => {
  const { t } = useLocale();
  const isKogl1 = licenseType === 'KOGL_1';

  return (
    <span
      className={clsx(
        'px-2 py-0.5 rounded text-[10px] font-bold shrink-0',
        isKogl1 ? 'bg-green-50 text-green-700' : 'bg-yellow-50 text-yellow-700',
      )}
    >
      {isKogl1 ? t('create_license_commercial') : t('create_license_attribution')}
    </span>
  );
};
