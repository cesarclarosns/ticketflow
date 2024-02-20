export class UserResetPasswordEvent {
  email: string
  resetPasswordLink: string

  constructor(event: { email: string; resetPasswordLink: string }) {
    this.email = event.email
    this.resetPasswordLink = event.resetPasswordLink
  }
}
