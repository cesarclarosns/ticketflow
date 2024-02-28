import { ApiProperty } from '@nestjs/swagger';

import { CategoryDto } from '@/features/categories/dto/category.dto';
import { UserDto } from '@/features/users/dto/user.dto';

export class TicketDto {
  @ApiProperty()
  _id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({
    type: UserDto,
  })
  asignee: UserDto;

  @ApiProperty()
  dueDate: string;

  @ApiProperty({
    required: false,
    type: CategoryDto,
  })
  ticketCategory: CategoryDto;

  @ApiProperty({
    required: false,
  })
  status: string;

  @ApiProperty({
    type: UserDto,
  })
  createdBy: UserDto;
}
