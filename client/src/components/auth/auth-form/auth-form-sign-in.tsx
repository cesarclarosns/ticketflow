/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
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
import { zodResolver } from '@hookform/resolvers/zod'
import { useAuthStore } from '@stores/auth.store'
import { AxiosError } from 'axios'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useSignIn } from '@hooks/auth'
import { TSignInUser, signInUserSchema } from '@common/models/user'

export function AuthFormSignIn() {
  const router = useRouter()
  const { signIn } = useSignIn()
  const { setAuth } = useAuthStore((state) => state)
  const [showPassword, setShowPassword] = useState(false)

  const form = useForm<TSignInUser>({
    defaultValues: {
      email: '',
      password: '',
    },
    resolver: zodResolver(signInUserSchema),
    mode: 'all',
  })

  const onSubmit: SubmitHandler<TSignInUser> = async (data) => {
    try {
      const result = await signIn(data)
      setAuth(result)
      router.push('/app')
    } catch (err) {
      if (err instanceof AxiosError) {
        const errors = err.response?.data?.errors
        if (errors?.email)
          form.setError('email', {
            message: errors.email,
          })
        if (errors?.password)
          form.setError('password', {
            message: errors.password,
          })
      }
    }
  }

  return (
    <div className='flex w-full max-w-[360px] flex-col py-10 sm:px-5'>
      <Form {...form}>
        <h1 className='text-center text-2xl font-bold'>Welcome back</h1>
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

          <div className='text-center text-sm'>
            <p
              className='hover:cursor-pointer hover:underline'
              onClick={() => router.push('/auth/reset-password')}
            >
              Forgot password?
            </p>

            <p>
              Don't have an account?{' '}
              <span
                onClick={() => router.push('/auth/sign-up')}
                className='hover:cursor-pointer hover:underline'
              >
                Sign up
              </span>
            </p>

            <p
              className='hover:cursor-pointer hover:underline'
              onClick={() => router.push('/')}
            >
              Back to Home
            </p>
          </div>
        </form>
      </Form>
    </div>
  )
}
