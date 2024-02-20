import { IsUserId } from '@features/users/decorators/is-user-id.decorator'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CreateCategoryDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  categoryName: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUserId()
  createdBy: string
}
