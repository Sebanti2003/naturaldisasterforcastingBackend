import express from "express";
import {
    forgotpasswordemailsent,
  login,
  logout,
  resetPassword,
  signup,
  veerificationtokencheck,
} from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/verify-email/:userid").get(veerificationtokencheck);
router.route("/forgot-password").post(forgotpasswordemailsent);
router.route("/reset-password/:userid").post(resetPassword);

export default router;
