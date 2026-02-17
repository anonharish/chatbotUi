import { cn } from "@/lib/utils";

interface Column<T> {
  key: keyof T;
  label: string;
  render?: (value: T[keyof T], row: T) => React.ReactNode;
}

interface DataTableProps<T extends Record<string, unknown>> {
  data: T[];
  columns: Column<T>[];
  idKey: string;
  searchEnabled?: boolean;
  className?: string;
}

export function DataTable<T extends Record<string, unknown>>({
  data,
  columns,
  idKey,
  searchEnabled = false,
  className,
}: DataTableProps<T>) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        No data available
      </div>
    );
  }

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      {searchEnabled && (
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search..."
            className="w-full max-w-sm px-3 py-2 border border-input rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-4 py-3 text-left font-medium text-muted-foreground whitespace-nowrap"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={String(row[idKey]) || rowIndex}
              className="border-b border-border hover:bg-muted/30 transition-colors"
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-4 py-3 whitespace-nowrap"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : String(row[column.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
