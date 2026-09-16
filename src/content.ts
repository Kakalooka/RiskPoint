import {
  INDUSTRIES,
  MFA_OPTIONS,
  REVENUE_BANDS,
  industryById,
  mfaById,
  revenueById,
  type Answers,
} from './model/config';
import type { LossRange } from './model/estimateLoss';

/** Question copy. Answer values and labels come from the model config. */
export const QUESTIONS = [
  { key: 'industry', title: 'What’s your industry?', helper: null, options: INDUSTRIES },
  { key: 'revenue', title: 'What’s your annual revenue?', helper: 'An approximate range is fine.', options: REVENUE_BANDS },
  {
    key: 'mfa',
    // U+2060 word joiner keeps "multi-factor" on one line (Sora has no non-breaking hyphen glyph).
    title: 'How widely is multi-⁠factor authentication (MFA) used across your company?',
    helper: 'Think email, remote access and admin accounts.',
    options: MFA_OPTIONS,
  },
] as const;

export function recap(answers: Answers): string {
  return [
    industryById(answers.industry).label,
    revenueById(answers.revenue).label,
    mfaById(answers.mfa).recapLabel,
  ].join(' · ');
}

function formatEuro(value: number): string {
  if (value >= 1_000_000) return `€${+(value / 1_000_000).toFixed(1)}M`;
  return `€${+(value / 1_000).toFixed(0)}k`;
}

export function formatLossRange({ min, max }: LossRange): string {
  return `${formatEuro(min)}–${formatEuro(max)}`;
}
