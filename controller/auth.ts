import { Request, Response } from "express";
import authSchema from "../schema/auth";
import bcrypt from "bcryptjs";
import { generateOTPandEmail, signupAndSendEmail } from "./../util/nodeMailer";
import authOTPSchema from "../schema/authOTPSchema";

export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  // Check All input
  if (!firstName || !lastName || !email || !password) {
    res.json({
      message: "Input all user data",
      statusCode: 400,
    });
    return;
  }

  // Check If user's email is already registered.
  const existingUser = await authSchema.findOne({ email: email });
  if (existingUser) {
    res.json({
      message: "The user already exists.",
      statusCode: 400,
    });
    return;
  }

  const saltRound = 10;
  const secureHash = await bcrypt.hash(password, saltRound);

  // Create New User Account
  await authSchema.create({
    firstName: firstName,
    lastName: lastName,
    email: email,
    password: secureHash,
    verified: false,
    createdAt: Date.now(),
  });

  // Generate OTP and Send Email
  await generateOTPandEmail({ firstName, lastName, email, saltRound });

  res.json({
    message: "OTP Sent Email",
    statusCode: 200,
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  const { verifyOTPInput, email } = req.body;

  // Validation OTP and Email
  if (!verifyOTPInput || !email) {
    res.json({
      message: "Please verify code and email",
      statusCode: 400,
    });
    return;
  }

  // Find and match the email that is registered in MongoDB and the email on the frontend UI.
  const authOTPResult = await authOTPSchema.findOne({ email: email });

  if (!authOTPResult) {
    res.json({
      message: "It requires an OTP for verification.",
    });
    return;
  }

  const { firstName, lastName, expiresAt, otp } = authOTPResult;

  // Expiration
  if (new Date(expiresAt).getTime() < Date.now()) {
    res.json({
      message: "Expired verfication code, please click resend button",
      statusCode: 400,
    });
    return;
  }

  // Compare the OTP that the user typed with the one from MongoDB.
  const validOTP = await bcrypt.compare(verifyOTPInput, otp);

  if (!validOTP) {
    res.json({
      message: "OTP does not match",
      statusCode: 400,
    });
    return;
  }

  // If the OTP is same, authSchema Update and delete rest in mongoDB.
  await authSchema.updateOne({ email: email, verified: true });
  await authOTPSchema.deleteOne({ email });

  await signupAndSendEmail({ email, firstName, lastName });

  res.json({
    message: "Successfully signed up",
    statusCode: 200,
  });
};

// Resend OTP
export const resendOTP = async (req: Request, res: Response) => {
  const {} = req.body;
};
