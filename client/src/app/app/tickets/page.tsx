'use client'

import { TicketFormSheet } from '@components/tickets/ticket-form-sheet'
import { TicketsTable } from '@components/tickets/tickets-table/tickets-table'
import { Button } from '@components/ui/button'
import { useState } from 'react'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@components/ui/dropdown-menu'
import { CategoriesTableSheet } from '@components/categories/categories-table-sheet'
import { Icons } from '@components/ui/icons'

export default function TicketsPage() {
  return (
    <main className='flex flex-col gap-10 p-5'>
      <div className='flex flex-col gap-5 md:flex-row md:justify-between'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl font-semibold'>Tickets</h1>
          <p className='text-sm text-muted-foreground'>
            Manage your tickets here.
          </p>
        </div>

        <div className='flex items-center gap-[2px]'>
          <AddTicketAction />
          <OpenSettingsAction />
        </div>
      </div>

      <TicketsTable />
    </main>
  )
}

function AddTicketAction() {
  const [isTicketFormSheetOpen, setIsTicketFormSheetOpen] = useState(false)

  return (
    <>
      <Button onClick={() => setIsTicketFormSheetOpen(true)} className='px-8'>
        Add Ticket
      </Button>
      <TicketFormSheet
        open={isTicketFormSheetOpen}
        onOpenChange={setIsTicketFormSheetOpen}
      />
    </>
  )
}

function OpenSettingsAction() {
  const [isCategoriesTableSheetOpen, setIsCategoriesTableSheetOpen] =
    useState(false)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <Icons.ChevronDownIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-56'>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => setIsCategoriesTableSheetOpen(true)}
            >
              <span>Edit categories</span>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <CategoriesTableSheet
        open={isCategoriesTableSheetOpen}
        onOpenChange={setIsCategoriesTableSheetOpen}
      />
    </>
  )
}
