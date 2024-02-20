import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CONFIG_VALUES } from '@config/config'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>(CONFIG_VALUES.app.smtpHost),
          port: 587,
          secure: false,
          auth: {
            user: configService.getOrThrow<string>(CONFIG_VALUES.app.smtpUser),
            pass: configService.getOrThrow<string>(CONFIG_VALUES.app.smtpPass),
          },
        },
        defaults: {
          from: configService.getOrThrow<string>(CONFIG_VALUES.app.smtpEmail),
        },
        // template: {
        //   dir: join(__dirname, 'templates'),
        //   adapter: new EjsAdapter(),
        //   options: {
        //     strict: true,
        //   },
        // },
      }),
    }),
  ],
  providers: [EmailService],
})
export class EmailModule {}
