import { Test, TestingModule } from '@nestjs/testing'
import { AuthController } from './auth.controller'
import { AuthService } from './auth.service'
import { TestBed } from '@automock/jest'

describe('AuthController', () => {
  let authController: AuthController
  let authService: jest.Mocked<AuthService>

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(AuthController).compile()
    authController = unit
    authService = unitRef.get(AuthService)
  })

  it('should be defined', () => {
    expect(authController).toBeDefined()
  })

  describe('signIn', () => {
    it('should', async () => {
      //
    })
  })

  describe('signUp', () => {
    it('should', async () => {
      //
    })
  })

  describe('signOut', () => {
    it('should', async () => {
      //
    })
  })

  describe('resetPassword', () => {
    it('should', async () => {
      //
    })
  })

  describe('resetPasswordCallback', () => {
    it('should', async () => {
      //
    })
  })

  describe('refreshTokens', () => {
    it('should', async () => {
      //
    })
  })
})
