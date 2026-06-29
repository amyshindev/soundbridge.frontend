'use client';

import React from 'react';
import { CreateFilter } from '@/types/api';
import { CreatePreset } from '@/types/preset';
import { PresetBanner } from './PresetBanner';
import { LoopUnitFilter } from './LoopUnitFilter';
import {
  CREATE_GENRES,
  CREATE_INSTRUMENTS,
  CREATE_JANGDANS,
  EMOTIONS,
  JANGDAN_LOOP_MAP,
} from '@/lib/constants';
import { labelEmotion, labelGenre, labelInstrument, labelJangdan } from '@/lib/i18n/labels';
import { useLocale } from '@/context/LocaleContext';
import { SlidersHorizontal, RotateCcw } from 'lucide-react';
import { clsx } from 'clsx';

export interface FilterPanelProps {
  filters: CreateFilter;
  onChange: (filters: CreateFilter) => void;
  preset: CreatePreset;
  showPresetBanner: boolean;
  onClosePresetBanner: () => void;
}

function FilterChip({
  label,
  active,
  variant = 'default',
  onClick,
}: {
  label: string;
  active: boolean;
  variant?: 'default' | 'emotion';
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={clsx(
        'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
        variant === 'emotion'
          ? active
            ? 'bg-sky-500 text-white'
            : 'bg-sky-50 text-sky-700 hover:bg-sky-100'
          : active
            ? 'bg-slate-900 text-white'
            : 'bg-slate-50 text-slate-600 hover:bg-slate-100',
      )}
    >
      {label}
    </button>
  );
}

