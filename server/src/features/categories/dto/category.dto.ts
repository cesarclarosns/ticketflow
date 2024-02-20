import { ApiProperty } from '@nestjs/swagger'

export class CategoryDto {
  @ApiProperty()
  _id: string

  @ApiProperty()
  categoryName: string

  @ApiProperty()
  description: string

  @ApiProperty()
  createdBy: string
}
