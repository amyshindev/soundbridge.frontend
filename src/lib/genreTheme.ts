import type { CSSProperties } from 'react';

export type GenreTheme = {
  coverStyle: CSSProperties;
  badgeStyle: CSSProperties;
  playColor: string;
};

/** 초록 → 청록 → 하늘 → 파랑 → 보라 스펙트럼 (장르별 톤만 구분) */
export const GENRE_THEME: Record<string, GenreTheme> = {
  궁중음악: {
    coverStyle: { background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)' },
    badgeStyle: { backgroundColor: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0' },
    playColor: '#059669',
  },
  풍류음악: {
    coverStyle: { background: 'linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%)' },
    badgeStyle: { backgroundColor: '#f0fdfa', color: '#0f766e', border: '1px solid #99f6e4' },
    playColor: '#0d9488',
  },
  민요: {
    coverStyle: { background: 'linear-gradient(135deg, #38bdf8 0%, #0284c7 100%)' },
    badgeStyle: { backgroundColor: '#f0f9ff', color: '#0369a1', border: '1px solid #bae6fd' },
    playColor: '#0284c7',
  },
  불교음악: {
    coverStyle: { background: 'linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%)' },
    badgeStyle: { backgroundColor: '#eff6ff', color: '#3730a3', border: '1px solid #bfdbfe' },
    playColor: '#4f46e5',
  },
  판소리: {
    coverStyle: { background: 'linear-gradient(135deg, #818cf8 0%, #7c3aed 100%)' },
    badgeStyle: { backgroundColor: '#f5f3ff', color: '#6d28d9', border: '1px solid #ddd6fe' },
    playColor: '#7c3aed',
  },
};

const DEFAULT_THEME: GenreTheme = {
  coverStyle: { background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 100%)' },
  badgeStyle: { backgroundColor: '#f0f9ff', color: '#0284c7', border: '1px solid #bae6fd' },
  playColor: '#0ea5e9',
};

const INSTRUMENT_COVER: Record<string, CSSProperties> = {
  가야금: { background: 'linear-gradient(135deg, #38bdf8 0%, #06b6d4 100%)' },
  거문고: { background: 'linear-gradient(135deg, #818cf8 0%, #6366f1 100%)' },
  대금: { background: 'linear-gradient(135deg, #2dd4bf 0%, #0891b2 100%)' },
  해금: { background: 'linear-gradient(135deg, #60a5fa 0%, #4f46e5 100%)' },
  피리: { background: 'linear-gradient(135deg, #34d399 0%, #0d9488 100%)' },
  아쟁: { background: 'linear-gradient(135deg, #a78bfa 0%, #7c3aed 100%)' },
  장구: { background: 'linear-gradient(135deg, #22d3ee 0%, #2563eb 100%)' },
  소고: { background: 'linear-gradient(135deg, #4ade80 0%, #14b8a6 100%)' },
  가창: { background: 'linear-gradient(135deg, #0ea5e9 0%, #2563eb 100%)' },
  판소리: { background: 'linear-gradient(135deg, #818cf8 0%, #7c3aed 100%)' },
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
