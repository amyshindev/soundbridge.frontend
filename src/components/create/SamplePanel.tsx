'use client';

import React from 'react';
import { Sample } from '@/types/sample';
import { SampleRow } from './SampleRow';
import { useLocale } from '@/context/LocaleContext';
import { AlertCircle } from 'lucide-react';

export interface SamplePanelProps {
  samples: Sample[];
  total?: number;
  isLoading: boolean;
  filtersSummaryText: string;
  onResetFilters: () => void;
}

export const SamplePanel = ({
  samples,
  total,
  isLoading,
  filtersSummaryText,
  onResetFilters,
}: SamplePanelProps) => {
  const { t } = useLocale();
  const count = total ?? samples.length;

  return (
    <div className="flex-1 w-full flex flex-col gap-3 min-w-0">
      <div className="text-sm font-medium text-slate-500 mb-2">
        {t('create_sample_count', { count })}
      </div>

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((idx) => (
            <div
              key={idx}
              className="w-full h-24 bg-white rounded-2xl border border-slate-100 animate-pulse"
            />
          ))}
        </div>
      ) : samples.length > 0 ? (
        <div className="flex flex-col gap-3">
          {samples.map((sample) => (
            <SampleRow key={sample.id} sample={sample} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 border-dashed p-12 text-center">
          <AlertCircle className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">{t('create_empty_title')}</h3>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">{t('create_empty_desc')}</p>
          <button
            type="button"
            onClick={onResetFilters}
            className="px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            {t('create_empty_reset')}
          </button>
        </div>
      )}
    </div>
  );
};
