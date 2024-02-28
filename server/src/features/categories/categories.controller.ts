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
import aqp from 'api-query-params';
import { Request } from 'express';

import { BadRequestResponseBodyDto } from '@/common/dto/bad-request-reponse-body.dto';
import { DeleteResponseBodyDto } from '@/common/dto/delete-response-body.dto';
import { PatchResponseBodyDto } from '@/common/dto/patch-response-body.dto';
import { UnauthorizedResponseBodyDto } from '@/common/dto/unauthorized-reponse-body.dto';

import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { CreateCategoryDto } from './dto/create-category.dto';
import { FindAllCategoriesDto } from './dto/find-all-categories.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

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
    const userId = req.user.sub;

    createCategoryDto.createdBy = userId;

    return await this.categoriesService.create(createCategoryDto);
  }

  @Get()
  @ApiOkResponse({
    type: FindAllCategoriesDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findAll(
    @Req() req: Request,
    @Query() findAllCategoriesDto: FindAllCategoriesDto,
  ) {
    const userId = req.user.sub;

    findAllCategoriesDto.userId = userId;

    return await this.categoriesService.findAll(findAllCategoriesDto);
  }

  @Get(':id')
  @ApiOkResponse({
    type: CategoryDto,
  })
  @ApiUnauthorizedResponse({
    type: UnauthorizedResponseBodyDto,
  })
  async findOne(@Req() req: Request, @Param('id') id: string) {
    const userId = req.user.sub;

    return await this.categoriesService.findOne({ categoryId: id, userId });
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
    const userId = req.user.sub;

    return this.categoriesService.update(
      { categoryId: id, userId },
      updateCategoryDto,
    );
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
    const userId = req.user.sub;

    return this.categoriesService.remove({ categoryId: id, userId });
  }
}
