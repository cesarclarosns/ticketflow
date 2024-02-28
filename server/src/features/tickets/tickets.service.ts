import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { FindAllTicketsDto } from './dto/find-all-tickets.dto';
import { FindAllTicketsResponseBodyDto } from './dto/find-all-tickets-response.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';

@Injectable()
export class TicketsService {
  constructor(
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket> & SoftDeleteModel<Ticket>,
  ) {}

  async create(createTicketDto: CreateTicketDto) {
    return await this.ticketModel.create(createTicketDto);
  }

  async findAll({
    query,
    sort,
    ticketCategories,
    statuses,
    skip,
    limit,
    userId,
  }: FindAllTicketsDto): Promise<FindAllTicketsResponseBodyDto> {
    const result = await this.ticketModel.aggregate(
      [
        {
          $match: {
            $and: [
              {
                $or: [
                  { asignee: new mongoose.Types.ObjectId(userId) },
                  { createdBy: new mongoose.Types.ObjectId(userId) },
                ],
              },
              ...(!!statuses ? [{ status: { $in: statuses } }] : []),
              ...(!!ticketCategories
                ? [
                    {
                      ticketCategory: {
                        $in: ticketCategories.map(
                          (id) => new mongoose.Types.ObjectId(id),
                        ),
                      },
                    },
                  ]
                : []),
              ...(!!query
                ? [{ title: { $options: 'i', $regex: new RegExp(query) } }]
                : []),
            ],
          },
        },
        {
          $lookup: {
            as: 'asignee',
            foreignField: '_id',
            from: 'users',
            localField: 'asignee',
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
            as: 'createdBy',
            foreignField: '_id',
            from: 'users',
            localField: 'createdBy',
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
            as: 'ticketCategory',
            foreignField: '_id',
            from: 'categories',
            localField: 'ticketCategory',
          },
        },
        { $set: { ticketCategory: { $first: '$ticketCategory' } } },
        {
          $sort: {
            ...(!!sort
              ? {
                  [sort.replace('-', '')]: sort.startsWith('-') ? -1 : 1,
                }
              : { title: 1 }),
          },
        },
        {
          $facet: {
            results: [
              ...(skip ? [{ $skip: +skip }] : []),
              ...(limit ? [{ $limit: +limit }] : []),
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
    );

    return result[0];
  }

  async findOne(filter: { ticketId: string; userId: string }) {
    const tickets = await this.ticketModel.aggregate([
      {
        $match: {
          $and: [
            {
              $or: [
                { asignee: new mongoose.Types.ObjectId(filter.userId) },
                { createdBy: new mongoose.Types.ObjectId(filter.userId) },
              ],
            },
            { _id: new mongoose.Types.ObjectId(filter.ticketId) },
          ],
        },
      },
      {
        $lookup: {
          as: 'asignee',
          foreignField: '_id',
          from: 'users',
          localField: 'asignee',
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
          as: 'createdBy',
          foreignField: '_id',
          from: 'users',
          localField: 'createdBy',
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
          as: 'ticketCategory',
          foreignField: '_id',
          from: 'categories',
          localField: 'ticketCategory',
        },
      },
      { $set: { ticketCategory: { $first: '$ticketCategory' } } },
      { $limit: 1 },
    ]);

    return tickets.at(0);
  }

  async update(
    filter: { ticketId: string; userId: string },
    updateTicketDto: UpdateTicketDto,
  ) {
    return await this.ticketModel.updateOne(
      { _id: filter.ticketId, createdBy: filter.userId },
      { $set: updateTicketDto },
    );
  }

  async remove(filter: { ticketId: string; userId: string }) {
    return await this.ticketModel.delete({
      _id: filter.ticketId,
      createdBy: filter.userId,
    });
  }
}
