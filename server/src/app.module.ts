// Import core libraries
import { Module } from '@nestjs/common'
import { ThrottlerModule } from '@nestjs/throttler'
import { MongooseModule } from '@nestjs/mongoose'

// Import config files
import { ConfigModule, ConfigService } from '@nestjs/config'
import config, { CONFIG_VALUES, configValidationSchema } from '@config/config'

// Import own app files
import { AppController } from '@app/app.controller'
import { AppService } from '@app/app.service'
import { AuthModule } from '@features/auth/auth.module'
import { UsersModule } from '@features/users/users.module'
import { EmailModule } from '@common/modules/email/email.module'
import { EventEmitterModule } from '@nestjs/event-emitter'
import { TicketsModule } from '@features/tickets/tickets.module'
import { CategoriesModule } from '@features/categories/categories.module'
import { APP_GUARD } from '@nestjs/core'
import { AccessTokenGuard } from '@features/auth/guards'

@Module({
  imports: [
    EventEmitterModule.forRoot({
      wildcard: false,
      delimiter: '.',
      maxListeners: 10,
      verboseMemoryLeak: false,
      ignoreErrors: false,
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      load: [config],
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    // Rate limit protection
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => [
        {
          ttl: configService.getOrThrow<number>(CONFIG_VALUES.throttler.ttl),
          limit: configService.getOrThrow<number>(
            CONFIG_VALUES.throttler.limit,
          ),
        },
      ],
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>(CONFIG_VALUES.database.uri)
        return { uri }
      },
    }),
    AuthModule,
    UsersModule,
    EmailModule,
    TicketsModule,
    CategoriesModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
