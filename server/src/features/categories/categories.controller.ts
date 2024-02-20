import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common'
import { CategoriesService } from './categories.service'
import {
  CreateCategoryDto,
  UpdateCategoryDto,
  FindAllCategoriesQueryDto,
  CategoryDto,
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
import { PatchResponseBodyDto } from '@common/dto/patch-response-body.dto'
import { DeleteResponseBodyDto } from '@common/dto/delete-response-body.dto'
import { BadRequestResponseBodyDto } from '@common/dto/bad-request-reponse-body.dto'

@Controller('categories')
@ApiTags('categories')
@ApiBearerAuth('accessToken')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    type: CategoryDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async create(
    @Req() req: Request,
    @Body() createCategoryDto: CreateCategoryDto,
  ) {
    const userId = req.user.sub
    createCategoryDto.createdBy = userId

    return await this.categoriesService.create(createCategoryDto)
  }

  @Get()
  @ApiOkResponse({
    type: FindAllCategoriesQueryDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findAll(
    @Req() req: Request,
    @Query() query: FindAllCategoriesQueryDto,
  ) {
    const q = aqp({ ...query })

    const userId = req.user.sub
    return await this.categoriesService.findAll({
      filter: { ...q.filter, createdBy: userId },
      sort: q.sort,
    })
  }

  @Get(':id')
  @ApiOkResponse({
    type: CategoryDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.sub
    return await this.categoriesService.findOne(id, { createdBy: userId })
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
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    const userId = req.user.sub
    return this.categoriesService.update(
      id,
      {
        createdBy: userId,
      },
      updateCategoryDto,
    )
  }

  @Delete(':id')
  @ApiOkResponse({
    type: DeleteResponseBodyDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  @ApiBadRequestResponse({
    type: BadRequestResponseBodyDto,
  })
  remove(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.sub
    return this.categoriesService.remove(id, { createdBy: userId })
  }
}
