'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useCreatePreset } from '@/hooks/useCreatePreset';
import { FilterPanel } from '@/components/create/FilterPanel';
import { SamplePanel } from '@/components/create/SamplePanel';
import { CreateFilter } from '@/types/api';
import { Sample } from '@/types/sample';
import { createFilterToSampleFilters, listSamples } from '@/lib/api';
import { useLocale } from '@/context/LocaleContext';
import { labelEmotion, labelInstrument, labelJangdan } from '@/lib/i18n/labels';

const CreateContent = () => {
  const { preset, hasPreset } = useCreatePreset();
  const { locale, t } = useLocale();

  const [filters, setFilters] = useState<CreateFilter>({
    instruments: [],
    jangdans: [],
    emotions: [],
    bpmMin: 60,
    bpmMax: 200,
    loopUnit: null,
    license: 'all',
  });

  const [showPresetBanner, setShowPresetBanner] = useState(false);
  const [samples, setSamples] = useState<Sample[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasPreset) {
      setFilters({
        instruments: preset.instrument ? [preset.instrument] : [],
        jangdans: [],
        emotions: preset.emotion ? [preset.emotion] : [],
        bpmMin: preset.bpmMin || 60,
        bpmMax: preset.bpmMax || 200,
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
    if (filters.jangdans.length > 0) {
      summary.push(filters.jangdans.map((j) => labelJangdan(locale, j)).join(', '));
    }
    if (filters.emotions.length > 0) {
      summary.push(filters.emotions.map((e) => labelEmotion(locale, e)).join(', '));
    }
    summary.push(`${filters.bpmMin}–${filters.bpmMax} BPM`);
    if (filters.loopUnit !== null) {
      summary.push(`${filters.loopUnit}${t('create_beats_suffix')}`);
    } else {
      summary.push(t('create_summary_all_beats'));
    }
    if (filters.license !== 'all') {
      summary.push(
        filters.license === 'commercial'
          ? t('create_summary_commercial')
          : t('create_summary_attribution')
      );
    }
    return summary.join(' · ');
  }, [filters, locale, t]);

  const handleResetFilters = () => {
    setFilters({
      instruments: [],
      jangdans: [],
      emotions: [],
      bpmMin: 60,
      bpmMax: 200,
      loopUnit: null,
      license: 'all',
    });
    setShowPresetBanner(false);
  };

  return (
    <div className="max-w-[1080px] mx-auto min-h-[calc(100vh-140px)] flex flex-col md:flex-row font-sans">
      <div className="w-full md:w-[240px] shrink-0 border-b md:border-b-0 md:border-r border-sb-border/60">
        <FilterPanel
          filters={filters}
          onChange={setFilters}
          preset={preset}
          showPresetBanner={showPresetBanner}
          onClosePresetBanner={() => setShowPresetBanner(false)}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
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
    <div className="max-w-[1080px] mx-auto min-h-[400px] flex flex-col items-center justify-center">
      <div className="w-5 h-5 border-2 border-sb-primary border-t-transparent rounded-full animate-spin mb-3" />
      <span className="text-[12px] text-sb-muted font-sans animate-pulse">{t('common_loading')}</span>
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
