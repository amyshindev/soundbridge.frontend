'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Compass, SlidersHorizontal, Info, Music, User } from 'lucide-react';
import { clsx } from 'clsx';
import { PrimaryButton } from '../common/PrimaryButton';
import { GhostButton } from '../common/GhostButton';
import { LanguageToggle } from '../common/LanguageToggle';
import { useLocale } from '@/context/LocaleContext';

const NAV_ITEMS = [
  {
    href: '/discover',
    label: 'Discover',
    icon: Compass,
    isActive: (pathname: string) => pathname.startsWith('/discover'),
  },
  {
    href: '/create',
    label: 'Create',
    icon: SlidersHorizontal,
    isActive: (pathname: string) => pathname.startsWith('/create'),
  },
  {
    href: '/about',
    label: 'About',
    icon: Info,
    isActive: (pathname: string) => pathname.startsWith('/about'),
  },
] as const;

function NavPill({
  href,
  label,
  icon: Icon,
  active,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={clsx(
        'relative inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-[14px] font-medium transition-all duration-200',
        active
          ? 'bg-white text-sb-primary shadow-[0_2px_8px_rgba(26,26,26,0.06)] ring-1 ring-sb-border/60'
          : 'text-sb-muted hover:text-sb-primary hover:bg-white/50'
      )}
    >
      <Icon
        className={clsx(
          'w-3.5 h-3.5 transition-colors',
          active ? 'text-[#B8985E]' : 'text-sb-muted/80'
        )}
      />
      <span>{label}</span>
      {active ? (
        <span
          className="absolute -bottom-px left-1/2 h-[2px] w-5 -translate-x-1/2 rounded-full bg-[#B8985E]"
          aria-hidden
        />
      ) : null}
    </Link>
  );
}

export const Navbar = () => {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <nav className="sticky top-0 z-100 h-14 w-full bg-sb-bg/90 backdrop-blur-md border-b border-sb-border/80 px-4 md:px-8 flex items-center justify-between font-sans shadow-[0_1px_0_rgba(26,26,26,0.03)]">
      <Link
        href="/"
        className="group flex items-center gap-2.5 text-sb-primary select-none rounded-lg py-1 pr-2 -ml-1 hover:bg-sb-surface/60 transition-colors"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F5F0E8] ring-1 ring-sb-bridge-border/30 group-hover:ring-sb-accent/40 transition-all">
          <Music className="w-4 h-4 text-[#B8985E] fill-[#B8985E]/15" />
        </span>
        <span className="text-[17px] md:text-[18px] font-medium tracking-tight">SoundBridge</span>
      </Link>

      <div className="flex items-center gap-2 md:gap-3">
        <div className="hidden md:flex items-center p-1 rounded-full bg-sb-surface/90 border border-sb-border/70 shadow-[inset_0_1px_2px_rgba(26,26,26,0.04)]">
          {NAV_ITEMS.map((item) => (
            <NavPill
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={item.isActive(pathname)}
            />
          ))}
        </div>

        <LanguageToggle />

        <div className="hidden md:flex items-center gap-2 pl-1">
          <Link href="/auth/login">
            <GhostButton className="px-3.5 py-[6px] text-[13px] font-medium border-sb-border/70 hover:bg-sb-surface">
              {t('nav_login')}
            </GhostButton>
          </Link>
          <Link href="/auth/signup">
            <PrimaryButton className="px-4 py-[7px] text-[13px] font-medium shadow-sm">
              {t('nav_signup')}
            </PrimaryButton>
          </Link>
        </div>

        <Link
          href="/auth/login"
          className="flex md:hidden items-center justify-center p-2 text-sb-primary hover:bg-sb-surface rounded-lg transition-colors"
        >
          <User className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
};
