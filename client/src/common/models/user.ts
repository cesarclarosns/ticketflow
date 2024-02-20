import { z } from 'zod'

export enum EUserGender {
  'male' = 'male',
  'female' = 'female',
  'other' = 'other',
}

export const userSchema = z.object({
  _id: z.string().min(1),
  email: z.string().email(),
  gender: z.nativeEnum(EUserGender),
  birthday: z.coerce.date(),
  firstName: z.string().min(1, 'First name must not be empty'),
  lastName: z.string().min(1, 'Last name must not be empty'),
  lastConnection: z.coerce.date().optional(),
  lastUpdate: z.coerce.date().optional(),
})

export type TUser = z.infer<typeof userSchema>

export interface IUser extends TUser {}

export const signUpUserSchema = userSchema
  .pick({
    firstName: true,
    lastName: true,
    email: true,
    gender: true,
    birthday: true,
  })
  .required()
  .extend({
    password: z
      .string()
      .min(10, 'Password is too short (minimum is 10 characters)')
      .max(20, 'Password is too long (maximum is 30 characters)'),
  })

export type TSignUpUser = z.infer<typeof signUpUserSchema>

export const signInUserSchema = signUpUserSchema.pick({
  email: true,
  password: true,
})

export type TSignInUser = z.infer<typeof signInUserSchema>
