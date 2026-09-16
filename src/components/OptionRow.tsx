interface OptionRowProps {
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onSelect: (value: string) => void;
}

export function OptionRow({ name, value, label, checked, onSelect }: OptionRowProps) {
  return (
    <label className="option">
      <input
        className="option__input"
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={() => onSelect(value)}
      />
      <span className="option__radio" aria-hidden="true" />
      <span className="option__label">{label}</span>
    </label>
  );
}
