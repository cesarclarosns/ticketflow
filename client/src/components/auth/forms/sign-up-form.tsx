'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

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
import { useToast } from '@/components/ui/use-toast';
import { UserGenderSelect } from '@/components/users/user-gender-select';
import { useSignUpMutation } from '@/hooks/auth/use-sign-up-mutation';
import { type SignUp, signUpSchema } from '@/schemas/auth/sign-up';

export function SignUpForm() {
  const signUpMutation = useSignUpMutation();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { toast } = useToast();

  const form = useForm<SignUp>({
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      password: '',
    },
    mode: 'all',
    resolver: zodResolver(signUpSchema),
  });

  const onSubmit: SubmitHandler<SignUp> = async (data) => {
    try {
      await signUpMutation.mutateAsync(data);
      toast({
        description: 'Your account was created.',
        title: 'Account created.',
        variant: 'default',
      });
    } catch (err) {
      if (err instanceof AxiosError) {
        const errors = err.response?.data?.errors;

        if (errors?.email)
          form.setError('email', {
            message: errors.email,
          });
        if (errors?.password)
          form.setError('password', {
            message: errors.password,
          });
      }
    }
  };

  return (
    <div className="flex min-h-fit w-full max-w-[360px] flex-col gap-5 py-10 sm:px-5">
      <Form {...form}>
        <h1 className="text-center text-2xl font-bold">Create an account</h1>
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
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      className="pr-10"
                      placeholder="Password"
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                    ></Input>
                    <div className="absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400">
                      {showPassword ? (
                        <Icons.EyeOpenIcon
                          className="h-5 w-5"
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Icons.EyeClosedIcon
                          className="h-5 w-5"
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className=" whitespace-pre-wrap" />
              </FormItem>
            )}
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

          <Button
            type="submit"
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              <>Continue</>
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center text-sm">
        <p>
          Already have an account?{' '}
          <span
            onClick={() => router.push('/auth/sign-in')}
            className="hover:cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>

        <p
          className="hover:cursor-pointer hover:underline"
          onClick={() => router.push('/')}
        >
          Back to Home
        </p>
      </div>
    </div>
  );
}
