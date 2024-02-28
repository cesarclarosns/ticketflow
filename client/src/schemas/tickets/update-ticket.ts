import { type z } from 'zod';

import { createTicketSchema } from './create-ticket';

export const updateTicketSchema = createTicketSchema.partial();

export type UpdateTicket = z.infer<typeof updateTicketSchema>;
