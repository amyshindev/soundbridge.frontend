import React from 'react';
import { Chip } from '../common/Chip';
import { buildEmotionUrl } from '@/lib/presetUrl';
import { useLocale } from '@/context/LocaleContext';
import { labelEmotion } from '@/lib/i18n/labels';

export interface EmotionTagChipsProps {
  tags: string[];
}

export const EmotionTagChips = ({ tags }: EmotionTagChipsProps) => {
  const { locale } = useLocale();

  if (!tags || tags.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-1.5 font-sans">
      {tags.map((tag) => (
        <Chip
          key={tag}
          label={labelEmotion(locale, tag)}
          variant="emotion-link"
          href={buildEmotionUrl(tag)}
        />
      ))}
    </div>
  );
};
