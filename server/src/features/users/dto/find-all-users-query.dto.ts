import { PaginationQueryDto } from '@common/dto/pagination-query.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class FindAllUsersQueryDto extends PaginationQueryDto {
  @ApiProperty({
    description: `
      Query criteria. Refer to: https://www.npmjs.com/package/api-query-params.

      You can only filter by the field: 'email'.
      You must pass your query criteria as a JSON object.

      I.E.: 
      { 
        email: 'email@example.com'
      }

      The query criteria value for the 'email' field will be converted to a $regex case insensitive criteria.
  `,
    required: false,
    example: '{"email":"email@example.com"}',
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  filter?: string

  @ApiProperty({
    description:
      'Sorting criteria. Refer to: https://www.npmjs.com/package/api-query-params.',
    example: '-email',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  sort?: string
}
