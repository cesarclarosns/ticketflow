import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator'
import { ETicketStatus } from '../entities/ticket.entity'
import { IsObjectId } from '@app/common/decorators/is-object-id.decorator'
import { IsUserId } from '@app/features/users/decorators/is-user-id.decorator'
import { ApiProperty } from '@nestjs/swagger'

export class CreateTicketDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsUserId({ message: 'asignee must be a valid userId' })
  asignee: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  dueDate: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsObjectId()
  ticketCategory: string

  @ApiProperty({ required: false })
  @IsOptional()
  @IsEnum(ETicketStatus)
  status: string

  createdBy: string
}
