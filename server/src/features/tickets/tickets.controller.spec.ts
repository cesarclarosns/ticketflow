import { TicketsController } from './tickets.controller'
import { TicketsService } from './tickets.service'
import { TestBed } from '@automock/jest'
import { CreateTicketDto } from './dto'
import * as httpMocks from 'node-mocks-http'
import mongoose, { UpdateWriteOpResult } from 'mongoose'
import { TTokenPayload } from '@features/auth/auth.types'
import { TicketDocument } from '@features/tickets/entities/ticket.entity'

describe('TicketsController', () => {
  let ticketsController: TicketsController
  let ticketsService: jest.Mocked<TicketsService>

  const tokenPayload: TTokenPayload = {
    sub: new mongoose.Types.ObjectId().toString(),
    email: 'email@example.com',
  }

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(TicketsController).compile()
    ticketsController = unit
    ticketsService = unitRef.get(TicketsService)
  })

  it('should be defined', () => {
    expect(ticketsController).toBeDefined()
  })

  describe('create', () => {
    it('should return a created ticket', async () => {
      const createTicketDto = { title: 'A' } as CreateTicketDto

      ticketsService.create.mockResolvedValue(createTicketDto as any)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      expect(
        await ticketsController.create(request, createTicketDto),
      ).toMatchObject(createTicketDto)
    })
  })

  describe('findAll', () => {
    it('should return an object that contains the reults', async () => {
      const result = { results: [{ title: 'A' }] }

      ticketsService.findAll.mockResolvedValue(result as any)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      expect(
        await ticketsController.findAll(request, {
          skip: '0',
          limit: '10',
          filter:
            '{"$and":[{"status":{"$in":["pending"]}},{"ticketCategory":{"$in":["6567f53cc8035358c9f1e8aa"]}},{"title":"Awesome ticket"}]}',
        }),
      ).toBe(result as any)

      expect(
        await ticketsController.findAll(request, { skip: '0', limit: '10' }),
      ).toBe(result as any)
    })
  })

  describe('findOne', () => {
    it('should return a ticket', async () => {
      const ticket = { title: 'A' } as TicketDocument

      ticketsService.findOne.mockResolvedValue(ticket)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      const id = new mongoose.Types.ObjectId().toString()
      expect(await ticketsController.findOne(request, id)).toMatchObject(ticket)
    })
  })

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      ticketsService.update.mockResolvedValue(updateResult)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      const id = new mongoose.Types.ObjectId().toString()
      expect(await ticketsController.update(request, id, {})).toMatchObject(
        updateResult,
      )
    })
  })

  describe('remove', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      ticketsService.remove.mockResolvedValue(updateResult as any)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      const id = new mongoose.Types.ObjectId().toString()
      expect(await ticketsController.remove(request, id)).toMatchObject(
        updateResult,
      )
    })
  })
})
