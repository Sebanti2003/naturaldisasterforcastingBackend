import express from "express";
import { deletalleuser, getallusers } from "../controllers/admin.controller.js";

const router = express.Router();

router.route("/getallusers").get(getallusers);
router.route("/deleteallusers").delete(deletalleuser);

export default router;
