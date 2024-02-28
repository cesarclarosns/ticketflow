'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { type SubmitHandler, useForm } from 'react-hook-form';

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
import { useSignInMutation } from '@/hooks/auth/use-sign-in-mutation';
import { type SignIn, signInSchema } from '@/schemas/auth/sign-in';
import { useAuthStore } from '@/stores/auth-store';

import { SocialSignIn } from './social-sign-in';

export function SignInForm() {
  const router = useRouter();
  const signInMutation = useSignInMutation();
  const { setAuth } = useAuthStore((state) => state);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<SignIn>({
    defaultValues: {
      email: '',
      password: '',
    },
    mode: 'all',
    resolver: zodResolver(signInSchema),
  });

  const onSubmit: SubmitHandler<SignIn> = async (data) => {
    try {
      await signInMutation.mutateAsync(data);
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
    <div className="flex min-h-fit w-full max-w-[360px] flex-col py-10 sm:px-5">
      <Form {...form}>
        <h1 className="text-center text-2xl font-bold">Welcome back</h1>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="mt-5 flex flex-col gap-5"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" {...field}></Input>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
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

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <SocialSignIn />
          </div>

          <div className="text-center text-sm">
            <p
              className="hover:cursor-pointer hover:underline"
              onClick={() => router.push('/auth/reset-password')}
            >
              Forgot password?
            </p>

            <p>
              Don't have an account?{' '}
              <span
                onClick={() => router.push('/auth/sign-up')}
                className="hover:cursor-pointer hover:underline"
              >
                Sign up
              </span>
            </p>

            <p
              className="hover:cursor-pointer hover:underline"
              onClick={() => router.push('/')}
            >
              Back to Home
            </p>
          </div>
        </form>
      </Form>
    </div>
  );
}
