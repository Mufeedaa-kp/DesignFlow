import mongoose, { Types } from "mongoose";
import { Notification } from "./notification.model";
import { CreateNotificationInput } from "./notification.types";
import { sendSSEToUser } from "./notification.sse";
import { ApiError } from "../../utils/ApiError";

export const createNotificationService = async (
  data: CreateNotificationInput
) => {
  const notification = await Notification.create(data);

  if (notification.project) {
    try {
      await notification.populate("project", "projectName");
    } catch {
      // project may be missing/unresolvable; do not fail notification creation
    }
  }

  sendSSEToUser(
    data.recipient.toString(),
    {
      type: "NOTIFICATION",
      notification,
    }
  );

  return notification;
};

export const getUserNotificationsService = async (
  userId: string,
  page = 1,
  limit = 10
) => {
  const skip = (page - 1) * limit;

  const [notifications, total] = await Promise.all([
    Notification.find({
      recipient: new Types.ObjectId(userId),
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("project", "projectName"),

    Notification.countDocuments({
      recipient: new Types.ObjectId(userId),
    }),
  ]);

  return {
    notifications,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const getUnreadNotificationCountService = async (
  userId: string
) => {
  return Notification.countDocuments({
    recipient: new Types.ObjectId(userId),
    isRead: false,
  });
};

export const markNotificationAsReadService = async (
  notificationId: string,
  userId: string
) => {
  if (!mongoose.isValidObjectId(notificationId)) {
    throw new ApiError(
      400,
      "Invalid notification ID"
    );
  }

  const notification = await Notification.findOneAndUpdate(
    {
      _id: notificationId,
      recipient: new Types.ObjectId(userId),
    },
    {
      isRead: true,
    },
    {
      new: true,
    }
  );

  if (!notification) {
    throw new ApiError(
      404,
      "Notification not found"
    );
  }

  return notification;
};

export const markAllNotificationsAsReadService = async (
  userId: string
) => {
  return Notification.updateMany(
    {
      recipient: new Types.ObjectId(userId),
      isRead: false,
    },
    {
      isRead: true,
    }
  );
};