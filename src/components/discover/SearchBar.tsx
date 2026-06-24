'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { useLocale } from '@/context/LocaleContext';

export interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  size?: 'default' | 'large';
}

export const SearchBar = ({ initialValue = '', placeholder, size = 'default' }: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [query, setQuery] = useState(initialValue);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
    } else if (q === null) {
      setQuery('');
    }
  }, [searchParams]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    router.push(`/discover?q=${encodeURIComponent(query.trim())}`);
  };

  const isLarge = size === 'large';

  return (
    <form
      onSubmit={handleSubmit}
      className={`w-full bg-white border border-sb-primary rounded-[10px] shadow-sm flex items-center gap-3 focus-within:ring-2 focus-within:ring-sb-accent/30 transition-all font-sans ${
        isLarge ? 'max-w-[600px] h-14 px-5' : 'max-w-[520px] h-12 px-4'
      }`}
    >
      <Search className={`text-sb-muted shrink-0 ${isLarge ? 'w-5 h-5' : 'w-4 h-4'}`} />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? t('search_placeholder')}
        className={`flex-1 bg-transparent border-none outline-none text-sb-primary placeholder:text-sb-muted min-w-0 ${
          isLarge ? 'text-[15px] md:text-[16px]' : 'text-[13px]'
        }`}
      />

      <PrimaryButton
        type="submit"
        className={`rounded-lg shrink-0 ${isLarge ? 'px-5 py-2 text-[14px]' : 'px-4 py-1.5 text-[12px]'}`}
      >
        {t('search_submit')}
      </PrimaryButton>
    </form>
  );
};
