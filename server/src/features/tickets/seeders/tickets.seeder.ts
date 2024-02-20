import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DataFactory, Seeder } from 'nestjs-seeder'
import { Ticket } from '../entities/ticket.entity'
import { User, UserDocument } from '@features/users/entities/user.entity'
import {
  Category,
  CategoryDocument,
  CategoryModel,
} from '@features/categories/entities/category.entity'
import mongoose, { Model } from 'mongoose'

@Injectable()
export class TicketsSeeder implements Seeder {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Category.name)
    private readonly categoryModel: CategoryModel,
  ) {}

  async seed(): Promise<any> {
    //Generate 15 tickets per user
    const users = await this.userModel.find({})
    await Promise.all(
      users.map(async (user) => {
        const users: UserDocument[] = await this.userModel
          .aggregate([{ $sample: { size: 1 } }])
          .exec()
        const userB = users[0]

        const categories: CategoryDocument[] = await this.categoryModel
          .aggregate([
            { $match: { createdBy: new mongoose.Types.ObjectId(user.id) } },
            { $sample: { size: 5 } },
          ])
          .exec()

        await Promise.all(
          categories.map(async (category) => {
            const tickets = DataFactory.createForClass(Ticket).generate(10, {
              createdBy: user.id,
              asignee: userB._id,
              ticketCategory: category._id,
            })
            return await this.ticketModel.insertMany(tickets)
          }),
        )
      }),
    )
  }

  async drop(): Promise<any> {
    return this.ticketModel.deleteMany({})
  }
}
