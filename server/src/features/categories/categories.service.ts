import { Injectable, BadRequestException } from '@nestjs/common'
import { CreateCategoryDto } from './dto/create-category.dto'
import { UpdateCategoryDto } from './dto/update-category.dto'
import { InjectModel } from '@nestjs/mongoose'
import {
  Category,
  CategoryDocument,
  CategoryFilterQuery,
} from './entities/category.entity'
import { TicketsService } from '@features/tickets/tickets.service'
import mongoose, { Model } from 'mongoose'
import { SoftDeleteModel } from 'mongoose-delete'

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category> & SoftDeleteModel<CategoryDocument>,
    private ticketsService: TicketsService,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto)
  }

  async findAll({ filter, sort }: { filter: CategoryFilterQuery; sort: any }) {
    return await this.categoryModel
      .find(filter)
      .sort(sort)
      .collation({ locale: 'en_US' })
  }

  async findOne(id: string, filter: CategoryFilterQuery) {
    return await this.categoryModel.findOne({ _id: id, ...filter })
  }

  async update(
    id: string,
    filter: CategoryFilterQuery,
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryModel.updateOne(
      { _id: id, ...filter },
      { $set: updateCategoryDto },
    )
  }

  async remove(id: string, filter: CategoryFilterQuery) {
    const result = await this.ticketsService.findAll({
      filter: { ticketCategory: new mongoose.Types.ObjectId(id) },
      skip: 0,
      limit: 1,
      sort: null,
    })

    if (result.results.length)
      throw new BadRequestException(
        'Cannot delete a category associated with tickets',
      )

    return await this.categoryModel.delete({ _id: id, ...filter })
  }
}
