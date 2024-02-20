import { CategoriesController } from './categories.controller'
import { CategoriesService } from './categories.service'
import { TestBed } from '@automock/jest'
import { CreateCategoryDto } from './dto'
import * as httpMocks from 'node-mocks-http'
import { TTokenPayload } from '../auth/auth.types'
import mongoose, { UpdateWriteOpResult } from 'mongoose'
import { CategoryDocument } from './entities/category.entity'

describe('CategoriesController', () => {
  let categoriesController: CategoriesController
  let categoriesService: jest.Mocked<CategoriesService>

  const tokenPayload: TTokenPayload = {
    sub: new mongoose.Types.ObjectId().toString(),
    email: 'email@example.com',
  }

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CategoriesController).compile()
    categoriesController = unit
    categoriesService = unitRef.get(CategoriesService)
  })

  it('should be defined', () => {
    expect(categoriesController).toBeDefined()
  })

  describe('create', () => {
    it('should return a created category', async () => {
      const createCategoryDto = { categoryName: 'A' } as CreateCategoryDto

      categoriesService.create.mockResolvedValue(createCategoryDto as any)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      expect(
        await categoriesController.create(request, createCategoryDto),
      ).toMatchObject(createCategoryDto)
    })
  })

  describe('findAll', () => {
    it('should return a list of tickets', async () => {
      const categories = [
        { categoryName: 'A' },
        { categoryName: 'B' },
      ] as CategoryDocument[]

      categoriesService.findAll.mockResolvedValue(categories)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      expect(await categoriesController.findAll(request, {})).toBe(categories)
    })
  })

  describe('findOne', () => {
    it('should return a ticket', async () => {
      const category = { categoryName: 'A' } as CategoryDocument

      categoriesService.findOne.mockResolvedValue(category as any)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      const id = new mongoose.Types.ObjectId().toString()
      expect(await categoriesController.findOne(request, id)).toMatchObject(
        category,
      )
    })
  })

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      categoriesService.update.mockResolvedValue(updateResult)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      const id = new mongoose.Types.ObjectId().toString()
      expect(await categoriesController.update(request, id, {})).toMatchObject(
        updateResult,
      )
    })
  })

  describe('remove', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult

      categoriesService.remove.mockResolvedValue(updateResult as any)

      const request = httpMocks.createRequest({
        user: tokenPayload,
      })

      const id = new mongoose.Types.ObjectId().toString()
      expect(await categoriesController.remove(request, id)).toMatchObject(
        updateResult,
      )
    })
  })
})
