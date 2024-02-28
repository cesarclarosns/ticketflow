import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

import { BadRequestResponseBodyDto } from '@/common/dto/bad-request-reponse-body.dto';
import { DeleteResponseBodyDto } from '@/common/dto/delete-response-body.dto';
import { PatchResponseBodyDto } from '@/common/dto/patch-response-body.dto';
import { UnauthorizedResponseBodyDto } from '@/common/dto/unauthorized-reponse-body.dto';

import { CreateTicketDto } from './dto/create-ticket.dto';
import { FindAllTicketsDto } from './dto/find-all-tickets.dto';
import { FindAllTicketsResponseBodyDto } from './dto/find-all-tickets-response.dto';
import { TicketDto } from './dto/ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { Ticket } from './entities/ticket.entity';
import { TicketsService } from './tickets.service';

@Controller('tickets')
@ApiTags('tickets')
@ApiBearerAuth('accessToken')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: TicketDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  create(@Req() req: Request, @Body() createTicketDto: CreateTicketDto) {
    const userId = req.user.sub;

    createTicketDto.createdBy = userId;
    if (!createTicketDto.asignee) createTicketDto.asignee = userId;

    return this.ticketsService.create(createTicketDto);
  }

  @Get()
  @ApiOkResponse({
    type: FindAllTicketsResponseBodyDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  findAll(@Req() req: Request, @Query() findAllTicketsDto: FindAllTicketsDto) {
    const userId = req.user.sub;

    findAllTicketsDto.userId = userId;

    return this.ticketsService.findAll(findAllTicketsDto);
  }

  @Get(':id')
  @ApiOkResponse({
    type: Ticket,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.sub;

    return await this.ticketsService.findOne({ ticketId: id, userId });
  }

  @Patch(':id')
  @ApiOkResponse({
    type: PatchResponseBodyDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  update(
    @Req() req: Request,
    @Param('id') id: string,
    @Body() updateTicketDto: UpdateTicketDto,
  ) {
    const userId = req.user.sub;

    return this.ticketsService.update(
      { ticketId: id, userId },
      updateTicketDto,
    );
  }

  @Delete(':id')
  @ApiOkResponse({
    type: DeleteResponseBodyDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.sub;

    return this.ticketsService.remove({ ticketId: id, userId });
  }
}
