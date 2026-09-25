import { Router } from "express";
import { getMyProfile, updateMyProfile, uploadProfileImage } from "./profile.controller";
import { protect } from "../../middlewares/auth.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { upload } from "../../middlewares/upload.middleware";
import { updateMyProfileValidation } from "./profile.validation";
 
const router = Router();
 
router.get("/me", protect, getMyProfile);
router.patch("/me", protect, validate(updateMyProfileValidation), updateMyProfile);
router.post("/upload-image", protect, upload.single("image"), uploadProfileImage);
 
export default router;