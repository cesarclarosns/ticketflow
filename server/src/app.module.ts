import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';

import { AppController } from '@/app.controller';
import { AppService } from '@/app.service';
import { config } from '@/config';
import { AuthModule } from '@/features/auth/auth.module';
import { AccessTokenGuard } from '@/features/auth/guards';
import { CategoriesModule } from '@/features/categories/categories.module';
import { EmailModule } from '@/features/email/email.module';
import { TicketsModule } from '@/features/tickets/tickets.module';
import { UsersModule } from '@/features/users/users.module';

import { HealthModule } from './features/health/health.module';

@Module({
  controllers: [AppController],
  imports: [
    MongooseModule.forRoot(config.DATABASE.URI),
    LoggerModule.forRoot({
      pinoHttp: {
        level: 'trace',
        transport: {
          target: 'pino-pretty',
        },
      },
      // useExisting: true,
    }),
    EventEmitterModule.forRoot({
      delimiter: '.',
      ignoreErrors: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      wildcard: false,
    }),
    // Rate limit protection
    ThrottlerModule.forRoot({
      throttlers: [
        {
          limit: config.THROTTLER.LIMIT,
          ttl: config.THROTTLER.TTL,
        },
      ],
    }),
    HealthModule,
    AuthModule,
    UsersModule,
    EmailModule,
    TicketsModule,
    CategoriesModule,
  ],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
