'use client';

import React from 'react';
import { CreatePreset } from '@/types/preset';
import { useLocale } from '@/context/LocaleContext';
import { labelEmotion, labelInstrument } from '@/lib/i18n/labels';
import { Info, X } from 'lucide-react';

export interface PresetBannerProps {
  preset: CreatePreset;
  onClose: () => void;
}

export const PresetBanner = ({ preset, onClose }: PresetBannerProps) => {
  const { locale, t } = useLocale();

  const instrumentLabel = preset.instrument
    ? labelInstrument(locale, preset.instrument)
    : null;
  const emotionLabel = preset.emotion ? labelEmotion(locale, preset.emotion) : null;

  return (
    <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 flex items-start sm:items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center shrink-0">
          <Info size={16} />
        </div>
        <p className="text-sm text-sky-800 font-medium">
          {instrumentLabel || emotionLabel ? (
            <>
              DISCOVER에서 넘어오셨군요!{' '}
              {instrumentLabel && (
                <>
                  <span className="font-bold">[{instrumentLabel}]</span>{' '}
                </>
              )}
              {emotionLabel && (
                <>
                  중심의 <span className="font-bold">[{emotionLabel}]</span>{' '}
                </>
              )}
              분위기로 필터가 설정됐어요.
            </>
          ) : (
            t('preset_banner_default')
          )}
        </p>
      </div>
      <button
        type="button"
        onClick={onClose}
        className="text-sky-400 hover:text-sky-600 p-1 shrink-0"
        title={t('preset_banner_close')}
      >
        <X size={18} />
      </button>
    </div>
  );
};
