import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetCategoriesQuery } from '@/hooks/categories/use-get-categories-query';

export function CategoriesSelect({
  defaultValue,
  onValueChange,
}: {
  defaultValue: string | undefined;
  onValueChange: (value: string) => void;
}) {
  const { data: categories } = useGetCategoriesQuery({ sort: 'categoryName' });

  return (
    <Select onValueChange={onValueChange} defaultValue={defaultValue}>
      <SelectTrigger>
        <SelectValue placeholder="Select a category" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Categories</SelectLabel>
          {categories &&
            categories.map((category) => {
              return (
                <SelectItem key={category._id} value={category._id}>
                  {category.categoryName}
                </SelectItem>
              );
            })}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
