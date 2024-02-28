import { type DialogProps } from '@radix-ui/react-alert-dialog';
import { useRouter } from 'next/navigation';
import * as React from 'react';

import { Button, type ButtonProps } from '@/components/ui/button';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { Icons } from '@/components/ui/icons';
import { cn } from '@/libs/utils';

const internalLinks: { href: string; label: string }[] = [
  {
    href: '/',
    label: 'Home',
  },
  {
    href: '/app/tickets',
    label: 'Tickets',
  },
];

export function CommandMenu({
  className,
  ...props
}: DialogProps & ButtonProps) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <Button
        variant={'outline'}
        className={cn(
          'relative w-full justify-start text-muted-foreground',
          className,
        )}
        onClick={() => setOpen(true)}
        {...props}
      >
        <span className="hidden lg:inline-flex">Search...</span>
        <span className="inline-flex lg:hidden">Search...</span>
        <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Links">
            {internalLinks.map((link) => (
              <CommandItem
                key={link.href}
                value={link.label}
                onSelect={() => {
                  runCommand(() => router.push(link.href));
                }}
              >
                <Icons.FileIcon className="mr-2 h-4 w-4" />
                {link.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
