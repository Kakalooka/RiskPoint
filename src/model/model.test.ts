import { describe, expect, it } from 'vitest';
import { assessRisk, levelForScore, scoreRisk } from './assessRisk';
import {
  INDUSTRIES,
  MFA_OPTIONS,
  REVENUE_BANDS,
  RISK_LEVELS,
  THRESHOLDS,
  type Answers,
  type RiskLevel,
} from './config';
import { counterfactualMfa } from './counterfactualMfa';
import { estimateLoss } from './estimateLoss';
import { explainRisk } from './explain';
import { evaluate } from './index';

const ALL: Answers[] = INDUSTRIES.flatMap((i) =>
  REVENUE_BANDS.flatMap((r) => MFA_OPTIONS.map((m) => ({ industry: i.id, revenue: r.id, mfa: m.id }))),
);

describe('exhaustive model checks (all combinations)', () => {
  it('covers 7 × 5 × 4 = 140 combinations', () => {
    expect(ALL).toHaveLength(140);
  });

  it('every combination scores inside the thresholds and returns LOW, MID or HIGH', () => {
    const minThreshold = Math.min(...THRESHOLDS.map((t) => t.min));
    const maxThreshold = Math.max(...THRESHOLDS.map((t) => t.max));
    for (const answers of ALL) {
      const score = scoreRisk(answers);
      expect(score).toBeGreaterThanOrEqual(minThreshold);
      expect(score).toBeLessThanOrEqual(maxThreshold);
      expect(RISK_LEVELS).toContain(assessRisk(answers));
    }
  });

  it('thresholds are contiguous and non-overlapping', () => {
    for (let i = 1; i < THRESHOLDS.length; i++) {
      expect(THRESHOLDS[i].min).toBe(THRESHOLDS[i - 1].max + 1);
    }
    expect(() => levelForScore(1)).toThrow();
    expect(() => levelForScore(8)).toThrow();
  });

  it('matches the documented distribution (LOW 41 / MID 70 / HIGH 29)', () => {
    const counts: Record<RiskLevel, number> = { LOW: 0, MID: 0, HIGH: 0 };
    for (const answers of ALL) counts[assessRisk(answers)]++;
    console.info('Risk distribution across 140 combinations:', counts);
    expect(counts).toEqual({ LOW: 41, MID: 70, HIGH: 29 });
  });

  it('the UI-facing result carries no numeric risk score', () => {
    for (const answers of ALL) {
      const result = evaluate(answers);
      expect(Object.keys(result).sort()).toEqual(['explanation', 'level', 'loss', 'mfaMessage']);
      expect(typeof result.level).toBe('string');
      expect(result.explanation).not.toMatch(/\d/);
      expect(result.mfaMessage ?? '').not.toMatch(/\d/);
    }
  });

  it('“I’m not sure” never produces LOW', () => {
    for (const answers of ALL.filter((a) => a.mfa === 'unsure')) {
      expect(assessRisk(answers)).not.toBe('LOW');
    }
  });

  it('“Other” is not treated as the lowest-risk industry', () => {
    const other = INDUSTRIES.find((i) => i.id === 'other')!;
    const named = INDUSTRIES.filter((i) => i.id !== 'other');
    expect(other.baseline).toBeGreaterThanOrEqual(Math.min(...named.map((i) => i.baseline)));
    for (const answers of ALL.filter((a) => a.industry === 'other' && a.mfa !== 'full')) {
      expect(scoreRisk(answers)).toBeGreaterThan(scoreRisk({ ...answers, mfa: 'full' }));
    }
  });
});

describe('financial impact', () => {
  it('every range is valid', () => {
    for (const band of REVENUE_BANDS) {
      const { min, max } = estimateLoss(band.id);
      expect(min).toBeGreaterThan(0);
      expect(max).toBeGreaterThan(min);
    }
  });

  it('increases monotonically by revenue band', () => {
    const ranges = REVENUE_BANDS.map((b) => estimateLoss(b.id));
    for (let i = 1; i < ranges.length; i++) {
      expect(ranges[i].min).toBeGreaterThan(ranges[i - 1].min);
      expect(ranges[i].max).toBeGreaterThan(ranges[i - 1].max);
    }
  });

  it('does not depend on MFA or industry', () => {
    for (const answers of ALL) {
      expect(evaluate(answers).loss).toEqual(estimateLoss(answers.revenue));
    }
  });
});

describe('MFA counterfactual', () => {
  it('agrees with the same scoring function for every combination', () => {
    for (const answers of ALL) {
      const cf = counterfactualMfa(answers);
      const current = scoreRisk(answers);
      const full = scoreRisk({ ...answers, mfa: 'full' });

      if (answers.mfa === 'full') {
        expect(cf).toEqual({ kind: 'already-full' });
      } else if (assessRisk(answers) !== assessRisk({ ...answers, mfa: 'full' })) {
        expect(cf).toEqual({
          kind: 'level-change',
          from: assessRisk(answers),
          to: assessRisk({ ...answers, mfa: 'full' }),
        });
      } else {
        expect(full).toBeLessThan(current);
        expect(cf).toEqual({ kind: 'same-level-reduction' });
      }
    }
  });

  it('never claims a level change that the model did not calculate', () => {
    for (const answers of ALL) {
      const message = evaluate(answers).mfaMessage;
      expect(message).not.toBeNull();
      const match = message!.match(/from (LOW|MID|HIGH) to (LOW|MID|HIGH)/);
      if (match) {
        expect(match[1]).toBe(assessRisk(answers));
        expect(match[2]).toBe(assessRisk({ ...answers, mfa: 'full' }));
        expect(match[1]).not.toBe(match[2]);
      }
    }
  });
});

describe('explanation copy', () => {
  it('never claims historical or actuarial loss evidence', () => {
    for (const answers of ALL) {
      expect(explainRisk(answers)).not.toMatch(/histor|actuar|loss profile|statistic|claims/i);
    }
  });

  it('mentions MFA whenever MFA raises the score', () => {
    for (const answers of ALL.filter((a) => a.mfa !== 'full')) {
      expect(explainRisk(answers)).toMatch(/MFA/);
    }
  });
});
