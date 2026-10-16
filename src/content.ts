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

export function formatEuro(value: number): string {
  if (value >= 1_000_000) return `€${+(value / 1_000_000).toFixed(1)}M`;
  return `€${+(value / 1_000).toFixed(0)}k`;
}

/** The two amounts are rendered separately so the dash can carry its own spacing. */
export function lossRangeParts({ min, max }: LossRange): [string, string] {
  return [formatEuro(min), formatEuro(max)];
}
