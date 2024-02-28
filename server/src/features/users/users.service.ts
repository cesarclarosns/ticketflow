import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { FindAllUsersDto } from './dto/find-all-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UserCreatedEvent, USERS_EVENTS } from './events';

@Injectable()
export class UsersService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const user = await this.userModel.create(createUserDto);

    // Emit events
    if (createUserDto.email) {
      this.eventEmitter.emit(
        USERS_EVENTS.UserCreated,
        new UserCreatedEvent({ email: user.email }),
      );
    }

    return user;
  }

  async findAll({ skip, limit, query }: FindAllUsersDto) {
    return await this.userModel
      .find(
        {
          ...(!!query
            ? {
                email: {
                  $options: 'i',
                  $regex: new RegExp(query),
                },
              }
            : {}),
        },
        { password: 0 },
        { collation: { locale: 'en_US' } },
      )
      .sort({
        email: 1,
      })
      .skip(+skip)
      .limit(+limit);
  }

  async findOne(filter: { email?: string; googleId?: string }) {
    return await this.userModel.findOne({
      ...(!!filter.email ? { email: filter.email } : {}),
      ...(!!filter.googleId ? { googleId: filter.googleId } : {}),
    });
  }

  async findOneById(id: string) {
    return await this.userModel.findOne({ _id: id });
  }

  async findOneByEmail(email: string) {
    return await this.userModel.findOne({ email });
  }

  async findOneByGoogleId(googleId: string) {
    return await this.userModel.findOne({ googleId });
  }
  async findInfoById(id: string) {
    return await this.userModel.findById(id, { password: 0 });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: id }, updateUserDto);
  }
}
