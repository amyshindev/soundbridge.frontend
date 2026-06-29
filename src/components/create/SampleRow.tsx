'use client';

import React from 'react';
import { Sample } from '@/types/sample';
import { usePlayer } from '@/hooks/usePlayer';
import { useToast } from '@/hooks/useToast';
import { useLocale } from '@/context/LocaleContext';
import { labelInstrument, labelJangdan, labelTrackTitle } from '@/lib/i18n/labels';
import { audioFilenameExtension, resolveAudioUrl } from '@/lib/audioUrl';
import { LoopBadge } from './LoopBadge';
import { LicenseBadge } from './LicenseBadge';
import { Play, Pause, Download } from 'lucide-react';

export interface SampleRowProps {
  sample: Sample;
}

function mockBars(seed: string, count = 40): number[] {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s += seed.charCodeAt(i);
  return Array.from({ length: count }).map((_, i) => {
    const v = Math.sin(s + i * 17) * 10000;
    const n = v - Math.floor(v);
    return 24 + n * 68;
  });
}

export const SampleRow = ({ sample }: SampleRowProps) => {
  const { currentTrack, isPlaying, play, pause } = usePlayer();
  const { showToast } = useToast();
  const { locale, t } = useLocale();

  const isCurrent = currentTrack?.id === sample.id;
  const isCurrentlyPlaying = isCurrent && isPlaying;
  const bars = mockBars(sample.audioUrl || sample.id);
  const duration = 60;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isCurrentlyPlaying) pause();
    else play(sample, 'create');
  };

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = resolveAudioUrl(sample.audioUrl);
    const ext = audioFilenameExtension(sample.audioUrl);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${labelTrackTitle(locale, sample.title, sample.titleEn)}${ext}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(t('sample_download_toast'), 'success');
  };

  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm border border-slate-100 hover:border-sky-200 transition-colors flex flex-col sm:flex-row gap-5 items-start sm:items-center group">
      <div className="flex gap-4 items-center w-full sm:w-auto">
        <button
          type="button"
          onClick={handlePlayToggle}
          className="w-12 h-12 shrink-0 rounded-full bg-sky-50 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-colors"
        >
          {isCurrentlyPlaying ? (
            <Pause size={20} fill="currentColor" />
          ) : (
            <Play size={20} fill="currentColor" className="ml-0.5" />
          )}
        </button>

        <div className="flex-1 min-w-0 sm:w-48">
          <h4 className="font-bold text-slate-900 text-base truncate">
            {labelTrackTitle(locale, sample.title, sample.titleEn)}
          </h4>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-0.5">
            <span className="truncate">{labelInstrument(locale, sample.instrument)}</span>
            <span>·</span>
            <span className="shrink-0">{sample.bpm} BPM</span>
          </div>
        </div>
      </div>

      <div className="flex-1 w-full h-10 sm:h-12 relative flex items-center gap-[2px] opacity-80 sm:opacity-60 group-hover:opacity-100 transition-opacity overflow-hidden">
        {bars.map((h, i) => (
          <div
            key={i}
            className={`flex-1 rounded-full ${
              isCurrentlyPlaying ? 'bg-sky-400' : 'bg-slate-200'
            }`}
            style={{ height: `${h}%` }}
          />
        ))}
        {sample.cuePoints?.map((cue, i) => {
          const leftPercent = duration > 0 ? (cue.timeSec / duration) * 100 : 0;
          return (
            <div
              key={`${cue.label}-${i}`}
              className="absolute top-0 bottom-0 w-px bg-sky-500 z-10"
              style={{ left: `${Math.min(leftPercent, 95)}%` }}
            >
              <div className="absolute -top-3 -translate-x-1/2 bg-sky-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap">
                {cue.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto mt-2 sm:mt-0">
        <div className="flex flex-col items-start sm:items-end gap-1.5">
          <div className="flex items-center gap-1.5">
            <LoopBadge beats={sample.loopUnitBeats} />
            <LicenseBadge licenseType={sample.publicLicenseType} />
          </div>
          <div className="text-[10px] text-slate-400 font-medium">
            {labelJangdan(locale, sample.jangdan)}
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0"
          title={t('sample_download_title')}
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};
