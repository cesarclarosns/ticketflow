import { z } from 'zod';

import { userSchema } from '../users/user';

export const categorySchema = z
  .object({
    _id: z.string().min(1),
    categoryName: z.string().min(1),
    createdBy: userSchema.partial(),
    description: z.string().min(1).optional(),
  })
  .passthrough();

export type Category = z.infer<typeof categorySchema>;
