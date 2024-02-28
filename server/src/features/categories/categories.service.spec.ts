import { TestBed } from '@automock/jest';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import mongoose, {
  HydratedDocument,
  Model,
  UpdateWriteOpResult,
} from 'mongoose';
import { SoftDeleteModel } from 'mongoose-delete';

import { CategoriesService } from '@/features/categories/categories.service';
import { Category } from '@/features/categories/entities/category.entity';
import { TicketsService } from '@/features/tickets/tickets.service';

import { Ticket } from '../tickets/entities/ticket.entity';
import { CreateCategoryDto } from './dto/create-category.dto';

describe('CategoriesService', () => {
  let categoriesService: CategoriesService;
  let categoryModel: jest.Mocked<Model<Category>> & SoftDeleteModel<Category>;
  let ticketModel: jest.Mocked<Model<Ticket>> & SoftDeleteModel<Ticket>;

  let ticketsService: jest.Mocked<TicketsService>;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(CategoriesService).compile();
    categoriesService = unit;
    categoryModel = unitRef.get(getModelToken(Category.name)) as any;
    ticketModel = unitRef.get(getModelToken(Ticket.name)) as any;

    ticketsService = unitRef.get(TicketsService);
  });

  it('should be defined', () => {
    expect(categoriesService).toBeDefined();
  });

  describe('create', () => {
    it('should return a created category', async () => {
      const createCategoryDto = { categoryName: 'A' } as CreateCategoryDto;

      categoryModel.create.mockResolvedValue(createCategoryDto as any);

      expect(await categoriesService.create(createCategoryDto)).toMatchObject(
        createCategoryDto,
      );
    });
  });

  describe('findAll', () => {
    it('should return a list of categories', async () => {
      const categories = [
        { categoryName: 'A' },
        { categoryName: 'B' },
      ] as HydratedDocument<Category>[];

      categoryModel.find.mockImplementation(
        () =>
          ({
            sort: () =>
              ({
                collation: () => categories,
              } as any),
          } as any),
      );

      expect(
        await categoriesService.findAll({ sort: 'categoryName', userId: '' }),
      ).toMatchObject(categories);
    });
  });

  describe('findOne', () => {
    it('should return a category', async () => {
      const category = { categoryName: 'A' } as HydratedDocument<Category>;

      categoryModel.findOne.mockResolvedValue(category as any);

      expect(
        await categoriesService.findOne({ categoryId: '', userId: '' }),
      ).toMatchObject(category);
    });
  });

  describe('update', () => {
    it('should return the update result', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult;

      categoryModel.updateOne.mockResolvedValue(updateResult);

      const id = new mongoose.Types.ObjectId().toString();
      expect(
        await categoriesService.update({ categoryId: id, userId: '' }, {}),
      ).toMatchObject(updateResult);
    });
  });

  describe('remove', () => {
    it('should return the update result if there is NOT an associated ticket to the category', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult;

      jest
        .spyOn(categoryModel, 'delete')
        .mockResolvedValue(updateResult as any);

      ticketModel.findOne.mockResolvedValue(null);

      const id = new mongoose.Types.ObjectId().toString();
      expect(
        await categoriesService.remove({ categoryId: id, userId: id }),
      ).toMatchObject(updateResult);
    });

    it('should throw error if there is an associated ticket to the category', async () => {
      const updateResult = { acknowledged: true } as UpdateWriteOpResult;

      jest
        .spyOn(categoryModel, 'delete')
        .mockResolvedValue(updateResult as any);

      ticketModel.findOne.mockResolvedValue({} as any);

      const id = new mongoose.Types.ObjectId().toString();

      try {
        await categoriesService.remove({ categoryId: id, userId: id });
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestException);
      }
    });
  });
});
