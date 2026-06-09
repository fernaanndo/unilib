import { useId } from 'react';
import { ChevronDown } from 'lucide-react';
import './Select.css';

export default function Select({
  label,
  value,
  onChange,
  options = [],
  error,
  helperText,
  disabled = false,
  required = false,
  placeholder,
  className = '',
  ...rest
}) {
  const autoId = useId();
  const selectId = rest.id || autoId;
  const errorId = error ? `${selectId}-error` : undefined;
  const helperId = helperText && !error ? `${selectId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`select-field ${error ? 'select-field--error' : ''} ${disabled ? 'select-field--disabled' : ''} ${className}`}>
      {label && (
        <label className="select-field__label" htmlFor={selectId}>
          {label}
          {required && <span className="select-field__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="select-field__wrapper">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="select-field__select"
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="select-field__chevron" size={18} aria-hidden="true" />
      </div>

      {error && (
        <p className="select-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="select-field__helper" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
}
