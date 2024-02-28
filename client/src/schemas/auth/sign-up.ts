import { z } from 'zod';

import { userSchema } from '@/models/users/user';

export const signUpSchema = userSchema
  .pick({
    birthday: true,
    email: true,
    firstName: true,
    gender: true,
    lastName: true,
  })
  .required()
  .extend({
    password: z
      .string()
      .min(10, 'Password is too short (minimum is 10 characters)')
      .max(20, 'Password is too long (maximum is 30 characters)'),
  });

export type SignUp = z.infer<typeof signUpSchema>;
