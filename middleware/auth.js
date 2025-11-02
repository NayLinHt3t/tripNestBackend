import { verifyToken } from "../utils/jwt.js";
import User from "../models/user.js";

// Authentication middleware - Verifies JWT token
export const authenticate = async (req, res, next) => {
  try {
    // Get token from Authorization header (Bearer token)
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authentication required. No token provided.",
      });
    }

    // Extract token (remove "Bearer " prefix)
    const token = authHeader.substring(7);

    // Verify token
    const decoded = verifyToken(token);

    // Fetch user from database using the ID from token
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found. Invalid token.",
      });
    }

    // Attach user info to request object
    req.user = {
      id: user._id.toString(),
      email: user.email,
      username: user.username,
      role: user.role,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// Role-based authorization middleware
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Insufficient permissions.",
      });
    }

    next();
  };
};

// Check if user is the owner of the resource or has admin/creator privileges
export const checkOwnership = (resourceUserIdField = "userId") => {
  return (req, res, next) => {
    const resourceUserId =
      req.params[resourceUserIdField] || req.body[resourceUserIdField];

    // Admins can access everything
    if (req.user.role === "admin") {
      return next();
    }

    // Check if user is the owner
    if (req.user.id !== resourceUserId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You can only access your own resources.",
      });
    }

    next();
  };
};
