import { Router } from "express";

import {
  createMaterial,
  getMaterials,
  getMaterialById,
  updateMaterial,
  deleteMaterial,
} from "../controllers/material.controller";

import { protect } from "../../../middlewares/auth.middleware";
import { authorize } from "../../../middlewares/role.middleware";
import { upload } from "../../../middlewares/upload.middleware";
import { validate } from "../../../middlewares/validate.middleware";

import {
  createMaterialSchema,
  updateMaterialSchema,
} from "../validations/material.validation";

const router = Router();

router.post(
  "/",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  validate(createMaterialSchema),
  createMaterial
);

router.get("/", getMaterials);

router.get("/:id", getMaterialById);

router.patch(
  "/:id",
  protect,
  authorize("admin"),
  upload.array("images", 5),
  validate(updateMaterialSchema),
  updateMaterial
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteMaterial
);

export default router;