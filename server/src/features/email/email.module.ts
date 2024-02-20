import { Module } from '@nestjs/common'
import { EmailService } from './email.service'
import { MailerModule } from '@nestjs-modules/mailer'
import { join } from 'path'
import { EjsAdapter } from '@nestjs-modules/mailer/dist/adapters/ejs.adapter'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { CONFIG_VALUES } from '@app/config/configuration'

@Module({
  imports: [
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        transport: {
          host: configService.getOrThrow<string>(CONFIG_VALUES.APP.SMTP_HOST),
          port: 587,
          secure: false,
          auth: {
            user: configService.getOrThrow<string>(CONFIG_VALUES.APP.SMTP_USER),
            pass: configService.getOrThrow<string>(CONFIG_VALUES.APP.SMTP_PASS),
          },
        },
        defaults: {
          from: configService.getOrThrow<string>(CONFIG_VALUES.APP.SMTP_EMAIL),
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
