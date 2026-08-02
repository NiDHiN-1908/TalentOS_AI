import React from 'react';

export interface Column<T> {
  header: string;
  accessor: keyof T | ((row: T) => React.ReactNode);
  width?: string;
  align?: 'left' | 'center' | 'right';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  emptyMessage?: string;
  onRowClick?: (row: T) => void;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No records found",
  onRowClick
}: DataTableProps<T>) {
  return (
    <div style={{ width: '100%', overflowX: 'auto' }}>
      <table className="table-container">
        <thead className="table-header">
          <tr>
            {columns.map((col, idx) => (
              <th 
                key={idx} 
                style={{ 
                  width: col.width, 
                  textAlign: col.align || 'left' 
                }}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td 
                colSpan={columns.length} 
                style={{ 
                  textAlign: 'center', 
                  padding: '32px 16px', 
                  color: 'var(--text-muted)' 
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr 
                key={keyExtractor(row)} 
                className="table-row"
                onClick={() => onRowClick && onRowClick(row)}
                style={{ cursor: onRowClick ? 'pointer' : 'default' }}
              >
                {columns.map((col, idx) => (
                  <td 
                    key={idx} 
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {typeof col.accessor === 'function'
                      ? col.accessor(row)
                      : (row[col.accessor] as unknown as React.ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
