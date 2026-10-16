import type { Answers } from '../model/config';

/** Answers collected so far; a question is missing until it has been answered. */
export type Draft = Partial<Answers>;

/**
 * Returns a copy of the draft with one answer set. The id must belong to the
 * answered question, so an unknown or mismatched id does not type-check.
 */
export function withAnswer<K extends keyof Answers>(draft: Draft, key: K, id: Answers[K]): Draft {
  const next: Draft = { ...draft };
  next[key] = id;
  return next;
}
