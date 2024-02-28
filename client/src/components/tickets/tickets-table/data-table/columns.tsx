'use client';

import { type ColumnDef } from '@tanstack/react-table';
import { formatRelative } from 'date-fns';

import { locale } from '@/common/locales/dates/en';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { type Category } from '@/models/categories/category';
import { type Ticket } from '@/models/tickets/ticket';
import { type User } from '@/models/users/user';

import { statuses } from '../data/data';
import { DataTableColumnHeader } from './data-table-column-header';
import { DataTableRowActions } from './data-table-row-actions';

export const columns: ColumnDef<Ticket>[] = [
  {
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableHiding: false,
    enableSorting: false,
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    id: 'select',
  },
  {
    accessorKey: '_id',
    cell: ({ row }) => (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <div className="w-[80px] truncate">{row.getValue('_id')}</div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{row.getValue('_id')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    ),
    enableHiding: true,
    enableResizing: true,
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    meta: {
      columnName: 'ID',
    },
  },
  {
    accessorKey: 'title',
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex space-x-2">
                <span className="max-w-[150px] truncate font-medium">
                  {row.getValue('title')}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue('title')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableHiding: false,
    enableResizing: true,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    maxSize: 120,
    meta: { columnName: 'Title' },
    minSize: 80,
  },
  {
    accessorKey: 'description',
    cell: ({ row }) => {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex space-x-2">
                <span className="max-w-[150px] truncate font-medium">
                  {row.getValue('description')}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{row.getValue('description')}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    meta: {
      columnName: 'Description',
    },
  },
  {
    accessorKey: 'ticketCategory',
    cell: ({ row }) => {
      const ticketCategory = row.getValue('ticketCategory') as Category;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex space-x-2">
                <span className="max-w-[150px] truncate font-medium">
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
      );
    },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    meta: {
      columnName: 'Category',
    },
  },
  {
    accessorKey: 'dueDate',
    cell: ({ row }) => {
      const dueDate = row.getValue('dueDate') as string;

      return (
        <div className="flex space-x-2">
          <span className="w-[200px] truncate font-medium">
            {dueDate &&
              new Date(3000, 11) > new Date(dueDate) &&
              formatRelative(new Date(dueDate), new Date(), {
                locale,
              })}
          </span>
        </div>
      );
    },
    enableSorting: true,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    meta: {
      columnName: 'Due Date',
    },
  },
  {
    accessorKey: 'asignee',
    cell: ({ row }) => {
      const asignee = row.getValue('asignee') as User;

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="flex space-x-2">
                <span className="max-w-[150px] truncate font-medium">
                  {asignee?.email ?? ''}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent>
              <p>{asignee?.email ?? ''}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
    enableSorting: false,
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    meta: {
      columnName: 'Asignee',
    },
  },
  {
    accessorKey: 'status',
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status'),
      );

      if (!status) {
        return null;
      }

      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status?.label}</span>
        </div>
      );
    },
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title={column.columnDef.meta!.columnName}
      />
    ),
    meta: {
      columnName: 'Status',
    },
  },
  {
    cell: ({ row }) => <DataTableRowActions row={row} />,
    id: 'actions',
  },
];
