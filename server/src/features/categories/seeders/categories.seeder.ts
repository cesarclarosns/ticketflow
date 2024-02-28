import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { User } from '@/features/users/entities/user.entity';

import { Category } from '../entities/category.entity';

@Injectable()
export class CategoriesSeeder implements Seeder {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find({});
    await Promise.all(
      users.map(async (user) => {
        const categoriesRecords = DataFactory.createForClass(Category).generate(
          3,
          {
            createdBy: user.id,
          },
        );

        return await this.categoryModel.insertMany(categoriesRecords);
      }),
    );
  }

  async drop(): Promise<any> {
    return this.categoryModel.deleteMany({});
  }
}
