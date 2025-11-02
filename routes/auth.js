import express from "express";
import { login, register, logout } from "../controllers/auth.js";
import { authenticate } from "../middleware/auth.js";

const router = express.Router();

// Public routes
router.post("/login", login);
router.post("/register", register);

// Protected route (optional - logout can work without auth)
router.post("/logout", authenticate, logout);

export default router;
