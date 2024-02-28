import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { IsUserIdValidatorConstraint } from '@/features/users/decorators/is-user-id.decorator';
import { UsersModule } from '@/features/users/users.module';

import { Ticket, TicketSchema } from './entities/ticket.entity';
import { TicketsController } from './tickets.controller';
import { TicketsService } from './tickets.service';

@Module({
  controllers: [TicketsController],
  exports: [MongooseModule, TicketsService],
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    UsersModule,
  ],
  providers: [TicketsService, IsUserIdValidatorConstraint],
})
export class TicketsModule {}
