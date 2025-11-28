import React from 'react';
import { Button, Loader } from '../';

export function DataTable({ 
  columns, 
  data, 
  loading, 
  emptyMessage = 'No data available',
  onRowClick,
}) {
  if (loading) {
    return (
      <div className="py-12">
        <Loader />
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg shadow border border-gray-200 max-h-[500px] overflow-y-auto">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 border-b sticky top-0">
          <tr>
            {columns.map((col, idx) => (
              <th
                key={idx}
                className="text-left py-3 px-4 text-sm font-semibold text-gray-600"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-gray-50 transition-colors cursor-pointer"
                onClick={() => onRowClick?.(row)}
              >
                {columns.map((col, colIdx) => (
                  <td key={colIdx} className="py-3 px-4 text-sm text-gray-700">
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-4 text-gray-500 text-sm"
              >
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}