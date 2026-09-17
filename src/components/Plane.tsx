/**
 * The curved plane.
 *
 * One oversized disc whose centre sits on a viewport corner, so a quarter of it is
 * visible and its two straight edges are the edges of the screen.
 *
 * It holds the same corner for all three questions and varies only by scale, a few
 * vmin of crop and one tonal step, so no question screen restates the composition.
 * The result makes the flow's only move: down the right edge, in the risk hue.
 *
 * Corner, size, crop and fill come from `data-phase` on the surrounding screen, so
 * the composition is a function of the step rather than of this element.
 * Presentation only: it sits behind all content and is never interactive.
 */
export function Plane() {
  return <span className="plane" aria-hidden="true" />;
}
