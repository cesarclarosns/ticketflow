'use client'

import { ColumnDef } from '@tanstack/react-table'
import { Checkbox } from '@components/ui/checkbox'
import { statuses } from '../data/data'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'
import { TTicket } from '@common/models/ticket'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@components/ui/tooltip'
import { TCategory } from '@common/models/category'
import { TUser } from '@common/models/user'
import { formatRelative } from 'date-fns'
import { locale } from '@common/locales/dates/en'

export const columns: ColumnDef<TTicket>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-[2px]'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-[2px]'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: '_id',
    meta: {
      columnName: 'ID',
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className='w-[80px] truncate'>{row.getValue('_id')}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue('_id')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    enableSorting: false,
    enableHiding: true,
    enableResizing: true,
  },
  {
    accessorKey: 'title',
    meta: { columnName: 'Title' },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='flex space-x-2'>
                <span className='max-w-[150px] truncate font-medium'>
                  {row.getValue('title')}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue('title')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    maxSize: 120,
    minSize: 80,
    enableResizing: true,
    enableHiding: false,
  },
  {
    accessorKey: 'description',
    meta: {
      columnName: 'Description',
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='flex space-x-2'>
                <span className='max-w-[150px] truncate font-medium'>
                  {row.getValue('description')}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue('description')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'ticketCategory',
    meta: {
      columnName: 'Category',
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    cell: ({ row }) => {
      const ticketCategory = row.getValue('ticketCategory') as TCategory

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='flex space-x-2'>
                <span className='max-w-[150px] truncate font-medium'>
                  {ticketCategory?.categoryName ?? ''}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{ticketCategory?.categoryName ?? ''}</p>
              <p>{ticketCategory?.description ?? ''}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'dueDate',
    meta: {
      columnName: 'Due Date',
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string

      return (
        <div className='flex space-x-2'>
          <span className='w-[200px] truncate font-medium'>
            {dueDate &&
              new Date(3000, 11) > new Date(dueDate) &&
              formatRelative(new Date(dueDate), new Date(), {
                locale,
              })}
          </span>
        </div>
      )
    },
    enableSorting: true,
  },
  {
    accessorKey: 'asignee',
    meta: {
      columnName: 'Asignee',
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    cell: ({ row }) => {
      const asignee = row.getValue('asignee') as TUser

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className='flex space-x-2'>
                <span className='max-w-[150px] truncate font-medium'>
                  {asignee?.email ?? ''}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{asignee?.email ?? ''}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      )
    },
    enableSorting: false,
  },
  {
    accessorKey: 'status',
    meta: {
      columnName: 'Status',
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='mr-2 h-4 w-4 text-muted-foreground' />
          )}
          <span>{status?.label}</span>
        </div>
      )
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
