import { zodResolver } from '@hookform/resolvers/zod';
import { type DialogProps } from '@radix-ui/react-alert-dialog';
import { AxiosError } from 'axios';
import { type SubmitHandler, useForm } from 'react-hook-form';

import { type CustomFormProps } from '@/common/types/custom-form-props.type';
import { ResponseErrorMessage } from '@/components/response-error-message';
import { Button } from '@/components/ui/button';
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
import { useCreateCategoryMutation } from '@/hooks/categories/use-create-category-mutation';
import { useGetCategoryQuery } from '@/hooks/categories/use-get-category-query';
import { useUpdateCategoryMutation } from '@/hooks/categories/use-update-category-mutation';
import {
  type CreateCategory,
  createCategorySchema,
} from '@/schemas/categories/create-category';
import {
  type UpdateCategory,
  updateCategorySchema,
} from '@/schemas/categories/update-category';

export function CategoryFormSheet({
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
          <SheetTitle>{id ? 'Edit category' : 'Add category'}</SheetTitle>

          <SheetDescription>
            {id
              ? "Make changes to the category here. Click save when you're done."
              : "Create a new category here. Click create when you're done."}
          </SheetDescription>
        </SheetHeader>

        {id ? (
          <EditCategoryForm
            id={id}
            onSuccess={() => {
              if (onOpenChange) onOpenChange(false);
            }}
          />
        ) : (
          <CreateCategoryForm
            onSuccess={() => {
              if (onOpenChange) onOpenChange(false);
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  );
}

function EditCategoryForm({
  onSuccess,
  onError,
  id,
}: CustomFormProps & { id: string }) {
  const { toast } = useToast();

  const { data: category } = useGetCategoryQuery(id);

  const updateCategoryMutation = useUpdateCategoryMutation(id);

  const form = useForm<UpdateCategory>({
    defaultValues: {
      categoryName: category?.categoryName ?? '',
      ...(category?.description ? { description: category.description } : {}),
    },
    mode: 'all',
    resolver: zodResolver(updateCategorySchema),
  });

  const onSubmit: SubmitHandler<UpdateCategory> = (data) => {
    updateCategoryMutation
      .mutateAsync(data)
      .then(() => {
        toast({
          title: 'Category edited.',
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input placeholder="Category name..." {...field} />
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

function CreateCategoryForm({ onSuccess, onError }: CustomFormProps) {
  const { toast } = useToast();

  const createCategoryMutation = useCreateCategoryMutation();

  const form = useForm<CreateCategory>({
    defaultValues: {
      categoryName: '',
    },
    mode: 'all',
    resolver: zodResolver(createCategorySchema),
  });

  const onSubmit: SubmitHandler<CreateCategory> = (data) => {
    createCategoryMutation
      .mutateAsync(data)
      .then(() => {
        toast({
          title: 'Category created.',
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

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-5 flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="categoryName"
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input placeholder="Category name..." {...field} />
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
