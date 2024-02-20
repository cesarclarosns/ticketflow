import { UsersService } from './users.service'
import { getModelToken } from '@nestjs/mongoose'
import { User, UserDocument } from './entities/user.entity'
import { CreateUserDto } from './dto'
import { TestBed } from '@automock/jest'
import mongoose, { Model, UpdateWriteOpResult } from 'mongoose'

describe('UsersService', () => {
  let usersService: UsersService
  let userModel: jest.Mocked<Model<User>>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersService).compile()
    usersService = unit
    userModel = unitRef.get(getModelToken(User.name))
  })

  it('should be defined', () => {
    expect(usersService).toBeDefined()
  })

  describe('create', () => {
    it('should return a created user', async () => {
      const createUserDto = {
        email: 'email@example.com',
      } as CreateUserDto

      userModel.create.mockResolvedValue(createUserDto as any)

      expect(await usersService.create(createUserDto)).toMatchObject(
        createUserDto,
      )
    })
  })

  describe('findAll', () => {
    it('should return a list of users', async () => {
      const users = [
        { email: 'email1@example.com' },
        { email: 'email2@example.com' },
      ] as UserDocument[]

      userModel.find.mockImplementation(
        () =>
          ({
            sort: () => ({
              skip: () => ({
                limit: () => users,
              }),
            }),
          } as any),
      )

      expect(
        await usersService.findAll({
          filter: {},
          sort: {},
          skip: 1,
          limit: 2,
        }),
      ).toBe(users)

      expect(
        await usersService.findAll({
          filter: {},
          sort: {},
          limit: 2,
        }),
      ).toBe(users)
    })
  })

  describe('findOne', () => {
    it('should return one user', async () => {
      const user = { email: 'email@example.com' } as UserDocument

      userModel.findOne.mockResolvedValue(user)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await usersService.findOne(id)).toMatchObject(user)
    })
  })

  describe('findOneByEmail', () => {
    it('should return one user', async () => {
      const email = 'email@example.com'
      const user = { email } as UserDocument

      userModel.findOne.mockResolvedValue(user)

      expect(await usersService.findOneByEmail(email)).toMatchObject(user)
    })
  })

  describe('findOnePublicUserById', () => {
    it('should return one user profile', async () => {
      const user = { email: 'email@example.com' } as UserDocument

      userModel.findById.mockResolvedValue(user)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await usersService.findOnePublicUserById(id)).toMatchObject(user)
    })
  })

  describe('update', () => {
    it('should update one user', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      userModel.updateOne.mockResolvedValue(updateResult)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await usersService.update(id, {})).toMatchObject(updateResult)
    })
  })
})
