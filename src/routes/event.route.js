import express from "express";
import { getevents } from "../controllers/events.controller.js";

const router = express.Router();

router.route("/getevents").get(getevents);

export default router;
