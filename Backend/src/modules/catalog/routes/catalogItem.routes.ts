import { Router } from "express";

import {
  createCatalogItem,
  getCatalogItems,
  getCatalogItemById,
  updateCatalogItem,
  deleteCatalogItem,
} from "../controllers/catalogItem.controller";

import { protect } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/role.middleware";
import { upload } from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate.middleware";

import {
  createCatalogItemSchema,
  updateCatalogItemSchema,
} from "../validations/catalogItem.validation";

const router = Router();

// Create catalog item
router.post(
  "/",
  protect,
  authorize("admin"),
  upload.single("image"),
  validate(createCatalogItemSchema),
  createCatalogItem
);

// Get all catalog items
router.get("/", getCatalogItems);

// Get catalog item by ID
router.get("/:id", getCatalogItemById);

// Update catalog item
router.patch(
  "/:id",
  protect,
  authorize("admin"),
  upload.single("image"),
  validate(updateCatalogItemSchema),
  updateCatalogItem
);

// Delete catalog item
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteCatalogItem
);

export default router;