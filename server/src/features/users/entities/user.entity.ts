import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, FilterQuery, HydratedDocument } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { Factory } from 'nestjs-seeder';

export enum EUserGender {
  'male' = 'male',
  'female' = 'female',
}

@Schema({
  collection: 'users',
  timestamps: {
    createdAt: 'lastUpdate',
    updatedAt: 'lastUpdate',
  },
  versionKey: false,
})
export class User extends Document {
  @Factory((faker) => faker.helpers.arrayElement(Object.values(EUserGender)))
  @Prop({ enum: EUserGender, type: String })
  gender: string;

  @Factory((faker, ctx) => faker.person.firstName(ctx.gender))
  @Prop({ required: true, type: String })
  firstName: string;

  @Factory((faker, ctx) => faker.person.lastName(ctx.gender))
  @Prop({ type: String })
  lastName: string;

  @Factory((faker, ctx) =>
    faker.internet.email({ firstName: ctx.firstName, lastName: ctx.lastName }),
  )
  @Prop({ sparse: true, type: String, unique: true })
  email: string;

  @Factory((faker, ctx) => ctx.password)
  @Prop({ type: String })
  password: string;

  @Factory((faker) => faker.date.birthdate({ max: 65, min: 18, mode: 'age' }))
  @Prop({ type: Date })
  birthday: string;

  @Prop({ type: Date })
  lastConnection?: string;

  @Prop({ type: Date })
  lastUpdate?: string;

  @Prop({ type: String })
  googleId: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});
