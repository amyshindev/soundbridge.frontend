'use client';

import React from 'react';
import { Music2 } from 'lucide-react';
import type { TrackSuggestion } from '@/types/api';

export interface SearchSuggestionsProps {
  suggestions: TrackSuggestion[];
  isLoading: boolean;
  query: string;
  activeIndex: number;
  onSelect: (item: TrackSuggestion) => void;
  emptyLabel: string;
  loadingLabel: string;
}

export const SearchSuggestions = ({
  suggestions,
  isLoading,
  query,
  activeIndex,
  onSelect,
  emptyLabel,
  loadingLabel,
}: SearchSuggestionsProps) => {
  if (!query.trim()) {
    return null;
  }

  return (
    <div
      className="absolute left-0 right-0 top-[calc(100%+8px)] z-50 overflow-hidden rounded-2xl border border-sky-100 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.08)]"
      role="listbox"
      aria-label="곡 검색 제안"
    >
      {isLoading && (
        <div className="px-4 py-3 text-sm text-slate-500">{loadingLabel}</div>
      )}

      {!isLoading && suggestions.length === 0 && (
        <div className="px-4 py-3 text-sm text-slate-500">{emptyLabel}</div>
      )}

      {!isLoading &&
        suggestions.map((item, index) => (
          <button
            key={item.id}
            type="button"
            role="option"
            aria-selected={index === activeIndex}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => onSelect(item)}
            className={`flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors ${
              index === activeIndex ? 'bg-sky-50' : 'hover:bg-slate-50'
            }`}
          >
            {item.artworkUrl ? (
              <img
                src={item.artworkUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-lg object-cover bg-sky-50"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-400">
                <Music2 className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-sm font-semibold text-slate-900">{item.title}</div>
              <div className="truncate text-xs text-slate-500">
                {item.artist}
                {item.album ? ` · ${item.album}` : ''}
              </div>
            </div>
          </button>
        ))}
    </div>
  );
};
