import type { Locale } from '@/types/locale';

const INSTRUMENT_EN: Record<string, string> = {
  장구: 'Janggu',
  가야금: 'Gayageum',
  대금: 'Daegeum',
  해금: 'Haegeum',
  거문고: 'Geomungo',
  피리: 'Piri',
  아쟁: 'Ajaeng',
  소금: 'Sogeom',
};

const EMOTION_EN: Record<string, string> = {
  신남: 'Joyful',
  서정: 'Lyrical',
  웅장: 'Grand',
  슬픔: 'Melancholic',
  신비: 'Mystical',
  차분: 'Calm',
};

const JANGDAN_EN: Record<string, string> = {
  자진모리: 'Jajinmori',
  중모리: 'Jungmori',
  굿거리: 'Gutgeori',
  휘모리: 'Hwimori',
  세마치: 'Semachi',
  엇모리: 'Eotmori',
};

export function labelInstrument(locale: Locale, value: string): string {
  if (locale === 'en') return INSTRUMENT_EN[value] ?? value;
  return value;
}

export function labelEmotion(locale: Locale, value: string): string {
  if (locale === 'en') return EMOTION_EN[value] ?? value;
  return value;
}

export function labelJangdan(locale: Locale, value: string): string {
  if (locale === 'en') return JANGDAN_EN[value] ?? value;
  return value;
}
