import express from "express";
import {
  login,
  register,
  logout,
  forgotPassword,
  resetPassword,
} from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected route (optional - logout can work without auth)
router.post("/logout", authenticate, logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
