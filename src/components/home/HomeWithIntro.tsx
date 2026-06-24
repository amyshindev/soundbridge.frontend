'use client';

import { useEffect, useState } from 'react';
import { HomeContent } from '@/components/home/HomeContent';
import { IntroSplash, shouldPlayIntro } from '@/components/home/IntroSplash';
import { GugakTrack } from '@/types/track';

interface HomeWithIntroProps {
  popularTracks: GugakTrack[];
}

type Phase = 'pending' | 'intro' | 'done';

export function HomeWithIntro({ popularTracks }: HomeWithIntroProps) {
  const [phase, setPhase] = useState<Phase>('pending');

  useEffect(() => {
    setPhase(shouldPlayIntro() ? 'intro' : 'done');
  }, []);

  if (phase === 'pending') {
    return <div className="min-h-[calc(100dvh-3.5rem)] bg-sb-bg" aria-busy="true" />;
  }

  return (
    <>
      {phase === 'intro' && <IntroSplash onDone={() => setPhase('done')} />}
      <div
        className={`transition-opacity duration-500 ease-out ${
          phase === 'done' ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <HomeContent popularTracks={popularTracks} />
      </div>
    </>
  );
}
