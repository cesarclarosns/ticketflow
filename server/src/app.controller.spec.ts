import { AppController } from '@app/app.controller';
import { TestBed } from '@automock/jest';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const { unit } = TestBed.create(AppController).compile();
    appController = unit;
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });
});
