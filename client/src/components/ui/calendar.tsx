'use client';

import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons';
import * as React from 'react';
import { DayPicker } from 'react-day-picker';

import { buttonVariants } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/libs/utils';

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps & { onChange?: React.ChangeEventHandler<HTMLSelectElement> }) {
  const handleCalendarChange = (
    _value: string | number,
    _e: React.ChangeEventHandler<HTMLSelectElement>,
  ) => {
    const _event = {
      target: {
        value: String(_value),
      },
    } as React.ChangeEvent<HTMLSelectElement>;
    _e(_event);
  };

  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn('p-3', className)}
      classNames={{
        caption: 'flex justify-center pt-1 relative items-center gap-1',
        caption_between: 'is-between',
        caption_dropdowns: 'flex justify-center grow dropdowns pl-7 pr-8',
        caption_end: 'is-end',
        caption_label:
          'flex h-7 text-sm font-medium justify-center items-center grow [.is-multiple_&]:flex',
        caption_start: 'is-start',
        cell: cn(
          'relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent',
          props.mode === 'range'
            ? '[&:has(>.day-range-end)]:rounded-r-md [&:has(>.day-range-start)]:rounded-l-md first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md'
            : '[&:has([aria-selected])]:rounded-md',
        ),
        day: cn(
          buttonVariants({ variant: 'ghost' }),
          'h-8 w-8 p-0 font-normal aria-selected:opacity-100',
        ),
        day_disabled: 'text-muted-foreground opacity-50',
        day_hidden: 'invisible',
        day_outside: 'text-muted-foreground opacity-50',
        day_range_end: 'day-range-end',
        day_range_middle:
          'aria-selected:bg-accent aria-selected:text-accent-foreground',
        day_range_start: 'day-range-start',
        day_selected:
          'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground',
        day_today: 'bg-accent text-accent-foreground',
        head_cell:
          'text-muted-foreground rounded-md w-8 font-normal text-[0.8rem]',
        head_row: 'flex',
        month: 'space-y-3',
        months: 'flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0',
        multiple_months: 'is-multiple',
        nav: "flex items-center [&:has([name='previous-month'])]:order-first [&:has([name='next-month'])]:order-last",
        nav_button: cn(
          buttonVariants({ variant: 'outline' }),
          'h-6 w-6 bg-transparent p-0 text-muted-foreground',
        ),
        nav_button_next: 'absolute right-1',
        nav_button_previous: 'absolute left-1',
        row: 'flex w-full mt-2',
        table: 'w-full border-collapse space-y-1',
        vhidden:
          'hidden [.is-between_&]:flex [.is-end_&]:flex [.is-start.is-end_&]:hidden',
        ...classNames,
      }}
      components={{
        Dropdown: ({ ...props }) => (
          <Select
            {...props}
            onValueChange={(value) => {
              if (props.onChange) {
                handleCalendarChange(value, props.onChange);
              }
            }}
            value={props.value as string}
          >
            <SelectTrigger
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'h-7 border-none px-2 py-1 font-medium shadow-none [.is-between_&]:hidden [.is-end_&]:hidden [.is-start.is-end_&]:flex',
              )}
            >
              <SelectValue placeholder={props?.caption}>
                {props?.caption}
              </SelectValue>
            </SelectTrigger>
            <SelectContent className="scrolling-auto max-h-[var(--radix-popper-available-height);] min-w-[var(--radix-popper-anchor-width)] overflow-y-auto">
              {props.children &&
                React.Children.map(props.children, (child) => (
                  <SelectItem
                    value={(child as React.ReactElement<any>)?.props?.value}
                    className="min-w-[var(--radix-popper-anchor-width)] pr-7"
                  >
                    {(child as React.ReactElement<any>)?.props?.children}
                  </SelectItem>
                ))}
            </SelectContent>
          </Select>
        ),
        IconLeft: ({ ...props }) => <ChevronLeftIcon className="h-4 w-4" />,
        IconRight: ({ ...props }) => <ChevronRightIcon className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}
Calendar.displayName = 'Calendar';

export { Calendar };
