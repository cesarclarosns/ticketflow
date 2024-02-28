import { TestBed } from '@automock/jest';
import mongoose, { HydratedDocument, UpdateWriteOpResult } from 'mongoose';
import * as httpMocks from 'node-mocks-http';

import { TokenPayload } from '@/features/auth/auth.types';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

describe('TicketsController', () => {
  let ticketsController: TicketsController;
  let ticketsService: jest.Mocked<TicketsService>;

  const tokenPayload: TokenPayload = {
    sub: new mongoose.Types.ObjectId().toString(),
  };

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(TicketsController).compile();
    ticketsController = unit;
    ticketsService = unitRef.get(TicketsService);
  });

  it('should be defined', () => {
    expect(ticketsController).toBeDefined();
  });

  describe('create', () => {
    it('should return a created ticket', async () => {
      const createTicketDto = { title: 'A' } as CreateTicketDto;

      ticketsService.create.mockResolvedValue(createTicketDto as any);

      const request = httpMocks.createRequest({
        user: tokenPayload,
      });

      expect(
        await ticketsController.create(request, createTicketDto),
      ).toMatchObject(createTicketDto);
    });
  });

  describe('findAll', () => {
    it('should return an object that contains the reults', async () => {
      const result = { results: [{ title: 'A' }] };

      ticketsService.findAll.mockResolvedValue(result as any);

      const request = httpMocks.createRequest({
        user: tokenPayload,
      });

      expect(
        await ticketsController.findAll(request, {
          limit: '10',
          skip: '0',
          userId: '',
        }),
      ).toBe(result as any);

      expect(
        await ticketsController.findAll(request, {
          limit: '10',
          skip: '0',
          userId: '',
        }),
      ).toBe(result as any);
    });
  });

  describe('findOne', () => {
    it('should return a ticket', async () => {
      const ticket = { title: 'A' } as HydratedDocument<Ticket>;

      ticketsService.findOne.mockResolvedValue(ticket);

      const request = httpMocks.createRequest({
        user: tokenPayload,
      });

      const id = new mongoose.Types.ObjectId().toString();
      expect(await ticketsController.findOne(request, id)).toMatchObject(
        ticket,
      );
    });
  });

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult;

      ticketsService.update.mockResolvedValue(updateResult);

      const request = httpMocks.createRequest({
        user: tokenPayload,
      });

      const id = new mongoose.Types.ObjectId().toString();
      expect(await ticketsController.update(request, id, {})).toMatchObject(
        updateResult,
      );
    });
  });

  describe('remove', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult;

      ticketsService.remove.mockResolvedValue(updateResult as any);

      const request = httpMocks.createRequest({
        user: tokenPayload,
      });

      const id = new mongoose.Types.ObjectId().toString();
      expect(await ticketsController.remove(request, id)).toMatchObject(
        updateResult,
      );
    });
  });
});
