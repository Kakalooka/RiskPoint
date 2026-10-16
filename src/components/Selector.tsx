import { useEffect, useId, useLayoutEffect, useRef, useState, type KeyboardEvent, type RefObject } from 'react';

export interface SelectorOption<Id extends string = string> {
  id: Id;
  label: string;
}

interface SelectorProps<Id extends string> {
  placeholder: string;
  options: readonly SelectorOption<Id>[];
  value: Id | undefined;
  labelledBy: string;
  onChange: (id: Id) => void;
  onOpenChange: (open: boolean) => void;
  /** Element the open list must stay above (the assessment footer). */
  boundaryRef?: RefObject<HTMLElement | null>;
}

/** Where focus goes after the list closes. */
type FocusAfterClose = 'trigger' | 'next' | 'previous' | null;

/** Space kept between the open list and the boundary below it. */
const LIST_GAP = 8;
/** The list never shrinks below roughly two options, even on very short screens. */
const LIST_MIN = 96;

/**
 * Typographic listbox: a single line of text that opens its options in place.
 * Keyboard: Enter/Space/Arrows open, Arrows/Home/End move, Enter/Space select,
 * Escape closes to the trigger; plain characters jump to a matching option.
 * Tab / Shift+Tab close the list without changing the answer and move focus to the
 * next / previous control, as if the list were not open.
 */
export function Selector<Id extends string>({
  placeholder,
  options,
  value,
  labelledBy,
  onChange,
  onOpenChange,
  boundaryRef,
}: SelectorProps<Id>) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const typed = useRef({ text: '', at: 0 });
  const focusAfterClose = useRef<FocusAfterClose>(null);

  const selectedIndex = options.findIndex((option) => option.id === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  // Short viewports: keep the open list above the footer and mark the edges where it scrolls.
  useLayoutEffect(() => {
    if (!open) return;
    const fit = () => {
      const list = listRef.current;
      if (!list) return;
      const limit = Math.min(boundaryRef?.current?.getBoundingClientRect().top ?? Infinity, window.innerHeight);
      const free = limit - list.getBoundingClientRect().top - LIST_GAP;
      // Same caps as the stylesheet: min(52vh, 420px).
      let space = Math.max(LIST_MIN, Math.min(free, window.innerHeight * 0.52, 420));
      const optionHeight = list.firstElementChild?.getBoundingClientRect().height ?? 0;
      if (optionHeight > 0 && list.scrollHeight > space) {
        // End halfway through an option, so a partly visible, faded option shows there is more.
        space = Math.max(optionHeight * 1.5, (Math.floor(space / optionHeight - 0.5) + 0.5) * optionHeight);
      }
      list.style.setProperty('--list-space', `${Math.floor(space)}px`);
      markScrollEdges(list);
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [open, boundaryRef]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // The trigger is hidden while the list is open, so focus can only return after the re-render.
  useEffect(() => {
    const target = focusAfterClose.current;
    const trigger = triggerRef.current;
    if (open || !target || !trigger) return;
    focusAfterClose.current = null;
    // Neighbours are looked up now, once the hidden controls are no longer inert.
    const neighbour = target === 'trigger' ? null : tabbableNeighbour(trigger, target === 'next' ? 1 : -1);
    (neighbour ?? trigger).focus();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeList(null);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  function openList() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
    onOpenChange(true);
  }

  function closeList(focusAfter: FocusAfterClose = 'trigger') {
    focusAfterClose.current = focusAfter;
    setOpen(false);
    onOpenChange(false);
  }

  function select(index: number) {
    onChange(options[index].id);
    closeList();
  }

  function handleTriggerKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      openList();
    }
  }

  function jumpToTyped(key: string) {
    const now = Date.now();
    typed.current.text = now - typed.current.at > 700 ? key : typed.current.text + key;
    typed.current.at = now;
    const match = options.findIndex((option) => option.label.toLowerCase().startsWith(typed.current.text.toLowerCase()));
    if (match >= 0) setActiveIndex(match);
  }

  function handleListKeyDown(event: KeyboardEvent<HTMLUListElement>) {
    const last = options.length - 1;
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex((index) => (index === last ? 0 : index + 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex((index) => (index === 0 ? last : index - 1));
        break;
      case 'Home':
        event.preventDefault();
        setActiveIndex(0);
        break;
      case 'End':
        event.preventDefault();
        setActiveIndex(last);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        select(activeIndex);
        break;
      case 'Escape':
        event.preventDefault();
        closeList();
        break;
      case 'Tab':
        // Leave the list in the Tab direction without selecting the active option.
        event.preventDefault();
        closeList(event.shiftKey ? 'previous' : 'next');
        break;
      default:
        if (event.key.length === 1 && event.key.trim()) jumpToTyped(event.key);
    }
  }

  return (
    <div className="selector" data-open={open} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className="selector__trigger"
        data-chosen={Boolean(selected)}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={open ? listId : undefined}
        aria-labelledby={`${labelledBy} ${listId}-value`}
        onClick={openList}
        onKeyDown={handleTriggerKeyDown}
      >
        <span id={`${listId}-value`} className="selector__value">
          {selected ? selected.label : placeholder}
        </span>
        <svg className="selector__chevron" viewBox="0 0 16 16" aria-hidden="true" focusable="false">
          <path d="M3 6l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      </button>

      {open && (
        <ul
          ref={listRef}
          className="selector__list"
          id={listId}
          role="listbox"
          aria-labelledby={labelledBy}
          onKeyDown={handleListKeyDown}
          onScroll={(event) => markScrollEdges(event.currentTarget)}
        >
          {options.map((option, index) => (
            <li
              key={option.id}
              ref={(element) => {
                optionRefs.current[index] = element;
              }}
              className="selector__option"
              role="option"
              tabIndex={-1}
              aria-selected={option.id === value}
              data-active={index === activeIndex}
              onClick={() => select(index)}
              onMouseEnter={() => setActiveIndex(index)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/** Flags the edges with more options beyond them; CSS fades only those edges. */
function markScrollEdges(list: HTMLElement) {
  const overflows = list.scrollHeight - list.clientHeight > 1;
  list.dataset.moreAbove = String(overflows && list.scrollTop > 1);
  list.dataset.moreBelow = String(overflows && list.scrollTop + list.clientHeight < list.scrollHeight - 1);
}

const TABBABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

/** The next or previous control in tab order that is enabled, visible and not inert. */
function tabbableNeighbour(from: HTMLElement, step: 1 | -1): HTMLElement | null {
  const tabbable = Array.from(from.ownerDocument.querySelectorAll<HTMLElement>(TABBABLE)).filter(
    (el) =>
      el === from ||
      (!el.closest('[inert]') && el.getClientRects().length > 0 && getComputedStyle(el).visibility !== 'hidden'),
  );
  const index = tabbable.indexOf(from);
  return index === -1 ? null : (tabbable[index + step] ?? null);
}
