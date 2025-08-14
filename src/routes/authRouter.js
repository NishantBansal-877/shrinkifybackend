import express from "express";
import { login, signUp, otpVerification, forgetPassword } from "../controllers/authController.js";

const router = new express.Router();

router.route("/login").post(login);

router.route("/signup").post(signUp);

router.route("/otpverification").post(otpVerification);

router.route("/forgetpassword").post(forgetPassword);

export default router;
