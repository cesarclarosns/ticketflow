import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import { Icons } from '@/components/ui/icons';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useDebounce } from '@/hooks/use-debounce';
import { useGetUserQuery } from '@/hooks/users/use-get-user-query';
import { useGetUsersQuery } from '@/hooks/users/use-get-users-query';

export function UsersCombobox({
  value,
  onValueChange,
}: {
  value: string | undefined;
  onValueChange: (value: string) => void;
}) {
  const [commandInput, setCommandInput] = useState('');
  const [open, setOpen] = useState(false);
  const debouncedCommandInput = useDebounce(commandInput);

  //Handle server side filter
  const getFilter = () => {
    const filters: { [key: string]: any } = {};

    if (debouncedCommandInput.length) {
      filters['email'] = debouncedCommandInput;
      return JSON.stringify(filters);
    }

    return '';
  };

  const { data: users } = useGetUsersQuery({
    limit: 50,
    skip: 0,
    sort: 'email',
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="justify-between"
        >
          {value ? <UsersComboboxValue id={value} /> : 'Select a user...'}
          <Icons.ChevronsUpDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0">
        <Command shouldFilter={false} value={value}>
          <CommandInput
            placeholder="Search a user by email..."
            value={commandInput}
            onValueChange={setCommandInput}
          />
          <CommandEmpty>No user found.</CommandEmpty>
          <CommandGroup>
            {users &&
              users.map((user) => (
                <CommandItem
                  key={user._id}
                  value={user._id}
                  className=" truncate"
                  onSelect={(value) => {
                    onValueChange(value);
                  }}
                >
                  <span className=" truncate">{user.email}</span>
                </CommandItem>
              ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

function UsersComboboxValue({ id }: { id: string }) {
  const { data: user } = useGetUserQuery(id);

  return <span>{user && user.email}</span>;
}
