'use client'

import * as React from 'react'
import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  RowSelectionState,
  PaginationState,
} from '@tanstack/react-table'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@components/ui/table'
import { DataTablePagination } from './data-table-pagination'
import { DataTableToolbar } from './data-table-toolbar'
import { columns } from './columns'
import { useTickets } from '@hooks/tickets'
import { useDebounce } from '@hooks/use-debounce'

export const DEFAULT_PAGE_INDEX = 0
export const DEFAULT_PAGE_SIZE = 10

interface DataTableProps<TData, TValue> {
  floatingBar: boolean
}

export function DataTable<TData, TValue>({
  floatingBar = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({})

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({})

  const [sorting, setSorting] = React.useState<SortingState>([])
  const debouncedSorting = useDebounce(sorting)

  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const debouncedColumnFilters = useDebounce(columnFilters)

  const [pagination, setPagination] = React.useState<PaginationState>({
    pageIndex: DEFAULT_PAGE_INDEX,
    pageSize: DEFAULT_PAGE_SIZE,
  })
  const debouncedPagination = useDebounce(pagination)

  //Handle server-side pagination
  const getPageCount = (totalCount: number) => {
    return Math.ceil(totalCount / pagination.pageSize)
  }

  const getSkip = () => {
    return debouncedPagination.pageIndex * debouncedPagination.pageSize
  }

  const getLimit = () => {
    return debouncedPagination.pageSize
  }

  //Handle server-side sorting
  const getSort = () => {
    if (debouncedSorting.length) {
      return `${debouncedSorting[0].desc ? '' : '-'}${debouncedSorting[0].id}`
    }
    return ''
  }

  //Handle server-side filtering
  const getFilter = () => {
    if (debouncedColumnFilters.length) {
      const filter: { $and: any[] } = { $and: [] }

      debouncedColumnFilters.forEach((columnFilter) => {
        if (columnFilter.id == 'status') {
          filter.$and.push({ status: { $in: columnFilter.value } })
        }

        if (columnFilter.id == 'title') {
          filter.$and.push({
            title: columnFilter.value,
          })
        }

        if (columnFilter.id == 'ticketCategory') {
          filter.$and.push({ ticketCategory: { $in: columnFilter.value } })
        }
      })

      if (filter.$and.length) return JSON.stringify(filter)
    }

    return ''
  }

  //Handle row selection
  const deleteRowsAction = async () => {
    await Promise.all([])
  }

  //Fetch dada
  const { isLoading, isError, data } = useTickets({
    skip: getSkip(),
    limit: getLimit(),
    filter: getFilter(),
    sort: getSort(),
  })

  const table = useReactTable({
    data: data?.results ?? [],
    pageCount: data?.totalCount?.count
      ? getPageCount(data.totalCount.count)
      : -1,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination: true,
    manualSorting: true,
    manualFiltering: true,
  })

  return (
    <div className='space-y-4'>
      <DataTableToolbar table={table} />
      <div className='relative max-h-[60vh] overflow-auto rounded-md border'>
        <Table>
          <TableHeader className='sticky top-0 z-10 bg-secondary'>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
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
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className='h-24 text-center'
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
  )
}
