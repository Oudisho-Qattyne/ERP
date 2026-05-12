// src/components/ui/ResizableTable.tsx
'use client';

import React from 'react';
import { Tb } from './Tb';
import { Tc } from './Tc';
import { useColumnResize } from '../../../hooks/useColumnResize';

export interface ColumnDef<T = any> {
  key: string;
  label: string;
  width?: number;
  render?: (row: T) => React.ReactNode;
  align?: 'left' | 'center' | 'right';
}

interface ResizableTableProps<T> {
  columns: ColumnDef<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  rowKey?: keyof T;
}

export function ResizableTable<T extends Record<string, any>>({
  columns,
  data,
  onRowClick,
  rowKey = 'id',
}: ResizableTableProps<T>) {
  const initialWidths = columns.map(col => col.width || 150);
  const { columnWidths, startResize } = useColumnResize({ initialWidths, minWidth: 60 });

  return (
    <Tb>
      <thead>
        <tr className="border-b-2 border-border bg-[#f8faf8]">
          {columns.map((col, idx) => (
            <th
              key={col.key}
              className="py-2 px-2 text-[10px] font-bold text-muted whitespace-nowrap relative select-none"
              style={{ width: columnWidths[idx] }}
            >
              {col.label}
              {/* Resize handle */}
              <div
                className="absolute top-0 right-0 w-1.5 h-full cursor-col-resize z-10 hover:bg-gold/30 transition-colors"
                style={{ background: 'transparent' }}
                onMouseDown={(e) => {
                  e.preventDefault();
                  startResize(idx, e.clientX, columnWidths[idx]);
                }}
              />
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr
            key={row[rowKey]}
            onClick={() => onRowClick?.(row)}
            className="border-b border-border hover:bg-[#f8faf8] transition-colors"
            style={{ cursor: onRowClick ? 'pointer' : 'default' }}
          >
            {columns.map((col, idx) => (
              <Tc
                key={`${row[rowKey]}-${col.key}`}
                align={col.align || 'right'}
              >
                {col.render ? col.render(row) : row[col.key]}
              </Tc>
            ))}
          </tr>
        ))}
      </tbody>
    </Tb>
  );
}