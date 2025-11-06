import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

interface SortableTableHeaderProps {
  label: string;
  column: string;
  sortColumn: string | null;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (column: string) => void;
  align?: 'left' | 'right' | 'center';
}

export function SortableTableHeader({
  label,
  column,
  sortColumn,
  sortDirection,
  onSort,
  align = 'left',
}: SortableTableHeaderProps) {
  const isActive = sortColumn === column;
  const alignClass = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

  return (
    <th
      className="p-4 cursor-pointer hover:bg-muted/70 transition-colors select-none group"
      onClick={() => onSort(column)}
    >
      <div className={`flex items-center gap-2 ${alignClass}`}>
        <span className={`text-sm font-semibold ${isActive ? 'text-primary font-bold' : ''}`}>
          {label}
        </span>
        {isActive ? (
          sortDirection === 'asc' ? (
            <ArrowUp className="w-4 h-4 text-primary" />
          ) : (
            <ArrowDown className="w-4 h-4 text-primary" />
          )
        ) : (
          <ArrowUpDown className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
        )}
      </div>
    </th>
  );
}
