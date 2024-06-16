import { Request, Response } from "express";
import authSchema from "../schema/auth";
import bcrypt from "bcryptjs";
import { generateOTPandEmail } from "./../util/nodeMailer";

export const signUp = async (req: Request, res: Response) => {
  const { firstName, lastName, email, password } = req.body;

  // Check All input
  if (!firstName || !lastName || !email || !password) {
    res.json({
      message: "Please type all user's information",
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
    message: "Sent Email",
    statusCode: 200,
  });
};

export const verifyEmail = async (req: Request, res: Response) => {
  console.log(req.body);
  // const { verifyOTPInput, email } = req.body;
  // console.log(verifyOTPInput, email);

  // if (!verifyOTPInput || !email) {
  //   res.json({
  //     message: "Please verify code and email",
  //     statusCode: 400,
  //   });
  //   return;
  // }
};
