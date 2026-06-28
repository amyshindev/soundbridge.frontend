'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Play, Pause, ChevronRight } from 'lucide-react';
import { clsx } from 'clsx';
import { GugakTrack } from '@/types/track';
import { usePlayer } from '@/hooks/usePlayer';
import { useLocale } from '@/context/LocaleContext';
import { labelEmotion, labelGenre, labelInstrument, labelTrackTitle } from '@/lib/i18n/labels';
import { buildCreatePresetUrl } from '@/lib/presetUrl';
import { TrackCover } from '../common/TrackCover';

export interface ResultCardProps {
  track: GugakTrack;
  matchScore?: number;
  explanation?: string;
  className?: string;
}

export const ResultCard = ({
  track,
  matchScore,
  explanation,
  className = '',
}: ResultCardProps) => {
  const router = useRouter();
  const { locale, t } = useLocale();
  const { currentTrack, isPlaying, play, pause } = usePlayer();

  const isCurrentTrack = currentTrack?.id === track.id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;
  const score = matchScore ?? track.score;
  const exp = explanation ?? track.explanation;
  const showExplanation = Boolean(exp);
  const firstEmotion = track.emotionTags[0];
  const categoryLabel = track.genre
    ? labelGenre(locale, track.genre)
    : labelInstrument(locale, track.instrument);

  const presetHref =
    track.presetUrl ||
    buildCreatePresetUrl({
      instrument: track.instrument,
      emotion: firstEmotion,
      bpm: track.bpm,
    });

  const handlePlayToggle = () => {
    if (isCurrentlyPlaying) pause();
    else play(track, 'discover');
  };

  const handleEmotionClick = (emotion: string) => {
    router.push(`/create?emotion=${encodeURIComponent(emotion)}`);
  };

  return (
    <div
      className={clsx(
        'bg-white rounded-3xl p-5 shadow-sm border border-sky-50/50 hover:shadow-md transition-shadow flex flex-col gap-5',
        className,
      )}
    >
      <div className="flex gap-4 items-start">
        <div className="relative group w-20 h-20 sm:w-24 sm:h-24 shrink-0 rounded-2xl overflow-hidden shadow-sm">
          <TrackCover
            instrument={track.instrument}
            title={track.title}
            className="w-full h-full rounded-2xl"
            iconClassName="w-8 h-8"
          />
          <button
            type="button"
            onClick={handlePlayToggle}
            className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <div className="w-10 h-10 rounded-full bg-white/90 text-sky-500 flex items-center justify-center shadow-lg backdrop-blur-sm">
              {isCurrentlyPlaying ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" className="ml-0.5" />
              )}
            </div>
          </button>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 bg-sky-50 text-sky-600 rounded-md text-[10px] sm:text-xs font-semibold">
              {categoryLabel}
            </span>
            <span className="text-slate-400 text-xs">{track.bpm} BPM</span>
          </div>
          <h3 className="font-bold text-slate-900 text-base sm:text-lg truncate">
            {labelTrackTitle(locale, track.title, track.titleEn)}
          </h3>
          <p className="text-sm text-slate-500 truncate">
            {track.artist} · {track.jangdan}
          </p>

          {track.emotionTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {track.emotionTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleEmotionClick(tag)}
                  className="px-2.5 py-1 bg-slate-50 border border-slate-100 text-slate-600 rounded-full text-xs hover:bg-sky-50 hover:border-sky-100 hover:text-sky-700 transition-colors"
                >
                  #{tag}
                </button>
              ))}
            </div>
          )}
        </div>

        {score !== undefined && score > 0 && (
          <div className="hidden sm:flex flex-col items-end shrink-0">
            <div className="text-2xl font-bold text-sky-500 tracking-normal">
              {Math.round(score)}
              <span className="text-sm text-sky-300 font-medium ml-0.5">%</span>
            </div>
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-semibold mt-1">
              Match
            </div>
          </div>
        )}
      </div>

      {showExplanation && (
        <div className="bg-[#FFFDF9] rounded-2xl p-4 border border-sky-100/50 relative">
          <div className="absolute top-0 left-6 -mt-1.5 w-3 h-3 bg-[#FFFDF9] border-l border-t border-sky-100/50 rotate-45" />
          <p className="text-sm text-slate-700 leading-relaxed">
            <span className="font-semibold text-sky-800 mr-2">Why?</span>
            {exp}
          </p>
        </div>
      )}

      {showExplanation && (
        <Link
          href={presetHref}
          className="mt-1 w-full sm:w-auto self-end flex items-center justify-center gap-1.5 px-5 py-2.5 bg-slate-900 hover:bg-black text-white text-sm font-semibold rounded-xl transition-all shadow-sm hover:shadow-md"
        >
          {t('result_create_bridge')}
          <ChevronRight size={16} />
        </Link>
      )}
    </div>
  );
};
