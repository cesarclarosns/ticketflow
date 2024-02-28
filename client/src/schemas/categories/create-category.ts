import { z } from 'zod';

export const createCategorySchema = z.object({
  categoryName: z.string().min(1, 'Category name must not be empty'),
  description: z.string().min(1, 'Description must not be empty').optional(),
});

export type CreateCategory = z.infer<typeof createCategorySchema>;
