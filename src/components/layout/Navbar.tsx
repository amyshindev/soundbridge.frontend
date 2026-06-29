'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Music2 } from 'lucide-react';
import { clsx } from 'clsx';
import { LanguageToggle } from '../common/LanguageToggle';
import { useLocale } from '@/context/LocaleContext';

const NAV_ITEMS = [
  { href: '/discover', label: 'DISCOVER' },
  { href: '/create', label: 'CREATE' },
] as const;

export const Navbar = () => {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-sky-50/50 pt-[env(safe-area-inset-top,0px)]">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2">
          <Link href="/discover" className="flex items-center gap-1.5 sm:gap-2 group min-w-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center text-white shadow-sm group-hover:shadow-md transition-shadow shrink-0">
              <Music2 size={18} />
            </div>
            <span className="font-bold text-base sm:text-xl tracking-normal text-slate-900 truncate">
              SoundBridge
            </span>
          </Link>

          <nav className="hidden md:flex items-center bg-slate-100/80 p-1 rounded-full">
            {NAV_ITEMS.map((item) => {
              const active = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={clsx(
                    'px-5 py-1.5 rounded-full text-sm font-semibold transition-all duration-200',
                    active
                      ? 'bg-white text-sky-600 shadow-sm'
                      : 'text-slate-500 hover:text-slate-900',
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <LanguageToggle />
            <Link
              href="/about"
              className="hidden sm:inline text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors px-2 py-1"
            >
              {t('footer_about')}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};
