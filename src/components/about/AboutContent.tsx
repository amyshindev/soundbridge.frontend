'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  AudioLines,
  Globe,
  Music2,
  Search,
  Sliders,
  Sparkles,
  Waves,
} from 'lucide-react';
import { useLocale } from '@/context/LocaleContext';

export function AboutContent() {
  const { t } = useLocale();

  const steps = [
    { icon: Search, title: t('about_step_1_title'), description: t('about_step_1_desc') },
    { icon: Sparkles, title: t('about_step_2_title'), description: t('about_step_2_desc') },
    { icon: Sliders, title: t('about_step_3_title'), description: t('about_step_3_desc') },
  ];

  const values = [
    { icon: Music2, title: t('about_value_1_title'), description: t('about_value_1_desc') },
    { icon: AudioLines, title: t('about_value_2_title'), description: t('about_value_2_desc') },
    { icon: Globe, title: t('about_value_3_title'), description: t('about_value_3_desc') },
  ];

  const techItems = [
    t('about_tech_1'),
    t('about_tech_2'),
    t('about_tech_3'),
    t('about_tech_4'),
  ];

  return (
    <div className="w-full bg-sb-bg font-sans">
      <section className="relative overflow-hidden pt-14 pb-12 px-4 md:px-8 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[320px] pointer-events-none opacity-15 select-none">
          <Waves className="w-full h-full text-sb-accent" strokeWidth={0.5} />
        </div>

        <p className="text-[11px] uppercase tracking-[0.2em] text-sb-muted mb-3 z-10 relative">
          {t('about_eyebrow')}
        </p>
        <h1 className="text-[26px] md:text-[32px] font-medium text-sb-primary tracking-tight leading-tight mb-4 z-10 relative">
          {t('about_hero_title_1')}
          <br />
          {t('about_hero_title_2')}
        </h1>
        <p className="text-[14px] md:text-[15px] text-sb-muted max-w-[560px] mx-auto leading-relaxed z-10 relative">
          {t('about_hero_desc')}
        </p>
      </section>

      <section className="max-w-[720px] mx-auto px-4 md:px-8 mb-14">
        <div className="bg-sb-surface rounded-2xl border border-sb-border/50 p-6 md:p-8">
          <h2 className="text-[16px] font-medium text-sb-primary mb-3">{t('about_mission_title')}</h2>
          <p className="text-[13.5px] text-[#3A3835] leading-[1.85]">{t('about_mission_body')}</p>
        </div>
      </section>

      <section className="max-w-[1080px] mx-auto px-4 md:px-8 mb-14">
        <h2 className="text-[16px] font-medium text-sb-primary mb-6 text-center md:text-left">
          {t('about_steps_title')}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {steps.map((step, index) => (
            <div
              key={step.title}
              className="bg-white border border-sb-border rounded-xl p-5 flex flex-col gap-3"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-[#F5F0E8] text-[#8A6A30] text-[12px] font-medium flex items-center justify-center shrink-0">
                  {index + 1}
                </span>
                <step.icon className="w-4 h-4 text-sb-accent" />
              </div>
              <h3 className="text-[14px] font-medium text-sb-primary">{step.title}</h3>
              <p className="text-[12px] text-sb-muted leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="max-w-[1080px] mx-auto px-4 md:px-8 mb-14">
        <div className="bg-sb-surface rounded-2xl p-6 md:p-8 border border-sb-border/50">
          <h2 className="text-[16px] font-medium text-sb-primary mb-6">{t('about_values_title')}</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {values.map((feature) => (
              <div key={feature.title} className="flex flex-col gap-3">
                <div className="w-10 h-10 rounded-lg bg-sb-border/40 flex items-center justify-center text-[#B8985E]">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-[13.5px] font-medium text-sb-primary">{feature.title}</h3>
                <p className="text-[11.5px] text-sb-muted leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="max-w-[720px] mx-auto px-4 md:px-8 mb-14">
        <h2 className="text-[16px] font-medium text-sb-primary mb-4">{t('about_tech_title')}</h2>
        <ul className="text-[13px] text-[#3A3835] leading-[1.9] flex flex-col gap-2 list-disc pl-5">
          {techItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="max-w-[1080px] mx-auto px-4 md:px-8 pb-16 flex flex-col items-center gap-4">
        <p className="text-[13px] text-sb-muted text-center">{t('about_cta_text')}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-1.5 bg-[#B8985E] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium shadow-sm hover:bg-[#A6864C] transition-colors"
          >
            <span>{t('about_cta_discover')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-sb-border text-sb-primary px-5 py-2.5 rounded-lg text-[13px] font-medium shadow-sm hover:bg-[#F9F9F7] transition-colors"
          >
            <span>{t('about_cta_create')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
