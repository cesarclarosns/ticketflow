import { type z } from 'zod';

import { userSchema } from '@/models/users/user';

export const updateUserSchema = userSchema.partial();

export type UpdateUser = z.infer<typeof updateUserSchema>;
