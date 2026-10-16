import { describe, expect, it } from 'vitest';
import type { Answers, RiskLevel } from './config';
import { evaluate } from './index';

/**
 * Human-readable golden set. Each case reads as: industry / revenue / MFA → expected result.
 * Reviewers should be able to sanity-check these without reading the model code.
 */
const GOLDEN: Array<{ answers: Answers; level: RiskLevel; mfaMessage: string; loss: [number, number] }> = [
  // LOW
  {
    answers: { industry: 'technology', revenue: 'under-5m', mfa: 'full' },
    level: 'LOW',
    mfaMessage: 'Full MFA coverage is already helping keep your assessed risk lower.',
    loss: [20_000, 120_000],
  },
  {
    answers: { industry: 'healthcare', revenue: '25m-50m', mfa: 'full' },
    level: 'LOW',
    mfaMessage: 'Full MFA coverage is already helping keep your assessed risk lower.',
    loss: [80_000, 300_000],
  },
  {
    answers: { industry: 'professional', revenue: '5m-25m', mfa: 'partial' },
    level: 'LOW',
    mfaMessage: 'Full MFA coverage would still reduce your assessed exposure.',
    loss: [50_000, 200_000],
  },
  // MID
  {
    answers: { industry: 'retail', revenue: 'under-5m', mfa: 'unsure' },
    level: 'MID',
    mfaMessage: 'Full MFA coverage would move this assessment from MID to LOW.',
    loss: [20_000, 120_000],
  },
  {
    answers: { industry: 'healthcare', revenue: '5m-25m', mfa: 'partial' },
    level: 'MID',
    mfaMessage: 'Full MFA coverage would move this assessment from MID to LOW.',
    loss: [50_000, 200_000],
  },
  {
    answers: { industry: 'manufacturing', revenue: '50m-300m', mfa: 'full' },
    level: 'MID',
    mfaMessage: 'Full MFA coverage is already helping keep your assessed risk lower.',
    loss: [150_000, 600_000],
  },
  {
    answers: { industry: 'healthcare', revenue: '50m-300m', mfa: 'partial' },
    level: 'MID',
    mfaMessage: 'Full MFA coverage would still reduce your assessed exposure.',
    loss: [150_000, 600_000],
  },
  // HIGH
  {
    answers: { industry: 'other', revenue: '300m-plus', mfa: 'none' },
    level: 'HIGH',
    mfaMessage: 'Full MFA coverage would move this assessment from HIGH to LOW.',
    loss: [300_000, 1_500_000],
  },
  {
    answers: { industry: 'financial', revenue: 'under-5m', mfa: 'none' },
    level: 'HIGH',
    mfaMessage: 'Full MFA coverage would move this assessment from HIGH to LOW.',
    loss: [20_000, 120_000],
  },
  {
    answers: { industry: 'healthcare', revenue: '300m-plus', mfa: 'none' },
    level: 'HIGH',
    mfaMessage: 'Full MFA coverage would move this assessment from HIGH to MID.',
    loss: [300_000, 1_500_000],
  },
  {
    answers: { industry: 'manufacturing', revenue: '50m-300m', mfa: 'unsure' },
    level: 'HIGH',
    mfaMessage: 'Full MFA coverage would move this assessment from HIGH to MID.',
    loss: [150_000, 600_000],
  },
];

const EXPLANATIONS: Array<{ answers: Answers; explanation: string }> = [
  {
    answers: { industry: 'technology', revenue: 'under-5m', mfa: 'full' },
    explanation: 'Company-wide MFA and a standard baseline for your industry keep this assessment low.',
  },
  {
    answers: { industry: 'professional', revenue: '5m-25m', mfa: 'partial' },
    explanation: 'Most factors are favourable, though partial MFA coverage adds some exposure.',
  },
  {
    answers: { industry: 'manufacturing', revenue: '50m-300m', mfa: 'full' },
    explanation: 'Driven by a higher baseline for manufacturing in this model and your company’s larger scale.',
  },
  {
    answers: { industry: 'healthcare', revenue: '300m-plus', mfa: 'none' },
    explanation:
      'Driven mainly by missing MFA, with a higher baseline for healthcare in this model and your company’s larger scale adding to it.',
  },
  {
    answers: { industry: 'retail', revenue: 'under-5m', mfa: 'unsure' },
    explanation: 'Driven by unconfirmed MFA coverage.',
  },
  {
    answers: { industry: 'financial', revenue: '25m-50m', mfa: 'full' },
    explanation: 'Most factors are favourable, though a higher baseline for financial services in this model adds some exposure.',
  },
];

describe('golden set', () => {
  it.each(GOLDEN)('$answers.industry / $answers.revenue / $answers.mfa → $level', ({ answers, level, mfaMessage, loss }) => {
    const result = evaluate(answers);
    expect(result.level).toBe(level);
    expect(result.mfaMessage).toBe(mfaMessage);
    expect([result.loss.min, result.loss.max]).toEqual(loss);
  });

  it.each(EXPLANATIONS)('explanation for $answers.industry / $answers.revenue / $answers.mfa', ({ answers, explanation }) => {
    expect(evaluate(answers).explanation).toBe(explanation);
  });
});
