import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { TicketsModule } from '@/features/tickets/tickets.module';
import { IsUserIdValidatorConstraint } from '@/features/users/decorators/is-user-id.decorator';
import { UsersModule } from '@/features/users/users.module';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category, CategorySchema } from './entities/category.entity';

@Module({
  controllers: [CategoriesController],
  imports: [
    MongooseModule.forFeature([
      {
        name: Category.name,
        schema: CategorySchema,
      },
    ]),
    UsersModule,
    TicketsModule,
  ],
  providers: [CategoriesService, IsUserIdValidatorConstraint],
})
export class CategoriesModule {}
