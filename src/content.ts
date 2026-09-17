import { INDUSTRIES, MFA_OPTIONS, REVENUE_BANDS } from './model/config';
import type { LossRange } from './model/estimateLoss';

/** Question copy. Answer values and labels come from the model config. */
export const QUESTIONS = [
  { key: 'industry', title: 'What’s your industry?', placeholder: 'Choose industry', options: INDUSTRIES },
  { key: 'revenue', title: 'What’s your annual revenue?', placeholder: 'Choose revenue', options: REVENUE_BANDS },
  {
    key: 'mfa',
    title: 'How widely is MFA used across your company?',
    placeholder: 'Choose coverage',
    options: MFA_OPTIONS,
  },
] as const;

function formatEuro(value: number): string {
  if (value >= 1_000_000) return `€${+(value / 1_000_000).toFixed(1)}M`;
  return `€${+(value / 1_000).toFixed(0)}k`;
}

export function formatLossRange({ min, max }: LossRange): string {
  return `${formatEuro(min)}–${formatEuro(max)}`;
}
