import { useId } from 'react';
import './Input.css';

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  helperText,
  icon: Icon,
  disabled = false,
  required = false,
  id: externalId,
  name,
  className = '',
  ...rest
}) {
  const autoId = useId();
  const inputId = externalId || autoId;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperId = helperText && !error ? `${inputId}-helper` : undefined;
  const describedBy = [errorId, helperId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`input-field ${error ? 'input-field--error' : ''} ${disabled ? 'input-field--disabled' : ''} ${className}`}>
      {label && (
        <label className="input-field__label" htmlFor={inputId}>
          {label}
          {required && <span className="input-field__required" aria-hidden="true">*</span>}
        </label>
      )}

      <div className="input-field__wrapper">
        {Icon && (
          <span className="input-field__icon" aria-hidden="true">
            <Icon size={18} />
          </span>
        )}
        <input
          id={inputId}
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`input-field__input ${Icon ? 'input-field__input--with-icon' : ''}`}
          aria-required={required || undefined}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      </div>

      {error && (
        <p className="input-field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
      {helperText && !error && (
        <p className="input-field__helper" id={helperId}>
          {helperText}
        </p>
      )}
    </div>
  );
}
