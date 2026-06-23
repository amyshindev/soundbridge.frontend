'use client';

import React from 'react';
import Link from 'next/link';
import { useLocale } from '@/context/LocaleContext';

export const Footer = () => {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-sb-surface border-t border-sb-border py-8 px-4 font-sans text-center md:text-left">
      <div className="max-w-[1080px] mx-auto flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-baseline gap-2">
          <span className="text-[14px] font-medium text-sb-primary">SoundBridge</span>
          <span className="text-[12px] text-sb-muted">{t('footer_tagline')}</span>
        </div>

        <div className="flex flex-wrap justify-center md:justify-start items-center gap-x-4 gap-y-1 text-[12px] text-sb-muted font-normal">
          <Link href="/about" className="hover:text-sb-primary transition-colors">
            {t('footer_about')}
          </Link>
          <span className="text-sb-border">|</span>
          <Link href="/terms" className="hover:text-sb-primary transition-colors">
            {t('footer_terms')}
          </Link>
          <span className="text-sb-border">|</span>
          <Link href="/privacy" className="hover:text-sb-primary transition-colors font-medium">
            {t('footer_privacy')}
          </Link>
          <span className="text-sb-border">|</span>
          <a href="mailto:support@soundbridge.site" className="hover:text-sb-primary transition-colors">
            {t('footer_contact')}
          </a>
        </div>

        <div className="flex flex-col md:flex-row md:justify-between gap-2 text-[11px] text-sb-muted border-t border-sb-border/50 pt-4 mt-1">
          <span>{t('footer_copyright', { year })}</span>
          <span className="font-mono text-[10px] md:text-[11px]">{t('footer_made_with')}</span>
        </div>
      </div>
    </footer>
  );
};
