import { type z } from 'zod';

import { createCategorySchema } from './create-category';

export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategory = z.infer<typeof updateCategorySchema>;
