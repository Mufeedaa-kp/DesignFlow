import { Router } from "express";
import { getOverview } from "./analytics.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

router.get("/overview", protect, authorize("admin"), getOverview);

export default router;