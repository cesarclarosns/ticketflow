import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class FindAllCategoriesQueryDto {
  @ApiProperty({
    description:
      'Query criteria. Refer to: https://www.npmjs.com/package/api-query-params.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  filter?: string

  @ApiProperty({
    description:
      'Sorting criteria. Refer to: https://www.npmjs.com/package/api-query-params.',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sort?: string
}
