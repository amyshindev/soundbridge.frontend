export type DiscoverSearchMode = 'song' | 'mood';

export const DISCOVER_MODE_STORAGE_KEY = 'sb:discover_mode';

export const MOOD_SEARCH_MIN_LENGTH = 2;

export function parseDiscoverMode(raw: string | null | undefined): DiscoverSearchMode {
  return raw === 'mood' ? 'mood' : 'song';
}

export function loadDiscoverMode(): DiscoverSearchMode {
  if (typeof window === 'undefined') return 'song';
  try {
    return parseDiscoverMode(localStorage.getItem(DISCOVER_MODE_STORAGE_KEY));
  } catch {
    return 'song';
  }
}

export function saveDiscoverMode(mode: DiscoverSearchMode): void {
  try {
    localStorage.setItem(DISCOVER_MODE_STORAGE_KEY, mode);
  } catch {
    // ignore quota / private mode
  }
}

export function buildDiscoverHref(q: string, mode: DiscoverSearchMode): string {
  const params = new URLSearchParams({ mode });
  const trimmed = q.trim();
  if (trimmed) {
    params.set('q', trimmed);
  }
  return `/discover?${params.toString()}`;
}

export function formatDiscoverSummary(
  query: string,
  mode: DiscoverSearchMode,
  locale: 'ko' | 'en',
  fallback?: string,
): string {
  if (mode === 'song' && fallback) {
    return fallback;
  }
  if (mode === 'mood') {
    if (locale === 'en') {
      return `Gugak that fits how you feel: "${query}"`;
    }
    return `지금 느끼는 "${query}"에 어울리는 국악`;
  }
  if (locale === 'en') {
    return `Gugak with a similar vibe to "${query}"`;
  }
  return `"${query}" 와 감성이 닮은 국악`;
}

export const SONG_SUGGESTION_CHIPS = ['Coldplay', '아이유', 'Billie Eilish', '재즈', '클래식'] as const;

export const MOOD_SUGGESTION_CHIPS = [
  '비 오는 날 우울함',
  '설레는 새벽',
  '차분하게 집중',
  '웅장한 결심',
] as const;
