import { levelForScore, scoreRisk } from './assessRisk';
import { FULL_MFA, type Answers, type RiskLevel } from './config';

export type MfaCounterfactual =
  | { kind: 'already-full' }
  | { kind: 'level-change'; from: RiskLevel; to: RiskLevel }
  | { kind: 'same-level-reduction' }
  | { kind: 'no-effect' };

/** Compares the current answers with the same answers at full MFA, using the same scoring function. */
export function counterfactualMfa(answers: Answers): MfaCounterfactual {
  if (answers.mfa === FULL_MFA) return { kind: 'already-full' };

  const current = scoreRisk(answers);
  const withFullMfa = scoreRisk({ ...answers, mfa: FULL_MFA });
  if (withFullMfa >= current) return { kind: 'no-effect' };

  const from = levelForScore(current);
  const to = levelForScore(withFullMfa);
  return from === to ? { kind: 'same-level-reduction' } : { kind: 'level-change', from, to };
}

export function describeMfaCounterfactual(cf: MfaCounterfactual): string | null {
  switch (cf.kind) {
    case 'already-full':
      return 'Full MFA coverage is already helping keep your assessed risk lower.';
    case 'level-change':
      return `Full MFA coverage would move this assessment from ${cf.from} to ${cf.to}.`;
    case 'same-level-reduction':
      return 'Full MFA coverage would still reduce your assessed exposure.';
    case 'no-effect':
      return null;
  }
}
