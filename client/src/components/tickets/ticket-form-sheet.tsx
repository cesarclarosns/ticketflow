import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-alert-dialog';
import { AxiosError } from 'axios';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { type CustomFormProps } from '@/common/types/custom-form-props.type';
import { CategoriesSelect } from '@/components/categories/categories-select';
import { ResponseErrorMessage } from '@/components/response-error-message';
import { Button } from '@/components/ui/button';
import { DateTimePicker } from '@/components/ui/date-time-picker';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Icons } from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { UsersCombobox } from '@/components/users/users-combobox';
import { useCreateTicketMutation } from '@/hooks/tickets/use-create-ticket-mutation';
import { useGetTicketQuery } from '@/hooks/tickets/use-get-ticket-query';
import { useUpdateTicketMutation } from '@/hooks/tickets/use-update-ticket-mutation';
import {
  type CreateTicket,
  createTicketSchema,
} from '@/schemas/tickets/create-ticket';
import {
  type UpdateTicket,
  updateTicketSchema,
} from '@/schemas/tickets/update-ticket';

import { StatutesSelect } from './statuses-select';

export function TicketFormSheet({
  id,
  open,
  onOpenChange,
}: {
  id?: string;
  open: DialogProps['open'];
  onOpenChange: DialogProps['onOpenChange'];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-scroll lg:max-w-[500px]">
        <SheetHeader className="">
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
              if (onOpenChange) onOpenChange(false);
            }}
          />
        ) : (
          <CreateTicketForm
            onSuccess={() => {
              if (onOpenChange) onOpenChange(false);
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function EditTicketForm({
  id,
  onSuccess,
  onError,
}: CustomFormProps & {
  id: string;
}) {
  const { toast } = useToast();
  const { data: ticket } = useGetTicketQuery(id);

  const { mutateAsync } = useUpdateTicketMutation(id);

  const onSubmit: SubmitHandler<UpdateTicket> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({ title: 'Ticket updated.' });

        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const message = error?.response?.data?.message;

          toast({
            description: (
              <>
                {message ? (
                  <ResponseErrorMessage message={message} />
                ) : (
                  'There was a problem with your request'
                )}
              </>
            ),
            title: 'Uh oh! Something went wrong.',
            variant: 'destructive',
          });
        }

        if (onError) onError(error);
      });
  };

  const form = useForm<UpdateTicket>({
    defaultValues: {
      description: ticket?.description ?? '',
      title: ticket?.title ?? '',

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
    mode: 'all',
    resolver: zodResolver(updateTicketSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="ticketCategory"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="hover:cursor-pointer">Category</FormLabel>

                <CategoriesSelect
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="status"
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
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="asignee"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Asignee</FormLabel>
                <UsersCombobox
                  value={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Due Date</FormLabel>
                <DateTimePicker
                  date={
                    field.value
                      ? new Date(field.value ?? Date.now())
                      : undefined
                  }
                  setDate={(date) => {
                    if (date) {
                      field.onChange(date.toISOString());
                    }
                  }}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <div className="my-5 flex justify-end">
          <Button
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              !form.formState.isDirty
            }
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Save changes</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

function CreateTicketForm({ onSuccess, onError }: CustomFormProps) {
  const { toast } = useToast();

  const { mutateAsync } = useCreateTicketMutation();

  const onSubmit: SubmitHandler<CreateTicket> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({
          title: 'Ticket created.',
        });

        if (onSuccess) onSuccess();
      })
      .catch((error) => {
        if (error instanceof AxiosError) {
          const message = error?.response?.data?.message;

          toast({
            description: (
              <>
                {message ? (
                  <ResponseErrorMessage message={message} />
                ) : (
                  'There was a problem with your request'
                )}
              </>
            ),
            title: 'Uh oh! Something went wrong.',
            variant: 'destructive',
          });
        }

        if (onError) onError(error);
      });
  };

  const form = useForm<CreateTicket>({
    defaultValues: {
      description: '',
      title: '',
    },
    mode: 'all',
    resolver: zodResolver(createTicketSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="Title..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Textarea placeholder="Description..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="ticketCategory"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel className="hover:cursor-pointer">Category</FormLabel>

                <CategoriesSelect
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="status"
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
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="asignee"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-1">
                <FormLabel>Asignee</FormLabel>
                <UsersCombobox
                  value={field.value}
                  onValueChange={field.onChange}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="dueDate"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Due Date</FormLabel>
                <DateTimePicker
                  date={
                    field.value
                      ? new Date(field.value ?? Date.now())
                      : undefined
                  }
                  setDate={(date) => {
                    if (date) {
                      field.onChange(date.toISOString());
                    }
                  }}
                />
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <div className="my-5 flex justify-end">
          <Button
            disabled={
              !form.formState.isValid ||
              form.formState.isSubmitting ||
              !form.formState.isDirty
            }
            type="submit"
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Create</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
