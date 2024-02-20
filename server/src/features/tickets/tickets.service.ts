import { Injectable } from '@nestjs/common'
import { CreateTicketDto } from './dto/create-ticket.dto'
import { UpdateTicketDto } from './dto/update-ticket.dto'
import { InjectModel } from '@nestjs/mongoose'
import {
  Ticket,
  TicketDocument,
  TicketFilterQuery,
} from './entities/ticket.entity'
import mongoose, { Model } from 'mongoose'
import { SoftDeleteModel } from 'mongoose-delete'
import { FindAllTicketsResponseBodyDto } from './dto/find-all-tickets-response-body.dto'

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket> & SoftDeleteModel<TicketDocument>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    return await this.ticketModel.create(createTicketDto)
  }

  async findAll({
    filter,
    skip = 0,
    limit,
    sort,
  }: {
    filter: TicketFilterQuery
    sort: any
    skip?: number
    limit?: number
  }): Promise<FindAllTicketsResponseBodyDto> {
    const result = await this.ticketModel.aggregate(
      [
        { $match: { ...filter } },
        {
          $lookup: {
            from: 'users',
            localField: 'asignee',
            foreignField: '_id',
            as: 'asignee',
            pipeline: [
              {
                $project: {
                  email: 1,
                  firstName: 1,
                  lastName: 1,
                },
              },
            ],
          },
        },
        { $set: { asignee: { $first: '$asignee' } } },
        {
          $lookup: {
            from: 'users',
            localField: 'createdBy',
            foreignField: '_id',
            as: 'createdBy',
            pipeline: [
              {
                $project: {
                  email: 1,
                  firstName: 1,
                  lastName: 1,
                },
              },
            ],
          },
        },
        { $set: { createdBy: { $first: '$createdBy' } } },
        {
          $lookup: {
            from: 'categories',
            localField: 'ticketCategory',
            foreignField: '_id',
            as: 'ticketCategory',
          },
        },
        { $set: { ticketCategory: { $first: '$ticketCategory' } } },
        ...(sort ? [{ $sort: { ...sort } }] : []),
        {
          $facet: {
            results: [
              ...(skip ? [{ $skip: skip }] : []),
              ...(limit ? [{ $limit: limit }] : []),
            ],
            totalCount: [
              {
                $count: 'count',
              },
            ],
          },
        },
        { $set: { totalCount: { $first: '$totalCount' } } },
      ],
      { collation: { locale: 'en_US' } },
    )

    return result[0]
  }

  async findOne(id: string, filter: TicketFilterQuery) {
    const tickets = await this.ticketModel.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(id), ...filter } },
      {
        $lookup: {
          from: 'users',
          localField: 'asignee',
          foreignField: '_id',
          as: 'asignee',
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },
      { $set: { asignee: { $first: '$asignee' } } },
      {
        $lookup: {
          from: 'users',
          localField: 'createdBy',
          foreignField: '_id',
          as: 'createdBy',
          pipeline: [
            {
              $project: {
                password: 0,
              },
            },
          ],
        },
      },
      { $set: { createdBy: { $first: '$createdBy' } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'ticketCategory',
          foreignField: '_id',
          as: 'ticketCategory',
        },
      },
      { $set: { ticketCategory: { $first: '$ticketCategory' } } },
      { $limit: 1 },
    ])

    if (tickets.length) return tickets[0]
    return null
  }

  async update(
    id: string,
    filter: TicketFilterQuery,
    updateTicketDto: UpdateTicketDto,
  ) {
    return await this.ticketModel.updateOne(
      { _id: id, ...filter },
      { $set: updateTicketDto },
    )
  }

  async remove(id: string, filter: TicketFilterQuery) {
    return await this.ticketModel.delete({ _id: id, ...filter })
  }
}
