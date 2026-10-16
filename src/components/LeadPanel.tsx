import { useEffect, useRef, useState, type FormEvent } from 'react';

/** Prototype-only lead capture. No network request is made. */
export function LeadPanel() {
  const [sent, setSent] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const firstFieldRef = useRef<HTMLInputElement>(null);
  const statusRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    // Keep the whole form visible on short screens instead of only the focused field.
    formRef.current?.scrollIntoView({ block: 'nearest' });
    firstFieldRef.current?.focus({ preventScroll: true });
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
      <p className="lead__status" id="lead-panel" role="status" tabIndex={-1} ref={statusRef}>
        Prototype — nothing was submitted.
      </p>
    );
  }

  return (
    <form className="lead" id="lead-panel" ref={formRef} onSubmit={handleSubmit}>
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
      <button type="submit" className="button button--quiet">
        Send
      </button>
      <p className="lead__note">Prototype: nothing is sent.</p>
    </form>
  );
}
