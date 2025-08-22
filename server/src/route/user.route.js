import { Router } from "express";
import { changePassword, getUserProfile, userLogin, userLogout, userRegister } from "../controller/auth.controller.js";
import { verifyJswt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)

// secure route
router.route("/logout").post(verifyJswt, userLogout)
router.route("/forgot-password").patch(verifyJswt, changePassword)
router.route("/profile").get(verifyJswt, getUserProfile)

export default router;