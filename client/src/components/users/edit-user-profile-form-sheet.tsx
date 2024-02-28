import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-alert-dialog';
import { AxiosError } from 'axios';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { type CustomFormProps } from '@/common/types/custom-form-props.type';
import { ResponseErrorMessage } from '@/components/response-error-message';
import { Button } from '@/components/ui/button';
import { DatePicker } from '@/components/ui/date-picker';
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
import { useToast } from '@/components/ui/use-toast';
import { useGetCurrentUserQuery } from '@/hooks/users/use-get-current-user-query';
import { useUpdateUserMutation } from '@/hooks/users/use-update-user-mutation';
import { type User, userSchema } from '@/models/users/user';
import { type UpdateUser } from '@/schemas/users/update-user';

import { UserGenderSelect } from './user-gender-select';

export function EditUserProfileFormSheet({
  open,
  onOpenChange,
}: {
  open: DialogProps['open'];
  onOpenChange: DialogProps['onOpenChange'];
}) {
  const { data: user } = useGetCurrentUserQuery();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-scroll lg:max-w-[500px]">
        <SheetHeader className="">
          <SheetTitle>Edit profile</SheetTitle>

          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>

        {user && (
          <EditUserProfileForm
            user={user}
            onSuccess={() => {
              if (onOpenChange) onOpenChange(false);
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function EditUserProfileForm({
  user,
  onSuccess,
  onError,
}: CustomFormProps & { user: User }) {
  const { toast } = useToast();

  const { mutateAsync } = useUpdateUserMutation(user._id);

  const onSubmit: SubmitHandler<UpdateUser> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({
          title: 'Profile edited.',
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

  const form = useForm<User>({
    defaultValues: {
      ...(user?.firstName ? { firstName: user.firstName } : {}),
      ...(user?.lastName ? { lastName: user.lastName } : {}),
      ...(user?.email ? { email: user.email } : {}),
      ...(user?.birthday ? { birthday: user.birthday } : {}),
      ...(user?.gender ? { gender: user.gender } : {}),
    },
    mode: 'all',
    resolver: zodResolver(
      userSchema.pick({
        birthday: true,
        email: true,
        firstName: true,
        gender: true,
        lastName: true,
      }),
    ),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input placeholder="First name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="gender"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <FormControl>
                  <UserGenderSelect
                    defaultValue={field.value}
                    onValueChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            );
          }}
        ></FormField>

        <FormField
          control={form.control}
          name="birthday"
          render={({ field }) => {
            return (
              <FormItem className="flex flex-col gap-2">
                <FormLabel>Birthday</FormLabel>
                <DatePicker
                  captionLayout="dropdown-buttons"
                  fromYear={1900}
                  toYear={new Date(Date.now()).getFullYear()}
                  selected={field.value ? new Date(field.value) : undefined}
                  onSelect={(date) => {
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
