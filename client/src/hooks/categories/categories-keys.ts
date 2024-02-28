import { type UseGetCategoriesQueryParams } from './use-get-categories-query';

export const categoriesKeys = {
  all: () => ['categories'] as const,
  detail: (id: string | null) => [...categoriesKeys.details(), id] as const,
  details: () => [...categoriesKeys.all(), 'detail'] as const,
  list: (params: UseGetCategoriesQueryParams) => [
    ...categoriesKeys.lists(),
    params,
  ],
  lists: () => [...categoriesKeys.all(), 'list'] as const,
};
