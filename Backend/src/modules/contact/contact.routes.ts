import { Router } from "express";
import { createContactController } from "./contact.controller";
import { validate } from "../../middlewares/validate.middleware"
import { createContactSchema } from "./contact.validation";

const router = Router();

router.post(
  "/",
  validate(createContactSchema),
  createContactController
);

export default router;