import mongoose from "mongoose";
import crypto from "crypto";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    gender: { type: String, enum: ["male", "female", "other"] },
    date_of_birth: { type: Date },
    profile_picture: { type: String },
    role: {
      type: String,
      enum: ["user", "creator", "admin"],
      default: "user",
    },
    passwordResetToken: { type: String },
    passwordResetExpires: { type: Date },
  },
  { timestamps: true }
);

// Instance method: Create password reset token
userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};

// Instance method: Clear reset token
userSchema.methods.clearResetToken = function () {
  this.passwordResetToken = undefined;
  this.passwordResetExpires = undefined;
};

// Static method: Find user by reset token
userSchema.statics.findByResetToken = async function (resetToken) {
  const hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await this.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }, // Token not expired
  });

  return user;
};

const User = mongoose.model("User", userSchema);

export default User;
