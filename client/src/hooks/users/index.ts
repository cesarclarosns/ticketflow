import { IUser } from '@common/models'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useEffect, useState } from 'react'
import { useApi } from '@hooks/use-api'
import { TUser } from '@/src/common/models/user'

export const useCurrentUser = () => {
  const { api } = useApi()

  return useQuery(
    ['users', 'me'],
    async (): Promise<IUser> => {
      const response = await api.get(`/users/me`)
      return response.data
    },
    {}
  )
}

export const useUser = (id: string) => {
  const { api } = useApi()

  return useQuery(['users', id], async (): Promise<IUser> => {
    const response = await api.get(`/users/${id}`)
    return response.data
  })
}

export const useUsers = (data: {
  skip: number
  limit: number
  sort?: string
  filter?: string
}) => {
  const { api } = useApi()

  return useQuery(
    ['users', data],
    async (): Promise<IUser[]> => {
      const searchParams = new URLSearchParams()
      if (data.skip) searchParams.append('skip', `${data.skip}`)
      if (data.limit) searchParams.append('limit', `${data.limit}`)
      if (data.sort) searchParams.append('sort', data.sort)

      let searchParamsString = searchParams.toString()
      if (data.filter)
        searchParamsString = searchParamsString + `&filter=${data.filter}`

      const response = await api.get(`/users?${searchParamsString}`)
      return response.data
    },
    {}
  )
}

export const useUpdateUser = (id: string) => {
  const { api } = useApi()
  const client = useQueryClient()

  const updateUser = async (data: Partial<TUser>) => {
    const response = await api.patch(`/users/${id}`, data)
    return response.data
  }

  return useMutation({
    mutationFn: updateUser,
    onSuccess: () => {
      client.invalidateQueries(['users', 'me'])
    },
  })
}
