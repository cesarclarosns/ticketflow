import { PaginationQueryDto } from '@app/common/dto/pagination-query.dto'
import { ApiProperty } from '@nestjs/swagger'
import { IsNotEmpty, IsOptional, IsString } from 'class-validator'
import { PartialType } from '@nestjs/swagger'

export class FindAllTicketsQueryDto extends PartialType(PaginationQueryDto) {
  @ApiProperty({
    description: `
      Query criteria. Refer to: https://www.npmjs.com/package/api-query-params.

      You can only filter by the fields: 'title', 'status' and 'ticketCategory'.
      You must pass your query criteria as a JSON object with $and clauses.

      I.E.: 
      { 
        $and: [
          { status: { $in: ['pending'] } },
          { ticketCategory: { $in: ['6567f53cc8035358c9f1e8aa'] } },
          { title: 'Awesome ticket' },
        ],
      }

      The query criteria value for the 'title' field will be converted to a $regex case insensitive criteria.
    `,
    required: false,
    example:
      '{"$and":[{"status":{"$in":["pending"]}},{"ticketCategory":{"$in":["6567f53cc8035358c9f1e8aa"]}},{"title":"Awesome ticket"}]}',
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
