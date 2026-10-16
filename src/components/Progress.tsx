interface ProgressProps {
  step: number;
  total: number;
}

export function Progress({ step, total }: ProgressProps) {
  return (
    <div className="progress">
      <div className="progress__segments" aria-hidden="true">
        {Array.from({ length: total }, (_, i) => (
          <span
            key={i}
            className="progress__segment"
            data-state={i < step ? 'done' : i === step ? 'current' : 'todo'}
          />
        ))}
      </div>
      <p className="progress__text">
        <span className="visually-hidden">Question </span>
        {step + 1} of {total}
      </p>
    </div>
  );
}
