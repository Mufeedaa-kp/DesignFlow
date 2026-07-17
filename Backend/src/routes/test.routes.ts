import { Router } from "express";
import { protect } from "../middleware/auth.middleware";
import { authorize } from "../middleware/role.middleware";

const router = Router();

// Any logged-in user can access this
router.get("/protected", protect, (req, res) => {
  res.json({ success: true, message: "You accessed a protected route!" });
});

// Only admins can access this
router.get("/admin-only", protect, authorize("admin"), (req, res) => {
  res.json({ success: true, message: "Welcome, admin!" });
});

export default router;