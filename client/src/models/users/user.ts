import { z } from 'zod';

export enum EUserGender {
  'male' = 'male',
  'female' = 'female',
  'other' = 'other',
}

export const userSchema = z.object({
  _id: z.string().min(1),
  birthday: z.coerce.date(),
  email: z.string().email(),
  firstName: z.string().min(1, 'First name must not be empty'),
  gender: z.nativeEnum(EUserGender),
  lastConnection: z.coerce.date().optional(),
  lastName: z.string().min(1, 'Last name must not be empty'),
  lastUpdate: z.coerce.date().optional(),
});

export type User = z.infer<typeof userSchema>;
