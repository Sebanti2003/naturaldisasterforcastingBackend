import express from "express";
import { login, signup, veerificationtokencheck } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/signup").post(signup);
router.route("/login").post(login);
router.route('/verify-email/:userid').get(veerificationtokencheck);

export default router;
