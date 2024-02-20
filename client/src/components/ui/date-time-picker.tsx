import * as React from 'react'
import { DateTime } from 'luxon'
import { Calendar as CalendarIcon } from 'lucide-react'

import { Button } from '@components/ui/button'
import { Calendar } from '@components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@components/ui/popover'
import { cn } from '@libs/utils'
import { SelectSingleEventHandler } from 'react-day-picker'
import { Label } from '@components/ui/label'
import { Input } from '@components/ui/input'
import { format } from 'date-fns'

interface DateTimePickerProps {
  date: Date | undefined
  setDate: (date: Date | undefined) => void
}

export function DateTimePicker({ date, setDate }: DateTimePickerProps) {
  const [selectedDateTime, setSelectedDateTime] = React.useState<DateTime>(
    DateTime.fromJSDate(new Date(date ?? Date.now()))
  )

  const handleSelect: SelectSingleEventHandler = (day, selected) => {
    const selectedDay = DateTime.fromJSDate(selected)
    const modifiedDay = selectedDay.set({
      hour: selectedDateTime.hour,
      minute: selectedDateTime.minute,
    })

    setSelectedDateTime(modifiedDay)
    setDate(modifiedDay.toJSDate())
  }

  const handleTimeChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const { value } = e.target
    const hours = Number.parseInt(value.split(':')[0] || '00', 10)
    const minutes = Number.parseInt(value.split(':')[1] || '00', 10)
    const modifiedDay = selectedDateTime.set({ hour: hours, minute: minutes })

    setSelectedDateTime(modifiedDay)
    setDate(modifiedDay.toJSDate())
  }

  const footer = (
    <>
      <div className='px-4 pb-4 pt-0'>
        <Label>Time</Label>
        <Input
          type='time'
          onChange={handleTimeChange}
          value={selectedDateTime.toFormat('HH:mm')}
          onClick={(ev) => {
            ev.preventDefault()
          }}
        />
      </div>
      {!selectedDateTime && <p>Please pick a day.</p>}
    </>
  )

  return (
    <Popover>
      <PopoverTrigger asChild className='z-10'>
        <Button
          variant={'outline'}
          className={cn(
            'justify-start text-left font-normal',
            !date && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className='mr-2 h-4 w-4' />
          {date ? (
            format(new Date(date), "PPP, HH:mm 'hrs'")
          ) : (
            <span>Pick a date</span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className='w-auto p-0'>
        <Calendar
          mode='single'
          captionLayout='dropdown-buttons'
          fromDate={new Date(Date.now())}
          toYear={2050}
          selected={selectedDateTime.toJSDate()}
          onSelect={handleSelect}
          initialFocus
        />
        {footer}
      </PopoverContent>
    </Popover>
  )
}
