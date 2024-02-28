import { TestBed } from '@automock/jest';
import mongoose, { HydratedDocument, UpdateWriteOpResult } from 'mongoose';
import * as httpMocks from 'node-mocks-http';

import { TokenPayload } from '@/features/auth/auth.types';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  let usersController: UsersController;
  let usersService: jest.Mocked<UsersService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersController).compile();
    usersController = unit;
    usersService = unitRef.get(UsersService);
  });

  it('should be defined', () => {
    expect(usersController).toBeDefined();
  });

  describe('findMyUser', () => {
    it('should return the user that corresponds to the sub in the jwt payload', async () => {
      const tokenPayload: TokenPayload = {
        sub: new mongoose.Types.ObjectId().toString(),
      };
      const request = httpMocks.createRequest({
        user: tokenPayload,
      });

      const user = { email: 'email@example.com' } as HydratedDocument<User>;

      usersService.findInfoById.mockResolvedValue(user);

      expect(await usersController.findMyUser(request)).toMatchObject(user);
    });
  });

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { email: 'email@example.com' } as HydratedDocument<User>;

      usersService.findInfoById.mockResolvedValue(user);

      const id = new mongoose.Types.ObjectId().toString();
      expect(await usersController.findOne(id)).toMatchObject(user);
    });
  });

  describe('findAll', () => {
    it('should return a list uf users', async () => {
      const users = [
        { email: 'email1@example.com' },
        { email: 'email2@example.com' },
      ] as HydratedDocument<User>[];

      usersService.findAll.mockResolvedValue(users);

      expect(
        await usersController.findAll({
          limit: '10',
          skip: '0',
        }),
      ).toMatchObject(users);
    });
  });

  describe('create', () => {
    it('should return a created user', async () => {
      const createUserDto = {
        email: 'email@example.com',
      } as CreateUserDto;

      usersService.create.mockResolvedValue(createUserDto as any);

      expect(await usersController.create({} as CreateUserDto)).toMatchObject(
        createUserDto,
      );
    });
  });

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult;

      usersService.update.mockResolvedValue(updateResult);

      expect(await usersController.update('1', {})).toBe(updateResult);
    });
  });
});
