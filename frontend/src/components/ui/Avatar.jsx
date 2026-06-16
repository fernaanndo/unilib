import './Avatar.css';

const PALETTE = [
  '#1B4332', '#2D6A4F', '#40916C', '#457B9D',
  '#D4A373', '#BC8A5F', '#E63946', '#264653',
  '#6C6C80', '#1A1A2E',
];

function hashName(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export default function Avatar({
  nombre = '',
  apellido = '',
  size = 'md',
  src,
}) {
  const initial = (nombre.charAt(0) || '').toUpperCase();
  const fullName = `${nombre} ${apellido}`.trim();
  const bgColor = PALETTE[hashName(fullName) % PALETTE.length];

  return (
    <span
      className={`avatar avatar--${size}`}
      role="img"
      aria-label={fullName || 'Avatar'}
      title={fullName}
    >
      {src ? (
        <img
          className="avatar__img"
          src={src}
          alt={fullName}
          loading="lazy"
        />
      ) : (
        <span className="avatar__initial" style={{ backgroundColor: bgColor }}>
          {initial}
        </span>
      )}
    </span>
  );
}
