import express from "express";
import { getuserinfo } from "../controllers/user.controller.js";
import { sessionProtected } from "../middlewares/cookieprotected.middleware.js";
// import { login, signup, veerificationtokencheck } from "../controllers/auth.controller.js";

const router = express.Router();

router.route("/me").get(sessionProtected, getuserinfo);

export default router;
