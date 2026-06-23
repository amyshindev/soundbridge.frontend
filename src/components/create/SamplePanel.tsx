'use client';

import React from 'react';
import { Sample } from '@/types/sample';
import { SampleRow } from './SampleRow';
import { PrimaryButton } from '../common/PrimaryButton';
import { useLocale } from '@/context/LocaleContext';
import { SlidersHorizontal, AlertCircle } from 'lucide-react';

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
    <div className="flex-1 flex flex-col h-full bg-sb-bg font-sans select-none">
      {/* Top Summary Bar */}
      <div className="px-5 py-4 border-b border-sb-border/60 flex items-center justify-between shrink-0 bg-sb-surface/30">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <SlidersHorizontal className="w-4 h-4 text-sb-accent shrink-0" />
          <span className="text-[12.5px] text-sb-muted font-medium truncate" title={filtersSummaryText}>
            {filtersSummaryText || t('create_summary_all')}
          </span>
        </div>
        <span className="text-[12px] text-sb-primary font-medium shrink-0 ml-4 font-mono">
          {t('create_sample_count', { count })}
        </span>
      </div>

      {/* Samples Scroll Area */}
      <div className="flex-1 overflow-y-auto p-5 scrollbar-thin">
        {isLoading ? (
          // Loading state
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="w-full h-[52px] bg-sb-surface rounded-[10px] animate-pulse" />
            ))}
          </div>
        ) : samples.length > 0 ? (
          // Sample List
          <div className="flex flex-col gap-2.5">
            {samples.map((sample) => (
              <SampleRow key={sample.id} sample={sample} />
            ))}
          </div>
        ) : (
          // Empty State
          <div className="flex flex-col items-center justify-center text-center py-20 px-4">
            <AlertCircle className="w-10 h-10 text-sb-muted mb-3.5" />
            <h3 className="text-[15px] font-medium text-sb-primary mb-1">
              {t('create_empty_title')}
            </h3>
            <p className="text-[12px] text-sb-muted max-w-[280px] leading-relaxed mb-6">
              {t('create_empty_desc')}
            </p>
            <PrimaryButton onClick={onResetFilters} className="px-5 py-2">
              {t('create_empty_reset')}
            </PrimaryButton>
          </div>
        )}
      </div>
    </div>
  );
};
