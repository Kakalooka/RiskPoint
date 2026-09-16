/**
 * Canonical RiskPoint model configuration.
 *
 * Scoring v0.2 and financial-impact v0.1 are human-approved PROTOTYPE HEURISTICS.
 * They are not underwriting, not a probability model and not derived from
 * actuarial loss statistics. Source of truth for the values: docs/SPEC.md.
 */

export const MODEL_VERSION = '0.2';
export const LOSS_MODEL_VERSION = '0.1';

export const INDUSTRIES = [
  { id: 'technology', label: 'Technology', baseline: 2 },
  { id: 'financial', label: 'Financial services', baseline: 3 },
  { id: 'healthcare', label: 'Healthcare', baseline: 3 },
  { id: 'retail', label: 'Retail & e-commerce', baseline: 2 },
  { id: 'manufacturing', label: 'Manufacturing', baseline: 3 },
  { id: 'professional', label: 'Professional services', baseline: 2 },
  { id: 'other', label: 'Other', baseline: 2 },
] as const;

/** Ordered from smallest to largest band; loss ranges rely on this order. */
export const REVENUE_BANDS = [
  { id: 'under-5m', label: 'Under €5M', riskModifier: 0, loss: { min: 20_000, max: 120_000 } },
  { id: '5m-25m', label: '€5M–€25M', riskModifier: 0, loss: { min: 50_000, max: 200_000 } },
  { id: '25m-50m', label: '€25M–€50M', riskModifier: 0, loss: { min: 80_000, max: 300_000 } },
  { id: '50m-300m', label: '€50M–€300M', riskModifier: 1, loss: { min: 150_000, max: 600_000 } },
  { id: '300m-plus', label: '€300M+', riskModifier: 1, loss: { min: 300_000, max: 1_500_000 } },
] as const;

export const MFA_OPTIONS = [
  { id: 'full', label: 'Yes, across the company', recapLabel: 'MFA across the company', modifier: 0 },
  { id: 'partial', label: 'Only for some accounts', recapLabel: 'MFA for some accounts', modifier: 1 },
  { id: 'none', label: 'No', recapLabel: 'No MFA', modifier: 3 },
  { id: 'unsure', label: 'I’m not sure', recapLabel: 'MFA coverage unknown', modifier: 2 },
] as const;

export const FULL_MFA: MfaId = 'full';

export const RISK_LEVELS = ['LOW', 'MID', 'HIGH'] as const;

/** Inclusive score ranges. Together they must cover every reachable score. */
export const THRESHOLDS = [
  { level: 'LOW', min: 2, max: 3 },
  { level: 'MID', min: 4, max: 5 },
  { level: 'HIGH', min: 6, max: 7 },
] as const satisfies readonly { level: RiskLevel; min: number; max: number }[];

export type IndustryId = (typeof INDUSTRIES)[number]['id'];
export type RevenueId = (typeof REVENUE_BANDS)[number]['id'];
export type MfaId = (typeof MFA_OPTIONS)[number]['id'];
export type RiskLevel = (typeof RISK_LEVELS)[number];

export interface Answers {
  industry: IndustryId;
  revenue: RevenueId;
  mfa: MfaId;
}

export function industryById(id: IndustryId) {
  return INDUSTRIES.find((o) => o.id === id)!;
}

export function revenueById(id: RevenueId) {
  return REVENUE_BANDS.find((o) => o.id === id)!;
}

export function mfaById(id: MfaId) {
  return MFA_OPTIONS.find((o) => o.id === id)!;
}
