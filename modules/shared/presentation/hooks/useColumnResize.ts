// src/hooks/useColumnResize.ts
import { useState, useRef, useCallback, useEffect } from 'react';

interface UseColumnResizeOptions {
  initialWidths?: number[];
  minWidth?: number;
}

export function useColumnResize({ initialWidths = [], minWidth = 60 }: UseColumnResizeOptions = {}) {
  const [columnWidths, setColumnWidths] = useState<number[]>(initialWidths);
  const resizingRef = useRef({
    active: false,
    columnIndex: -1,
    startX: 0,
    startWidth: 0,
  });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!resizingRef.current.active) return;
    const { columnIndex, startX, startWidth } = resizingRef.current;
    const delta = e.clientX - startX;
    const newWidth = Math.max(minWidth, startWidth + delta);
    setColumnWidths(prev => {
      const updated = [...prev];
      updated[columnIndex] = newWidth;
      return updated;
    });
  }, [minWidth]);

  const handleMouseUp = useCallback(() => {
    resizingRef.current.active = false;
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseMove]);

  const startResize = (columnIndex: number, startX: number, startWidth: number) => {
    resizingRef.current = {
      active: true,
      columnIndex,
      startX,
      startWidth,
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [handleMouseMove, handleMouseUp]);

  return {
    columnWidths,
    setColumnWidths,
    startResize,
  };
}