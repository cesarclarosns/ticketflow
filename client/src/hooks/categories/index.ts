import { useApi } from '@hooks/use-api'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { useToast } from '@components/ui/use-toast'
import { AxiosError } from 'axios'
import { TCategory, TCategoryForm } from '@common/models/category'

export const useCategories = (data: { sort?: string }) => {
  const { api } = useApi()

  const searchParams = new URLSearchParams()
  if (data.sort) searchParams.append('sort', data.sort)

  let searchParamsString = searchParams.toString()

  return useQuery(['categories', data], async (): Promise<TCategory[]> => {
    const response = await api.get(`/categories?${searchParamsString}`)
    return response.data
  })
}

export const useCategory = (id: string) => {
  const { api } = useApi()

  return useQuery(['categories', id], async (): Promise<TCategory> => {
    const response = await api.get(`/categories/${id}`)
    return response.data
  })
}

export const useUpdateCategory = (id: string) => {
  const { api } = useApi()
  const client = useQueryClient()

  const updateCategory = async (data: Partial<TCategoryForm>) => {
    const response = await api.patch(`/categories/${id}`, data)
    return response.data
  }

  return useMutation({
    mutationFn: updateCategory,
    onSuccess: () => {
      client.invalidateQueries(['tickets'])
      client.invalidateQueries(['categories'])
      client.invalidateQueries(['categories', id])
    },
  })
}

export const useCreateCategory = () => {
  const { api } = useApi()
  const client = useQueryClient()

  const createCategory = async (data: TCategoryForm) => {
    const response = await api.post('/categories', data)
    return response.data
  }

  return useMutation({
    mutationFn: createCategory,
    onSuccess(data, variables, context) {
      client.invalidateQueries(['categories'])
    },
  })
}

export const useDeleteCategory = (id: string) => {
  const { api } = useApi()
  const client = useQueryClient()

  const deleteCategory = async () => {
    const response = await api.delete(`/categories/${id}`)
    return response.data
  }

  return useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      client.invalidateQueries(['categories'])
      client.invalidateQueries(['categories', id])
    },
  })
}
