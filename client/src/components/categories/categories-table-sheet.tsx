import { type DialogProps } from '@radix-ui/react-alert-dialog';

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

import { CategoriesTable } from './categories-table';

export function CategoriesTableSheet({
  open,
  onOpenChange,
}: {
  open: DialogProps['open'];
  onOpenChange: DialogProps['onOpenChange'];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="max-h-screen overflow-y-scroll lg:max-w-[500px]">
        <SheetHeader className="">
          <SheetTitle>Categories</SheetTitle>
          <SheetDescription>Manage your categories here.</SheetDescription>
        </SheetHeader>

        <div className="py-6">
          <CategoriesTable />
        </div>
      </SheetContent>
    </Sheet>
  );
}
