import { ITicket, IUser } from '@common/models'
import { useQuery, useMutation, useQueryClient } from 'react-query'
import { useApi } from '@hooks/use-api'
import { useToast } from '@components/ui/use-toast'
import { z } from 'zod'
import { TTicket, TTicketForm, ticketSchema } from '@common/models/ticket'

export const useTickets = (data: {
  skip?: number
  limit?: number
  sort?: string
  filter?: string
}) => {
  const { api } = useApi()

  const searchParams = new URLSearchParams()

  if (data.skip) searchParams.append('skip', data.skip.toString())
  if (data.limit) searchParams.append('limit', data.limit.toString())
  if (data.sort) searchParams.append('sort', data.sort)

  let searchParamsString = searchParams.toString()
  if (data.filter)
    searchParamsString = searchParamsString + `&filter=${data.filter}`

  const responseDataSchema = z.object({
    results: z.array(ticketSchema),
    totalCount: z
      .object({
        count: z.number(),
      })
      .optional(),
  })

  return useQuery(
    ['tickets', data],
    async (): Promise<z.infer<typeof responseDataSchema>> => {
      const response = await api.get(`/tickets?${searchParamsString}`)

      return responseDataSchema.parse(response.data, {})
    }
  )
}

export const useTicket = (id: string) => {
  const { api } = useApi()

  return useQuery(['tickets', id], async (): Promise<TTicket> => {
    const response = await api.get(`/tickets/${id}`)
    return response.data
  })
}

export const useUpdateTicket = (id: string) => {
  const { api } = useApi()
  const client = useQueryClient()

  const updateTicket = async (data: Partial<TTicketForm>) => {
    const response = await api.patch(`/tickets/${id}`, data)
    return response.data
  }

  return useMutation({
    mutationFn: updateTicket,
    onSuccess: () => {
      client.invalidateQueries(['tickets'])
      client.invalidateQueries(['tickets', id])
    },
  })
}

export const useCreateTicket = () => {
  const { api } = useApi()
  const client = useQueryClient()

  const createTicket = async (data: TTicketForm) => {
    const response = await api.post('/tickets', data)
    return response.data
  }

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      client.invalidateQueries(['tickets'])
    },
  })
}

export const useDeleteTicket = (id: string) => {
  const { api } = useApi()
  const client = useQueryClient()

  const deleteTicket = async () => {
    const response = await api.delete(`/tickets/${id}`)
    return response.data
  }

  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      client.invalidateQueries(['tickets'])
      client.invalidateQueries(['tickets', id])
    },
  })
}
