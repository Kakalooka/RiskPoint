import { assessRisk } from './assessRisk';
import type { Answers, RiskLevel } from './config';
import { counterfactualMfa, describeMfaCounterfactual } from './counterfactualMfa';
import { estimateLoss, type LossRange } from './estimateLoss';
import { explainRisk } from './explain';

/** Everything the result screen needs. Deliberately contains no numeric risk score. */
export interface AssessmentResult {
  level: RiskLevel;
  explanation: string;
  mfaMessage: string | null;
  loss: LossRange;
}

export function evaluate(answers: Answers): AssessmentResult {
  return {
    level: assessRisk(answers),
    explanation: explainRisk(answers),
    mfaMessage: describeMfaCounterfactual(counterfactualMfa(answers)),
    loss: estimateLoss(answers.revenue),
  };
}
