import { AuthService } from './auth.service'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import { TestBed } from '@automock/jest'
import { EventEmitter2 } from '@nestjs/event-emitter'
import { UsersService } from '@features/users/users.service'
import { SignInDto } from './dto/sign-in.dto'
import { HttpException } from '@nestjs/common'
import { UserDocument } from '@features/users/entities/user.entity'
import { SignUpDto } from './dto/sign-up.dto'
import {
  USERS_EVENTS,
  UserRegisteredEvent,
  UserResetPasswordEvent,
} from '@features/users/events'
import mongoose, { UpdateWriteOpResult } from 'mongoose'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { TTokenPayload } from './auth.types'
import { ResetPasswordCallbackDto } from './dto/reset-password-callback.dto'

describe('AuthService', () => {
  let authService: AuthService

  let eventEmitter: jest.Mocked<EventEmitter2>
  let jwtService: jest.Mocked<JwtService>
  let usersService: jest.Mocked<UsersService>
  let configService: jest.Mocked<ConfigService>

  const tokens = { accessToken: '', refreshToken: '' } as Awaited<
    ReturnType<AuthService['getTokens']>
  >

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthService).compile()

    authService = unit

    eventEmitter = unitRef.get(EventEmitter2)
    jwtService = unitRef.get(JwtService)
    usersService = unitRef.get(UsersService)
    configService = unitRef.get(ConfigService)
  })

  it('should be defined', () => {
    expect(authService).toBeDefined()
  })

  describe('signIn', () => {
    it('should return tokens if credentials are valid', async () => {
      jest.spyOn(authService, 'getTokens').mockResolvedValue(tokens)

      const password = 'password'
      const signInDto = { email: 'email@example.com', password } as SignInDto

      const hashedPassword = await authService.hashData(password)
      usersService.findOneByEmail.mockResolvedValue({
        password: hashedPassword,
      } as UserDocument)

      expect(await authService.signIn(signInDto)).toBe(tokens)
    })

    it('should throw exception if user does NOT exist', async () => {
      usersService.findOneByEmail.mockResolvedValue(null)

      const password = 'password'
      const signInDto = { email: 'email@example.com', password } as SignInDto

      try {
        await authService.signIn(signInDto)
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException)
      }
    })

    it('should throw exception if password is invalid', async () => {
      usersService.findOneByEmail.mockResolvedValue({
        password: await authService.hashData('password2'),
      } as UserDocument)

      const password = 'password1'
      const signInDto = { email: 'email@example.com', password } as SignInDto

      try {
        await authService.signIn(signInDto)
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException)
      }
    })
  })

  describe('signUp', () => {
    const signUpDto = {
      email: 'email@example.com',
      password: 'password',
    } as SignUpDto

    it('should return a created user', async () => {
      usersService.findOneByEmail.mockResolvedValue(null)

      usersService.create.mockResolvedValue(signUpDto as UserDocument)

      eventEmitter.emit.mockImplementation()

      expect(await authService.signUp(signUpDto)).toMatchObject(signUpDto)

      expect(eventEmitter.emit).toBeCalledWith(
        USERS_EVENTS.userRegistered,
        expect.any(UserRegisteredEvent),
      )
    })

    it('should throw an exception if email is already registered', async () => {
      usersService.findOneByEmail.mockResolvedValue({} as UserDocument)

      try {
        await authService.signUp(signUpDto)
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException)
      }
    })
  })

  describe('refreshTokens', () => {
    it('should return tokens', async () => {
      jest.spyOn(authService, 'getTokens').mockResolvedValue(tokens)

      expect(await authService.refreshTokens({ userId: '', email: '' })).toBe(
        tokens,
      )
    })
  })

  describe('getTokens', () => {
    it('should return tokens', async () => {
      jwtService.signAsync.mockResolvedValue('')

      configService.getOrThrow.mockImplementation(() => '')

      const id = new mongoose.Types.ObjectId().toString()
      expect(
        await authService.getTokens({
          userId: id,
          email: 'email@example.com',
        }),
      ).toMatchObject({
        accessToken: '',
        refreshToken: '',
      })
    })
  })

  describe('resetPassword', () => {
    const resetPasswordDto = { email: 'emal@example.com' } as ResetPasswordDto

    it('should emit UserResetPasswordEvent', async () => {
      usersService.findOneByEmail.mockResolvedValue(
        resetPasswordDto as UserDocument,
      )

      configService.getOrThrow.mockImplementation(() => 'http://localhost:3000')

      eventEmitter.emit.mockImplementation()

      await authService.resetPassword(resetPasswordDto)

      expect(eventEmitter.emit).toBeCalledWith(
        USERS_EVENTS.userResetPassword,
        expect.any(UserResetPasswordEvent),
      )
    })

    it('should throw error if email is NOT registered', async () => {
      usersService.findOneByEmail.mockResolvedValue(null)

      try {
        await authService.resetPassword(resetPasswordDto)
      } catch (err) {
        expect(err).toBeInstanceOf(HttpException)
      }
    })
  })

  describe('resetPasswordCallback', () => {
    const userId = new mongoose.Types.ObjectId().toString()

    const tokenPayload = {
      sub: userId,
      email: 'email@example.com',
    } as TTokenPayload

    it('should update users password if token is valid', async () => {
      jwtService.verifyAsync.mockResolvedValue(tokenPayload)

      configService.getOrThrow.mockImplementation(() => '')

      usersService.findOneByEmail.mockResolvedValue({
        id: userId,
      } as UserDocument)

      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      usersService.update.mockResolvedValue(updateResult)

      const resetPasswordCallbackDto = {
        password: 'password',
      } as ResetPasswordCallbackDto

      const token = ''

      expect(
        await authService.resetPasswordCallback(
          resetPasswordCallbackDto,
          token,
        ),
      ).toBe(updateResult)
    })
  })

  describe('getPasswordResetToken', () => {
    it('should return a token', async () => {
      const userId = new mongoose.Types.ObjectId().toString()
      const email = 'email@example.com'

      const token = ''

      jwtService.signAsync.mockResolvedValue(token)

      configService.getOrThrow.mockImplementation(() => '')

      expect(await authService.getPasswordResetToken({ userId, email })).toBe(
        token,
      )
    })
  })
})
