import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import { SignInDto } from './dto/sign-in.dto'
import { SignUpDto } from './dto/sign-up.dto'
import { ResetPasswordDto } from './dto/reset-password.dto'
import { UsersService } from '@features/users/users.service'
import { ConfigService } from '@nestjs/config'
import { ResetPasswordCallbackDto } from './dto/reset-password-callback.dto'
import * as argon2 from 'argon2'

import { JwtService } from '@nestjs/jwt'
import * as jwt from 'jsonwebtoken'
import { TTokenPayload } from '@features/auth/auth.types'
import { CONFIG_VALUES } from '@config/config'
import { EventEmitter2 } from '@nestjs/event-emitter'
import {
  USERS_EVENTS,
  UserRegisteredEvent,
  UserResetPasswordEvent,
} from '@features/users/events'
import { UserDocument } from '@features/users/entities/user.entity'

@Injectable()
export class AuthService {
  constructor(
    private eventEmitter: EventEmitter2,
    private jwtService: JwtService,
    private usersService: UsersService,
    private configService: ConfigService,
  ) {}

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.email)
    if (!user) {
      throw new HttpException(
        {
          errors: { email: 'Email is not registered' },
          message: 'Email is not registered',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const passwordMatches = await argon2.verify(
      user.password,
      signInDto.password,
    )
    if (!passwordMatches) {
      throw new HttpException(
        {
          errors: { password: 'Password is incorrect' },
          message: 'Password is incorrect',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const tokens = await this.getTokens({ userId: user.id, email: user.email })
    return tokens
  }

  async signUp(signUpDto: SignUpDto): Promise<UserDocument> {
    const user = await this.usersService.findOneByEmail(signUpDto.email)
    if (user) {
      throw new HttpException(
        {
          errors: { email: 'Email is already registered' },
          message: 'Email is already registered',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      )
    }

    const hashedPassword = await this.hashData(signUpDto.password)
    signUpDto.password = hashedPassword

    const userCreated = await this.usersService.create({ ...signUpDto })

    const userRegisteredEvent = new UserRegisteredEvent({
      email: userCreated.email,
    })

    this.eventEmitter.emit(USERS_EVENTS.userRegistered, userRegisteredEvent)

    return userCreated
  }

  async refreshTokens({
    userId,
    email,
  }: {
    userId: string
    email: string
  }): Promise<{ accessToken: string; refreshToken: string }> {
    return await this.getTokens({
      userId,
      email,
    })
  }

  async getTokens({
    userId,
    email,
  }: {
    userId: string
    email: string
  }): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.getTokenPayload({ userId, email })

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtAccessSecret,
        ),
        expiresIn: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtAccessExpiresIn,
        ),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtRefreshSecret,
        ),
        expiresIn: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtRefreshExpiresIn,
        ),
      }),
    ])

    return {
      accessToken,
      refreshToken,
    }
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    // Create token
    const user = await this.usersService.findOneByEmail(resetPasswordDto.email)

    if (!user)
      throw new HttpException(
        {
          errors: { email: 'Email is not registered' },
          message: 'Email is not registered',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      )

    const token = await this.getPasswordResetToken({
      userId: user.id,
      email: resetPasswordDto.email,
    })

    // Create password reset link
    const url = new URL(
      '/auth/reset-password',
      this.configService.getOrThrow<string>(CONFIG_VALUES.app.appDomain),
    )
    url.searchParams.set('token', token)

    const resetPasswordLink = url.toString()

    // Send email
    const resetPasswordEvent = new UserResetPasswordEvent({
      email: resetPasswordDto.email,
      resetPasswordLink,
    })

    this.eventEmitter.emit(USERS_EVENTS.userResetPassword, resetPasswordEvent)
  }

  async resetPasswordCallback(
    resetPasswordCallbackDto: ResetPasswordCallbackDto,
    token: string,
  ) {
    let payload: TTokenPayload

    try {
      payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow<string>(
          CONFIG_VALUES.auth.jwtResetPasswordSecret,
        ),
      })
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.UNAUTHORIZED)
    }

    const user = await this.usersService.findOneByEmail(payload.email)

    const hashedPassword = await this.hashData(
      resetPasswordCallbackDto.password,
    )

    return await this.usersService.update(user.id, {
      password: hashedPassword,
    })
  }

  async getPasswordResetToken({
    userId,
    email,
  }: {
    userId: string
    email: string
  }): Promise<string> {
    const payload = this.getTokenPayload({ userId, email })
    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow<string>(
        CONFIG_VALUES.auth.jwtResetPasswordSecret,
      ),
      expiresIn: this.configService.getOrThrow<string>(
        CONFIG_VALUES.auth.jwtResetPasswordExpiresIn,
      ),
    })
    return token
  }

  getTokenPayload({
    userId,
    email,
  }: {
    userId: string
    email: string
  }): TTokenPayload {
    return {
      sub: userId,
      email,
    }
  }

  async hashData(data: string | Buffer): Promise<string> {
    return await argon2.hash(data)
  }
}
