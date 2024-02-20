import { Test, TestingModule } from '@nestjs/testing'
import { ConfigModule } from '@nestjs/config'
import { TestBed } from '@automock/jest'
import { EmailService } from './email.service'
import { MailerService } from '@nestjs-modules/mailer'

describe('EmailService', () => {
  let emailService: EmailService

  let mailerService: MailerService

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(EmailService).compile()

    emailService = unit

    mailerService = unitRef.get(MailerService)
  })

  it('should be defined', () => {
    expect(emailService).toBeDefined()
  })

  describe('welcomeEmail', () => {
    it('should', async () => {
      //
    })
  })

  describe('resetPasswordEmail', () => {
    it('should', async () => {
      //
    })
  })
})
