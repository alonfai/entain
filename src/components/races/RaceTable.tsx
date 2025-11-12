import { useState, useMemo } from "react";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CATEGORY_IDS, type CategoryName } from "@/constants";

// Extend the ColumnMeta type to include hidden property
declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    hidden?: boolean;
  }
}

export interface RaceTableProps<TData, TValue> {
  /**
   * Column definitions for the data table
   */
  columns: ColumnDef<TData, TValue>[];
  /**
   * Data array to populate the table
   */
  data: TData[];
  /**
   * Optional Initial category filter value (default: undefined to show all categories with no filters)
   */
  initialCategoryFilter?: CategoryName;
  /**
   * Optional Text to display when there is no data in the table (default "No Race results found.")
   */
  emptyDataText?: string;
  /**
   * Optional Sorting function to order the records
   */
  sort?: (a: TData, b: TData) => number;
  /**
   * Optional limit to the number of records to display in the table (default: No Limit)
   */
  limit?: number;
}

/**
 * A specialized data table component for displaying race data with category filtering.
 * ref: https://ui.shadcn.com/docs/components/data-table#basic-table
 */
export function RaceTable<TData, TValue>({
  columns,
  data,
  initialCategoryFilter,
  emptyDataText = "No Reace results found.",
  sort,
  limit,
}: RaceTableProps<TData, TValue>) {
  // setup state for selected category filter dropdown select (stores the UUID)
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | undefined>(initialCategoryFilter ? CATEGORY_IDS[initialCategoryFilter] : undefined);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    initialCategoryFilter
      ? [{ id: "category_id", value: CATEGORY_IDS[initialCategoryFilter] }]
      : []
  );

  // Apply sorting if provided
  const sortedData = useMemo(
    () => (sort ? [...data].sort(sort) : data),
    [data, sort]
  );

  // Setup react-table instance data
  const table = useReactTable({
    data: sortedData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnFiltersChange: setColumnFilters,
    state: {
      columnFilters,
      columnVisibility: {
        category_id: false,
      },
    },
  });

  const filteredRows = table.getFilteredRowModel().rows;

  return (
    <div className="space-y-4">
      <div
        className="flex items-center gap-3 px-4 py-3 rounded-lg shadow-sm border"
        style={{
          backgroundColor: "var(--custom-surface)",
          borderColor: "var(--custom-border)",
        }}
      >
        <label
          className="text-sm font-medium"
          style={{ color: "var(--custom-text-secondary)" }}
        >
          Filter by:
        </label>
        <Select
          onValueChange={(value) => {
            setSelectedCategoryId(value === "all" ? undefined : value);
            setColumnFilters(value === "all" ? [] : [{ id: "category_id", value }]);
          }}
          value={selectedCategoryId ?? "all"}
        >
          <SelectTrigger
            className="w-[200px] border-2 rounded-md shadow-sm transition-all hover:shadow-md focus:ring-2 focus:ring-offset-2"
            style={{
              borderColor: "var(--custom-border)",
              backgroundColor: "var(--custom-bg-primary)",
              color: "var(--custom-text-primary)",
            }}
          >
            <SelectValue placeholder="Filter by category" />
          </SelectTrigger>
          <SelectContent
            className="rounded-md shadow-lg border-2 z-50"
            style={{
              backgroundColor: "var(--custom-surface)",
              borderColor: "var(--custom-border)",
            }}
          >
            <SelectItem
              value={"all"}
              className="cursor-pointer transition-colors rounded-sm font-medium"
              style={{ color: "var(--custom-text-primary)" }}
            >
              All Categories
            </SelectItem>
            {Object.entries(CATEGORY_IDS).map(([name, id]) => (
              <SelectItem
                key={id}
                value={id}
                className="cursor-pointer transition-colors rounded-sm"
                style={{ color: "var(--custom-text-primary)" }}
              >
                {name.toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div
        className="overflow-hidden rounded-lg border-2 shadow-lg transition-shadow hover:shadow-xl"
        style={{ borderColor: "var(--custom-border)" }}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow
                key={headerGroup.id}
                className="border-b-2"
                style={{
                  backgroundColor: "var(--custom-bg-secondary)",
                  borderColor: "var(--custom-border)",
                }}
              >
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className="text-center font-bold text-sm tracking-wide py-4"
                      style={{ color: "var(--custom-text-secondary)" }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {filteredRows?.length ? (
              filteredRows
                .slice(0, limit)
                .map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="border-b transition-all duration-200"
                    style={{
                      backgroundColor:
                        index % 2 === 0
                          ? "var(--custom-surface)"
                          : "var(--custom-bg-primary)",
                      borderColor: "var(--custom-border)",
                    }}
                  >
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className="text-center py-4 px-6"
                          style={{ color: "var(--custom-text-primary)" }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                ))
            ) : (
              <TableRow style={{ backgroundColor: "var(--custom-surface)" }}>
                <TableCell
                  colSpan={columns.length}
                  className="h-32 text-center"
                  style={{ color: "var(--custom-text-muted)" }}
                >
                  <div className="flex flex-col items-center gap-2">
                    <span className="font-medium">{emptyDataText}</span>
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
