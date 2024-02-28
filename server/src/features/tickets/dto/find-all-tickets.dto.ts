import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

import { IsObjectId } from '@/common/decorators/is-object-id.decorator';
import { PaginationQueryDto } from '@/common/dto/pagination-query.dto';

import { ETicketStatus } from '../entities/ticket.entity';

export class FindAllTicketsDto extends PartialType(PaginationQueryDto) {
  @ApiProperty({
    description: "The ticket's title",
    example: 'Awesome ticket',
    required: false,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  query?: string;

  @Transform(({ value }) => value.split(','))
  @IsOptional()
  @IsArray()
  @IsObjectId({ each: true })
  ticketCategories?: string[];

  @IsOptional()
  @Transform(({ value }) => value.split(','))
  @IsArray()
  @IsEnum(ETicketStatus, { each: true })
  statuses?: ETicketStatus[];

  @ApiProperty({
    description: 'Sorting criteria.',
    required: false,
  })
  @IsOptional()
  @IsIn(['title', '-title', 'dueDate', '-dueDate'])
  sort?: 'title' | '-title' | 'dueDate' | '-dueDate';

  @IsOptional()
  userId: string;
}
