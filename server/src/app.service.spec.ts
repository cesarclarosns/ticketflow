import { TestBed } from '@automock/jest';

import { AppService } from './app.service';

describe('AppService', () => {
  let appService: AppService;

  beforeEach(async () => {
    const { unit } = TestBed.create(AppService).compile();
    appService = unit;
  });

  it('should be defined', () => {
    expect(appService).toBeDefined();
  });
});
