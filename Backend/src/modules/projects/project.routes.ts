import { Router } from "express";
import {
  getMyProjects,
  getAllProjects,
  getProjectById,
  updateProjectStatusHandler,
  assignDesignerHandler,
  getMyAssignedProjects,
  acceptAssignmentHandler,
  rejectAssignmentHandler,
} from "./project.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateStatusSchema, assignDesignerSchema } from "./project.validation";

const router = Router();

router.get("/mine", protect, authorize("client"), getMyProjects);
router.get("/assigned", protect, authorize("designer"), getMyAssignedProjects);
router.get("/", protect, authorize("admin"), getAllProjects);
router.get(
  "/:id",
  protect,
  authorize("admin", "designer", "client"),
  getProjectById
);

router.patch(
  "/:id/status",
  protect,
  authorize("designer"),
  validate(updateStatusSchema),
  updateProjectStatusHandler
)

router.patch(
  "/:id/assign-designer",
  protect,
  authorize("admin"),
  validate(assignDesignerSchema),
  assignDesignerHandler
)

router.patch(
  "/:id/accept",
  protect,
  authorize("designer"),
  acceptAssignmentHandler
)

router.patch(
  "/:id/reject",
  protect,
  authorize("designer"),
  rejectAssignmentHandler
);

export default router;