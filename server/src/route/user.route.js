import { Router } from "express";
import { changePassword, getUserProfile, sendResetOtp, sendVerifyOtp, userLogin, userLogout, userRegister, verifyEmail } from "../controller/auth.controller.js";
import { verifyJswt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)

// secure route
router.route("/logout").post(verifyJswt, userLogout)
router.route("/forgot-password").patch( changePassword)
router.route("/profile").get(verifyJswt, getUserProfile)
router.route("/send-otp").post(verifyJswt, sendVerifyOtp)
router.route("/verify-emial").post(verifyJswt, verifyEmail)
router.route("/reset-otp").post(sendResetOtp)

export default router;