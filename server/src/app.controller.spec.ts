import { TestBed } from '@automock/jest'
import { AppController } from '@app/app.controller'

describe('AppController', () => {
  let appController: AppController

  beforeEach(async () => {
    const { unit } = TestBed.create(AppController).compile()
    appController = unit
  })

  it('should be defined', () => {
    expect(appController).toBeDefined()
  })
})
