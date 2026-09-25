import { Router } from "express";
import multer from "multer";

import {
  addMoodBoardVersion,
  approveMoodBoard,
  createMoodBoard,
  getClientMoodBoard,
  getClientMoodBoards,
  getAdminMoodBoard,
  getDesignerMoodBoard,
  getDesignerMoodBoards,
  requestMoodBoardChanges,
  submitMoodBoard,
} from "./moodboard.controller";

import { protect } from "../../middlewares/auth.middleware";
import { authorize } from "../../middlewares/role.middleware";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 10 * 1024 * 1024,
  },

  fileFilter: (_req, file, cb) => {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
      return;
    }

    cb(
      new Error(
        "Only JPG, JPEG, PNG, WEBP, and PDF files are allowed"
      )
    );
  },
});


router.get(
  "/designer",
  protect,
  authorize("designer"),
  getDesignerMoodBoards
);


router.get(
  "/client",
  protect,
  authorize("client"),
  getClientMoodBoards
);



router.post(
  "/",
  protect,
  authorize("designer"),
  upload.array("files", 10),
  createMoodBoard
);


router.get(
  "/designer/:projectId",
  protect,
  authorize("designer"),
  getDesignerMoodBoard
);


router.get(
  "/client/:projectId",
  protect,
  authorize("client"),
  getClientMoodBoard
);


router.post(
  "/:projectId/versions",
  protect,
  authorize("designer"),
  upload.array("files", 10),
  addMoodBoardVersion
);


router.patch(
  "/:projectId/submit",
  protect,
  authorize("designer"),
  submitMoodBoard
);

router.get(
  "/admin/:projectId",
  protect,
  authorize("admin"),
  getAdminMoodBoard
);


router.patch(
  "/:projectId/request-changes",
  protect,
  authorize("client"),
  upload.array("files", 5),
  requestMoodBoardChanges
);


router.patch(
  "/:projectId/approve",
  protect,
  authorize("client"),
  approveMoodBoard
);

export default router;