import { useEffect, useRef, type FormEvent } from 'react';
import { QUESTIONS } from '../content';
import type { Answers } from '../model/config';
import { OptionRow } from './OptionRow';
import { Progress } from './Progress';

export type Draft = Partial<Answers>;

interface AssessmentProps {
  step: number;
  draft: Draft;
  leaving: boolean;
  focusOnMount: boolean;
  onAnswer: (draft: Draft) => void;
  onBack: () => void;
  onNext: () => void;
}

export function Assessment({ step, draft, leaving, focusOnMount, onAnswer, onBack, onNext }: AssessmentProps) {
  const question = QUESTIONS[step];
  const value = draft[question.key];
  const isLast = step === QUESTIONS.length - 1;
  const titleRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (focusOnMount) titleRef.current?.focus({ preventScroll: true });
  }, [step, focusOnMount]);

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (value) onNext();
  }

  return (
    // data-theme pins the dark tokens while the page behind transitions to light on exit.
    <form className="assessment" data-theme="dark" data-leaving={leaving} onSubmit={handleSubmit} noValidate>
      <div className="assessment__body page-width" key={step}>
        <div className="assessment__intro">
          {step === 0 && (
            <p className="lede">
              <span className="lede__promise">See your business’s cyber risk in 3 questions.</span>
              <span className="lede__note">No sign-up to see your result.</span>
            </p>
          )}
          <h1
            id="question-title"
            ref={titleRef}
            tabIndex={-1}
            className="question-title"
            data-long={question.title.length > 40}
          >
            {question.title}
          </h1>
          {question.helper && (
            <p id="question-helper" className="question-helper">
              {question.helper}
            </p>
          )}
        </div>

        <div
          className="options"
          role="radiogroup"
          aria-labelledby="question-title"
          aria-describedby={question.helper ? 'question-helper' : undefined}
        >
          {question.options.map((option) => (
            <OptionRow
              key={option.id}
              name={question.key}
              value={option.id}
              label={option.label}
              checked={value === option.id}
              onSelect={(id) => onAnswer({ ...draft, [question.key]: id })}
            />
          ))}
        </div>
      </div>

      <div className="actions">
        <div className="actions__inner page-width">
          <Progress step={step} total={QUESTIONS.length} />
          <div className="actions__buttons">
            {step > 0 && (
              <button type="button" className="button button--quiet" onClick={onBack}>
                Back
              </button>
            )}
            <button type="submit" className="button button--primary" disabled={!value}>
              {isLast ? 'See my risk' : 'Continue'}
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
