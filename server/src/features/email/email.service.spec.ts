import { TestBed } from '@automock/jest';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { MailerService } from '@nestjs-modules/mailer';

import { EmailService } from './email.service';

describe('EmailService', () => {
  let emailService: EmailService;

  let mailerService: MailerService;

  beforeEach(async () => {
    const { unit, unitRef } = TestBed.create(EmailService).compile();

    emailService = unit;

    mailerService = unitRef.get(MailerService);
  });

  it('should be defined', () => {
    expect(emailService).toBeDefined();
  });

  describe('welcomeEmail', () => {
    it('should', async () => {
      //
    });
  });

  describe('resetPasswordEmail', () => {
    it('should', async () => {
      //
    });
  });
});
