import nodemailer from "nodemailer";
import autoOTPSchema from "../schema/authOTPSchema";
import bcrypt from "bcryptjs";

export const generateOTPandEmail = async ({
  firstName,
  lastName,
  email,
  saltRound,
}) => {
  const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
  const html = `
  <p>
    <div>Hello, ${firstName} ${lastName}${firstName && lastName ? "." : ""}
    <div>Enter <span style='font-weight: bold'>${otp}</span> in the app to verify your email address and complete the signup process.</div>
    <h3>The code expires in 1 minute.</h3>
  </p>`;

  await generateEmail(email, "Verify your Email", html);
  const hashedOTP = await bcrypt.hash(otp, saltRound);

  await autoOTPSchema.create({
    firstName,
    lastName,
    email,
    otp: hashedOTP,
    createdAt: Date.now(),
    expiresAt: Date.now() + parseInt(process.env.AUTH_OTP_EXPIRED),
  });
};

export const generateEmail = async (
  email: string,
  subject: string,
  html: string
) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      service: process.env.EMAIL_SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: subject,
      html: html,
    });
    console.log("Successfully sent email");
  } catch (err) {
    console.log(err);
    console.log("Failed to send email");
  }
};

export const signupAndSendEmail = async ({ email, firstName, lastName }) => {
  const html = `
    <p>
      <h3>Welcome, ${firstName} ${lastName}${
    firstName && lastName ? "." : ""
  }</h3>
      <div>Thank you for signing up!</div>
    </p>`;

  await generateEmail(email, "Thank your for signing up", html);
};
