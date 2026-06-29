'use client';

import React, { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/discover/SearchBar';
import { SuggestionChips } from '@/components/discover/SuggestionChips';
import { ResultCard } from '@/components/discover/ResultCard';
import { useLocale } from '@/context/LocaleContext';
import { GugakTrack } from '@/types/track';
import { ArrowRight, AudioLines, Infinity, Sliders, Heart, Sparkles } from 'lucide-react';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { clsx } from 'clsx';
import { type DiscoverSearchMode, loadDiscoverMode } from '@/lib/discoverSearch';

interface HomeContentProps {
  popularTracks: GugakTrack[];
}

export function HomeContent({ popularTracks }: HomeContentProps) {
  const { locale, t } = useLocale();
  const [searchMode, setSearchMode] = useState<DiscoverSearchMode>('song');

  useEffect(() => {
    setSearchMode(loadDiscoverMode());
  }, []);

  const features = [
    { icon: AudioLines, title: t('home_feature_1_title'), desc: t('home_feature_1_desc') },
    { icon: Infinity, title: t('home_feature_2_title'), desc: t('home_feature_2_desc') },
    { icon: Sliders, title: t('home_feature_3_title'), desc: t('home_feature_3_desc') },
    { icon: Heart, title: t('home_feature_4_title'), desc: t('home_feature_4_desc') },
  ];

  return (
    <div className="w-full font-sans">
      <section className="relative overflow-hidden min-h-[calc(100dvh-3.5rem-3.5rem)] md:min-h-[calc(100dvh-4rem)] px-2 sm:px-4 pb-16 md:pb-0 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-semibold mb-6 z-10">
          <Sparkles size={14} className="text-sky-500" />
          <span>AI 음악 감성 번역기</span>
        </div>

        <h1
          className={clsx(
            'font-extrabold text-slate-900 tracking-normal leading-tight mb-5 md:mb-6 z-10 text-center',
            locale === 'en'
              ? 'text-[clamp(24px,4.5vw,48px)] max-w-[min(100%,100vw-2rem)]'
              : 'text-2xl sm:text-5xl max-w-[640px]',
          )}
        >
          {t('home_hero_title_1')}
          {t('home_hero_title_2') ? (
            <>
              <br className="md:hidden" /> {t('home_hero_title_2')}
            </>
          ) : null}
        </h1>

        <p className="text-slate-500 text-sm sm:text-base max-w-lg mb-9 md:mb-10 leading-relaxed z-10">
          {t('home_hero_subtitle')}
        </p>

        <div className="w-full flex justify-center mb-5 md:mb-6 z-10">
          <Suspense
            fallback={
              <div className="h-16 w-full max-w-2xl rounded-2xl bg-white border border-slate-100 animate-pulse" />
            }
          >
            <SearchBar size="large" initialMode={searchMode} onModeChange={setSearchMode} />
          </Suspense>
        </div>

        <div className="mb-11 md:mb-12 z-10">
          <SuggestionChips size="large" mode={searchMode} />
        </div>

        <div className="flex flex-wrap items-center justify-center z-10">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-xl text-sm md:text-base font-semibold shadow-md shadow-sky-200 transition-colors"
          >
            <span>{t('home_cta_discover')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto px-4 md:px-8 pt-10 pb-16 select-none">
        <ScrollReveal>
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-sky-50 shadow-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={0.08 + index * 0.07} y={20}>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 h-full">
                    <div className="w-11 h-11 rounded-xl bg-sky-50 flex items-center justify-center text-sky-500 shrink-0">
                      <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-base font-bold text-slate-900">{feature.title}</h3>
                      <p className="text-sm text-slate-500 leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="max-w-4xl mx-auto px-4 md:px-8 pb-16">
        <ScrollReveal delay={0.05}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-slate-900">{t('home_popular_title')}</h2>
            <Link
              href="/discover"
              className="text-sm text-slate-500 hover:text-sky-600 font-semibold flex items-center gap-1 transition-colors"
            >
              <span>{t('home_popular_more')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 gap-4">
          {popularTracks.map((track, index) => (
            <ScrollReveal key={track.id} delay={index * 0.08} y={24}>
              <ResultCard track={track} />
            </ScrollReveal>
          ))}
        </div>
      </section>
    </div>
  );
}
