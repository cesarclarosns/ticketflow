import { Injectable } from '@nestjs/common'
import { CreateUserDto } from './dto/create-user.dto'
import { UpdateUserDto } from './dto/update-user.dto'
import { InjectModel } from '@nestjs/mongoose'
import { User, UserFilterQuery } from './entities/user.entity'
import { Model } from 'mongoose'

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const createdUser = await this.userModel.create(createUserDto)
    return createdUser
  }

  /**
   * Returns a list of users with public information
   */
  async findAll({
    filter,
    limit,
    skip = 0,
    sort,
  }: {
    filter: UserFilterQuery
    limit: number
    skip?: number
    sort: any
  }) {
    return await this.userModel
      .find(filter, { password: 0 })
      .sort(sort)
      .skip(skip)
      .limit(limit)
  }

  async findOne(id: string) {
    return await this.userModel.findOne({ _id: id })
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email })
  }

  /**
   * Returns a user with public information
   */
  async findOnePublicUserById(id: string) {
    return await this.userModel.findById(id, { password: 0 })
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: id }, updateUserDto)
  }
}
