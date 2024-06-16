import mongoose from "mongoose";

const authOTPSchema = new mongoose.Schema({
  firstName: { type: String },
  lastName: { type: String },
  email: { type: String },
  otp: { type: String },
  createdAt: { type: Date },
  expiresAt: { type: Date },
});

export default mongoose.model("AuthOTP", authOTPSchema);
