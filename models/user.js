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
  },
  { timestamps: true }
);

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
  return resetToken;
};
const User = mongoose.model("User", userSchema);

export default User;
