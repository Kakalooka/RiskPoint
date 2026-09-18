/**
 * The curved plane.
 *
 * One disc whose centre sits on a viewport corner, so a quarter of it is visible and
 * its two straight edges are the edges of the screen. A compositional accent, kept out
 * of the reading area.
 *
 * Bottom-left on the three questions, where only its size and tone step up slightly;
 * bottom-right on the result, in the risk hue, sized from the level word so it keeps
 * the same proportion to the content at any viewport.
 *
 * Corner, size and fill come from `data-phase` on the surrounding screen.
 * Presentation only: it sits behind all content and is never interactive.
 */
export function Plane() {
  return <span className="plane" aria-hidden="true" />;
}
