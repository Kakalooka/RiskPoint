/**
 * The curved plane.
 *
 * One disc whose centre sits on a viewport corner, so a quarter of it is visible and
 * its two straight edges are the edges of the screen. A compositional accent; the text
 * and interaction stay primary.
 *
 * Bottom-left on the three questions, where it steps up only very slightly; bottom-right
 * on the result, in the risk hue and noticeably larger. Its radius is measured from the
 * corner to the content, so the arc meets the content in the same place at any aspect
 * ratio.
 *
 * Corner, size and fill come from `data-phase` on the surrounding screen.
 * Presentation only: it sits behind all content and is never interactive.
 */
export function Plane() {
  return <span className="plane" aria-hidden="true" />;
}
