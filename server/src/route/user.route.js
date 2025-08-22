import { Router } from "express";
import { userLogin, userLogout, userRegister } from "../controller/auth.controller.js";
import { verifyJswt } from "../middleware/auth.middleware.js";

const router = Router();

router.route("/register").post(userRegister)
router.route("/login").post(userLogin)

// secure route
router.route("/logout").post(verifyJswt, userLogout)

export default router;