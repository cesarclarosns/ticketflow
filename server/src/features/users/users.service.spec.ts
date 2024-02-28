import { TestBed } from '@automock/jest';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Model,
  UpdateWriteOpResult,
} from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let usersService: UsersService;
  let userModel: jest.Mocked<Model<User>>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersService).compile();
    usersService = unit;
    userModel = unitRef.get(getModelToken(User.name));
  });

  it('should be defined', () => {
    expect(usersService).toBeDefined();
  });

  describe('create', () => {
    it('should return a created user', async () => {
      const createUserDto = {
        email: 'email@example.com',
      } as CreateUserDto;

      userModel.create.mockResolvedValue(createUserDto as any);

      expect(await usersService.create(createUserDto)).toMatchObject(
        createUserDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = [
        { email: 'email1@example.com' },
        { email: 'email2@example.com' },
      ] as HydratedDocument<User>[];

      userModel.find.mockImplementation(
        () =>
          ({
            sort: () => ({
              skip: () => ({
                limit: () => users,
              }),
            }),
          } as any),
      );

      expect(
        await usersService.findAll({
          limit: '2',
          skip: '1',
        }),
      ).toBe(users);
    });
  });

  describe('findOne', () => {
    it('should return one user', async () => {
      const user = { email: 'email@example.com' } as HydratedDocument<User>;

      userModel.findOne.mockResolvedValue(user);

      expect(await usersService.findOne({ email: '' })).toMatchObject(user);
      expect(
        await usersService.findOne({ email: '', googleId: '' }),
      ).toMatchObject(user);
    });
  });

  describe('findOneByEmail', () => {
    it('should return one user', async () => {
      const user = { email: 'email@example.com' } as HydratedDocument<User>;

      userModel.findOne.mockResolvedValue(user);

      expect(await usersService.findOneByEmail(user.email)).toMatchObject(user);
    });
  });

  describe('findInfoById', () => {
    it("should return the user's info", async () => {
      const user = { email: 'email@example.com' } as HydratedDocument<User>;

      userModel.findById.mockResolvedValue(user);

      const id = new mongoose.Types.ObjectId().toString();
      expect(await usersService.findInfoById(id)).toMatchObject(user);
    });
  });

  describe('update', () => {
    it('should update one user', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult;

      userModel.updateOne.mockResolvedValue(updateResult);

      const id = new mongoose.Types.ObjectId().toString();
      expect(await usersService.update(id, {})).toMatchObject(updateResult);
    });
  });
});
