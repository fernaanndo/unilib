import './LoadingSkeleton.css';

export default function LoadingSkeleton({
  type = 'text',
  width,
  height,
  count = 1,
  className = '',
}) {
  const items = Array.from({ length: count }, (_, i) => i);

  return items.map((i) => (
    <span
      key={i}
      className={`skeleton skeleton--${type} ${className}`}
      style={{ width, height }}
      aria-hidden="true"
    />
  ));
}
