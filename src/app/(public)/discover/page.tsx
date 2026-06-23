'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/discover/SearchBar';
import { ResultCard } from '@/components/discover/ResultCard';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { GhostButton } from '@/components/common/GhostButton';
import { discoverTracks, getPopularTracks, ApiError } from '@/lib/api';
import { useLocale } from '@/context/LocaleContext';
import { MatchResult, GugakTrack } from '@/types/track';
import { Search, Info, AlertTriangle } from 'lucide-react';

function formatSummary(query: string, locale: 'ko' | 'en', fallback?: string) {
  if (fallback) return fallback;
  if (locale === 'en') {
    return `Gugak with a similar vibe to "${query}"`;
  }
  return `"${query}" 와 감성이 닮은 국악`;
}

const DiscoverContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { locale, t } = useLocale();
  const query = searchParams.get('q') || '';

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
        setInputSummary(formatSummary(query, locale, data.inputSummary));
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
  }, [query, locale, t]);

  const handleResetSearch = () => {
    router.push('/discover');
  };

  const handleRetry = () => {
    router.refresh();
  };

  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-8 py-8 font-sans select-none">
      <div className="flex flex-col items-center gap-6 mb-8">
        <SearchBar initialValue={query} />
      </div>

      {isLoading ? (
        <div className="flex flex-col items-center py-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full mb-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
          <div className="flex items-center gap-2 text-sb-muted animate-pulse">
            <div className="w-3 h-3 border-2 border-sb-primary border-t-transparent rounded-full animate-spin" />
            <span className="text-[13px] font-medium">{t('discover_loading')}</span>
          </div>
        </div>
      ) : query ? (
        <div>
          <div className="flex items-center justify-between border-b border-sb-border pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-sb-primary">
                {inputSummary || formatSummary(query, locale)}
              </span>
            </div>
            <GhostButton
              onClick={handleResetSearch}
              className="px-2.5 py-1 text-[11px] hover:bg-sb-surface border-sb-border"
            >
              {t('discover_reset')}
            </GhostButton>
          </div>

          {searchError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle className="w-10 h-10 text-sb-error mb-3" />
              <h3 className="text-[15px] font-medium text-sb-primary mb-1">
                {t('discover_error_title')}
              </h3>
              <p className="text-[12px] text-sb-muted max-w-[320px] mb-4">{searchError}</p>
              <GhostButton onClick={handleRetry} className="text-[12px]">
                {t('discover_error_retry')}
              </GhostButton>
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
              <Search className="w-10 h-10 text-sb-muted mb-3" />
              <h3 className="text-[15px] font-medium text-sb-primary mb-1">
                {t('discover_empty_title')}
              </h3>
              <p className="text-[12px] text-sb-muted max-w-[280px]">{t('discover_empty_desc')}</p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 border-b border-sb-border pb-3 mb-6 select-none">
            <Info className="w-4 h-4 text-sb-accent" />
            <span className="text-[14px] font-medium text-sb-primary">{t('discover_hint')}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTracks.map((track) => (
              <ResultCard key={track.id} track={track} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

function DiscoverFallback() {
  const { t } = useLocale();

  return (
    <div className="max-w-[1080px] mx-auto px-4 md:px-8 py-8 flex flex-col items-center justify-center py-24">
      <div className="w-5 h-5 border-2 border-sb-primary border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-[12px] text-sb-muted font-sans animate-pulse">{t('common_loading')}</span>
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
