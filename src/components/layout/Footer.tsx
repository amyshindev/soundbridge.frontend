'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export const Footer = () => {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-20 border-t border-slate-100/80 pb-28 pt-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h5 className="font-bold text-slate-900 mb-2">SoundBridge</h5>
          <p className="text-sm text-slate-500">{t('footer_tagline')}</p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 text-xs text-slate-400">
            <Link href="/terms" className="hover:text-sky-600 transition-colors">
              {t('footer_terms')}
            </Link>
            <span>·</span>
            <Link href="/privacy" className="hover:text-sky-600 transition-colors">
              {t('footer_privacy')}
            </Link>
            <span>·</span>
            <Link href="/about" className="hover:text-sky-600 transition-colors">
              {t('footer_about')}
            </Link>
          </div>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-slate-400 mb-1">
            본 서비스의 음원은 국립국악원 및 한국문화정보원의 공공데이터를 활용합니다.
          </p>
          <div className="flex items-center gap-2 sm:justify-end text-xs text-slate-500 font-medium">
            <span>KOGL 1유형 (출처표시)</span>
            <span>·</span>
            <span>KOGL 2유형 (비상업적 이용)</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-2">{t('footer_copyright', { year })}</p>
        </div>
      </div>
    </footer>
  );
};
