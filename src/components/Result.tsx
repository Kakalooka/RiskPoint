import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { formatLossRange, recap } from '../content';
import { MODEL_VERSION, LOSS_MODEL_VERSION, type Answers } from '../model/config';
import { evaluate } from '../model';
import { LeadPanel } from './LeadPanel';
import { RiskIndicator } from './RiskIndicator';

/** Stagger position for the result reveal (presentation only). */
const order = (i: number) => ({ '--i': i }) as CSSProperties;

interface ResultProps {
  answers: Answers;
  onEdit: () => void;
}

export function Result({ answers, onEdit }: ResultProps) {
  const result = evaluate(answers);
  const recapText = recap(answers);
  const [leadOpen, setLeadOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="result page-width">
      <section className="result__risk" data-level={result.level} aria-labelledby="risk-title">
        <h1 id="risk-title" className="eyebrow reveal" style={order(0)} ref={titleRef} tabIndex={-1}>
          Your cyber risk
        </h1>
        <p className="risk-level reveal" style={order(1)}>
          {result.level}
        </p>
        <div className="reveal" style={order(2)}>
          <RiskIndicator level={result.level} />
        </div>
        <p className="risk-explanation reveal" style={order(3)}>
          {result.explanation}
        </p>
        <p className="recap reveal" style={order(4)}>
          <span className="visually-hidden">Your answers: </span>
          <span>{recapText}</span>
          <button type="button" className="text-button" onClick={onEdit}>
            Edit<span className="visually-hidden"> answers</span>
          </button>
        </p>
      </section>

      <section className="result__impact reveal" style={order(5)} aria-labelledby="impact-title">
        <h2 id="impact-title" className="eyebrow">
          Potential financial impact
        </h2>
        <p className="impact-range">{formatLossRange(result.loss)}</p>
        <p className="impact-scope">Illustrative cost of a significant cyber incident for businesses like yours.</p>
        <p className="impact-disclaimer">Illustrative estimate, not an insurance quote.</p>
      </section>

      <section className="result__next reveal" style={order(6)} aria-labelledby="next-title">
        <h2 id="next-title" className="eyebrow">
          MFA coverage
        </h2>
        {result.mfaMessage && <p className="agency">{result.mfaMessage}</p>}
        <button
          type="button"
          className="button button--primary button--cta"
          aria-expanded={leadOpen}
          aria-controls="lead-panel"
          onClick={() => setLeadOpen((open) => !open)}
        >
          See protection options
        </button>
        {leadOpen && <LeadPanel recapText={recapText} />}
      </section>

      <details className="method reveal" style={order(7)}>
        <summary>How this is estimated</summary>
        <div className="method__body">
          <p>
            Your risk level combines three answers: a baseline for your industry, your MFA coverage, and a smaller
            adjustment for company scale. MFA coverage has the largest effect.
          </p>
          <p>
            The weights are a simplified prototype heuristic. They are not an underwriting model and do not express a
            probability of an incident.
          </p>
          <p>
            The financial range depends on your revenue band only. It illustrates the possible cost of a significant
            incident and does not change with your MFA answer.
          </p>
          <p className="method__version">
            Prototype risk model v{MODEL_VERSION} · financial ranges v{LOSS_MODEL_VERSION}
          </p>
        </div>
      </details>
    </main>
  );
}
