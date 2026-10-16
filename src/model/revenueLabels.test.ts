import { describe, expect, it } from 'vitest';
import { REVENUE_BANDS } from './config';

describe('approved display labels', () => {
  it('uses U+200A hair spaces on both sides of each internal revenue-range en dash', () => {
    const hair = '\u200A';
    expect(REVENUE_BANDS.map((b) => b.label)).toEqual([
      'Under €5M',
      `€5M${hair}–${hair}€25M`,
      `€25M${hair}–${hair}€50M`,
      `€50M${hair}–${hair}€300M`,
      '€300M+',
    ]);
  });
});