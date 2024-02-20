import { ApiProperty } from '@nestjs/swagger'
import { IsNumberString, IsOptional } from 'class-validator'

export class PaginationQueryDto {
  @ApiProperty({
    description: 'Maximum number of documents to be returned',
    example: 10,
  })
  @IsNumberString()
  limit: string

  @ApiProperty({
    description: 'Number of documents to skip',
    example: 0,
    required: false,
  })
  @IsOptional()
  @IsNumberString()
  skip?: string
}
