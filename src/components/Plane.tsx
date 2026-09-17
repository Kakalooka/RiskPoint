/**
 * The curved plane.
 *
 * One oversized disc whose centre sits on a viewport corner, so a quarter of it is
 * visible and its two straight edges are the edges of the screen.
 *
 * It holds the same corner — bottom-left — for all three questions and varies only by
 * one small step of scale and tone, so no question screen restates the composition.
 * The result resolves it in the bottom-right, carrying the risk hue: the only change of
 * position in the flow. It is larger there because a tint on the light ground reads far
 * softer than a dark tonal plane of the same size.
 *
 * Corner, size and fill come from `data-phase` on the surrounding screen, so
 * the composition is a function of the step rather than of this element.
 * Presentation only: it sits behind all content and is never interactive.
 */
export function Plane() {
  return <span className="plane" aria-hidden="true" />;
}
