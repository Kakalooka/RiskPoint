/**
 * The quarter-turn motif.
 *
 * One oversized disc whose centre sits exactly on a viewport corner, so a quarter
 * of it is visible and its two straight edges are the edges of the screen. Every
 * screen shows the same form: the corner turns one quarter clockwise per step and
 * the form grows and gains tone, then resolves into the risk hue on the result.
 *
 * Corner, size and fill come from `data-phase` on the surrounding screen, so the
 * composition is a function of the step rather than of this element. Presentation
 * only: it sits behind all content and is never interactive.
 */
export function Plane() {
  return <span className="plane" aria-hidden="true" />;
}
