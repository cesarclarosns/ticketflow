import { Module } from '@nestjs/common';
import { MailerModule } from '@nestjs-modules/mailer';

import { config } from '@/config';

import { EmailService } from './email.service';

@Module({
  imports: [
    MailerModule.forRoot({
      defaults: {
        from: config.APP.SMTP_EMAIL,
      },
      transport: {
        auth: {
          pass: config.APP.SMTP_PASS,
          user: config.APP.SMTP_USER,
        },
        host: config.APP.SMTP_HOST,
        port: 587,
        secure: false,
      },
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
