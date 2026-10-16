import { describe, expect, it } from 'vitest';
import { withAnswer } from './draft';

describe('withAnswer', () => {
  it('sets one answer and keeps the others', () => {
    const draft = { industry: 'technology' } as const;
    expect(withAnswer(draft, 'mfa', 'full')).toEqual({ industry: 'technology', mfa: 'full' });
    expect(withAnswer(draft, 'industry', 'retail')).toEqual({ industry: 'retail' });
    expect(draft).toEqual({ industry: 'technology' });
  });

  it('rejects ids that do not belong to the question (checked by tsc)', () => {
    // @ts-expect-error: not an MFA option id
    withAnswer({}, 'mfa', 'bogus-id');
    // @ts-expect-error: an industry id is not a revenue band id
    withAnswer({}, 'revenue', 'technology');
    expect(true).toBe(true);
  });
});
