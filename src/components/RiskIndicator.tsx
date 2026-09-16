import { RISK_LEVELS, type RiskLevel } from '../model/config';

/** Three coarse segments. Deliberately has no knowledge of the numeric score. */
export function RiskIndicator({ level }: { level: RiskLevel }) {
  return (
    <div className="indicator" aria-hidden="true">
      {RISK_LEVELS.map((l) => (
        <div key={l} className="indicator__segment" data-active={l === level}>
          <span className="indicator__bar" />
          <span className="indicator__label">{l}</span>
        </div>
      ))}
    </div>
  );
}
