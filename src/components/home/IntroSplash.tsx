'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocale } from '@/context/LocaleContext';

const INTRO_SRC = '/videos/soundbridge-intro.mp4';
const FADE_MS = 450;

export function IntroSplash({ onDone }: { onDone: () => void }) {
  const { t } = useLocale();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [fading, setFading] = useState(false);
  const finishedRef = useRef(false);

  const finish = useCallback(() => {
    if (finishedRef.current) return;
    finishedRef.current = true;
    setFading(true);
    window.setTimeout(onDone, FADE_MS);
  }, [onDone]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.play().catch(() => finish());
  }, [finish]);

  return (
    <div
      className={`fixed inset-0 z-[200] bg-sb-bg transition-opacity duration-[450ms] ease-out ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      aria-hidden={fading}
    >
      <video
        ref={videoRef}
        src={INTRO_SRC}
        className="h-full w-full object-cover"
        muted
        playsInline
        preload="auto"
        onEnded={finish}
      />
      <button
        type="button"
        onClick={finish}
        className="absolute bottom-6 right-6 rounded-lg px-3 py-1.5 text-[13px] font-medium text-sb-muted hover:text-sb-primary hover:bg-sb-surface/80 transition-colors"
      >
        {t('intro_skip')}
      </button>
    </div>
  );
}

export function shouldPlayIntro(): boolean {
  if (typeof window === 'undefined') return false;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
  return true;
}
