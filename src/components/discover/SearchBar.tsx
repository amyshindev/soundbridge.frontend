'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Search, Loader2 } from 'lucide-react';
import { SearchSuggestions } from './SearchSuggestions';
import { SearchModeToggle } from './SearchModeToggle';
import { useLocale } from '@/context/LocaleContext';
import { suggestReleasedTracks } from '@/lib/api';
import type { TrackSuggestion } from '@/types/api';
import {
  type DiscoverSearchMode,
  buildDiscoverHref,
  loadDiscoverMode,
  MOOD_SEARCH_MIN_LENGTH,
  parseDiscoverMode,
  saveDiscoverMode,
} from '@/lib/discoverSearch';

export interface SearchBarProps {
  initialValue?: string;
  initialMode?: DiscoverSearchMode;
  placeholder?: string;
  size?: 'default' | 'large';
  isSearching?: boolean;
  showModeToggle?: boolean;
  onModeChange?: (mode: DiscoverSearchMode) => void;
}

const DEBOUNCE_MS = 300;

export const SearchBar = ({
  initialValue = '',
  initialMode,
  placeholder,
  size = 'default',
  isSearching = false,
  showModeToggle = true,
  onModeChange,
}: SearchBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLocale();
  const [query, setQuery] = useState(initialValue);
  const [mode, setMode] = useState<DiscoverSearchMode>(() => initialMode ?? loadDiscoverMode());
  const [suggestions, setSuggestions] = useState<TrackSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const isDiscoverPage = pathname.startsWith('/discover');
  const urlMode = parseDiscoverMode(searchParams.get('mode'));

  useEffect(() => {
    if (isDiscoverPage) {
      setMode(urlMode);
    }
  }, [isDiscoverPage, urlMode]);

  useEffect(() => {
    if (initialMode) {
      setMode(initialMode);
    }
  }, [initialMode]);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) {
      setQuery(q);
    } else if (q === null && isDiscoverPage) {
      setQuery('');
    }
  }, [searchParams, isDiscoverPage]);

  const navigateToDiscover = useCallback(
    (text: string, searchMode: DiscoverSearchMode = mode) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      if (searchMode === 'mood' && trimmed.length < MOOD_SEARCH_MIN_LENGTH) return;
      setIsOpen(false);
      router.push(buildDiscoverHref(trimmed, searchMode));
    },
    [router, mode],
  );

  const handleModeChange = useCallback(
    (next: DiscoverSearchMode) => {
      setMode(next);
      saveDiscoverMode(next);
      onModeChange?.(next);
      setQuery('');
      setSuggestions([]);
      setIsOpen(false);
      setActiveIndex(-1);
      if (isDiscoverPage) {
        router.push(buildDiscoverHref('', next));
      }
    },
    [isDiscoverPage, router, onModeChange],
  );

  const handleSelect = useCallback(
    (item: TrackSuggestion) => {
      const label = item.display || `${item.artist} — ${item.title}`;
      setQuery(label);
      navigateToDiscover(label, 'song');
    },
    [navigateToDiscover],
  );

  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (mode !== 'song') {
      setSuggestions([]);
      setIsLoading(false);
      setActiveIndex(-1);
      return;
    }

    const trimmed = query.trim();
    if (!trimmed) {
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
  }, [query, mode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const canSubmit =
    query.trim().length > 0 &&
    (mode === 'song' || query.trim().length >= MOOD_SEARCH_MIN_LENGTH);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    if (mode === 'song' && activeIndex >= 0 && suggestions[activeIndex]) {
      handleSelect(suggestions[activeIndex]);
      return;
    }
    navigateToDiscover(query, mode);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (mode !== 'song' || !isOpen || suggestions.length === 0) {
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
  const inputPlaceholder =
    placeholder ??
    (mode === 'mood' ? t('search_placeholder_mood') : t('search_placeholder'));

  return (
    <div
      ref={containerRef}
      className={`relative w-full flex flex-col items-center gap-4 ${isLarge ? 'max-w-2xl' : 'max-w-xl'}`}
    >
      {showModeToggle && (
        <SearchModeToggle mode={mode} onChange={handleModeChange} />
      )}

      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={`relative flex items-center bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-shadow focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.08)] ${
            isLarge ? 'p-2' : 'p-1.5'
          }`}
        >
          <Search
            className={`absolute text-slate-400 shrink-0 ${isLarge ? 'left-6' : 'left-4'}`}
            size={isLarge ? 20 : 18}
          />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              if (mode === 'song') {
                setIsOpen(true);
              }
            }}
            onFocus={() => {
              if (mode === 'song') {
                setIsOpen(true);
              }
            }}
            onKeyDown={handleKeyDown}
            placeholder={inputPlaceholder}
            autoComplete="off"
            maxLength={200}
            role={mode === 'song' ? 'combobox' : undefined}
            aria-expanded={mode === 'song' && isOpen && query.trim().length >= 1}
            aria-autocomplete={mode === 'song' ? 'list' : undefined}
            className={`w-full bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400 font-medium min-w-0 ${
              isLarge
                ? 'pl-12 pr-4 py-4 text-base sm:text-lg'
                : 'pl-10 pr-3 py-3 text-sm sm:text-base'
            }`}
          />
          <button
            type="submit"
            disabled={!canSubmit || isSearching}
            className={`bg-sky-500 hover:bg-sky-600 disabled:opacity-50 disabled:hover:bg-sky-500 text-white rounded-xl font-semibold transition-colors shrink-0 flex items-center gap-2 ${
              isLarge ? 'px-6 sm:px-8 py-3.5' : 'px-5 py-2.5 text-sm'
            }`}
          >
            {isSearching ? (
              <Loader2 size={18} className="animate-spin" />
            ) : (
              t('search_submit')
            )}
          </button>
        </div>
      </form>

      {mode === 'song' && isOpen && (
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
