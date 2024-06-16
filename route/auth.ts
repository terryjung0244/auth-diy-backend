import { Router } from "express";
import * as authController from "../controller/auth";

const router = Router();

// /auth/signup
router.post("/signUp", authController.signUp);
// router.post("/verifyEmail", authController.verifyEmail);
// router.post("/resendVerifyEmail", authController.resendVerifyEmail);

export default router;
