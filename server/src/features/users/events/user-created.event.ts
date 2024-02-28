export class UserCreatedEvent {
  email: string;

  constructor(event: { email: string }) {
    this.email = event.email;
  }
}
