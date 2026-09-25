import { Router } from "express";
import { getSettings, updateSettings } from "./settings.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { updateSettingsValidation } from "./settings.validation";

const router = Router();

router.get("/", protect, authorize("admin"), getSettings);
router.patch("/", protect, authorize("admin"), validate(updateSettingsValidation), updateSettings);

export default router;