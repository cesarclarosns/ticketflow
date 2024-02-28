import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsOptional, IsString } from 'class-validator';

import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

export class FindAllUsersDto extends PaginationQueryDto {
  @ApiProperty({
    description: "The user's email",
    example: 'email@example.com',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;
}
