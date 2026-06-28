'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/discover/SearchBar';
import { SuggestionChips } from '@/components/discover/SuggestionChips';
import { ResultCard } from '@/components/discover/ResultCard';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { discoverTracks, getPopularTracks, ApiError } from '@/lib/api';
import { useLocale } from '@/context/LocaleContext';
import { MatchResult, GugakTrack } from '@/types/track';
import { Search, Sparkles, AlertTriangle } from 'lucide-react';
import {
  buildDiscoverHref,
  formatDiscoverSummary,
  parseDiscoverMode,
} from '@/lib/discoverSearch';

const DiscoverContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useLocale();
  const query = searchParams.get('q') || '';
  const mode = parseDiscoverMode(searchParams.get('mode'));

  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<MatchResult[]>([]);
  const [inputSummary, setInputSummary] = useState('');
  const [popularTracks, setPopularTracks] = useState<GugakTrack[]>([]);
  const [searchError, setSearchError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        setResults([]);
        setInputSummary('');
        setSearchError(null);
        try {
          setIsLoading(true);
          const popular = await getPopularTracks();
          setPopularTracks(popular.tracks);
        } catch (e) {
          console.error(e);
        } finally {
          setIsLoading(false);
        }
        return;
      }

      setIsLoading(true);
      setSearchError(null);
      try {
        const data = await discoverTracks(query, locale);
        setResults(data.tracks);
        setInputSummary(formatDiscoverSummary(query, mode, locale, data.inputSummary));
      } catch (e) {
        console.error('Search failed', e);
        setResults([]);
        if (e instanceof ApiError && e.status === 503) {
          setSearchError(t('discover_error_503'));
        } else if (e instanceof ApiError && e.status === 408) {
          setSearchError(e.message);
        } else if (
          e instanceof TypeError ||
          (e instanceof Error && /fetch|network|failed/i.test(e.message))
        ) {
          setSearchError(t('discover_error_network'));
        } else {
          setSearchError(t('discover_error_generic'));
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, locale, mode, t]);

  const handleResetSearch = () => {
    router.push(buildDiscoverHref('', mode));
  };

  const handleRetry = () => {
    router.refresh();
  };

  const heroSubtitle =
    mode === 'mood' ? t('discover_hero_subtitle_mood') : t('home_hero_subtitle');

  const loadingTitle = mode === 'mood' ? t('discover_loading_mood') : t('discover_loading');

  return (
    <div className="flex flex-col gap-12 sm:gap-16 pb-10 max-w-4xl mx-auto">
      <section className="text-center pt-4 sm:pt-8">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold mb-6">
          <Sparkles size={14} className="text-sky-500" />
          <span>AI 음악 감성 번역기</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-normal mb-4 leading-tight">
          {mode === 'mood' ? (
            locale === 'en' ? (
              <>
                <span className="text-sky-500">Gugak</span> for how you feel
                <br />
                right now
              </>
            ) : (
              <>
                지금 <span className="text-sky-500">기분</span>에 맞는
                <br />
                국악을 찾아드려요
              </>
            )
          ) : locale === 'en' ? (
            <>
              Your <span className="text-sky-500">playlist</span> language,
              <br />
              meet gugak
            </>
          ) : (
            <>
              당신의 <span className="text-sky-500">Playlist</span> 언어로
              <br />
              국악을 소개합니다
            </>
          )}
        </h1>
        <p className="text-slate-500 text-sm sm:text-base max-w-lg mx-auto mb-10">{heroSubtitle}</p>

        <div className="relative max-w-2xl mx-auto">
          <SearchBar
            initialValue={query}
            initialMode={mode}
            size="large"
            isSearching={isLoading && !!query}
          />
        </div>

        {!query && (
          <div className="mt-6">
            <SuggestionChips size="large" mode={mode} />
          </div>
        )}
      </section>

      {isLoading && query && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 border-4 border-sky-100 rounded-full" />
            <div className="absolute inset-0 border-4 border-sky-500 rounded-full border-t-transparent animate-spin" />
            <Sparkles className="absolute inset-0 m-auto text-sky-400 animate-pulse" size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">{loadingTitle}</h3>
          <p className="text-slate-500 text-sm">{t('discover_wait')}</p>
        </div>
      )}

      {!isLoading && query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-100">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 truncate">
              {inputSummary || formatDiscoverSummary(query, mode, locale)}
            </h2>
            <div className="flex items-center gap-2 shrink-0">
              {results.length > 0 && (
                <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-full">
                  Top {results.length}
                </span>
              )}
              <button
                type="button"
                onClick={handleResetSearch}
                className="text-xs text-slate-500 hover:text-sky-600 font-medium transition-colors"
              >
                {t('discover_reset')}
              </button>
            </div>
          </div>

          {searchError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle className="w-10 h-10 text-red-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('discover_error_title')}</h3>
              <p className="text-sm text-slate-500 max-w-sm mb-4">{searchError}</p>
              <button
                type="button"
                onClick={handleRetry}
                className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors"
              >
                {t('discover_error_retry')}
              </button>
            </div>
          ) : results.length > 0 ? (
            <div className="grid gap-4">
              {results.map((result) => (
                <ResultCard
                  key={result.track.id}
                  track={result.track}
                  matchScore={result.score}
                  explanation={result.explanation}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <Search className="w-10 h-10 text-slate-300 mb-3" />
              <h3 className="text-lg font-bold text-slate-900 mb-1">{t('discover_empty_title')}</h3>
              <p className="text-sm text-slate-500 max-w-sm">{t('discover_empty_desc')}</p>
            </div>
          )}
        </div>
      )}

      {!isLoading && !query && (
        <div className="space-y-6">
          <div className="flex items-center justify-between pb-2">
            <h2 className="text-lg font-bold text-slate-900">{t('home_popular_title')}</h2>
          </div>
          {popularTracks.length > 0 ? (
            <div className="grid sm:grid-cols-2 gap-4">
              {popularTracks.map((track) => (
                <ResultCard key={track.id} track={track} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4">
              <SkeletonCard />
              <SkeletonCard />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

function DiscoverFallback() {
  const { t } = useLocale();

  return (
    <div className="max-w-4xl mx-auto flex flex-col items-center justify-center py-24">
      <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mb-3" />
      <span className="text-sm text-slate-500 animate-pulse">{t('common_loading')}</span>
    </div>
  );
}

export default function DiscoverPage() {
  return (
    <Suspense fallback={<DiscoverFallback />}>
      <DiscoverContent />
    </Suspense>
  );
}
