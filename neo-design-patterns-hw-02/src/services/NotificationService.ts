import { User } from "../models/User";
import { INotificationChannel } from "../core/interfaces";

export class NotificationService {
  constructor(private readonly channels: INotificationChannel[]) {}

  send(user: User, message: string): void {
    this.channels.forEach((channel) => {
      channel.send(user, message);
    });
  }
}
