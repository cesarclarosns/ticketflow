import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { MailerService } from '@nestjs-modules/mailer';
import { renderAsync } from '@react-email/render';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

import { UserCreatedEvent, USERS_EVENTS } from '@/features/users/events';

import { AUTH_EVENTS, ResetPasswordEvent } from '../auth/events';
import { ResetPasswordEmail, WelcomeEmail } from './templates';

@Injectable()
export class EmailService {
  constructor(
    private mailerService: MailerService,
    @InjectPinoLogger(EmailService.name) private readonly logger: PinoLogger,
  ) {}

  @OnEvent(USERS_EVENTS.UserCreated)
  async handleSignUp(event: UserCreatedEvent) {
    this.logger.trace('Sending welcome email');
    this.logger.debug(event);

    const html = await renderAsync(WelcomeEmail({ email: event.email }));
    await this.mailerService.sendMail({
      html,
      subject: `👋 Welcome to TicketFlow!`,
      to: event.email,
    });
  }

  @OnEvent(AUTH_EVENTS.ResetPassword)
  async handleResetPassword(event: ResetPasswordEvent) {
    this.logger.trace('Sending reset password email');
    this.logger.debug(event);

    const html = await renderAsync(
      ResetPasswordEmail({
        email: event.email,
        resetPasswordLink: event.resetPasswordLink,
      }),
    );
    await this.mailerService.sendMail({
      html,
      subject: `Reset your TicketFlow password`,
      to: event.email,
    });
  }
}
