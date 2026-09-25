import { Router } from "express";

import {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller";

import { protect } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/role.middleware";
import { upload } from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate.middleware";

import {
  createCategorySchema,
  updateCategorySchema,
} from "../validations/category.validation";

const router = Router();

// Create category
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  validate(createCategorySchema),
  createCategory
);

// Get all categories
router.get("/", getCategories);

// Get category by ID
router.get("/:id", getCategoryById);

// Update category
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  validate(updateCategorySchema),
  updateCategory
);

// Delete category
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCategory
);

export default router;