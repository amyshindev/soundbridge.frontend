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

const ARTIST_EN: Record<string, string> = {
  국립국악원: 'National Gugak Center',
};

const TRACK_TITLE_EN: Record<string, string> = {
  '비단길 위의 가야금 선율': 'Gayageum melody on the Silk Road',
  '태평성대 자진모리 대금 독주': 'Daegeum solo in Jajinmori during a peaceful reign',
  '새벽 안개 걷히는 해금 가락': 'Haegeum tune as the morning mist clears',
  '바람의 엇모리 피리 루프': "Wind's Eotmori Piri loop",
  '휘모리 휘감는 아쟁 앙상블': 'Ajaeng ensemble winding through Hwimori',
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

export function labelTrackTitle(locale: Locale, title: string, titleEn?: string): string {
  if (locale === 'ko') return title;
  return titleEn ?? TRACK_TITLE_EN[title] ?? title;
}

export function labelArtist(locale: Locale, artist: string, artistEn?: string): string {
  if (locale === 'ko') return artist;
  return artistEn ?? ARTIST_EN[artist] ?? artist;
}
