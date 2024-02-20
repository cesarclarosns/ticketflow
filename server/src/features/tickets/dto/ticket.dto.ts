import { CategoryDto } from '@features/categories/dto'
import { UserDto } from '@features/users/dto'
import { ApiProperty } from '@nestjs/swagger'

export class TicketDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  title: string

  @ApiProperty()
  description: string

  @ApiProperty({
    type: UserDto,
  })
  asignee: UserDto

  @ApiProperty()
  dueDate: string

  @ApiProperty({
    type: CategoryDto,
    required: false,
  })
  ticketCategory: CategoryDto

  @ApiProperty({
    required: false,
  })
  status: string

  @ApiProperty({
    type: UserDto,
  })
  createdBy: UserDto
}
