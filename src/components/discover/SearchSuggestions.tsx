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
  if (query.trim().length < 2) {
    return null;
  }

  return (
    <div
      className="absolute left-0 right-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-[10px] border border-sb-primary/15 bg-white shadow-lg"
      role="listbox"
      aria-label="곡 검색 제안"
    >
      {isLoading && (
        <div className="px-4 py-3 text-[13px] text-sb-muted">{loadingLabel}</div>
      )}

      {!isLoading && suggestions.length === 0 && (
        <div className="px-4 py-3 text-[13px] text-sb-muted">{emptyLabel}</div>
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
              index === activeIndex ? 'bg-sb-accent/10' : 'hover:bg-[#F7F6F3]'
            }`}
          >
            {item.artworkUrl ? (
              <img
                src={item.artworkUrl}
                alt=""
                className="h-10 w-10 shrink-0 rounded-md object-cover bg-[#F0EFEB]"
              />
            ) : (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#F0EFEB] text-sb-muted">
                <Music2 className="h-4 w-4" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="truncate text-[14px] font-medium text-sb-primary">{item.title}</div>
              <div className="truncate text-[12px] text-sb-muted">
                {item.artist}
                {item.album ? ` · ${item.album}` : ''}
              </div>
            </div>
          </button>
        ))}
    </div>
  );
};
