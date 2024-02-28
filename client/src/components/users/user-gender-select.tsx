import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EUserGender } from '@/models/users/user';

const genders: { value: EUserGender; label: string }[] = [
  {
    label: 'Female',
    value: EUserGender.female,
  },
  {
    label: 'Male',
    value: EUserGender.male,
  },
  {
    label: 'Other',
    value: EUserGender.other,
  },
];

export function UserGenderSelect({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string | undefined;
  onValueChange: (value: string) => void;
}) {
  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select gender" />
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
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
