import {
  THRESHOLDS,
  industryById,
  mfaById,
  revenueById,
  type Answers,
  type RiskLevel,
} from './config';

/** Internal score. Never shown to the user. */
export function scoreRisk(answers: Answers): number {
  return (
    industryById(answers.industry).baseline +
    mfaById(answers.mfa).modifier +
    revenueById(answers.revenue).riskModifier
  );
}

export function levelForScore(score: number): RiskLevel {
  const band = THRESHOLDS.find((t) => score >= t.min && score <= t.max);
  if (!band) throw new Error(`Score ${score} is outside the defined thresholds`);
  return band.level;
}

export function assessRisk(answers: Answers): RiskLevel {
  return levelForScore(scoreRisk(answers));
}
