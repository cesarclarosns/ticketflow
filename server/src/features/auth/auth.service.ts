import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { JwtService } from '@nestjs/jwt';
import argon2 from 'argon2';

import { config } from '@/config';
import { User } from '@/features/users/entities/user.entity';
import { UsersService } from '@/features/users/users.service';

import { TokenPayload } from './auth.types';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { ResetPasswordCallbackDto } from './dto/reset-password-callback.dto';
import { SignInDto } from './dto/sign-in.dto';
import { SignUpDto } from './dto/sign-up.dto';
import { AUTH_EVENTS, ResetPasswordEvent } from './events';

@Injectable()
export class AuthService {
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
  ) {}

  async signIn(
    signInDto: SignInDto,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneByEmail(signInDto.email);
    if (!user) {
      throw new HttpException(
        {
          errors: { email: 'Email is not registered' },
          message: 'Email is not registered',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    if (!user.password) {
      throw new HttpException(
        {
          errors: { password: 'Password is incorrect' },
          message: 'Password is incorrect',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const passwordMatches = await argon2.verify(
      user.password,
      signInDto.password,
      {},
    );
    if (!passwordMatches) {
      throw new HttpException(
        {
          errors: { password: 'Password is incorrect' },
          message: 'Password is incorrect',
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    return await this.getTokens(user._id.toString());
  }

  async signUp(signUpDto: SignUpDto): Promise<User> {
    const user = await this.usersService.findOne({
      email: signUpDto.email,
    });

    if (user) {
      throw new HttpException(
        {
          errors: {
            ...(user.email == signUpDto.email && {
              email: 'Email is already registered',
            }),
          },
          statusCode: HttpStatus.BAD_REQUEST,
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    const hashedPassword = await this.hashData(signUpDto.password);
    signUpDto.password = hashedPassword;

    const userCreated = await this.usersService.create({ ...signUpDto });

    return userCreated;
  }

  async refreshTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const user = await this.usersService.findOneById(userId);

    if (!user) throw new UnauthorizedException();

    return await this.getTokens(userId);
  }

  async getTokens(
    userId: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = this.getTokenPayload(userId);

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: config.AUTH.JWT_ACCESS_EXPIRES_IN,
        secret: config.AUTH.JWT_ACCESS_SECRET,
      }),
      this.jwtService.signAsync(payload, {
        expiresIn: config.AUTH.JWT_REFRESH_EXPIRES_IN,
        secret: config.AUTH.JWT_REFRESH_SECRET,
      }),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    // Create token
    const user = await this.usersService.findOneByEmail(resetPasswordDto.email);

    if (!user)
      throw new HttpException(
        {
          errors: { email: 'Email is not registered' },
          message: 'Email is not registered',
          statusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        },
        HttpStatus.UNPROCESSABLE_ENTITY,
      );

    const token = await this.getPasswordResetToken(user._id.toString());

    // Create password reset link
    const url = new URL('/auth/reset-password', config.APP.APP_DOMAIN);
    url.searchParams.set('token', token);

    const resetPasswordLink = url.toString();

    // Emit events
    const resetPasswordEvent = new ResetPasswordEvent({
      email: resetPasswordDto.email,
      resetPasswordLink,
    });

    this.eventEmitter.emit(AUTH_EVENTS.ResetPassword, resetPasswordEvent);
  }

  async resetPasswordCallback(
    resetPasswordCallbackDto: ResetPasswordCallbackDto,
  ): Promise<void> {
    let payload: TokenPayload;

    try {
      payload = await this.jwtService.verifyAsync(
        resetPasswordCallbackDto.token,
        {
          secret: config.AUTH.JWT_RESET_PASSWORD_SECRET,
        },
      );
    } catch (err) {
      throw new HttpException(err.message, HttpStatus.UNAUTHORIZED);
    }

    const user = await this.usersService.findOneById(payload.sub);

    const hashedPassword = await this.hashData(
      resetPasswordCallbackDto.password,
    );

    await this.usersService.update(user._id.toString(), {
      password: hashedPassword,
    });
  }

  async getPasswordResetToken(userId: string): Promise<string> {
    const payload = this.getTokenPayload(userId);
    const token = await this.jwtService.signAsync(payload, {
      expiresIn: config.AUTH.JWT_RESET_PASSWORD_EXPIRES_IN,
      secret: config.AUTH.JWT_RESET_PASSWORD_SECRET,
    });
    return token;
  }

  getTokenPayload(userId: string): TokenPayload {
    return {
      sub: userId,
    };
  }

  async hashData(data: string | Buffer): Promise<string> {
    return await argon2.hash(data);
  }
}
