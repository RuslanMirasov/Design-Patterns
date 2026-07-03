import { User } from "../models/User";
import { ILogger, INotificationChannel } from "../core/interfaces";

export class PushNotification implements INotificationChannel {
  constructor(private readonly logger: ILogger) {}

  send(user: User, message: string): void {
    this.logger.log(`Sending PUSH to ${user.deviceToken}`);
    console.log(`Push sent to ${user.deviceToken}: ${message}`);
  }
}
