import { Injectable } from '@nestjs/common'
import { MailerService } from '@nestjs-modules/mailer'
import { OnEvent } from '@nestjs/event-emitter'
import {
  USERS_EVENTS,
  UserRegisteredEvent,
  UserResetPasswordEvent,
} from '@features/users/events'
import { renderAsync } from '@react-email/render'
import { ResetPasswordEmail, WelcomeEmail } from './templates'

@Injectable()
export class EmailService {
  constructor(private mailerService: MailerService) {}

  @OnEvent(USERS_EVENTS.userRegistered)
  async welcomeEmail(event: UserRegisteredEvent) {
    const html = await renderAsync(WelcomeEmail({ email: event.email }))
    await this.mailerService.sendMail({
      to: event.email,
      subject: `👋 Welcome to Enroudesk!`,
      html,
    })
  }

  @OnEvent(USERS_EVENTS.userResetPassword)
  async resetPasswordEmail(event: UserResetPasswordEvent) {
    const html = await renderAsync(
      ResetPasswordEmail({
        email: event.email,
        resetPasswordLink: event.resetPasswordLink,
      }),
    )
    await this.mailerService.sendMail({
      to: event.email,
      subject: `Reset your Enroudesk password`,
      html,
    })
  }
}
