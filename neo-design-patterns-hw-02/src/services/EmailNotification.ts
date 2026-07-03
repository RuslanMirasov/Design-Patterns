import { User } from "../models/User";
import { ILogger, INotificationChannel } from "../core/interfaces";

export class EmailNotification implements INotificationChannel {
  constructor(private readonly logger: ILogger) {}

  send(user: User, message: string): void {
    this.logger.log(`Sending EMAIL to ${user.email}`);
    console.log(`Email sent to ${user.email}: ${message}`);
  }
}
