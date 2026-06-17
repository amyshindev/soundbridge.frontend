import React from 'react';
import { BridgeButton } from '../common/BridgeButton';
import { buildCreatePresetUrl } from '@/lib/presetUrl';

export interface CreateBridgeButtonProps {
  presetUrl?: string;
  instrument?: string;
  emotion?: string;
  bpm?: number;
  label?: string;
  fullWidth?: boolean;
  className?: string;
}

export const CreateBridgeButton = ({
  presetUrl,
  instrument,
  emotion,
  bpm,
  label = '이 분위기로 만들기',
  fullWidth = false,
  className = '',
}: CreateBridgeButtonProps) => {
  const href = presetUrl ?? buildCreatePresetUrl({ instrument, emotion, bpm });

  return (
    <BridgeButton href={href} fullWidth={fullWidth} className={className}>
      {label}
    </BridgeButton>
  );
};
