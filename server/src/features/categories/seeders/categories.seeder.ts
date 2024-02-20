import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DataFactory, Seeder } from 'nestjs-seeder'
import { Category } from '../entities/category.entity'
import { User } from '@app/features/users/entities/user.entity'
import { Model } from 'mongoose'

@Injectable()
export class CategoriesSeeder implements Seeder {
  constructor(
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
    @InjectModel(User.name)
    private readonly userModel: Model<User>,
  ) {}

  async seed(): Promise<any> {
    const users = await this.userModel.find({})
    await Promise.all(
      users.map(async (user) => {
        const categories = DataFactory.createForClass(Category).generate(3, {
          createdBy: user.id,
        })
        return await this.categoryModel.insertMany(categories)
      }),
    )
  }

  async drop(): Promise<any> {
    return this.categoryModel.deleteMany({})
  }
}
