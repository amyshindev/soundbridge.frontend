'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Search } from 'lucide-react';
import { PrimaryButton } from '../common/PrimaryButton';
import { SearchSuggestions } from './SearchSuggestions';
import { useLocale } from '@/context/LocaleContext';
import { suggestReleasedTracks } from '@/lib/api';
import type { TrackSuggestion } from '@/types/api';

export interface SearchBarProps {
  initialValue?: string;
  placeholder?: string;
  size?: 'default' | 'large';
}

const DEBOUNCE_MS = 300;

export const SearchBar = ({ initialValue = '', placeholder, size = 'default' }: SearchBarProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState<TrackSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
    } else if (q === null) {
      setQuery('');
    }
  }, [searchParams]);

  const navigateToDiscover = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      setIsOpen(false);
      router.push(`/discover?q=${encodeURIComponent(trimmed)}`);
    },
    [router],
  );

  const handleSelect = useCallback(
    (item: TrackSuggestion) => {
      const label = item.display || `${item.artist} — ${item.title}`;
      setQuery(label);
      navigateToDiscover(label);
    },
    [navigateToDiscover],
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    const trimmed = query.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      try {
        const items = await suggestReleasedTracks(trimmed);
        setSuggestions(items);
        setActiveIndex(items.length > 0 ? 0 : -1);
      } catch {
        setSuggestions([]);
        setActiveIndex(-1);
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
      return;
    }
    navigateToDiscover(query);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) {
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1) % suggestions.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev <= 0 ? suggestions.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      setIsOpen(false);
      setActiveIndex(-1);
    }
  };

  const isLarge = size === 'large';

  return (
    <div ref={containerRef} className={`relative w-full ${isLarge ? 'max-w-[600px]' : 'max-w-[520px]'}`}>
      <form
        onSubmit={handleSubmit}
        className={`w-full bg-white border border-sb-primary rounded-[10px] shadow-sm flex items-center gap-3 focus-within:ring-2 focus-within:ring-sb-accent/30 transition-all font-sans ${
          isLarge ? 'h-14 px-5' : 'h-12 px-4'
        }`}
      >
        <Search className={`text-sb-muted shrink-0 ${isLarge ? 'w-5 h-5' : 'w-4 h-4'}`} />

        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder ?? t('search_placeholder')}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen && query.trim().length >= 2}
          aria-autocomplete="list"
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

      {isOpen && (
        <SearchSuggestions
          suggestions={suggestions}
          isLoading={isLoading}
          query={query}
          activeIndex={activeIndex}
          onSelect={handleSelect}
          emptyLabel={t('search_suggest_empty')}
          loadingLabel={t('search_suggest_loading')}
        />
      )}
    </div>
  );
};
