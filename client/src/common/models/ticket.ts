import { categorySchema } from './category'
import { userSchema } from './user'
import { z } from 'zod'

export enum ETicketStatus {
  'pending' = 'pending',
  'in_progress' = 'in_progress',
  'resolved' = 'resolved',
  'canceled' = 'canceled',
}

export const ticketSchema = z
  .object({
    _id: z.string().min(1),
    title: z.string().min(1),
    description: z.string().min(1),
    asignee: userSchema.partial().optional(),
    dueDate: z.coerce.date().optional(),
    ticketCategory: categorySchema
      .omit({
        createdBy: true,
      })
      .optional(),
    status: z.nativeEnum(ETicketStatus).optional(),
    createdBy: userSchema.partial().optional(),
  })
  .passthrough()

export type TTicket = z.infer<typeof ticketSchema>

export interface ITicket extends TTicket {}

export const ticketFormSchema = z.object({
  title: z.string().min(1, 'Title must not be empty'),
  description: z.string().min(1, 'Description must not be empty'),

  asignee: z.string().min(1).optional(),
  dueDate: z.string().optional(),
  ticketCategory: z.string().min(1).optional(),
  status: z.nativeEnum(ETicketStatus).optional(),
})

export type TTicketForm = z.infer<typeof ticketFormSchema>
