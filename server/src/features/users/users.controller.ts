import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  Query,
  HttpStatus,
  Req,
} from '@nestjs/common'

import { UsersService } from './users.service'
import {
  CreateUserDto,
  UpdateUserDto,
  FindAllUsersQueryDto,
  UserDto,
} from './dto'
import {
  ApiBearerAuth,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger'
import apq from 'api-query-params'
import { PatchResponseBodyDto } from '@common/dto/patch-response-body.dto'
import { UnauthorizedResponseBodyDto } from '@common/dto/unauthorized-reponse-body.dto'
import { Request } from 'express'

@Controller('users')
@ApiTags('users')
@ApiBearerAuth('accessToken')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findMyUser(@Req() req: Request) {
    const userId = req.user.sub
    return await this.usersService.findOnePublicUserById(userId)
  }

  @Get(':id')
  @ApiOkResponse({
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findOne(@Param('id') id: string) {
    return await this.usersService.findOnePublicUserById(id)
  }

  @Get()
  @ApiOkResponse({
    isArray: true,
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findAll(@Query() query: FindAllUsersQueryDto) {
    const q = apq({ ...query })

    Object.entries(q.filter).forEach(([k, v]) => {
      if (k === 'email' && typeof v === 'string') {
        q.filter[k] = {
          $regex: new RegExp(v),
          $options: 'i',
        }
      }
    })

    return await this.usersService.findAll({
      filter: q.filter,
      limit: q.limit,
      skip: q.skip,
      sort: q.sort,
    })
  }

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    type: UserDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto)
  }

  @Patch(':id')
  @ApiOkResponse({
    type: PatchResponseBodyDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return await this.usersService.update(id, updateUserDto)
  }
}
