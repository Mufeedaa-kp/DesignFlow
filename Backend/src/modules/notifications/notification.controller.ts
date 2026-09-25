import { Request, Response } from "express";
import {
  getUserNotificationsService,
  getUnreadNotificationCountService,
  markAllNotificationsAsReadService,
  markNotificationAsReadService,
} from "./notification.service";
import { ApiResponse } from "../../utils/ApiResponse";
import { AuthRequest } from "../../middlewares/auth.middleware";
import { addSSEClient } from "./notification.sse";

export const getMyNotifications = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const result = await getUserNotificationsService(
    userId.toString(),
    page,
    limit
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Notifications fetched successfully",
      result
    )
  );
};

export const getUnreadNotificationCount = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;

  const count = await getUnreadNotificationCountService(
    userId.toString()
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Unread notification count fetched successfully",
       { count },
    )
  );
};

export const markNotificationAsRead = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;

  const notification = await markNotificationAsReadService(
    req.params.id as string,
    userId.toString()
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "Notification marked as read",
      notification,
    )
  );
};

export const markAllNotificationsAsRead = async (
  req: Request,
  res: Response
) => {
  const userId = req.user.id;

  await markAllNotificationsAsReadService(
    userId.toString()
  );

  return res.status(200).json(
    new ApiResponse(
      200,
      "All notifications marked as read",
      null,
    )
  );
};

export const notificationStream = (
  req: AuthRequest,
  res: Response
) => {
  const userId = req.user.id;

  res.setHeader(
    "Content-Type",
    "text/event-stream"
  );

  res.setHeader(
    "Cache-Control",
    "no-cache"
  );

  res.setHeader(
    "Connection",
    "keep-alive"
  );

  res.flushHeaders();

  res.write(
    `data: ${JSON.stringify({
      type: "CONNECTED",
      message: "Notification stream connected",
    })}\n\n`
  );

  addSSEClient(userId, res);
}