'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useCreatePreset } from '@/hooks/useCreatePreset';
import { FilterPanel } from '@/components/create/FilterPanel';
import { SamplePanel } from '@/components/create/SamplePanel';
import { CreateFilter } from '@/types/api';
import { Sample } from '@/types/sample';
import { CREATE_BPM_MAX, CREATE_BPM_MIN, createFilterToSampleFilters, listSamples } from '@/lib/api';
import { useLocale } from '@/context/LocaleContext';
import { labelEmotion, labelGenre, labelInstrument, labelJangdan } from '@/lib/i18n/labels';
import { CREATE_INSTRUMENTS } from '@/lib/constants';

const DEFAULT_FILTERS: CreateFilter = {
  instruments: [],
  genres: [],
  jangdans: [],
  emotions: [],
  bpmMin: CREATE_BPM_MIN,
  bpmMax: CREATE_BPM_MAX,
  loopUnit: null,
  license: 'all',
};

function mapPresetInstrument(raw: string | null | undefined): string | null {
  if (!raw) return null;
  if ((CREATE_INSTRUMENTS as readonly string[]).includes(raw)) return raw;
  if (raw === '판소리') return '판소리';
  return '가창';
}

const CreateContent = () => {
  const { preset, hasPreset } = useCreatePreset();
  const { locale, t } = useLocale();

  const [filters, setFilters] = useState<CreateFilter>(DEFAULT_FILTERS);
  const [showPresetBanner, setShowPresetBanner] = useState(false);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasPreset) {
      const instrument = mapPresetInstrument(preset.instrument);
      setFilters({
        instruments: instrument ? [instrument] : [],
        genres: [],
        jangdans: [],
        emotions: preset.emotion ? [preset.emotion] : [],
        bpmMin: preset.bpmMin ?? CREATE_BPM_MIN,
        bpmMax: preset.bpmMax ?? CREATE_BPM_MAX,
        loopUnit: null,
        license: 'all',
      });
      setShowPresetBanner(true);
    }
  }, [hasPreset, preset.instrument, preset.emotion, preset.bpmMin, preset.bpmMax]);

  useEffect(() => {
    const loadSamples = async () => {
      setIsLoading(true);
      try {
        const sampleFilters = createFilterToSampleFilters(filters);
        const data = await listSamples(sampleFilters);
        setSamples(data.tracks);
        setTotal(data.total);
      } catch (e) {
        console.error('Failed to fetch samples', e);
        setSamples([]);
        setTotal(0);
      } finally {
        setIsLoading(false);
      }
    };
    loadSamples();
  }, [filters]);

  const filtersSummaryText = useMemo(() => {
    const summary: string[] = [];
    if (filters.instruments.length > 0) {
      summary.push(filters.instruments.map((i) => labelInstrument(locale, i)).join(', '));
    }
    if (filters.genres.length > 0) {
      summary.push(filters.genres.map((g) => labelGenre(locale, g)).join(', '));
    }
    if (filters.jangdans.length > 0) {
      summary.push(filters.jangdans.map((j) => labelJangdan(locale, j)).join(', '));
    }
    if (filters.emotions.length > 0) {
      summary.push(filters.emotions.map((e) => labelEmotion(locale, e)).join(', '));
    }
    if (filters.bpmMin !== CREATE_BPM_MIN || filters.bpmMax !== CREATE_BPM_MAX) {
      summary.push(`${filters.bpmMin}–${filters.bpmMax} BPM`);
    }
    if (filters.loopUnit !== null) {
      summary.push(`${filters.loopUnit}${t('create_beats_suffix')}`);
    }
    if (filters.license !== 'all') {
      summary.push(
        filters.license === 'commercial'
          ? t('create_summary_commercial')
          : t('create_summary_attribution'),
      );
    }
    return summary.join(' · ');
  }, [filters, locale, t]);

  const handleResetFilters = () => {
    setFilters(DEFAULT_FILTERS);
    setShowPresetBanner(false);
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6 max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-0 sm:mb-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mb-1">샘플 라이브러리</h1>
          <p className="text-slate-500 text-sm">
            루프 단위, BPM, 악기별로 국악 샘플을 찾고 프로젝트에 추가하세요.
          </p>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-4 sm:gap-8 items-start">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          preset={preset}
          showPresetBanner={showPresetBanner}
          onClosePresetBanner={() => setShowPresetBanner(false)}
        />

        <SamplePanel
          samples={samples}
          total={total}
          isLoading={isLoading}
          filtersSummaryText={filtersSummaryText}
          onResetFilters={handleResetFilters}
        />
      </div>
    </div>
  );
};

function CreateFallback() {
  const { t } = useLocale();
  return (
    <div className="max-w-5xl mx-auto min-h-[400px] flex flex-col items-center justify-center">
      <div className="w-8 h-8 border-4 border-sky-100 border-t-sky-500 rounded-full animate-spin mb-3" />
      <span className="text-sm text-slate-500 animate-pulse">{t('common_loading')}</span>
    </div>
  );
}

export default function CreatePage() {
  return (
    <Suspense fallback={<CreateFallback />}>
      <CreateContent />
    </Suspense>
  );
}
