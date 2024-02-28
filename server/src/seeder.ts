import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';

import { config } from '@/config';
import { AuthModule } from '@/features/auth/auth.module';
import {
  Category,
  CategorySchema,
} from '@/features/categories/entities/category.entity';
import { CategoriesSeeder } from '@/features/categories/seeders/categories.seeder';
import {
  Ticket,
  TicketSchema,
} from '@/features/tickets/entities/ticket.entity';
import { TicketsSeeder } from '@/features/tickets/seeders/tickets.seeder';
import { User, UserSchema } from '@/features/users/entities/user.entity';
import { UsersSeeder } from '@/features/users/seeders/users.seeder';

seeder({
  imports: [
    EventEmitterModule.forRoot({
      delimiter: '.',
      ignoreErrors: false,
      maxListeners: 10,
      verboseMemoryLeak: false,
      wildcard: false,
    }),
    MongooseModule.forRoot(config.DATABASE.URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Ticket.name, schema: TicketSchema },
    ]),
    AuthModule,
  ],
}).run([UsersSeeder, CategoriesSeeder, TicketsSeeder]);
