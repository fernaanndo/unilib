import { TrendingUp, TrendingDown } from 'lucide-react';
import './StatCard.css';

export default function StatCard({
  icon: Icon,
  label,
  value,
  trend,
  className = '',
}) {
  return (
    <div className={`stat-card ${className}`}>
      {Icon && (
        <div className="stat-card__icon-wrap">
          <Icon size={22} />
        </div>
      )}

      <div className="stat-card__content">
        <span className="stat-card__value">{value}</span>
        <span className="stat-card__label">{label}</span>
      </div>

      {trend && (
        <div
          className={`stat-card__trend ${
            trend.isPositive ? 'stat-card__trend--up' : 'stat-card__trend--down'
          }`}
        >
          {trend.isPositive ? (
            <TrendingUp size={14} />
          ) : (
            <TrendingDown size={14} />
          )}
          <span className="stat-card__trend-value">
            {trend.value > 0 ? '+' : ''}
            {trend.value}%
          </span>
        </div>
      )}
    </div>
  );
}
