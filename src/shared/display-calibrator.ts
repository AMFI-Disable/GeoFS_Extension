import type { CalibratorPreset } from '../types/settings';

export type ResolvedCalibratorPreset = Exclude<CalibratorPreset, 'auto'>;

export interface DisplayProfile {
  preset: ResolvedCalibratorPreset;
  scale: number;
  label: string;
  resolution: string;
  dpr: number;
  isExternalLike: boolean;
}

export const CALIBRATOR_PRESET_SCALES: Record<ResolvedCalibratorPreset, number> = {
  '1080p': 1.0,
  '1440p': 1.1,
  '4k': 1.35,
  'ultrawide': 1.08,
  'laptop': 0.9
};

export const CALIBRATOR_PRESET_LABELS: Record<ResolvedCalibratorPreset, string> = {
  '1080p': '1080p FHD',
  '1440p': '1440p QHD',
  '4k': '4K UHD',
  'ultrawide': 'Ultrawide',
  'laptop': 'Laptop'
};

export function detectDisplayProfile(win: {
  screen?: { width?: number; height?: number; isExtended?: boolean };
  innerWidth?: number;
  innerHeight?: number;
  devicePixelRatio?: number;
} | undefined = typeof window !== 'undefined' ? window : undefined): DisplayProfile {
  const screenW = Math.max(0, Number(win?.screen?.width ?? win?.innerWidth ?? 1920) || 1920);
  const screenH = Math.max(0, Number(win?.screen?.height ?? win?.innerHeight ?? 1080) || 1080);
  const dpr = Math.max(1, Number(win?.devicePixelRatio ?? 1) || 1);
  const physW = Math.round(screenW * dpr);
  const physH = Math.round(screenH * dpr);
  const aspect = screenH > 0 ? screenW / screenH : 16 / 9;
  const isExtended = Boolean(win?.screen?.isExtended);

  let preset: ResolvedCalibratorPreset = '1080p';
  if (aspect >= 2.05) {
    preset = 'ultrawide';
  } else if (screenW >= 3000 || (physW >= 3600 && dpr <= 1.5)) {
    preset = '4k';
  } else if (screenW >= 2200 || (physW >= 2500 && dpr <= 1.5)) {
    preset = '1440p';
  } else if (screenW < 1200 || (screenW <= 1536 && dpr >= 1.5)) {
    preset = 'laptop';
  }

  const isExternalLike = isExtended || (screenW >= 1920 && dpr <= 1.5) || preset === 'ultrawide' || preset === '4k';
  const scale = CALIBRATOR_PRESET_SCALES[preset];
  const displayType = preset === 'laptop' ? 'Laptop' : isExternalLike ? 'External / Desktop' : 'Desktop';

  return {
    preset,
    scale,
    label: `${CALIBRATOR_PRESET_LABELS[preset]} (${displayType})`,
    resolution: `${screenW}×${screenH}${dpr > 1 ? ` @${Number(dpr.toFixed(2))}x` : ''}`,
    dpr,
    isExternalLike
  };
}

export function resolveCalibratorScale(preset: CalibratorPreset): {
  preset: ResolvedCalibratorPreset;
  scale: number;
  detected: DisplayProfile;
} {
  const detected = detectDisplayProfile();
  if (preset === 'auto') {
    return { preset: detected.preset, scale: detected.scale, detected };
  }
  return {
    preset,
    scale: CALIBRATOR_PRESET_SCALES[preset] ?? 1.0,
    detected
  };
}
