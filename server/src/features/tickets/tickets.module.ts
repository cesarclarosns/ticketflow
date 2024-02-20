import { Module } from '@nestjs/common'
import { TicketsService } from './tickets.service'
import { TicketsController } from './tickets.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Ticket, TicketSchema } from './entities/ticket.entity'
import { UsersModule } from '@features/users/users.module'
import { IsUserIdValidatorConstraint } from '@features/users/decorators/is-user-id.decorator'

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Ticket.name,
        schema: TicketSchema,
      },
    ]),
    UsersModule,
  ],
  controllers: [TicketsController],
  providers: [TicketsService, IsUserIdValidatorConstraint],
  exports: [TicketsService],
})
export class TicketsModule {}
