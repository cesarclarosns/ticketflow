import { Test } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { useContainer, validate, ValidationError } from 'class-validator';
import mongoose, { HydratedDocument, Model } from 'mongoose';

import { User } from '@/features/users/entities/user.entity';
import { UsersService } from '@/features/users/users.service';

import { IsUserId, IsUserIdValidatorConstraint } from './is-user-id.decorator';

describe('@IsUserId', () => {
  let usersService: UsersService;

  beforeEach(async () => {
    usersService = new UsersService({} as Model<User>);

    const module = await Test.createTestingModule({
      providers: [
        {
          provide: UsersService,
          useValue: usersService,
        },
        IsUserIdValidatorConstraint,
      ],
    }).compile();

    useContainer(module, { fallbackOnErrors: true });
  });

  class TestObject {
    @IsUserId()
    id: string;
  }

  it('should return an ValidationError if id is not a valid userId (invalid ObjectId)', async () => {
    jest
      .spyOn(usersService, 'findOne')
      .mockResolvedValue({} as HydratedDocument<User>);

    const testObject = plainToInstance(TestObject, {
      id: '1',
    });
    const errors = await validate(testObject);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toBeInstanceOf(ValidationError);
  });

  it('should return a ValidationError if id is not a valid userId (userId does not exist in db)', async () => {
    jest.spyOn(usersService, 'findOne').mockResolvedValue(null);

    const testObject = plainToInstance(TestObject, {
      id: new mongoose.Types.ObjectId().toString(),
    });
    const errors = await validate(testObject);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toBeInstanceOf(ValidationError);
  });

  it('should NOT return a ValidationError if id is a valid userId', async () => {
    jest
      .spyOn(usersService, 'findOne')
      .mockResolvedValue({} as HydratedDocument<User>);

    const testObject = plainToInstance(TestObject, {
      id: new mongoose.Types.ObjectId().toString(),
    });
    const errors = await validate(testObject);
    expect(errors.length).toBe(0);
  });
});
