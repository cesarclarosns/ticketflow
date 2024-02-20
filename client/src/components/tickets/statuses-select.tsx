import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'
import { statuses } from './tickets-table/data/data'

export function StatutesSelect({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string | undefined
  onValueChange: (value: string) => void
}) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder='Select status' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Status</SelectLabel>
          {statuses &&
            statuses.map((status) => {
              return (
                <SelectItem key={status.value} value={status.value}>
                  {status.label}
                </SelectItem>
              )
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
