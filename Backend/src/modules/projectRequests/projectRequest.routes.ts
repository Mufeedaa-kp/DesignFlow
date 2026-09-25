import { Router } from "express";

import {
  uploadImage,
  createProjectRequest,
  getMyProjectRequests,
  getAllProjectRequests,
  getProjectRequestById,
  approveProjectRequest,
  rejectProjectRequest,
} from "./projectRequest.controller";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { upload } from "../../middlewares/upload.middleware";

import {
  createProjectRequestValidation,
  rejectProjectRequestValidation,
} from "./projectRequest.validation";

const router = Router();

/*
 * Client image upload
 */
router.post(
  "/upload-image",
  protect,
  authorize("client"),
  upload.single("image"),
  uploadImage
);

/*
 * Create project request
 */
router.post(
  "/",
  protect,
  authorize("client"),
  validate(createProjectRequestValidation),
  createProjectRequest
);

/*
 * Client's own requests
 *
 * Supports:
 * ?page=1
 * ?limit=9
 * ?search=kitchen
 * ?status=pending
 */
router.get(
  "/mine",
  protect,
  authorize("client"),
  getMyProjectRequests
);

/*
 * Admin - all requests
 */
router.get(
  "/",
  protect,
  authorize("admin"),
  getAllProjectRequests
);

/*
 * Request details
 *
 * Both admin and client can access.
 *
 * Backend service makes sure a client
 * can only access their own request.
 */
router.get(
  "/:id",
  protect,
  authorize("admin", "client"),
  getProjectRequestById
);

/*
 * Admin - approve
 */
router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveProjectRequest
);

/*
 * Admin - reject
 */
router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  validate(rejectProjectRequestValidation),
  rejectProjectRequest
);

export default router;