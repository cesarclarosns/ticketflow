import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { Document } from 'mongoose';
import MongooseDelete from 'mongoose-delete';
import { Factory } from 'nestjs-seeder';

@Schema({
  collection: 'categories',
  timestamps: true,
  versionKey: false,
})
export class Category extends Document {
  @Factory((faker) => faker.lorem.words(1))
  @Prop({ required: true, type: String })
  categoryName: string;

  @Factory((faker) => faker.lorem.words({ max: 5, min: 2 }))
  @Prop({ type: String })
  description: string;

  @Factory((faker, ctx) => ctx.createdBy)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  createdBy: mongoose.Types.ObjectId;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

CategorySchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
});
