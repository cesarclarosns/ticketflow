import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { FilterQuery, HydratedDocument } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Factory } from 'nestjs-seeder'

export enum EUserGender {
  'male' = 'male',
  'female' = 'female',
}

@Schema({
  timestamps: {
    createdAt: 'lastUpdate',
    updatedAt: 'lastUpdate',
  },
  collection: 'users',
})
export class User {
  @Factory((faker) => faker.helpers.arrayElement(Object.values(EUserGender)))
  @Prop({ required: true, type: String, enum: EUserGender })
  gender: string

  @Factory((faker, ctx) => faker.person.firstName(ctx.gender))
  @Prop({ required: true, type: String })
  firstName: string

  @Factory((faker, ctx) => faker.person.lastName(ctx.gender))
  @Prop({ required: true, type: String })
  lastName: string

  @Factory((faker) => faker.internet.email())
  @Prop({ required: true, type: String, unique: true })
  email: string

  @Factory((faker, ctx) => ctx.password)
  @Prop({ required: true, type: String })
  password: string

  @Factory((faker) => faker.date.birthdate({ min: 18, max: 65, mode: 'age' }))
  @Prop({ required: true, type: Date })
  birthday: string

  @Prop({ type: Date })
  lastConnection?: string

  @Prop({ type: Date })
  lastUpdate?: string
}

export type UserDocument = HydratedDocument<User>
export const UserSchema = SchemaFactory.createForClass(User)
UserSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
})

export type UserFilterQuery = FilterQuery<UserDocument>
