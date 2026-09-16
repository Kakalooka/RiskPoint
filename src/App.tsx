import { useEffect, useRef, useState } from 'react';
import { Assessment, type Draft } from './components/Assessment';
import { Result } from './components/Result';
import { QUESTIONS } from './content';
import type { Answers } from './model/config';

type Screen = 'assessment' | 'leaving' | 'result';

/** Presentation only: how long assessment content takes to exit. The result is not computed later. */
const EXIT_MS = 220;

function isComplete(draft: Draft): draft is Answers {
  return Boolean(draft.industry && draft.revenue && draft.mfa);
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function App() {
  const [draft, setDraft] = useState<Draft>({});
  const [step, setStep] = useState(0);
  const [screen, setScreen] = useState<Screen>('assessment');
  const hasNavigated = useRef(false);

  // The theme starts changing as the assessment exits, so there is no empty mid-transition frame.
  const theme = screen === 'assessment' ? 'dark' : 'light';

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f5f4f0' : '#0f1012');
  }, [theme]);

  useEffect(() => {
    if (screen !== 'leaving') return;
    const timer = window.setTimeout(() => setScreen('result'), prefersReducedMotion() ? 0 : EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [screen]);

  function goTo(nextStep: number) {
    hasNavigated.current = true;
    setStep(nextStep);
    window.scrollTo(0, 0);
  }

  function handleNext() {
    if (step < QUESTIONS.length - 1) goTo(step + 1);
    else if (isComplete(draft)) setScreen('leaving');
  }

  function handleEdit() {
    hasNavigated.current = true;
    setStep(0);
    setScreen('assessment');
    window.scrollTo(0, 0);
  }

  return (
    <div className="app">
      <header className="brand page-width">
        <span className="brand__name">RiskPoint</span>
      </header>

      {screen === 'result' && isComplete(draft) ? (
        <Result answers={draft} onEdit={handleEdit} />
      ) : (
        <Assessment
          step={step}
          draft={draft}
          leaving={screen === 'leaving'}
          focusOnMount={hasNavigated.current}
          onAnswer={setDraft}
          onBack={() => goTo(step - 1)}
          onNext={handleNext}
        />
      )}
    </div>
  );
}
