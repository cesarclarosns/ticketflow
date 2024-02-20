import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { Request } from 'express'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { COOKIES } from '../auth.constants'
import { TTokenPayload } from '@features/auth/auth.types'
import { CONFIG_VALUES } from '@config/config'

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        RefreshTokenStrategy.extractJWT,
        ExtractJwt.fromAuthHeaderAsBearerToken(),
      ]),
      secretOrKey: configService.getOrThrow<string>(
        CONFIG_VALUES.auth.jwtRefreshSecret,
      ),
      passReqToCallback: true,
    })
  }

  private static extractJWT(req: Request): string | null {
    if (
      req.cookies &&
      COOKIES.REFRESH_TOKEN in req.cookies &&
      req.cookies.refreshToken.length > 0
    ) {
      return req.cookies[COOKIES.REFRESH_TOKEN]
    }

    return null
  }

  validate(req: Request, payload: TTokenPayload) {
    return payload
  }
}
