import { Router } from "express";
import { getAllUsers, getUserById, createUser, updateUserProfile, updateUserStatus, deleteUser, getMyClients, getMyClientById } from "./user.controller";
import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";
import { validate } from "../../middlewares/validate.middleware";
import { createUserValidation, updateUserProfileValidation, updateUserStatusValidation } from "./user.validation";

const router = Router();

router.get("/", protect, authorize("admin"), getAllUsers)
router.get("/my-clients", protect, authorize("designer"), getMyClients)
router.get("/my-clients/:id", protect, authorize("designer"), getMyClientById)

router.get("/:id", protect, authorize("admin"), getUserById)
router.post("/", protect, authorize("admin"), validate(createUserValidation), createUser)
router.patch("/:id", protect, validate(updateUserProfileValidation), updateUserProfile)
router.patch("/:id/status", protect, authorize("admin"), validate(updateUserStatusValidation), updateUserStatus)
router.delete("/:id", protect, authorize("admin"), deleteUser)

export default router;