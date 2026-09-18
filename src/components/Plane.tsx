import { useLayoutEffect, useRef } from 'react';

/**
 * The curved plane: the result's reveal.
 *
 * The 9:16 composition is the reference: there the plane is a quarter disc centred on
 * the bottom-right corner, its arc passing behind the right part of the CTA and the end
 * of the links row. To keep that relationship at every width, the reference circle is
 * pinned to the CTA rather than to the screen corner (radius and offsets in app.css).
 * The plane fills everything right of and below the arc, so it always runs to the
 * right and bottom edges; at the reference size that is exactly the quarter disc.
 *
 * The anchor is measured from layout offsets, so the reveal transforms do not move it,
 * and re-measured whenever the result's size or content changes (resize, the lead form,
 * the method disclosure, font loading).
 *
 * Presentation only: it sits behind all content and is never interactive.
 */
export function Plane() {
  const planeRef = useRef<HTMLSpanElement>(null);

  useLayoutEffect(() => {
    const plane = planeRef.current;
    const container = plane?.parentElement;
    const anchor = container?.querySelector<HTMLElement>('[data-plane-anchor]');
    if (!plane || !container || !anchor) return;

    let active = true;
    const place = () => {
      if (!active) return;
      let x = anchor.offsetWidth / 2;
      let y = anchor.offsetHeight / 2;
      for (let el: HTMLElement | null = anchor; el && el !== container; el = el.offsetParent as HTMLElement | null) {
        x += el.offsetLeft;
        y += el.offsetTop;
      }
      plane.style.setProperty('--anchor-x', `${x}px`);
      plane.style.setProperty('--anchor-y', `${y}px`);
      plane.dataset.placed = '';
    };

    place();
    const resize = new ResizeObserver(place);
    resize.observe(container);
    const mutation = new MutationObserver(place);
    mutation.observe(container, { childList: true, subtree: true });
    document.fonts?.ready.then(place);

    return () => {
      active = false;
      resize.disconnect();
      mutation.disconnect();
    };
  }, []);

  return <span ref={planeRef} className="plane" aria-hidden="true" />;
}
