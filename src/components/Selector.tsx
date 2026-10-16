import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';

export interface SelectorOption {
  id: string;
  label: string;
}

interface SelectorProps {
  placeholder: string;
  options: readonly SelectorOption[];
  value: string | undefined;
  labelledBy: string;
  onChange: (id: string) => void;
}

/**
 * Typographic listbox: a single line of text that opens its options in place.
 * Keyboard: Enter/Space/Arrows open, Arrows/Home/End move, Enter/Space select,
 * Escape closes, plain characters jump to a matching option.
 */
export function Selector({ placeholder, options, value, labelledBy, onChange }: SelectorProps) {
  const listId = useId();
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLLIElement | null)[]>([]);
  const typed = useRef({ text: '', at: 0 });
  const restoreFocus = useRef(false);

  const selectedIndex = options.findIndex((option) => option.id === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : undefined;

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.focus();
  }, [open, activeIndex]);

  // The trigger is hidden while the list is open, so focus can only return after the re-render.
  useEffect(() => {
    if (!open && restoreFocus.current) {
      restoreFocus.current = false;
      triggerRef.current?.focus();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [open]);

  function openList() {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }

  function closeList() {
    restoreFocus.current = true;
    setOpen(false);
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
        setOpen(false);
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
        <ul className="selector__list" id={listId} role="listbox" aria-labelledby={labelledBy} onKeyDown={handleListKeyDown}>
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
