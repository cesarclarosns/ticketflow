import { z } from 'zod'
import { userSchema } from './user'

export const categorySchema = z
  .object({
    _id: z.string().min(1),
    categoryName: z.string().min(1),
    description: z.string().min(1).optional(),
    createdBy: userSchema.partial(),
  })
  .passthrough()

export type TCategory = z.infer<typeof categorySchema>

export interface ICategory extends TCategory {}

export const categoryFormSchema = z.object({
  categoryName: z.string().min(1, 'Category name must not be empty'),
  description: z.string().min(1, 'Description must not be empty').optional(),
})

export type TCategoryForm = z.infer<typeof categoryFormSchema>
