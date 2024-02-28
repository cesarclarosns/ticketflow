import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import mongoose, { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { Category } from '@/features/categories/entities/category.entity';
import { User } from '@/features/users/entities/user.entity';

import { Ticket } from '../entities/ticket.entity';

@Injectable()
export class TicketsSeeder implements Seeder {
  constructor(
    @InjectModel(Ticket.name) private readonly ticketModel: Model<Ticket>,
    @InjectModel(User.name) private readonly userModel: Model<User>,
    @InjectModel(Category.name)
    private readonly categoryModel: Model<Category>,
  ) {}

  async seed(): Promise<any> {
    //Generate 15 tickets per user
    const users = await this.userModel.find({});
    await Promise.all(
      users.map(async (user) => {
        const users = await this.userModel.aggregate([
          { $sample: { size: 1 } },
        ]);

        const userB = users[0];

        const categories = await this.categoryModel.aggregate([
          { $match: { createdBy: new mongoose.Types.ObjectId(user.id) } },
          { $sample: { size: 5 } },
        ]);

        await Promise.all(
          categories.map(async (category) => {
            const ticketsRecords = DataFactory.createForClass(Ticket).generate(
              10,
              {
                asignee: userB._id,
                createdBy: user.id,
                ticketCategory: category._id,
              },
            );
            return await this.ticketModel.insertMany(ticketsRecords);
          }),
        );
      }),
    );
  }

  async drop(): Promise<any> {
    return this.ticketModel.deleteMany({});
  }
}
