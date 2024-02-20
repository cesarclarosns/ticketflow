import { Module } from '@nestjs/common'
import { CategoriesService } from './categories.service'
import { CategoriesController } from './categories.controller'
import { MongooseModule } from '@nestjs/mongoose'
import { Category, CategorySchema } from './entities/category.entity'
import { IsUserIdValidatorConstraint } from '@features/users/decorators/is-user-id.decorator'
import { UsersModule } from '@features/users/users.module'
import { TicketsModule } from '@features/tickets/tickets.module'

@Module({
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
  controllers: [CategoriesController],
  providers: [CategoriesService, IsUserIdValidatorConstraint],
})
export class CategoriesModule {}
