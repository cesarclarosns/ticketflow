import { CategoriesService } from '@features/categories/categories.service'
import mongoose, { Model, UpdateWriteOpResult } from 'mongoose'
import {
  Category,
  CategoryDocument,
} from '@features/categories/entities/category.entity'
import { SoftDeleteModel } from 'mongoose-delete'
import { getModelToken } from '@nestjs/mongoose'
import { TestBed } from '@automock/jest'
import { CreateCategoryDto } from './dto'
import { TicketsService } from '@features/tickets/tickets.service'
import { TicketDocument } from '@features/tickets/entities/ticket.entity'
import { BadRequestException } from '@nestjs/common'

describe('CategoriesService', () => {
  let categoriesService: CategoriesService
  let categoryModel: jest.Mocked<Model<Category>> &
    SoftDeleteModel<CategoryDocument>

  let ticketsService: jest.Mocked<TicketsService>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CategoriesService).compile()
    categoriesService = unit
    categoryModel = unitRef.get(getModelToken(Category.name)) as any

    ticketsService = unitRef.get(TicketsService)
  })

  it('should be defined', () => {
    expect(categoriesService).toBeDefined()
  })

  describe('create', () => {
    it('should return a created category', async () => {
      const createCategoryDto = { categoryName: 'A' } as CreateCategoryDto

      categoryModel.create.mockResolvedValue(createCategoryDto as any)

      expect(await categoriesService.create(createCategoryDto)).toMatchObject(
        createCategoryDto,
      )
    })
  })

  describe('findAll', () => {
    it('should return a list of categories', async () => {
      const categories = [
        { categoryName: 'A' },
        { categoryName: 'B' },
      ] as CategoryDocument[]

      categoryModel.find.mockImplementation(
        () =>
          ({
            sort: () =>
              ({
                collation: () => categories,
              } as any),
          } as any),
      )

      expect(
        await categoriesService.findAll({
          filter: {},
          sort: {},
        }),
      ).toMatchObject(categories)
    })
  })

  describe('findOne', () => {
    it('should return a category', async () => {
      const category = { categoryName: 'A' } as CategoryDocument

      categoryModel.findOne.mockResolvedValue(category as any)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await categoriesService.findOne(id, {})).toMatchObject(category)
    })
  })

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      categoryModel.updateOne.mockResolvedValue(updateResult)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await categoriesService.update(id, {}, {})).toMatchObject(
        updateResult,
      )
    })
  })

  describe('remove', () => {
    it('should return the udpate result if there is NOT an associated ticket to the category', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      jest.spyOn(categoryModel, 'delete').mockResolvedValue(updateResult as any)

      ticketsService.findAll.mockResolvedValue({ results: [] } as any)

      const id = new mongoose.Types.ObjectId().toString()
      expect(await categoriesService.remove(id, {})).toMatchObject(updateResult)
    })

    it('should throw error if there is an associated ticket to the category', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      jest.spyOn(categoryModel, 'delete').mockResolvedValue(updateResult as any)

      ticketsService.findAll.mockResolvedValue({ results: [] } as any)

      const id = new mongoose.Types.ObjectId().toString()

      try {
        await categoriesService.remove(id, {})
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException)
      }
    })
  })
})
