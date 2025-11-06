import { useState, useMemo } from 'react';

type SortDirection = 'asc' | 'desc' | null;

interface UseSortingReturn<T> {
  sortedData: T[];
  sortColumn: string | null;
  sortDirection: SortDirection;
  handleSort: (column: string) => void;
}

export function useSorting<T>(
  data: T[],
  defaultSortKey?: string,
  defaultDirection: SortDirection = 'desc'
): UseSortingReturn<T> {
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortKey || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultDirection);

  const handleSort = (column: string) => {
    if (sortColumn === column) {
      // Toggle: desc -> asc -> null -> desc
      if (sortDirection === 'desc') {
        setSortDirection('asc');
      } else if (sortDirection === 'asc') {
        setSortDirection(null);
        setSortColumn(null);
      }
    } else {
      setSortColumn(column);
      setSortDirection('desc');
    }
  };

  const sortedData = useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return data;
    }

    return [...data].sort((a, b) => {
      const aValue = a[sortColumn as keyof T];
      const bValue = b[sortColumn as keyof T];

      // Handle dates
      if (sortColumn.includes('data') || sortColumn.includes('Data') || sortColumn.includes('Entrada') || sortColumn.includes('Em')) {
        const aDate = new Date(aValue as string).getTime();
        const bDate = new Date(bValue as string).getTime();
        return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
      }

      // Handle numbers
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }

      // Handle strings
      const aString = String(aValue || '').toLowerCase();
      const bString = String(bValue || '').toLowerCase();
      
      if (sortDirection === 'asc') {
        return aString.localeCompare(bString);
      } else {
        return bString.localeCompare(aString);
      }
    });
  }, [data, sortColumn, sortDirection]);

  return { sortedData, sortColumn, sortDirection, handleSort };
}
