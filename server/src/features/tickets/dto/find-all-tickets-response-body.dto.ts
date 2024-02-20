import { ApiProperty } from '@nestjs/swagger'
import { TicketDto } from './ticket.dto'

class TotalCount {
  @ApiProperty()
  count: number
}

export class FindAllTicketsResponseBodyDto {
  @ApiProperty({
    isArray: true,
    type: TicketDto,
  })
  results: TicketDto[]

  @ApiProperty()
  totalCount?: TotalCount
}
