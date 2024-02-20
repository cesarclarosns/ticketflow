import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import mongoose, { FilterQuery, HydratedDocument, Model } from 'mongoose'
import * as MongooseDelete from 'mongoose-delete'
import { Factory } from 'nestjs-seeder'

@Schema({
  timestamps: true,
  collection: 'categories',
})
export class Category {
  @Factory((faker) => faker.lorem.words(1))
  @Prop({ required: true, type: String })
  categoryName: string

  @Factory((faker) => faker.lorem.words({ min: 2, max: 5 }))
  @Prop({ type: String })
  description: string

  @Factory((faker, ctx) => ctx.createdBy)
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId })
  createdBy: string
}

export type CategoryDocument = HydratedDocument<Category>
export const CategorySchema = SchemaFactory.createForClass(Category)
CategorySchema.plugin(MongooseDelete, {
  deletedAt: true,
  overrideMethods: true,
})

export interface CategoryModel extends Model<Category> {}

export type CategoryFilterQuery = FilterQuery<CategoryDocument>
