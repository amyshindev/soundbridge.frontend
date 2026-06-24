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
        'inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium font-sans select-none shrink-0',
        isKogl1 ? 'bg-[#EAF2EE] text-sb-green' : 'bg-[#E6EFF8] text-sb-blue'
      )}
    >
      {isKogl1 ? t('create_license_commercial') : t('create_license_attribution')}
    </span>
  );
};
