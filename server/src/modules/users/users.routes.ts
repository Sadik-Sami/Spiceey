import { Router } from "express";
import { usersController } from "@/modules/users/users.controller";
import { authMiddleware } from "@/common/middlewares/auth.middleware";
import { requireRole } from "@/common/middlewares/rbac.middleware";

const router = Router();

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Admin only routes
router.get("/", requireRole(["admin", "super_admin"]), usersController.findAll);
router.post("/find", requireRole(["admin", "super_admin"]), usersController.findOne);
router.patch("/:id/role", requireRole(["admin", "super_admin"]), usersController.updateRole);
router.delete("/:id", requireRole(["super_admin"]), usersController.remove);

// Routes that can be accessed by Admin or the User themselves
// For V1 we just pass the request through. Proper authorization to ensure
// a regular user can only get/update *their own* ID should be handled in the controller/service.
// For now, these are open to authenticated users (so they can see their own profile, etc.)
router.get("/:id", usersController.getById);
router.put("/:id", usersController.update);

export default router;
