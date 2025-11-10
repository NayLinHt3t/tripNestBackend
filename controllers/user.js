import User from "../models/user.js";
import bcrypt from "bcrypt";
export const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      username,
      email,
      date_of_birth,
      phone_number,
      profile_picture,
      gender,
    } = req.body;

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.password = password || user.password;
    user.date_of_birth = date_of_birth || user.date_of_birth;
    user.phone_number = phone_number || user.phone_number;
    user.profile_picture = profile_picture || user.profile_picture;
    user.gender = gender || user.gender;

    await user.save();

    res.status(200).json({
      success: true,
      message: "User profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Update user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error updating user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const deleteUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User profile deleted successfully",
    });
  } catch (error) {
    console.error("Delete user profile error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user profile",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Get all users error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};

export const deleteUserById = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
export const changePassword = async (req, res) => {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Current password and new password are required",
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({
      success: false,
      message: "Error changing password",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
};
