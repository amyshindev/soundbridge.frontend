'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { useLocale } from '@/context/LocaleContext';

export interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
}

export const SearchBar = ({ initialValue = '', placeholder }: SearchBarProps) => {
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

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-[520px] h-12 bg-white border border-sb-primary rounded-[10px] shadow-sm flex items-center px-4 gap-3 focus-within:ring-2 focus-within:ring-sb-accent/30 transition-all font-sans"
    >
      <Search className="w-4 h-4 text-sb-muted shrink-0" />

      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder ?? t('search_placeholder')}
        className="flex-1 bg-transparent border-none outline-none text-[13px] text-sb-primary placeholder:text-sb-muted min-w-0"
      />

      <PrimaryButton type="submit" className="px-4 py-1.5 rounded-lg shrink-0 text-[12px]">
        {t('search_submit')}
      </PrimaryButton>
    </form>
  );
};
