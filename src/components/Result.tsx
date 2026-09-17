import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { lossRangeParts } from '../content';
import { MODEL_VERSION, LOSS_MODEL_VERSION, type Answers } from '../model/config';
import { evaluate } from '../model';
import { LeadPanel } from './LeadPanel';

/** Stagger position for the result reveal (presentation only). */
const order = (i: number) => ({ '--i': i }) as CSSProperties;

interface ResultProps {
  answers: Answers;
  onEdit: () => void;
}

export function Result({ answers, onEdit }: ResultProps) {
  const result = evaluate(answers);
  const [lossFrom, lossTo] = lossRangeParts(result.loss);
  const [leadOpen, setLeadOpen] = useState(false);
  const [methodOpen, setMethodOpen] = useState(false);
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    titleRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <main className="result" data-level={result.level}>
      <div className="stage">
        <h1 id="risk-title" className="eyebrow reveal" style={order(0)} ref={titleRef} tabIndex={-1}>
          Your cyber risk
        </h1>
        <p className="risk-level reveal" style={order(1)}>
          {result.level}
        </p>
        <span className="risk-accent reveal" style={order(2)} aria-hidden="true" />

        <p className="eyebrow reveal" style={order(3)}>
          Potential financial impact
        </p>
        <p className="impact-range reveal" style={order(4)}>
          {lossFrom}
          <span className="impact-range__dash">–</span>
          {lossTo}
        </p>
        <p className="impact-note reveal" style={order(5)}>
          Illustrative estimate.
        </p>

        <div className="result__action reveal" style={order(6)}>
          <button
            type="button"
            className="button button--primary"
            aria-expanded={leadOpen}
            aria-controls="lead-panel"
            onClick={() => setLeadOpen((open) => !open)}
          >
            See protection options
          </button>
          {leadOpen && <LeadPanel />}
        </div>

        <div className="result__meta reveal" style={order(7)}>
          <button
            type="button"
            className="text-button"
            aria-expanded={methodOpen}
            aria-controls="method"
            onClick={() => setMethodOpen((open) => !open)}
          >
            How is this calculated?
          </button>
          <button type="button" className="text-button" onClick={onEdit}>
            Edit answers
          </button>
        </div>

        {methodOpen && (
          <div className="method" id="method">
            <p>
              An industry baseline, your MFA coverage and company scale, combined with fixed weights. MFA coverage has
              the largest effect. The financial range follows your revenue band.
            </p>
            {result.mfaMessage && <p>{result.mfaMessage}</p>}
            <p className="method__version">
              A prototype heuristic, not underwriting. Model v{MODEL_VERSION} · ranges v{LOSS_MODEL_VERSION}
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
