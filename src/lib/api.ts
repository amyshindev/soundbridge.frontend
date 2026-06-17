import { GugakTrack, MatchResult } from '@/types/track';
import { Sample } from '@/types/sample';
import {
  CreateFilter,
  DataSource,
  DiscoverResult,
  PopularTracksResult,
  SampleFilters,
  SampleListResult,
} from '@/types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
const API_PREFIX = '/api/soundbridge';

/** dev 또는 NEXT_PUBLIC_USE_MOCK=true 일 때만 mock fallback */
export function shouldUseMockFallback(): boolean {
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'true') return true;
  if (process.env.NEXT_PUBLIC_USE_MOCK === 'false') return false;
  return process.env.NODE_ENV === 'development';
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

interface ApiOptions extends RequestInit {
  token?: string;
}

interface ApiCuePoint {
  time_sec: number;
  label: string;
  emotion: string;
}

interface ApiTrack {
  id: string;
  title: string;
  artist: string;
  instrument: string;
  jangdan: string;
  emotion_tags: string[];
  bpm: number;
  loop_unit_beats: number;
  cue_points: ApiCuePoint[];
  audio_url: string;
  license_type: string;
  license_label_en: string;
  description_ko: string;
  description_en: string;
  score?: number | null;
  explanation?: string | null;
  preset_url?: string | null;
}

interface ApiDiscoverResponse {
  tracks: ApiTrack[];
  input_summary: string;
}

interface ApiSampleListResponse {
  tracks: ApiTrack[];
  total: number;
}

function inferPublicLicenseType(licenseType: string): GugakTrack['publicLicenseType'] {
  return licenseType.includes('2') ? 'KOGL_2' : 'KOGL_1';
}

function mapTrack(track: ApiTrack): GugakTrack {
  return {
    id: String(track.id),
    title: track.title,
    artist: track.artist,
    instrument: track.instrument,
    jangdan: track.jangdan,
    emotionTags: track.emotion_tags,
    bpm: track.bpm,
    loopUnitBeats: track.loop_unit_beats,
    cuePoints: track.cue_points.map((cp) => ({
      timeSec: cp.time_sec,
      label: cp.label as 'A' | 'B' | 'C',
      emotion: cp.emotion,
    })),
    audioUrl: track.audio_url,
    licenseType: track.license_type,
    licenseLabelEn: track.license_label_en,
    publicLicenseType: inferPublicLicenseType(track.license_type),
    descriptionKo: track.description_ko,
    descriptionEn: track.description_en,
    score: track.score ?? undefined,
    explanation: track.explanation ?? undefined,
    presetUrl: track.preset_url ?? undefined,
    createdAt: new Date().toISOString(),
  };
}

function mapSample(track: ApiTrack, index: number): Sample {
  return {
    ...mapTrack(track),
    measures: index % 2 === 0 ? 2 : 4,
    key: index % 2 === 0 ? 'F Minor' : 'A Major',
  };
}

function mapDiscoverResults(data: ApiDiscoverResponse): MatchResult[] {
  return data.tracks.map((track) => ({
    track: mapTrack(track),
    score: track.score ?? 0,
    explanation: track.explanation ?? '',
  }));
}

export function createFilterToSampleFilters(filters: CreateFilter): SampleFilters {
  const sampleFilters: SampleFilters = {
    limit: 100,
    offset: 0,
  };

  if (filters.instruments.length > 0) {
    sampleFilters.instruments = filters.instruments;
  }
  if (filters.jangdans.length > 0) {
    sampleFilters.jangdans = filters.jangdans;
  }
  if (filters.emotions.length > 0) {
    sampleFilters.emotions = filters.emotions;
  }
  if (filters.bpmMin !== 60) {
    sampleFilters.bpmMin = filters.bpmMin;
  }
  if (filters.bpmMax !== 200) {
    sampleFilters.bpmMax = filters.bpmMax;
  }
  if (filters.loopUnit !== null) {
    sampleFilters.loopUnit = filters.loopUnit;
  }
  if (filters.license !== 'all') {
    sampleFilters.license = filters.license;
  }

  return sampleFilters;
}

