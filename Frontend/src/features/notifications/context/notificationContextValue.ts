import { createContext } from "react";

export interface Notification {
  _id: string;
  type: string;
  title: string;
  message: string;
  project?: {
    _id: string;
    projectName: string;
  };
  link?:string,
  isRead: boolean;
  createdAt: string;
}

export interface NotificationContextType {
  latestNotification: Notification | null;
  clearLatestNotification: () => void;
}

export const NotificationContext =
  createContext<NotificationContextType | undefined>(
    undefined
  );