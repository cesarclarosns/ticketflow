import { seeder } from 'nestjs-seeder'
import { MongooseModule } from '@nestjs/mongoose'
import { User, UserSchema } from '@features/users/entities/user.entity'
import { UsersSeeder } from '@features/users/seeders/users.seeder'
import {
  Category,
  CategorySchema,
} from '@features/categories/entities/category.entity'
import { Ticket, TicketSchema } from '@features/tickets/entities/ticket.entity'
import { CategoriesSeeder } from '@features/categories/seeders/categories.seeder'
import { TicketsSeeder } from '@features/tickets/seeders/tickets.seeder'
import { AuthModule } from '@features/auth/auth.module'
import { ConfigModule, ConfigService } from '@nestjs/config'
import config, { CONFIG_VALUES, configValidationSchema } from '@config/config'
import { EventEmitterModule } from '@nestjs/event-emitter'

seeder({
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
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const uri = configService.getOrThrow<string>(CONFIG_VALUES.database.uri)
        return { uri }
      },
    }),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
    AuthModule,
  ],
}).run([UsersSeeder, CategoriesSeeder, TicketsSeeder])
