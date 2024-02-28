import { z } from 'zod';

import { ETicketStatus } from '@/models/tickets/ticket';

export const createTicketSchema = z.object({
  asignee: z.string().min(1).optional(),
  description: z.string().min(1, 'Description must not be empty'),

  dueDate: z.string().optional(),
  status: z.nativeEnum(ETicketStatus).optional(),
  ticketCategory: z.string().min(1).optional(),
  title: z.string().min(1, 'Title must not be empty'),
});

export type CreateTicket = z.infer<typeof createTicketSchema>;
