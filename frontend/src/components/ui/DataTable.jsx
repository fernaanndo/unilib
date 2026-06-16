import { useState, useCallback } from 'react';
import { ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import LoadingSkeleton from './LoadingSkeleton';
import EmptyState from './EmptyState';
import './DataTable.css';

export default function DataTable({
  columns = [],
  data = [],
  loading = false,
  emptyMessage = 'No se encontraron resultados.',
  emptyIcon,
  onRowClick,
  keyExtractor,
  className = '',
}) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  const handleSort = useCallback((columnKey) => {
    setSortConfig((prev) => {
      if (prev.key === columnKey) {
        return { key: columnKey, direction: prev.direction === 'asc' ? 'desc' : 'asc' };
      }
      return { key: columnKey, direction: 'asc' };
    });
  }, []);

  const sortedData = (() => {
    if (!sortConfig.key) return data;
    const column = columns.find((c) => c.key === sortConfig.key);
    if (!column || !column.sortable) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;

      let comparison = 0;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal;
      } else {
        comparison = String(aVal).localeCompare(String(bVal), 'es', { sensitivity: 'base' });
      }

      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  })();

  const getRowKey = (row, index) => {
    if (keyExtractor) return keyExtractor(row);
    return row.id ?? index;
  };

  const renderSortIcon = (column) => {
    if (!column.sortable) return null;
    if (sortConfig.key !== column.key) {
      return <ArrowUpDown size={14} className="data-table__sort-icon data-table__sort-icon--inactive" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowUp size={14} className="data-table__sort-icon" />
    ) : (
      <ArrowDown size={14} className="data-table__sort-icon" />
    );
  };

  if (loading) {
    return (
      <div className={`data-table-wrapper ${className}`}>
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="data-table__th" style={{ width: col.width }}>
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="data-table__body">
            {Array.from({ length: 5 }, (_, i) => (
              <tr key={i} className="data-table__row">
                {columns.map((col) => (
                  <td key={col.key} className="data-table__td">
                    <LoadingSkeleton variant="text" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className={`data-table-wrapper ${className}`}>
        <EmptyState message={emptyMessage} icon={emptyIcon} />
      </div>
    );
  }

  return (
    <div className={`data-table-wrapper ${className}`}>
      <div className="data-table-scroll">
        <table className="data-table">
          <thead className="data-table__head">
            <tr>
              {columns.map((col) => (
                <th
                  key={col.key}
                  scope="col"
                  className={`data-table__th ${col.sortable ? 'data-table__th--sortable' : ''}`}
                  style={{ width: col.width }}
                  onClick={col.sortable ? () => handleSort(col.key) : undefined}
                  aria-sort={
                    sortConfig.key === col.key
                      ? sortConfig.direction === 'asc'
                        ? 'ascending'
                        : 'descending'
                      : undefined
                  }
                >
                  <span className="data-table__th-content">
                    {col.label}
                    {renderSortIcon(col)}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="data-table__body">
            {sortedData.map((row, index) => (
              <tr
                key={getRowKey(row, index)}
                className={`data-table__row ${onRowClick ? 'data-table__row--clickable' : ''}`}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key} className="data-table__td">
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
