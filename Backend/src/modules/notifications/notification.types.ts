import { Types } from "mongoose";
import { NotificationType } from "./notification.model";

export interface CreateNotificationInput {
  recipient: Types.ObjectId | string;
  type: NotificationType;
  title: string;
  message: string;
  project?: Types.ObjectId | string;
  link?:string
}