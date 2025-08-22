import { Router } from "express";
import { userRegister } from "../controller/auth.controller.js";

const router = Router();

router.post("/register", userRegister)

export default router;