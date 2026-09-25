import { Router } from "express";
import { protect } from "../../middlewares/auth.middleware";
import {
  getMyNotifications,
  getUnreadNotificationCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  notificationStream
} from "./notification.controller";

const router = Router();

router.use(protect);

router.get("/", getMyNotifications);

router.get(
  "/unread-count",
  getUnreadNotificationCount
);

router.get(
  "/stream",
  notificationStream
);

router.patch(
  "/:id/read",
  markNotificationAsRead
);

router.patch(
  "/read-all",
  markAllNotificationsAsRead
);



export default router;