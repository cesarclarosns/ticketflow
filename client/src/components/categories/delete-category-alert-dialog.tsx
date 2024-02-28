import { type DialogProps } from '@radix-ui/react-alert-dialog';
import { AxiosError } from 'axios';

import { ResponseErrorMessage } from '@/components/response-error-message';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/components/ui/use-toast';
import { useDeleteCategoryMutation } from '@/hooks/categories/use-delete-category-mutation';

export function DeleteCategoryAlertDialog({
  id,
  open,
  onOpenChange,
}: {
  id: string;
  open: DialogProps['open'];
  onOpenChange: DialogProps['onOpenChange'];
}) {
  const { toast } = useToast();

  const { mutateAsync } = useDeleteCategoryMutation(id);

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              mutateAsync()
                .then(() => {
                  toast({
                    title: 'Category deleted.',
                  });
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
                });
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
