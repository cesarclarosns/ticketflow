'use client';

import {
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type RowSelectionState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from '@tanstack/react-table';
import * as React from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  useGetTicketsQuery,
  type UseGetTicketsQueryParams,
} from '@/hooks/tickets/use-get-tickets-query';
import { useDebounce } from '@/hooks/use-debounce';

import { columns } from './columns';
import { DataTablePagination } from './data-table-pagination';
import { DataTableToolbar } from './data-table-toolbar';

export const DEFAULT_PAGE_INDEX = 0;
export const DEFAULT_PAGE_SIZE = 10;

interface DataTableProps<TData, TValue> {
  floatingBar: boolean;
}

export function DataTable<TData, TValue>({
  floatingBar = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const debouncedSorting = useDebounce(sorting);

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const debouncedColumnFilters = useDebounce(columnFilters);

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  });
  const debouncedPagination = useDebounce(pagination);

  // Handle server-side pagination
  const getPageCount = (totalCount: number) => {
    return Math.ceil(totalCount / pagination.pageSize);
  };

  const getSkip = () => {
    return debouncedPagination.pageIndex * debouncedPagination.pageSize;
  };

  const getLimit = () => {
    return debouncedPagination.pageSize;
  };

  // Handle server-side sorting
  const getSort = (): UseGetTicketsQueryParams['sort'] => {
    console.log('getSort', { debouncedSorting });
    if (debouncedSorting.length) {
      const debounced = debouncedSorting.at(0)!;

      if (debounced.id === 'dueDate') {
        return debounced.desc ? 'dueDate' : '-dueDate';
      }
      if (debounced.id === 'title') {
        return debounced.desc ? 'title' : '-title';
      }
    }

    return;
  };

  // Handle server-side filtering
  const getFilter = (): Pick<
    UseGetTicketsQueryParams,
    'ticketCategories' | 'statuses' | 'query'
  > => {
    if (debouncedColumnFilters.length) {
      const params: Pick<
        UseGetTicketsQueryParams,
        'ticketCategories' | 'statuses' | 'query'
      > = {};

      for (const columnFilter of debouncedColumnFilters) {
        if (
          columnFilter.id === 'title' &&
          typeof columnFilter.value === 'string'
        ) {
          params['query'] = columnFilter.value;
        }

        if (columnFilter.id === 'status') {
          if (!params['statuses'])
            params['statuses'] = columnFilter.value as string[];
        }

        if (columnFilter.id === 'ticketCategory') {
          if (!params['ticketCategories'])
            params['ticketCategories'] = columnFilter.value as string[];
        }
      }

      return params;
    }

    return {};
  };

  // Handle row selection
  const deleteRowsAction = async () => {
    await Promise.all([]);
  };

  // Fetch dada
  const { isLoading, isError, data } = useGetTicketsQuery({
    limit: getLimit(),
    skip: getSkip(),
    sort: getSort(),
    ...getFilter(),
  });

  const table = useReactTable({
    columns,
    data: data?.results ?? [],
    enableRowSelection: true,
    getCoreRowModel: getCoreRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: true,
    manualPagination: true,
    manualSorting: true,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    pageCount: data?.totalCount?.count
      ? getPageCount(data.totalCount.count)
      : -1,
    state: {
      columnFilters,
      columnVisibility,
      pagination,
      rowSelection,
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <div className="relative max-h-[60vh] overflow-auto rounded-md border">
        <Table>
          <TableHeader className="sticky top-0 z-10 bg-secondary">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
      {/* {floatingBar ? (
        <DataTableFloatingBar
          table={table}
          deleteRowsAction={deleteRowsAction}
        />
      ) : null} */}
    </div>
  );
}
