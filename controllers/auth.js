import User from "../models/user.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt.js";
import { sendPasswordResetEmail } from "../utils/passwordResetEmail.js";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // 2. Find user by email (case-insensitive)
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 3. Compare password with hashed password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // 4. Generate JWT token
    const token = generateToken(user);

    // 5. Prepare user response (exclude password)
    const userResponse = {
      id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    // 6. Send successful response
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: userResponse,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Error during login",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const register = async (req, res) => {
  try {
    const {
      username,
      password,
      email,
      role,
      date_of_birth,
      phone_number,
      profile_picture,
      gender,
    } = req.body;

    // 1. Validate required fields
    if (!username || !password || !email || !phone_number) {
      return res.status(400).json({
        success: false,
        message: "Username, email, and password are required",
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    // 3. Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters long",
      });
    }

    // 4. Validate role if provided
    const allowedRoles = ["user", "creator", "admin"];
    const userRole = role || "user"; // Default to 'user' if not provided

    if (!allowedRoles.includes(userRole)) {
      return res.status(400).json({
        success: false,
        message: `Invalid role. Allowed roles: ${allowedRoles.join(", ")}`,
      });
    }

    // 5. Check if user already exists (email or username)
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username }, { phone_number }],
    });

    if (existingUser) {
      const field =
        existingUser.email === email.toLowerCase()
          ? "Email"
          : existingUser.username === username
          ? "Username"
          : "Phone number";
      return res.status(409).json({
        success: false,
        message: `${field} already exists`,
      });
    }

    // 6. Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // 7. Create new user
    const newUser = new User({
      username,
      password: hashedPassword,
      email: email.toLowerCase(),
      phone_number,
      date_of_birth,
      profile_picture,
      gender,

      role: userRole,
    });

    // 8. Save user to database
    await newUser.save();

    // 9. Return success response (exclude password)
    const userResponse = {
      id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      phone_number: newUser.phone_number,
      date_of_birth: newUser.date_of_birth,
      profile_picture: newUser.profile_picture,
      gender: newUser.gender,
      role: newUser.role,
      createdAt: newUser.createdAt,
    };

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: userResponse,
    });
  } catch (error) {
    console.error("Registration error:", error);

    // Handle mongoose validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: messages,
      });
    }

    // Handle duplicate key errors (MongoDB)
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(409).json({
        success: false,
        message: `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } already exists`,
      });
    }

    // Generic error response
    res.status(500).json({
      success: false,
      message: "Error registering user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const logout = (req, res) => {
  // Since we're using JWT (stateless authentication), logout is handled client-side
  // The client should remove the token from storage (localStorage, cookies, etc.)

  // Optional: You can implement token blacklisting here if needed
  // For now, we just send a success response

  res.status(200).json({
    success: true,
    message: "Logout successful. Please remove the token from client storage.",
  });
};

export const forgotPassword = async (req, res) => {
  // Implementation for forgot password functionality
  const { email } = req.body;

  // Check if email is provided
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Check if user exists
  const user = await User.findOne({ email: email.toLowerCase() });
  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  // Generate password reset token (implement your own logic)
  const resetToken = user.generateResetToken();

  // Send password reset email (implement your own email sending logic)
  await sendPasswordResetEmail(user.email, resetToken);

  res.status(200).json({
    success: true,
    message: "Password reset email sent",
  });
};

export const resetPassword = async (req, res) => {
  // Implementation for reset password functionality
  const { resetToken, newPassword } = req.body;

  // Check if required fields are provided
  if (!resetToken || !newPassword) {
    return res.status(400).json({
      success: false,
      message: "Reset token and new password are required",
    });
  }

  // Find user by reset token (implement your own logic)
  const user = await User.findByResetToken(resetToken);
  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid or expired reset token",
    });
  }

  // Update user's password
  const saltRounds = 10;
  user.password = await bcrypt.hash(newPassword, saltRounds);
  user.clearResetToken(); // Clear the reset token (implement your own logic)
  await user.save();

  res.status(200).json({
    success: true,
    message: "Password has been reset successfully",
  });
};
