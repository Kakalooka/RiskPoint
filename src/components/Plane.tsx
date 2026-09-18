/**
 * The curved plane: the result's reveal.
 *
 * One disc whose centre sits on the bottom-right corner, so a quarter of it is visible
 * and its two straight edges are the edges of the screen, in the risk hue. It appears
 * only on the result; the questions stay empty so the answer arrives as the first
 * visual event of the flow. Its radius is measured from the corner to the content, so
 * the arc meets the content in the same place at any aspect ratio.
 *
 * Presentation only: it sits behind all content and is never interactive.
 */
export function Plane() {
  return <span className="plane" aria-hidden="true" />;
}
