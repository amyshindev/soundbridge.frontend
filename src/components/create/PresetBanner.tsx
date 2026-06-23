'use client';

import React from 'react';
import { CreatePreset } from '@/types/preset';
import { useLocale } from '@/context/LocaleContext';
import { labelEmotion, labelInstrument } from '@/lib/i18n/labels';
import { X } from 'lucide-react';

export interface PresetBannerProps {
  preset: CreatePreset;
  onClose: () => void;
}

export const PresetBanner = ({ preset, onClose }: PresetBannerProps) => {
  const { locale, t } = useLocale();

  const parts: string[] = [];
  if (preset.instrument) parts.push(labelInstrument(locale, preset.instrument));
  if (preset.emotion) parts.push(labelEmotion(locale, preset.emotion));

  const presetText =
    parts.length > 0
      ? t('preset_banner_parts', { parts: parts.join(' · ') })
      : t('preset_banner_default');

  return (
    <div className="bg-[#F5F0E8] border-l-[3px] border-sb-accent rounded-r-lg p-3 mb-3 flex items-center justify-between font-sans shadow-sm select-none">
      <span className="text-[11px] text-[#8A6A30] font-medium leading-relaxed">{presetText}</span>
      <button
        onClick={onClose}
        className="text-[#8A6A30]/60 hover:text-[#8A6A30] p-1 rounded-full transition-colors focus:outline-none"
        title={t('preset_banner_close')}
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
