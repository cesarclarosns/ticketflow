import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Req,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { TicketsService } from './tickets.service'
import {
  CreateTicketDto,
  UpdateTicketDto,
  FindAllTicketsQueryDto,
  TicketDto,
} from './dto'
import { Request } from 'express'
import aqp from 'api-query-params'
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import { UnauthorizedResponseBodyDto } from '@common/dto/unauthorized-reponse-body.dto'
import { BadRequestResponseBodyDto } from '@common/dto/bad-request-reponse-body.dto'
import { Ticket } from './entities/ticket.entity'
import { PatchResponseBodyDto } from '@common/dto/patch-response-body.dto'
import { DeleteResponseBodyDto } from '@common/dto/delete-response-body.dto'
import mongoose from 'mongoose'
import { FindAllTicketsResponseBodyDto } from './dto/find-all-tickets-response-body.dto'

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
    const userId = req.user.sub
    createTicketDto.createdBy = userId
    if (!createTicketDto.asignee) createTicketDto.asignee = userId

    return this.ticketsService.create(createTicketDto)
  }

  @Get()
  @ApiOkResponse({
    type: FindAllTicketsResponseBodyDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  findAll(@Req() req: Request, @Query() query: FindAllTicketsQueryDto) {
    const userId = req.user.sub

    const q = aqp({ ...query })

    let $andClauses: object[] = q.filter?.$and?.length ? q.filter.$and : []

    $andClauses = $andClauses.filter((obj) => {
      const fields = Object.keys(obj)
      const allowedFields = ['title', 'status', 'ticketCategory']

      return fields.length === 1 && allowedFields.includes(fields[0])
    })

    $andClauses = $andClauses.map((obj) => {
      Object.entries(obj).forEach(([k, v]) => {
        if (k === 'title') {
          obj[k] = {
            $regex: new RegExp(v),
            $options: 'i',
          }
        }
        if (k === 'ticketCategory' && v?.$in && Array.isArray(v.$in)) {
          const ids = v.$in as string[]
          obj[k]['$in'] = ids.map((id) => new mongoose.Types.ObjectId(id))
        }
      })
      return obj
    })

    return this.ticketsService.findAll({
      filter: {
        $and: [
          {
            $or: [
              { asignee: new mongoose.Types.ObjectId(userId) },
              { createdBy: new mongoose.Types.ObjectId(userId) },
            ],
          },
          ...($andClauses.length ? $andClauses : []),
        ],
      },
      limit: q.limit,
      skip: q.skip,
      sort: q.sort,
    })
  }

  @Get(':id')
  @ApiOkResponse({
    type: Ticket,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.sub
    return await this.ticketsService.findOne(id, {
      $and: [
        {
          $or: [
            { asignee: new mongoose.Types.ObjectId(userId) },
            { createdBy: new mongoose.Types.ObjectId(userId) },
          ],
        },
      ],
    })
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
    const userId = req.user.sub
    return this.ticketsService.update(
      id,
      { $and: [{ $or: [{ asignee: userId }, { createdBy: userId }] }] },
      updateTicketDto,
    )
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
    const userId = req.user.sub
    return this.ticketsService.remove(id, {
      $and: [{ $or: [{ asignee: userId }, { createdBy: userId }] }],
    })
  }
}
