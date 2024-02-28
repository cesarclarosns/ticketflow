import { type z } from 'zod';

import { signUpSchema } from './sign-up';

export const signInSchema = signUpSchema.pick({
  email: true,
  password: true,
});

export type SignIn = z.infer<typeof signInSchema>;
