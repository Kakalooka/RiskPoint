import { useEffect, useRef, useState, type FormEvent } from 'react';

/** Prototype-only lead capture. No network request is made. */
export function LeadPanel({ recapText }: { recapText: string }) {
  const [sent, setSent] = useState(false);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    firstFieldRef.current?.focus();
  }, []);

  useEffect(() => {
    if (sent) statusRef.current?.focus();
  }, [sent]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (event.currentTarget.reportValidity()) setSent(true);
  }

  if (sent) {
    return (
      <div className="lead lead--sent" id="lead-panel">
        <p className="lead__status" role="status" tabIndex={-1} ref={statusRef}>
          Prototype only — nothing was submitted.
        </p>
        <p className="lead__text">
          In this prototype, your details were not stored or sent anywhere.
        </p>
      </div>
    );
  }

  return (
    <form className="lead" id="lead-panel" onSubmit={handleSubmit}>
      <p className="lead__text">
        Your answers are already included: <span className="lead__recap">{recapText}</span>
      </p>
      <div className="field">
        <label className="field__label" htmlFor="lead-email">
          Work email
        </label>
        <input
          ref={firstFieldRef}
          className="field__input"
          id="lead-email"
          name="email"
          type="email"
          autoComplete="email"
          required
        />
      </div>
      <div className="field">
        <label className="field__label" htmlFor="lead-company">
          Company name
        </label>
        <input
          className="field__input"
          id="lead-company"
          name="company"
          type="text"
          autoComplete="organization"
          required
        />
      </div>
      <button type="submit" className="button button--secondary">
        Request protection options
      </button>
      <p className="lead__note">Prototype: nothing is sent when you submit this form.</p>
    </form>
  );
}
