import { Icons } from '@/components/ui/icons';
import { ETicketStatus } from '@/models/tickets/ticket';

export const statuses = [
  {
    icon: Icons.CircleIcon,
    label: 'Pending',
    value: ETicketStatus.pending,
  },
  {
    icon: Icons.StopwatchIcon,
    label: 'In progress',
    value: ETicketStatus.in_progress,
  },
  {
    icon: Icons.CheckCircledIcon,
    label: 'Resolved',
    value: ETicketStatus.resolved,
  },
  {
    icon: Icons.CrossCircledIcon,
    label: 'Canceled',
    value: ETicketStatus.canceled,
  },
];
