import type { CSSProperties } from 'react';

export type GenreTheme = {
  coverStyle: CSSProperties;
  badgeStyle: CSSProperties;
  playColor: string;
};

export const GENRE_THEME: Record<string, GenreTheme> = {
  궁중음악: {
    coverStyle: { background: 'linear-gradient(135deg, #fbbf24 0%, #ca8a04 100%)' },
    badgeStyle: { backgroundColor: '#fffbeb', color: '#92400e', border: '1px solid #fde68a' },
    playColor: '#d97706',
  },
  풍류음악: {
    coverStyle: { background: 'linear-gradient(135deg, #34d399 0%, #0d9488 100%)' },
    badgeStyle: { backgroundColor: '#ecfdf5', color: '#065f46', border: '1px solid #a7f3d0' },
    playColor: '#059669',
  },
  판소리: {
    coverStyle: { background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' },
    badgeStyle: { backgroundColor: '#f5f3ff', color: '#5b21b6', border: '1px solid #ddd6fe' },
    playColor: '#7c3aed',
  },
  민요: {
    coverStyle: { background: 'linear-gradient(135deg, #fb7185 0%, #f97316 100%)' },
    badgeStyle: { backgroundColor: '#fff1f2', color: '#9f1239', border: '1px solid #fecdd3' },
    playColor: '#e11d48',
  },
  불교음악: {
    coverStyle: { background: 'linear-gradient(135deg, #818cf8 0%, #475569 100%)' },
    badgeStyle: { backgroundColor: '#eef2ff', color: '#3730a3', border: '1px solid #c7d2fe' },
    playColor: '#4f46e5',
  },
};

const DEFAULT_THEME: GenreTheme = {
  coverStyle: { background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 100%)' },
  badgeStyle: { backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' },
  playColor: '#0ea5e9',
};

const INSTRUMENT_COVER: Record<string, CSSProperties> = {
  가야금: { background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 100%)' },
  거문고: { background: 'linear-gradient(135deg, #818cf8 0%, #7c3aed 100%)' },
  대금: { background: 'linear-gradient(135deg, #2dd4bf 0%, #059669 100%)' },
  해금: { background: 'linear-gradient(135deg, #fb7185 0%, #ec4899 100%)' },
  피리: { background: 'linear-gradient(135deg, #fbbf24 0%, #f97316 100%)' },
  아쟁: { background: 'linear-gradient(135deg, #e879f9 0%, #a855f7 100%)' },
  장구: { background: 'linear-gradient(135deg, #64748b 0%, #334155 100%)' },
  소고: { background: 'linear-gradient(135deg, #a3e635 0%, #16a34a 100%)' },
  가창: { background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' },
  판소리: { background: 'linear-gradient(135deg, #8b5cf6 0%, #4f46e5 100%)' },
};

export function getGenreTheme(genre?: string | null): GenreTheme {
  if (!genre?.trim()) return DEFAULT_THEME;
  return GENRE_THEME[genre.trim()] ?? DEFAULT_THEME;
}

export function getCoverStyle(genre?: string | null, instrument?: string): CSSProperties {
  if (genre?.trim() && GENRE_THEME[genre.trim()]) {
    return GENRE_THEME[genre.trim()].coverStyle;
  }
  if (instrument && INSTRUMENT_COVER[instrument]) {
    return INSTRUMENT_COVER[instrument];
  }
  return DEFAULT_THEME.coverStyle;
}
