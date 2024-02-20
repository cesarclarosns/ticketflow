/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form'
import { Icons } from '@components/ui/icons'
import { Input } from '@components/ui/input'
import { useToast } from '@components/ui/use-toast'
import { zodResolver } from '@hookform/resolvers/zod'
import { AxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { z } from 'zod'
import { useResetPassword, useResetPasswordCallback } from '@hooks/auth'
import { useState } from 'react'
import { signInUserSchema, signUpUserSchema } from '@common/models/user'

export function AuthFormResetPassword() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  return (
    <div className='flex w-full flex-1 flex-col items-center justify-center gap-5'>
      {token ? (
        <ResetPasswordForm token={token} />
      ) : (
        <SendResetPasswordEmailForm />
      )}
    </div>
  )
}

const sendResetPasswordEmailFormSchema = signUpUserSchema.pick({ email: true })

type TSendResetPasswordEmailFormSchema = z.infer<
  typeof sendResetPasswordEmailFormSchema
>

export const SendResetPasswordEmailForm = () => {
  const { resetPassword } = useResetPassword()
  const router = useRouter()
  const { toast } = useToast()

  const form = useForm<TSendResetPasswordEmailFormSchema>({
    defaultValues: {
      email: '',
    },
    resolver: zodResolver(sendResetPasswordEmailFormSchema),
    mode: 'all',
  })

  const onSubmit: SubmitHandler<TSendResetPasswordEmailFormSchema> = async (
    data
  ) => {
    try {
      await resetPassword(data)
    } catch (err) {
      if (err instanceof AxiosError) {
        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className='flex w-full max-w-[360px] flex-col gap-5 py-10 sm:px-5'>
      {form.formState.isSubmitSuccessful ? (
        <>
          <h1 className='text-center text-2xl font-bold'>Check your email</h1>

          <p className='text-center'>
            Please check the email address {form.getValues().email} for
            instructions to reset your password.
          </p>

          <Button
            onClick={() => form.handleSubmit(onSubmit)}
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </>
            ) : (
              <>Resend email</>
            )}
          </Button>
        </>
      ) : (
        <Form {...form}>
          <h1 className='text-center text-2xl font-bold'>
            Reset your password
          </h1>

          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='mt-5 flex flex-col gap-5'
          >
            <FormField
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field}></Input>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            ></FormField>

            <Button
              type='submit'
              disabled={!form.formState.isValid || form.formState.isSubmitting}
            >
              {form.formState.isSubmitting ? (
                <>
                  <Icons.Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                  Please wait
                </>
              ) : (
                <>Continue</>
              )}
            </Button>
          </form>
        </Form>
      )}
      <div className='text-center text-sm'>
        <p
          className='hover:cursor-pointer hover:underline'
          onClick={() => router.push('/auth/sign-in')}
        >
          Back to Sign in
        </p>

        <p
          className='hover:cursor-pointer hover:underline'
          onClick={() => router.push('/')}
        >
          Back to Home
        </p>
      </div>
    </div>
  )
}

const resetPasswordFormSchema = signInUserSchema.pick({ password: true })

type TResetPasswordForm = z.infer<typeof resetPasswordFormSchema>

export const ResetPasswordForm = ({ token }: { token: string }) => {
  const { resetPasswordCallback } = useResetPasswordCallback()
  const [showPassword, setShowPassword] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<TResetPasswordForm>({
    defaultValues: {
      password: '',
    },
    resolver: zodResolver(resetPasswordFormSchema),
    mode: 'all',
  })

  const onSubmit: SubmitHandler<TResetPasswordForm> = async (data) => {
    try {
      await resetPasswordCallback({ password: data.password, token })
      toast({
        title: 'Password updated.',
        description: 'Your password has been updated, sign in to continue.',
      })
    } catch (err) {
      if (err instanceof AxiosError) {
        if (err.response?.status == 401) {
          toast({
            title: 'Password reset url is invalid or has expired.',
            description:
              'Try pasting the url into your browser or requesting another password reset url',
            variant: 'destructive',
          })

          router.push('/auth/reset-password')
          return
        }

        toast({
          title: 'Uh oh! Something went wrong.',
          description: 'There was a problem with your request',
          variant: 'destructive',
        })
      }
    }
  }

  return (
    <div className='flex w-full max-w-[360px] flex-col gap-5 py-10 sm:px-5'>
      <Form {...form}>
        <h1 className='text-center text-2xl font-bold'>Create new password</h1>

        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='mt-5 flex flex-col gap-5'
        >
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className='relative'>
                    <Input
                      className='pr-10'
                      placeholder='Password'
                      {...field}
                      type={showPassword ? 'text' : 'password'}
                    ></Input>
                    <div className='absolute inset-y-0 right-0 flex cursor-pointer items-center pr-3 text-gray-400'>
                      {showPassword ? (
                        <Icons.EyeOpenIcon
                          className='h-5 w-5'
                          onClick={() => setShowPassword(false)}
                        />
                      ) : (
                        <Icons.EyeClosedIcon
                          className='h-5 w-5'
                          onClick={() => setShowPassword(true)}
                        />
                      )}
                    </div>
                  </div>
                </FormControl>
                <FormMessage className=' whitespace-pre-wrap' />
              </FormItem>
            )}
          ></FormField>

          <Button
            type='submit'
            disabled={!form.formState.isValid || form.formState.isSubmitting}
          >
            {form.formState.isSubmitting ? (
              <>
                <Icons.Loader2Icon className='mr-2 h-4 w-4 animate-spin' />
                Please wait
              </>
            ) : (
              <>Continue</>
            )}
          </Button>
        </form>
      </Form>

      <div className='text-center text-sm'>
        <p
          className='hover:cursor-pointer hover:underline'
          onClick={() => router.push('/auth/sign-in')}
        >
          Back to Sign in
        </p>

        <p
          className='hover:cursor-pointer hover:underline'
          onClick={() => router.push('/')}
        >
          Back to Home
        </p>
      </div>
    </div>
  )
}
