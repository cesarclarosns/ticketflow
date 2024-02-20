/* eslint-disable react/no-unescaped-entities */
import { Button } from '@components/ui/button'
import { Input } from '@components/ui/input'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@components/ui/sheet'
import { DialogProps } from '@radix-ui/react-alert-dialog'
import { TTicket, TTicketForm, ticketFormSchema } from '@common/models/ticket'
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useCreateTicket, useTicket, useUpdateTicket } from '@hooks/tickets'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'
import { Textarea } from '@components/ui/textarea'
import { Icons } from '@components/ui/icons'
import { UsersCombobox } from '@components/users/users-combobox'
import { CategoriesSelect } from '@components/categories/categories-select'
import { StatutesSelect } from './statuses-select'
import { DateTimePicker } from '@components/ui/date-time-picker'
import { TCustomFormProps } from '@common/types/custom-form-props.type'
import { useToast } from '@components/ui/use-toast'
import { AxiosError } from 'axios'
import { ResponseErrorMessage } from '@components/response-error-message'

export function TicketFormSheet({
  id,
  open,
  onOpenChange,
}: {
  id?: string
  open: DialogProps['open']
  onOpenChange: DialogProps['onOpenChange']
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className='max-h-screen overflow-y-scroll lg:max-w-[500px]'>
        <SheetHeader className=''>
          <SheetTitle>{id ? 'Edit ticket' : 'Add ticket'}</SheetTitle>

          <SheetDescription>
            {id
              ? "Make changes to the ticket here. Click save when you're done."
              : "Create a new ticket here. Click create when you're done."}
          </SheetDescription>
        </SheetHeader>

        {id ? (
          <EditTicketForm
            id={id}
            onSuccess={() => {
              if (onOpenChange) onOpenChange(false)
            }}
          />
        ) : (
          <CreateTicketForm
            onSuccess={() => {
              if (onOpenChange) onOpenChange(false)
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function EditTicketForm({
  id,
  onSuccess,
  onError,
}: TCustomFormProps & {
  id: string
}) {
  const { toast } = useToast()
  const { data: ticket } = useTicket(id)

  const { mutateAsync } = useUpdateTicket(id)

  const onSubmit: SubmitHandler<TTicketForm> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({ title: 'Ticket updated.' })

        if (onSuccess) onSuccess()
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const message = error?.response?.data?.message

          toast({
            title: 'Uh oh! Something went wrong.',
            description: (
              <>
                {message ? (
                  <ResponseErrorMessage message={message} />
                ) : (
                  'There was a problem with your request'
                )}
              </>
            ),
            variant: 'destructive',
          })
        }

        if (onError) onError(error)
      })
  }

  if (ticket) return <TicketForm ticket={ticket} onSubmit={onSubmit} />
  return null
}

function CreateTicketForm({ onSuccess, onError }: TCustomFormProps) {
  const { toast } = useToast()

  const { mutateAsync } = useCreateTicket()

  const onSubmit: SubmitHandler<TTicketForm> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({
          title: 'Ticket created.',
        })

        if (onSuccess) onSuccess()
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const message = error?.response?.data?.message

          toast({
            title: 'Uh oh! Something went wrong.',
            description: (
              <>
                {message ? (
                  <ResponseErrorMessage message={message} />
                ) : (
                  'There was a problem with your request'
                )}
              </>
            ),
            variant: 'destructive',
          })
        }

        if (onError) onError(error)
      })
  }

  return <TicketForm ticket={undefined} onSubmit={onSubmit} />
}

function TicketForm({
  onSubmit,
  ticket,
}: {
  onSubmit: SubmitHandler<TTicketForm>
  ticket: TTicket | undefined
}) {
  const form = useForm<TTicketForm>({
    defaultValues: {
      title: ticket?.title ?? '',
      description: ticket?.description ?? '',

      ...(ticket?.dueDate && new Date(3000, 11) > new Date(ticket.dueDate)
        ? { dueDate: new Date(ticket.dueDate).toISOString() }
        : {}),
      ...(ticket?.status ? { status: ticket.status } : {}),
      ...(ticket?.ticketCategory?._id
        ? {
            ticketCategory: ticket.ticketCategory._id,
          }
        : {}),
      ...(ticket?.asignee?._id
        ? {
            asignee: ticket.asignee._id,
          }
        : {}),
    },
    resolver: zodResolver(ticketFormSchema),
    mode: 'all',
  })

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className='mt-5 flex flex-col gap-5'
      >
        <FormField
          control={form.control}
          name='title'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder='Title...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>

        <FormField
          control={form.control}
          name='description'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder='Description...' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>

        <FormField
          control={form.control}
          name='ticketCategory'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className='hover:cursor-pointer'>Category</FormLabel>

                <CategoriesSelect
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>

        <FormField
          control={form.control}
          name='status'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <StatutesSelect
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>

        <FormField
          control={form.control}
          name='asignee'
          render={({ field }) => {
            return (
              <FormItem className='flex flex-col gap-1'>
                <FormLabel>Asignee</FormLabel>
                <UsersCombobox
                  value={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>

        <FormField
          control={form.control}
          name='dueDate'
          render={({ field }) => {
            return (
              <FormItem className='flex flex-col gap-2'>
                <FormLabel>Due Date</FormLabel>
                <DateTimePicker
                  date={
                    field.value
                      ? new Date(field.value ?? Date.now())
                      : undefined
                  }
                  setDate={(date) => {
                    if (date) {
                      field.onChange(date.toISOString())
                    }
                  }}
                />
                <FormMessage />
              </FormItem>
            )
          }}
        ></FormField>

        <div className='my-5 flex justify-end'>
          <Button
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              !form.formState.isDirty
            }
            type='submit'
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </>
            ) : (
              <>{ticket ? 'Save changes' : 'Create'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
