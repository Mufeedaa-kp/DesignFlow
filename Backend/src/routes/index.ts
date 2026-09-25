import { Router } from "express";

import authRoute from "../modules/auth/auth.routes";
import userRoute from "../modules/users/user.routes";
import profileRoute from "../modules/profile/profile.routes";
import projectRequestRoute from "../modules/projectRequests/projectRequest.routes";
import projectRoute from "../modules/projects/project.routes";

import categoryRoute from "../modules/catalog/routes/category.routes";
import catalogItemRoute from "../modules/catalog/routes/catalogItem.routes";
import materialRoute from "../modules/catalog/routes/material.routes";
import colorThemeRoute from "../modules/catalog/routes/colorTheme.routes";

import analyticsRoute from "../modules/analytics/analytics.route";
import settingsRoute from "../modules/settings/settings.routes";

import notificationRoutes from "../modules/notifications/notification.routes"

import quotationRoutes from "../modules/quotations/routes/quotation.routes";

import moodBoardRoutes from "../modules/moodboards/moodboard.routes";

import contactRoutes from "../modules/contact/contact.routes";

const router = Router();

router.use("/auth", authRoute);

router.use("/users", userRoute);

router.use("/profile", profileRoute);

router.use("/project-requests", projectRequestRoute);

router.use("/projects", projectRoute);

router.use("/quotations", quotationRoutes);

router.use("/moodboards", moodBoardRoutes);


router.use("/catalog/categories", categoryRoute);
router.use("/catalog/items", catalogItemRoute);
router.use("/catalog/materials", materialRoute);
router.use("/catalog/color-themes", colorThemeRoute);
router.use("/notifications", notificationRoutes);

router.use("/analytics", analyticsRoute);

router.use("/settings", settingsRoute);

router.use("/contact", contactRoutes);

export default router;