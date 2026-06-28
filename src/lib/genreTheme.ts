/** TM genre_mclsf — 커버 그라데이션·배지 색상 */
export const GENRE_THEME: Record<
  string,
  { coverGradient: string; badgeClass: string; playAccentClass: string }
> = {
  궁중음악: {
    coverGradient: 'from-amber-400 to-yellow-600',
    badgeClass: 'bg-amber-50 text-amber-800 border border-amber-100',
    playAccentClass: 'text-amber-600',
  },
  풍류음악: {
    coverGradient: 'from-emerald-400 to-teal-600',
    badgeClass: 'bg-emerald-50 text-emerald-800 border border-emerald-100',
    playAccentClass: 'text-emerald-600',
  },
  판소리: {
    coverGradient: 'from-violet-500 to-purple-700',
    badgeClass: 'bg-violet-50 text-violet-800 border border-violet-100',
    playAccentClass: 'text-violet-600',
  },
  민요: {
    coverGradient: 'from-rose-400 to-orange-500',
    badgeClass: 'bg-rose-50 text-rose-800 border border-rose-100',
    playAccentClass: 'text-rose-600',
  },
  불교음악: {
    coverGradient: 'from-indigo-400 to-slate-600',
    badgeClass: 'bg-indigo-50 text-indigo-800 border border-indigo-100',
    playAccentClass: 'text-indigo-600',
  },
};

const DEFAULT_THEME = {
  coverGradient: 'from-sky-400 to-cyan-500',
  badgeClass: 'bg-sky-50 text-sky-600 border border-sky-100',
  playAccentClass: 'text-sky-500',
};

export function getGenreTheme(genre?: string | null) {
  if (!genre) return DEFAULT_THEME;
  return GENRE_THEME[genre] ?? DEFAULT_THEME;
}
