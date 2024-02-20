'use client'

import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Row } from '@tanstack/react-table'
import { Button } from '@components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { ticketSchema } from '@common/models/ticket'
import { DeleteTicketAlertDialog } from '@components/tickets/delete-ticket-alert-dialog'
import { useState } from 'react'
import { TicketFormSheet } from '@components/tickets/ticket-form-sheet'
import { useCurrentUser } from '@hooks/users'

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
}

export function DataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { data: user } = useCurrentUser()

  const [isDeleteTicketAlertDialogOpen, setIsDeleteTicketAlertDialogOpen] =
    useState(false)
  const [isTicketFormSheetOpen, setIsTicketFormSheetOpen] = useState(false)

  const ticket = ticketSchema.parse(row.original)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant='ghost'
            className='flex h-8 w-8 p-0 data-[state=open]:bg-muted'
          >
            <DotsHorizontalIcon className='h-4 w-4' />
            <span className='sr-only'>Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' className='w-[160px]'>
          <DropdownMenuItem onClick={() => setIsTicketFormSheetOpen(true)}>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => setIsDeleteTicketAlertDialogOpen(true)}
            disabled={!user || ticket.createdBy?._id !== user._id}
          >
            Delete
            <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <TicketFormSheet
        open={isTicketFormSheetOpen}
        onOpenChange={setIsTicketFormSheetOpen}
        id={ticket._id}
      />

      <DeleteTicketAlertDialog
        id={ticket._id}
        open={isDeleteTicketAlertDialogOpen}
        onOpenChange={setIsDeleteTicketAlertDialogOpen}
      />
    </>
  )
}
