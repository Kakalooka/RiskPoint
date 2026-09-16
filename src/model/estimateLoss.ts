import { revenueById, type RevenueId } from './config';

export interface LossRange {
  min: number;
  max: number;
}

/** Financial impact v0.1: revenue band only. MFA and industry do not modify the range. */
export function estimateLoss(revenue: RevenueId): LossRange {
  const { min, max } = revenueById(revenue).loss;
  return { min, max };
}
