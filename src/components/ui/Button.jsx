import { forwardRef } from 'react';
import './Button.css';

const Button = forwardRef(function Button(
  {
    variant = 'primary',
    size = 'md',
    disabled = false,
    loading = false,
    children,
    type = 'button',
    onClick,
    className = '',
    icon: Icon,
    ...rest
  },
  ref
) {
  const classes = [
    'btn',
    `btn--${variant}`,
    `btn--${size}`,
    loading && 'btn--loading',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      ref={ref}
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      aria-busy={loading || undefined}
      {...rest}
    >
      {loading && <span className="btn__spinner" aria-hidden="true" />}
      {!loading && Icon && <Icon className="btn__icon" size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} />}
      {children && <span className="btn__label">{children}</span>}
    </button>
  );
});

export default Button;
