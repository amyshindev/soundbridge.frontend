'use client';

import React from 'react';
import { usePlayer } from '@/hooks/usePlayer';
import { useToast } from '@/hooks/useToast';
import { TrackCover } from '../common/TrackCover';
import { Play, Pause, Download } from 'lucide-react';

const formatTime = (timeSec: number) => {
  if (Number.isNaN(timeSec)) return '0:00';
  const minutes = Math.floor(timeSec / 60);
  const seconds = Math.floor(timeSec % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const PlayerBar = () => {
  const { currentTrack, isPlaying, mode, currentTime, duration, togglePlay } = usePlayer();
  const { showToast } = useToast();

  if (!currentTrack) return null;

  const isCreateMode = mode === 'create';
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = currentTrack.audioUrl;
    link.download = `${currentTrack.title}.wav`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('다운로드가 시작되었습니다.', 'success');
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-md border-t border-sky-100 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] z-50 p-4 transition-all duration-300">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 flex-1 min-w-0">
          <TrackCover
            instrument={currentTrack.instrument}
            className="w-12 h-12 rounded-lg shrink-0"
            iconClassName="w-5 h-5"
          />
          <div className="min-w-0">
            <h4 className="font-semibold text-slate-900 truncate text-sm sm:text-base">
              {currentTrack.title}
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 truncate">
              {currentTrack.artist || '국립국악원'} · {currentTrack.instrument}
            </p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-center flex-1 max-w-md hidden sm:flex">
          <button
            onClick={togglePlay}
            className="w-10 h-10 flex items-center justify-center bg-sky-500 hover:bg-sky-600 text-white rounded-full transition-colors shadow-md shadow-sky-200"
          >
            {isPlaying ? (
              <Pause size={20} fill="currentColor" />
            ) : (
              <Play size={20} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          <div className="w-full flex items-center gap-2 mt-2">
            <span className="text-xs text-slate-400 tabular-nums">{formatTime(currentTime)}</span>
            <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-sky-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-xs text-slate-400 tabular-nums">{formatTime(duration)}</span>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 flex-1">
          <button
            onClick={togglePlay}
            className="sm:hidden w-10 h-10 flex items-center justify-center bg-sky-500 text-white rounded-full shadow-md shadow-sky-200"
          >
            {isPlaying ? (
              <Pause size={18} fill="currentColor" />
            ) : (
              <Play size={18} fill="currentColor" className="ml-0.5" />
            )}
          </button>
          {isCreateMode && (
            <>
              <span className="hidden sm:inline px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-bold">
                {currentTrack.loopUnitBeats} BEATS
              </span>
              <button
                onClick={handleDownload}
                className="w-10 h-10 rounded-full border border-slate-200 text-slate-500 flex items-center justify-center hover:bg-slate-50 hover:text-slate-900 transition-colors shrink-0"
                title="샘플 다운로드"
              >
                <Download size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
