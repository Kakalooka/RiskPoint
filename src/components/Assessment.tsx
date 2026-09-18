import { useEffect, useRef, type FormEvent } from 'react';
import { QUESTIONS } from '../content';
import type { Answers } from '../model/config';
import { Plane } from './Plane';
import { Progress } from './Progress';
import { Selector } from './Selector';

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
    // data-phase sets the plane's size and tone for the current question.
    <form
      className="assessment"
      data-theme="dark"
      data-phase={step}
      data-leaving={leaving}
      onSubmit={handleSubmit}
      noValidate
    >
      {/* Not keyed: the plane stays mounted across questions, so between steps it only
          changes size instead of fading out and back in. */}
      <Plane />

      <div className="stage" key={step}>
        <h1
          id="question-title"
          ref={titleRef}
          tabIndex={-1}
          className="question-title"
          data-long={question.title.length > 40}
        >
          {question.title}
        </h1>

        <Selector
          placeholder={question.placeholder}
          options={question.options}
          value={value}
          labelledBy="question-title"
          onChange={(id) => onAnswer({ ...draft, [question.key]: id })}
        />

        <div className="stage__action">
          <button type="submit" className="button button--primary" disabled={!value}>
            {isLast ? 'See my risk' : 'Continue'}
          </button>
        </div>
      </div>

      <footer className="assessment__footer">
        {step > 0 && (
          <button type="button" className="text-button assessment__back" onClick={onBack}>
            Back
          </button>
        )}
        <Progress step={step} total={QUESTIONS.length} />
      </footer>
    </form>
  );
}
