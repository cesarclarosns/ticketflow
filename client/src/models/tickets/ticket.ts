import { z } from 'zod';

import { categorySchema } from '../categories/category';
import { userSchema } from '../users/user';

export enum ETicketStatus {
  'pending' = 'pending',
  'in_progress' = 'in_progress',
  'resolved' = 'resolved',
  'canceled' = 'canceled',
}

export const ticketSchema = z
  .object({
    _id: z.string().min(1),
    asignee: userSchema.partial().optional(),
    createdBy: userSchema.partial().optional(),
    description: z.string().min(1),
    dueDate: z.coerce.date().optional(),
    status: z.nativeEnum(ETicketStatus).optional(),
    ticketCategory: categorySchema
      .omit({
        createdBy: true,
      })
      .optional(),
    title: z.string().min(1),
  })
  .passthrough();

export type Ticket = z.infer<typeof ticketSchema>;
