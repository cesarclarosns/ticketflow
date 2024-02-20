export class UserRegisteredEvent {
  email: string

  constructor(event: { email: string }) {
    this.email = event.email
  }
}
