import { User } from "../models/User";
import { ILogger, INotificationChannel } from "../core/interfaces";

export class SMSNotification implements INotificationChannel {
  constructor(private readonly logger: ILogger) {}

  send(user: User, message: string): void {
    this.logger.log(`Sending SMS to ${user.phone}`);
    console.log(`SMS sent to ${user.phone}: ${message}`);
  }
}
