import { assessRisk } from './assessRisk';
import { INDUSTRIES, industryById, mfaById, revenueById, type Answers, type MfaId } from './config';

/**
 * Deterministic one-sentence explanation built from the drivers that actually
 * raise the score above the model minimum. Copy must not imply the weights are
 * derived from historical or actuarial loss data.
 */

type DriverKey = 'mfa' | 'industry' | 'revenue';

interface Driver {
  key: DriverKey;
  contribution: number;
  phrase: string;
}

const TIE_ORDER: DriverKey[] = ['mfa', 'industry', 'revenue'];

const MFA_PHRASES: Record<Exclude<MfaId, 'full'>, string> = {
  partial: 'partial MFA coverage',
  none: 'missing MFA',
  unsure: 'unconfirmed MFA coverage',
};

const MIN_INDUSTRY_BASELINE = Math.min(...INDUSTRIES.map((i) => i.baseline));

export function riskDrivers(answers: Answers): Driver[] {
  const industry = industryById(answers.industry);
  const drivers: Driver[] = [];

  const mfaContribution = mfaById(answers.mfa).modifier;
  if (answers.mfa !== 'full' && mfaContribution > 0) {
    drivers.push({ key: 'mfa', contribution: mfaContribution, phrase: MFA_PHRASES[answers.mfa] });
  }

  const industryContribution = industry.baseline - MIN_INDUSTRY_BASELINE;
  if (industryContribution > 0) {
    drivers.push({
      key: 'industry',
      contribution: industryContribution,
      phrase: `a higher baseline for ${industry.label.toLowerCase()} in this model`,
    });
  }

  const revenueContribution = revenueById(answers.revenue).riskModifier;
  if (revenueContribution > 0) {
    drivers.push({ key: 'revenue', contribution: revenueContribution, phrase: 'your company’s larger scale' });
  }

  return drivers.sort(
    (a, b) => b.contribution - a.contribution || TIE_ORDER.indexOf(a.key) - TIE_ORDER.indexOf(b.key),
  );
}

function joinPhrases(phrases: string[]): string {
  if (phrases.length <= 1) return phrases.join('');
  return `${phrases.slice(0, -1).join(', ')} and ${phrases[phrases.length - 1]}`;
}

export function explainRisk(answers: Answers): string {
  const drivers = riskDrivers(answers);

  if (drivers.length === 0) {
    return 'Company-wide MFA and a standard baseline for your industry keep this assessment low.';
  }

  if (assessRisk(answers) === 'LOW') {
    const verb = drivers.length === 1 ? 'adds' : 'add';
    return `Most factors are favourable, though ${joinPhrases(drivers.map((d) => d.phrase))} ${verb} some exposure.`;
  }

  const top = drivers[0].contribution;
  const primary = drivers.filter((d) => d.contribution === top).map((d) => d.phrase);
  const secondary = drivers.filter((d) => d.contribution < top).map((d) => d.phrase);

  if (secondary.length === 0) return `Driven by ${joinPhrases(primary)}.`;
  return `Driven mainly by ${joinPhrases(primary)}, with ${joinPhrases(secondary)} adding to it.`;
}
