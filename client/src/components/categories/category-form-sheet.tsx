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
import { SubmitHandler, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import {
  TCategory,
  TCategoryForm,
  categoryFormSchema,
} from '@common/models/category'
import {
  useCategory,
  useCreateCategory,
  useUpdateCategory,
} from '@hooks/categories'
import { TCustomFormProps } from '@common/types/custom-form-props.type'
import { useToast } from '@components/ui/use-toast'
import { ResponseErrorMessage } from '@components/response-error-message'
import { AxiosError } from 'axios'

export function CategoryFormSheet({
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
              if (onOpenChange) onOpenChange(false)
            }}
          />
        ) : (
          <CreateCategoryForm
            onSuccess={() => {
              if (onOpenChange) onOpenChange(false)
            }}
          />
        )}
      </SheetContent>
    </Sheet>
  )
}

function EditCategoryForm({
  onSuccess,
  onError,
  id,
}: TCustomFormProps & { id: string }) {
  const { toast } = useToast()

  const { data: category } = useCategory(id)

  const { mutateAsync } = useUpdateCategory(id)

  const onSubmit: SubmitHandler<TCategoryForm> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({
          title: 'Category edited.',
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

  if (category) return <CategoryForm category={category} onSubmit={onSubmit} />
  return null
}

function CreateCategoryForm({ onSuccess, onError }: TCustomFormProps) {
  const { toast } = useToast()

  const { mutateAsync } = useCreateCategory()

  const onSubmit: SubmitHandler<TCategoryForm> = (data) => {
    mutateAsync(data)
      .then(() => {
        toast({
          title: 'Category created.',
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

  return <CategoryForm category={undefined} onSubmit={onSubmit} />
}

function CategoryForm({
  onSubmit,
  category,
}: {
  onSubmit: SubmitHandler<TCategoryForm>
  category: TCategory | undefined
}) {
  const form = useForm<TCategoryForm>({
    defaultValues: {
      categoryName: category?.categoryName ?? '',

      ...(category?.description ? { description: category.description } : {}),
    },
    resolver: zodResolver(categoryFormSchema),
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
          name='categoryName'
          render={({ field }) => {
            return (
              <FormItem>
                <FormLabel>Category name</FormLabel>
                <FormControl>
                  <Input placeholder='Category name...' {...field} />
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
              <>{category ? 'Save changes' : 'Create'}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  )
}
