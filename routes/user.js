import express from "express";
import { authenticate } from "../middleware/auth.js";
import { authorize } from "../middleware/auth.js";
import {
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
  deleteUserById,
  changePassword,
} from "../controllers/user.js";
const router = express.Router();

//User profile routes
router.get("/profile", authenticate, getUserProfile);
router.put("/profile", authenticate, updateUserProfile);
router.delete("/profile", authenticate, deleteUserProfile);

//Admin routes
router.get("/", authenticate, authorize("admin"), getAllUsers);
router.delete("/:userId", authenticate, authorize("admin"), deleteUserById);

router.put("/change-password", authenticate, changePassword);

export default router;
