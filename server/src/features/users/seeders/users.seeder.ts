import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { DataFactory, Seeder } from 'nestjs-seeder'
import { User } from '@features/users/entities/user.entity'
import { AuthService } from '@app/features/auth/auth.service'
import { Model } from 'mongoose'

@Injectable()
export class UsersSeeder implements Seeder {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private authService: AuthService,
  ) {}

  async seed(): Promise<any> {
    const password = await this.authService.hashData('password123456')
    const users = DataFactory.createForClass(User).generate(10, {
      password,
    })
    return await this.userModel.insertMany(users)
  }
  async drop(): Promise<any> {
    return this.userModel.deleteMany({})
  }
}
