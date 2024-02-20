'use client'

import { Table } from '@tanstack/react-table'
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import { DataTableViewOptions } from './data-table-view-options'
import { statuses } from '../data/data'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { useCategories } from '@hooks/categories'
import { Icons } from '@components/ui/icons'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0

  const { data: categories } = useCategories({ sort: 'categoryName' })

  return (
    <div className='flex flex-row items-center justify-between gap-5'>
      <div className='flex flex-1 flex-col gap-2 sm:flex-row sm:items-center'>
        <Input
          placeholder='Filter tickets by title...'
          value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
          onChange={(event) => {
            table
              .getAllColumns()
              .filter((column) => {
                return ['title', '_id'].includes(column.id)
              })
              .forEach((column) => column.setFilterValue(event.target.value))
          }}
          className='h-8 sm:w-[150px] lg:w-[250px]'
        />

        <div className='flex items-center gap-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={statuses}
            />
          )}

          {table.getColumn('ticketCategory') && (
            <DataTableFacetedFilter
              column={table.getColumn('ticketCategory')}
              title='Category'
              options={
                categories
                  ? categories.map((category) => ({
                      label: category.categoryName,
                      value: category._id,
                    }))
                  : []
              }
            />
          )}

          {isFiltered && (
            <Button
              variant='ghost'
              onClick={() => table.resetColumnFilters()}
              className='h-8 px-2 lg:px-3'
            >
              Reset
              <Icons.Cross2Icon className='ml-2 h-4 w-4' />
            </Button>
          )}
        </div>
      </div>

      <DataTableViewOptions table={table} />
    </div>
  )
}