export const FilterPanel = ({
  filters,
  onChange,
  preset,
  showPresetBanner,
  onClosePresetBanner,
}: FilterPanelProps) => {
  const { locale, t } = useLocale();

  const handleInstrumentToggle = (inst: string) => {
    const isSelected = filters.instruments.includes(inst);
    const newInstruments = isSelected
      ? filters.instruments.filter((i) => i !== inst)
      : [...filters.instruments, inst];
    onChange({ ...filters, instruments: newInstruments });
  };

  const handleJangdanToggle = (jangdan: string) => {
    const isSelected = filters.jangdans.includes(jangdan);
    const newJangdans = isSelected
      ? filters.jangdans.filter((j) => j !== jangdan)
      : [...filters.jangdans, jangdan];

    let newLoopUnit = filters.loopUnit;
    if (!isSelected) {
      const mappedUnit = JANGDAN_LOOP_MAP[jangdan];
      if (mappedUnit !== undefined) {
        newLoopUnit = mappedUnit;
      }
    } else if (newJangdans.length === 0) {
      newLoopUnit = null;
    } else {
      const lastJangdan = newJangdans[newJangdans.length - 1];
      const mappedUnit = JANGDAN_LOOP_MAP[lastJangdan];
      if (mappedUnit !== undefined) {
        newLoopUnit = mappedUnit;
      }
    }

    onChange({
      ...filters,
      jangdans: newJangdans,
      loopUnit: newLoopUnit,
    });
  };

  const handleGenreToggle = (genre: string) => {
    const isSelected = filters.genres.includes(genre);
    const newGenres = isSelected
      ? filters.genres.filter((g) => g !== genre)
      : [...filters.genres, genre];
    onChange({ ...filters, genres: newGenres });
  };

  const handleEmotionToggle = (emotion: string) => {
    const isSelected = filters.emotions.includes(emotion);
    const newEmotions = isSelected
      ? filters.emotions.filter((e) => e !== emotion)
      : [...filters.emotions, emotion];
    onChange({ ...filters, emotions: newEmotions });
  };

  const handleBpmMinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.min(Number(e.target.value), filters.bpmMax - 5);
    onChange({ ...filters, bpmMin: val });
  };

  const handleBpmMaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Math.max(Number(e.target.value), filters.bpmMin + 5);
    onChange({ ...filters, bpmMax: val });
  };

  const handleLoopUnitChange = (val: number | null) => {
    onChange({ ...filters, loopUnit: val });
  };

  const handleLicenseChange = (licenseType: 'commercial' | 'attribution' | 'all') => {
    onChange({ ...filters, license: licenseType });
  };

  const handleReset = () => {
    onChange({
      instruments: [],
      genres: [],
      jangdans: [],
      emotions: [],
      bpmMin: 0,
      bpmMax: 300,
      loopUnit: null,
      license: 'all',
    });
  };

  return (
    <div className="w-full lg:w-64 shrink-0 bg-white rounded-2xl p-4 sm:p-5 border border-slate-100 shadow-sm">
      {showPresetBanner && (
        <div className="mb-5 -mx-1">
          <PresetBanner preset={preset} onClose={onClosePresetBanner} />
        </div>
      )}

      <div className="flex items-center gap-2 font-bold text-slate-900 mb-6">
        <SlidersHorizontal size={18} />
        <span>필터</span>
      </div>

      <div className="space-y-6 max-h-none lg:max-h-[70vh] overflow-y-auto pr-1">
        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {t('create_filter_type')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {CREATE_INSTRUMENTS.map((inst) => (
              <FilterChip
                key={inst}
                label={labelInstrument(locale, inst)}
                active={filters.instruments.includes(inst)}
                onClick={() => handleInstrumentToggle(inst)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {t('create_filter_genre')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {CREATE_GENRES.map((genre) => (
              <FilterChip
                key={genre}
                label={labelGenre(locale, genre)}
                active={filters.genres.includes(genre)}
                onClick={() => handleGenreToggle(genre)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {t('create_filter_jangdan')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {CREATE_JANGDANS.map((jd) => (
              <FilterChip
                key={jd}
                label={labelJangdan(locale, jd)}
                active={filters.jangdans.includes(jd)}
                onClick={() => handleJangdanToggle(jd)}
              />
            ))}
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {t('create_filter_emotion')}
          </h4>
          <div className="flex flex-wrap gap-2">
            {EMOTIONS.map((em) => (
              <FilterChip
                key={em}
                label={labelEmotion(locale, em)}
                active={filters.emotions.includes(em)}
                variant="emotion"
                onClick={() => handleEmotionToggle(em)}
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex justify-between items-baseline mb-3">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              {t('create_filter_bpm')}
            </h4>
            <span className="text-xs text-slate-600 font-medium tabular-nums">
              {filters.bpmMin} — {filters.bpmMax}
            </span>
          </div>
          <div className="flex flex-col gap-3">
            <input
              type="range"
              min="0"
              max="300"
              value={filters.bpmMin}
              onChange={handleBpmMinChange}
              className="w-full accent-sky-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
            <input
              type="range"
              min="0"
              max="300"
              value={filters.bpmMax}
              onChange={handleBpmMaxChange}
              className="w-full accent-sky-500 h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {t('create_filter_loop')}
          </h4>
          <LoopUnitFilter value={filters.loopUnit} onChange={handleLoopUnitChange} />
        </div>

        <div>
          <h4 className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">
            {t('create_filter_license')}
          </h4>
          <div className="flex flex-wrap gap-2">
            <FilterChip
              label={t('create_license_commercial')}
              active={filters.license === 'commercial'}
              variant="emotion"
              onClick={() => handleLicenseChange('commercial')}
            />
            <FilterChip
              label={t('create_license_attribution')}
              active={filters.license === 'attribution'}
              variant="emotion"
              onClick={() => handleLicenseChange('attribution')}
            />
            <FilterChip
              label={t('create_license_all')}
              active={filters.license === 'all'}
              onClick={() => handleLicenseChange('all')}
            />
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleReset}
        className="w-full mt-6 flex items-center justify-center gap-1.5 text-slate-500 hover:text-slate-900 text-sm font-medium transition-colors py-2 rounded-lg hover:bg-slate-50"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        <span>{t('create_reset_filters')}</span>
      </button>
    </div>
  );
};
