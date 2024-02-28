export type CustomFormProps = {
  onSuccess?: () => void | Promise<unknown> | undefined;
  onError?: (error: unknown) => void | Promise<unknown> | undefined;
};
