import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { Factory } from 'nestjs-seeder';

export enum ETicketStatus {
  'pending' = 'pending',
  'in_progress' = 'in_progress',
  'resolved' = 'resolved',
  'canceled' = 'canceled',
}

@Schema({
  collection: 'tickets',
  timestamps: true,
  versionKey: false,
})
export class Ticket extends Document {
  @Factory((faker) => faker.lorem.words({ max: 3, min: 1 }))
  @Prop({ required: true, type: String })
  title: string;

  @Factory((faker) => faker.lorem.words({ max: 3, min: 1 }))
  @Prop({ required: true, type: String })
  description: string;

  @Factory((faker, ctx) => ctx.asignee)
  @Prop({ ref: 'users', required: true, type: mongoose.Schema.Types.ObjectId })
  asignee: mongoose.Types.ObjectId;

  @Factory((faker) => faker.date.soon({ days: 30 }))
  @Prop({ default: new Date(9999, 11), type: Date })
  dueDate: string;

  @Factory((faker, ctx) => ctx.ticketCategory)
  @Prop({ ref: 'categories', type: mongoose.Schema.Types.ObjectId })
  ticketCategory: string;

  @Factory((faker) => faker.helpers.arrayElement(Object.values(ETicketStatus)))
  @Prop({ default: ETicketStatus.pending, enum: ETicketStatus, type: String })
  status: ETicketStatus;

  @Factory((faker, ctx) => ctx.createdBy)
  @Prop({ ref: 'users', required: true, type: mongoose.Schema.Types.ObjectId })
  createdBy: mongoose.Types.ObjectId;
}

export const TicketSchema = SchemaFactory.createForClass(Ticket);

TicketSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});
