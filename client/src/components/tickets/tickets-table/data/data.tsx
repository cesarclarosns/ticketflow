import { ETicketStatus } from '@common/models/ticket'
import { Icons } from '@components/ui/icons'

export const statuses = [
  {
    value: ETicketStatus.pending,
    label: 'Pending',
    icon: Icons.CircleIcon,
  },
  {
    value: ETicketStatus.in_progress,
    label: 'In progress',
    icon: Icons.StopwatchIcon,
  },
  {
    value: ETicketStatus.resolved,
    label: 'Resolved',
    icon: Icons.CheckCircledIcon,
  },
  {
    value: ETicketStatus.canceled,
    label: 'Canceled',
    icon: Icons.CrossCircledIcon,
  },
]
