import { User } from '../models/User';

export interface ILogger {
    log(message: string): void;
}

export interface INotificationChannel {
    send(user: User, message: string): void;
}
