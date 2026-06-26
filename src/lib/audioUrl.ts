const API_PREFIX = '/api/soundbridge';

function getApiBaseUrl(): string {
  const direct = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '');
  if (direct) return direct;

  if (typeof window !== 'undefined') {
    return '';
  }

  return (process.env.API_URL || 'https://soundbridgebackend-production.up.railway.app').replace(/\/$/, '');
}

/** DB의 파일명(KC_TM_..._S000063.wav) 또는 전체 URL을 재생 가능한 주소로 변환 */
export function resolveAudioUrl(audioUrl: string): string {
  if (!audioUrl) return audioUrl;
  if (/^https?:\/\//i.test(audioUrl)) return audioUrl;

  const filename = audioUrl.replace(/^\/+/, '').split('/').pop() ?? audioUrl;
  const base = getApiBaseUrl();
  return `${base}${API_PREFIX}/audio/${encodeURIComponent(filename)}`;
}

export function audioFilenameExtension(audioUrl: string): string {
  const filename = audioUrl.replace(/^\/+/, '').split('/').pop() ?? audioUrl;
  const dot = filename.lastIndexOf('.');
  return dot >= 0 ? filename.slice(dot) : '.wav';
}
