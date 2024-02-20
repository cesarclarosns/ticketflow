import { EUserGender } from '@common/models/user'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@components/ui/select'

const genders: { value: EUserGender; label: string }[] = [
  {
    value: EUserGender.female,
    label: 'Female',
  },
  {
    value: EUserGender.male,
    label: 'Male',
  },
  {
    value: EUserGender.other,
    label: 'Other',
  },
]

export function UserGenderSelect({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string | undefined
  onValueChange: (value: string) => void
}) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder='Select gender' />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Gender</SelectLabel>
          {genders &&
            genders.map((gender) => {
              return (
                <SelectItem key={gender.value} value={gender.value}>
                  {gender.label}
                </SelectItem>
              )
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
