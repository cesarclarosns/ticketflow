'use client';

import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { type Row } from '@tanstack/react-table';
import { useState } from 'react';

import { DeleteTicketAlertDialog } from '@/components/tickets/delete-ticket-alert-dialog';
import { TicketFormSheet } from '@/components/tickets/ticket-form-sheet';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';
import { type Ticket, ticketSchema } from '@/models/tickets/ticket';

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function DataTableRowActions({ row }: DataTableRowActionsProps<Ticket>) {
  const { data: user } = useGetCurrentUserQuery();

  const [isDeleteTicketAlertDialogOpen, setIsDeleteTicketAlertDialogOpen] =
    useState(false);
  const [isTicketFormSheetOpen, setIsTicketFormSheetOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setIsTicketFormSheetOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsDeleteTicketAlertDialogOpen(true)}
            disabled={!user || row.original.createdBy?._id !== user._id}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TicketFormSheet
        open={isTicketFormSheetOpen}
        onOpenChange={setIsTicketFormSheetOpen}
        id={row.original._id}
      />

      <DeleteTicketAlertDialog
        id={row.original._id}
        open={isDeleteTicketAlertDialogOpen}
        onOpenChange={setIsDeleteTicketAlertDialogOpen}
      />
    </>
  );
}
