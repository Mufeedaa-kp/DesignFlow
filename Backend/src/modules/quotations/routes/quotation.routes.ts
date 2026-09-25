import { Router } from "express";

import { protect } from "../../../middlewares/auth.middleware"
import { validate } from "../../../middlewares/validate.middleware"
import { authorize } from "../../../middlewares/role.middleware"

import {
  createQuotation,
  getDesignerQuotations,
  getQuotationByProject,
  updateQuotation,
  submitQuotationForApproval,
  approveQuotation,
  rejectQuotation,
  acceptQuotation,
  rejectQuotationByClient,
  downloadQuotation
} from "../controllers/quotation.controller"

import {
  createQuotationValidation,
  updateQuotationValidation,
  rejectQuotationValidation,
  rejectQuotationByClientValidation,
} from "../validation/quotation.validation"

const router = Router()

//designer

router.post(
  "/",
  protect,
  authorize("designer"),
  validate(createQuotationValidation),
  createQuotation
)

router.get(
  "/designer",
  protect,
  authorize("designer"),
  getDesignerQuotations
)

router.patch(
  "/:id",
  protect,
  authorize("designer"),
  validate(updateQuotationValidation),
  updateQuotation
)

router.patch(
  "/:id/submit",
  protect,
  authorize("designer"),
  submitQuotationForApproval
)

//admin

router.patch(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveQuotation
)

router.patch(
  "/:id/reject",
  protect,
  authorize("admin"),
  validate(rejectQuotationValidation),
  rejectQuotation
);


//client


router.patch(
  "/:id/accept",
  protect,
  authorize("client"),
  acceptQuotation
);

router.patch(
  "/:id/client-reject",
  protect,
  authorize("client"),
  validate(rejectQuotationByClientValidation),
  rejectQuotationByClient
);


//all


router.get(
  "/project/:projectId",
  protect,
  authorize(
    "admin",
    "designer",
    "client"
  ),
  getQuotationByProject
);


router.get(
  "/:id/download",
  protect,
  authorize(
    "admin",
    "designer",
    "client"
  ),
  downloadQuotation
);

router.get(
  "/project/:projectId",
  protect,
  authorize(
    "admin",
    "designer",
    "client"
  ),
  getQuotationByProject
);

export default router;