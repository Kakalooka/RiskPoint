import { useLayoutEffect, useRef } from 'react';

/**
 * The curved plane: the result's reveal. Always a true circle.
 *
 * The 9:16 composition is the reference, measured at 566×915. There the circle is centred
 * on the bottom-right corner: 283px right of and 293px below the CTA's centre, radius 361px.
 * Its arc crosses the CTA's centre line at a point P, passing behind the right part of the
 * CTA and the end of the links row.
 *
 * Every viewport uses that same circle, scaled uniformly about P. Each scaled circle passes
 * through P at the same angle, so the CTA overlap is identical everywhere, and the links and
 * range move only a few pixels. The scale is the smallest that keeps the circle cropped by
 * the right edge (by at least CROP of its radius) and its centre at or below the viewport
 * bottom, as in the reference. Phones, portrait tablets and the reference itself need no
 * scaling (s = 1).
 *
 * The CTA is measured from layout offsets, so the reveal transforms do not move it. It is
 * re-measured whenever the result's size or content changes (resize, the lead form, the
 * method disclosure, font loading).
 *
 * Presentation only: it sits behind all content and is never interactive.
 */

/** Reference circle, relative to the CTA's centre, in px. */
const REF_DX = 283;
const REF_DY = 293;
const REF_R = 361;
/** Minimum part of the radius that stays beyond the right edge on wide screens. */
const CROP = 0.15;

/** Where the reference arc crosses the CTA's centre line, and the vector from there to its centre. */
const P_X = REF_DX - Math.sqrt(REF_R ** 2 - REF_DY ** 2);
const V_X = REF_DX - P_X;
const V_Y = REF_DY;

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
      let ctaX = anchor.offsetWidth / 2;
      let ctaY = anchor.offsetHeight / 2;
      for (let el: HTMLElement | null = anchor; el && el !== container; el = el.offsetParent as HTMLElement | null) {
        ctaX += el.offsetLeft;
        ctaY += el.offsetTop;
      }

      // Distances from the CTA's centre to the right edge and to the viewport bottom.
      const toRight = container.clientWidth - ctaX;
      const containerTop = container.getBoundingClientRect().top + window.scrollY;
      const toBottom = window.innerHeight - containerTop - ctaY;

      const scale = Math.max(
        1,
        (toRight - P_X) / (V_X + REF_R * (1 - CROP)),
        toBottom / V_Y,
      );

      plane.style.setProperty('--plane-cx', `${ctaX + P_X + scale * V_X}px`);
      plane.style.setProperty('--plane-cy', `${ctaY + scale * V_Y}px`);
      plane.style.setProperty('--plane-r', `${REF_R * scale}px`);
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
