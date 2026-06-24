'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/discover/SearchBar';
import { SuggestionChips } from '@/components/discover/SuggestionChips';
import { ResultCard } from '@/components/discover/ResultCard';
import { useLocale } from '@/context/LocaleContext';
import { GugakTrack } from '@/types/track';
import { ArrowRight, AudioLines, Infinity, Sliders, Heart } from 'lucide-react';
import { ScrollReveal } from '@/components/common/ScrollReveal';
import { clsx } from 'clsx';

interface HomeContentProps {
  popularTracks: GugakTrack[];
}

export function HomeContent({ popularTracks }: HomeContentProps) {
  const { locale, t } = useLocale();

  const features = [
    { icon: AudioLines, title: t('home_feature_1_title'), desc: t('home_feature_1_desc') },
    { icon: Infinity, title: t('home_feature_2_title'), desc: t('home_feature_2_desc') },
    { icon: Sliders, title: t('home_feature_3_title'), desc: t('home_feature_3_desc') },
    { icon: Heart, title: t('home_feature_4_title'), desc: t('home_feature_4_desc') },
  ];

  return (
    <div className="w-full bg-sb-bg font-sans">
      {/* 히어로: 네비(56px) 제외 한 화면 */}
      <section className="relative overflow-hidden min-h-[calc(100dvh-3.5rem)] px-4 pb-20 md:pb-0 flex flex-col items-center justify-center text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] pointer-events-none opacity-20 select-none">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path
              d="M0,50 C30,40 40,60 70,30 C90,10 100,50 100,50 L100,100 L0,100 Z"
              fill="none"
              stroke="#C8A96E"
              strokeWidth="0.1"
            />
            <path
              d="M0,55 C20,35 50,75 75,40 C95,15 100,60 100,60"
              fill="none"
              stroke="#C8A96E"
              strokeWidth="0.05"
            />
          </svg>
        </div>

        <h1
          className={clsx(
            'font-medium text-sb-primary tracking-tight leading-[1.2] mb-5 md:mb-6 z-10 text-center',
            locale === 'en'
              ? 'text-[clamp(22px,4.2vw,44px)] whitespace-nowrap max-w-[min(100%,100vw-2rem)]'
              : 'text-[32px] md:text-[44px] max-w-[640px]'
          )}
        >
          {t('home_hero_title_1')}
          {t('home_hero_title_2') ? (
            <>
              <br className="md:hidden" /> {t('home_hero_title_2')}
            </>
          ) : null}
        </h1>

        <p className="text-[16px] md:text-[18px] text-sb-muted max-w-[560px] mb-9 md:mb-10 leading-relaxed z-10 font-normal">
          {t('home_hero_subtitle')}
        </p>

        <div className="w-full flex justify-center mb-5 md:mb-6 z-10">
          <Suspense fallback={<div className="h-14 w-full max-w-[600px] rounded-lg bg-sb-surface animate-pulse" />}>
            <SearchBar size="large" />
          </Suspense>
        </div>

        <div className="mb-11 md:mb-12 z-10">
          <SuggestionChips size="large" />
        </div>

        <div className="flex flex-wrap items-center justify-center z-10">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-2 bg-[#B8985E] text-white px-6 py-3 rounded-lg text-[14px] md:text-[15px] font-medium shadow-sm hover:bg-[#A6864C] active:bg-[#94743C] transition-colors"
          >
            <span>{t('home_cta_discover')}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* 기능 카드: 스크롤 후 노출 */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-8 pt-10 pb-16 select-none">
        <ScrollReveal>
          <div className="bg-sb-surface rounded-2xl p-6 md:p-8 border border-sb-border/50">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, index) => (
                <ScrollReveal key={feature.title} delay={0.08 + index * 0.07} y={20}>
                  <div className="flex flex-col items-center md:items-start text-center md:text-left gap-3 h-full">
                    <div className="w-11 h-11 rounded-lg bg-sb-border/40 flex items-center justify-center text-[#B8985E] shrink-0">
                      <feature.icon className="w-5 h-5 md:w-6 md:h-6" />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <h3 className="text-[15px] md:text-[16px] font-medium text-sb-primary">{feature.title}</h3>
                      <p className="text-[13px] md:text-[14px] text-sb-muted leading-relaxed">{feature.desc}</p>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      <section className="max-w-[1080px] mx-auto px-4 md:px-8 pb-16">
        <ScrollReveal delay={0.05}>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-[18px] md:text-[20px] font-medium text-sb-primary">{t('home_popular_title')}</h2>
            <Link
              href="/discover"
              className="text-[13px] md:text-[14px] text-sb-muted hover:text-sb-primary font-medium flex items-center gap-1 transition-colors"
            >
              <span>{t('home_popular_more')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </ScrollReveal>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
