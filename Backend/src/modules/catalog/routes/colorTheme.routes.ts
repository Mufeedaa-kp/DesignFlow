import { Router } from "express";

import {
  createColorTheme,
  getColorThemes,
  getColorThemeById,
  updateColorTheme,
  deleteColorTheme,
} from "../controllers/colorTheme.controller";

import { protect } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/role.middleware";
import { upload } from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate.middleware";

import {
  createColorThemeSchema,
  updateColorThemeSchema,
} from "../validations/colorTheme.validation";

const router = Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  validate(createColorThemeSchema),
  createColorTheme
);

router.get("/", getColorThemes);

router.get("/:id", getColorThemeById);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  validate(updateColorThemeSchema),
  updateColorTheme
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteColorTheme
);

export default router;