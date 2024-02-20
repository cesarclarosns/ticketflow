import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { FilterQuery, HydratedDocument } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Factory } from 'nestjs-seeder'

export enum ETicketStatus {
  'pending' = 'pending',
  'in_progress' = 'in_progress',
  'resolved' = 'resolved',
  'canceled' = 'canceled',
}

@Schema({
  timestamps: true,
  collection: 'tickets',
})
export class Ticket {
  @Factory((faker) => faker.lorem.words({ min: 1, max: 3 }))
  @Prop({ required: true, type: String })
  title: string

  @Factory((faker) => faker.lorem.words({ min: 1, max: 3 }))
  @Prop({ required: true, type: String })
  description: string

  @Factory((faker, ctx) => ctx.asignee)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  asignee: string

  @Factory((faker) => faker.date.soon({ days: 30 }))
  @Prop({ type: Date, default: new Date(9999, 11) })
  dueDate: string

  @Factory((faker, ctx) => ctx.ticketCategory)
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'categories' })
  ticketCategory: string

  @Factory((faker) => faker.helpers.arrayElement(Object.values(ETicketStatus)))
  @Prop({ type: String, enum: ETicketStatus, default: ETicketStatus.pending })
  status: ETicketStatus

  @Factory((faker, ctx) => ctx.createdBy)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: 'users' })
  createdBy: string
}

export type TicketDocument = HydratedDocument<Ticket>
export const TicketSchema = SchemaFactory.createForClass(Ticket)
TicketSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
})

export type TicketFilterQuery = FilterQuery<TicketDocument>
