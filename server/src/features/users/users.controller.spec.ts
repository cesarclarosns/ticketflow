import { UsersController } from './users.controller'
import { UsersService } from './users.service'
import mongoose, { UpdateWriteOpResult } from 'mongoose'
import { UserDocument } from './entities/user.entity'
import { CreateUserDto, FindAllUsersQueryDto } from './dto'
import * as httpMocks from 'node-mocks-http'
import { TTokenPayload } from '@features/auth/auth.types'
import { TestBed } from '@automock/jest'

describe('UsersController', () => {
  let usersController: UsersController
  let usersService: jest.Mocked<UsersService>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(UsersController).compile()
    usersController = unit
    usersService = unitRef.get(UsersService)
  })

  it('should be defined', () => {
    expect(usersController).toBeDefined()
  })

  describe('findMyUser', () => {
    it('should return the user that corresponds to the sub in the jwt payload', async () => {
      const tokenPayload: TTokenPayload = {
        sub: new mongoose.Types.ObjectId().toString(),
        email: 'email@example.com',
      }
      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      const user = { email: tokenPayload.email } as UserDocument

      usersService.findOnePublicUserById.mockResolvedValue(user)

      expect(await usersController.findMyUser(request)).toMatchObject(user)
    })
  })

  describe('findOne', () => {
    it('should return a user', async () => {
      const user = { email: 'email@example.com' } as UserDocument

      usersService.findOnePublicUserById.mockResolvedValue(user)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await usersController.findOne(id)).toMatchObject(user)
    })
  })

  describe('findAll', () => {
    it('should return a list uf users', async () => {
      const users = [
        { email: 'email1@example.com' },
        { email: 'email2@example.com' },
      ] as UserDocument[]

      usersService.findAll.mockResolvedValue(users)

      expect(
        await usersController.findAll({
          skip: '0',
          limit: '10',
          filter: '{"email":"email@example.com"}',
        }),
      ).toMatchObject(users)

      expect(
        await usersController.findAll({
          skip: '0',
          limit: '10',
          filter: '',
        }),
      ).toMatchObject(users)
    })
  })

  describe('create', () => {
    it('should return a created user', async () => {
      const user = {
        email: 'email@example.com',
      } as CreateUserDto

      usersService.create.mockResolvedValue(user as UserDocument)

      expect(await usersController.create(user)).toMatchObject(user)
    })
  })

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      usersService.update.mockResolvedValue(updateResult)

      expect(await usersController.update('1', {})).toBe(updateResult)
    })
  })
})
