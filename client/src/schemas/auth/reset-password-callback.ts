import { z } from 'zod';

import { signUpSchema } from './sign-up';

export const resetPasswordCallbackSchema = signUpSchema
  .pick({
    password: true,
  })
  .extend({
    token: z.string().min(1),
  });

export type ResetPasswordCallback = z.infer<typeof resetPasswordCallbackSchema>;
