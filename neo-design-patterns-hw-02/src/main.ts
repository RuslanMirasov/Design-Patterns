import { User } from "./models/User";
import { Logger } from "./services/Logger";
import { EmailNotification } from "./services/EmailNotification";
import { SMSNotification } from "./services/SMSNotification";
import { PushNotification } from "./services/PushNotification";
import { NotificationService } from "./services/NotificationService";

const user = new User(
  "example@email.com",
  "+380123456789",
  "device-token-abc"
);

const logger = new Logger();

const emailNotification = new EmailNotification(logger);
const smsNotification = new SMSNotification(logger);
const pushNotification = new PushNotification(logger);

const notificationService = new NotificationService([
  emailNotification,
  smsNotification,
  pushNotification,
]);

notificationService.send(user, "Ваш платіж оброблено успішно!");
