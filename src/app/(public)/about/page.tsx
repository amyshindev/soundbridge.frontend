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

export const metadata = {
  title: 'SoundBridge 소개 — 당신의 음악 언어로 국악을 만나세요',
  description:
    'SoundBridge는 좋아하는 음악의 감성을 AI가 분석해 국악 트랙과 샘플을 연결해 주는 플랫폼입니다.',
};

const STEPS = [
  {
    icon: Search,
    title: '좋아하는 음악 입력',
    description: '아티스트, 곡 이름, 장르를 자유롭게 검색해 보세요.',
  },
  {
    icon: Sparkles,
    title: 'AI 감성 매칭',
    description: '임베딩과 pgvector로 비슷한 분위기의 국악 트랙을 찾아드립니다.',
  },
  {
    icon: Sliders,
    title: '바로 창작으로',
    description: '악기·장단·BPM 필터로 샘플을 고르고 나만의 사운드를 만듭니다.',
  },
] as const;

const FEATURES = [
  {
    icon: Music2,
    title: '감성으로 연결',
    description: '서양 음악, K팝, 재즈처럼 익숙한 음악 언어로 국악을 처음 만나도 자연스럽습니다.',
  },
  {
    icon: AudioLines,
    title: '바로 쓰는 샘플',
    description: '국립국악원 공공누리 음원 기반 루프·큐 포인트로 DJ·DAW에 바로 활용할 수 있습니다.',
  },
  {
    icon: Globe,
    title: '한국어·영어 지원',
    description: '검색과 설명을 한국어·영어로 제공해 누구나 국악을 자신의 언어로 탐색합니다.',
  },
] as const;

export default function AboutPage() {
  return (
    <div className="w-full bg-sb-bg font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden pt-14 pb-12 px-4 md:px-8 text-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[320px] pointer-events-none opacity-15 select-none">
          <Waves className="w-full h-full text-sb-accent" strokeWidth={0.5} />
        </div>

        <p className="text-[11px] uppercase tracking-[0.2em] text-sb-muted mb-3 z-10 relative">
          About SoundBridge
        </p>
        <h1 className="text-[26px] md:text-[32px] font-medium text-sb-primary tracking-tight leading-tight mb-4 z-10 relative">
          당신의 음악 언어로,
          <br />
          국악을 만나는 다리
        </h1>
        <p className="text-[14px] md:text-[15px] text-sb-muted max-w-[560px] mx-auto leading-relaxed z-10 relative">
          SoundBridge는 좋아하는 음악(서양 음악, K팝, 재즈 등)을 입력하면 AI가 감성을 분석해
          &ldquo;당신의 인어&rdquo;로 국악을 연결해 주는 웹 서비스입니다.
        </p>
      </section>

      {/* Mission */}
      <section className="max-w-[720px] mx-auto px-4 md:px-8 mb-14">
        <div className="bg-sb-surface rounded-2xl border border-sb-border/50 p-6 md:p-8">
          <h2 className="text-[16px] font-medium text-sb-primary mb-3">무엇을 하나요?</h2>
          <p className="text-[13.5px] text-[#3A3835] leading-[1.85]">
            전통 국악은 아름답지만, 악기·장단·감성 태그 같은 용어가 낯설어 접근이 어렵습니다.
            SoundBridge는 <strong className="font-medium text-sb-primary">DISCOVER</strong>로 감성
            유사 국악을 찾고, <strong className="font-medium text-sb-primary">CREATE</strong>로
            악기·BPM·라이선스 조건에 맞는 샘플을 골라 창작에 바로 쓸 수 있게 돕습니다.
          </p>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-8 mb-14">
        <h2 className="text-[16px] font-medium text-sb-primary mb-6 text-center md:text-left">
          이용 방법
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {STEPS.map((step, index) => (
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

      {/* Features */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-8 mb-14">
        <div className="bg-sb-surface rounded-2xl p-6 md:p-8 border border-sb-border/50">
          <h2 className="text-[16px] font-medium text-sb-primary mb-6">핵심 가치</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {FEATURES.map((feature) => (
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

      {/* Tech & data */}
      <section className="max-w-[720px] mx-auto px-4 md:px-8 mb-14">
        <h2 className="text-[16px] font-medium text-sb-primary mb-4">기술 & 데이터</h2>
        <ul className="text-[13px] text-[#3A3835] leading-[1.9] flex flex-col gap-2 list-disc pl-5">
          <li>Gemini API 기반 텍스트 임베딩 + 감성 설명</li>
          <li>Neon PostgreSQL + pgvector 코사인 유사도 검색</li>
          <li>국립국악원 공공누리 제1·2유형 음원 및 메타데이터</li>
          <li>악기, 장단, 감성 태그, BPM, CUE 포인트 메타 제공</li>
        </ul>
      </section>

      {/* CTA */}
      <section className="max-w-[1080px] mx-auto px-4 md:px-8 pb-16 flex flex-col items-center gap-4">
        <p className="text-[13px] text-sb-muted text-center">지금 바로 국악을 탐색해 보세요.</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/discover"
            className="inline-flex items-center justify-center gap-1.5 bg-[#B8985E] text-white px-5 py-2.5 rounded-lg text-[13px] font-medium shadow-sm hover:bg-[#A6864C] transition-colors"
          >
            <span>사운드 둘러보기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <Link
            href="/create"
            className="inline-flex items-center justify-center gap-1.5 bg-white border border-sb-border text-sb-primary px-5 py-2.5 rounded-lg text-[13px] font-medium shadow-sm hover:bg-[#F9F9F7] transition-colors"
          >
            <span>샘플 만들기</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
