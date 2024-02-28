import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { Ticket } from '../tickets/entities/ticket.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';

@Injectable()
export class CategoriesService {
  constructor(
    @InjectModel(Category.name)
    private categoryModel: Model<Category> & SoftDeleteModel<Category>,
    @InjectModel(Ticket.name)
    private ticketModel: Model<Ticket> & SoftDeleteModel<Ticket>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto) {
    return await this.categoryModel.create(createCategoryDto);
  }

  async findAll({ userId }: FindAllCategoriesDto) {
    return await this.categoryModel
      .find({
        createdBy: userId,
      })
      .sort({ categoryName: 1 })
      .collation({ locale: 'en_US' });
  }

  async findOne(filter: { categoryId: string; userId: string }) {
    return await this.categoryModel.findOne({
      _id: filter.categoryId,
      createdBy: filter.userId,
    });
  }

  async update(
    filter: { categoryId: string; userId: string },
    updateCategoryDto: UpdateCategoryDto,
  ) {
    return await this.categoryModel.updateOne(
      {
        _id: filter.categoryId,
        createdBy: filter.userId,
      },
      { $set: updateCategoryDto },
    );
  }

  async remove(filter: { categoryId: string; userId: string }) {
    const ticket = await this.ticketModel.findOne({
      ticketCategory: filter.categoryId,
    });

    if (ticket)
      throw new BadRequestException(
        'Cannot delete a category associated with tickets',
      );

    return await this.categoryModel.delete({
      _id: filter.categoryId,
      createdBy: filter.userId,
    });
  }
}
