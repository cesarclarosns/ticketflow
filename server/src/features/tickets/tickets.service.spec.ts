import { TicketsService } from '@features/tickets/tickets.service'
import { Ticket, TicketDocument } from './entities/ticket.entity'
import { TestBed } from '@automock/jest'
import { getModelToken } from '@nestjs/mongoose'
import mongoose, { Model, UpdateWriteOpResult } from 'mongoose'
import { CreateTicketDto } from '@features/tickets/dto'
import { SoftDeleteModel } from 'mongoose-delete'

describe('TicketsService', () => {
  let ticketsService: TicketsService
  let ticketModel: jest.Mocked<Model<Ticket>> & SoftDeleteModel<TicketDocument>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(TicketsService).compile()
    ticketsService = unit
    ticketModel = unitRef.get(getModelToken(Ticket.name)) as any
  })

  it('should be defined', () => {
    expect(ticketsService).toBeDefined()
  })

  describe('create', () => {
    it('should return a created ticket', async () => {
      const createTickeDto = { title: 'A' } as CreateTicketDto

      ticketModel.create.mockResolvedValue(createTickeDto as any)

      expect(await ticketsService.create(createTickeDto)).toMatchObject(
        createTickeDto,
      )
    })
  })

  describe('findAll', () => {
    it('should return an object that contains the results', async () => {
      const result = { results: [{ title: 'A' }] }

      ticketModel.aggregate.mockResolvedValue([result] as any)

      expect(
        await ticketsService.findAll({
          filter: {},
          skip: 0,
          limit: 10,
          sort: {},
        }),
      ).toMatchObject(result)

      expect(
        await ticketsService.findAll({
          filter: {},
          limit: 10,
          sort: {},
        }),
      ).toMatchObject(result)

      expect(
        await ticketsService.findAll({
          filter: {},
          sort: {},
        }),
      ).toMatchObject(result)
    })
  })

  describe('findOne', () => {
    it('should return a ticket', async () => {
      const ticket = { title: 'A' } as TicketDocument

      ticketModel.aggregate.mockResolvedValue([ticket])

      const id = new mongoose.Types.ObjectId().toString()
      expect(await ticketsService.findOne(id, {})).toMatchObject(ticket)
    })

    it('should return null if there are no tickets', async () => {
      ticketModel.aggregate.mockResolvedValue([])

      const id = new mongoose.Types.ObjectId().toString()
      expect(await ticketsService.findOne(id, {})).toBe(null)
    })
  })

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      ticketModel.updateOne.mockResolvedValue(updateResult)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await ticketsService.update(id, {}, {})).toMatchObject(
        updateResult,
      )
    })
  })

  describe('remove', () => {
    it('should return the udpate result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      jest.spyOn(ticketModel, 'delete').mockResolvedValue(updateResult as any)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await ticketsService.remove(id, {})).toMatchObject(updateResult)
    })
  })
})
