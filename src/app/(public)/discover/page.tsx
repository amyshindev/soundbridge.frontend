'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { SearchBar } from '@/components/discover/SearchBar';
import { ResultCard } from '@/components/discover/ResultCard';
import { SkeletonCard } from '@/components/common/SkeletonCard';
import { GhostButton } from '@/components/common/GhostButton';
import { discoverTracks, getPopularTracks, ApiError } from '@/lib/api';
import { MatchResult, GugakTrack } from '@/types/track';
import { Search, Info, AlertTriangle } from 'lucide-react';

const DiscoverContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
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
        const data = await discoverTracks(query, 'ko');
        setResults(data.tracks);
        setInputSummary(data.inputSummary || `"${query}" 와 감성이 닮은 국악`);
      } catch (e) {
        console.error('Search failed', e);
        setResults([]);
        if (e instanceof ApiError && e.status === 503) {
          setSearchError('AI 서비스가 일시적으로 이용 불가합니다. 잠시 후 다시 시도해 주세요.');
        } else if (
          e instanceof TypeError ||
          (e instanceof Error && /fetch|network|failed/i.test(e.message))
        ) {
          setSearchError(
            '백엔드 API에 연결할 수 없습니다. Vercel에 API_URL 환경 변수가 설정되어 있는지 확인해 주세요.'
          );
        } else {
          setSearchError('검색 중 오류가 발생했습니다. 다시 시도해 주세요.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query]);

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
            <span className="text-[13px] font-medium">AI가 감성을 분석하고 있어요...</span>
          </div>
        </div>
      ) : query ? (
        <div>
          <div className="flex items-center justify-between border-b border-sb-border pb-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="text-[14px] font-medium text-sb-primary">
                {inputSummary || `"${query}" 와 감성이 닮은 국악`}
              </span>
            </div>
            <GhostButton
              onClick={handleResetSearch}
              className="px-2.5 py-1 text-[11px] hover:bg-sb-surface border-sb-border"
            >
              다시 검색
            </GhostButton>
          </div>

          {searchError ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <AlertTriangle className="w-10 h-10 text-sb-error mb-3" />
              <h3 className="text-[15px] font-medium text-sb-primary mb-1">검색을 완료하지 못했어요</h3>
              <p className="text-[12px] text-sb-muted max-w-[320px] mb-4">{searchError}</p>
              <GhostButton onClick={handleRetry} className="text-[12px]">
                다시 시도
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
              <h3 className="text-[15px] font-medium text-sb-primary mb-1">검색 결과가 없어요</h3>
              <p className="text-[12px] text-sb-muted max-w-[280px]">
                DB에 임베딩이 없거나 조건에 맞는 트랙이 없을 수 있습니다. 다른 검색어를 시도해 보세요.
              </p>
            </div>
          )}
        </div>
      ) : (
        <div>
          <div className="flex items-center gap-2 border-b border-sb-border pb-3 mb-6 select-none">
            <Info className="w-4 h-4 text-sb-accent" />
            <span className="text-[14px] font-medium text-sb-primary">
              궁금한 곡명이나 장르를 검색해보세요. 지금 인기 있는 국악으로 탐색을 시작할 수도 있습니다.
            </span>
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

export default function DiscoverPage() {
  return (
    <Suspense fallback={
      <div className="max-w-[1080px] mx-auto px-4 md:px-8 py-8 flex flex-col items-center justify-center py-24">
        <div className="w-5 h-5 border-2 border-sb-primary border-t-transparent rounded-full animate-spin mb-3" />
        <span className="text-[12px] text-sb-muted font-sans animate-pulse">로딩 중...</span>
      </div>
    }>
      <DiscoverContent />
    </Suspense>
  );
}