export function buildSampleQueryString(filters: SampleFilters): string {
  const params = new URLSearchParams();

  filters.instruments?.forEach((value) => params.append('instruments', value));
  filters.jangdans?.forEach((value) => params.append('jangdans', value));
  filters.emotions?.forEach((value) => params.append('emotions', value));

  if (filters.bpmMin !== undefined) {
    params.set('bpm_min', String(filters.bpmMin));
  }
  if (filters.bpmMax !== undefined) {
    params.set('bpm_max', String(filters.bpmMax));
  }
  if (filters.loopUnit !== null && filters.loopUnit !== undefined) {
    params.set('loop_unit', String(filters.loopUnit));
  }
  if (filters.license === 'commercial') {
    params.set('license', 'KOGL_1');
  } else if (filters.license === 'attribution') {
    params.set('license', 'KOGL_2');
  }
  if (filters.limit !== undefined) {
    params.set('limit', String(filters.limit));
  }
  if (filters.offset !== undefined) {
    params.set('offset', String(filters.offset));
  }

  const query = params.toString();
  return query ? `?${query}` : '';
}

async function apiFetch<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const { token, ...rest } = options;

  const res = await fetch(`${BASE_URL}${API_PREFIX}${path}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...rest.headers,
    },
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({}));
    throw new ApiError(res.status, error.detail ?? error.message ?? 'Server error occurred');
  }

  return res.json();
}

async function withMockFallback<T>(
  path: string,
  request: () => Promise<T>,
  fallback: () => T,
): Promise<{ data: T; source: DataSource }> {
  try {
    return { data: await request(), source: 'api' };
  } catch (e) {
    if (!shouldUseMockFallback()) {
      throw e;
    }
    console.warn(`API fetch failed for ${API_PREFIX}${path}. Falling back to mock data.`, e);
    return { data: fallback(), source: 'mock' };
  }
}

export async function getPopularTracks(limit = 6): Promise<PopularTracksResult> {
  const { data, source } = await withMockFallback(
    `/discover/popular?limit=${limit}`,
    async () => {
      const tracks = await apiFetch<ApiTrack[]>(`/discover/popular?limit=${limit}`);
      return tracks.map(mapTrack);
    },
    () => MOCK_TRACKS.slice(0, limit),
  );
  return { tracks: data, source };
}

export async function discoverTracks(input: string, lang = 'ko'): Promise<DiscoverResult> {
  try {
    const data = await apiFetch<ApiDiscoverResponse>('/discover', {
      method: 'POST',
      body: JSON.stringify({ input, lang }),
    });
    return {
      tracks: mapDiscoverResults(data),
      inputSummary: data.input_summary,
      source: 'api',
    };
  } catch (e) {
    if (e instanceof ApiError && e.status === 503) {
      throw e;
    }
    if (!shouldUseMockFallback()) {
      throw e;
    }
    console.warn(`API fetch failed for ${API_PREFIX}/discover. Falling back to mock data.`, e);
    return {
      tracks: getMockDiscoverResults(input),
      inputSummary: `"${input}" 와 감성이 닮은 국악`,
      source: 'mock',
    };
  }
}

export async function listSamples(filters: SampleFilters = {}): Promise<SampleListResult> {
  const query = buildSampleQueryString({ limit: 100, offset: 0, ...filters });
  const { data, source } = await withMockFallback(
    `/create/samples${query}`,
    async () => {
      const response = await apiFetch<ApiSampleListResponse>(`/create/samples${query}`);
      return {
        tracks: response.tracks.map(mapSample),
        total: response.total,
      };
    },
    () => ({
      tracks: filterMockSamples(filters),
      total: filterMockSamples(filters).length,
    }),
  );
  return { ...data, source };
}

function filterMockSamples(filters: SampleFilters): Sample[] {
  const createFilter: CreateFilter = {
    instruments: filters.instruments ?? [],
    jangdans: filters.jangdans ?? [],
    emotions: filters.emotions ?? [],
    bpmMin: filters.bpmMin ?? 60,
    bpmMax: filters.bpmMax ?? 200,
    loopUnit: filters.loopUnit ?? null,
    license: filters.license ?? 'all',
  };

  return MOCK_SAMPLES.filter((sample) => {
    if (createFilter.instruments.length > 0 && !createFilter.instruments.includes(sample.instrument)) {
      return false;
    }
    if (createFilter.jangdans.length > 0 && !createFilter.jangdans.includes(sample.jangdan)) {
      return false;
    }
    if (createFilter.emotions.length > 0) {
      const hasOverlap = sample.emotionTags.some((tag) => createFilter.emotions.includes(tag));
      if (!hasOverlap) return false;
    }
    if (sample.bpm < createFilter.bpmMin || sample.bpm > createFilter.bpmMax) {
      return false;
    }
    if (createFilter.loopUnit !== null && sample.loopUnitBeats !== createFilter.loopUnit) {
      return false;
    }
    if (createFilter.license === 'commercial' && sample.publicLicenseType !== 'KOGL_1') {
      return false;
    }
    if (createFilter.license === 'attribution' && sample.publicLicenseType !== 'KOGL_2') {
      return false;
    }
    return true;
  });
}

// ==========================================
// Rich Mock Data for SoundBridge MVP
// ==========================================

const MOCK_TRACKS: GugakTrack[] = [
  {
    id: 'track_1',
    title: '비단길 위의 가야금 선율',
    artist: '국립국악원',
    instrument: '가야금',
    jangdan: '굿거리',
    emotionTags: ['서정', '차분', '신비'],
    bpm: 85,
    loopUnitBeats: 12,
    cuePoints: [
      { timeSec: 3, label: 'A', emotion: '서정적 도입' },
      { timeSec: 15, label: 'B', emotion: '감성 해소 피크' },
      { timeSec: 28, label: 'C', emotion: '장단 전환점' },
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    licenseType: '공공누리 제1유형',
    licenseLabelEn: 'KOGL Type 1',
    publicLicenseType: 'KOGL_1',
    descriptionKo: '가야금의 뜯고 퉁기는 맑은 울림과 농현의 섬세한 떨림이 어우러져 동양적인 평온함과 잔잔한 여운을 선사하는 음원입니다.',
    descriptionEn: 'The clear plucking sound of Gayageum and delicate vibrato create an Asian tranquility and deep resonance.',
    createdAt: '2026-06-10T12:00:00Z',
    presetUrl: '/create?instrument=가야금&emotion=서정&bpm_min=65&bpm_max=105',
  },
  {
    id: 'track_2',
    title: '태평성대 자진모리 대금 독주',
    artist: '국립국악원',
    instrument: '대금',
    jangdan: '자진모리',
    emotionTags: ['신남', '웅장', '신비'],
    bpm: 110,
    loopUnitBeats: 12,
    cuePoints: [
      { timeSec: 5, label: 'A', emotion: '대금 청의 피크' },
      { timeSec: 18, label: 'B', emotion: '신명나는 호흡' },
      { timeSec: 32, label: 'C', emotion: '루프 시작점' },
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    licenseType: '공공누리 제1유형',
    licenseLabelEn: 'KOGL Type 1',
    publicLicenseType: 'KOGL_1',
    descriptionKo: '대금 독특의 청울림(갈대막의 떨림)이 돋보이는 곡으로, 빠른 자진모리장단에 맞추어 신명나고 에너제틱하게 뻗어나가는 대금의 기백을 담았습니다.',
    descriptionEn: 'A Daegeum solo showcasing its unique reed vibrato, delivering energetic and lively melodies on a fast Jajinmori beat.',
    createdAt: '2026-06-11T14:30:00Z',
    presetUrl: '/create?instrument=대금&emotion=신남&bpm_min=90&bpm_max=130',
  },
  {
    id: 'track_3',
    title: '새벽 안개 걷히는 해금 가락',
    artist: '국립국악원',
    instrument: '해금',
    jangdan: '중모리',
    emotionTags: ['슬픔', '차분', '서정'],
    bpm: 72,
    loopUnitBeats: 12,
    cuePoints: [
      { timeSec: 4, label: 'A', emotion: '구슬픈 활대 떨림' },
      { timeSec: 12, label: 'B', emotion: '감정 고조선' },
      { timeSec: 25, label: 'C', emotion: '해소 구간' },
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    licenseType: '공공누리 제2유형',
    licenseLabelEn: 'KOGL Type 2',
    publicLicenseType: 'KOGL_2',
    descriptionKo: '두 줄의 활대 사이로 피어오르는 애절하고 구슬픈 음색이 특징입니다. 슬픈 영화 음악이나 동양적 분위기의 테마에 매우 잘 조화되는 슬픈 서정성을 지녔습니다.',
    descriptionEn: 'Featuring a sorrowful and pathetic tone rising from the two strings of Haegeum. Perfect for sad cinematic scores.',
    createdAt: '2026-06-12T09:00:00Z',
    presetUrl: '/create?instrument=해금&emotion=슬픔&bpm_min=60&bpm_max=92',
  },
  {
    id: 'track_4',
    title: '바람의 엇모리 피리 루프',
    artist: '국립국악원',
    instrument: '피리',
    jangdan: '엇모리',
    emotionTags: ['신비', '웅장', '차분'],
    bpm: 95,
    loopUnitBeats: 10,
    cuePoints: [
      { timeSec: 2, label: 'A', emotion: '독특한 10박 엇박' },
      { timeSec: 8, label: 'B', emotion: '피리 주선율 피크' },
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    licenseType: '공공누리 제1유형',
    licenseLabelEn: 'KOGL Type 1',
    publicLicenseType: 'KOGL_1',
    descriptionKo: '엇모리 특유의 절묘한 10박 호흡 위에 피리의 묵직하고도 우렁찬 주선율이 얹혀 신비로우면서도 웅장한 대자연의 호흡을 표현한 고음질 샘플입니다.',
    descriptionEn: 'The rich and powerful tone of Piri flows on a mysterious 10-beat Eotmori rhythm, representing the voice of great nature.',
    createdAt: '2026-06-12T10:15:00Z',
    presetUrl: '/create?instrument=피리&emotion=신비&bpm_min=75&bpm_max=115',
  },
  {
    id: 'track_5',
    title: '휘모리 휘감는 아쟁 앙상블',
    artist: '국립국악원',
    instrument: '아쟁',
    jangdan: '휘모리',
    emotionTags: ['웅장', '신남', '슬픔'],
    bpm: 135,
    loopUnitBeats: 4,
    cuePoints: [
      { timeSec: 1, label: 'A', emotion: '저음 아쟁 어택' },
      { timeSec: 6, label: 'B', emotion: '휘모리 질주 피크' },
      { timeSec: 11, label: 'C', emotion: '루프 반환점' },
    ],
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    licenseType: '공공누리 제2유형',
    licenseLabelEn: 'KOGL Type 2',
    publicLicenseType: 'KOGL_2',
    descriptionKo: '묵직한 저음 현악기인 아쟁이 매우 빠른 휘모리장단에 맞추어 격렬하고 날카로운 보잉을 쏟아내어 극적이고 웅장한 긴장감을 연출합니다.',
    descriptionEn: 'Ajaeng, a heavy bass string instrument, delivers intense and sharp bowing on a rapid Hwimori beat to build cinematic tension.',
    createdAt: '2026-06-12T11:00:00Z',
    presetUrl: '/create?instrument=아쟁&emotion=웅장&bpm_min=115&bpm_max=155',
  },
];

const MOCK_SAMPLES: Sample[] = MOCK_TRACKS.map((t, idx) => ({
  ...t,
  measures: idx % 2 === 0 ? 2 : 4,
  key: idx % 2 === 0 ? 'F Minor' : 'A Major',
}));

function getMockDiscoverResults(queryText: string): MatchResult[] {
  return MOCK_TRACKS.map((track, idx) => {
    const matchScore = 98 - idx * 4;
    let explanation = `'${queryText}'의 감정 선율은 국악 '${track.title}'의 전통 호흡과 닮아 있습니다. `;
    if (track.instrument === '가야금') {
      explanation += '입력하신 서정적이고 섬세한 현악 떨림은 가야금 농현 특유의 애틋한 울림과 잘 맞습니다.';
    } else if (track.instrument === '대금') {
      explanation += '입력하신 곡의 맑고 높은 청아함은 대금의 청울림과 잘 어우러집니다.';
    } else {
      explanation += `${track.instrument}의 독특한 질감과 장단 구조가 감성 큐레이션을 충족합니다.`;
    }
    return { track, score: matchScore, explanation };
  });
}
