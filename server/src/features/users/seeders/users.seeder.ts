import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DataFactory, Seeder } from 'nestjs-seeder';

import { AuthService } from '@/features/auth/auth.service';
import { User } from '@/features/users/entities/user.entity';

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async seed(): Promise<any> {
    const password = await this.authService.hashData('password123456');

    const usersRecords = DataFactory.createForClass(User).generate(10, {
      password,
    });

    return await this.userModel.insertMany(usersRecords);
  }
  async drop(): Promise<any> {
    return this.userModel.deleteMany({});
  }
}
